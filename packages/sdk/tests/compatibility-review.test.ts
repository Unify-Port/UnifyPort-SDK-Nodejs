import { describe, expect, expectTypeOf, it } from "vitest";
import {
  deviceOperations,
  type DeviceApiComponents,
  type DeviceApiOperations,
  type DeviceApiWebhooks,
  type UnifyPortDeviceClient
} from "../src/index.js";
import type {
  operations as SubpathOperations,
  webhooks as SubpathWebhooks
} from "../src/device/index.js";

type Vote = DeviceApiComponents["schemas"]["MessagePollVote"];
type Pin = DeviceApiComponents["schemas"]["MessagePinState"];
type Settings = DeviceApiComponents["schemas"]["ConversationDisappearingMessagesState"];
type EndedCall = DeviceApiComponents["schemas"]["CallEndedWebhookEvent"];

describe("compatibility review", () => {
  it("keeps HTTP operation keys separate from Webhook receiver operations", () => {
    // 旧入口的操作键必须继续等同于客户端方法，不能因加入接收契约而扩大。
    expectTypeOf<keyof DeviceApiOperations>().toEqualTypeOf<keyof UnifyPortDeviceClient>();
    expectTypeOf<SubpathOperations>().toEqualTypeOf<DeviceApiOperations>();
    expectTypeOf<SubpathWebhooks>().toEqualTypeOf<DeviceApiWebhooks>();
    expect(Object.keys(deviceOperations)).toHaveLength(78);
  });

  it("narrows decoded votes to a complete replacement selection", () => {
    const decoded: Vote = { status: "decoded", voter_id: "voter_example", selected_option_ids: [] };
    function selections(vote: Vote): readonly string[] | undefined {
      if (vote.status === "decoded") return vote.selected_option_ids.map((id) => id);
      return undefined;
    }
    expect(selections(decoded)).toEqual([]);
    // 已解码结果必须带完整选择；不可用结果不能误作撤票。
    // @ts-expect-error decoded votes require selected_option_ids
    const missing: Vote = { status: "decoded", voter_id: "voter_example" };
    // @ts-expect-error unavailable votes must not carry selections
    const unavailable: Vote = {
      status: "unavailable",
      voter_id: "voter_example",
      selected_option_ids: []
    };
    const mixedFields = { ...decoded, reason: "unknown" as const };
    // @ts-expect-error decoded votes must not carry failure reasons
    const mixed: Vote = mixedFields;
    void [missing, unavailable, mixed];
  });

  it("preserves disabled and unpinned Webhook states", () => {
    const off: Settings = { enabled: false, duration_seconds: 0 };
    const unpinned: Pin = { pinned: false };
    // @ts-expect-error disabled settings cannot carry a positive duration
    const inconsistent: Settings = { enabled: false, duration_seconds: 60 };
    // @ts-expect-error unpinned snapshots cannot carry stale expiry
    const stale: Pin = { pinned: false, expires_at: "2026-01-01T00:00:00Z" };
    // @ts-expect-error unpinned snapshots cannot carry duration
    const duration: Pin = { pinned: false, duration_seconds: 60 };
    expect(off.duration_seconds).toBe(0);
    expect(unpinned.pinned).toBe(false);
    void [inconsistent, stale, duration];
  });

  it("preserves shared request fields around alternative payload branches", () => {
    // anyOf 只能选择来源或提及分支，不能把共同必填字段变成另一种可选分支。
    type Media = DeviceApiComponents["schemas"]["MediaMessagePayload"];
    type Mention = DeviceApiComponents["schemas"]["Mention"];
    const media: Media = { type: "image", url: "https://media.example.com/example.webp" };
    const legacy: Mention = { id: "member_example" };
    const all: Mention = { type: "all" };
    // @ts-expect-error a media source cannot omit the common message type
    const noType: Media = { url: "https://media.example.com/example.webp" };
    // @ts-expect-error a media message requires a source
    const noSource: Media = { type: "image" };
    // @ts-expect-error media source values must remain strings
    const numeric: Media = { type: "image", url: 123 };
    // @ts-expect-error member mentions require an ID even with the legacy default type
    const noMember: Mention = {};
    // @ts-expect-error mention-all cannot carry a member ID
    const mixed: Mention = { type: "all", id: "member_example" };
    expect(media.type).toBe("image");
    expect([legacy.id, all.type]).toEqual(["member_example", "all"]);
    void [noType, noSource, numeric, noMember, mixed];
  });

  it("keeps call-record updates sparse and stage-specific", () => {
    type Record = DeviceApiComponents["schemas"]["CallMessageUpdatedWebhookEvent"];
    const data: Record["data"] = {
      message: {
        id: "record_example",
        type: "call",
        call: { id: "call_example", status: "ended", end_reason: "timeout" }
      }
    };
    // @ts-expect-error updates must not overwrite the original message direction
    const direction: Record["data"]["message"] = { ...data.message, direction: "inbound" };
    const acceptanceFields = {
      id: "record_example",
      type: "call" as const,
      call: { id: "call_example", status: "ended" as const, accepted_at: "2026-01-01T00:00:00Z" }
    };
    // @ts-expect-error ended updates cannot provide an acceptance timestamp
    const acceptance: Record["data"]["message"] = acceptanceFields;
    const endedFields = {
      id: "record_example",
      type: "call" as const,
      call: { id: "call_example", status: "accepted" as const, end_reason: "timeout" as const }
    };
    // @ts-expect-error accepted updates cannot provide an end reason
    const ended: Record["data"]["message"] = endedFields;
    expect(data.message.call.status).toBe("ended");
    void [direction, acceptance, ended];
  });

  it("requires a sender for inbound call endings while allowing sparse outbound endings", () => {
    const outbound: EndedCall = {
      id: "event_example",
      type: "call.ended",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00Z",
      data: {
        call: { id: "call_example", direction: "outbound", media_type: "voice", state: "ended" },
        reason: "expired",
        duration_seconds: 0
      }
    };
    // @ts-expect-error inbound endings require a real sender
    const inbound: EndedCall["data"] = {
      call: { id: "call_example", direction: "inbound", media_type: "voice", state: "ended" },
      reason: "expired",
      duration_seconds: 0
    };
    expect(outbound.data.call.direction).toBe("outbound");
    void inbound;
  });
});
