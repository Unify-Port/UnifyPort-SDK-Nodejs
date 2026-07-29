# 版本说明

[English](../release-notes.md) | [简体中文](release-notes.md)

## 未发布

### 公开 provider 与 webhook 事件名称

- `ProviderName` 移除 `whatsapp_protocol`；应通过 provider regions 接口发现可分配新账号的 provider。
- `StandardEventType` 新增 `*`、`conversation.history` 与 `account.history.synced`。

兼容性：移除 `whatsapp_protocol` 会缩小公开 provider enum，对曾引用该值的调用方属于类型层 breaking change。新增 webhook 事件 enum 值属于增量变更，但使用 exhaustive switch 的调用方可能需要处理新值。鉴权、重试行为、secret 分类与 MCP exposure 均未变化。

本节描述尚未分配或发布 npm 版本的源码变更。

## 0.2.0 - 2026-07-28

### 会话已读回执与 WhatsApp 成员标识

- `ConversationReadRequest` 新增可选字段 `up_to_message_sender_id`。
- `up_to_message_id` 与 `up_to_message_sender_id` 必须成对传入。WhatsApp 群聊消息应把对应 webhook 的 `data.sender.id` 作为 `up_to_message_sender_id`。
- 省略两个消息字段表示把整个会话标记为已读；只传其中一个会返回 HTTP `400` 与 `invalid_request`。
- `ConversationMember.peer_id` 明确记录 WhatsApp 优先返回 LID、缺少 LID 映射时回退 JID，纯手机号则位于 `extra.phone`。

兼容性：此前只传 `up_to_message_id` 的调用会受到行为破坏。迁移时应同时传入两个字段，或同时省略以使用会话级已读。鉴权、成功响应、重试行为和 MCP exposure 均未变化。

该版本的 npm 发布、Git tag 与全新安装验证与本次源码发布准备分开记录。
