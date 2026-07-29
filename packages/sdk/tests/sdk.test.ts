import { inspect } from "node:util";

import { describe, expect, it, vi } from "vitest";

import {
  UnifyPortAbortError,
  UnifyPortApiError,
  UnifyPortConfigurationError,
  UnifyPortDeviceClient,
  UnifyPortNetworkError,
  UnifyPortPaginationError,
  UnifyPortResponseParseError,
  UnifyPortTimeoutError,
  deviceOperations,
  paginateCursor,
  type UnifyPortFetch
} from "../src/index.js";
import { createDeviceRuntime, waitForRetryDelay } from "../src/core/runtime.js";

function jsonResponse(value: unknown, status = 200, headers: HeadersInit = {}): Response {
  const responseHeaders = new Headers(headers);
  // HeadersInit 也可能是 tuple 数组或 Headers，不能把它当普通 object 展开。
  if (!responseHeaders.has("content-type")) responseHeaders.set("content-type", "application/json");
  return new Response(JSON.stringify(value), {
    status,
    headers: responseHeaders
  });
}

function workspaceJson(quota = "5"): string {
  return `{"request_id":"req_workspace","data":{"name":"Demo","status":"active","account_quota":${quota},"account_quota_unlimited":false}}`;
}

describe("generated operation coverage", () => {
  it("keeps every source operation as an explicit method", () => {
    expect(Object.keys(deviceOperations)).toHaveLength(64);

    const fetch: UnifyPortFetch = async () => jsonResponse({});
    const device = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch
    });
    for (const operationId of Object.keys(deviceOperations)) {
      expect(typeof Reflect.get(device, operationId), operationId).toBe("function");
    }
  });

  it("records non-obvious retry and secret policies", () => {
    expect(deviceOperations.submitAccountAuthPassword.mcpExposure).toBe("never");
    expect(deviceOperations.createApiKey).toMatchObject({
      secretOutput: true,
      mcpExposure: "never"
    });
    expect(deviceOperations.deleteAccount.mutability).toBe("destructive");
    expect(deviceOperations.updateGroupMembers.mutability).toBe("destructive");
    expect(deviceOperations.updateGroupJoinRequests.mutability).toBe("destructive");
  });

  it("preserves paired message receipt fields in generated metadata", () => {
    // 字段依赖必须进入发布 metadata，避免下游工具只看到两个互不相关的可选字段。
    expect(deviceOperations.markConversationRead.inputSchema).toMatchObject({
      $defs: {
        ConversationReadRequest: {
          allOf: [
            expect.any(Object),
            {
              dependentRequired: {
                up_to_message_id: ["up_to_message_sender_id"],
                up_to_message_sender_id: ["up_to_message_id"]
              }
            }
          ]
        }
      }
    });
  });

  it("keeps public provider and webhook event enums aligned", () => {
    // 精确枚举可防止内部 provider 重新进入公开类型，也避免历史事件在生成时丢失。
    expect(deviceOperations.createAccount.inputSchema).toMatchObject({
      $defs: {
        ProviderName: {
          enum: ["telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"]
        }
      }
    });
    expect(deviceOperations.createWebhookEndpoint.inputSchema).toMatchObject({
      $defs: {
        StandardEventType: {
          enum: [
            "*",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        }
      }
    });
  });
});

