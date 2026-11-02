import { inspect } from "node:util";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
  UnifyPortApiError,
  UnifyPortDeviceClient,
  deviceOperations,
  paginateCursor,
  type DeviceApiComponents,
  type DeviceApiWebhooks,
  type UnifyPortFetch
} from "../src/index.js";

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function client(fetch: UnifyPortFetch): UnifyPortDeviceClient {
  return new UnifyPortDeviceClient({
    baseUrl: "https://api.example.com",
    apiKey: "test-key",
    fetch
  });
}

// 通过真实生成方法核对网络请求，防止只增加 metadata 却遗漏方法、参数或策略。
const added = [
  {
    id: "createCall",
    method: "POST",
    path: "/v1/calls",
    run: (c: UnifyPortDeviceClient) =>
      c.createCall({
        body: {
          account_id: "acc_example",
          to: { id: "100000000001@lid", type: "user" },
          media_type: "voice"
        }
      })
  },
  {
    id: "getActiveCall",
    method: "GET",
    path: "/v1/calls/active?account_id=acc_example",
    run: (c: UnifyPortDeviceClient) =>
      c.getActiveCall({ params: { query: { account_id: "acc_example" } } })
  },
  {
    id: "hangupCall",
    method: "POST",
    path: "/v1/calls/call_example/hangup",
    run: (c: UnifyPortDeviceClient) =>
      c.hangupCall({
        params: { path: { call_id: "call_example" } },
        body: { account_id: "acc_example" }
      })
  },
  {
    id: "getAccountOperation",
    method: "GET",
    path: "/v1/account-operations/op_example",
    run: (c: UnifyPortDeviceClient) =>
      c.getAccountOperation({ params: { path: { operation_id: "op_example" } } })
  },
  {
    id: "createAccountAuthSession",
    method: "POST",
    path: "/v1/accounts/acc_example/auth-sessions",
    run: (c: UnifyPortDeviceClient) =>
      c.createAccountAuthSession({ params: { path: { account_id: "acc_example" } } })
  },
  {
    id: "submitAccountPasskeyResponse",
    method: "POST",
    path: "/v1/accounts/acc_example/auth/passkey-response",
    run: (c: UnifyPortDeviceClient) =>
      c.submitAccountPasskeyResponse({
        params: { path: { account_id: "acc_example" } },
        body: { webauthn_response: "{}" }
      })
  },
  {
    id: "confirmAccountPasskey",
    method: "POST",
    path: "/v1/accounts/acc_example/auth/passkey-confirm",
    run: (c: UnifyPortDeviceClient) =>
      c.confirmAccountPasskey({ params: { path: { account_id: "acc_example" } } })
  },
  {
    id: "listPosts",
    method: "GET",
    path: "/v1/accounts/acc_example/posts",
    run: (c: UnifyPortDeviceClient) =>
      c.listPosts({ params: { path: { account_id: "acc_example" } } })
  },
  {
    id: "getPost",
    method: "POST",
    path: "/v1/accounts/acc_example/posts/info",
    run: (c: UnifyPortDeviceClient) =>
      c.getPost({ params: { path: { account_id: "acc_example" } }, body: { post_id: "123" } })
  },
  {
    id: "listPostComments",
    method: "POST",
    path: "/v1/accounts/acc_example/posts/comments/list",
    run: (c: UnifyPortDeviceClient) =>
      c.listPostComments({
        params: { path: { account_id: "acc_example" } },
        body: { post_id: "123" }
      })
  },
  {
    id: "replyPostComment",
    method: "POST",
    path: "/v1/accounts/acc_example/posts/comments/reply",
    run: (c: UnifyPortDeviceClient) =>
      c.replyPostComment({
        params: { path: { account_id: "acc_example" } },
        body: { post_id: "123", text: "Example" }
      })
  },
  {
    id: "requestConversationHistory",
    method: "POST",
    path: "/v1/accounts/acc_example/conversations/history/request",
    run: (c: UnifyPortDeviceClient) =>
      c.requestConversationHistory({
        params: { path: { account_id: "acc_example" } },
        body: {
          conversation_id: "100000000001@lid",
          before: {
            message_id: "msg_example",
            sent_at: "2026-01-01T00:00:00Z",
            direction: "inbound"
          }
        }
      })
  },
  {
    id: "createContact",
    method: "POST",
    path: "/v1/accounts/acc_example/contacts/add",
    run: (c: UnifyPortDeviceClient) =>
      c.createContact({
        params: { path: { account_id: "acc_example" } },
        body: { username: "example" }
      })
  },
  {
    id: "getContactMembership",
    method: "GET",
    path: "/v1/accounts/acc_example/contacts/membership?contact_id=contact_example",
    run: (c: UnifyPortDeviceClient) =>
      c.getContactMembership({
        params: { path: { account_id: "acc_example" }, query: { contact_id: "contact_example" } }
      })
  }
] as const;

