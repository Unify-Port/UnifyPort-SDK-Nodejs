# Release Notes

[English](release-notes.md) | [简体中文](zh-CN/release-notes.md)

## Unreleased

### Provider profiles and message reply handles

- `Account.provider_profile` now uses `ProviderProfile`. Its optional standard fields are `id`, `phone`, `username`, `display_name`, `first_name`, `last_name`, `avatar_url`, and `bio`; provider-specific fields remain allowed.
- `SendMessageResult` adds the optional `reply_token`. When present, it is an opaque sensitive handle that can be passed back through `reply_to.reply_token`; callers must not inspect or construct it.
- Responses that can contain `provider_profile` or `reply_token` are classified as sensitive output. Process them only in controlled application code; do not log the complete response or place it in model context.

Compatibility: these response schema changes are additive and wire-compatible. All standard profile fields and `reply_token` are optional, existing provider-specific `provider_profile` fields remain valid, and callers must continue to handle absent values. The public surface remains 64 operations. `X-Api-Key` authentication, retry classifications, and MCP exposure are unchanged.

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
