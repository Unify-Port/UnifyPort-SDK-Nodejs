# 版本说明

[English](../release-notes.md) | [简体中文](release-notes.md)

## 0.5.0 — 已准备，未发布

准备日期为 2026-11-03，不是发布日期。此 1.0 之前的 minor 版本包含相对 `0.4.0` 的响应/类型不兼容变化，升级前请阅读[迁移指南](migration.md)。

### 变化

- 同步 78 个 HTTP operation、225 个 component schema、24 个标准事件名及 `*`，提供 40 个专用 Webhook 接收方声明。57 个合成示例覆盖其中 29 个声明，不表示覆盖全部 40 个。
- 新增账号操作查询、托管授权/Passkey、联系人/关系、按需历史、帖子/评论及受内测权限限制的通话。更新账号分页、创建/更新输入、异步删除、余额/QR 元数据和消息/Webhook 联合类型。
- 新增 `facebook` provider、四个接收方声明和八个示例；Facebook 本身不新增 HTTP operation 或标准事件名。仅支持 session 授权及 E2EE 私聊的限制见 [Facebook](facebook.md)。
- 保持认证、凭证过滤和 19 个操作的重试白名单；增加经过验证的五位字符串错误字段 `numericCode`，不暴露服务端正文。不启用新的自动写入重试或 MCP 能力。

### 版本与来源

工作区及 `packages/sdk/package.json` 均声明 `0.5.0`。`@unifyport/mcp-server` 保持 private 和独立版本 `0.1.0`，其发布策略不随 SDK 版本改变。

契约来自已批准的公开 [Node 源码 ce60499](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/commit/ce60499)。该不可变基线的 package metadata 为 `0.4.0`，类型为 `approved-source`；保留这一来源，不宣称 npm `0.5.0` 已发布。

支持环境：Node.js >=22.12.0，仅支持 ESM。

### 验证与剩余门禁

在源码目录运行：

```bash
pnpm check
pnpm public:check
git diff --check
```

审查精确 candidate diff 及包/归档内容，在干净 consumer 中安装本地产物并确认版本和公开 import。这些是准备门禁，不表示本说明中的命令或 release CI 已通过。

本次准备不执行 tag、registry 发布、GitHub Release、部署或真实账号 E2E。最终已审查 release commit 必须通过 CI；受控 staging/provider E2E 和发布后的 registry/module 解析仍是独立门禁。发布前重跑具有时效性的漏洞检查；回退限制见[迁移指南](migration.md)。

## 0.4.0 - 2026-07-31

### Provider 账号资料与消息引用句柄

- `Account.provider_profile` 现在使用 `ProviderProfile`。其可选标准字段包括 `id`、`phone`、`username`、`display_name`、`first_name`、`last_name`、`avatar_url` 与 `bio`；仍允许 provider 特有字段。
- `SendMessageResult` 新增可选的 `reply_token`。返回时，它是可通过 `reply_to.reply_token` 原样回传的不透明敏感句柄；调用方不得解析或自行构造。
- 可能包含 `provider_profile` 或 `reply_token` 的响应归类为敏感输出。仅在受控应用代码中处理；不得记录完整响应，也不得将其放入模型上下文。

兼容性：这些响应 schema 变更是增量且 wire-compatible 的。所有标准资料字段与 `reply_token` 均为可选，现有 provider 特有的 `provider_profile` 字段仍然有效，调用方也必须继续处理字段缺失的情况。公开接口面仍为 64 个 operation；`X-Api-Key` 鉴权、重试分类与 MCP exposure 均未变化。

该版本的 npm 发布、Git tag 与全新安装验证与本次源码发布准备分开记录。

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
