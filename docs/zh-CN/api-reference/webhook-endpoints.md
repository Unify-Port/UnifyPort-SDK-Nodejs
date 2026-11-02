<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Webhook Endpoints

[English](../../api-reference/webhook-endpoints.md) | [简体中文](webhook-endpoints.md)

[返回 API Reference 索引](README.md)

管理 Webhook 接收地址。

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

body 省略 account_id 时创建工作空间端点；指定公开账号 ID 时创建该账号的独立端点。 账号独立配置整体优先于工作空间配置，停用或未订阅某类事件不会回退；删除最后一个独立端点后，后续首次投递恢复继承。 account_id 只接受 body 中的非空字符串，不接受 query、null 或重复字段。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 有效的账号配置请求直接创建账号端点，不改建为工作空间端点。 同一 account_id 最多一个 active 独立端点；创建 status=active 时已有 active 端点返回 409 account_webhook_already_exists（40008）。 status=inactive 可创建多个，不占用 active 名额。更换 URL 或其他配置使用 PATCH 更新已有端点。工作空间端点仍可配置多个；历史多 active 端点不会自动清理。 创建后应核对响应的 account_id；账号绑定不可通过 PATCH 修改。

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

| 字段                     | 必填 | 类型                                  | 约束                       | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | ---- | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.account_id`        | 否   | `string`                              | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`；创建用于绑定，更新只用于校验原绑定。                                                                                                                                                                                                                                                                                                                                                                       |
| `body.url`               | 是   | `string (uri)`                        | -                          | 必须是绝对 HTTP(S) URL。                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `body.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive"  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `body.subscribed_events` | 否   | `Array<StandardEventType>`            | -                          | 为空、省略或包含 `*` 表示接收当前工作区有权接收的全部事件，包括 contact.updated；is_beta=true 的内测工作区还包含 call.incoming、call.answered、call.ended，无需额外逐项订阅。非内测工作区可以使用通配订阅，但不会收到通话事件；明确订阅通话事件仍返回 403 beta_feature_not_enabled（41002）。非通配的具体事件列表仅接收列出的事件。每次投递、重试及死信重放均重新核验内测资格，查询异常不放行。呼入暂未开放；message.* 通话记录不受内测门禁影响。 |
| `body.signing_secret`    | 否   | `string`                              | -                          | 用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。                                                                                                                                                                                                                                                                                                                                                                                     |
| `body.retry_policy`      | 否   | `FreeFormObject`                      | -                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `201`       | `application/json` | `ResponseMeta & object` | 创建成功。                                                                                                                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                   |
| `403`       | `application/json` | `ErrorEnvelope`         | 目标工作区未开通内测，无法调用通话接口或显式订阅 call.incoming、call.answered、call.ended。                                                |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 创建 active 端点或将 inactive 端点改为 active 时，账号已有其他 active Webhook 端点；查询并更新已有 active 端点，或先停用它再启用其他端点。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `201` 的响应字段：

| 字段                                 | 必有 | 类型                                  | 约束                      | 说明                                                             |
| ------------------------------------ | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                              | -                         | 服务端生成的请求 ID。                                            |
| `result.data.client_request_id`      | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                   |
| `result.data.data`                   | 是   | `WebhookEndpoint`                     | -                         | -                                                                |
| `result.data.data.id`                | 是   | `string`                              | -                         | -                                                                |
| `result.data.data.account_id`        | 否   | `string`                              | minLength=1               | 账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。 |
| `result.data.data.url`               | 是   | `string (uri)`                        | -                         | 必须是绝对 HTTP(S) URL。                                         |
| `result.data.data.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                                                |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>`            | -                         | -                                                                |
| `result.data.data.signing_enabled`   | 是   | `boolean`                             | -                         | -                                                                |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`                      | -                         | -                                                                |

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

停用当前工作空间内的端点；可选 query account_id 仅校验原绑定，不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 停用账号全部独立端点表示暂停该账号回调，不恢复工作空间继承。 端点不存在时保持 HTTP 500 deactivate_webhook_endpoint_failed，numeric_code 为 40006。

