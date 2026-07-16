<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Workspace

[English](../../api-reference/workspace.md) | [简体中文](workspace.md)

[返回 API Reference 索引](README.md)

当前 API Key 所属 workspace。

## 本页 operation

- [`getWorkspace`](#get-workspace)：获取当前 workspace
- [`updateWorkspace`](#update-workspace)：更新当前 workspace

---

<a id="get-workspace"></a>

## `getWorkspace`

获取当前 workspace

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/workspace`                                                    |
| SDK 方法 | `device.getWorkspace(request?, execution?)`                              |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getWorkspace"]>>>` |
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
| `200`       | `application/json` | `ResponseMeta & object` | 当前 workspace 信息。                      |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                       | 必有 | 类型                        | 约束 | 说明                                           |
| ------------------------------------------ | ---- | --------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`                   | 否   | `string`                    | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`            | 否   | `string`                    | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                         | 是   | `Workspace`                 | -    | -                                              |
| `result.data.data.name`                    | 是   | `string`                    | -    | -                                              |
| `result.data.data.status`                  | 是   | `string`                    | -    | -                                              |
| `result.data.data.metadata`                | 否   | `Record<string, string>`    | -    | -                                              |
| `result.data.data.account_quota`           | 是   | `number \| string (uint64)` | -    | -                                              |
| `result.data.data.account_quota_unlimited` | 是   | `boolean`                   | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.getWorkspace();
console.log(result.data.data);
```

---

<a id="update-workspace"></a>

## `updateWorkspace`

更新当前 workspace

| 属性     | 值                                                                          |
| -------- | --------------------------------------------------------------------------- |
| HTTP     | `PATCH` `/v1/workspace`                                                     |
| SDK 方法 | `device.updateWorkspace(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateWorkspace"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                               |
| 变更类型 | `write`                                                                     |
| 自动重试 | 不自动重试                                                                  |

### 参数

无 path、query、header 或 cookie 参数。

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型                     | 约束 | 说明 |
| --------------- | ---- | ------------------------ | ---- | ---- |
| `body.name`     | 是   | `string`                 | -    | -    |
| `body.status`   | 是   | `string`                 | -    | -    |
| `body.metadata` | 否   | `Record<string, string>` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的 workspace 信息。                  |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                       | 必有 | 类型                        | 约束 | 说明                                           |
| ------------------------------------------ | ---- | --------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`                   | 否   | `string`                    | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`            | 否   | `string`                    | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                         | 是   | `Workspace`                 | -    | -                                              |
| `result.data.data.name`                    | 是   | `string`                    | -    | -                                              |
| `result.data.data.status`                  | 是   | `string`                    | -    | -                                              |
| `result.data.data.metadata`                | 否   | `Record<string, string>`    | -    | -                                              |
| `result.data.data.account_quota`           | 是   | `number \| string (uint64)` | -    | -                                              |
| `result.data.data.account_quota_unlimited` | 是   | `boolean`                   | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.updateWorkspace({
  body: {
    name: "Example",
    status: "active"
  }
});
console.log(result.data.data);
```
