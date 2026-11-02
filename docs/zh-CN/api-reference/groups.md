<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Groups

[English](../../api-reference/groups.md) | [简体中文](groups.md)

[返回 API Reference 索引](README.md)

查询群组及执行群组操作。

## 本页 operation

- [`createGroup`](#create-group)：创建群组
- [`getGroup`](#get-group)：获取群组详情
- [`getGroupInviteCode`](#get-group-invite-code)：获取群邀请链接或邀请码
- [`leaveGroup`](#leave-group)：退出群组
- [`listGroupJoinRequests`](#list-group-join-requests)：列出待审批入群申请
- [`listGroups`](#list-groups)：列出群组
- [`setGroupJoinApprovalMode`](#set-group-join-approval-mode)：设置入群审批模式
- [`updateGroupInfo`](#update-group-info)：修改群信息
- [`updateGroupJoinRequests`](#update-group-join-requests)：处理入群申请
- [`updateGroupMembers`](#update-group-members)：管理群成员

---

<a id="create-group"></a>

## `createGroup`

创建群组

| 属性     | 值                                                                      |
| -------- | ----------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/create`                        |
| SDK 方法 | `device.createGroup(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createGroup"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                           |
| 变更类型 | `write`                                                                 |
| 自动重试 | 不自动重试                                                              |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段           | 必填 | 类型            | 约束          | 说明 |
| -------------- | ---- | --------------- | ------------- | ---- |
| `body.name`    | 是   | `string`        | maxLength=100 | -    |
| `body.members` | 否   | `Array<string>` | -             | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 创建成功，返回新群 ID。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型                | 约束 | 说明                                           |
| ------------------------------- | ---- | ------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`            | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`            | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `GroupCreateResult` | -    | -                                              |
| `result.data.data.id`           | 是   | `string`            | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.createGroup({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    name: "Example"
  }
});
console.log(result.data.data);
```

---

<a id="get-group"></a>

## `getGroup`

获取群组详情

| 属性     | 值                                                                   |
| -------- | -------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/groups/info`                        |
| SDK 方法 | `device.getGroup(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getGroup"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                        |
| 变更类型 | `read`                                                               |
| 自动重试 | 允许安全重试                                                         |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型     | 示例          | 约束 | 说明                                                |
| ------------------------ | ----- | ---- | -------- | ------------- | ---- | --------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string` | `"acc_xxx"`   | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。   |
| `params.query.group_id`  | query | 是   | `string` | `"group_xxx"` | -    | 渠道侧群组标识，部分渠道的标识可能包含 `@` 等字符。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 群组详情。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                           | 必有 | 类型                       | 约束 | 说明                                                                                                                                                                                     |
| ---------------------------------------------- | ---- | -------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                       | 否   | `string`                   | -    | 服务端生成的请求 ID。                                                                                                                                                                    |
| `result.data.client_request_id`                | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                           |
| `result.data.data`                             | 是   | `Group`                    | -    | -                                                                                                                                                                                        |
| `result.data.data.id`                          | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.conversation_id`             | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.name`                        | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.avatar_url`                  | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.member_count`                | 否   | `number \| string (int64)` | -    | -                                                                                                                                                                                        |
| `result.data.data.joined_at`                   | 否   | `string (date-time)`       | -    | -                                                                                                                                                                                        |
| `result.data.data.created_at`                  | 否   | `string (date-time)`       | -    | -                                                                                                                                                                                        |
| `result.data.data.description`                 | 否   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.permissions`                 | 否   | `GroupPermissions`         | -    | 群整体发言权限快照，仅来源明确提供时返回。缺失表示未知；false 表示普通成员可发言，不表示当前账号一定可发送。                                                                             |
| `result.data.data.permissions.admins_only`     | 否   | `boolean`                  | -    | true 表示仅管理员发言；false 是明确状态，不能视为缺省。                                                                                                                                  |
| `result.data.data.extra`                       | 否   | `Record<string, unknown>`  | -    | 渠道扩展字段；WhatsApp 群资料可包含公告群分类，是否返回取决于本次查询可用资料。                                                                                                          |
| `result.data.data.extra.is_announcement_group` | 否   | `boolean`                  | -    | 仅 WhatsApp 群提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。此属性独立于 permissions.admins_only，不表示当前账号具备发送权限。 |

### TypeScript 示例

```ts
const result = await device.getGroup({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      group_id: "group_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="get-group-invite-code"></a>

## `getGroupInviteCode`

获取群邀请链接或邀请码

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `GET` `/v1/accounts/{account_id}/groups/invite-code`                           |
| SDK 方法 | `device.getGroupInviteCode(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getGroupInviteCode"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `read`                                                                         |
| 自动重试 | 允许安全重试                                                                   |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型     | 示例          | 约束 | 说明                                              |
| ------------------------ | ----- | ---- | -------- | ------------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string` | `"acc_xxx"`   | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |
| `params.query.group_id`  | query | 是   | `string` | `"group_xxx"` | -    | 渠道侧群组标识。                                  |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 邀请信息。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                            | 必有 | 类型              | 约束 | 说明                                           |
| ------------------------------- | ---- | ----------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`        | 否   | `string`          | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id` | 否   | `string`          | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`              | 是   | `GroupInviteCode` | -    | -                                              |
| `result.data.data.invite_url`   | 是   | `string`          | -    | -                                              |
| `result.data.data.invite_code`  | 是   | `string`          | -    | -                                              |

> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。

### TypeScript 示例

```ts
const result = await device.getGroupInviteCode({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      group_id: "group_xxx"
    }
  }
});
console.log(result.status, result.requestId);
```

---

<a id="leave-group"></a>

## `leaveGroup`

退出群组

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/leave`                        |
| SDK 方法 | `device.leaveGroup(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["leaveGroup"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `destructive`                                                          |
| 自动重试 | 不自动重试                                                             |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型     | 约束 | 说明 |
| --------------- | ---- | -------- | ---- | ---- |
| `body.group_id` | 是   | `string` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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
const result = await device.leaveGroup({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    group_id: "group_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="list-group-join-requests"></a>

## `listGroupJoinRequests`

列出待审批入群申请

| 属性     | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/groups/join-requests`                            |
| SDK 方法 | `device.listGroupJoinRequests(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listGroupJoinRequests"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                     |
| 变更类型 | `read`                                                                            |
| 自动重试 | 允许安全重试                                                                      |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型     | 示例          | 约束 | 说明                                              |
| ------------------------ | ----- | ---- | -------- | ------------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string` | `"acc_xxx"`   | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |
| `params.query.group_id`  | query | 是   | `string` | `"group_xxx"` | -    | 渠道侧群组标识。                                  |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 入群申请列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型                      | 约束 | 说明                                           |
| --------------------------------------- | ---- | ------------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`                | 否   | `string`                  | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`         | 否   | `string`                  | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                      | 是   | `GroupJoinRequestsResult` | -    | -                                              |
| `result.data.data.group_id`             | 是   | `string`                  | -    | -                                              |
| `result.data.data.items`                | 是   | `Array<GroupJoinRequest>` | -    | -                                              |
| `result.data.data.items[].id`           | 是   | `string`                  | -    | -                                              |
| `result.data.data.items[].phone`        | 否   | `string`                  | -    | -                                              |
| `result.data.data.items[].lid`          | 否   | `string`                  | -    | -                                              |
| `result.data.data.items[].requested_at` | 否   | `string (date-time)`      | -    | -                                              |

### TypeScript 示例

```ts
const result = await device.listGroupJoinRequests({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      group_id: "group_xxx"
    }
  }
});
console.log(result.data.data);
```

---

<a id="list-groups"></a>

## `listGroups`

列出群组

| 属性     | 值                                                                     |
| -------- | ---------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/groups`                               |
| SDK 方法 | `device.listGroups(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listGroups"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                          |
| 变更类型 | `read`                                                                 |
| 自动重试 | 允许安全重试                                                           |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束                   | 说明                                                                                                                                                                                  |
| ------------------------ | ----- | ---- | --------- | -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -                      | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                     |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | -                      | Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。 |
| `params.query.limit`     | query | 否   | `integer` | `1`            | minimum=1, maximum=100 | 每页返回数量。                                                                                                                                                                        |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 群组分页列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                                   | 必有 | 类型                       | 约束 | 说明                                                                                                                                                                                     |
| ------------------------------------------------------ | ---- | -------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                               | 否   | `string`                   | -    | 服务端生成的请求 ID。                                                                                                                                                                    |
| `result.data.client_request_id`                        | 否   | `string`                   | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                           |
| `result.data.data`                                     | 是   | `GroupListResult`          | -    | -                                                                                                                                                                                        |
| `result.data.data.items`                               | 是   | `Array<Group>`             | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].id`                          | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].conversation_id`             | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].name`                        | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].avatar_url`                  | 是   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].member_count`                | 否   | `number \| string (int64)` | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].joined_at`                   | 否   | `string (date-time)`       | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].created_at`                  | 否   | `string (date-time)`       | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].description`                 | 否   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.items[].permissions`                 | 否   | `GroupPermissions`         | -    | 群整体发言权限快照，仅来源明确提供时返回。缺失表示未知；false 表示普通成员可发言，不表示当前账号一定可发送。                                                                             |
| `result.data.data.items[].permissions.admins_only`     | 否   | `boolean`                  | -    | true 表示仅管理员发言；false 是明确状态，不能视为缺省。                                                                                                                                  |
| `result.data.data.items[].extra`                       | 否   | `Record<string, unknown>`  | -    | 渠道扩展字段；WhatsApp 群资料可包含公告群分类，是否返回取决于本次查询可用资料。                                                                                                          |
| `result.data.data.items[].extra.is_announcement_group` | 否   | `boolean`                  | -    | 仅 WhatsApp 群提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。此属性独立于 permissions.admins_only，不表示当前账号具备发送权限。 |
| `result.data.data.next_cursor`                         | 否   | `string`                   | -    | -                                                                                                                                                                                        |
| `result.data.data.has_more`                            | 是   | `boolean`                  | -    | -                                                                                                                                                                                        |

### TypeScript 示例

```ts
const result = await device.listGroups({
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

<a id="set-group-join-approval-mode"></a>

## `setGroupJoinApprovalMode`

设置入群审批模式

| 属性     | 值                                                                                   |
| -------- | ------------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/join-approval-mode`                         |
| SDK 方法 | `device.setGroupJoinApprovalMode(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["setGroupJoinApprovalMode"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                        |
| 变更类型 | `write`                                                                              |
| 自动重试 | 不自动重试                                                                           |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段            | 必填 | 类型      | 约束 | 说明 |
| --------------- | ---- | --------- | ---- | ---- |
| `body.group_id` | 是   | `string`  | -    | -    |
| `body.enabled`  | 是   | `boolean` | -    | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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
const result = await device.setGroupJoinApprovalMode({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    group_id: "group_xxx",
    enabled: false
  }
});
console.log(result.data.data);
```

---

<a id="update-group-info"></a>

## `updateGroupInfo`

修改群信息

`name`、`description`、`avatar_url` 三个字段每次只能传一个。

| 属性     | 值                                                                          |
| -------- | --------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/update-info`                       |
| SDK 方法 | `device.updateGroupInfo(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateGroupInfo"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                               |
| 变更类型 | `write`                                                                     |
| 自动重试 | 不自动重试                                                                  |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段               | 必填 | 类型           | 约束          | 说明                     |
| ------------------ | ---- | -------------- | ------------- | ------------------------ |
| `body.group_id`    | 是   | `string`       | -             | -                        |
| `body.name`        | 否   | `string`       | maxLength=100 | -                        |
| `body.description` | 否   | `string`       | -             | 传空字符串表示清空描述。 |
| `body.avatar_url`  | 否   | `string (uri)` | -             | -                        |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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
const result = await device.updateGroupInfo({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    group_id: "group_xxx",
    name: "Example group"
  }
});
console.log(result.data.data);
```

---

<a id="update-group-join-requests"></a>

## `updateGroupJoinRequests`

处理入群申请

| 属性     | 值                                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/join-requests/update`                      |
| SDK 方法 | `device.updateGroupJoinRequests(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateGroupJoinRequests"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                       |
| 变更类型 | `destructive`                                                                       |
| 自动重试 | 不自动重试                                                                          |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型                                 | 约束                     | 说明 |
| ----------------- | ---- | ------------------------------------ | ------------------------ | ---- |
| `body.group_id`   | 是   | `string`                             | -                        | -    |
| `body.action`     | 是   | `string enum("approve" \| "reject")` | enum="approve", "reject" | -    |
| `body.member_ids` | 是   | `Array<string>`                      | minItems=1               | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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
const result = await device.updateGroupJoinRequests({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    group_id: "group_xxx",
    action: "approve",
    member_ids: ["member_xxx"]
  }
});
console.log(result.data.data);
```

---

<a id="update-group-members"></a>

## `updateGroupMembers`

管理群成员

| 属性     | 值                                                                             |
| -------- | ------------------------------------------------------------------------------ |
| HTTP     | `POST` `/v1/accounts/{account_id}/groups/members`                              |
| SDK 方法 | `device.updateGroupMembers(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["updateGroupMembers"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                  |
| 变更类型 | `destructive`                                                                  |
| 自动重试 | 不自动重试                                                                     |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段             | 必填 | 类型                                                      | 约束                                      | 说明 |
| ---------------- | ---- | --------------------------------------------------------- | ----------------------------------------- | ---- |
| `body.group_id`  | 是   | `string`                                                  | -                                         | -    |
| `body.action`    | 是   | `string enum("add" \| "remove" \| "promote" \| "demote")` | enum="add", "remove", "promote", "demote" | -    |
| `body.member_id` | 是   | `string`                                                  | -                                         | -    |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 操作成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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
const result = await device.updateGroupMembers({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    group_id: "group_xxx",
    action: "add",
    member_id: "member_xxx"
  }
});
console.log(result.data.data);
```
