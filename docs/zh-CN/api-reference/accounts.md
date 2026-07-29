<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Accounts

[English](../../api-reference/accounts.md) | [简体中文](accounts.md)

[返回 API Reference 索引](README.md)

provider 账号资源管理。

## 本页 operation

- [`createAccount`](#create-account)：创建账号
- [`deleteAccount`](#delete-account)：删除账号
- [`getAccount`](#get-account)：获取账号详情
- [`listAccounts`](#list-accounts)：列出账号
- [`updateAccount`](#update-account)：更新账号

---

<a id="create-account"></a>

## `createAccount`

创建账号

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts`                                                     |
| SDK 方法 | `device.createAccount(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createAccount"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `write`                                                                   |
| 自动重试 | 不自动重试                                                                |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                        | 必填 | 类型             | 约束                                                                                                  | 说明                                                                       |
| --------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `body.name`                 | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `body.region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `body.status`               | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `body.auth_mode`            | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `body.metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `body.provider_account_ref` | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.provider_data`        | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `body.proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `201`       | `application/json` | `ResponseMeta & object` | 创建成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `503`       | `application/json` | `ErrorEnvelope`         | 服务暂不可用。                             |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                                    | 必有 | 类型             | 约束                                                                                                  | 说明                                                                       |
| --------------------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`         | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`         | 否   | `string`         | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                      | 是   | `Account`        | -                                                                                                     | -                                                                          |
| `result.data.data.id`                   | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.name`                 | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.status`               | 是   | `string`         | -                                                                                                     | 账号资源状态，例如 active、inactive、disabled。                            |
| `result.data.data.runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.auth_mode`            | 否   | `string`         | -                                                                                                     | 授权模式，例如 qrcode、code、session。                                     |
| `result.data.data.capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `result.data.data.metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_account_ref` | 否   | `string`         | -                                                                                                     | provider 侧账号公开标识。                                                  |
| `result.data.data.proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_profile`     | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.createAccount({
  body: {
    provider: "telegram",
    region: "global"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。

---

<a id="delete-account"></a>

## `deleteAccount`

删除账号

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `DELETE` `/v1/accounts/{account_id}`                                      |
| SDK 方法 | `device.deleteAccount(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deleteAccount"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `destructive`                                                             |
| 自动重试 | 不自动重试                                                                |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema          | 说明                                       |
| ----------- | ------------------ | --------------- | ------------------------------------------ |
| `204`       | 无                 | -               | 删除成功，无响应体。                       |
| `401`       | `application/json` | `ErrorEnvelope` | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope` | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope` | 服务端内部错误或 provider 链路未映射错误。 |
| `502`       | `application/json` | `ErrorEnvelope` | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `204` 无响应体，`result.data` 为 `undefined`。

### TypeScript 示例

```ts
const result = await device.deleteAccount({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="get-account"></a>

## `getAccount`

获取账号详情

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}`                                      |
| SDK 方法 | `device.getAccount(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getAccount"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `read`                                                                 |
| 自动重试 | 允许安全重试                                                           |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 账号详情。                                 |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型             | 约束                                                                                                  | 说明                                                                       |
| --------------------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`         | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`         | 否   | `string`         | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                      | 是   | `Account`        | -                                                                                                     | -                                                                          |
| `result.data.data.id`                   | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.name`                 | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.status`               | 是   | `string`         | -                                                                                                     | 账号资源状态，例如 active、inactive、disabled。                            |
| `result.data.data.runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.auth_mode`            | 否   | `string`         | -                                                                                                     | 授权模式，例如 qrcode、code、session。                                     |
| `result.data.data.capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `result.data.data.metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_account_ref` | 否   | `string`         | -                                                                                                     | provider 侧账号公开标识。                                                  |
| `result.data.data.proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_profile`     | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.getAccount({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="list-accounts"></a>

## `listAccounts`

列出账号

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/accounts`                                                     |
| SDK 方法 | `device.listAccounts(request?, execution?)`                              |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listAccounts"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `read`                                                                   |
| 自动重试 | 允许安全重试                                                             |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 当前 workspace 下的账号列表。              |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                      | 必有 | 类型             | 约束                                                                                                  | 说明                                                                       |
| ----------------------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`                  | 否   | `string`         | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`           | 否   | `string`         | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                        | 是   | `Array<Account>` | -                                                                                                     | -                                                                          |
| `result.data.data[].id`                   | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data[].name`                 | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data[].provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data[].region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data[].status`               | 是   | `string`         | -                                                                                                     | 账号资源状态，例如 active、inactive、disabled。                            |
| `result.data.data[].runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data[].auth_mode`            | 否   | `string`         | -                                                                                                     | 授权模式，例如 qrcode、code、session。                                     |
| `result.data.data[].capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `result.data.data[].metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data[].provider_account_ref` | 否   | `string`         | -                                                                                                     | provider 侧账号公开标识。                                                  |
| `result.data.data[].proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data[].provider_profile`     | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.listAccounts();
console.log(result.data.data);
```

---

<a id="update-account"></a>

## `updateAccount`

更新账号

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `PATCH` `/v1/accounts/{account_id}`                                       |
| SDK 方法 | `device.updateAccount(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateAccount"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `write`                                                                   |
| 自动重试 | 不自动重试                                                                |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                        | 必填 | 类型             | 约束                                                                                                  | 说明                                                                       |
| --------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `body.name`                 | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `body.region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `body.status`               | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `body.auth_mode`            | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `body.metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `body.provider_account_ref` | 否   | `string`         | -                                                                                                     | -                                                                          |
| `body.provider_data`        | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `body.proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的账号。                             |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型             | 约束                                                                                                  | 说明                                                                       |
| --------------------------------------- | ---- | ---------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`         | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`         | 否   | `string`         | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                      | 是   | `Account`        | -                                                                                                     | -                                                                          |
| `result.data.data.id`                   | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.name`                 | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.provider`             | 是   | `ProviderName`   | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.region`               | 是   | `string`         | -                                                                                                     | -                                                                          |
| `result.data.data.status`               | 是   | `string`         | -                                                                                                     | 账号资源状态，例如 active、inactive、disabled。                            |
| `result.data.data.runtime_status`       | 否   | `RuntimeStatus`  | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.auth_mode`            | 否   | `string`         | -                                                                                                     | 授权模式，例如 qrcode、code、session。                                     |
| `result.data.data.capabilities`         | 否   | `Array<string>`  | -                                                                                                     | -                                                                          |
| `result.data.data.metadata`             | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_account_ref` | 否   | `string`         | -                                                                                                     | provider 侧账号公开标识。                                                  |
| `result.data.data.proxy`                | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |
| `result.data.data.provider_profile`     | 否   | `FreeFormObject` | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.updateAccount({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    provider: "telegram",
    region: "global"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。
