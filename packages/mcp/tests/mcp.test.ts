import { spawnSync } from "node:child_process";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  UnifyPortApiError,
  UnifyPortDeviceClient,
  UnifyPortConfigurationError,
  deviceOperations,
  type OperationMetadata,
  type UnifyPortFetch
} from "@unifyport/sdk-node";
import { describe, expect, it, vi } from "vitest";

import { configFromEnvironment } from "../src/config.js";
import { closeMcpInputSchema, createToolRegistry, safeToolError } from "../src/registry.js";
import { createMcpServer } from "../src/server.js";

function workspaceResponse(status = 200): Response {
  if (status !== 200) {
    return new Response(
      JSON.stringify({ error: { code: "UPSTREAM_FAILED", message: "hidden detail" } }),
      { status, headers: { "content-type": "application/json" } }
    );
  }
  return new Response(
    '{"request_id":"req_mcp","data":{"name":"Demo","status":"active","account_quota":9007199254740993,"account_quota_unlimited":false}}',
    { status: 200, headers: { "content-type": "application/json" } }
  );
}

function jsonResponse(value: unknown, status = 200): Response {
  // 测试统一走真实 JSON Response，覆盖 SDK buffering 与 MCP projection 的组合边界。
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function deviceClient(
  fetch: UnifyPortFetch = async () => workspaceResponse()
): UnifyPortDeviceClient {
  return new UnifyPortDeviceClient({
    baseUrl: "https://device.example.com",
    apiKey: "test-key",
    fetch
  });
}

const allMetadata: readonly OperationMetadata[] = Object.values(deviceOperations);

describe("MCP environment configuration", () => {
  it("keeps CLI stdout clean and redacts startup errors", () => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "packages/mcp/src/cli.ts"], {
      cwd: process.cwd(),
      // 空环境稳定触发配置失败，也证明日志不依赖或回显环境值。
      env: {},
      encoding: "utf8"
    });
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.trim()).toBe("[mcp] fatal startup error kind=configuration");
  });

  it("requires the Device API credential pair", () => {
    expect(() => configFromEnvironment({})).toThrow(UnifyPortConfigurationError);
    expect(() =>
      configFromEnvironment({ UNIFYPORT_DEVICE_API_BASE_URL: "https://device.example.com" })
    ).toThrow("必须同时配置");
  });

  it("treats unknown permission values as false and couples destructive to writes", () => {
    const restricted = configFromEnvironment({
      UNIFYPORT_DEVICE_API_BASE_URL: "https://device.example.com",
      UNIFYPORT_DEVICE_API_KEY: "key",
      UNIFYPORT_MCP_ENABLE_WRITES: "TRUE",
      UNIFYPORT_MCP_ENABLE_DESTRUCTIVE: "true"
    });
    expect(restricted.permissions).toEqual({
      enableWrites: false,
      enableDestructive: false
    });

    const expanded = configFromEnvironment({
      UNIFYPORT_DEVICE_API_BASE_URL: "https://device.example.com",
      UNIFYPORT_DEVICE_API_KEY: "key",
      UNIFYPORT_MCP_ENABLE_WRITES: "true",
      UNIFYPORT_MCP_ENABLE_DESTRUCTIVE: "true",
      UNIFYPORT_ALLOW_INSECURE_HTTP: "false"
    });
    expect(expanded.permissions).toEqual({ enableWrites: true, enableDestructive: true });
    expect(expanded.device.apiKey).toBe("key");
  });
});

