# Release Notes

[English](release-notes.md) | [简体中文](zh-CN/release-notes.md)

## Unreleased - public contract synchronization

The working source covers 78 HTTP operations and 24 standard event types, plus the subscription wildcard. No version, tag or registry release is created.

- Adds calls, billing-operation queries, hosted authorization, Passkey, posts/comments, on-demand history and contact creation/membership.
- Account lists now return `data.items/has_more/next_cursor`. Migrate array consumers and preserve opaque cursors. Creation/update use separate inputs. Optional `Idempotency-Key` is passed through `params.header`; writes remain nonretryable. Deletion returns 202 JSON or 204 with undefined data.
- Telegram read targets no longer require a WhatsApp sender. Types cover authorization steps, runtime hints, wallet periods, quota usage, independent account endpoints and WhatsApp Protocol.
- Optional `UnifyPortApiError.numericCode` retains only validated five-digit strings. Raw messages/details remain excluded.
- Message unions cover sticker/poll/link_preview and member/all mentions. See [Webhook handling](webhook-contract.md) for payloads, sparse updates and ordering.
- New operations remain outside MCP and automatic retry. POST post/comment queries are reads; hangup is destructive. Authorization/call links and Passkey payloads have secret policies.
- Compatibility review keeps `DeviceApiOperations` and the `/device` `operations` export HTTP-only. Webhook receiver operations remain available through `DeviceApiWebhooks` / `/device` `webhooks`.
- Generated types preserve shared fields in alternative payloads, decoded/unavailable vote branches, disabled settings, unpinned snapshots and sparse call-record fields. Webhook examples are now included in generated TypeScript checks.

Account pagination is a breaking response change. Replace the removed `AccountRequest` component with `AccountCreateRequest` or `AccountUpdateRequest` as appropriate. Required creation fields and corrected message/Webhook unions may expose invalid existing calls during type checking. Migrate callers before adopting this source update. Local checks do not prove deployment or real-account workflows.

## 0.4.0 - 2026-07-31

### Provider profiles and message reply handles

- `Account.provider_profile` now uses `ProviderProfile`. Its optional standard fields are `id`, `phone`, `username`, `display_name`, `first_name`, `last_name`, `avatar_url`, and `bio`; provider-specific fields remain allowed.
- `SendMessageResult` adds the optional `reply_token`. When present, it is an opaque sensitive handle that can be passed back through `reply_to.reply_token`; callers must not inspect or construct it.
- Responses that can contain `provider_profile` or `reply_token` are classified as sensitive output. Process them only in controlled application code; do not log the complete response or place it in model context.

Compatibility: these response schema changes are additive and wire-compatible. All standard profile fields and `reply_token` are optional, existing provider-specific `provider_profile` fields remain valid, and callers must continue to handle absent values. The public surface remains 64 operations. `X-Api-Key` authentication, retry classifications, and MCP exposure are unchanged.

The npm publication, Git tag, and clean-install verification for this version are tracked separately from this source release preparation.

## 0.3.0 - 2026-07-29

### Public providers and webhook event names

- `ProviderName` removes `whatsapp_protocol`. Use the provider regions endpoint to discover providers that can allocate new accounts.
- `StandardEventType` adds `*`, `conversation.history`, and `account.history.synced`.

Compatibility: removing `whatsapp_protocol` narrows the public provider enum and is a breaking type-level change for callers that referenced it. The new webhook event enum values are additive, but exhaustive event switches may need to handle the new values. Authentication, retry behavior, secret classification, and MCP exposure are unchanged.

The npm publication, Git tag, and clean-install verification for this version are tracked separately from this source release preparation.

## 0.2.0 - 2026-07-28

### Conversation read receipts and WhatsApp member identity

- `ConversationReadRequest` adds the optional `up_to_message_sender_id` field.
- `up_to_message_id` and `up_to_message_sender_id` must be supplied together. For a WhatsApp group message, use the matching webhook `data.sender.id` as `up_to_message_sender_id`.
- Omit both message fields to mark the whole conversation as read. Supplying only one field is rejected with HTTP `400` and `invalid_request`.
- `ConversationMember.peer_id` now documents that WhatsApp prefers LID, falls back to JID when no LID mapping is available, and returns a plain phone number in `extra.phone`.

Compatibility: this is a behavioral breaking change for callers that previously supplied `up_to_message_id` alone. Migrate those calls by supplying both fields or by omitting both fields for conversation-level read state. Authentication, success responses, retry behavior, and MCP exposure are unchanged.

The npm publication, Git tag, and clean-install verification for this version are tracked separately from this source release preparation.
