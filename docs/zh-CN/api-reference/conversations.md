<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Conversations

[English](../../api-reference/conversations.md) | [简体中文](conversations.md)

[返回 API Reference 索引](README.md)

会话列表、详情、成员、读写状态、静音、置顶与标签。

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型     | 约束 | 说明 |
| --------------- | ---- | -------- | ---- | ---- |
| `body.label_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 删除结果。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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

| 属性     | 值                                                                          |
| -------- | --------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations/info`                        |
| SDK 方法 | `device.getConversation(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getConversation"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                               |
| 变更类型 | `read`                                                                      |
| 自动重试 | 允许安全重试                                                                |

### 参数

| SDK 字段                       | 位置  | 必填 | 类型               | 示例                 | 约束                            | 说明                                                           |
| ------------------------------ | ----- | ---- | ------------------ | -------------------- | ------------------------------- | -------------------------------------------------------------- |
| `params.path.account_id`       | path  | 是   | `string`           | `"acc_xxx"`          | -                               | Device API 签发的账号 public_id，例如 `acc_xxx`。              |
| `params.query.conversation_id` | query | 是   | `string`           | `"conversation_xxx"` | -                               | provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。 |
| `params.query.type`            | query | 否   | `ConversationType` | `"user"`             | enum="user", "group", "channel" | 会话类型。                                                     |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 会话详情。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                       | 约束                            | 说明                                           |
| ------------------------------------ | ---- | -------------------------- | ------------------------------- | ---------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                   | -                               | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`      | 否   | `string`                   | -                               | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                   | 是   | `Conversation`             | -                               | -                                              |
| `result.data.data.conversation_id`   | 是   | `string`                   | -                               | -                                              |
| `result.data.data.type`              | 是   | `ConversationType`         | enum="user", "group", "channel" | -                                              |
| `result.data.data.title`             | 是   | `string`                   | -                               | -                                              |
| `result.data.data.username`          | 否   | `string`                   | -                               | -                                              |
| `result.data.data.avatar_url`        | 是   | `string`                   | -                               | -                                              |
| `result.data.data.description`       | 否   | `string`                   | -                               | -                                              |
| `result.data.data.last_message_at`   | 否   | `string (date-time)`       | -                               | -                                              |
| `result.data.data.last_message_text` | 否   | `string`                   | -                               | -                                              |
| `result.data.data.unread_count`      | 是   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.members_count`     | 否   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.subscribers_count` | 否   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.is_pinned`         | 是   | `boolean`                  | -                               | -                                              |
| `result.data.data.is_muted`          | 是   | `boolean`                  | -                               | -                                              |
| `result.data.data.created_at`        | 否   | `string (date-time)`       | -                               | -                                              |
| `result.data.data.extra`             | 否   | `FreeFormObject`           | -                               | -                                              |

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

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束      | 说明                                              |
| ------------------------ | ----- | ---- | --------- | -------------- | --------- | ------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -         | Device API 签发的账号 public_id，例如 `acc_xxx`。 |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | -         | 上一次响应返回的 `next_cursor`。                  |
| `params.query.limit`     | query | 否   | `integer` | `1`            | minimum=1 | 每页数量；未提供时的默认值可能因 provider 而异。  |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 会话标签分页列表。                         |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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

| SDK 字段                       | 位置  | 必填 | 类型               | 示例                 | 约束                            | 说明                                                           |
| ------------------------------ | ----- | ---- | ------------------ | -------------------- | ------------------------------- | -------------------------------------------------------------- |
| `params.path.account_id`       | path  | 是   | `string`           | `"acc_xxx"`          | -                               | Device API 签发的账号 public_id，例如 `acc_xxx`。              |
| `params.query.conversation_id` | query | 是   | `string`           | `"conversation_xxx"` | -                               | provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。 |
| `params.query.type`            | query | 否   | `ConversationType` | `"user"`             | enum="user", "group", "channel" | 会话类型。                                                     |
| `params.query.cursor`          | query | 否   | `string`           | `"cursor_xxx"`       | -                               | 上一次响应返回的 `next_cursor`。                               |
| `params.query.limit`           | query | 否   | `integer`          | `1`                  | minimum=1                       | 每页数量；未提供时的默认值可能因 provider 而异。               |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 会话成员分页列表。                         |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型                           | 约束 | 说明                                                                                                     |
| --------------------------------------- | ---- | ------------------------------ | ---- | -------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`                       | -    | 服务端生成的请求 ID。                                                                                    |
| `result.data.client_request_id`         | 否   | `string`                       | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                           |
| `result.data.data`                      | 是   | `ConversationMemberListResult` | -    | -                                                                                                        |
| `result.data.data.items`                | 是   | `Array<ConversationMember>`    | -    | -                                                                                                        |
| `result.data.data.items[].peer_id`      | 是   | `string`                       | -    | 成员的 provider 侧稳定标识。WhatsApp 优先返回 LID，缺少 LID 映射时回退 JID；纯手机号位于 `extra.phone`。 |
| `result.data.data.items[].username`     | 否   | `string`                       | -    | -                                                                                                        |
| `result.data.data.items[].display_name` | 是   | `string`                       | -    | -                                                                                                        |
| `result.data.data.items[].avatar_url`   | 是   | `string`                       | -    | -                                                                                                        |
| `result.data.data.items[].role`         | 否   | `string`                       | -    | -                                                                                                        |
| `result.data.data.items[].joined_at`    | 否   | `string (date-time)`           | -    | -                                                                                                        |
| `result.data.data.items[].extra`        | 否   | `FreeFormObject`               | -    | -                                                                                                        |
| `result.data.data.next_cursor`          | 否   | `string`                       | -    | -                                                                                                        |
| `result.data.data.has_more`             | 是   | `boolean`                      | -    | -                                                                                                        |

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

