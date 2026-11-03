# 版本说明

[English](../release-notes.md) | [简体中文](release-notes.md)

## 未发布 - Facebook

新增 facebook 渠道枚举、四个接收类型声明及八个合成示例。HTTP operation 集合、24 个标准事件名、认证、重试和 MCP 策略保持不变。穷举 provider 的分支需处理 facebook。详见 [Facebook](facebook.md)。不表示包已发布或服务已部署。

## 未发布 - 公开契约同步

当前工作源码覆盖 78 个 HTTP 操作、24 种标准事件及订阅通配符。不创建版本、tag 或 Registry 发布。

- 新增通话、计费操作查询、托管授权、Passkey、帖子及评论、按需历史、联系人添加及归属查询。
- 账号列表改为 `data.items/has_more/next_cursor`，旧数组消费代码须迁移，游标原样传回。创建与更新使用独立输入。通过 `params.header` 传可选 `Idempotency-Key`，写操作仍不自动重试。删除可返回 202 JSON 或 204 空体，后者 data 为 undefined。
- Telegram 已读不再强制携带 WhatsApp sender。同步授权步骤、运行提示、计费周期、额度使用量、账号独立端点及 WhatsApp Protocol 类型。
- 可选 `UnifyPortApiError.numericCode` 仅保留验证通过的五位数字字符串，不暴露原始 message/details。
- 消息联合类型支持 sticker/poll/link_preview 和 member/all 提及。载荷、稀疏合并与排序见 [Webhook 处理](webhook-contract.md)。
- 新增操作不进入 MCP、不自动重试；POST 帖子及评论查询为 read，挂断为 destructive，授权/通话链接与 Passkey 载荷采用敏感策略。
- 兼容性复查保证 `DeviceApiOperations` 和 `/device` 的 `operations` 导出只含 HTTP 操作；Webhook 接收操作通过 `DeviceApiWebhooks` 或 `/device` 的 `webhooks` 获取。
- 生成类型保留候选载荷的共同字段、decoded/unavailable 投票分支、关闭的限时设置、取消置顶和通话稀疏更新规则。Webhook 示例也进入生成的 TypeScript 检查。

账号分页属于响应结构破坏性变化。原 `AccountRequest` 组件应按用途替换为 `AccountCreateRequest` 或 `AccountUpdateRequest`。创建必填字段及修正后的消息/Webhook 联合类型可能在编译期暴露旧调用的非法参数。采用前迁移调用代码。本地检查不证明部署或真实账号流程。

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