| 属性     | 值                                                                                    |
| -------- | ------------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/webhook-endpoints/{endpoint_id}/deactivate`                               |
| SDK 方法 | `device.deactivateWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deactivateWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                         |
| 变更类型 | `write`                                                                               |
| 自动重试 | 不自动重试                                                                            |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例        | 约束                       | 说明                                                                                                                                                                                                                               |
| ------------------------- | ----- | ---- | -------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.endpoint_id` | path  | 是   | `string` | `"we_xxx"`  | -                          | Webhook endpoint public_id，例如 `we_xxx`。                                                                                                                                                                                        |
| `params.query.account_id` | query | 否   | `string` | `"acc_xxx"` | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                        |
| ----------- | ------------------ | ----------------------- | --------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 停用后的 webhook endpoint。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。          |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。    |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。    |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                                  | 约束                      | 说明                                                             |
| ------------------------------------ | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                              | -                         | 服务端生成的请求 ID。                                            |
| `result.data.client_request_id`      | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                   |
| `result.data.data`                   | 是   | `WebhookEndpoint`                     | -                         | -                                                                |
| `result.data.data.id`                | 是   | `string`                              | -                         | -                                                                |
| `result.data.data.account_id`        | 否   | `string`                              | minLength=1               | 账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。 |
| `result.data.data.url`               | 是   | `string (uri)`                        | -                         | 必须是绝对 HTTP(S) URL。                                         |
| `result.data.data.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                                                |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>`            | -                         | -                                                                |
| `result.data.data.signing_enabled`   | 是   | `boolean`                             | -                         | -                                                                |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`                      | -                         | -                                                                |

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

按 endpoint_id 幂等删除当前工作空间内的端点；可选 query account_id 仅校验原绑定。 已找到端点但账号归属不匹配返回 400 invalid_request，不执行删除。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点确实不存在时返回 204；删除账号最后一个独立端点后，后续首次投递恢复继承工作空间配置。 原端点尚未完成的投递停止，不转投工作空间；已经发出的 HTTP 请求无法撤回。

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `DELETE` `/v1/webhook-endpoints/{endpoint_id}`                                    |
| SDK 方法 | `device.deleteWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["deleteWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `destructive`                                                                     |
| 自动重试 | 不自动重试                                                                        |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例        | 约束                       | 说明                                                                                                                                                                                                                               |
| ------------------------- | ----- | ---- | -------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.endpoint_id` | path  | 是   | `string` | `"we_xxx"`  | -                          | Webhook endpoint public_id，例如 `we_xxx`。                                                                                                                                                                                        |
| `params.query.account_id` | query | 否   | `string` | `"acc_xxx"` | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema          | 说明                     |
| ----------- | ------------------ | --------------- | ------------------------ |
| `204`       | 无                 | -               | 删除成功，无响应体。     |
| `400`       | `application/json` | `ErrorEnvelope` | 请求体或参数非法。       |
| `401`       | `application/json` | `ErrorEnvelope` | 缺少或无法校验 API Key。 |
| `404`       | `application/json` | `ErrorEnvelope` | 资源不存在或路由不存在。 |

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

