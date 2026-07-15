<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Contacts

[返回 API Reference 索引](README.md)

provider 联系人视图与联系人动作。

## 本页 operation

- [`blockContact`](#block-contact)：封锁联系人
- [`getContact`](#get-contact)：获取联系人详情
- [`listContactBlocklist`](#list-contact-blocklist)：查询联系人黑名单
- [`listContacts`](#list-contacts)：列出联系人
- [`setContactNote`](#set-contact-note)：设置或清空联系人备注
- [`unblockContact`](#unblock-contact)：解封联系人

---

<a id="block-contact"></a>

## `blockContact`

封锁联系人

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/contacts/block`                        |
| SDK 方法 | `device.blockContact(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["blockContact"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `write`                                                                  |
| 自动重试 | 不自动重试                                                               |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明 |
| ----------------- | ---- | -------- | ---- | ---- |
| `body.contact_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.blockContact({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    contact_id: "contact_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="get-contact"></a>

## `getContact`

获取联系人详情

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/contacts/info`                        |
| SDK 方法 | `device.getContact(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getContact"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `read`                                                                 |
| 自动重试 | 允许安全重试                                                           |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例            | 约束 | 说明                                                        |
| ------------------------- | ----- | ---- | -------- | --------------- | ---- | ----------------------------------------------------------- |
| `params.path.account_id`  | path  | 是   | `string` | `"acc_xxx"`     | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。           |
| `params.query.contact_id` | query | 是   | `string` | `"contact_xxx"` | -    | provider 侧联系人 ID，因可能包含 `@` 等字符，固定走 query。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 联系人详情。                               |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                | 必有 | 类型             | 约束 | 说明                                           |
| ----------------------------------- | ---- | ---------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`            | 否   | `string`         | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`     | 否   | `string`         | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                  | 是   | `Contact`        | -    | -                                              |
| `result.data.data.id`               | 是   | `string`         | -    | -                                              |
| `result.data.data.conversation_id`  | 是   | `string`         | -    | -                                              |
| `result.data.data.display_name`     | 是   | `string`         | -    | -                                              |
| `result.data.data.avatar_url`       | 是   | `string`         | -    | -                                              |
| `result.data.data.provider_user_id` | 是   | `string`         | -    | -                                              |
| `result.data.data.is_blocked`       | 否   | `boolean`        | -    | -                                              |
| `result.data.data.extra`            | 否   | `FreeFormObject` | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.getContact({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      contact_id: "contact_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-contact-blocklist"></a>

## `listContactBlocklist`

查询联系人黑名单

| 属性     | 值                                                                               |
| -------- | -------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/contacts/blocklist`                             |
| SDK 方法 | `device.listContactBlocklist(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listContactBlocklist"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                    |
| 变更类型 | `read`                                                                           |
| 自动重试 | 允许安全重试                                                                     |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 黑名单列表。                               |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                     | 约束 | 说明                                           |
| ------------------------------- | ---- | ------------------------ | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`                 | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`                 | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `ContactBlocklistResult` | -    | -                                              |
| `result.data.data.blocklist`    | 是   | `Array<string>`          | -    | -                                              |
| `result.data.data.dhash`        | 否   | `string`                 | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.listContactBlocklist({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-contacts"></a>

## `listContacts`

列出联系人

| 属性     | 值                                                                       |
| -------- | ------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/accounts/{account_id}/contacts`                               |
| SDK 方法 | `device.listContacts(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listContacts"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                            |
| 变更类型 | `read`                                                                   |
| 自动重试 | 允许安全重试                                                             |

### 参数

| SDK 字段                     | 位置  | 必填 | 类型                 | 示例                     | 约束      | 说明                                                                          |
| ---------------------------- | ----- | ---- | -------------------- | ------------------------ | --------- | ----------------------------------------------------------------------------- |
| `params.path.account_id`     | path  | 是   | `string`             | `"acc_xxx"`              | -         | Device API 签发的账号 public_id，例如 `acc_xxx`。                             |
| `params.query.cursor`        | query | 否   | `string`             | `"cursor_xxx"`           | -         | 上一次响应返回的 `next_cursor`。                                              |
| `params.query.limit`         | query | 否   | `integer`            | `1`                      | minimum=1 | 每页数量；未提供时的默认值可能因 provider 而异。                              |
| `params.query.q`             | query | 否   | `string`             | `"q_xxx"`                | -         | 关键字过滤。                                                                  |
| `params.query.updated_since` | query | 否   | `string (date-time)` | `"2026-01-01T00:00:00Z"` | -         | RFC3339 时间戳，只返回此时间后更新的联系人；provider 不支持时可能退化为全量。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 联系人分页列表。                           |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                        | 必有 | 类型                | 约束 | 说明                                           |
| ------------------------------------------- | ---- | ------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`                    | 否   | `string`            | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`             | 否   | `string`            | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                          | 是   | `ContactListResult` | -    | -                                              |
| `result.data.data.items`                    | 是   | `Array<Contact>`    | -    | -                                              |
| `result.data.data.items[].id`               | 是   | `string`            | -    | -                                              |
| `result.data.data.items[].conversation_id`  | 是   | `string`            | -    | -                                              |
| `result.data.data.items[].display_name`     | 是   | `string`            | -    | -                                              |
| `result.data.data.items[].avatar_url`       | 是   | `string`            | -    | -                                              |
| `result.data.data.items[].provider_user_id` | 是   | `string`            | -    | -                                              |
| `result.data.data.items[].is_blocked`       | 否   | `boolean`           | -    | -                                              |
| `result.data.data.items[].extra`            | 否   | `FreeFormObject`    | -    | -                                              |
| `result.data.data.next_cursor`              | 否   | `string`            | -    | -                                              |
| `result.data.data.has_more`                 | 是   | `boolean`           | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.listContacts({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      limit: 1
    }
  }
});
console.log(result.data.data);
```

---

<a id="set-contact-note"></a>

## `setContactNote`

设置或清空联系人备注

| 属性     | 值                                                                         |
| -------- | -------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/contacts/note`                           |
| SDK 方法 | `device.setContactNote(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["setContactNote"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                              |
| 变更类型 | `write`                                                                    |
| 自动重试 | 不自动重试                                                                 |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明                     |
| ----------------- | ---- | -------- | ---- | ------------------------ |
| `body.contact_id` | 是   | `string` | -    | -                        |
| `body.note`       | 是   | `string` | -    | 传空字符串表示清空备注。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.setContactNote({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    contact_id: "contact_xxx",
    note: "Example note"
  }
});
console.log(result.data.data);
```

---

<a id="unblock-contact"></a>

## `unblockContact`

解封联系人

| 属性     | 值                                                                         |
| -------- | -------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/contacts/unblock`                        |
| SDK 方法 | `device.unblockContact(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["unblockContact"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                              |
| 变更类型 | `write`                                                                    |
| 自动重试 | 不自动重试                                                                 |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | Device API 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明 |
| ----------------- | ---- | -------- | ---- | ---- |
| `body.contact_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                   |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |
| `501`       | `application/json` | `ErrorEnvelope`         | 当前 provider 不支持该能力。               |
| `502`       | `application/json` | `ErrorEnvelope`         | 当前 provider 能力不可用。                 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型      | 约束       | 说明                                           |
| ------------------------------- | ---- | --------- | ---------- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`  | -          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`  | -          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `OkData`  | -          | -                                              |
| `result.data.data.ok`           | 是   | `boolean` | const=true | -                                              |

### TypeScript 示例

```ts
const result = await device.unblockContact({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    contact_id: "contact_xxx"
  }
});
console.log(result.data.data);
```
