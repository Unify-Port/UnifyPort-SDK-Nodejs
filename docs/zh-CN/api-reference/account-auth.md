<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Account Auth

[English](../../api-reference/account-auth.md) | [简体中文](account-auth.md)

[返回 API Reference 索引](README.md)

完成渠道账号授权。

## 本页 operation

- [`cancelAccountAuth`](#cancel-account-auth)：取消授权流程
- [`checkAccountQrAuth`](#check-account-qr-auth)：检查二维码授权结果
- [`confirmAccountPasskey`](#confirm-account-passkey)：确认 Passkey 授权
- [`createAccountAuthSession`](#create-account-auth-session)：创建 Provider 授权会话
- [`getAccountAuthState`](#get-account-auth-state)：获取账号授权状态
- [`importAccountAuthSession`](#import-account-auth-session)：导入会话授权
- [`startAccountAuth`](#start-account-auth)：启动验证码类授权
- [`startAccountQrAuth`](#start-account-qr-auth)：启动二维码授权
- [`submitAccountAuthCode`](#submit-account-auth-code)：提交验证码
- [`submitAccountAuthPassword`](#submit-account-auth-password)：提交二次密码
- [`submitAccountPasskeyResponse`](#submit-account-passkey-response)：提交 Passkey 凭证响应

---

<a id="cancel-account-auth"></a>

## `cancelAccountAuth`

取消授权流程

| 属性     | 值                                                                            |
| -------- | ----------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/cancel`                                |
| SDK 方法 | `device.cancelAccountAuth(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["cancelAccountAuth"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                 |
| 变更类型 | `write`                                                                       |
| 自动重试 | 不自动重试                                                                    |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道操作参数。支持的字段因渠道和操作而异；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.cancelAccountAuth({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="check-account-qr-auth"></a>

## `checkAccountQrAuth`

检查二维码授权结果

轮询二维码授权状态。普通二维码步骤通过 `auth_payload.qr_code` 返回二维码； WhatsApp 授权也可能进入 `passkey_required`，此时调用方应使用 `auth_payload.public_key` 发起 WebAuthn 操作，而不能继续把响应当作二维码。 渠道历史兼容字段可能随普通二维码结果一并返回，调用方应以 `status`、`auth_status` 和 `auth_payload` 标准字段为准。Passkey 结果不会把 Provider 原始 `code` 或 `info` 作为公共字段返回。 Provider 返回空状态且没有二维码或 Passkey 载荷时，平台不会用该空结果覆盖当前 Session。已有 `authorized`、`failed`、`cancelled`、`expired` 或 Passkey 状态按 当前快照返回；Provider 明确返回终态时会清除旧二维码和原始兼容载荷，不会回放 已失效的认证材料。没有可确认状态时返回 409 `provider_not_ready`。

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/qr/check`                               |
| SDK 方法 | `device.checkAccountQrAuth(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["checkAccountQrAuth"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `write`                                                                        |
| 自动重试 | 不自动重试                                                                     |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道操作参数。支持的字段因渠道和操作而异；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 当前二维码授权步骤。调用方应根据标准状态区分二维码、验证码、自动验证与 Passkey。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                       | 必有 | 类型                 | 约束                                                                                              | 说明                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ---- | -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `result.data.request_id`                   | 否   | `string`             | -                                                                                                 | 服务端生成的请求 ID。                                                                                                                                                                                                                                                          |
| `result.data.client_request_id`            | 否   | `string`             | -                                                                                                 | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                                                                                                                 |
| `result.data.data`                         | 是   | `QRAuthCheckData`    | -                                                                                                 | 二维码授权检查的标准结果。字段可能因渠道和当前步骤扩展；调用方应优先读取 `status`、`auth_status` 和 `auth_payload`。TikTok 扫码后可能返回 `awaiting_code`，自动处理验证码时返回 `pending`。`account_id`、`expires_at` 等字段不是所有 Provider 都稳定返回，因此不作为必填字段。 |
| `result.data.data.provider`                | 否   | `ProviderName`       | enum="telegram", "whatsapp", "line", "twitter", "facebook", "zalo", "tiktok", "whatsapp-protocol" | 响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。                                                                                                   |
| `result.data.data.action`                  | 否   | `string`             | const="check_qr_auth"                                                                             | -                                                                                                                                                                                                                                                                              |
| `result.data.data.status`                  | 否   | `string`             | -                                                                                                 | 当前授权流程状态，例如 `awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required` 或 `authorized`。                                                                                                                                                                    |
| `result.data.data.auth_status`             | 否   | `string`             | -                                                                                                 | 与当前授权步骤对应的标准状态，通常与 `status` 一致。                                                                                                                                                                                                                           |
| `result.data.data.auth_payload`            | 否   | `QRAuthCheckPayload` | -                                                                                                 | 当前步骤所需的标准载荷。普通二维码使用 `qr_code`；验证码步骤使用 `type=code`；Passkey 使用 `type=passkey` 和 `public_key`。互斥步骤的载荷 不会同时出现。                                                                                                                       |
| `result.data.data.auth_payload.type`       | 否   | `string`             | -                                                                                                 | 当前载荷类型；验证码步骤为 `code`，Passkey 步骤为 `passkey`。                                                                                                                                                                                                                  |
| `result.data.data.auth_payload.qr_code`    | 否   | `string`             | -                                                                                                 | 普通二维码内容或可直接展示的二维码 data URL。                                                                                                                                                                                                                                  |
| `result.data.data.auth_payload.public_key` | 否   | `FreeFormObject`     | -                                                                                                 | -                                                                                                                                                                                                                                                                              |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.checkAccountQrAuth({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="confirm-account-passkey"></a>

## `confirmAccountPasskey`

确认 Passkey 授权

确认当前账号授权流程中等待用户确认的 Passkey 挑战。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/passkey-confirm`                           |
| SDK 方法 | `device.confirmAccountPasskey(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["confirmAccountPasskey"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `write`                                                                           |
| 自动重试 | 不自动重试                                                                        |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.confirmAccountPasskey({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="create-account-auth-session"></a>

## `createAccountAuthSession`

创建 Provider 授权会话

为当前账号创建短期有效的 Provider 授权会话，并返回可在浏览器中打开的 `authorize_url`。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。 创建与授权模式切换冲突时返回 `409 provider_not_ready`，重新查询当前模式后再重试。

| 属性     | 值                                                                                   |
| -------- | ------------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth-sessions`                                     |
| SDK 方法 | `device.createAccountAuthSession(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createAccountAuthSession"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                        |
| 变更类型 | `write`                                                                              |
| 自动重试 | 不自动重试                                                                           |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `201`       | `application/json` | `ResponseMeta & object` | Provider 授权会话已创建。  |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |
| `503`       | `application/json` | `ErrorEnvelope`         | 服务暂不可用。             |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                                    | 必有 | 类型                  | 约束                                                                                              | 说明                                                                                                                                                                         |
| --------------------------------------- | ---- | --------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`              | -                                                                                                 | 服务端生成的请求 ID。                                                                                                                                                        |
| `result.data.client_request_id`         | 否   | `string`              | -                                                                                                 | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                               |
| `result.data.data`                      | 是   | `ProviderAuthSession` | -                                                                                                 | -                                                                                                                                                                            |
| `result.data.data.account_id`           | 是   | `string`              | -                                                                                                 | -                                                                                                                                                                            |
| `result.data.data.provider`             | 是   | `ProviderName`        | enum="telegram", "whatsapp", "line", "twitter", "facebook", "zalo", "tiktok", "whatsapp-protocol" | 响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。 |
| `result.data.data.auth_mode`            | 是   | `string`              | -                                                                                                 | -                                                                                                                                                                            |
| `result.data.data.status`               | 是   | `string`              | -                                                                                                 | -                                                                                                                                                                            |
| `result.data.data.auth_payload`         | 否   | `FreeFormObject`      | -                                                                                                 | 当前授权步骤所需的渠道载荷，结构会随授权状态变化。                                                                                                                           |
| `result.data.data.authorize_url`        | 是   | `string (uri)`        | -                                                                                                 | 短期有效的 Provider 授权页面地址，其中包含不透明授权凭证。调用方应将其 作为敏感信息处理，不得写入公开日志或分享给无关用户。                                                  |
| `result.data.data.expires_at`           | 是   | `string (date-time)`  | -                                                                                                 | -                                                                                                                                                                            |
| `result.data.data.switchable`           | 是   | `boolean`             | -                                                                                                 | 当前授权会话是否允许切换授权模式。                                                                                                                                           |
| `result.data.data.available_auth_modes` | 是   | `Array<string>`       | -                                                                                                 | 当前会话允许使用的授权模式。                                                                                                                                                 |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.createAccountAuthSession({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="get-account-auth-state"></a>

## `getAccountAuthState`

获取账号授权状态

| 属性     | 值                                                                              |
| -------- | ------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/auth`                                          |
| SDK 方法 | `device.getAccountAuthState(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getAccountAuthState"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                   |
| 变更类型 | `read`                                                                          |
| 自动重试 | 允许安全重试                                                                    |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 当前授权状态。             |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                         | 必有             | 类型                 | 约束 | 说明                                                                                                                                                                                                      |
| -------------------------------------------- | ---------------- | -------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                     | 否               | `string`             | -    | 服务端生成的请求 ID。                                                                                                                                                                                     |
| `result.data.client_request_id`              | 否               | `string`             | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                                            |
| `result.data.data`                           | 是               | `AccountSession`     | -    | -                                                                                                                                                                                                         |
| `result.data.data.account_id`                | 是               | `string`             | -    | -                                                                                                                                                                                                         |
| `result.data.data.status`                    | 是               | `string`             | -    | 授权流程状态，例如 `pending_auth`、`awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required`、 `passkey_pending`、`passkey_confirmation`、`passkey_confirmation_sent`、 `authorized`、`failed`。 |
| `result.data.data.auth_fields`               | 否               | `Array<AuthField>`   | -    | -                                                                                                                                                                                                         |
| `result.data.data.auth_fields[].type`        | 父字段存在时必填 | `string`             | -    | -                                                                                                                                                                                                         |
| `result.data.data.auth_fields[].required`    | 父字段存在时必填 | `boolean`            | -    | -                                                                                                                                                                                                         |
| `result.data.data.auth_fields[].label`       | 否               | `string`             | -    | -                                                                                                                                                                                                         |
| `result.data.data.auth_fields[].placeholder` | 否               | `string`             | -    | -                                                                                                                                                                                                         |
| `result.data.data.auth_payload`              | 否               | `FreeFormObject`     | -    | 当前授权步骤所需的渠道载荷。Passkey 流程可能返回 `type=passkey` 和 `public_key`，或返回 `type=passkey_confirmation` 及确认提示字段。                                                                      |
| `result.data.data.expires_at`                | 否               | `string (date-time)` | -    | -                                                                                                                                                                                                         |
| `result.data.data.last_error`                | 否               | `string`             | -    | -                                                                                                                                                                                                         |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.getAccountAuthState({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="import-account-auth-session"></a>

## `importAccountAuthSession`

导入会话授权

| 属性     | 值                                                                                   |
| -------- | ------------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/session`                                      |
| SDK 方法 | `device.importAccountAuthSession(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["importAccountAuthSession"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                        |
| 变更类型 | `write`                                                                              |
| 自动重试 | 不自动重试                                                                           |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道会话授权参数。Telegram、Twitter 等既有 provider 可继续使用 `session_url` 或其已支持的自由字段；`whatsapp-protocol` 的协议凭证必须放入同名嵌套对象。 账号定位、webhook 与代理由平台注入，不应在此提交。

| 字段                                               | 必填             | 类型                                  | 约束        | 说明                                                                                                                                                                                                            |
| -------------------------------------------------- | ---------------- | ------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.session_url`                                 | 否               | `string (uri)`                        | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol`                           | 否               | `WhatsAppProtocolSessionImportParams` | -           | WhatsApp Protocol 的会话导入凭证，仅可提交至账号会话导入接口。 响应不回显协议密钥或其他敏感凭证。手机号用于身份一致性校验；协议公钥、协议私钥 仅供上游启动使用。`edge_routing` 由平台固定注入，业务方不得提交。 |
| `body.whatsapp-protocol.phone`                     | 父字段存在时必填 | `string`                              | minLength=1 | 允许带空格、连字符、括号或加号的格式化输入；服务端会归一化为正数字符串。                                                                                                                                        |
| `body.whatsapp-protocol.platform`                  | 否               | `integer (int32)`                     | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.app_version`               | 否               | `string`                              | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.server_address`            | 否               | `string`                              | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.fallback_server_addresses` | 否               | `Array<string>`                       | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.country`                   | 否               | `string`                              | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.device`                    | 否               | `integer (uint32)`                    | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.static_pub_key`            | 父字段存在时必填 | `string`                              | minLength=1 | 协议公钥。                                                                                                                                                                                                      |
| `body.whatsapp-protocol.static_pri_key`            | 父字段存在时必填 | `string`                              | minLength=1 | 协议私钥。                                                                                                                                                                                                      |
| `body.whatsapp-protocol.identity_pub_key`          | 父字段存在时必填 | `string`                              | minLength=1 | 身份公钥。                                                                                                                                                                                                      |
| `body.whatsapp-protocol.identity_pri_key`          | 父字段存在时必填 | `string`                              | minLength=1 | 身份私钥。                                                                                                                                                                                                      |
| `body.whatsapp-protocol.hash`                      | 否               | `string`                              | -           | 兼容旧调用方保留；当前值会被忽略且不保存，建议调用方省略。                                                                                                                                                      |
| `body.whatsapp-protocol.peer_kem_public`           | 否               | `string`                              | -           | 对端 KEM 公钥。                                                                                                                                                                                                 |
| `body.whatsapp-protocol.auth_hex_data`             | 否               | `string`                              | -           | 当前认证十六进制数据。                                                                                                                                                                                          |
| `body.whatsapp-protocol.authhexdata`               | 否               | `string`                              | -           | 兼容旧字段：认证十六进制数据。                                                                                                                                                                                  |
| `body.whatsapp-protocol.pq_handshake_mode`         | 否               | `string`                              | -           | -                                                                                                                                                                                                               |
| `body.whatsapp-protocol.use_xxkem_handshake`       | 否               | `boolean`                             | -           | -                                                                                                                                                                                                               |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.importAccountAuthSession({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    session_url: "<session-payload>"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。

---

<a id="start-account-auth"></a>

## `startAccountAuth`

启动验证码类授权

启动 `auth_mode=code` 的授权流程。通常发送 `{}`，手机号从账号的 `provider_data.phone` 读取。 WhatsApp 手机号配对从 `data.verify_code` 读取配对码，交由用户在手机端输入， 不调用 `/auth/code`。Telegram 等待用户收到验证码后调用 `/auth/code`， 如需二次密码再调用 `/auth/password`。 `awaiting_code` 仅表示等待用户操作，不代表授权成功；通过 `GET /auth` 查询后续授权状态，并在发送消息前确认账号连接可用。

| 属性     | 值                                                                           |
| -------- | ---------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/start`                                |
| SDK 方法 | `device.startAccountAuth(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["startAccountAuth"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                |
| 变更类型 | `write`                                                                      |
| 自动重试 | 不自动重试                                                                   |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道操作参数。支持的字段因渠道和操作而异；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 验证码授权启动结果；按渠道区分手机号配对与验证码提交。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                        | 约束                                                                                              | 说明                                                                                                                                                                                                                                                              |
| ------------------------------------ | ---- | --------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                    | -                                                                                                 | 服务端生成的请求 ID。                                                                                                                                                                                                                                             |
| `result.data.client_request_id`      | 否   | `string`                    | -                                                                                                 | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                                                                                                    |
| `result.data.data`                   | 是   | `StartCodeAuthData`         | -                                                                                                 | 授权动作的结果，字段随渠道和当前授权步骤变化。 WhatsApp 配对码位于 `verify_code`；Telegram 可通过 `auth_payload.type=code` 提示等待用户提交验证码。`account_id`、`auth_fields` 和 `expires_at` 不是此动作的统一返回字段，不能按授权状态查询的响应结构读取本接口。 |
| `result.data.data.provider`          | 是   | `ProviderName`              | enum="telegram", "whatsapp", "line", "twitter", "facebook", "zalo", "tiktok", "whatsapp-protocol" | 响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。                                                                                      |
| `result.data.data.action`            | 是   | `string enum("start_auth")` | enum="start_auth"                                                                                 | -                                                                                                                                                                                                                                                                 |
| `result.data.data.status`            | 否   | `string`                    | -                                                                                                 | 当前授权流程状态；awaiting_code 表示等待用户操作，authorized 才表示授权完成。                                                                                                                                                                                     |
| `result.data.data.auth_status`       | 否   | `string`                    | -                                                                                                 | 当前授权步骤的标准状态，通常与 status 一致。                                                                                                                                                                                                                      |
| `result.data.data.verify_code`       | 否   | `string`                    | -                                                                                                 | 仅 WhatsApp 手机号配对返回；直接位于 data 下，不在 auth_payload 内。 展示给用户在手机 WhatsApp 中输入，不回传 /auth/code。 响应不保证提供过期时间，配对码失效时需重新发起配对。                                                                                   |
| `result.data.data.auth_payload`      | 否   | `Record<string, unknown>`   | -                                                                                                 | 渠道特定的授权提示；Telegram 可返回 type=code，不包含用户收到的验证码。                                                                                                                                                                                           |
| `result.data.data.auth_payload.type` | 否   | `string`                    | -                                                                                                 | 当前授权提示的类型；Telegram 验证码步骤为 code。                                                                                                                                                                                                                  |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.startAccountAuth({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="start-account-qr-auth"></a>

## `startAccountQrAuth`

启动二维码授权

TikTok 可在 body 临时传入 Boolean enable_comment 覆盖账号配置；缺省 false，非法类型返回 400 invalid_request。 显式启动或继续二维码授权。WhatsApp Provider 返回 `init` 或尚未生成二维码时， 响应保持 `pending`，不会伪装成可扫码状态。 Provider 已进入 Passkey 时会继续现有流程；响应只保留标准 `auth_payload`， 不返回 Provider 原始 `code`、`info` 或二维码兼容字段。

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/qr/start`                               |
| SDK 方法 | `device.startAccountQrAuth(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["startAccountQrAuth"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `write`                                                                        |
| 自动重试 | 不自动重试                                                                     |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道操作参数。支持的字段因渠道和操作而异；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.startAccountQrAuth({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="submit-account-auth-code"></a>

## `submitAccountAuthCode`

提交验证码

提交当前授权步骤要求的验证码。TikTok 账号仍使用 `auth_mode=qrcode`；扫码后 `/auth/qr/check` 返回 `awaiting_code` 时，通过本接口提交 2FA 验证码。提交成功 只表示已接受，调用方必须继续轮询 `/auth/qr/check`，直到返回 `authorized` 或 `failed`。 Provider 明确拒绝验证码时保持 HTTP 400 `provider_invalid_request`，并使用 `numeric_code=30016` 区分一般参数拒绝；客户端可允许用户重新输入验证码。

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/code`                                      |
| SDK 方法 | `device.submitAccountAuthCode(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["submitAccountAuthCode"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `write`                                                                           |
| 自动重试 | 不自动重试                                                                        |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道授权参数，常见字段为 `code`。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.submitAccountAuthCode({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    code: "<verification-code>"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。

---

<a id="submit-account-auth-password"></a>

## `submitAccountAuthPassword`

提交二次密码

| 属性     | 值                                                                                    |
| -------- | ------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/password`                                      |
| SDK 方法 | `device.submitAccountAuthPassword(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["submitAccountAuthPassword"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                         |
| 变更类型 | `write`                                                                               |
| 自动重试 | 不自动重试                                                                            |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

渠道授权参数，常见字段为 `password`。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.submitAccountAuthPassword({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    password: "<password>"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。

---

<a id="submit-account-passkey-response"></a>

## `submitAccountPasskeyResponse`

提交 Passkey 凭证响应

向当前账号的授权流程提交浏览器生成的 WebAuthn 凭证响应。 `webauthn_response` 必须是完整凭证响应序列化后的 JSON 字符串。当前仅支持 使用 `qrcode` 授权模式的 WhatsApp 账号。只有 Provider 明确拒绝输入时才恢复上一可操作步骤。

| 属性     | 值                                                                                       |
| -------- | ---------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/auth/passkey-response`                                 |
| SDK 方法 | `device.submitAccountPasskeyResponse(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["submitAccountPasskeyResponse"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                            |
| 变更类型 | `write`                                                                                  |
| 自动重试 | 不自动重试                                                                               |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                     | 必填 | 类型     | 约束        | 说明                                                       |
| ------------------------ | ---- | -------- | ----------- | ---------------------------------------------------------- |
| `body.webauthn_response` | 是   | `string` | minLength=1 | 浏览器生成的 WebAuthn 凭证响应序列化后的完整 JSON 字符串。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道操作结果，返回字段因操作和渠道而异。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型             | 约束 | 说明                                           |
| ------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `FreeFormObject` | -    | -                                              |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.submitAccountPasskeyResponse({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    webauthn_response: '{"id":"credential-id","response":{"clientDataJSON":"..."}}'
  }
});
console.log(result.status, result.requestId);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。
