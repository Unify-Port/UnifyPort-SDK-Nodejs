import { describe, expect, expectTypeOf, it } from "vitest";
import {
  deviceOperations,
  UnifyPortApiError,
  UnifyPortDeviceClient,
  type DeviceApiComponents,
  type DeviceApiWebhooks
} from "../src/index.js";
import { webhookExamples } from "./generated/webhook-examples.js";

type Schemas = DeviceApiComponents["schemas"];

// 接收样例只使用公开正文，避免把原生回调或凭证变成 SDK 依赖。
describe("Facebook channel", () => {
  it("preserves old providers and adds Facebook input/output and receiver types", () => {
    const providers: Schemas["ProviderName"][] = [
      "telegram",
      "whatsapp",
      "line",
      "twitter",
      "facebook",
      "zalo",
      "tiktok",
      "whatsapp-protocol"
    ];
    const aliases: Schemas["ProviderInputName"][] = ["facebook", "x", "x_client", "twitter_client"];
    expect(providers).toHaveLength(8);
    expect(aliases).toContain("facebook");
    expectTypeOf<DeviceApiWebhooks>().toHaveProperty("facebookMessageReceived");
    expectTypeOf<UnifyPortDeviceClient>().not.toHaveProperty(
      "receiveFacebookMessageReceivedWebhookEvent"
    );
    const invalid: Schemas["FacebookMessage"] = {
      id: "message_example",
      // @ts-expect-error direction is a standard direction, not a boolean or provider flag
      direction: true
    };
    void invalid;
  });

  it("uses existing account, session, runtime, conversation and send operations", async () => {
    const requests: Request[] = [];
    const c = new UnifyPortDeviceClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
      fetch: async (request) => {
        requests.push(request);
        return new Response(
          JSON.stringify({ data: { provider: "facebook", runtime_status: "starting" } }),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        );
      }
    });
    await c.createAccount({
      body: { provider: "facebook", region: "sg", auth_mode: "session" },
      params: { header: { "Idempotency-Key": "facebook-example" } }
    });
    await c.importAccountAuthSession({
      params: { path: { account_id: "acc_example" } },
      body: { session_url: "https://example.com/temporary-session.json" }
    });
    const state = await c.refreshAccountRuntime({
      params: { path: { account_id: "acc_example" } }
    });
    expect(state.data.data.runtime_status).toBe("starting");
    await c.listConversations({
      params: { path: { account_id: "acc_example" }, query: { type: "user", cursor: "opaque+/=" } }
    });
    await c.sendMessage({
      body: {
        account_id: "acc_example",
        to: { id: "9007199254740995", type: "user" },
        message: { type: "text", text: "Hello" }
      }
    });
    expect(requests.map((r) => new URL(r.url).pathname)).toEqual([
      "/v1/accounts",
      "/v1/accounts/acc_example/auth/session",
      "/v1/accounts/acc_example/runtime/refresh",
      "/v1/accounts/acc_example/conversations",
      "/v1/messages"
    ]);
    expect(requests.every((r) => r.headers.get("x-api-key") === "test-key")).toBe(true);
    expect(requests[0]?.headers.get("idempotency-key")).toBe("facebook-example");
    expect(new URL(requests[3]?.url ?? "").searchParams.get("cursor")).toBe("opaque+/=");
    expect(await requests[4]?.json()).toMatchObject({ to: { id: "9007199254740995" } });
  });

  it("never retries an uncertain send or session import even with a retry budget", async () => {
    let attempts = 0;
    const c = new UnifyPortDeviceClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
      retry: { maxRetries: 3 },
      fetch: async () => {
        attempts += 1;
        return new Response('{"error":{"code":"provider_unavailable"}}', {
          status: 502,
          headers: { "content-type": "application/json" }
        });
      }
    });
    await expect(
      c.sendMessage({
        body: {
          account_id: "acc_example",
          to: { id: "9007199254740995", type: "user" },
          message: { type: "image", url: "https://media.example.com/image.jpg" }
        }
      })
    ).rejects.toBeInstanceOf(UnifyPortApiError);
    await expect(
      c.importAccountAuthSession({
        params: { path: { account_id: "acc_example" } },
        body: { session_url: "https://example.com/temporary-session.json" }
      })
    ).rejects.toBeInstanceOf(UnifyPortApiError);
    expect(attempts).toBe(2);
    for (const id of ["sendMessage", "importAccountAuthSession"] as const) {
      expect(deviceOperations[id]).toMatchObject({
        retryable: false,
        secretInput: true,
        mcpExposure: "never"
      });
    }
  });

  it("retains direction, string identities, sparse media and fractional UTC time", () => {
    const messages: Schemas["FacebookMessageReceivedWebhookEvent"][] =
      webhookExamples.facebookMessageReceived;
    const [inbound, outbound, media, sticker, missing] = messages;
    expect(inbound?.data.message.id).toBe("9007199254740993");
    expect(inbound?.data.message.sent_at).toBe("2026-01-01T00:00:00.123456789Z");
    expect(inbound?.data.message.reply_to_message_id).toBe("9007199254740991");
    expect(outbound?.type).toBe("message.received");
    expect(outbound?.data.message.direction).toBe("outbound");
    expect(outbound?.data.message).not.toHaveProperty("sent_at");
    expect(media?.data.message.attachments?.map((a) => a.type)).toEqual(["image", "audio"]);
    expect(media?.data.message.attachments?.[0]).toMatchObject({
      size: 0,
      metadata: { animated: false, width: 0 }
    });
    expect(media?.data.message.attachments?.[1]).toMatchObject({
      metadata: { ptt: false, duration: 0, download_status: "failed" }
    });
    expect(media?.data.message.attachments?.[1]).not.toHaveProperty("url");
    expect(media?.data.message.attachments?.[1]).not.toHaveProperty("duration_ms");
    expect(sticker?.data.message.type).toBe("sticker");
    expect(missing?.data.message.attachments?.[0]).not.toHaveProperty("url");
    const ordinary = webhookExamples.facebookAccountStatusUpdated[0];
    expect(ordinary?.data.runtime_status).toBe("error");
    expect(ordinary?.data).not.toHaveProperty("auth_status");
    expect(webhookExamples.facebookAccountAuthSucceeded[0]?.data).toMatchObject({
      auth_status: "authorized",
      runtime_status: "running"
    });
    expect(webhookExamples.facebookAccountAuthFailed[0]?.data).toMatchObject({
      auth_status: "failed",
      runtime_status: "disconnected"
    });
  });
});
