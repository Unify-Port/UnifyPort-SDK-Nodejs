<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Account Runtime

[English](../../api-reference/account-runtime.md) | [简体中文](account-runtime.md)

[返回 API Reference 索引](README.md)

provider 账号运行态控制。

## 本页 operation

- [`reconnectAccountRuntime`](#reconnect-account-runtime)：重连账号运行态
- [`refreshAccountRuntime`](#refresh-account-runtime)：刷新账号运行态
- [`startAccountRuntime`](#start-account-runtime)：启动账号运行态
- [`stopAccountRuntime`](#stop-account-runtime)：停止账号运行态

---

<a id="reconnect-account-runtime"></a>

## `reconnectAccountRuntime`

重连账号运行态

| 属性     | 值                                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/runtime/reconnect`                                |
| SDK 方法 | `device.reconnectAccountRuntime(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["reconnectAccountRuntime"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                       |
| 变更类型 | `write`                                                                             |
| 自动重试 | 不自动重试                                                                          |

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

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 账号运行态动作结果。                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型                                                                | 约束                                                                                                  | 说明                                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`            | 否   | `string`                                                            | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`     | 否   | `string`                                                            | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                  | 是   | `RuntimeActionResult`                                               | -                                                                                                     | -                                                                          |
| `result.data.data.account_id`       | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.provider`         | 是   | `ProviderName`                                                      | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.action`           | 是   | `string enum("refresh_status" \| "start" \| "stop" \| "reconnect")` | enum="refresh_status", "start", "stop", "reconnect"                                                   | -                                                                          |
| `result.data.data.operation_status` | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.runtime_status`   | 是   | `RuntimeStatus`                                                     | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.runtime_error`    | 是   | `string`                                                            | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.reconnectAccountRuntime({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="refresh-account-runtime"></a>

## `refreshAccountRuntime`

刷新账号运行态

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/runtime/refresh`                                |
| SDK 方法 | `device.refreshAccountRuntime(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["refreshAccountRuntime"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `write`                                                                           |
| 自动重试 | 不自动重试                                                                        |

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

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 账号运行态动作结果。                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型                                                                | 约束                                                                                                  | 说明                                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`            | 否   | `string`                                                            | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`     | 否   | `string`                                                            | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                  | 是   | `RuntimeActionResult`                                               | -                                                                                                     | -                                                                          |
| `result.data.data.account_id`       | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.provider`         | 是   | `ProviderName`                                                      | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.action`           | 是   | `string enum("refresh_status" \| "start" \| "stop" \| "reconnect")` | enum="refresh_status", "start", "stop", "reconnect"                                                   | -                                                                          |
| `result.data.data.operation_status` | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.runtime_status`   | 是   | `RuntimeStatus`                                                     | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.runtime_error`    | 是   | `string`                                                            | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.refreshAccountRuntime({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="start-account-runtime"></a>

## `startAccountRuntime`

启动账号运行态

| 属性     | 值                                                                              |
| -------- | ------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/runtime/start`                                |
| SDK 方法 | `device.startAccountRuntime(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["startAccountRuntime"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                   |
| 变更类型 | `write`                                                                         |
| 自动重试 | 不自动重试                                                                      |

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

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 账号运行态动作结果。                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型                                                                | 约束                                                                                                  | 说明                                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`            | 否   | `string`                                                            | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`     | 否   | `string`                                                            | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                  | 是   | `RuntimeActionResult`                                               | -                                                                                                     | -                                                                          |
| `result.data.data.account_id`       | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.provider`         | 是   | `ProviderName`                                                      | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.action`           | 是   | `string enum("refresh_status" \| "start" \| "stop" \| "reconnect")` | enum="refresh_status", "start", "stop", "reconnect"                                                   | -                                                                          |
| `result.data.data.operation_status` | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.runtime_status`   | 是   | `RuntimeStatus`                                                     | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.runtime_error`    | 是   | `string`                                                            | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.startAccountRuntime({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="stop-account-runtime"></a>

## `stopAccountRuntime`

停止账号运行态

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/runtime/stop`                                |
| SDK 方法 | `device.stopAccountRuntime(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["stopAccountRuntime"]>>>` |
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

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 账号运行态动作结果。                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型                                                                | 约束                                                                                                  | 说明                                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`            | 否   | `string`                                                            | -                                                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`     | 否   | `string`                                                            | -                                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                  | 是   | `RuntimeActionResult`                                               | -                                                                                                     | -                                                                          |
| `result.data.data.account_id`       | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.provider`         | 是   | `ProviderName`                                                      | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok"                                 | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.action`           | 是   | `string enum("refresh_status" \| "start" \| "stop" \| "reconnect")` | enum="refresh_status", "start", "stop", "reconnect"                                                   | -                                                                          |
| `result.data.data.operation_status` | 是   | `string`                                                            | -                                                                                                     | -                                                                          |
| `result.data.data.runtime_status`   | 是   | `RuntimeStatus`                                                     | enum="unknown", "starting", "running", "stopping", "stopped", "reconnecting", "disconnected", "error" | -                                                                          |
| `result.data.data.runtime_error`    | 是   | `string`                                                            | -                                                                                                     | -                                                                          |

### TypeScript 示例

```ts
const result = await device.stopAccountRuntime({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```
