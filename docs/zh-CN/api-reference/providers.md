<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Providers

[English](../../api-reference/providers.md) | [简体中文](providers.md)

[返回 API Reference 索引](README.md)

查询可用渠道及其元数据。

## 本页 operation

- [`listProviderRegions`](#list-provider-regions)：查询 provider 地区可用性

---

<a id="list-provider-regions"></a>

## `listProviderRegions`

查询 provider 地区可用性

| 属性     | 值                                                                              |
| -------- | ------------------------------------------------------------------------------- |
| HTTP     | `GET` `/v1/providers/{provider}/regions`                                        |
| SDK 方法 | `device.listProviderRegions(request, execution?)`                               |
| SDK 返回 | `Promise<ApiResult<OperationData<DeviceApiOperations["listProviderRegions"]>>>` |
| 认证     | `X-Api-Key`（由 client 注入）                                                   |
| 变更类型 | `read`                                                                          |
| 自动重试 | 允许安全重试                                                                    |

### 参数

| SDK 字段               | 位置 | 必填 | 类型                | 示例         | 约束                                                                                                                     | 说明                                                                                                                                             |
| ---------------------- | ---- | ---- | ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params.path.provider` | path | 是   | `ProviderInputName` | `"telegram"` | enum="telegram", "whatsapp", "line", "twitter", "zalo", "tiktok", "whatsapp-protocol", "x", "x_client", "twitter_client" | provider 输入名称。兼容 `x`、`x_client`、`twitter_client`，这些输入会归一化为 `twitter` 并以 `twitter` 输出；Webhook URL path 不适用该别名规则。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                 |
| ----------- | ------------------ | ----------------------- | ------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | 渠道支持的 `region` 及其可分配状态。 |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                   |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。             |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务器处理请求时发生错误。           |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                     | 必有 | 类型                        | 约束                                                                                  | 说明                                                                                                                                                                         |
| ---------------------------------------- | ---- | --------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result.data.request_id`                 | 否   | `string`                    | -                                                                                     | 服务端生成的请求 ID。                                                                                                                                                        |
| `result.data.client_request_id`          | 否   | `string`                    | -                                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                                                                                                                               |
| `result.data.data`                       | 是   | `ProviderRegionsResponse`   | -                                                                                     | -                                                                                                                                                                            |
| `result.data.data.provider`              | 是   | `ProviderName`              | enum="telegram", "whatsapp", "line", "twitter", "zalo", "tiktok", "whatsapp-protocol" | 响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。 |
| `result.data.data.regions`               | 是   | `Array<RegionAvailability>` | -                                                                                     | -                                                                                                                                                                            |
| `result.data.data.regions[].region`      | 是   | `string`                    | -                                                                                     | -                                                                                                                                                                            |
| `result.data.data.regions[].supported`   | 是   | `boolean`                   | -                                                                                     | -                                                                                                                                                                            |
| `result.data.data.regions[].allocatable` | 是   | `boolean`                   | -                                                                                     | -                                                                                                                                                                            |

### TypeScript 示例

```ts
const result = await device.listProviderRegions({
  params: {
    path: {
      provider: "telegram"
    }
  }
});
console.log(result.data.data);
```
