<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Posts

[English](../../api-reference/posts.md) | [简体中文](posts.md)

[返回 API Reference 索引](README.md)

当前登录账号的帖子、一级评论查询和回复。

## 本页 operation

- [`getPost`](#get-post)：获取帖子详情
- [`listPostComments`](#list-post-comments)：列出帖子的一级评论
- [`listPosts`](#list-posts)：列出本账号帖子
- [`replyPostComment`](#reply-post-comment)：发布一级评论或回复一级评论

---

<a id="get-post"></a>

## `getPost`

获取帖子详情

仅支持 TikTok；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询本账号帖子列表。目标是否可访问由渠道结果决定，不保证其他账号的帖子可读取。 JSON body 必填非空字符串 post_id，不接受 null、未知字段或重复键；非法请求返回 400 invalid_request（10000）。 TikTok 的 post_id 须为无前导零的正十进制整数字符串，按原值传递；不符合渠道格式时返回 400 provider_invalid_request。 账号不在当前工作空间返回 404 account_not_found（20020）；可靠确认帖子不存在时返回 404 post_not_found（39000）。 当前账号无法访问目标时返回 403 post_inaccessible（39005），不能据此判断具体是登录、权限还是资源归属原因，也不能视为不存在。 只有可靠取得与请求帖子 ID 一致的资源后才返回标准 Post；上游异常返回失败，不返回部分详情。 现有可选字段仅在可靠取得时提供，不新增帖子媒体或统计计数。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他详情读取失败返回 502 get_post_failed（39006）。

| 属性     | 值                                                                  |
| -------- | ------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/posts/info`                       |
| SDK 方法 | `device.getPost(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["getPost"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                       |
| 变更类型 | `read`                                                              |
| 自动重试 | 不自动重试                                                          |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段           | 必填 | 类型             | 约束                       | 说明                                         |
| -------------- | ---- | ---------------- | -------------------------- | -------------------------------------------- |
| `body.post_id` | 是   | `PostResourceID` | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。 |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 目标帖子详情。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `403`       | `application/json` | `ErrorEnvelope`         | 当前账号无法访问目标帖子（post_inaccessible，39005）；不代表帖子不存在，也不指明具体拒绝原因。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `404`       | `application/json` | `ErrorEnvelope`         | 账号不在当前工作空间（account_not_found，20020）；可靠确认帖子不存在时返回 post_not_found（39000）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                   | 必有             | 类型                 | 约束                       | 说明                                           |
| -------------------------------------- | ---------------- | -------------------- | -------------------------- | ---------------------------------------------- |
| `result.data.request_id`               | 否               | `string`             | -                          | 服务端生成的请求 ID。                          |
| `result.data.client_request_id`        | 否               | `string`             | -                          | 当客户端请求头传入合法 `X-Request-Id` 时回显。 |
| `result.data.data`                     | 是               | `Post`               | -                          | -                                              |
| `result.data.data.id`                  | 是               | `PostResourceID`     | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。   |
| `result.data.data.text`                | 否               | `string`             | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。 |
| `result.data.data.author`              | 否               | `PostAuthor`         | -                          | -                                              |
| `result.data.data.author.id`           | 父字段存在时必填 | `PostResourceID`     | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。   |
| `result.data.data.author.display_name` | 否               | `string`             | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。 |
| `result.data.data.author.avatar_url`   | 否               | `string`             | minLength=1                | 可靠取得的非空头像地址；未知时省略。           |
| `result.data.data.created_at`          | 否               | `string (date-time)` | -                          | 可靠取得的创建时间，RFC3339 UTC；未知时省略。  |

### TypeScript 示例

```ts
const result = await device.getPost({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    post_id: "7500000000000000101"
  }
});
console.log(result.data.data);
```

---

<a id="list-post-comments"></a>

## `listPostComments`

列出帖子的一级评论

仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询帖子列表或详情；目标是否可访问由渠道结果决定。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 分页核验未完成返回可重试失败，不能视为资源不存在。 第三方 post_id 放在 JSON body，不要求帖子属于当前账号。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request。 仅保证一级评论，不提供完整回复分页。空列表为 []，has_more=false 时省略 next_cursor。 读取失败保留既有 provider 错误分类；其他读取失败返回 502 list_post_comments_failed（39003）。

| 属性     | 值                                                                           |
| -------- | ---------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/posts/comments/list`                       |
| SDK 方法 | `device.listPostComments(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listPostComments"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                |
| 变更类型 | `read`                                                                       |
| 自动重试 | 不自动重试                                                                   |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段           | 必填 | 类型             | 约束                              | 说明                                         |
| -------------- | ---- | ---------------- | --------------------------------- | -------------------------------------------- |
| `body.post_id` | 是   | `PostResourceID` | minLength=1, pattern="\\S"        | 第三方字符串标识；按原值传递，不转换为数字。 |
| `body.cursor`  | 否   | `string`         | minLength=1                       | 原样传回上一页的 next_cursor；首次请求省略。 |
| `body.limit`   | 否   | `integer`        | minimum=1, maximum=50, default=20 | -                                            |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 列出帖子的一级评论结果。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 账号不存在或不属于当前工作空间时返回 account_not_found（20020）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                           | 必有             | 类型                    | 约束                       | 说明                                                                |
| ---------------------------------------------- | ---------------- | ----------------------- | -------------------------- | ------------------------------------------------------------------- |
| `result.data.request_id`                       | 否               | `string`                | -                          | 服务端生成的请求 ID。                                               |
| `result.data.client_request_id`                | 否               | `string`                | -                          | 当客户端请求头传入合法 `X-Request-Id` 时回显。                      |
| `result.data.data`                             | 是               | `PostCommentListResult` | -                          | -                                                                   |
| `result.data.data.items`                       | 是               | `Array<PostComment>`    | -                          | -                                                                   |
| `result.data.data.items[].id`                  | 是               | `PostResourceID`        | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                        |
| `result.data.data.items[].post_id`             | 是               | `PostResourceID`        | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                        |
| `result.data.data.items[].text`                | 否               | `string`                | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。                      |
| `result.data.data.items[].author`              | 否               | `PostAuthor`            | -                          | -                                                                   |
| `result.data.data.items[].author.id`           | 父字段存在时必填 | `PostResourceID`        | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                        |
| `result.data.data.items[].author.display_name` | 否               | `string`                | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。                      |
| `result.data.data.items[].author.avatar_url`   | 否               | `string`                | minLength=1                | 可靠取得的非空头像地址；未知时省略。                                |
| `result.data.data.items[].created_at`          | 否               | `string (date-time)`    | -                          | 可靠取得的评论创建时间，RFC3339 UTC；未知时省略，不用观察时间代替。 |
| `result.data.data.items[].parent_comment_id`   | 否               | `PostResourceID`        | minLength=1, pattern="\\S" | 仅在确认父子关系后提供；缺失本身不能证明该评论是可回复的一级评论。  |
| `result.data.data.has_more`                    | 是               | `boolean`               | -                          | -                                                                   |
| `result.data.data.next_cursor`                 | 否               | `string`                | minLength=1                | 不透明游标，仅 has_more=true 时提供，调用方原样传回。               |

### TypeScript 示例

```ts
const result = await device.listPostComments({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    post_id: "post_id_xxx"
  }
});
console.log(result.data.data);
```

---

<a id="list-posts"></a>

## `listPosts`

列出本账号帖子

仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 归属或分页核验未完成返回可重试失败，不能视为资源不存在。 has_more=true 时提供 next_cursor；末页 has_more=false 并省略 next_cursor。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他读取失败返回 502 list_posts_failed（39002）。

| 属性     | 值                                                                    |
| -------- | --------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/accounts/{account_id}/posts`                               |
| SDK 方法 | `device.listPosts(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listPosts"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                         |
| 变更类型 | `read`                                                                |
| 自动重试 | 不自动重试                                                            |

### 参数

| SDK 字段                 | 位置  | 必填 | 类型      | 示例           | 约束                              | 说明                                              |
| ------------------------ | ----- | ---- | --------- | -------------- | --------------------------------- | ------------------------------------------------- |
| `params.path.account_id` | path  | 是   | `string`  | `"acc_xxx"`    | -                                 | device-api 签发的账号 public_id，例如 `acc_xxx`。 |
| `params.query.cursor`    | query | 否   | `string`  | `"cursor_xxx"` | minLength=1                       | 原样传回上一页的 next_cursor；首次请求省略。      |
| `params.query.limit`     | query | 否   | `integer` | `20`           | minimum=1, maximum=50, default=20 | -                                                 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 列出本账号帖子结果。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 账号不存在或不属于当前工作空间时返回 account_not_found（20020）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                           | 必有             | 类型                 | 约束                       | 说明                                                  |
| ---------------------------------------------- | ---------------- | -------------------- | -------------------------- | ----------------------------------------------------- |
| `result.data.request_id`                       | 否               | `string`             | -                          | 服务端生成的请求 ID。                                 |
| `result.data.client_request_id`                | 否               | `string`             | -                          | 当客户端请求头传入合法 `X-Request-Id` 时回显。        |
| `result.data.data`                             | 是               | `PostListResult`     | -                          | -                                                     |
| `result.data.data.items`                       | 是               | `Array<Post>`        | -                          | -                                                     |
| `result.data.data.items[].id`                  | 是               | `PostResourceID`     | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。          |
| `result.data.data.items[].text`                | 否               | `string`             | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。        |
| `result.data.data.items[].author`              | 否               | `PostAuthor`         | -                          | -                                                     |
| `result.data.data.items[].author.id`           | 父字段存在时必填 | `PostResourceID`     | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。          |
| `result.data.data.items[].author.display_name` | 否               | `string`             | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。        |
| `result.data.data.items[].author.avatar_url`   | 否               | `string`             | minLength=1                | 可靠取得的非空头像地址；未知时省略。                  |
| `result.data.data.items[].created_at`          | 否               | `string (date-time)` | -                          | 可靠取得的创建时间，RFC3339 UTC；未知时省略。         |
| `result.data.data.has_more`                    | 是               | `boolean`            | -                          | -                                                     |
| `result.data.data.next_cursor`                 | 否               | `string`             | minLength=1                | 不透明游标，仅 has_more=true 时提供，调用方原样传回。 |

### TypeScript 示例

```ts
const result = await device.listPosts({
  params: {
    path: {
      account_id: "acc_xxx"
    },
    query: {
      limit: 20
    }
  }
});
console.log(result.data.data);
```

---

<a id="reply-post-comment"></a>

## `replyPostComment`

发布一级评论或回复一级评论

仅支持 TikTok；省略 comment_id 时发布一级评论，提供非空白字符串 comment_id 时回复指定的一级评论。其他渠道返回 501 unsupported_by_provider。 不要求帖子属于当前账号；发布或回复无需先查询帖子列表、详情或评论。 接口不预先确认帖子可访问性、评论所属帖子或层级；调用方应提供目标帖子的一级评论 ID。实际是否允许评论或回复由渠道结果决定，不保证任意帖子都可写入。 第三方 post_id、可选 comment_id 和必填 text 放在 JSON body；正文保留实际发送的原文。 comment_id 只有省略字段才表示发布一级评论；显式空串、纯空白、null 或非字符串仍返回 400 invalid_request（10000），不会改为发布一级评论。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request，comment_id 沿用非空字符串要求。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）；非法参数返回 400 invalid_request（10000）。 200 data.status=accepted 表示请求已被接受，不表示已展示、送达或一定收到 Webhook；仅可靠取得新评论时附带 comment。 发布一级评论的 comment 不含 parent_comment_id；回复的 comment.parent_comment_id 对应本次请求的 comment_id。 写入后超时、断连或无法确认回执时结果未知，不自动重发；读取未找到评论或回复不能证明此前未创建。 写入前的 provider_not_ready、provider_invalid_request、provider_unavailable 分类保持不变；已确认的业务拒绝保留 provider_invalid_request。 写入后无法确认回执（如超时、断连）返回 502 reply_post_comment_failed（39004），结果可能未知；不自动重试写入。

| 属性     | 值                                                                           |
| -------- | ---------------------------------------------------------------------------- |
| HTTP     | `POST` `/v1/accounts/{account_id}/posts/comments/reply`                      |
| SDK 方法 | `device.replyPostComment(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["replyPostComment"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                |
| 变更类型 | `write`                                                                      |
| 自动重试 | 不自动重试                                                                   |

### 参数

| SDK 字段                 | 位置 | 必填 | 类型     | 示例        | 约束 | 说明                                              |
| ------------------------ | ---- | ---- | -------- | ----------- | ---- | ------------------------------------------------- |
| `params.path.account_id` | path | 是   | `string` | `"acc_xxx"` | -    | device-api 签发的账号 public_id，例如 `acc_xxx`。 |

### 请求体

JSON 请求体。

| 字段              | 必填 | 类型             | 约束                       | 说明                                                                                                                            |
| ----------------- | ---- | ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `body.post_id`    | 是   | `PostResourceID` | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                                                                                    |
| `body.comment_id` | 否   | `PostResourceID` | minLength=1, pattern="\\S" | 省略时发布一级评论；提供时表示回复目标帖子下的一级评论，不预先确认其所属帖子或层级。显式空串、纯空白、null 或非字符串均不合法。 |
| `body.text`       | 是   | `string`         | minLength=1, pattern="\\S" | 非空白正文，保留原文，不自动删除首尾空格。                                                                                      |

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`       | `application/json` | `ResponseMeta & object` | 发布一级评论或回复一级评论的接受结果。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `404`       | `application/json` | `ErrorEnvelope`         | 账号不存在或不属于当前工作空间时返回 account_not_found（20020）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `409`       | `application/json` | `ErrorEnvelope`         | 请求与当前资源状态冲突。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `501`       | `application/json` | `ErrorEnvelope`         | 目标账号所属渠道不支持该能力。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `502`       | `application/json` | `ErrorEnvelope`         | 渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                           | 必有             | 类型                      | 约束                       | 说明                                                                                                                                    |
| ---------------------------------------------- | ---------------- | ------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                       | 否               | `string`                  | -                          | 服务端生成的请求 ID。                                                                                                                   |
| `result.data.client_request_id`                | 否               | `string`                  | -                          | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                          |
| `result.data.data`                             | 是               | `PostCommentReplyResult`  | -                          | -                                                                                                                                       |
| `result.data.data.status`                      | 是               | `string enum("accepted")` | enum="accepted"            | -                                                                                                                                       |
| `result.data.data.comment`                     | 否               | `PostComment`             | -                          | 仅可靠取得本次新评论回执时提供，不保证每次都有。发布一级评论时不含 parent_comment_id；回复时 parent_comment_id 与请求 comment_id 一致。 |
| `result.data.data.comment.id`                  | 父字段存在时必填 | `PostResourceID`          | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                                                                                            |
| `result.data.data.comment.post_id`             | 父字段存在时必填 | `PostResourceID`          | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                                                                                            |
| `result.data.data.comment.text`                | 否               | `string`                  | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。                                                                                          |
| `result.data.data.comment.author`              | 否               | `PostAuthor`              | -                          | -                                                                                                                                       |
| `result.data.data.comment.author.id`           | 父字段存在时必填 | `PostResourceID`          | minLength=1, pattern="\\S" | 第三方字符串标识；按原值传递，不转换为数字。                                                                                            |
| `result.data.data.comment.author.display_name` | 否               | `string`                  | -                          | 可靠取得时保留原文，包括空字符串；未知时省略。                                                                                          |
| `result.data.data.comment.author.avatar_url`   | 否               | `string`                  | minLength=1                | 可靠取得的非空头像地址；未知时省略。                                                                                                    |
| `result.data.data.comment.created_at`          | 否               | `string (date-time)`      | -                          | 可靠取得的评论创建时间，RFC3339 UTC；未知时省略，不用观察时间代替。                                                                     |
| `result.data.data.comment.parent_comment_id`   | 否               | `PostResourceID`          | minLength=1, pattern="\\S" | 仅在确认父子关系后提供；缺失本身不能证明该评论是可回复的一级评论。                                                                      |

### TypeScript 示例

```ts
const result = await device.replyPostComment({
  params: {
    path: {
      account_id: "acc_xxx"
    }
  },
  body: {
    post_id: "7500000000000000101",
    text: "Example"
  }
});
console.log(result.data.data);
```
