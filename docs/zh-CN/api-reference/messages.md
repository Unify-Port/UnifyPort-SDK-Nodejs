<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Messages

[English](../../api-reference/messages.md) | [简体中文](messages.md)

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

由支持该能力的渠道提供，通常仅适用于文本消息。

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

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
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

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
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

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
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

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
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

`message.type=sticker` 用于发送贴纸，当前仅 WhatsApp user/group 支持，不包含 whatsapp-protocol。 url/file_url/file_key 恰好提供一个非空来源；本期 WhatsApp 只支持 HTTP(S) url/file_url，file_key、非空 mentions 或不支持的目标返回 501 unsupported_by_provider。 API 按原字节提交 WebP，不设置静态性、像素尺寸或渠道业务大小限制；静态、动画及具体素材兼容性由渠道判定。 本接口仅检查基本 WebP 容器完整性，不解码或转码。下载与暂存的硬资源上限为 10 MiB（10485760 字节），下载最多 15 秒、3 次跳转。 该上限是本接口的资源边界，不代表渠道接受该大小以内的所有素材。accepted 仅表示受理，不保证送达、素材可解码或动画播放效果。 sticker 不允许 text/caption/contacts/poll/link_preview 等其他内容字段，即使为 null 或空值也返回 400 invalid_request。 sticker 的 provider_data 只能省略或为空对象；非对象为 400 invalid_request，非空对象为 400 provider_invalid_request。 支持既有 reply_to.reply_token；无效或无法解封的 token 返回 400 invalid_reply_token。 基本 WebP 容器不完整、不可接受的素材来源地址或超过硬资源上限时，发送前返回 400 provider_invalid_request、numeric_code=36007，表示贴纸尚未发送。 message 提供具体素材校验原因，原因缺失时为 Invalid sticker media；调用方按数字码判断，修正素材或来源地址后再发送。 非空 provider_data、公共结构错误和实际渠道参数拒绝沿用各自分类，实际渠道参数拒绝仍为 400 provider_invalid_request、numeric_code=30001。 贴纸实际发送失败保留既有 HTTP、code、numeric_code 和专属分类提示，提供可用的具体失败原因；上游未提供时沿用默认提示。其他消息类型保持既有行为。 素材获取的 HTTP 故障、超时、存储或其他准备失败返回 500 send_message_failed、numeric_code=36001，message 提供具体准备失败原因，缺失时沿用默认提示；不使用 36007。 sticker 超时或结果不明时不会自动重发；request_id/client_request_id 仅用于追踪，不提供发送幂等保证。 `message.type=poll` 用于创建投票；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 投票必须提供非空白题目、至少两个非空白标题的选项及整数 max_selections（1 到选项数）；原文保持不变。 本项目 WhatsApp 发送策略限制题目最多 255 个 Unicode 字符、选项最多 12 个、每项标题最多 100 个 Unicode 字符，并拒绝完全相同的原文标题；这些不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 投票不支持 reply_to 或非空 mentions；不支持的渠道、目标或组合返回 HTTP 501 unsupported_by_provider。 投票公共结构、null、未知字段或混合载荷错误返回 HTTP 400 invalid_request；违反 WhatsApp 字段策略或提供 provider_data.context_info/extra 返回 HTTP 400 provider_invalid_request。 创建成功沿用发送响应；引用上下文完整时可选返回 data.reply_token，普通文字消息可通过 reply_to.reply_token 引用该投票，无需等待创建回调。 缺少可引用上下文时省略 token，accepted 状态不因此改变；不能用 message_id 或 provider_ref 代替 token。新投票自身仍不支持 reply_to，不提供投票统计或代替账号投票。 超时或响应不完整时发送结果可能未知，先核对实际消息与回调再决定重试。 `message.type=link_preview` 用于发送自定义链接预览；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 公共结构要求非空正文和 HTTP(S) 目标链接；WhatsApp 还要求非空标题、图片 URL，以及目标链接原文出现在正文中。 本项目 WhatsApp 发送策略限制标题最多 255 个 Unicode 字符、摘要最多 1024 个 Unicode 字符；这不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 链接预览不支持 `reply_to` 或非空 `mentions`，不支持的渠道、目标或组合返回 HTTP 501 `unsupported_by_provider`。 公共字段格式错误返回 HTTP 400 `invalid_request`；违反上述 WhatsApp 字段策略或使用覆盖卡片数据的渠道扩展返回 HTTP 400 `provider_invalid_request`。 本接口不抓取目标网页生成预览，调用方提供卡片内容。HTTP 200 / accepted 不表示已送达，也不保证一定收到自同步回调。 WhatsApp 消息发送被平台明确限制时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30019`。 调用方应按该数字码停止对此类失败的自动重试，确认平台限制解除后再发送。 `whatsapp` 群消息发送被明确拒绝为需要管理员权限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=34012`，`message` 为 `Group administrator privileges are required to send messages to this group`。 调用方应停止自动重试，核实群发言权限和当前账号角色，由群管理员调整权限后再发送。 此错误不表示该群一定是社群公告群，也不确认群设置或账号角色的具体状态；不适用于 `whatsapp-protocol`。 Device API 在 `whatsapp` 发送操作中识别到账号受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=20102`，与该渠道账号受限 Webhook 的数字码一致。调用方应停止该账号的自动发送和重试， 引导用户在官方 WhatsApp 客户端检查并处理限制，恢复正常后再按需重新授权。 此分类不会自动修改账号状态或产生额外回调，不能仅因运行状态为 `running` 恢复发送。 Device API 识别到 `whatsapp-protocol` 账号当前登录受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30020`。调用方必须停止自动重试，引导用户前往官方 WhatsApp 客户端检查， 处理完成并重新授权后再恢复发送。上述错误都不表示永久封号，也不能据此认定账号已确认封禁或存在固定恢复期限； 其他发送失败沿用原有错误分类。 Device API 识别到 WhatsApp 账号连接未建立时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30021`，`message` 保留原始连接错误；此错误不表示已登出或授权失效。 调用方应暂停发送，调用 `POST /v1/accounts/{account_id}/runtime/refresh`，按最新状态恢复连接， 确认 `runtime_status=running` 后再发送。失败请求不会自动重发或重连。 `numeric_code=30010` 的 `message` 在有原因时为 `Provider operation failed: <原始错误原因>`， 没有原因时为 `Provider operation failed`；调用方应按数字码判断，不依赖可变化的文案。

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

| 字段                        | 必填             | 类型                             | 约束                                   | 说明                                                                                                                                                        |
| --------------------------- | ---------------- | -------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.account_id`           | 是               | `string`                         | minLength=1                            | -                                                                                                                                                           |
| `body.to`                   | 是               | `Recipient`                      | -                                      | -                                                                                                                                                           |
| `body.to.id`                | 是               | `string`                         | minLength=1                            | 渠道侧接收方标识。                                                                                                                                          |
| `body.to.type`              | 是               | `ConversationType`               | enum="user", "group", "channel"        | 标准会话类型；WhatsApp 社群公告群继续使用 group。                                                                                                           |
| `body.message`              | 是               | `MessagePayload`                 | -                                      | -                                                                                                                                                           |
| `body.provider_data`        | 否               | `Record<string, unknown>`        | -                                      | -                                                                                                                                                           |
| `body.reply_to`             | 否               | `ReplyTo`                        | -                                      | -                                                                                                                                                           |
| `body.reply_to.reply_token` | 父字段存在时必填 | `string`                         | minLength=1                            | 来自可引用消息事件 `data.message.reply_token` 或发送响应 `data.reply_token` 的不透明句柄，按原账号及会话原样使用；不能用消息 ID 替代。                      |
| `body.mentions`             | 否               | `Array<Mention>`                 | -                                      | 群消息的 @ 目标列表。`type=member` 使用对应 Provider 的成员 `id`； `type=all` 表示 @所有人，仅在 Provider 支持时生效，否则返回 `unsupported_message_type`。 |
| `body.mentions[].type`      | 否               | `string enum("member" \| "all")` | enum="member", "all", default="member" | -                                                                                                                                                           |
| `body.mentions[].id`        | 否               | `string`                         | minLength=1                            | `type=member` 时必填的 Provider 成员标识。                                                                                                                  |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 消息发送请求已被接收或完成。                                                                                                                                                                                                                                                                                                     |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法；贴纸素材校验失败使用 provider_invalid_request 和 numeric_code=36007，message 提供具体原因，贴纸尚未发送。                                                                                                                                                                                                      |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                         |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                         |
| `500`       | `application/json` | `ErrorEnvelope`         | 发送消息时发生内部错误；贴纸素材下载、存储或其他准备失败保留 send_message_failed 和 numeric_code=36001，message 提供具体原因，缺失时沿用默认提示。                                                                                                                                                                               |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                   |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道发送失败或暂不可用；numeric_code=20102 表示 whatsapp 账号受限，30020 表示 whatsapp-protocol 账号登录受限，30019 表示平台限制发送，34012 表示 whatsapp 群消息发送需要管理员权限，均不应自动重试；34012 应先核实群权限和账号角色，由管理员调整后再发送；30021 表示连接未建立，应先刷新账号状态；30010 附带可用的原始错误原因。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                | 约束        | 说明                                                                                                                     |
| ------------------------------- | ---- | ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `result.data.request_id`        | 否   | `string`            | -           | 服务端生成的请求 ID。                                                                                                    |
| `result.data.client_request_id` | 否   | `string`            | -           | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                           |
| `result.data.data`              | 是   | `SendMessageResult` | -           | -                                                                                                                        |
| `result.data.data.message_id`   | 是   | `string`            | -           | -                                                                                                                        |
| `result.data.data.account_id`   | 是   | `string`            | -           | -                                                                                                                        |
| `result.data.data.status`       | 是   | `string`            | -           | -                                                                                                                        |
| `result.data.data.provider_ref` | 否   | `string`            | -           | -                                                                                                                        |
| `result.data.data.reply_token`  | 否   | `string`            | minLength=1 | WhatsApp 发送成功且可引用上下文完整时返回；包括新发送投票，普通文字可据此引用它。未提供时省略，accepted 状态不因此改变。 |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

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
console.log(result.status, result.requestId);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。
