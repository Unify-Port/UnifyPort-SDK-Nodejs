<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Contacts

[English](../../api-reference/contacts.md) | [简体中文](contacts.md)

[返回 API Reference 索引](README.md)

查询联系人及执行联系人操作。

## 本页 operation

- [`blockContact`](#block-contact)：封锁联系人
- [`createContact`](#create-contact)：添加联系人
- [`getContact`](#get-contact)：获取联系人详情
- [`getContactMembership`](#get-contact-membership)：查询联系人是否在联系人列表中
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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明                                                                     |
| ----------------- | ---- | -------- | ---- | ------------------------------------------------------------------------ |
| `body.contact_id` | 是   | `string` | -    | 渠道侧联系人标识。WhatsApp 封锁和解封操作必须传 LID，格式为 `数字@lid`。 |

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
const result = await device.blockContact({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    contact_id: "123456789012345@lid"
  }
});
console.log(result.data.data);
```

---

<a id="create-contact"></a>

## `createContact`

添加联系人

在指定账号所属渠道中添加一个联系人。`phone_number` 和 `username` 至少提供一个； `whatsapp_options` 仅适用于 WhatsApp 账号。 添加失败时，`numeric_code=30017` 表示 Provider 限流，调用方应延迟退避重试； `numeric_code=30018` 表示账号 App State 失步，调用方应等待 Provider 恢复后再重试。 两种细分原因均保持接口原有 HTTP 状态与字符串 `code`。 仅 whatsapp 添加联系人明确未将目标号码识别为有效 WhatsApp 联系人时，返回 HTTP 500、 `code=create_contact_failed` 和 `numeric_code=35009`；`message` 保留完整原始原因，不增加前缀， 原因缺失时为 `Target phone number was not recognized as an active WhatsApp contact`。 调用方应按数字码提示用户核对国家区号、号码及 WhatsApp 注册状态，核对实际响应与页面错误提示后再请求， 不应持续自动重试；该错误不确认号码未注册或永久不可用。其他添加失败沿用原有分类。

| 属性     | 值                                                                        |
| -------- | ------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/contacts/add`                           |
| SDK 方法 | `device.createContact(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["createContact"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                             |
| 变更类型 | `write`                                                                   |
| 自动重试 | 不自动重试                                                                |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段                                            | 必填 | 类型                           | 约束          | 说明                                                           |
| ----------------------------------------------- | ---- | ------------------------------ | ------------- | -------------------------------------------------------------- |
| `body.phone_number`                             | 否   | `string`                       | minLength=1   | 包含国家或地区代码的纯数字电话号码，不包含加号、空格或分隔符。 |
| `body.username`                                 | 否   | `string`                       | minLength=1   | 渠道用户名，格式要求以目标渠道为准。                           |
| `body.whatsapp_options`                         | 否   | `WhatsAppContactCreateOptions` | -             | -                                                              |
| `body.whatsapp_options.first_name`              | 否   | `string`                       | -             | -                                                              |
| `body.whatsapp_options.full_name`               | 否   | `string`                       | -             | -                                                              |
| `body.whatsapp_options.sync_to_device_contacts` | 否   | `boolean`                      | default=false | 是否同步至当前 WhatsApp 账号关联设备的系统通讯录。             |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 添加成功后的联系人信息。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 添加联系人失败；whatsapp 目标号码未被识别为有效联系人时，numeric_code=35009，保持 code=create_contact_failed，并保留完整原始原因。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型           | 约束        | 说明                                                                                                                                                                                |
| --------------------------------------- | ---- | -------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`       | -           | 服务端生成的请求 ID。                                                                                                                                                               |
| `result.data.client_request_id`         | 否   | `string`       | -           | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                      |
| `result.data.data`                      | 是   | `Contact`      | -           | -                                                                                                                                                                                   |
| `result.data.data.id`                   | 是   | `string`       | -           | 联系人标识。                                                                                                                                                                        |
| `result.data.data.conversation_id`      | 是   | `string`       | -           | 用于发送消息或定位会话的标识，请按不透明字符串保存和使用。                                                                                                                          |
| `result.data.data.display_name`         | 是   | `string`       | -           | -                                                                                                                                                                                   |
| `result.data.data.avatar_url`           | 是   | `string`       | -           | -                                                                                                                                                                                   |
| `result.data.data.provider_user_id`     | 是   | `string`       | -           | 渠道用户标识，请按不透明字符串保存和使用。                                                                                                                                          |
| `result.data.data.is_blocked`           | 否   | `boolean`      | -           | -                                                                                                                                                                                   |
| `result.data.data.extra`                | 否   | `ContactExtra` | -           | 渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。                                                                                                                            |
| `result.data.data.extra.phone`          | 否   | `string`       | -           | WhatsApp phone JID 中解析出的纯手机号。                                                                                                                                             |
| `result.data.data.extra.first_name`     | 否   | `string`       | -           | 当前账号通讯录中保存的联系人简称或名字部分。                                                                                                                                        |
| `result.data.data.extra.full_name`      | 否   | `string`       | -           | 当前账号通讯录中保存的完整联系人名称。                                                                                                                                              |
| `result.data.data.extra.push_name`      | 否   | `string`       | -           | 联系人自行在 WhatsApp 设置的个人名称。                                                                                                                                              |
| `result.data.data.extra.username`       | 否   | `string`       | minLength=1 | WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。 |
| `result.data.data.extra.business_name`  | 否   | `string`       | -           | WhatsApp Business 账号的商业或认证名称。                                                                                                                                            |
| `result.data.data.extra.redacted_phone` | 否   | `string`       | -           | Provider 仅返回部分号码时的遮蔽手机号。                                                                                                                                             |

### TypeScript 示例

```ts
const result = await device.createContact({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    phone_number: "8613800000000",
    username: "alice_user",
    whatsapp_options: {
      first_name: "Alice",
      full_name: "Alice Example",
      sync_to_device_contacts: false
    }
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

| SDK 字段                  | 位置  | 必填 | 类型     | 示例            | 约束 | 说明                                                                                                                                                                                     |
| ------------------------- | ----- | ---- | -------- | --------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id`  | path  | 是   | `string` | `"acc_xxx"`     | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                        |
| `params.query.contact_id` | query | 是   | `string` | `"contact_xxx"` | -    | 渠道侧联系人标识，按不透明字符串传递。`whatsapp` 和 `whatsapp-protocol` 统一使用 LID（`xxx@lid`）；`whatsapp-protocol` 联系人资料字段缺失时仍可能返回成功， 调用方应以实际返回字段为准。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 联系人详情。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 资源不存在或路由不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `422`       | `application/json` | `ErrorEnvelope`         | 请求参数有效，但目标会话不存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                    | 必有 | 类型           | 约束        | 说明                                                                                                                                                                                |
| --------------------------------------- | ---- | -------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                | 否   | `string`       | -           | 服务端生成的请求 ID。                                                                                                                                                               |
| `result.data.client_request_id`         | 否   | `string`       | -           | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                      |
| `result.data.data`                      | 是   | `Contact`      | -           | -                                                                                                                                                                                   |
| `result.data.data.id`                   | 是   | `string`       | -           | 联系人标识。                                                                                                                                                                        |
| `result.data.data.conversation_id`      | 是   | `string`       | -           | 用于发送消息或定位会话的标识，请按不透明字符串保存和使用。                                                                                                                          |
| `result.data.data.display_name`         | 是   | `string`       | -           | -                                                                                                                                                                                   |
| `result.data.data.avatar_url`           | 是   | `string`       | -           | -                                                                                                                                                                                   |
| `result.data.data.provider_user_id`     | 是   | `string`       | -           | 渠道用户标识，请按不透明字符串保存和使用。                                                                                                                                          |
| `result.data.data.is_blocked`           | 否   | `boolean`      | -           | -                                                                                                                                                                                   |
| `result.data.data.extra`                | 否   | `ContactExtra` | -           | 渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。                                                                                                                            |
| `result.data.data.extra.phone`          | 否   | `string`       | -           | WhatsApp phone JID 中解析出的纯手机号。                                                                                                                                             |
| `result.data.data.extra.first_name`     | 否   | `string`       | -           | 当前账号通讯录中保存的联系人简称或名字部分。                                                                                                                                        |
| `result.data.data.extra.full_name`      | 否   | `string`       | -           | 当前账号通讯录中保存的完整联系人名称。                                                                                                                                              |
| `result.data.data.extra.push_name`      | 否   | `string`       | -           | 联系人自行在 WhatsApp 设置的个人名称。                                                                                                                                              |
| `result.data.data.extra.username`       | 否   | `string`       | minLength=1 | WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。 |
| `result.data.data.extra.business_name`  | 否   | `string`       | -           | WhatsApp Business 账号的商业或认证名称。                                                                                                                                            |
| `result.data.data.extra.redacted_phone` | 否   | `string`       | -           | Provider 仅返回部分号码时的遮蔽手机号。                                                                                                                                             |

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

<a id="get-contact-membership"></a>

## `getContactMembership`

查询联系人是否在联系人列表中

查询指定联系人是否存在于目标账号的渠道联系人列表中。

| 属性     | 值                                                                               |
| -------- | -------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/contacts/membership`                            |
| SDK 方法 | `device.getContactMembership(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getContactMembership"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                    |
| 变更类型 | `read`                                                                           |
| 自动重试 | 不自动重试                                                                       |

### 参数

| SDK 字段                  | 位置  | 必填 | 类型     | 示例            | 约束 | 说明                                                                              |
| ------------------------- | ----- | ---- | -------- | --------------- | ---- | --------------------------------------------------------------------------------- |
| `params.path.account_id`  | path  | 是   | `string` | `"acc_xxx"`     | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。                                 |
| `params.query.contact_id` | query | 是   | `string` | `"contact_xxx"` | -    | 联系人标识。WhatsApp 账号请使用联系人接口返回的 LID，例如 `123456789012345@lid`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 联系人列表归属状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                              | 必有 | 类型                | 约束 | 说明                                           |
| --------------------------------- | ---- | ------------------- | ---- | ---------------------------------------------- |
| `result.data.request_id`          | 否   | `string`            | -    | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`   | 否   | `string`            | -    | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                | 是   | `ContactMembership` | -    | -                                              |
| `result.data.data.contact_id`     | 是   | `string`            | -    | 查询请求中的联系人标识。                       |
| `result.data.data.is_in_contacts` | 是   | `boolean`           | -    | 是否存在于目标账号的渠道联系人列表中。         |

### TypeScript 示例

```ts
const result = await device.getContactMembership({
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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 黑名单列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

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

| SDK 字段                     | 位置  | 必填 | 类型                 | 示例                     | 约束                   | 说明                                                                                                                                                                                  |
| ---------------------------- | ----- | ---- | -------------------- | ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params.path.account_id`     | path  | 是   | `string`             | `"acc_xxx"`              | -                      | device-api 签发的账号 public_id，例如 `acc_xxx`。                                                                                                                                     |
| `params.query.cursor`        | query | 否   | `string`             | `"cursor_xxx"`           | -                      | Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。 |
| `params.query.limit`         | query | 否   | `integer`            | `1`                      | minimum=1, maximum=100 | 每页返回数量。                                                                                                                                                                        |
| `params.query.q`             | query | 否   | `string`             | `"q_xxx"`                | -                      | 关键字过滤。                                                                                                                                                                          |
| `params.query.updated_since` | query | 否   | `string (date-time)` | `"2026-01-01T00:00:00Z"` | -                      | RFC3339 时间戳，只返回此时间后更新的联系人；渠道不支持增量过滤时可能返回全量结果。                                                                                                    |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 联系人分页列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                            | 必有 | 类型                | 约束        | 说明                                                                                                                                                                                |
| ----------------------------------------------- | ---- | ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                        | 否   | `string`            | -           | 服务端生成的请求 ID。                                                                                                                                                               |
| `result.data.client_request_id`                 | 否   | `string`            | -           | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                                      |
| `result.data.data`                              | 是   | `ContactListResult` | -           | -                                                                                                                                                                                   |
| `result.data.data.items`                        | 是   | `Array<Contact>`    | -           | -                                                                                                                                                                                   |
| `result.data.data.items[].id`                   | 是   | `string`            | -           | 联系人标识。                                                                                                                                                                        |
| `result.data.data.items[].conversation_id`      | 是   | `string`            | -           | 用于发送消息或定位会话的标识，请按不透明字符串保存和使用。                                                                                                                          |
| `result.data.data.items[].display_name`         | 是   | `string`            | -           | -                                                                                                                                                                                   |
| `result.data.data.items[].avatar_url`           | 是   | `string`            | -           | -                                                                                                                                                                                   |
| `result.data.data.items[].provider_user_id`     | 是   | `string`            | -           | 渠道用户标识，请按不透明字符串保存和使用。                                                                                                                                          |
| `result.data.data.items[].is_blocked`           | 否   | `boolean`           | -           | -                                                                                                                                                                                   |
| `result.data.data.items[].extra`                | 否   | `ContactExtra`      | -           | 渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。                                                                                                                            |
| `result.data.data.items[].extra.phone`          | 否   | `string`            | -           | WhatsApp phone JID 中解析出的纯手机号。                                                                                                                                             |
| `result.data.data.items[].extra.first_name`     | 否   | `string`            | -           | 当前账号通讯录中保存的联系人简称或名字部分。                                                                                                                                        |
| `result.data.data.items[].extra.full_name`      | 否   | `string`            | -           | 当前账号通讯录中保存的完整联系人名称。                                                                                                                                              |
| `result.data.data.items[].extra.push_name`      | 否   | `string`            | -           | 联系人自行在 WhatsApp 设置的个人名称。                                                                                                                                              |
| `result.data.data.items[].extra.username`       | 否   | `string`            | minLength=1 | WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。 |
| `result.data.data.items[].extra.business_name`  | 否   | `string`            | -           | WhatsApp Business 账号的商业或认证名称。                                                                                                                                            |
| `result.data.data.items[].extra.redacted_phone` | 否   | `string`            | -           | Provider 仅返回部分号码时的遮蔽手机号。                                                                                                                                             |
| `result.data.data.next_cursor`                  | 否   | `string`            | -           | -                                                                                                                                                                                   |
| `result.data.data.has_more`                     | 是   | `boolean`           | -           | -                                                                                                                                                                                   |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明                     |
| ----------------- | ---- | -------- | ---- | ------------------------ |
| `body.contact_id` | 是   | `string` | -    | -                        |
| `body.note`       | 是   | `string` | -    | 传空字符串表示清空备注。 |

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
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型     | 约束 | 说明                                                                     |
| ----------------- | ---- | -------- | ---- | ------------------------------------------------------------------------ |
| `body.contact_id` | 是   | `string` | -    | 渠道侧联系人标识。WhatsApp 封锁和解封操作必须传 LID，格式为 `数字@lid`。 |

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
const result = await device.unblockContact({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    contact_id: "123456789012345@lid"
  }
});
console.log(result.data.data);
```