| 属性     | 值                                                                            |
| -------- | ----------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/conversations`                               |
| SDK 方法 | `device.listConversations(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listConversations"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                 |
| 变更类型 | `read`                                                                        |
| 自动重试 | 允许安全重试                                                                  |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束      | 说明                                              |
| ------------------------ | ----- | ---- | --------- | -------------- | --------- | ------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -         | Device API 签发的账号 public_id，例如 `acc_xxx`。 |
| `params.query.type`      | query | 否   | `string`  | `"user"`       | -         | 会话类型过滤，支持逗号分隔多选。                  |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | -         | 上一次响应返回的 `next_cursor`。                  |
| `params.query.limit`     | query | 否   | `integer` | `1`            | minimum=1 | 每页数量；未提供时的默认值可能因 provider 而异。  |
| `params.query.label_id`  | query | 否   | `string`  | `"label_xxx"`  | -         | 按会话标签过滤。                                  |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 会话分页列表。                             |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                         | 必有 | 类型                       | 约束                            | 说明                                           |
| -------------------------------------------- | ---- | -------------------------- | ------------------------------- | ---------------------------------------------- |
| `result.data.request_id`                     | 否   | `string`                   | -                               | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`              | 否   | `string`                   | -                               | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                           | 是   | `ConversationListResult`   | -                               | -                                              |
| `result.data.data.items`                     | 是   | `Array<Conversation>`      | -                               | -                                              |
| `result.data.data.items[].conversation_id`   | 是   | `string`                   | -                               | -                                              |
| `result.data.data.items[].type`              | 是   | `ConversationType`         | enum="user", "group", "channel" | -                                              |
| `result.data.data.items[].title`             | 是   | `string`                   | -                               | -                                              |
| `result.data.data.items[].username`          | 否   | `string`                   | -                               | -                                              |
| `result.data.data.items[].avatar_url`        | 是   | `string`                   | -                               | -                                              |
| `result.data.data.items[].description`       | 否   | `string`                   | -                               | -                                              |
| `result.data.data.items[].last_message_at`   | 否   | `string (date-time)`       | -                               | -                                              |
| `result.data.data.items[].last_message_text` | 否   | `string`                   | -                               | -                                              |
| `result.data.data.items[].unread_count`      | 是   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.items[].members_count`     | 否   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.items[].subscribers_count` | 否   | `number \| string (int64)` | -                               | -                                              |
| `result.data.data.items[].is_pinned`         | 是   | `boolean`                  | -                               | -                                              |
| `result.data.data.items[].is_muted`          | 是   | `boolean`                  | -                               | -                                              |
| `result.data.data.items[].created_at`        | 否   | `string (date-time)`       | -                               | -                                              |
| `result.data.data.items[].extra`             | 否   | `FreeFormObject`           | -                               | -                                              |
| `result.data.data.next_cursor`               | 否   | `string`                   | -                               | -                                              |
| `result.data.data.has_more`                  | 是   | `boolean`                  | -                               | -                                              |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                           | 必填 | 类型     | 约束 | 说明                                                                                                                |
| ------------------------------ | ---- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------- |
| `body.conversation_id`         | 是   | `string` | -    | -                                                                                                                   |
| `body.up_to_message_id`        | 否   | `string` | -    | 可选。WhatsApp 中与 up_to_message_sender_id 一起发送目标消息的 read receipt；省略两者时标记整个会话已读。           |
| `body.up_to_message_sender_id` | 否   | `string` | -    | up_to_message_id 对应消息的 provider 原始发送者 ID；群聊应传 webhook data.sender.id。与 up_to_message_id 成对必填。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
    conversation_id: "conversation_xxx"
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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型                 | 约束      | 说明                                       |
| ---------------------- | ---- | -------------------- | --------- | ------------------------------------------ |
| `body.conversation_id` | 是   | `string`             | -         | -                                          |
| `body.duration`        | 否   | `integer (int64)`    | minimum=0 | 相对静音时长，单位秒；0 表示永久静音。     |
| `body.mute_until`      | 否   | `string (date-time)` | -         | RFC3339 绝对结束时间，与 `duration` 互斥。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                    | 必填 | 类型                             | 约束                 | 说明 |
| ----------------------- | ---- | -------------------------------- | -------------------- | ---- |
| `body.label_id`         | 是   | `string`                         | -                    | -    |
| `body.action`           | 是   | `string enum("add" \| "remove")` | enum="add", "remove" | -    |
| `body.conversation_ids` | 是   | `Array<string>`                  | minItems=1           | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 标签成员操作结果。                         |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.conversation_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型     | 约束 | 说明                         |
| --------------- | ---- | -------- | ---- | ---------------------------- |
| `body.label_id` | 否   | `string` | -    | 为空表示新建，非空表示更新。 |
| `body.name`     | 是   | `string` | -    | -                            |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 新建或更新后的标签。                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

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
