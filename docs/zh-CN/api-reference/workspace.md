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

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 当前 workspace 信息。      |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                       | 必有 | 类型                        | 约束                      | 说明                                                                                                                                                       |
| ------------------------------------------ | ---- | --------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                   | 否   | `string`                    | -                         | 服务端生成的请求 ID。                                                                                                                                      |
| `result.data.client_request_id`            | 否   | `string`                    | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                             |
| `result.data.data`                         | 是   | `Workspace`                 | -                         | -                                                                                                                                                          |
| `result.data.data.is_beta`                 | 是   | `boolean`                   | default=false             | 工作区是否已开通内测，默认关闭；仅服务端可管理，客户不能通过 PATCH 或 metadata 修改。                                                                      |
| `result.data.data.name`                    | 是   | `string`                    | -                         | -                                                                                                                                                          |
| `result.data.data.status`                  | 是   | `WorkspaceStatus`           | enum="active", "inactive" | Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。                                                                             |
| `result.data.data.metadata`                | 否   | `Record<string, string>`    | -                         | -                                                                                                                                                          |
| `result.data.data.account_quota`           | 是   | `number \| string (uint64)` | -                         | 当前生效的只读账号总容量，包含免费额度和有效期内的付费额度，不扣除已用数量；已到期的付费额度不计入。                                                       |
| `result.data.data.account_quota_used`      | 是   | `number \| string (uint64)` | -                         | 当前已占用的只读账号额度，账号创建后即占用，删除后释放；待授权、停止或断线的账号仍计入。付费额度到期后，已用额度可能超过 account_quota，按实际已用值返回。 |
| `result.data.data.account_quota_unlimited` | 是   | `boolean`                   | -                         | 兼容保留的只读字段，当前配额模式固定返回 false；账号容量以 account_quota 为准。                                                                            |

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

| 字段            | 必填 | 类型                     | 约束                      | 说明                                                                                                                                                                                                      |
| --------------- | ---- | ------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.name`     | 是   | `string`                 | minLength=1               | -                                                                                                                                                                                                         |
| `body.status`   | 是   | `WorkspaceStatus`        | enum="active", "inactive" | Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。                                                                                                                            |
| `body.metadata` | 否   | `Record<string, string>` | -                         | 省略时保留现有 metadata；传入空对象时只清空客户可写字段。 `account_quota`、`account_quota_unlimited` 与 `is_beta` 是服务端保留键，提交任一保留键返回 `400 invalid_request`；顶层提交 `is_beta` 同样拒绝。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                       |
| ----------- | ------------------ | ----------------------- | -------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 更新后的 workspace 信息。  |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                       | 必有 | 类型                        | 约束                      | 说明                                                                                                                                                       |
| ------------------------------------------ | ---- | --------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                   | 否   | `string`                    | -                         | 服务端生成的请求 ID。                                                                                                                                      |
| `result.data.client_request_id`            | 否   | `string`                    | -                         | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                             |
| `result.data.data`                         | 是   | `Workspace`                 | -                         | -                                                                                                                                                          |
| `result.data.data.is_beta`                 | 是   | `boolean`                   | default=false             | 工作区是否已开通内测，默认关闭；仅服务端可管理，客户不能通过 PATCH 或 metadata 修改。                                                                      |
| `result.data.data.name`                    | 是   | `string`                    | -                         | -                                                                                                                                                          |
| `result.data.data.status`                  | 是   | `WorkspaceStatus`           | enum="active", "inactive" | Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。                                                                             |
| `result.data.data.metadata`                | 否   | `Record<string, string>`    | -                         | -                                                                                                                                                          |
| `result.data.data.account_quota`           | 是   | `number \| string (uint64)` | -                         | 当前生效的只读账号总容量，包含免费额度和有效期内的付费额度，不扣除已用数量；已到期的付费额度不计入。                                                       |
| `result.data.data.account_quota_used`      | 是   | `number \| string (uint64)` | -                         | 当前已占用的只读账号额度，账号创建后即占用，删除后释放；待授权、停止或断线的账号仍计入。付费额度到期后，已用额度可能超过 account_quota，按实际已用值返回。 |
| `result.data.data.account_quota_unlimited` | 是   | `boolean`                   | -                         | 兼容保留的只读字段，当前配额模式固定返回 false；账号容量以 account_quota 为准。                                                                            |

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
