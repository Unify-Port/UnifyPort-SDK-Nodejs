<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Providers

[English](../../api-reference/providers.md) | [简体中文](providers.md)

[返回 API Reference 索引](README.md)

provider 元数据查询。

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

| SDK 字段               | 位置 | 必填 | 类型           | 示例         | 约束                                                                  | 说明                                                                       |
| ---------------------- | ---- | ---- | -------------- | ------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `params.path.provider` | path | 是   | `ProviderName` | `"telegram"` | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok" | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |

### 请求体

无请求体。

### 返回值

| HTTP status | Content-Type       | Schema                  | 说明                                       |
| ----------- | ------------------ | ----------------------- | ------------------------------------------ |
| `200`       | `application/json` | `ResponseMeta & object` | provider 支持的 region 及是否可分配。      |
| `400`       | `application/json` | `ErrorEnvelope`         | 请求体或参数非法。                         |
| `401`       | `application/json` | `ErrorEnvelope`         | 缺少或无法校验 API Key。                   |
| `500`       | `application/json` | `ErrorEnvelope`         | 服务端内部错误或 provider 链路未映射错误。 |

SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。

成功状态 `200` 的响应字段：

| 字段                                     | 必有 | 类型                        | 约束                                                                  | 说明                                                                       |
| ---------------------------------------- | ---- | --------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `result.data.request_id`                 | 否   | `string`                    | -                                                                     | 服务端生成的请求 ID。                                                      |
| `result.data.client_request_id`          | 否   | `string`                    | -                                                                     | 当客户端请求头传入合法 `X-Request-Id` 时回显。                             |
| `result.data.data`                       | 是   | `ProviderRegionsResponse`   | -                                                                     | -                                                                          |
| `result.data.data.provider`              | 是   | `ProviderName`              | enum="telegram", "whatsapp", "line", "twitter", "x", "zalo", "tiktok" | 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。 |
| `result.data.data.regions`               | 是   | `Array<RegionAvailability>` | -                                                                     | -                                                                          |
| `result.data.data.regions[].region`      | 是   | `string`                    | -                                                                     | -                                                                          |
| `result.data.data.regions[].supported`   | 是   | `boolean`                   | -                                                                     | -                                                                          |
| `result.data.data.regions[].allocatable` | 是   | `boolean`                   | -                                                                     | -                                                                          |

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
