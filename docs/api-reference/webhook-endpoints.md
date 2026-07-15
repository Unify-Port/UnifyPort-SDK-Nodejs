<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Webhook Endpoints

[返回 API Reference 索引](README.md)

业务 webhook endpoint 管理。

## 本页 operation

- [`createWebhookEndpoint`](#create-webhook-endpoint)：创建 webhook endpoint
- [`deactivateWebhookEndpoint`](#deactivate-webhook-endpoint)：停用 webhook endpoint
- [`deleteWebhookEndpoint`](#delete-webhook-endpoint)：删除 webhook endpoint
- [`getWebhookEndpoint`](#get-webhook-endpoint)：获取 webhook endpoint
- [`listWebhookEndpoints`](#list-webhook-endpoints)：列出 webhook endpoint
- [`updateWebhookEndpoint`](#update-webhook-endpoint)：更新 webhook endpoint

---

<a id="create-webhook-endpoint"></a>

## `createWebhookEndpoint`

创建 webhook endpoint

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/webhook-endpoints`                                                    |
| SDK 方法 | `device.createWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `write`                                                                           |
| 自动重试 | 不自动重试                                                                        |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段                     | 必填 | 类型                       | 约束 | 说明                                                          |
| ------------------------ | ---- | -------------------------- | ---- | ------------------------------------------------------------- |
| `body.url`               | 是   | `string (uri)`             | -    | -                                                             |
| `body.status`            | 是   | `string`                   | -    | -                                                             |
| `body.subscribed_events` | 否   | `Array<StandardEventType>` | -    | 为空或省略表示接收全部事件。                                  |
| `body.signing_secret`    | 否   | `string`                   | -    | 用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。 |
| `body.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                                             |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                     |
| ----------- | ------------------ | ----------------------- | ------------------------ |
| `201`       | `application/json` | `ResponseMeta & object` | 创建成功。               |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。       |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                                 | 必有 | 类型                       | 约束 | 说明                                           |
| ------------------------------------ | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`      | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                   | 是   | `WebhookEndpoint`          | -    | -                                              |
| `result.data.data.id`                | 是   | `string`                   | -    | -                                              |
| `result.data.data.url`               | 是   | `string (uri)`             | -    | -                                              |
| `result.data.data.status`            | 是   | `string`                   | -    | -                                              |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>` | -    | -                                              |
| `result.data.data.signing_enabled`   | 是   | `boolean`                  | -    | -                                              |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.createWebhookEndpoint({
  body: {
    url: "https://example.com/resource",
    status: "active"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。

---

<a id="deactivate-webhook-endpoint"></a>

## `deactivateWebhookEndpoint`

停用 webhook endpoint

| 属性     | 值                                                                                    |
| -------- | ------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/webhook-endpoints/{endpoint_id}/deactivate`                               |
| SDK 方法 | `device.deactivateWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deactivateWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                         |
| 变更类型 | `write`                                                                               |
| 自动重试 | 不自动重试                                                                            |

### 参数

| SDK 字段                  | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                                        |
| ------------------------- | ---- | ---- | -------- | ---------- | ---- | ------------------------------------------- |
| `params.path.endpoint_id` | path | 是   | `string` | `"we_xxx"` | -    | Webhook endpoint public_id，例如 `we_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                        |
| ----------- | ------------------ | ----------------------- | --------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 停用后的 webhook endpoint。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。          |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。    |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                       | 约束 | 说明                                           |
| ------------------------------------ | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`      | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                   | 是   | `WebhookEndpoint`          | -    | -                                              |
| `result.data.data.id`                | 是   | `string`                   | -    | -                                              |
| `result.data.data.url`               | 是   | `string (uri)`             | -    | -                                              |
| `result.data.data.status`            | 是   | `string`                   | -    | -                                              |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>` | -    | -                                              |
| `result.data.data.signing_enabled`   | 是   | `boolean`                  | -    | -                                              |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.deactivateWebhookEndpoint({
  params: {
    path: {
      endpoint_id: "we_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="delete-webhook-endpoint"></a>

## `deleteWebhookEndpoint`

删除 webhook endpoint

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `DELETE` `/v1/webhook-endpoints/{endpoint_id}`                                    |
| SDK 方法 | `device.deleteWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deleteWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `destructive`                                                                     |
| 自动重试 | 不自动重试                                                                        |

### 参数

| SDK 字段                  | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                                        |
| ------------------------- | ---- | ---- | -------- | ---------- | ---- | ------------------------------------------- |
| `params.path.endpoint_id` | path | 是   | `string` | `"we_xxx"` | -    | Webhook endpoint public_id，例如 `we_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema          | 说明                     |
| ----------- | ------------------ | --------------- | ------------------------ |
| `204`       | 无                 | -               | 删除成功，无响应体。     |
| `400`       | `application/json` | `ErrorEnvelope` | 请求体或参数非法。       |
| `401`       | `application/json` | `ErrorEnvelope` | 缺少或无法校验 API Key。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `204` 无响应体，`result.data` 为 `undefined`。

### TypeScript 示例

```ts
const result = await device.deleteWebhookEndpoint({
  params: {
    path: {
      endpoint_id: "we_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="get-webhook-endpoint"></a>

## `getWebhookEndpoint`

获取 webhook endpoint

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/webhook-endpoints/{endpoint_id}`                                    |
| SDK 方法 | `device.getWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `read`                                                                         |
| 自动重试 | 允许安全重试                                                                   |

### 参数

| SDK 字段                  | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                                        |
| ------------------------- | ---- | ---- | -------- | ---------- | ---- | ------------------------------------------- |
| `params.path.endpoint_id` | path | 是   | `string` | `"we_xxx"` | -    | Webhook endpoint public_id，例如 `we_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | Webhook endpoint 详情。                    |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                       | 约束 | 说明                                           |
| ------------------------------------ | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`      | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                   | 是   | `WebhookEndpoint`          | -    | -                                              |
| `result.data.data.id`                | 是   | `string`                   | -    | -                                              |
| `result.data.data.url`               | 是   | `string (uri)`             | -    | -                                              |
| `result.data.data.status`            | 是   | `string`                   | -    | -                                              |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>` | -    | -                                              |
| `result.data.data.signing_enabled`   | 是   | `boolean`                  | -    | -                                              |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.getWebhookEndpoint({
  params: {
    path: {
      endpoint_id: "we_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-webhook-endpoints"></a>

## `listWebhookEndpoints`

列出 webhook endpoint

| 属性     | 值                                                                               |
| -------- | -------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/webhook-endpoints`                                                    |
| SDK 方法 | `device.listWebhookEndpoints(request?, execution?)`                              |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listWebhookEndpoints"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                    |
| 变更类型 | `read`                                                                           |
| 自动重试 | 允许安全重试                                                                     |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | Webhook endpoint 列表。                    |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                   | 必有 | 类型                       | 约束 | 说明                                           |
| -------------------------------------- | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`               | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`        | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                     | 是   | `Array<WebhookEndpoint>`   | -    | -                                              |
| `result.data.data[].id`                | 是   | `string`                   | -    | -                                              |
| `result.data.data[].url`               | 是   | `string (uri)`             | -    | -                                              |
| `result.data.data[].status`            | 是   | `string`                   | -    | -                                              |
| `result.data.data[].subscribed_events` | 否   | `Array<StandardEventType>` | -    | -                                              |
| `result.data.data[].signing_enabled`   | 是   | `boolean`                  | -    | -                                              |
| `result.data.data[].retry_policy`      | 否   | `FreeFormObject`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.listWebhookEndpoints();
console.log(result.data.data);
```

---

<a id="update-webhook-endpoint"></a>

## `updateWebhookEndpoint`

更新 webhook endpoint

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `PATCH` `/v1/webhook-endpoints/{endpoint_id}`                                     |
| SDK 方法 | `device.updateWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `write`                                                                           |
| 自动重试 | 不自动重试                                                                        |

### 参数

| SDK 字段                  | 位置 | 必填 | 类型     | 示例       | 约束 | 说明                                        |
| ------------------------- | ---- | ---- | -------- | ---------- | ---- | ------------------------------------------- |
| `params.path.endpoint_id` | path | 是   | `string` | `"we_xxx"` | -    | Webhook endpoint public_id，例如 `we_xxx`。 |

### 请求体

JSON 请求体。

| 字段                     | 必填 | 类型                       | 约束 | 说明                                                          |
| ------------------------ | ---- | -------------------------- | ---- | ------------------------------------------------------------- |
| `body.url`               | 是   | `string (uri)`             | -    | -                                                             |
| `body.status`            | 是   | `string`                   | -    | -                                                             |
| `body.subscribed_events` | 否   | `Array<StandardEventType>` | -    | 为空或省略表示接收全部事件。                                  |
| `body.signing_secret`    | 否   | `string`                   | -    | 用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。 |
| `body.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                                             |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                        |
| ----------- | ------------------ | ----------------------- | --------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的 webhook endpoint。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。          |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。    |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                       | 约束 | 说明                                           |
| ------------------------------------ | ---- | -------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                   | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`      | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                   | 是   | `WebhookEndpoint`          | -    | -                                              |
| `result.data.data.id`                | 是   | `string`                   | -    | -                                              |
| `result.data.data.url`               | 是   | `string (uri)`             | -    | -                                              |
| `result.data.data.status`            | 是   | `string`                   | -    | -                                              |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>` | -    | -                                              |
| `result.data.data.signing_enabled`   | 是   | `boolean`                  | -    | -                                              |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.updateWebhookEndpoint({
  params: {
    path: {
      endpoint_id: "we_xxx"
    }
  },
  body: {
    url: "https://example.com/resource",
    status: "active"
  }
});
console.log(result.data.data);
```

> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。
