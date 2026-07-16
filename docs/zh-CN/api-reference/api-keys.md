<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# API Keys

[English](../../api-reference/api-keys.md) | [简体中文](api-keys.md)

[返回 API Reference 索引](README.md)

workspace API Key 管理。

## 本页 operation

- [`createApiKey`](#create-api-key)：创建 API Key
- [`listApiKeys`](#list-api-keys)：列出 API Key
- [`rotateApiKey`](#rotate-api-key)：轮换 API Key
- [`updateApiKeyStatus`](#update-api-key-status)：更新 API Key 状态

---

<a id="create-api-key"></a>

## `createApiKey`

创建 API Key

完整 `api_key` 只在创建响应中出现一次，客户端应自行保存。

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/api-keys`                                                    |
| SDK 方法 | `device.createApiKey(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createApiKey"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `write`                                                                  |
| 自动重试 | 不自动重试                                                               |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段          | 必填 | 类型     | 约束 | 说明                        |
| ------------- | ---- | -------- | ---- | --------------------------- |
| `body.name`   | 是   | `string` | -    | -                           |
| `body.prefix` | 否   | `string` | -    | 生成 API Key 时使用的前缀。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                         |
| ----------- | ------------------ | ----------------------- | ------------------------------------------------------------ |
| `201`       | `application/json` | `ResponseMeta & object` | 创建成功，返回一次性明文 API Key 与可持久展示的 Key 元数据。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                           |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                     |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                              | 必有 | 类型                                  | 约束                      | 说明                                           |
| --------------------------------- | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------- |
| `result.data.request_id`          | 否   | `string`                              | -                         | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`   | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                | 是   | `APIKeyCreateResult`                  | -                         | -                                              |
| `result.data.data.key`            | 是   | `APIKey`                              | -                         | -                                              |
| `result.data.data.key.id`         | 是   | `string`                              | -                         | -                                              |
| `result.data.data.key.name`       | 是   | `string`                              | -                         | -                                              |
| `result.data.data.key.key_prefix` | 是   | `string`                              | -                         | 可展示的 Key 前缀，不是完整 API Key。          |
| `result.data.data.key.status`     | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                              |
| `result.data.data.api_key`        | 是   | `string`                              | -                         | 完整明文 API Key，仅创建或轮换响应中出现一次。 |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.createApiKey({
  body: {
    name: "默认密钥",
    prefix: "dk_live"
  }
});
console.log(result.status, result.requestId);
```

---

<a id="list-api-keys"></a>

## `listApiKeys`

列出 API Key

| 属性     | 值                                                                      |
| -------- | ----------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/api-keys`                                                    |
| SDK 方法 | `device.listApiKeys(request?, execution?)`                              |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listApiKeys"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                           |
| 变更类型 | `read`                                                                  |
| 自动重试 | 允许安全重试                                                            |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | API Key 列表。不会返回完整明文 API Key。   |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                                  | 约束                      | 说明                                           |
| ------------------------------- | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                              | -                         | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `Array<APIKey>`                       | -                         | -                                              |
| `result.data.data[].id`         | 是   | `string`                              | -                         | -                                              |
| `result.data.data[].name`       | 是   | `string`                              | -                         | -                                              |
| `result.data.data[].key_prefix` | 是   | `string`                              | -                         | 可展示的 Key 前缀，不是完整 API Key。          |
| `result.data.data[].status`     | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                              |

### TypeScript 示例

```ts
const result = await device.listApiKeys();
console.log(result.data.data);
```

---

<a id="rotate-api-key"></a>

## `rotateApiKey`

轮换 API Key

轮换后返回新的完整 `api_key`，旧完整密钥不可恢复。

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/api-keys/{key_id}/rotate`                                    |
| SDK 方法 | `device.rotateApiKey(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["rotateApiKey"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `write`                                                                  |
| 自动重试 | 不自动重试                                                               |

### 参数

| SDK 字段             | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                               |
| -------------------- | ---- | ---- | -------- | ---------- | ---- | ---------------------------------- |
| `params.path.key_id` | path | 是   | `string` | `"ak_xxx"` | -    | API Key public_id，例如 `ak_xxx`。 |

### 请求体

JSON 请求体。

| 字段          | 必填 | 类型     | 约束 | 说明                        |
| ------------- | ---- | -------- | ---- | --------------------------- |
| `body.name`   | 是   | `string` | -    | -                           |
| `body.prefix` | 否   | `string` | -    | 生成 API Key 时使用的前缀。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                     |
| ----------- | ------------------ | ----------------------- | ------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 轮换成功。               |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。       |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                              | 必有 | 类型                                  | 约束                      | 说明                                           |
| --------------------------------- | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------- |
| `result.data.request_id`          | 否   | `string`                              | -                         | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`   | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                | 是   | `APIKeyCreateResult`                  | -                         | -                                              |
| `result.data.data.key`            | 是   | `APIKey`                              | -                         | -                                              |
| `result.data.data.key.id`         | 是   | `string`                              | -                         | -                                              |
| `result.data.data.key.name`       | 是   | `string`                              | -                         | -                                              |
| `result.data.data.key.key_prefix` | 是   | `string`                              | -                         | 可展示的 Key 前缀，不是完整 API Key。          |
| `result.data.data.key.status`     | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                              |
| `result.data.data.api_key`        | 是   | `string`                              | -                         | 完整明文 API Key，仅创建或轮换响应中出现一次。 |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.rotateApiKey({
  params: {
    path: {
      key_id: "ak_xxx"
    }
  },
  body: {
    name: "Example"
  }
});
console.log(result.status, result.requestId);
```

---

<a id="update-api-key-status"></a>

## `updateApiKeyStatus`

更新 API Key 状态

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `PATCH` `/v1/api-keys/{key_id}`                                                |
| SDK 方法 | `device.updateApiKeyStatus(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateApiKeyStatus"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `write`                                                                        |
| 自动重试 | 不自动重试                                                                     |

### 参数

| SDK 字段             | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                               |
| -------------------- | ---- | ---- | -------- | ---------- | ---- | ---------------------------------- |
| `params.path.key_id` | path | 是   | `string` | `"ak_xxx"` | -    | API Key public_id，例如 `ak_xxx`。 |

### 请求体

JSON 请求体。

| 字段          | 必填 | 类型                                  | 约束                      | 说明 |
| ------------- | ---- | ------------------------------------- | ------------------------- | ---- |
| `body.status` | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                      |
| ----------- | ------------------ | ----------------------- | ------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的 API Key 元数据。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。        |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。  |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                                  | 约束                      | 说明                                           |
| ------------------------------- | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                              | -                         | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `APIKey`                              | -                         | -                                              |
| `result.data.data.id`           | 是   | `string`                              | -                         | -                                              |
| `result.data.data.name`         | 是   | `string`                              | -                         | -                                              |
| `result.data.data.key_prefix`   | 是   | `string`                              | -                         | 可展示的 Key 前缀，不是完整 API Key。          |
| `result.data.data.status`       | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                              |

### TypeScript 示例

```ts
const result = await device.updateApiKeyStatus({
  params: {
    path: {
      key_id: "ak_xxx"
    }
  },
  body: {
    status: "active"
  }
});
console.log(result.data.data);
```
