# 版本说明

[English](../release-notes.md) | [简体中文](release-notes.md)

## 未发布

### Provider 账号资料与消息引用句柄

- `Account.provider_profile` 现在使用 `ProviderProfile`。其可选标准字段包括 `id`、`phone`、`username`、`display_name`、`first_name`、`last_name`、`avatar_url` 与 `bio`；仍允许 provider 特有字段。
- `SendMessageResult` 新增可选的 `reply_token`。返回时，它是可通过 `reply_to.reply_token` 原样回传的不透明敏感句柄；调用方不得解析或自行构造。
- 可能包含 `provider_profile` 或 `reply_token` 的响应归类为敏感输出。仅在受控应用代码中处理；不得记录完整响应，也不得将其放入模型上下文。

兼容性：这些响应 schema 变更是增量且 wire-compatible 的。所有标准资料字段与 `reply_token` 均为可选，现有 provider 特有的 `provider_profile` 字段仍然有效，调用方也必须继续处理字段缺失的情况。公开接口面仍为 64 个 operation；`X-Api-Key` 鉴权、重试分类与 MCP exposure 均未变化。

## 0.3.0 - 2026-07-29

### 公开 provider 与 webhook 事件名称

- `ProviderName` 移除 `whatsapp_protocol`；应通过 provider regions 接口发现可分配新账号的 provider。
- `StandardEventType` 新增 `*`、`conversation.history` 与 `account.history.synced`。

兼容性：移除 `whatsapp_protocol` 会缩小公开 provider enum，对曾引用该值的调用方属于类型层 breaking change。新增 webhook 事件 enum 值属于增量变更，但使用 exhaustive switch 的调用方可能需要处理新值。鉴权、重试行为、secret 分类与 MCP exposure 均未变化。

该版本的 npm 发布、Git tag 与全新安装验证与本次源码发布准备分开记录。

## 0.2.0 - 2026-07-28

### 会话已读回执与 WhatsApp 成员标识

- `ConversationReadRequest` 新增可选字段 `up_to_message_sender_id`。
- `up_to_message_id` 与 `up_to_message_sender_id` 必须成对传入。WhatsApp 群聊消息应把对应 webhook 的 `data.sender.id` 作为 `up_to_message_sender_id`。
- 省略两个消息字段表示把整个会话标记为已读；只传其中一个会返回 HTTP `400` 与 `invalid_request`。
- `ConversationMember.peer_id` 明确记录 WhatsApp 优先返回 LID、缺少 LID 映射时回退 JID，纯手机号则位于 `extra.phone`。

兼容性：此前只传 `up_to_message_id` 的调用会受到行为破坏。迁移时应同时传入两个字段，或同时省略以使用会话级已读。鉴权、成功响应、重试行为和 MCP exposure 均未变化。

该版本的 npm 发布、Git tag 与全新安装验证与本次源码发布准备分开记录。
