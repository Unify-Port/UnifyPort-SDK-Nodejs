# Release Notes

[English](release-notes.md) | [简体中文](zh-CN/release-notes.md)

## 0.2.0 - 2026-07-28

### Conversation read receipts and WhatsApp member identity

- `ConversationReadRequest` adds the optional `up_to_message_sender_id` field.
- `up_to_message_id` and `up_to_message_sender_id` must be supplied together. For a WhatsApp group message, use the matching webhook `data.sender.id` as `up_to_message_sender_id`.
- Omit both message fields to mark the whole conversation as read. Supplying only one field is rejected with HTTP `400` and `invalid_request`.
- `ConversationMember.peer_id` now documents that WhatsApp prefers LID, falls back to JID when no LID mapping is available, and returns a plain phone number in `extra.phone`.

Compatibility: this is a behavioral breaking change for callers that previously supplied `up_to_message_id` alone. Migrate those calls by supplying both fields or by omitting both fields for conversation-level read state. Authentication, success responses, retry behavior, and MCP exposure are unchanged.

The npm publication, Git tag, and clean-install verification for this version are tracked separately from this source release preparation.
