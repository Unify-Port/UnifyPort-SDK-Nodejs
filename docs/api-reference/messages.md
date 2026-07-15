<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Messages

[返回 API Reference 索引](README.md)

统一消息发送与消息动作。

## 本页 operation

- [`editMessage`](#edit-message)：编辑消息文本
- [`pinMessage`](#pin-message)：置顶或取消置顶消息
- [`reactMessage`](#react-message)：给消息加表情回应或取消回应
- [`revokeMessage`](#revoke-message)：撤回消息
- [`sendMessage`](#send-message)：发送消息

---

<a id="edit-message"></a>

## `editMessage`

编辑消息文本

当前主要由支持该能力的 provider 实现，通常仅支持文本消息。

| 属性     | 值                                                                      |
| -------- | ----------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/messages/edit`                                              |
| SDK 方法 | `device.editMessage(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["editMessage"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                           |
| 变更类型 | `write`                                                                 |
| 自动重试 | 不自动重试                                                              |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明 |
| ---------------------- | ---- | -------- | ---- | ---- |
| `body.account_id`      | 是   | `string` | -    | -    |
| `body.conversation_id` | 是   | `string` | -    | -    |
| `body.message_id`      | 是   | `string` | -    | -    |
| `body.content`         | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
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
const result = await device.editMessage({
  body: {
    account_id: "acc_xxx",
    conversation_id: "conversation_xxx",
    message_id: "message_xxx",
    content: "Example text"
  }
});
console.log(result.data.data);
```

---

<a id="pin-message"></a>

## `pinMessage`

置顶或取消置顶消息

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/messages/pin`                                              |
| SDK 方法 | `device.pinMessage(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["pinMessage"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `write`                                                                |
| 自动重试 | 不自动重试                                                             |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                    | 必填 | 类型               | 约束 | 说明                                     |
| ----------------------- | ---- | ------------------ | ---- | ---------------------------------------- |
| `body.account_id`       | 是   | `string`           | -    | -                                        |
| `body.conversation_id`  | 是   | `string`           | -    | -                                        |
| `body.message_id`       | 是   | `string`           | -    | -                                        |
| `body.sender_id`        | 否   | `string`           | -    | 目标消息作者标识；缺省通常表示账号自身。 |
| `body.pinned`           | 是   | `boolean`          | -    | -                                        |
| `body.duration_seconds` | 否   | `integer (uint32)` | -    | -                                        |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
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
const result = await device.pinMessage({
  body: {
    account_id: "acc_xxx",
    conversation_id: "conversation_xxx",
    message_id: "message_xxx",
    pinned: false
  }
});
console.log(result.data.data);
```

---

<a id="react-message"></a>

## `reactMessage`

给消息加表情回应或取消回应

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/messages/reaction`                                           |
| SDK 方法 | `device.reactMessage(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["reactMessage"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `write`                                                                  |
| 自动重试 | 不自动重试                                                               |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明                                     |
| ---------------------- | ---- | -------- | ---- | ---------------------------------------- |
| `body.account_id`      | 是   | `string` | -    | -                                        |
| `body.conversation_id` | 是   | `string` | -    | -                                        |
| `body.message_id`      | 是   | `string` | -    | -                                        |
| `body.sender_id`       | 否   | `string` | -    | 目标消息作者标识；缺省通常表示账号自身。 |
| `body.emoji`           | 否   | `string` | -    | 空字符串表示取消回应。                   |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
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
const result = await device.reactMessage({
  body: {
    account_id: "acc_xxx",
    conversation_id: "conversation_xxx",
    message_id: "message_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="revoke-message"></a>

## `revokeMessage`

撤回消息

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/messages/revoke`                                              |
| SDK 方法 | `device.revokeMessage(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["revokeMessage"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `destructive`                                                             |
| 自动重试 | 不自动重试                                                                |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                   | 必填 | 类型     | 约束 | 说明                                     |
| ---------------------- | ---- | -------- | ---- | ---------------------------------------- |
| `body.account_id`      | 是   | `string` | -    | -                                        |
| `body.conversation_id` | 是   | `string` | -    | -                                        |
| `body.message_id`      | 是   | `string` | -    | -                                        |
| `body.sender_id`       | 否   | `string` | -    | 目标消息作者标识；缺省通常表示账号自身。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
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
const result = await device.revokeMessage({
  body: {
    account_id: "acc_xxx",
    conversation_id: "conversation_xxx",
    message_id: "message_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="send-message"></a>

## `sendMessage`

发送消息

| 属性     | 值                                                                      |
| -------- | ----------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/messages`                                                   |
| SDK 方法 | `device.sendMessage(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["sendMessage"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                           |
| 变更类型 | `write`                                                                 |
| 自动重试 | 不自动重试                                                              |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                                       | 必填             | 类型                                                                                        | 约束                                                                  | 说明                                                   |
| ------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| `body.account_id`                          | 是               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.to`                                  | 是               | `Recipient`                                                                                 | -                                                                     | -                                                      |
| `body.to.id`                               | 是               | `string`                                                                                    | -                                                                     | provider 侧接收方 ID。                                 |
| `body.to.type`                             | 是               | `ConversationType`                                                                          | enum="user", "group", "channel"                                       | -                                                      |
| `body.message`                             | 是               | `MessagePayload`                                                                            | -                                                                     | -                                                      |
| `body.message.type`                        | 是               | `string enum("text" \| "image" \| "video" \| "audio" \| "document" \| "file" \| "contact")` | enum="text", "image", "video", "audio", "document", "file", "contact" | -                                                      |
| `body.message.text`                        | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.url`                         | 否               | `string (uri)`                                                                              | -                                                                     | -                                                      |
| `body.message.file_url`                    | 否               | `string (uri)`                                                                              | -                                                                     | -                                                      |
| `body.message.file_key`                    | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.caption`                     | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts`                    | 否               | `Array<ContactCard>`                                                                        | -                                                                     | -                                                      |
| `body.message.contacts[].name`             | 父字段存在时必填 | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts[].phones`           | 否               | `Array<ContactPhone>`                                                                       | -                                                                     | -                                                      |
| `body.message.contacts[].phones[].number`  | 父字段存在时必填 | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts[].phones[].type`    | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts[].emails`           | 否               | `Array<ContactEmail>`                                                                       | -                                                                     | -                                                      |
| `body.message.contacts[].emails[].address` | 父字段存在时必填 | `string (email)`                                                                            | -                                                                     | -                                                      |
| `body.message.contacts[].emails[].type`    | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts[].organization`     | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.message.contacts[].title`            | 否               | `string`                                                                                    | -                                                                     | -                                                      |
| `body.provider_data`                       | 否               | `FreeFormObject`                                                                            | -                                                                     | -                                                      |
| `body.reply_to`                            | 否               | `ReplyTo`                                                                                   | -                                                                     | -                                                      |
| `body.reply_to.reply_token`                | 父字段存在时必填 | `string`                                                                                    | -                                                                     | 来自入站事件 `data.message.reply_token` 的不透明句柄。 |
| `body.mentions`                            | 否               | `Array<Mention>`                                                                            | -                                                                     | -                                                      |
| `body.mentions[].id`                       | 父字段存在时必填 | `string`                                                                                    | -                                                                     | -                                                      |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 消息发送请求已被接收或完成。               |
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
| `result.data.data`              | 是   | `SendMessageResult` | -    | -                                              |
| `result.data.data.message_id`   | 是   | `string`            | -    | -                                              |
| `result.data.data.account_id`   | 是   | `string`            | -    | -                                              |
| `result.data.data.status`       | 是   | `string`            | -    | -                                              |
| `result.data.data.provider_ref` | 否   | `string`            | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.sendMessage({
  body: {
    account_id: "acc_xxx",
    to: {
      id: "recipient_xxx",
      type: "user"
    },
    message: {
      type: "text",
      text: "Hello from UnifyPort"
    }
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。
