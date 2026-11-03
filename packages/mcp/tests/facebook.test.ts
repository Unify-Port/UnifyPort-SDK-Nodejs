import { readFileSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";
import YAML from "yaml";
import { describe, expect, it } from "vitest";
import { deviceOperations, UnifyPortDeviceClient } from "@unifyport/sdk-node";
import { createToolRegistry } from "../src/registry.js";
// 跨 package 只读契约数据，避免把 SDK 源文件纳入 MCP 的 rootDir。
const content = (
  name: string
): { examples: Record<string, { value: Record<string, unknown> }> } => {
  const doc = YAML.parse(readFileSync("contracts/device.openapi.yaml", "utf8")) as {
    webhooks: Record<
      string,
      {
        post: {
          requestBody: {
            content: {
              "application/json": { examples: Record<string, { value: Record<string, unknown> }> };
            };
          };
        };
      }
    >;
  };
  const webhook = doc.webhooks[name];
  if (webhook === undefined) throw new Error("Missing public Facebook declaration");
  return webhook.post.requestBody.content["application/json"];
};
const webhookExamples = Object.fromEntries(
  [
    "facebookMessageReceived",
    "facebookAccountAuthSucceeded",
    "facebookAccountStatusUpdated",
    "facebookAccountAuthFailed"
  ].map((name) => [name, Object.values(content(name).examples).map((e) => e.value)])
);

// 对接收类型做字段变异校验，避免只用正例掩盖 provider、方向和身份类型遗漏。
describe("Facebook contract and MCP boundary", () => {
  const document = YAML.parse(readFileSync("contracts/device.openapi.yaml", "utf8")) as Record<
    string,
    unknown
  >;
  const ajv = new Ajv2020({ strict: false, validateFormats: false });
  const schema = (name: string) =>
    ajv.compile({ components: document["components"], $ref: `#/components/schemas/${name}` });

  it("validates the final public message shape and rejects wrong identity/direction/provider", () => {
    const validate = schema("FacebookMessageReceivedWebhookEvent");
    for (const body of webhookExamples["facebookMessageReceived"] ?? [])
      expect(validate(body)).toBe(true);
    const original = webhookExamples["facebookMessageReceived"]?.[0];
    expect(original).toBeDefined();
    for (const change of [
      { provider: "whatsapp" },
      { type: "facebook.message.received" },
      { data: { message: { id: 9007199254740992, direction: "inbound" } } },
      { data: { message: { id: "example" } } },
      { data: { message: { id: "example", direction: "unknown" } } }
    ]) {
      const changed = { ...original, ...change };
      if ("data" in change)
        changed.data = { ...(original?.["data"] as Record<string, unknown>), ...change.data };
      expect(validate(changed)).toBe(false);
    }
  });

  it("keeps lifecycle states distinct", () => {
    for (const [name, bodies] of [
      ["FacebookAccountAuthSucceededWebhookEvent", webhookExamples["facebookAccountAuthSucceeded"]],
      ["FacebookAccountStatusUpdatedWebhookEvent", webhookExamples["facebookAccountStatusUpdated"]],
      ["FacebookAccountAuthFailedWebhookEvent", webhookExamples["facebookAccountAuthFailed"]]
    ] as const) {
      const validate = schema(name);
      for (const body of bodies ?? []) {
        expect(validate(body)).toBe(true);
        expect(
          validate({
            ...body,
            data: { ...(body["data"] as Record<string, unknown>), runtime_status: "starting" }
          })
        ).toBe(false);
      }
    }
  });

  it("accepts Facebook in existing region lookup without exposing session, send or receiver tools", () => {
    const registry = createToolRegistry(
      {
        device: new UnifyPortDeviceClient({
          baseUrl: "https://api.example.com",
          apiKey: "test-key"
        })
      },
      { enableWrites: true, enableDestructive: true }
    );
    const list = registry.registrations.get(deviceOperations.listProviderRegions.toolName);
    expect(list?.validateInput({ params: { path: { provider: "facebook" } } }).valid).toBe(true);
    for (const id of ["createAccount", "importAccountAuthSession", "sendMessage"] as const) {
      expect(registry.registrations.has(deviceOperations[id].toolName)).toBe(false);
    }
    expect(registry.definitions.some((t) => t.name.includes("receiveFacebook"))).toBe(false);
    expect(Object.keys(deviceOperations)).toHaveLength(78);
  });
});
