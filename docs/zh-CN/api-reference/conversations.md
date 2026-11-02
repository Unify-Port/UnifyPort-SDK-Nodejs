<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Conversations

[English](../../api-reference/conversations.md) | [简体中文](conversations.md)

[返回 API Reference 索引](README.md)

会话列表、详情、成员、历史补拉、读写状态、静音、置顶与标签。

## 本页 operation

- [`deleteConversationLabel`](#delete-conversation-label)：删除会话标签
- [`getConversation`](#get-conversation)：获取会话详情
- [`listConversationLabels`](#list-conversation-labels)：列出会话标签
- [`listConversationMembers`](#list-conversation-members)：列出会话成员
- [`listConversations`](#list-conversations)：列出会话
- [`markConversationRead`](#mark-conversation-read)：标记会话已读
- [`markConversationUnread`](#mark-conversation-unread)：标记会话未读
- [`muteConversation`](#mute-conversation)：静音会话
- [`pinConversation`](#pin-conversation)：置顶会话
- [`requestConversationHistory`](#request-conversation-history)：请求补拉会话历史消息
- [`setConversationLabelMembers`](#set-conversation-label-members)：给会话打标或移除标签
- [`unmuteConversation`](#unmute-conversation)：取消静音会话
- [`unpinConversation`](#unpin-conversation)：取消置顶会话
- [`upsertConversationLabel`](#upsert-conversation-label)：新建或更新会话标签

---

<a id="delete-conversation-label"></a>

## `deleteConversationLabel`

删除会话标签

| 属性     | 值                                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/labels/delete`                      |
| SDK 方法 | `device.deleteConversationLabel(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deleteConversationLabel"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                       |
| 变更类型 | `destructive`                                                                       |
| 自动重试 | 不自动重试                                                                          |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型     | 约束 | 说明 |
| --------------- | ---- | -------- | ---- | ---- |
| `body.label_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 删除结果。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                            | 约束       | 说明                                           |
| ------------------------------- | ---- | ------------------------------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                        | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                        | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `ConversationLabelDeleteResult` | -          | -                                              |
| `result.data.data.label_id`     | 是   | `string`                        | -          | -                                              |
| `result.data.data.deleted`      | 是   | `boolean`                       | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.deleteConversationLabel({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    label_id: "label_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="get-conversation"></a>

## `getConversation`

获取会话详情

查询目标会话详情。WhatsApp 群明确不存在或当前账号未参与该群时，返回 HTTP 404， `error.code` 为 `conversation_not_found`；`error.numeric_code` 分别为 `34004`（群不存在） 或 `34011`（账号未参与该群）。这类错误不应按临时网关故障自动重试。 未知上游业务失败、网络异常和超时仍返回 HTTP 502。

| 属性     | 值                                                                          |
| -------- | --------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations/info`                        |
| SDK 方法 | `device.getConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                               |
| 变更类型 | `read`                                                                      |
| 自动重试 | 允许安全重试                                                                |

### 参数

| SDK 字段                       | 位置  | 必填 | 类型               | 示例                 | 约束                            | 说明                                                     |
| ------------------------------ | ----- | ---- | ------------------ | -------------------- | ------------------------------- | -------------------------------------------------------- |
| `params.path.account_id`       | path  | 是   | `string`           | `"acc_xxx"`          | -                               | device-api 签发的账号 public_id，例如 `acc_xxx`。        |
| `params.query.conversation_id` | query | 是   | `string`           | `"conversation_xxx"` | -                               | 渠道侧会话标识，部分渠道的标识可能包含 `@`、`:` 等字符。 |
| `params.query.type`            | query | 否   | `ConversationType` | `"user"`             | enum="user", "group", "channel" | 会话类型；按枚举原值精确匹配，不执行去空格或大小写转换。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 会话详情。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 会话不存在或当前账号无法访问目标群；群不存在与未参与群通过细分数字码区分。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                           | 必有 | 类型                       | 约束                            | 说明                                                                                                                                                       |
| ---------------------------------------------- | ---- | -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                       | 否   | `string`                   | -                               | 服务端生成的请求 ID。                                                                                                                                      |
| `result.data.client_request_id`                | 否   | `string`                   | -                               | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                             |
| `result.data.data`                             | 是   | `Conversation`             | -                               | -                                                                                                                                                          |
| `result.data.data.conversation_id`             | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.type`                        | 是   | `ConversationType`         | enum="user", "group", "channel" | 标准会话类型；WhatsApp 社群公告群继续使用 group。                                                                                                          |
| `result.data.data.title`                       | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.username`                    | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.avatar_url`                  | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.description`                 | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.last_message_at`             | 否   | `string (date-time)`       | -                               | -                                                                                                                                                          |
| `result.data.data.last_message_text`           | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.unread_count`                | 是   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.members_count`               | 否   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.subscribers_count`           | 否   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.is_pinned`                   | 是   | `boolean`                  | -                               | -                                                                                                                                                          |
| `result.data.data.is_muted`                    | 是   | `boolean`                  | -                               | -                                                                                                                                                          |
| `result.data.data.created_at`                  | 否   | `string (date-time)`       | -                               | -                                                                                                                                                          |
| `result.data.data.extra`                       | 否   | `Record<string, unknown>`  | -                               | 渠道扩展字段；WhatsApp 群会话可包含公告群分类，会话列表不保证提供该分类。                                                                                  |
| `result.data.data.extra.is_announcement_group` | 否   | `boolean`                  | -                               | 仅 WhatsApp 群会话提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。分类不表示当前账号具备发送权限。 |

### TypeScript 示例

```ts
const result = await device.getConversation({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      conversation_id: "conversation_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-conversation-labels"></a>

## `listConversationLabels`

列出会话标签

| 属性     | 值                                                                                 |
| -------- | ---------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations/labels`                             |
| SDK 方法 | `device.listConversationLabels(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listConversationLabels"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                      |
| 变更类型 | `read`                                                                             |
| 自动重试 | 允许安全重试                                                                       |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束                   | 说明                                                                                                                                                                                  |
| ------------------------ | ----- | ---- | --------- | -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -                      | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                     |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | -                      | Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。 |
| `params.query.limit`     | query | 否   | `integer` | `1`            | minimum=1, maximum=100 | 每页返回数量。                                                                                                                                                                        |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 会话标签分页列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                          | 约束 | 说明                                           |
| ------------------------------- | ---- | ----------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                      | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                      | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `ConversationLabelListResult` | -    | -                                              |
| `result.data.data.items`        | 是   | `Array<ConversationLabel>`    | -    | -                                              |
| `result.data.data.items[].id`   | 是   | `string`                      | -    | -                                              |
| `result.data.data.items[].name` | 是   | `string`                      | -    | -                                              |
| `result.data.data.next_cursor`  | 否   | `string`                      | -    | -                                              |
| `result.data.data.has_more`     | 是   | `boolean`                     | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.listConversationLabels({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      limit: 1
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-conversation-members"></a>

## `listConversationMembers`

列出会话成员

| 属性     | 值                                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations/members`                             |
| SDK 方法 | `device.listConversationMembers(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listConversationMembers"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                       |
| 变更类型 | `read`                                                                              |
| 自动重试 | 允许安全重试                                                                        |

### 参数

| SDK 字段                       | 位置  | 必填 | 类型               | 示例                 | 约束                            | 说明                                                                                                                                                                                  |
| ------------------------------ | ----- | ---- | ------------------ | -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id`       | path  | 是   | `string`           | `"acc_xxx"`          | -                               | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                     |
| `params.query.conversation_id` | query | 是   | `string`           | `"conversation_xxx"` | -                               | 渠道侧会话标识，部分渠道的标识可能包含 `@`、`:` 等字符。                                                                                                                              |
| `params.query.type`            | query | 否   | `ConversationType` | `"user"`             | enum="user", "group", "channel" | 会话类型；按枚举原值精确匹配，不执行去空格或大小写转换。                                                                                                                              |
| `params.query.cursor`          | query | 否   | `string`           | `"cursor_xxx"`       | -                               | Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。 |
| `params.query.limit`           | query | 否   | `integer`          | `1`                  | minimum=1, maximum=100          | 每页返回数量。                                                                                                                                                                        |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 会话成员分页列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型                                               | 约束                                 | 说明                                                                                                           |
| --------------------------------------- | ---- | -------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`                                           | -                                    | 服务端生成的请求 ID。                                                                                          |
| `result.data.client_request_id`         | 否   | `string`                                           | -                                    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                 |
| `result.data.data`                      | 是   | `ConversationMemberListResult`                     | -                                    | -                                                                                                              |
| `result.data.data.items`                | 是   | `Array<ConversationMember>`                        | -                                    | -                                                                                                              |
| `result.data.data.items[].peer_id`      | 是   | `string`                                           | -                                    | 成员的渠道侧稳定标识，请按不透明字符串保存和使用。                                                             |
| `result.data.data.items[].username`     | 否   | `string`                                           | -                                    | -                                                                                                              |
| `result.data.data.items[].display_name` | 是   | `string`                                           | -                                    | -                                                                                                              |
| `result.data.data.items[].avatar_url`   | 是   | `string`                                           | -                                    | -                                                                                                              |
| `result.data.data.items[].role`         | 否   | `string enum("member" \| "admin" \| "superadmin")` | enum="member", "admin", "superadmin" | 标准化成员角色。群主或创建者为 `superadmin`，管理员为 `admin`，普通成员以及暂时无法识别权限的成员为 `member`。 |
| `result.data.data.items[].joined_at`    | 否   | `string (date-time)`                               | -                                    | -                                                                                                              |
| `result.data.data.items[].extra`        | 否   | `FreeFormObject`                                   | -                                    | -                                                                                                              |
| `result.data.data.next_cursor`          | 否   | `string`                                           | -                                    | -                                                                                                              |
| `result.data.data.has_more`             | 是   | `boolean`                                          | -                                    | -                                                                                                              |

### TypeScript 示例

```ts
const result = await device.listConversationMembers({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      conversation_id: "conversation_xxx",
      limit: 1
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-conversations"></a>

## `listConversations`

列出会话

WhatsApp 未提供 label_id 时返回“特别关注”会话，提供时返回指定标签成员；其他 Provider 使用各自的默认会话语义。 Twitter 仅返回用户会话；next_cursor 是不透明值，has_more 为 true 时调用方应将其原样用于下一页，分页结束时 has_more 为 false 且不返回 next_cursor。格式非法或不完整的 cursor 返回 400 provider_invalid_request。

| 属性     | 值                                                                            |
| -------- | ----------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations`                               |
| SDK 方法 | `device.listConversations(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listConversations"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                 |
| 变更类型 | `read`                                                                        |
| 自动重试 | 允许安全重试                                                                  |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束                   | 说明                                                                                                                                                                                                                          |
| ------------------------ | ----- | ---- | --------- | -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -                      | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                                                             |
| `params.query.type`      | query | 否   | `string`  | `"user"`       | -                      | 会话类型过滤，支持逗号分隔多选；每一项按枚举原值精确匹配，不忽略空项。 可选值为 `user`、`group`、`channel`；非法值返回 400 invalid_conversation_type。 WhatsApp 的 `group` 包含社群公告群，所有群会话的返回类型均为 `group`。 |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | -                      | Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。                                         |
| `params.query.limit`     | query | 否   | `integer` | `1`            | minimum=1, maximum=100 | 每页返回数量。                                                                                                                                                                                                                |
| `params.query.label_id`  | query | 否   | `string`  | `"label_xxx"`  | -                      | WhatsApp 会话标签 ID；未提供时返回“特别关注”会话。                                                                                                                                                                            |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 会话分页列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                                   | 必有 | 类型                       | 约束                            | 说明                                                                                                                                                       |
| ------------------------------------------------------ | ---- | -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                               | 否   | `string`                   | -                               | 服务端生成的请求 ID。                                                                                                                                      |
| `result.data.client_request_id`                        | 否   | `string`                   | -                               | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                             |
| `result.data.data`                                     | 是   | `ConversationListResult`   | -                               | -                                                                                                                                                          |
| `result.data.data.items`                               | 是   | `Array<Conversation>`      | -                               | -                                                                                                                                                          |
| `result.data.data.items[].conversation_id`             | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].type`                        | 是   | `ConversationType`         | enum="user", "group", "channel" | 标准会话类型；WhatsApp 社群公告群继续使用 group。                                                                                                          |
| `result.data.data.items[].title`                       | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].username`                    | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].avatar_url`                  | 是   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].description`                 | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].last_message_at`             | 否   | `string (date-time)`       | -                               | -                                                                                                                                                          |
| `result.data.data.items[].last_message_text`           | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.items[].unread_count`                | 是   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.items[].members_count`               | 否   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.items[].subscribers_count`           | 否   | `number \| string (int64)` | -                               | -                                                                                                                                                          |
| `result.data.data.items[].is_pinned`                   | 是   | `boolean`                  | -                               | -                                                                                                                                                          |
| `result.data.data.items[].is_muted`                    | 是   | `boolean`                  | -                               | -                                                                                                                                                          |
| `result.data.data.items[].created_at`                  | 否   | `string (date-time)`       | -                               | -                                                                                                                                                          |
| `result.data.data.items[].extra`                       | 否   | `Record<string, unknown>`  | -                               | 渠道扩展字段；WhatsApp 群会话可包含公告群分类，会话列表不保证提供该分类。                                                                                  |
| `result.data.data.items[].extra.is_announcement_group` | 否   | `boolean`                  | -                               | 仅 WhatsApp 群会话提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。分类不表示当前账号具备发送权限。 |
| `result.data.data.next_cursor`                         | 否   | `string`                   | -                               | -                                                                                                                                                          |
| `result.data.data.has_more`                            | 是   | `boolean`                  | -                               | -                                                                                                                                                          |

### TypeScript 示例

```ts
const result = await device.listConversations({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      limit: 1
    }
  }
});
console.log(result.data.data);
```

---

<a id="mark-conversation-read"></a>

## `markConversationRead`

标记会话已读

按账号所属渠道校验已读目标。Telegram 必须提供单个 up_to_message_id， 来自当前账号在该会话收到的消息，例如 message.received 的 data.message.id，且 data.message.direction=inbound；不能使用发送响应的 data.message_id 或事件顶层 id。 将当前账号在该会话中截至该消息（含自身及此前消息）的记录标为已读； 不支持省略消息 ID 标记整个会话，也不支持非空 up_to_message_sender_id。 WhatsApp 的消息级已读须成对提供非空 up_to_message_id 和 up_to_message_sender_id； 省略两者，或两者去除首尾空白后均为空时，标记整个会话。成功返回 data.ok=true；本次操作不查询对方已读状态，也不新增 Webhook 事件。

| 属性     | 值                                                                               |
| -------- | -------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/read`                            |
| SDK 方法 | `device.markConversationRead(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["markConversationRead"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                    |
| 变更类型 | `write`                                                                          |
| 自动重试 | 不自动重试                                                                       |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                           | 必填 | 类型     | 约束 | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ---- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `body.conversation_id`         | 是   | `string` | -    | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `body.up_to_message_id`        | 否   | `string` | -    | 按账号所属渠道校验，字段类型始终为字符串。 Telegram 必填：当前账号在该会话收到的单个消息 ID，例如 message.received 的 data.message.id，且 data.message.direction=inbound。 去除首尾空白后必须只含 ASCII 十进制数字，数值范围为 1–2147483647； 截止该消息（含自身及此前消息）标记已读。不能使用逗号列表、正负号、小数、指数、内部空白或非 ASCII 数字，不能省略或使用 0 表示整个会话。 WhatsApp 可选：一个消息 ID，或属于同一发送者的多个消息 ID（英文逗号分隔）； 与 up_to_message_sender_id 成对提供非空值。省略两者时标记整个会话已读；两者去除首尾空白后均为空时同样标记整个会话。 |
| `body.up_to_message_sender_id` | 否   | `string` | -    | WhatsApp 消息级已读的渠道侧发送者标识，与非空 up_to_message_id 成对提供；群聊应传 Webhook 事件中的 data.sender.id。多个消息 ID 必须属于同一发送者。Telegram 不支持此参数，提供非空值时返回 invalid_request。                                                                                                                                                                                                                                                                                                                                                                         |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求字段或当前渠道的已读目标无效时返回 invalid_request（10000）；渠道拒绝参数时返回 provider_invalid_request（30001）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.markConversationRead({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "-1001234567890",
    up_to_message_id: "12345"
  }
});
console.log(result.data.data);
```

---

<a id="mark-conversation-unread"></a>

## `markConversationUnread`

标记会话未读

| 属性     | 值                                                                                 |
| -------- | ---------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/unread`                            |
| SDK 方法 | `device.markConversationUnread(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["markConversationUnread"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                      |
| 变更类型 | `write`                                                                            |
| 自动重试 | 不自动重试                                                                         |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.markConversationUnread({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "conversation_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="mute-conversation"></a>

## `muteConversation`

静音会话

| 属性     | 值                                                                           |
| -------- | ---------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/mute`                        |
| SDK 方法 | `device.muteConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["muteConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                |
| 变更类型 | `write`                                                                      |
| 自动重试 | 不自动重试                                                                   |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型                 | 约束      | 说明                                       |
| ---------------------- | ---- | -------------------- | --------- | ------------------------------------------ |
| `body.conversation_id` | 是   | `string`             | -         | -                                          |
| `body.duration`        | 否   | `integer (int64)`    | minimum=0 | 相对静音时长，单位秒；0 表示永久静音。     |
| `body.mute_until`      | 否   | `string (date-time)` | -         | RFC3339 绝对结束时间，与 `duration` 互斥。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.muteConversation({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "conversation_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="pin-conversation"></a>

## `pinConversation`

置顶会话

| 属性     | 值                                                                          |
| -------- | --------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/pin`                        |
| SDK 方法 | `device.pinConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["pinConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                               |
| 变更类型 | `write`                                                                     |
| 自动重试 | 不自动重试                                                                  |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.pinConversation({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "conversation_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="request-conversation-history"></a>

## `requestConversationHistory`

请求补拉会话历史消息

仅支持 provider=whatsapp 的私聊，不包含 whatsapp-protocol；使用同一会话中一条原生内容消息的完整 before 请求更早的历史。 account_id 必须是单个非空路径段，不能包含空白或斜杠（包括编码斜杠）；入口账号参数校验失败返回 400 invalid_request。 HTTP 202 和 data.status=accepted 仅表示补拉请求已受理，不同步返回消息，也不表示历史已经拉取完成。 先订阅 conversation.history，再发起请求；可用历史批次通过该事件异步返回，并携带 data.history.source=on_demand。 顶层 request_id 仅用于本次 HTTP 请求排障，不是补拉任务 ID，不能用于关联后续回调；一次请求可能对应多个、重复或晚到的批次，也可能没有回调。 继续补拉时，从已收到的原生内容消息中选择最早且 id、sent_at、direction 完整的消息构造 before。 type=call 的合成通话记录不能作为锚点；即使三个字段完整，合成记录 ID 也不是原生消息 ID。before 不增加 type 字段，由调用方选择消息时排除通话记录。 不提供下一页游标或完成状态；不能根据空批次、消息少于 limit 或等待超时判断历史已到底，HTTP 超时后也可能收到回调，不应自动重试。 群聊和频道返回 400 unsupported_conversation_type；其他渠道返回 501 unsupported_by_provider。

| 属性     | 值                                                                                     |
| -------- | -------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/history/request`                       |
| SDK 方法 | `device.requestConversationHistory(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["requestConversationHistory"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                          |
| 变更类型 | `write`                                                                                |
| 自动重试 | 不自动重试                                                                             |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                     | 必填 | 类型                                   | 约束                              | 说明                                                                                                                                                    |
| ------------------------ | ---- | -------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.conversation_id`   | 是   | `string`                               | pattern="^[0-9]+@lid$"            | WhatsApp 标准私聊 LID；必须属于 before 指向的会话，不接受手机号或其他会话类型。                                                                         |
| `body.before`            | 是   | `ConversationHistoryBefore`            | -                                 | 同一会话中同一条原生内容消息的位置；所有字段必须来自该消息，不接受 null。type=call 的合成通话记录即使三个字段完整也不能作为锚点；请求不包含 type 字段。 |
| `body.before.message_id` | 是   | `string`                               | minLength=1, pattern="\\S"        | 原生内容消息的 id；不接受合成通话记录 ID，去除首尾空白后仍为该记录格式时同样无效。不能使用顶层事件 id 或 HTTP request_id 代替。                         |
| `body.before.sent_at`    | 是   | `string (date-time)`                   | -                                 | 该消息的 RFC3339 发送时间，Unix 秒值必须大于 0；不能使用事件 occurred_at 或当前时间代替。                                                               |
| `body.before.direction`  | 是   | `string enum("inbound" \| "outbound")` | enum="inbound", "outbound"        | 该消息相对于当前账号的收发方向；inbound 为接收，outbound 为发送。                                                                                       |
| `body.limit`             | 否   | `integer`                              | minimum=1, maximum=50, default=50 | 请求数量，不保证实际返回相同数量；仅省略时默认 50，显式 null、0、非整数或超过 50 均返回 invalid_request。                                               |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `202`       | `application/json` | `ResponseMeta & object` | 补拉请求已受理，等待可用历史批次；不代表已收到消息或补拉完成。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 参数缺失或非法；invalid_request 表示请求字段或账号路径校验失败，provider_invalid_request 表示渠道参数无效（包括使用合成通话记录 ID 作为锚点），unsupported_conversation_type 表示会话类型不支持。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 账号路径格式有效，但账号不存在或不属于当前工作空间，code 为 account_not_found，numeric_code 为 20020。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 发生未分类的内部错误，code 为 request_conversation_history_failed，numeric_code 为 37016。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `202` 的响应字段：

| 字段                               | 必有 | 类型                          | 约束                  | 说明                                           |
| ---------------------------------- | ---- | ----------------------------- | --------------------- | ---------------------------------------------- |
| `result.data.request_id`           | 否   | `string`                      | -                     | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`    | 否   | `string`                      | -                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                 | 是   | `ConversationHistoryAccepted` | -                     | -                                              |
| `result.data.data.status`          | 是   | `string enum("accepted")`     | enum="accepted"       | 仅确认请求已受理，不表示收到历史或完成补拉。   |
| `result.data.data.conversation_id` | 是   | `string`                      | -                     | 本次请求的标准会话 ID。                        |
| `result.data.data.limit`           | 是   | `number \| string`            | minimum=1, maximum=50 | 本次实际请求的数量上限。                       |

### TypeScript 示例

```ts
const result = await device.requestConversationHistory({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "100000000000002@lid",
    before: {
      message_id: "MSG_HISTORY_ANCHOR_001",
      sent_at: "2026-09-28T03:00:00Z",
      direction: "inbound"
    },
    limit: 50
  }
});
console.log(result.data.data);
```

---

<a id="set-conversation-label-members"></a>

## `setConversationLabelMembers`

给会话打标或移除标签

| 属性     | 值                                                                                      |
| -------- | --------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/labels`                                 |
| SDK 方法 | `device.setConversationLabelMembers(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["setConversationLabelMembers"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                           |
| 变更类型 | `write`                                                                                 |
| 自动重试 | 不自动重试                                                                              |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                    | 必填 | 类型                             | 约束                 | 说明 |
| ----------------------- | ---- | -------------------------------- | -------------------- | ---- |
| `body.label_id`         | 是   | `string`                         | -                    | -    |
| `body.action`           | 是   | `string enum("add" \| "remove")` | enum="add", "remove" | -    |
| `body.conversation_ids` | 是   | `Array<string>`                  | minItems=1           | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 标签成员操作结果。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型                             | 约束                 | 说明                                           |
| ----------------------------------- | ---- | -------------------------------- | -------------------- | ---------------------------------------------- |
| `result.data.request_id`            | 否   | `string`                         | -                    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`     | 否   | `string`                         | -                    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                  | 是   | `ConversationLabelMembersResult` | -                    | -                                              |
| `result.data.data.label_id`         | 是   | `string`                         | -                    | -                                              |
| `result.data.data.action`           | 是   | `string enum("add" \| "remove")` | enum="add", "remove" | -                                              |
| `result.data.data.conversation_ids` | 是   | `Array<string>`                  | -                    | -                                              |

### TypeScript 示例

```ts
const result = await device.setConversationLabelMembers({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    label_id: "label_xxx",
    action: "add",
    conversation_ids: ["conversation_xxx"]
  }
});
console.log(result.data.data);
```

---

<a id="unmute-conversation"></a>

## `unmuteConversation`

取消静音会话

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/unmute`                        |
| SDK 方法 | `device.unmuteConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["unmuteConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `write`                                                                        |
| 自动重试 | 不自动重试                                                                     |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.unmuteConversation({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "conversation_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="unpin-conversation"></a>

## `unpinConversation`

取消置顶会话

| 属性     | 值                                                                            |
| -------- | ----------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/unpin`                        |
| SDK 方法 | `device.unpinConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["unpinConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                 |
| 变更类型 | `write`                                                                       |
| 自动重试 | 不自动重试                                                                    |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.unpinConversation({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    conversation_id: "conversation_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="upsert-conversation-label"></a>

## `upsertConversationLabel`

新建或更新会话标签

| 属性     | 值                                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/conversations/labels/upsert`                      |
| SDK 方法 | `device.upsertConversationLabel(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["upsertConversationLabel"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                       |
| 变更类型 | `write`                                                                             |
| 自动重试 | 不自动重试                                                                          |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型     | 约束 | 说明                         |
| --------------- | ---- | -------- | ---- | ---------------------------- |
| `body.label_id` | 否   | `string` | -    | 为空表示新建，非空表示更新。 |
| `body.name`     | 是   | `string` | -    | -                            |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 新建或更新后的标签。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                | 约束 | 说明                                           |
| ------------------------------- | ---- | ------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`            | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`            | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `ConversationLabel` | -    | -                                              |
| `result.data.data.id`           | 是   | `string`            | -    | -                                              |
| `result.data.data.name`         | 是   | `string`            | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.upsertConversationLabel({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    name: "Example"
  }
});
console.log(result.data.data);
```
