# Webhook contract

[English](webhook-contract.md) | [简体中文](zh-CN/webhook-contract.md)

This unreleased source update includes 24 standard event names in `StandardEventType`, plus `*` for subscriptions. It adds `contact.updated`, `post.comment.created`, `account.profile.updated`, `call.incoming`, `call.answered` and `call.ended`. Existing message and conversation events also have new payload variants. The SDK exports types, not a receiver, event store or new signature algorithm.

```ts
import type { DeviceApiComponents, DeviceApiWebhooks } from "@unifyport/sdk-node";

type ContactUpdate = DeviceApiComponents["schemas"]["ContactUpdatedWebhookEvent"];
type CallRecordUpdate = DeviceApiComponents["schemas"]["CallMessageUpdatedWebhookEvent"];
type IncomingCallContract = DeviceApiWebhooks["callIncoming"];
```

`DeviceApiOperations` remains the map of callable HTTP operations; receiver declarations are kept in `DeviceApiWebhooks`. The public contract currently declares 36 specialized Webhook shapes, and supplies 49 examples across 25 of them. All supplied examples are generated into TypeScript checks. The 24 event names are the subscription catalog; they do not imply a complete specialized payload schema for every generic event.

Types do not validate untrusted HTTP bodies. Finite state branches and forbidden sparse-update fields are preserved in the generated types, while numeric ranges, string formats and other cross-field conditions still require runtime validation. Verify and validate requests at the receiving boundary before using these types. Declared payload schemas and request examples are in the [public contract](../contracts/device.openapi.yaml).

| Payload                                                          | Consumer behavior                                                                                                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Advertising referral, product/order, interactive cards/responses | Merge supplied fields only; absence does not clear saved values. Preserve explicit zero/false. Commerce acceptance is not payment confirmation.                   |
| Link previews                                                    | Merge supplied preview fields. Empty title/description clears that field; omission preserves it. Explicit conversion to text removes the old preview.             |
| Contact cards and live locations                                 | Supplied ordered contacts replace the complete card list. Live location is a type marker, not coordinates/tracking.                                               |
| Poll votes                                                       | `decoded` replaces this voter's choices; [] withdraws. `unavailable` preserves earlier choices. Unknown/conflicting `voted_at` cannot be ordered by arrival.      |
| Message pins                                                     | Replace the complete `pin` snapshot, including removal of omitted expiry; preserve other message fields.                                                          |
| Disappearing-message settings                                    | Replace the complete settings snapshot. Explicit false/zero disables; omission does not. This does not delete stored copies or supply per-message expiry timers.  |
| Contact address-book names                                       | Update only supplied fields; empty strings clear, omission preserves. Do not replace personal nicknames or automatically merge PN/LID resource IDs.               |
| Account failures                                                 | Optional `data.error` supplies string code/numeric_code/message. Branch on codes; absence does not mean success. Restriction does not prove permanent suspension. |
| Account profile and device information                           | Profile fields can be absent. A device number of zero is valid; unknown is omitted. Current login devices are not permanent historical message identities.        |

Deduplicate events by top-level `id`, and associate message changes by provider, account, conversation and native message ID. Do not discard a new message update merely because its message ID already exists. Event IDs are opaque: do not enforce only the new 64-character format, because in-flight older events retain their IDs. Delivery retries preserve event identity; separately received lifecycle occurrences need not share it. No exactly-once or global ordering guarantee is implied.

`conversation.history` contains flat arrays, potentially split across events. On-demand batches have `data.history.source=on_demand` and do not emit `account.history.synced`. Empty/short batches and timeouts do not prove completion. Request IDs do not correlate batches. To request earlier history, use `before.message_id`, `sent_at` and `direction` from the same native content message; synthetic call records are invalid anchors. Default history/media windows are configurable and do not guarantee complete recovery. Merge recovered media URLs together with `expired=false` and preserve omitted fields.

Call lifecycle events use `voice/video`, beta eligibility and matching subscriptions. Incoming calls are currently unavailable. A call preparation response is not proof of dialing; `join_url` and hosted `authorize_url` are short-lived secrets. Keep them out of logs and model input. `message.*` call records are independent and use `audio/video` with sparse updates. Merge nested call fields individually and keep terminal precedence `ended > accepted > offered`; late acceptance can add facts/time but cannot reopen an ended call. Missing acceptance is unknown, not proof of a missed call.

Independent account endpoints entirely override workspace endpoints. Inactive or nonmatching account configuration does not fall back; deleting its last endpoint restores inheritance for subsequent initial deliveries. Endpoint ownership cannot be changed through PATCH. Empty/omitted/wildcard subscriptions include authorized events; explicit lists include listed names only. Beta call eligibility is checked on delivery/retry, and wildcard subscriptions do not grant beta access.