describe("transport security and response handling", () => {
  it("rejects insecure remote HTTP and requires explicit loopback opt-in", () => {
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "http://device.example.com",
          apiKey: "test-key"
        })
    ).toThrow(UnifyPortConfigurationError);
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "http://127.0.0.1:8080",
          apiKey: "test-key"
        })
    ).toThrow(UnifyPortConfigurationError);
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "http://127.0.0.1:8080",
          apiKey: "test-key",
          allowInsecureHttp: true
        })
    ).not.toThrow();
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "http://device.example.com",
          apiKey: "test-key",
          allowInsecureHttp: true
        })
    ).toThrow(UnifyPortConfigurationError);
    expect(() => new UnifyPortDeviceClient({ baseUrl: "not-a-url", apiKey: "test-key" })).toThrow(
      "绝对 URL"
    );
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://user:pass@device.example.com",
          apiKey: "test-key"
        })
    ).toThrow("username");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com?tenant=1",
          apiKey: "test-key"
        })
    ).toThrow("query");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "http://[::1]:8080",
          apiKey: "test-key",
          allowInsecureHttp: true
        })
    ).not.toThrow();
  });

  it("rejects invalid timeout, retry and credential values before HTTP", async () => {
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          timeoutMs: 0
        })
    ).toThrow("timeoutMs");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          timeoutMs: 2_147_483_648
        })
    ).toThrow("不能超过");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          retry: { maxRetries: 11 }
        })
    ).toThrow("不能超过");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          retry: { baseDelayMs: 0 }
        })
    ).toThrow("baseDelayMs");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          retry: { maxDelayMs: 2_147_483_648 }
        })
    ).toThrow("不能超过");
    expect(
      () =>
        new UnifyPortDeviceClient({
          baseUrl: "https://device.example.com",
          apiKey: "key",
          maxResponseBytes: 64 * 1024 * 1024 + 1
        })
    ).toThrow("maxResponseBytes");

    const fetch = vi.fn<UnifyPortFetch>(async () => workspaceResponseForCredentialTest());
    const executionTimeout = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch
    });
    // Node 会把溢出的 timer 压成约 1ms；单次覆盖也必须在发 HTTP 前拒绝。
    await expect(executionTimeout.getWorkspace({}, { timeoutMs: 2_147_483_648 })).rejects.toThrow(
      "不能超过"
    );
    const emptyKey = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: " ",
      fetch
    });
    await expect(emptyKey.getWorkspace()).rejects.toThrow("apiKey 不能为空");
    const newlineKey = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key\nvalue",
      fetch
    });
    await expect(newlineKey.getWorkspace()).rejects.toThrow("header 字符");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("pins baseUrl and overrides caller supplied API key", async () => {
    let captured: Request | undefined;
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com/api",
      apiKey: "trusted-key",
      fetch: async (request) => {
        captured = request;
        return new Response(workspaceJson(), { status: 200 });
      }
    });

    const result = await client.getWorkspace({
      baseUrl: "https://evil.example.com",
      headers: {
        "x-api-key": "untrusted-key",
        authorization: "Bearer untrusted",
        cookie: "untrusted=credential"
      }
    });
    expect(result.status).toBe(200);
    expect(result.requestId).toBe("req_workspace");
    expect(captured?.url).toBe("https://device.example.com/api/v1/workspace");
    expect(captured?.headers.get("x-api-key")).toBe("trusted-key");
    expect(captured?.headers.has("authorization")).toBe(false);
    expect(captured?.headers.has("cookie")).toBe(false);
    expect(captured?.redirect).toBe("error");
    // 底层 OpenAPI client 不属于公开 API，避免绕过安全整数和统一错误处理。
    expect("raw" in client).toBe(false);
  });

  it("rejects raw transport targets outside the configured origin and path", async () => {
    const runtime = createDeviceRuntime({
      baseUrl: "https://device.example.com/api",
      apiKey: "trusted-key",
      fetch: async () => new Response(workspaceJson(), { status: 200 })
    });
    // typed client 会固定 baseUrl；这里直接验证 transport 的纵深边界仍会阻止跨 origin 或 path 发出 credential。
    for (const target of [
      "https://evil.example.com/api/v1/workspace",
      "https://device.example.com/v1/workspace"
    ]) {
      await expect(runtime.rawFetch(new Request(target))).rejects.toThrow("之外发送 credential");
    }
  });

  it("preserves unsafe JSON integers as strings without changing safe integers", async () => {
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => new Response(workspaceJson("9007199254740993"), { status: 200 })
    });

    const result = await client.getWorkspace();
    expect(result.data.data.account_quota).toBe("9007199254740993");

    const safeClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => new Response(workspaceJson("42"), { status: 200 })
    });
    expect((await safeClient.getWorkspace()).data.data.account_quota).toBe(42);

    const escapedClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () =>
        new Response(
          '{"data":{"name":"De\\"mo","status":"active","account_quota":1,"account_quota_unlimited":false},"extra":-9007199254740993}',
          { status: 200 }
        )
    });
    const escaped = await escapedClient.getWorkspace();
    expect(escaped.data.data.name).toBe('De"mo');
    expect(Reflect.get(escaped.data, "extra")).toBe("-9007199254740993");

    // 小数与科学记数法也可以表达 integer，必须保留原 token 而不是静默舍入。
    for (const token of ["9007199254740993.0", "9.007199254740993e15"]) {
      const alternateClient = new UnifyPortDeviceClient({
        baseUrl: "https://device.example.com",
        apiKey: "test-key",
        fetch: async () => new Response(workspaceJson(token), { status: 200 })
      });
      expect((await alternateClient.getWorkspace()).data.data.account_quota).toBe(
        "9007199254740993"
      );
    }

    const extremeClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => new Response(workspaceJson("1e1000000"), { status: 200 })
    });
    // 巨大 exponent 不能展开为无界字符串，也不能退化成 Infinity。
    await expect(extremeClient.getWorkspace()).rejects.toBeInstanceOf(UnifyPortResponseParseError);
  });

  it("caps JSON after unsafe integer normalization", async () => {
    const exponents = Array.from({ length: 1_000 }, () => "1e300").join(",");
    const wireBody = `${workspaceJson().slice(0, -1)},"extra":[${exponents}]}`;
    expect(Buffer.byteLength(wireBody, "utf8")).toBeLessThan(16 * 1024);
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      maxResponseBytes: 16 * 1024,
      fetch: async () => new Response(wireBody, { status: 200 })
    });
    // 短 exponent 不能在 wire 检查后膨胀为数百 KB 的 canonical string 阵列。
    try {
      await client.getWorkspace();
      throw new Error("expected normalized response limit error");
    } catch (error) {
      expect(error).toBeInstanceOf(UnifyPortResponseParseError);
      if (!(error instanceof UnifyPortResponseParseError)) throw error;
      expect(error.status).toBe(200);
      expect(error.cause).toBeUndefined();
    }
  });

  it("retries safe reads but never retries ordinary writes", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    let readAttempts = 0;
    const readClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => {
        readAttempts += 1;
        return readAttempts === 1
          ? jsonResponse({ error: { code: "TEMPORARY", message: "retry" } }, 503)
          : new Response(workspaceJson(), { status: 200 });
      }
    });
    await expect(readClient.getWorkspace()).resolves.toMatchObject({ status: 200 });
    expect(readAttempts).toBe(2);

    let writeAttempts = 0;
    const writeClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => {
        writeAttempts += 1;
        return jsonResponse({ error: { code: "TEMPORARY", message: "do not retry" } }, 503);
      }
    });
    await expect(
      writeClient.updateWorkspace({ body: { name: "Demo", status: "active" } })
    ).rejects.toMatchObject({ code: "TEMPORARY", status: 503 });
    expect(writeAttempts).toBe(1);
    random.mockRestore();
  });

  it("supports per-call retry tightening and rotating credential providers", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    let attempts = 0;
    let keyVersion = 0;
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: () => `key-${String(++keyVersion)}`,
      fetch: async (request) => {
        attempts += 1;
        expect(request.headers.get("x-api-key")).toBe("key-1");
        return jsonResponse({ error: { code: "TEMPORARY", message: "retry" } }, 503);
      }
    });
    await expect(client.getWorkspace({}, { retry: { maxRetries: 1 } })).rejects.toBeInstanceOf(
      UnifyPortApiError
    );
    expect(attempts).toBe(2);
    // 同一次 operation 的 retry 固定 credential；下一次调用才读取轮换后的值。
    expect(keyVersion).toBe(1);
    random.mockRestore();
  });

  it("retries network failures and supports aborting retry backoff", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    let attempts = 0;
    const recovering = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () => {
        attempts += 1;
        if (attempts === 1) throw new TypeError("temporary network failure");
        return new Response(workspaceJson(), { status: 200 });
      }
    });
    await expect(recovering.getWorkspace()).resolves.toMatchObject({ status: 200 });
    expect(attempts).toBe(2);

    const noRetry = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () => {
        throw new TypeError("offline");
      }
    });
    await expect(noRetry.getWorkspace({}, { retry: false })).rejects.toBeInstanceOf(
      UnifyPortNetworkError
    );

    const redactedQuery = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () => {
        throw new TypeError("transport included cursor-value");
      }
    });
    // Device 查询参数可能包含业务定位信息，公开网络错误只能保留 origin 与 path。
    await expect(
      redactedQuery.listConversations(
        {
          params: {
            path: { account_id: "account-1" },
            query: { cursor: "cursor-value" }
          }
        },
        { retry: false }
      )
    ).rejects.toMatchObject({
      url: "https://device.example.com/v1/accounts/account-1/conversations",
      message: "UnifyPort 网络请求失败"
    });

    const providerFailure = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: () => {
        throw new Error("provider unavailable");
      },
      fetch: async () => new Response(workspaceJson(), { status: 200 })
    });
    await expect(providerFailure.getWorkspace()).rejects.toBeInstanceOf(UnifyPortNetworkError);

    const controller = new AbortController();
    const waiting = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () =>
        jsonResponse({ error: { code: "RATE_LIMITED", message: "wait" } }, 429, {
          "retry-after": "1"
        })
    });
    const pending = waiting.getWorkspace({}, { signal: controller.signal });
    setTimeout(() => controller.abort(), 5);
    await expect(pending).rejects.toBeInstanceOf(UnifyPortAbortError);
    random.mockRestore();
  });

  it("honors a short Retry-After delay", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    let attempts = 0;
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () => {
        attempts += 1;
        return attempts === 1
          ? jsonResponse({ error: { code: "RATE_LIMITED", message: "wait" } }, 429, {
              "retry-after": "0.001"
            })
          : new Response(workspaceJson(), { status: 200 });
      }
    });
    await client.getWorkspace();
    expect(attempts).toBe(2);

    let dateAttempts = 0;
    const dateClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "key",
      fetch: async () => {
        dateAttempts += 1;
        return dateAttempts === 1
          ? jsonResponse({ error: { code: "RATE_LIMITED", message: "wait" } }, 429, {
              // 过期 HTTP-date 应立即重试，仍需走标准 Retry-After 日期解析分支。
              "retry-after": "Thu, 01 Jan 1970 00:00:00 GMT"
            })
          : new Response(workspaceJson(), { status: 200 });
      }
    });
    await dateClient.getWorkspace();
    expect(dateAttempts).toBe(2);
    random.mockRestore();
  });

  it("removes the retry abort listener after a normal delay", async () => {
    const signal = new AbortController().signal;
    const addListener = vi.spyOn(signal, "addEventListener");
    const removeListener = vi.spyOn(signal, "removeEventListener");
    await waitForRetryDelay(1, signal);
    // 正常 timer resolve 也必须清理 listener，不能等到未来 abort 或 GC。
    expect(addListener).toHaveBeenCalledOnce();
    expect(removeListener).toHaveBeenCalledWith("abort", addListener.mock.calls[0]?.[1]);
  });

  it("normalizes API errors and JSON parse failures", async () => {
    const apiClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () =>
        jsonResponse(
          {
            request_id: "req_error",
            error: { code: "AUTH_INVALID", message: "invalid", details: { field: "key" } }
          },
          401
        )
    });
    await expect(apiClient.getWorkspace()).rejects.toMatchObject({
      name: "UnifyPortApiError",
      code: "AUTH_INVALID",
      status: 401,
      requestId: "req_error"
    });

    const parseClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () =>
        new Response('{"credential":"must-not-leak"', {
          status: 200,
          headers: {
            "x-request-id": "req_parse",
            "x-sensitive-value": "header-must-not-leak"
          }
        })
    });
    try {
      await parseClient.getWorkspace();
      throw new Error("expected parse error");
    } catch (error) {
      expect(error).toBeInstanceOf(UnifyPortResponseParseError);
      if (!(error instanceof UnifyPortResponseParseError)) throw error;
      expect(error).toMatchObject({ status: 200, requestId: "req_parse" });
      expect(Object.keys(error)).not.toContain("response");
      // 原始 SyntaxError、body 与敏感 header 都不得进入 cause、可枚举字段或常见 logger 展开结果。
      expect(error.cause).toBeUndefined();
      expect(
        `${error.message}\n${error.stack ?? ""}\n${JSON.stringify(error)}\n${inspect(error)}`
      ).not.toContain("must-not-leak");
    }

    const plainErrorClient = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () => new Response("plain upstream error", { status: 500 })
    });
    await expect(plainErrorClient.getWorkspace()).rejects.toMatchObject({
      code: "HTTP_500",
      status: 500
    });
  });

  it("bounds upstream diagnostics and never exposes error payload details", async () => {
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      fetch: async () =>
        jsonResponse(
          {
            request_id: "unsafe request id with spaces",
            error: {
              code: "SECRET value",
              message: "credential=must-not-leak",
              details: { api_key: "must-not-leak" }
            }
          },
          401,
          { "x-sensitive-value": "api-must-not-leak" }
        )
    });

    try {
      await client.getWorkspace();
      throw new Error("expected API error");
    } catch (error) {
      expect(error).toBeInstanceOf(UnifyPortApiError);
      if (!(error instanceof UnifyPortApiError)) throw error;
      const apiError = error;
      expect(apiError).toMatchObject({ code: "HTTP_401", requestId: undefined });
      expect(apiError.details).toBeUndefined();
      expect(apiError.message).not.toContain("must-not-leak");
      expect(Object.keys(apiError)).not.toContain("response");
      expect(inspect(apiError)).not.toContain("must-not-leak");
    }
  });

  it("distinguishes timeout from a generic network failure", async () => {
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      timeoutMs: 10,
      fetch: async (request) => {
        // custom fetch 模拟器在 timeout 之后观察 signal，覆盖“调用前已 abort”与运行中 abort 两种时序。
        await new Promise((resolve) => setTimeout(resolve, 25));
        throw request.signal.reason;
      }
    });
    await expect(client.getWorkspace()).rejects.toBeInstanceOf(UnifyPortTimeoutError);
  });

  it("applies timeout to credential providers and streamed response bodies", async () => {
    const stalledCredential = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: async () => await new Promise<string>(() => undefined),
      timeoutMs: 10,
      fetch: async () => new Response(workspaceJson(), { status: 200 })
    });
    await expect(stalledCredential.getWorkspace()).rejects.toBeInstanceOf(UnifyPortTimeoutError);

    const stalledBody = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      timeoutMs: 10,
      fetch: async () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              // 先返回 headers 和部分 body，再保持 stream 打开以验证 body 阶段仍受 timeout 约束。
              controller.enqueue(new TextEncoder().encode('{"request_id":"partial"'));
            }
          }),
          { status: 200 }
        )
    });
    await expect(stalledBody.getWorkspace()).rejects.toBeInstanceOf(UnifyPortTimeoutError);
  });

  it("rejects response bodies over the configured byte limit", async () => {
    const client = new UnifyPortDeviceClient({
      baseUrl: "https://device.example.com",
      apiKey: "test-key",
      maxResponseBytes: 16,
      fetch: async () =>
        new Response(workspaceJson(), {
          status: 200,
          headers: { "x-request-id": "req_oversized" }
        })
    });
    await expect(client.getWorkspace()).rejects.toMatchObject({
      name: "UnifyPortResponseParseError",
      status: 200,
      requestId: "req_oversized"
    });
  });
});

