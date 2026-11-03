# Release Notes

[English](release-notes.md) | [简体中文](zh-CN/release-notes.md)

## 0.5.0 — prepared, unreleased

Prepared on 2026-11-03; this is not a publication date. This pre-1.0 minor version includes breaking response/type changes from `0.4.0`. Read the [migration guide](migration.md) before upgrading.

### Changes

- Synchronizes 78 HTTP operations, 225 component schemas, 24 standard event names plus `*`, and 40 specialized Webhook receiver declarations. The 57 synthetic examples cover 29 receiver declarations, not all 40.
- Adds account-operation queries, hosted authorization/Passkey, contacts/membership, on-demand history, posts/comments and gated calls. Account pagination, creation/update inputs, asynchronous deletion, wallet/QR metadata and message/Webhook unions are updated.
- Adds the `facebook` provider and four receiver declarations with eight examples; Facebook itself adds no HTTP operations or standard event names. Session-only authorization and E2EE direct-message limits are documented in [Facebook](facebook.md).
- Keeps authentication, credential filtering and the 19-operation retry allowlist. Adds optional validated five-digit `numericCode` error metadata without exposing server bodies. No new automatic write retries or MCP exposure are enabled.

### Version and provenance

The workspace and `packages/sdk/package.json` both declare `0.5.0`. `@unifyport/mcp-server` remains private at `0.1.0`; its version and release policy are independent.

The approved public contract comes from [Node source ce60499](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/commit/ce60499). Its package metadata was `0.4.0` with baseline kind `approved-source`; that immutable provenance remains unchanged and does not claim npm `0.5.0` has been published.

Supported runtime: Node.js >=22.12.0; ESM only.

### Verification and remaining gates

Run from the source checkout:

```bash
pnpm check
pnpm public:check
git diff --check
```

Review the exact candidate diff and package/archive contents; install the local artifact into a clean consumer and confirm its version and public imports. These are preparation gates, not a statement that the listed commands or release CI have already passed.

No tag, registry publication, GitHub Release, deployment or real-account E2E is performed by this preparation. CI must pass on the final reviewed release commit. Controlled staging/provider E2E and post-publication registry/module resolution remain separate gates. Re-run time-sensitive vulnerability checks before release. Rollback constraints are documented in the [migration guide](migration.md).

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
