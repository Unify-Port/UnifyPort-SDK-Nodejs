/* eslint-disable @typescript-eslint/no-deprecated -- 动态生成的原生 JSON Schema 需要低层 Server API。 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import type {
  CallToolResult,
  ListResourcesResult,
  ListToolsResult,
  ReadResourceResult,
  Resource
} from "@modelcontextprotocol/sdk/types.js";
import { UnifyPortDeviceClient } from "@unifyport/sdk-node";

import { generatedCoverage, generatedServerVersion } from "./generated/metadata.js";
import type { ToolClients } from "./generated/tool-invokers.js";
import { createToolRegistry, safeToolError, type ToolRegistry } from "./registry.js";
import type { McpRuntimeConfig } from "./config.js";

interface ResourceEntry {
  readonly definition: Resource;
  readonly text: string;
}

export interface McpServerBundle {
  readonly server: Server;
  readonly registry: ToolRegistry;
  readonly resources: readonly Resource[];
}

function clientsFromConfig(config: McpRuntimeConfig): ToolClients {
  return { device: new UnifyPortDeviceClient(config.device) };
}

function resourceEntry(
  uri: string,
  name: string,
  description: string,
  value: unknown
): ResourceEntry {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  return {
    definition: {
      uri,
      name,
      title: name,
      description,
      mimeType: "application/json",
      size: Buffer.byteLength(text, "utf8"),
      annotations: { audience: ["assistant"], priority: 0.8 }
    },
    text
  };
}

function toolError(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

export function createMcpServer(config: McpRuntimeConfig): McpServerBundle {
  const clients = clientsFromConfig(config);
  const registry = createToolRegistry(clients, config.permissions);
  const resourceEntries = [
    resourceEntry(
      "unifyport://metadata/api-coverage",
      "api-coverage",
      "SDK 与 MCP 的生成覆盖率，不含 credential。",
      generatedCoverage
    ),
    resourceEntry(
      "unifyport://metadata/mcp-policy",
      "mcp-policy",
      "本次进程实际启用的 MCP 权限摘要，不包含 URL 或 secret。",
      {
        // 对外资源只反映运行权限，不包含 base URL、凭据或开发环境溯源。
        configuredApis: {
          device: true
        },
        permissions: config.permissions,
        exposedTools: registry.definitions.length
      }
    )
  ];
  const resourceMap = new Map(resourceEntries.map((entry) => [entry.definition.uri, entry]));
  const server = new Server(
    { name: "unifyport-mcp", version: generatedServerVersion },
    {
      capabilities: {
        tools: { listChanged: false },
        resources: { subscribe: false, listChanged: false }
      },
      instructions:
        "Use only the listed UnifyPort operation tools. Credentials and raw HTTP are intentionally unavailable."
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, (): ListToolsResult => ({
    tools: [...registry.definitions]
  }));
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request, extra): Promise<CallToolResult> => {
      const registration = registry.registrations.get(request.params.name);
      if (registration === undefined) {
        throw new McpError(ErrorCode.InvalidParams, `Unknown tool: ${request.params.name}`);
      }
      const input = registration.validateInput(request.params.arguments ?? {});
      if (!input.valid) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid arguments for ${request.params.name}: ${input.errorMessage}`
        );
      }

      try {
        const structuredContent = await registry.invoke(
          request.params.name,
          input.data,
          extra.signal
        );
        return {
          content: [
            {
              type: "text",
              text: `UnifyPort operation ${registration.metadata.operationId} completed.`
            }
          ],
          structuredContent
        };
      } catch (error) {
        // stdio stdout 只属于 JSON-RPC；stderr 也只记录类型，不展开可能含敏感值的 cause/payload。
        const kind = error instanceof Error ? error.name : "UnknownError";
        console.error(`[mcp] tool failed name=${request.params.name} kind=${kind}`);
        return toolError(safeToolError(error));
      }
    }
  );
  server.setRequestHandler(ListResourcesRequestSchema, (): ListResourcesResult => ({
    resources: resourceEntries.map((entry) => entry.definition)
  }));
  server.setRequestHandler(ReadResourceRequestSchema, (request): ReadResourceResult => {
    const entry = resourceMap.get(request.params.uri);
    if (entry === undefined) {
      throw new McpError(ErrorCode.InvalidParams, `Unknown resource: ${request.params.uri}`);
    }
    return {
      contents: [
        {
          uri: entry.definition.uri,
          mimeType: "application/json",
          text: entry.text
        }
      ]
    };
  });
  server.onerror = (error): void => {
    // 协议错误的 message 可能回显非法请求；对外日志只记录错误类型。
    const kind = error instanceof Error ? error.name : "UnknownError";
    console.error(`[mcp] protocol error kind=${kind}`);
  };

  return {
    server,
    registry,
    resources: resourceEntries.map((entry) => entry.definition)
  };
}