按 endpoint_id 获取当前工作空间内的端点，包括工作空间和账号端点。 可选 query account_id 仅校验端点的账号归属；不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点不存在时保持 HTTP 500 get_webhook_endpoint_failed，numeric_code 为 40006。

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/webhook-endpoints/{endpoint_id}`                                    |
| SDK 方法 | `device.getWebhookEndpoint(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getWebhookEndpoint"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `read`                                                                         |
| 自动重试 | 允许安全重试                                                                   |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例        | 约束                       | 说明                                                                                                                                                                                                                               |
| ------------------------- | ----- | ---- | -------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.endpoint_id` | path  | 是   | `string` | `"we_xxx"`  | -                          | Webhook endpoint public_id，例如 `we_xxx`。                                                                                                                                                                                        |
| `params.query.account_id` | query | 否   | `string` | `"acc_xxx"` | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | Webhook endpoint 详情。    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                                  | 约束                      | 说明                                                             |
| ------------------------------------ | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                              | -                         | 服务端生成的请求 ID。                                            |
| `result.data.client_request_id`      | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                   |
| `result.data.data`                   | 是   | `WebhookEndpoint`                     | -                         | -                                                                |
| `result.data.data.id`                | 是   | `string`                              | -                         | -                                                                |
| `result.data.data.account_id`        | 否   | `string`                              | minLength=1               | 账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。 |
| `result.data.data.url`               | 是   | `string (uri)`                        | -                         | 必须是绝对 HTTP(S) URL。                                         |
| `result.data.data.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                                                |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>`            | -                         | -                                                                |
| `result.data.data.signing_enabled`   | 是   | `boolean`                             | -                         | -                                                                |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`                      | -                         | -                                                                |

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

省略 account_id 时只列当前工作空间的 Webhook 端点；指定时只列该账号的独立配置。 账号没有独立配置时 data 为 []，不混入继承的工作空间配置。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。

| 属性     | 值                                                                               |
| -------- | -------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/webhook-endpoints`                                                    |
| SDK 方法 | `device.listWebhookEndpoints(request?, execution?)`                              |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listWebhookEndpoints"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                    |
| 变更类型 | `read`                                                                           |
| 自动重试 | 允许安全重试                                                                     |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例        | 约束                       | 说明                                                                                                                                                                                                                               |
| ------------------------- | ----- | ---- | -------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.query.account_id` | query | 否   | `string` | `"acc_xxx"` | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | Webhook endpoint 列表。    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                   | 必有 | 类型                                  | 约束                      | 说明                                                             |
| -------------------------------------- | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `result.data.request_id`               | 否   | `string`                              | -                         | 服务端生成的请求 ID。                                            |
| `result.data.client_request_id`        | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                   |
| `result.data.data`                     | 是   | `Array<WebhookEndpoint>`              | -                         | -                                                                |
| `result.data.data[].id`                | 是   | `string`                              | -                         | -                                                                |
| `result.data.data[].account_id`        | 否   | `string`                              | minLength=1               | 账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。 |
| `result.data.data[].url`               | 是   | `string (uri)`                        | -                         | 必须是绝对 HTTP(S) URL。                                         |
| `result.data.data[].status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                                                |
| `result.data.data[].subscribed_events` | 否   | `Array<StandardEventType>`            | -                         | -                                                                |
| `result.data.data[].signing_enabled`   | 是   | `boolean`                             | -                         | -                                                                |
| `result.data.data[].retry_policy`      | 否   | `FreeFormObject`                      | -                         | -                                                                |

### TypeScript 示例

```ts
const result = await device.listWebhookEndpoints();
console.log(result.data.data);
```

---

<a id="update-webhook-endpoint"></a>

## `updateWebhookEndpoint`

更新 webhook endpoint

提交 url、status 和需要保留的完整配置。省略 body account_id 时保留端点的已有归属。 提供 account_id 仅校验原绑定一致；不允许切换账号、把工作空间端点改为账号端点或清空绑定。 account_id 不接受 query、null 或重复字段，归属不匹配返回 400 invalid_request。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 账号端点可直接从停用恢复启用，归属保持不变。 inactive 改为 active 时，账号已有其他 active 端点返回 409 account_webhook_already_exists（40008）；原端点已为 active 且保持 active 时允许更新，包括历史多 active 配置。 省略 signing_secret 关闭签名；省略 retry_policy 恢复默认策略；订阅数组整体替换。 端点不存在时保持 HTTP 500 update_webhook_endpoint_failed，numeric_code 为 40006。

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

| 字段                     | 必填 | 类型                                  | 约束                       | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | ---- | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.account_id`        | 否   | `string`                              | minLength=1, pattern="\\S" | 可选的公开账号 ID，例如 `acc_example`；创建用于绑定，更新只用于校验原绑定。                                                                                                                                                                                                                                                                                                                                                                       |
| `body.url`               | 是   | `string (uri)`                        | -                          | 必须是绝对 HTTP(S) URL。                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `body.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive"  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `body.subscribed_events` | 否   | `Array<StandardEventType>`            | -                          | 为空、省略或包含 `*` 表示接收当前工作区有权接收的全部事件，包括 contact.updated；is_beta=true 的内测工作区还包含 call.incoming、call.answered、call.ended，无需额外逐项订阅。非内测工作区可以使用通配订阅，但不会收到通话事件；明确订阅通话事件仍返回 403 beta_feature_not_enabled（41002）。非通配的具体事件列表仅接收列出的事件。每次投递、重试及死信重放均重新核验内测资格，查询异常不放行。呼入暂未开放；message.* 通话记录不受内测门禁影响。 |
| `body.signing_secret`    | 否   | `string`                              | -                          | 用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。                                                                                                                                                                                                                                                                                                                                                                                     |
| `body.retry_policy`      | 否   | `FreeFormObject`                      | -                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的 webhook endpoint。                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                   |
| `403`       | `application/json` | `ErrorEnvelope`         | 目标工作区未开通内测，无法调用通话接口或显式订阅 call.incoming、call.answered、call.ended。                                                |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 创建 active 端点或将 inactive 端点改为 active 时，账号已有其他 active Webhook 端点；查询并更新已有 active 端点，或先停用它再启用其他端点。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                 | 必有 | 类型                                  | 约束                      | 说明                                                             |
| ------------------------------------ | ---- | ------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `result.data.request_id`             | 否   | `string`                              | -                         | 服务端生成的请求 ID。                                            |
| `result.data.client_request_id`      | 否   | `string`                              | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                   |
| `result.data.data`                   | 是   | `WebhookEndpoint`                     | -                         | -                                                                |
| `result.data.data.id`                | 是   | `string`                              | -                         | -                                                                |
| `result.data.data.account_id`        | 否   | `string`                              | minLength=1               | 账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。 |
| `result.data.data.url`               | 是   | `string (uri)`                        | -                         | 必须是绝对 HTTP(S) URL。                                         |
| `result.data.data.status`            | 是   | `string enum("active" \| "inactive")` | enum="active", "inactive" | -                                                                |
| `result.data.data.subscribed_events` | 否   | `Array<StandardEventType>`            | -                         | -                                                                |
| `result.data.data.signing_enabled`   | 是   | `boolean`                             | -                         | -                                                                |
| `result.data.data.retry_policy`      | 否   | `FreeFormObject`                      | -                         | -                                                                |

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
