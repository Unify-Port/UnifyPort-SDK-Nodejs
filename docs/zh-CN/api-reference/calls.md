<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Calls

[English](../../api-reference/calls.md) | [简体中文](calls.md)

[返回 API Reference 索引](README.md)

仅内测工作区可准备、查询和结束 WhatsApp 单聊语音或视频通话；呼入暂未开放。

## 本页 operation

- [`createCall`](#create-call)：准备主动通话
- [`getActiveCall`](#get-active-call)：查询账号当前活动通话
- [`hangupCall`](#hangup-call)：挂断指定通话

---

<a id="create-call"></a>

## `createCall`

准备主动通话

仅 is_beta=true 的内测工作区可用；普通工作区返回 403 beta_feature_not_enabled（41002）。呼入暂未开放，内测资格不会自动开启呼入。 为 WhatsApp 账号准备单聊语音或视频呼叫。创建成功仅表示准备完成，不会立即拨号。 to 与发送消息使用相同的 {id,type} 结构；id 填当前账号下的 conversation_id，type 填会话类型。 首期仅支持 WhatsApp 的 user 目标，id 必须是数字用户标识组成的 @lid 或 @s.whatsapp.net 单聊 JID，最长 128 字符；不支持裸手机号或字符串形式的 to。 group、channel 及其他尚未支持通话的渠道返回 501 unsupported_by_provider；WhatsApp user 目标 JID 无效返回 400 provider_invalid_request。 用户在 expires_at 前打开 join_url，允许麦克风并点击 Start call，媒体连接后才开始拨号。 视频通话的摄像头可选；未允许摄像头时仍可收看远端视频和语音通话。 一个账号最多同时保留一通活跃通话；准备期从创建通话起默认 2 分钟，可由服务端调整，实际截止时间以 expires_at 为准，过期后需重新创建。此期限不限制已接通通话的时长。 join_url 是短期一次性访问链接，应原样传递给预期用户，禁止写入日志或公开分享。 接通和结束通过 call.answered、call.ended 事件通知；内测工作区可使用通配订阅或逐项订阅，外呼不会产生 call.incoming。

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/calls`                                                     |
| SDK 方法 | `device.createCall(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createCall"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `write`                                                                |
| 自动重试 | 不自动重试                                                             |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型                              | 约束                                      | 说明                                                                                                                                                                              |
| ----------------- | ---- | --------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.account_id` | 是   | `string`                          | pattern="^acc_[A-Za-z0-9][A-Za-z0-9_-]*$" | 当前工作空间内账号的公开 ID。                                                                                                                                                     |
| `body.to`         | 是   | `Recipient`                       | -                                         | 与发送消息共用目标结构，id 使用 conversation_id。首期仅支持 WhatsApp user 的数字 @lid 或 @s.whatsapp.net 单聊 JID（最长 128 字符），不接受手机号字符串；group、channel 暂不支持。 |
| `body.to.id`      | 是   | `string`                          | minLength=1                               | 渠道侧接收方标识。                                                                                                                                                                |
| `body.to.type`    | 是   | `ConversationType`                | enum="user", "group", "channel"           | 标准会话类型；WhatsApp 社群公告群继续使用 group。                                                                                                                                 |
| `body.media_type` | 是   | `string enum("voice" \| "video")` | enum="voice", "video"                     | -                                                                                                                                                                                 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `201`       | `application/json` | `ResponseMeta & object` | 已生成准备态通话，尚未拨号。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `403`       | `application/json` | `ErrorEnvelope`         | 目标工作区未开通内测时返回 beta_feature_not_enabled（41002）；当前 API Key 无权切换到目标工作区时仍返回原鉴权错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 账号已有活跃通话、尚未绑定节点或当前运行实例未就绪；遇到 38000 可先查询 GET /v1/calls/active，再按需调用 POST /v1/calls/{call_id}/hangup；也可等待当前通话结束或准备过期后重试。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `500`       | `application/json` | `ErrorEnvelope`         | 通话准备失败或发生内部处理错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |
| `503`       | `application/json` | `ErrorEnvelope`         | 通话服务当前不可用，稍后重试；未知渠道故障仍使用既有 502 分类。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                            | 必有 | 类型                              | 约束                  | 说明                                                                                                            |
| ------------------------------- | ---- | --------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                          | -                     | 服务端生成的请求 ID。                                                                                           |
| `result.data.client_request_id` | 否   | `string`                          | -                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                  |
| `result.data.data`              | 是   | `CreateCallData`                  | -                     | -                                                                                                               |
| `result.data.data.call_id`      | 是   | `string`                          | -                     | -                                                                                                               |
| `result.data.data.direction`    | 是   | `string enum("outbound")`         | enum="outbound"       | -                                                                                                               |
| `result.data.data.media_type`   | 是   | `string enum("voice" \| "video")` | enum="voice", "video" | -                                                                                                               |
| `result.data.data.state`        | 是   | `string enum("preparing")`        | enum="preparing"      | -                                                                                                               |
| `result.data.data.join_url`     | 是   | `string (uri)`                    | -                     | 原样传递的短期一次性 HTTPS 通话链接，禁止记录完整链接。                                                         |
| `result.data.data.expires_at`   | 是   | `string (date-time)`              | -                     | RFC3339 格式的准备失效时间；从创建通话起默认 2 分钟，可由服务端调整，请以此字段判断截止时间，不要自行写死时长。 |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.createCall({
  body: {
    account_id: "acc_example",
    to: {
      id: "100000000000002@lid",
      type: "user"
    },
    media_type: "video"
  }
});
console.log(result.status, result.requestId);
```

---

<a id="get-active-call"></a>

## `getActiveCall`

查询账号当前活动通话

仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。当前账号没有活动通话时返回 200 且 data 为空对象 {}；这不表示通话服务不可用。有活动通话时仅返回通话 ID、状态、方向和媒体类型，不返回链接或凭证。

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/calls/active`                                                  |
| SDK 方法 | `device.getActiveCall(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getActiveCall"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `read`                                                                    |
| 自动重试 | 不自动重试                                                                |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例        | 约束                                      | 说明 |
| ------------------------- | ----- | ---- | -------- | ----------- | ----------------------------------------- | ---- |
| `params.query.account_id` | query | 是   | `string` | `"acc_xxx"` | pattern="^acc_[A-Za-z0-9][A-Za-z0-9_-]*$" | -    |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 当前活动通话或空对象 {}。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `403`       | `application/json` | `ErrorEnvelope`         | 目标工作区未开通内测时返回 beta_feature_not_enabled（41002）；当前 API Key 无权访问目标工作区时仍返回原鉴权错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 通话查询失败，错误码 call_control_failed / 38004。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |
| `503`       | `application/json` | `ErrorEnvelope`         | 通话服务不可用，错误码 call_service_unavailable / 38001。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                       | 约束 | 说明                                           |
| ------------------------------- | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `ActiveCallData \| object` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.getActiveCall({
  params: {
    query: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="hangup-call"></a>

## `hangupCall`

挂断指定通话

仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。挂断当前账号归属的指定通话。存储保留期内重复挂断已结束通话仍返回其终态对象；通话不存在或不属于该账号返回 404 call_not_found。撤销内测资格前应先结束活动通话并等待准备链接过期；资格撤销不会立即使已发链接失效或强制结束通话。

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/calls/{call_id}/hangup`                                    |
| SDK 方法 | `device.hangupCall(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["hangupCall"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `destructive`                                                          |
| 自动重试 | 不自动重试                                                             |

### 参数

| SDK 字段              | 位置 | 必填 | 类型     | 示例            | 约束                                                 | 说明 |
| --------------------- | ---- | ---- | -------- | --------------- | ---------------------------------------------------- | ---- |
| `params.path.call_id` | path | 是   | `string` | `"call_id_xxx"` | maxLength=128, pattern="^[A-Za-z0-9][A-Za-z0-9_-]*$" | -    |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束                                      | 说明 |
| ----------------- | ---- | -------- | ----------------------------------------- | ---- |
| `body.account_id` | 是   | `string` | pattern="^acc_[A-Za-z0-9][A-Za-z0-9_-]*$" | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 已结束通话的终态对象。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `403`       | `application/json` | `ErrorEnvelope`         | 目标工作区未开通内测时返回 beta_feature_not_enabled（41002）；当前 API Key 无权访问目标工作区时仍返回原鉴权错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `404`       | `application/json` | `ErrorEnvelope`         | 通话不存在或不属于该账号，错误码 call_not_found / 38003；账号不存在仍沿用 account_not_found。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 通话挂断失败，错误码 call_control_failed / 38004。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |
| `503`       | `application/json` | `ErrorEnvelope`         | 通话服务不可用，错误码 call_service_unavailable / 38001。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                                   | 约束                       | 说明                                           |
| ------------------------------- | ---- | -------------------------------------- | -------------------------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                               | -                          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                               | -                          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `EndedCallData`                        | -                          | -                                              |
| `result.data.data.call_id`      | 是   | `string`                               | maxLength=128              | -                                              |
| `result.data.data.state`        | 是   | `string enum("ended" \| "failed")`     | enum="ended", "failed"     | -                                              |
| `result.data.data.direction`    | 是   | `string enum("inbound" \| "outbound")` | enum="inbound", "outbound" | -                                              |
| `result.data.data.media_type`   | 是   | `string enum("voice" \| "video")`      | enum="voice", "video"      | -                                              |

### TypeScript 示例

```ts
const result = await device.hangupCall({
  params: {
    path: {
      call_id: "call_id_xxx"
    }
  },
  body: {
    account_id: "acc_example"
  }
});
console.log(result.data.data);
```