describe("operation registry policy", () => {
  it("deep-closes supported input schema shapes and rejects ambiguous shapes", () => {
    const closed = closeMcpInputSchema({
      type: "object",
      properties: {
        array: {
          type: "array",
          items: { type: "object", properties: { value: { type: "string" } } },
          contains: { type: "object", properties: { value: { type: "string" } } }
        },
        union: {
          anyOf: [{ type: "object", properties: { left: { type: "string" } } }, { type: "string" }]
        },
        choice: {
          oneOf: [{ type: "object", properties: { right: { type: "string" } } }, { type: "number" }]
        },
        tuple: {
          type: "array",
          prefixItems: [{ type: "object", properties: { item: { type: "string" } } }]
        }
      },
      definitions: {
        LegacyObject: { type: "object", properties: { id: { type: "string" } } }
      }
    });
    // 每个明确 object 都采用同一 closed-world 语义，避免 client schema 与 projector 漂移。
    expect(JSON.stringify(closed).match(/"additionalProperties":false/gu)).toHaveLength(7);

    for (const unsupported of [
      { type: "object", allOf: [] },
      { type: ["object", "null"] },
      { type: "object", properties: [] },
      { type: "array", items: true },
      { type: "string", anyOf: {} },
      { type: "string", oneOf: [true] },
      { type: "object", $defs: { Invalid: true } }
    ]) {
      expect(() => closeMcpInputSchema(unsupported)).toThrow("MCP");
    }

    let tooDeep: Record<string, unknown> = { type: "object" };
    for (let depth = 0; depth <= 40; depth += 1) {
      tooDeep = { type: "array", items: tooDeep };
    }
    expect(() => closeMcpInputSchema(tooDeep)).toThrow("depth");
  });

  it("exposes only read operations by default", () => {
    const registry = createToolRegistry(
      { device: deviceClient() },
      { enableWrites: false, enableDestructive: false }
    );
    const expected = allMetadata.filter((operation) => operation.mcpExposure === "read");
    expect(registry.definitions).toHaveLength(expected.length);
    expect(registry.definitions.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(
      true
    );
  });

  it("requires write permission and keeps non-allowlisted destructive operations hidden", () => {
    const writeRegistry = createToolRegistry(
      { device: deviceClient() },
      { enableWrites: true, enableDestructive: false }
    );
    const writeNames = new Set(writeRegistry.definitions.map((tool) => tool.name));
    expect(writeNames.has(deviceOperations.updateApiKeyStatus.toolName)).toBe(true);
    expect(writeNames.has(deviceOperations.deleteAccount.toolName)).toBe(false);

    const destructiveRegistry = createToolRegistry(
      { device: deviceClient() },
      { enableWrites: true, enableDestructive: true }
    );
    const destructiveNames = new Set(destructiveRegistry.definitions.map((tool) => tool.name));
    // 第二道权限开关不能绕过 operation allowlist，Device 删除能力仍不得进入模型工具面。
    expect(destructiveNames.has(deviceOperations.deleteAccount.toolName)).toBe(false);
  });

  it("keeps the exact allowlist and excludes account and message operations", () => {
    const registry = createToolRegistry(
      { device: deviceClient() },
      { enableWrites: true, enableDestructive: true }
    );
    const names = new Set(registry.definitions.map((tool) => tool.name));

    // 精确集合能发现 metadata 被误放宽，而不只是验证当前标记为 never 的 operation。
    expect([...names].sort()).toEqual(
      [
        deviceOperations.getWorkspace.toolName,
        deviceOperations.listApiKeys.toolName,
        deviceOperations.listProviderRegions.toolName,
        deviceOperations.updateApiKeyStatus.toolName
      ].sort()
    );

    // 这些响应或输入包含账号资料与 reply_token，即使打开全部权限也不能进入模型工具面。
    for (const operation of [
      deviceOperations.listAccounts,
      deviceOperations.createAccount,
      deviceOperations.getAccount,
      deviceOperations.updateAccount,
      deviceOperations.sendMessage
    ]) {
      expect(names.has(operation.toolName), operation.operationId).toBe(false);
    }

    for (const operation of Object.values(deviceOperations)) {
      if (operation.mcpExposure === "never") expect(names.has(operation.toolName)).toBe(false);
    }
  });

  it("validates inputs before invoking HTTP and validates structured output", async () => {
    let calls = 0;
    const registry = createToolRegistry(
      {
        device: deviceClient(async () => {
          calls += 1;
          return workspaceResponse();
        })
      },
      { enableWrites: false, enableDestructive: false }
    );

    await expect(
      registry.invoke(
        deviceOperations.listProviderRegions.toolName,
        {},
        new AbortController().signal
      )
    ).rejects.toThrow("Invalid input");
    expect(calls).toBe(0);

    const result = await registry.invoke(
      deviceOperations.getWorkspace.toolName,
      {},
      new AbortController().signal
    );
    expect(result).toEqual({
      data: {
        request_id: "req_mcp",
        data: {
          name: "Demo",
          status: "active",
          account_quota: "9007199254740993",
          account_quota_unlimited: false
        }
      },
      meta: { status: 200, requestId: "req_mcp" }
    });

    await expect(
      registry.invoke("device_unknown", {}, new AbortController().signal)
    ).rejects.toThrow("Unknown tool");

    const invalidOutput = createToolRegistry(
      {
        device: deviceClient(
          async () =>
            new Response("{}", { status: 200, headers: { "content-type": "application/json" } })
        )
      },
      { enableWrites: false, enableDestructive: false }
    );
    await expect(
      invalidOutput.invoke(deviceOperations.getWorkspace.toolName, {}, new AbortController().signal)
    ).rejects.toThrow("Invalid upstream output");
  });

  it("rejects undeclared input fields and strips undeclared output fields", async () => {
    const writeFetch = vi.fn<UnifyPortFetch>(async () => workspaceResponse());
    const writeRegistry = createToolRegistry(
      { device: deviceClient(writeFetch) },
      { enableWrites: true, enableDestructive: false }
    );
    // Device status body 必须在发布 schema 中递归关闭额外字段，避免模型夹带未声明 credential。
    expect(
      writeRegistry.registrations.get(deviceOperations.updateApiKeyStatus.toolName)?.inputSchema
    ).toMatchObject({
      additionalProperties: false,
      $defs: {
        APIKeyStatusUpdateRequest: { additionalProperties: false }
      }
    });
    await expect(
      writeRegistry.invoke(
        deviceOperations.updateApiKeyStatus.toolName,
        {
          params: { path: { key_id: "ak_test" } },
          body: { status: "active", api_key: "must-not-reach-http" }
        },
        new AbortController().signal
      )
    ).rejects.toThrow("Invalid input");
    expect(writeFetch).not.toHaveBeenCalled();

    const readRegistry = createToolRegistry(
      {
        device: deviceClient(async () =>
          jsonResponse({
            request_id: "req_keys",
            data: [
              {
                id: "ak_test",
                name: "Default",
                key_prefix: "dk_live",
                status: "active",
                api_key: "must-not-reach-model"
              }
            ]
          })
        )
      },
      { enableWrites: false, enableDestructive: false }
    );
    const result = await readRegistry.invoke(
      deviceOperations.listApiKeys.toolName,
      {},
      new AbortController().signal
    );
    expect(JSON.stringify(result)).not.toContain("must-not-reach-model");
    expect(result).toMatchObject({
      data: { data: [{ id: "ak_test", key_prefix: "dk_live" }] }
    });
  });

  it("rejects oversized model output", async () => {
    const registry = createToolRegistry(
      {
        device: deviceClient(async () =>
          jsonResponse({
            request_id: "req_large",
            data: {
              name: "x".repeat(1_100_000),
              status: "active",
              account_quota: 1,
              account_quota_unlimited: false
            }
          })
        )
      },
      { enableWrites: false, enableDestructive: false }
    );
    await expect(
      registry.invoke(deviceOperations.getWorkspace.toolName, {}, new AbortController().signal)
    ).rejects.toThrow("size limit");
  });

  it("sanitizes SDK and unexpected errors", () => {
    expect(safeToolError(new UnifyPortConfigurationError("must-not-leak"))).toBe(
      "UnifyPort SDK error"
    );
    expect(safeToolError(new Error("raw unexpected detail"))).toBe(
      "Unexpected UnifyPort SDK error"
    );
    expect(
      safeToolError(
        new UnifyPortApiError("must-not-leak", {
          api: "device",
          operationId: "getWorkspace",
          status: 401,
          code: "SECRET CODE",
          requestId: "unsafe request id",
          details: { api_key: "must-not-leak" }
        })
      )
    ).toBe("UnifyPort API error: HTTP_401 (HTTP 401, request_id=redacted)");
    // 合法诊断码可以保留，但缺失 request id 时不能拼出伪造字段。
    expect(
      safeToolError(
        new UnifyPortApiError("must-not-leak", {
          api: "device",
          operationId: "getWorkspace",
          status: 429,
          code: "RATE_LIMITED",
          requestId: undefined
        })
      )
    ).toBe("UnifyPort API error: RATE_LIMITED (HTTP 429)");
  });
});

describe("MCP protocol surface", () => {
  it("serves tools, resources and calls over an in-memory MCP transport", async () => {
    const bundle = createMcpServer({
      device: {
        baseUrl: "https://device.example.com",
        apiKey: "test-key",
        fetch: async () => workspaceResponse()
      },
      permissions: { enableWrites: false, enableDestructive: false }
    });
    const client = new Client({ name: "mcp-test", version: "0.1.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await bundle.server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const tools = await client.listTools();
      expect(tools.tools.some((tool) => tool.name === "device_get_workspace")).toBe(true);
      const call = await client.callTool({ name: "device_get_workspace", arguments: {} });
      expect(call.isError).not.toBe(true);
      expect(Reflect.get(call.structuredContent ?? {}, "meta")).toEqual({
        status: 200,
        requestId: "req_mcp"
      });

      const resources = await client.listResources();
      // 对外 MCP 只公开覆盖率和运行策略，避免暴露开发环境的契约溯源信息。
      expect(resources.resources).toHaveLength(2);
      const coverage = await client.readResource({
        uri: "unifyport://metadata/api-coverage"
      });
      expect(coverage.contents[0]?.mimeType).toBe("application/json");
      const firstContent = coverage.contents[0];
      expect(
        firstContent !== undefined && "text" in firstContent ? firstContent.text : ""
      ).toContain('"sourceOperations": 64');

      await expect(
        client.callTool({ name: "device_get_account", arguments: {} })
      ).rejects.toThrow();
      await expect(client.callTool({ name: "device_unknown", arguments: {} })).rejects.toThrow();
      await expect(client.readResource({ uri: "unifyport://metadata/unknown" })).rejects.toThrow();
    } finally {
      await client.close();
      await bundle.server.close();
    }
  });

  it("returns sanitized API errors without upstream payload", async () => {
    const bundle = createMcpServer({
      device: {
        baseUrl: "https://device.example.com",
        apiKey: "test-key",
        fetch: async () => workspaceResponse(401)
      },
      permissions: { enableWrites: false, enableDestructive: false }
    });
    const client = new Client({ name: "mcp-test", version: "0.1.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await bundle.server.connect(serverTransport);
    await client.connect(clientTransport);
    try {
      const result = await client.callTool({ name: "device_get_workspace", arguments: {} });
      expect(result.isError).toBe(true);
      expect(result.content).toContainEqual({
        type: "text",
        text: "UnifyPort API error: UPSTREAM_FAILED (HTTP 401)"
      });
      expect(JSON.stringify(result)).not.toContain("hidden detail");
      const protocolLog = vi.spyOn(console, "error").mockImplementation(() => undefined);
      // SDK 将 onerror 建模为可选 callback；server factory 在运行时会固定安装它。
      bundle.server.onerror?.(new Error("protocol test"));
      expect(protocolLog).toHaveBeenCalledWith("[mcp] protocol error kind=Error");
      protocolLog.mockRestore();
    } finally {
      await client.close();
      await bundle.server.close();
    }
  });
});