describe("current public contract", () => {
  it.each(added)(
    "sends $id through the authenticated transport",
    async ({ run, method, path, id }) => {
      const requests: Request[] = [];
      await run(
        client(async (request) => {
          requests.push(request);
          return json({ data: {} });
        })
      );
      expect(requests).toHaveLength(1);
      expect(requests[0]?.method).toBe(method);
      expect(requests[0]?.url).toBe(`https://api.example.com${path}`);
      expect(requests[0]?.headers.get("x-api-key")).toBe("test-key");
      expect(deviceOperations[id]).toMatchObject({ retryable: false, mcpExposure: "never" });
    }
  );

  it("classifies POST reads and one-time secrets explicitly", () => {
    for (const id of ["getPost", "listPostComments"] as const)
      expect(deviceOperations[id].mutability).toBe("read");
    for (const id of [
      "createCall",
      "createAccountAuthSession",
      "submitAccountPasskeyResponse",
      "confirmAccountPasskey"
    ] as const)
      expect(deviceOperations[id].secretOutput).toBe(true);
    expect(deviceOperations.submitAccountPasskeyResponse.secretInput).toBe(true);
    expect(deviceOperations.hangupCall.mutability).toBe("destructive");
  });

  it.each(added.filter((operation) => operation.method === "POST"))(
    "does not retry an uncertain $id result",
    async ({ run }) => {
      let attempts = 0;
      await expect(
        run(
          client(async () => {
            attempts += 1;
            return json({ error: { code: "provider_unavailable" } }, 502);
          })
        )
      ).rejects.toBeInstanceOf(UnifyPortApiError);
      expect(attempts).toBe(1);
    }
  );

  it("exports Webhook payloads without creating HTTP client methods", () => {
    // 接收契约进入类型面，但不能被误生成为向业务接收端发请求的方法。
    expectTypeOf<DeviceApiWebhooks>().toHaveProperty("callIncoming");
    expectTypeOf<UnifyPortDeviceClient>().not.toHaveProperty("receiveCallIncomingWebhook");
    expectTypeOf<
      DeviceApiComponents["schemas"]["AccountWebhookError"]["numeric_code"]
    >().toEqualTypeOf<"20100" | "20101" | "20102">();
    const pin: DeviceApiComponents["schemas"]["MessagePinState"] = { pinned: false };
    const vote: DeviceApiComponents["schemas"]["MessagePollVote"] = {
      voter_id: "voter_example",
      status: "decoded",
      selected_option_ids: []
    };
    const cards: DeviceApiComponents["schemas"]["ReceivedContactCard"] = {
      vcard: "BEGIN:VCARD\nEND:VCARD"
    };
    expect(pin.pinned).toBe(false);
    expect(vote.selected_option_ids).toEqual([]);
    expect(cards.vcard).toContain("\n");
    expectTypeOf<DeviceApiComponents["schemas"]["CallMessageCall"]["media_type"]>().toEqualTypeOf<
      "audio" | "video" | undefined
    >();
  });

  it("paginates accounts using the server's opaque cursor", async () => {
    const urls: string[] = [];
    const c = client(async (request) => {
      urls.push(request.url);
      return json({
        data:
          urls.length === 1
            ? { items: [{ id: "acc_first" }], has_more: true, next_cursor: "opaque+/=" }
            : { items: [{ id: "acc_last" }], has_more: false }
      });
    });
    const ids: string[] = [];
    for await (const account of paginateCursor(async (cursor) => {
      const result = await c.listAccounts({
        params: { query: { limit: 20, ...(cursor === undefined ? {} : { cursor }) } }
      });
      return result.data.data;
    }))
      ids.push(account.id);
    expect(ids).toEqual(["acc_first", "acc_last"]);
    expect(new URL(urls[1] ?? "").searchParams.get("cursor")).toBe("opaque+/=");
  });

  it("preserves account idempotency and Telegram's single read target", async () => {
    const requests: Request[] = [];
    const c = client(async (request) => {
      requests.push(request);
      return json({ data: { ok: true } });
    });
    await c.createAccount({
      params: { header: { "Idempotency-Key": "purchase-example" } },
      body: { provider: "whatsapp-protocol", region: "sg", auth_mode: "session" }
    });
    await c.markConversationRead({
      params: { path: { account_id: "acc_example" } },
      body: { conversation_id: "123", up_to_message_id: "42" }
    });
    expect(requests[0]?.headers.get("idempotency-key")).toBe("purchase-example");
    expect(await requests[1]?.json()).toEqual({ conversation_id: "123", up_to_message_id: "42" });
  });

  it("retains both asynchronous deletion JSON and no-content completion", async () => {
    let count = 0;
    const c = client(async () =>
      ++count === 1
        ? json({ data: { operation_id: "op_example", kind: "DELETE", state: "PENDING" } }, 202)
        : new Response(null, { status: 204 })
    );
    const pending = await c.deleteAccount({ params: { path: { account_id: "acc_example" } } });
    expect(pending.status).toBe(202);
    expect(pending.data?.data.operation_id).toBe("op_example");
    const done = await c.deleteAccount({ params: { path: { account_id: "acc_example" } } });
    expect(done.status).toBe(204);
    expect(done.data).toBeUndefined();
    expectTypeOf(done.data).extract<undefined>().toEqualTypeOf<undefined>();
  });

  it.each([
    "20102",
    "30020",
    undefined,
    30020,
    "03001",
    "3002",
    "300200",
    "30020\n",
    "secret-example"
  ])("filters numeric error metadata %s", async (numeric) => {
    const c = client(async () =>
      json(
        {
          request_id: "req_example",
          error: {
            code: "provider_unavailable",
            numeric_code: numeric,
            message: "must-not-leak",
            details: { token: "must-not-leak" }
          }
        },
        502
      )
    );
    try {
      await c.getWorkspace({}, { retry: false });
      throw new Error("expected failure");
    } catch (error) {
      expect(error).toBeInstanceOf(UnifyPortApiError);
      if (!(error instanceof UnifyPortApiError)) throw error;
      expect(error.numericCode).toBe(
        numeric === "20102" || numeric === "30020" ? numeric : undefined
      );
      expect(inspect(error)).not.toContain("must-not-leak");
    }
  });

  it("keeps native message discriminators and optional defaulted inputs", () => {
    const text: DeviceApiComponents["schemas"]["MessagePayload"] = {
      type: "text",
      text: "Example"
    };
    const media: DeviceApiComponents["schemas"]["MessagePayload"] = {
      type: "image",
      url: "https://media.example.com/image.jpg"
    };
    const poll: DeviceApiComponents["schemas"]["MessagePayload"] = {
      type: "poll",
      poll: { question: "Example?", options: [{ title: "A" }, { title: "B" }], max_selections: 1 }
    };
    expect([text.type, media.type, poll.type]).toEqual(["text", "image", "poll"]);
  });
});