describe("cursor pagination", () => {
  it("iterates pages and rejects repeated cursors", async () => {
    const values: number[] = [];
    for await (const item of paginateCursor(
      async (cursor) =>
        cursor === undefined
          ? { items: [1, 2], has_more: true, next_cursor: "next" }
          : { items: [3], has_more: false },
      { maxPages: 2 }
    )) {
      values.push(item);
    }
    expect(values).toEqual([1, 2, 3]);

    const repeated = async (): Promise<void> => {
      for await (const _item of paginateCursor(
        async () => ({ items: [], has_more: true, next_cursor: "same" }),
        { initialCursor: "same" }
      )) {
        // 空 body 只消费 generator；异常应来自重复 cursor guard。
      }
    };
    await expect(repeated()).rejects.toBeInstanceOf(UnifyPortPaginationError);
  });

  it("enforces maxPages and option validation", async () => {
    const invalid = async (): Promise<void> => {
      for await (const _item of paginateCursor(async () => ({ items: [], has_more: false }), {
        maxPages: 0
      })) {
        // 空 body 只消费 generator。
      }
    };
    await expect(invalid()).rejects.toBeInstanceOf(UnifyPortPaginationError);

    const exhausted = async (): Promise<void> => {
      let cursor = 0;
      for await (const _item of paginateCursor(
        async () => ({ items: [], has_more: true, next_cursor: String(++cursor) }),
        { maxPages: 1 }
      )) {
        // 空 body 只消费 generator。
      }
    };
    await expect(exhausted()).rejects.toThrow("maxPages=1");

    const missingCursor = async (): Promise<void> => {
      for await (const _item of paginateCursor(async () => ({ items: [], has_more: true }))) {
        // 空 body 只消费 generator。
      }
    };
    await expect(missingCursor()).rejects.toThrow("缺少 next_cursor");

    const controller = new AbortController();
    controller.abort("must-not-leak");
    const aborted = async (): Promise<void> => {
      for await (const _item of paginateCursor(async () => ({ items: [], has_more: false }), {
        signal: controller.signal
      })) {
        // 空 body 只消费 generator。
      }
    };
    try {
      await aborted();
      throw new Error("expected pagination abort");
    } catch (error) {
      expect(error).toBeInstanceOf(UnifyPortPaginationError);
      if (!(error instanceof UnifyPortPaginationError)) throw error;
      // 调用方可自定义 abort reason，分页错误不得把它作为 cause 或 message 继续公开。
      expect(error.message).toContain("已取消");
      expect(error.cause).toBeUndefined();
      expect(JSON.stringify(error)).not.toContain("must-not-leak");
    }

    const pendingController = new AbortController();
    let receivedSignal: AbortSignal | undefined;
    const pendingPage = async (): Promise<void> => {
      for await (const _item of paginateCursor(
        async (_cursor, signal) => {
          receivedSignal = signal;
          return await new Promise<never>(() => undefined);
        },
        { signal: pendingController.signal }
      )) {
        // 永不返回的 page 用来验证 helper 自身的 abort race，而不是 fetchPage 的实现。
      }
    };
    const pendingAbort = pendingPage();
    setTimeout(() => pendingController.abort("must-not-leak"), 5);
    await expect(pendingAbort).rejects.toThrow("已取消");
    expect(receivedSignal).toBe(pendingController.signal);
  });
});

function workspaceResponseForCredentialTest(): Response {
  return new Response(workspaceJson(), { status: 200 });
}
