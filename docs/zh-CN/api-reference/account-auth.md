<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Account Auth

[English](../../api-reference/account-auth.md) | [简体中文](account-auth.md)

[返回 API Reference 索引](README.md)

provider 账号授权流程。

## 本页 operation

- [`cancelAccountAuth`](#cancel-account-auth)：取消授权流程
- [`checkAccountQrAuth`](#check-account-qr-auth)：检查二维码授权结果
- [`getAccountAuthState`](#get-account-auth-state)：获取账号授权状态
- [`importAccountAuthSession`](#import-account-auth-session)：导入会话授权
- [`startAccountAuth`](#start-account-auth)：启动验证码类授权
- [`startAccountQrAuth`](#start-account-qr-auth)：启动二维码授权
- [`submitAccountAuthCode`](#submit-account-auth-code)：提交验证码
- [`submitAccountAuthPassword`](#submit-account-auth-password)：提交二次密码

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 当前授权状态。                             |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                         | 必有             | 类型               | 约束 | 说明                                                                    |
| -------------------------------------------- | ---------------- | ------------------ | ---- | ----------------------------------------------------------------------- |
| `result.data.request_id`                     | 否               | `string`           | -    | 服务端生成的请求 ID。                                                   |
| `result.data.client_request_id`              | 否               | `string`           | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                          |
| `result.data.data`                           | 是               | `AccountSession`   | -    | -                                                                       |
| `result.data.data.account_id`                | 是               | `string`           | -    | -                                                                       |
| `result.data.data.status`                    | 是               | `string`           | -    | 授权流程状态，例如 pending_auth、awaiting_qr_scan、authorized、failed。 |
| `result.data.data.auth_fields`               | 否               | `Array<AuthField>` | -    | -                                                                       |
| `result.data.data.auth_fields[].type`        | 父字段存在时必填 | `string`           | -    | -                                                                       |
| `result.data.data.auth_fields[].required`    | 父字段存在时必填 | `boolean`          | -    | -                                                                       |
| `result.data.data.auth_fields[].label`       | 否               | `string`           | -    | -                                                                       |
| `result.data.data.auth_fields[].placeholder` | 否               | `string`           | -    | -                                                                       |
| `result.data.data.auth_payload`              | 否               | `FreeFormObject`   | -    | -                                                                       |
| `result.data.data.expires_at`                | 否               | `string`           | -    | -                                                                       |
| `result.data.data.last_error`                | 否               | `string`           | -    | -                                                                       |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 授权参数。常见字段为 `session_url`。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 授权参数。常见字段为 `code`。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

provider 授权参数。常见字段为 `password`。

| 字段   | 必填 | 类型             | 约束 | 说明 |
| ------ | ---- | ---------------- | ---- | ---- |
| `body` | 否   | `FreeFormObject` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                      |
| ----------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | provider 动作结果。字段随 action 与 provider 不同而变化。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                  |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                  |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。                |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                                |

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
