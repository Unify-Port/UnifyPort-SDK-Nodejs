# `@unifyport/sdk-node`

[English](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/sdk/README.md) | [简体中文](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/sdk/README.zh-CN.md) | [官方网站](https://www.unifyport.ai)

面向 Node.js/TypeScript 的 UnifyPort Device API SDK。它提供类型安全的
`UnifyPortDeviceClient`、统一的成功响应与错误模型，以及 timeout、安全重试、取消和 cursor
分页能力。

SDK 使用固定的 `X-Api-Key` 认证边界。`/v1/accounts/...` operation 属于 Device API，统一由
`UnifyPortDeviceClient` 提供。

## 功能范围

当前公开契约中的全部 operation 都有同名 SDK 方法，主要覆盖：

- workspace 与 provider region 查询；
- provider 账号资源、授权流程与运行状态；
- 会话、联系人和群组；
- 消息发送与消息动作；
- API Key 与 webhook endpoint 管理。

方法名与 OpenAPI `operationId` 保持一致。每个 operation 的参数、请求体、返回字段和 TypeScript
示例见 [API Reference](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/zh-CN/api-reference/README.md)；
HTTP path、重试和 MCP 策略见
[API 覆盖表](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/zh-CN/api-coverage.md)。

## 环境要求

- Node.js `>=22.12.0`
- TypeScript 项目或支持 ESM 的 Node.js 项目

该 package 只提供 ESM `import` 和 TypeScript 声明文件，不提供 CommonJS `require()` 入口。

## 安装

```bash
npm install @unifyport/sdk-node
```

也可以使用 pnpm：

```bash
pnpm add @unifyport/sdk-node
```

## 快速开始

```ts
import { UnifyPortDeviceClient } from "@unifyport/sdk-node";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// 凭据只从运行环境读取，避免进入源码、构建产物或版本控制。
const device = new UnifyPortDeviceClient({
  baseUrl: requiredEnv("UNIFYPORT_DEVICE_API_BASE_URL"),
  apiKey: requiredEnv("UNIFYPORT_DEVICE_API_KEY")
});

const result = await device.getWorkspace();

console.log(result.data.data.name);
console.log(result.status, result.requestId);
```

`ApiResult.data` 是完整 API JSON envelope，因此资源数据通常位于 `result.data.data`。

## Client 配置

```ts
const device = new UnifyPortDeviceClient({
  baseUrl: "https://device.example.com",
  apiKey: () => requiredEnv("UNIFYPORT_DEVICE_API_KEY"),
  timeoutMs: 15_000,
  maxResponseBytes: 4 * 1024 * 1024,
  retry: {
    maxRetries: 2,
    baseDelayMs: 200,
    maxDelayMs: 5_000
  }
});
```

| 配置项              | 必填 | 说明                                                                  |
| ------------------- | ---- | --------------------------------------------------------------------- |
| `baseUrl`           | 是   | Device API 的绝对 URL；远程地址必须使用 HTTPS                         |
| `apiKey`            | 是   | 字符串，或返回字符串的同步/异步 provider                              |
| `fetch`             | 否   | 自定义 `fetch` 实现，签名为 `(request: Request) => Promise<Response>` |
| `timeoutMs`         | 否   | 默认 `30000`；每次 operation 的总超时                                 |
| `maxResponseBytes`  | 否   | 默认 8 MiB，最大 64 MiB；同时限制 wire body 与规范化后的 JSON         |
| `retry`             | 否   | 安全 operation 的重试次数和 full-jitter 退避配置                      |
| `allowInsecureHttp` | 否   | 默认 `false`；仅允许显式开启的 loopback HTTP 开发环境                 |

`baseUrl` 不应包含 username、password、query 或 fragment。API key 由 client 统一注入，单次 operation
不能覆盖认证 header。

## 调用 operation

方法统一使用 `(request?, execution?)`：

- 没有参数的 operation 可以省略 `request`；
- path 和 query 参数放在 `request.params`；
- JSON 请求体放在 `request.body`；
- 单次 timeout、重试收紧和取消信号放在 `execution`。

### 无参数读取

```ts
const workspace = await device.getWorkspace();
console.log(workspace.data.data);

const accounts = await device.listAccounts();
for (const account of accounts.data.data) {
  console.log(account.id, account.provider, account.status);
}
```

### Path 参数

```ts
const regions = await device.listProviderRegions({
  params: {
    path: { provider: "whatsapp" }
  }
});

for (const region of regions.data.data.regions) {
  console.log(region.region, region.supported, region.allocatable);
}
```

### Path 与 query 参数

```ts
const contacts = await device.listContacts({
  params: {
    path: { account_id: "acc_xxx" },
    query: { limit: 100, q: "Alice" }
  }
});

console.log(contacts.data.data.items);
console.log(contacts.data.data.next_cursor);
```

### JSON 请求体

```ts
const message = await device.sendMessage({
  body: {
    account_id: "acc_xxx",
    to: { id: "recipient_xxx", type: "user" },
    message: { type: "text", text: "Hello from UnifyPort" }
  }
});

console.log(message.data.data.message_id, message.data.data.status);
```

写操作不会因为 HTTP method 或调用方配置而自动获得重试能力。消息正文等敏感输入不应写入日志。

## 成功响应

所有 operation 都返回 `ApiResult<T>`：

| 字段        | 说明                                                    |
| ----------- | ------------------------------------------------------- |
| `data`      | 按公开契约解析后的完整 API JSON envelope                |
| `status`    | HTTP status                                             |
| `requestId` | 可选的服务端 request ID                                 |
| `response`  | 底层 `Response`，用于读取正常响应的 header 等传输元数据 |

`response` 的 body 已由 SDK 解析，不应依赖再次读取；业务数据使用类型化的 `data`。

## Timeout、取消与重试

```ts
const controller = new AbortController();

const workspace = await device.getWorkspace(
  {},
  {
    timeoutMs: 5_000,
    retry: { maxRetries: 1 },
    signal: controller.signal
  }
);
```

单次 `execution.retry` 只能关闭或收紧 client 级重试：

```ts
await device.getWorkspace({}, { retry: false });
await device.getWorkspace({}, { retry: { maxRetries: 0 } });
```

自动重试只适用于策略明确允许的安全 operation，处理网络失败和 `408`、`429`、`502`、`503`、
`504` 等临时状态，并遵守合法的 `Retry-After`。普通写操作、账号授权提交和一次性 secret operation
不会自动重试。

## Cursor 分页

`paginateCursor` 会逐项迭代分页数据，并提供最大页数、重复 cursor 检测与 `AbortSignal` 支持：

```ts
import { paginateCursor } from "@unifyport/sdk-node";

const accountId = "acc_xxx";
const controller = new AbortController();

for await (const contact of paginateCursor(
  async (cursor, pageSignal) => {
    // exactOptionalPropertyTypes 下不把 undefined 写入可选 query 字段。
    const query = cursor === undefined ? { limit: 100 } : { cursor, limit: 100 };
    const result = await device.listContacts(
      {
        params: {
          path: { account_id: accountId },
          query
        }
      },
      pageSignal === undefined ? {} : { signal: pageSignal }
    );
    return result.data.data;
  },
  { maxPages: 100, signal: controller.signal }
)) {
  console.log(contact.id, contact.display_name);
}
```

分页 helper 默认最多读取 10,000 页。业务代码通常应根据自身任务量设置更小的 `maxPages`。

## 错误处理

所有公开错误都继承 `UnifyPortError`。建议只记录经过筛选的 `status`、`code`、`requestId`、`api` 和
`operationId`，不要直接序列化完整错误、请求、响应或 header。

```ts
import { UnifyPortAbortError, UnifyPortApiError, UnifyPortTimeoutError } from "@unifyport/sdk-node";

try {
  await device.getWorkspace();
} catch (error) {
  if (error instanceof UnifyPortApiError) {
    console.error({
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      operationId: error.operationId
    });
  } else if (error instanceof UnifyPortTimeoutError) {
    console.error({ timeoutMs: error.timeoutMs, operationId: error.operationId });
  } else if (error instanceof UnifyPortAbortError) {
    console.error({ aborted: true, operationId: error.operationId });
  } else {
    throw error;
  }
}
```

| 错误类型                      | 场景                                    |
| ----------------------------- | --------------------------------------- |
| `UnifyPortConfigurationError` | client 配置无效                         |
| `UnifyPortNetworkError`       | 网络或自定义 credential provider 失败   |
| `UnifyPortTimeoutError`       | operation 超时                          |
| `UnifyPortAbortError`         | 调用方通过 `AbortSignal` 取消           |
| `UnifyPortApiError`           | API 返回非成功 HTTP status              |
| `UnifyPortResponseParseError` | 成功响应无法安全解析                    |
| `UnifyPortPaginationError`    | cursor 缺失、重复、超出页数或分页被取消 |

## TypeScript 类型

根入口同时导出公开契约类型：

```ts
import type { DeviceApiComponents, DeviceApiOperations, DeviceApiPaths } from "@unifyport/sdk-node";

type Workspace = DeviceApiComponents["schemas"]["Workspace"];
type SendMessageOperation = DeviceApiOperations["sendMessage"];
type DevicePaths = DeviceApiPaths;
```

为避免 JavaScript 精度丢失，SDK 会把超出安全范围的整数保留为字符串。因此 `uint64`/`int64` 风格
字段可能是 `number | string`；不要在没有范围保证时无条件调用 `Number(...)`。

## 安全注意事项

- API key 应从 secret manager 或运行环境提供，不要硬编码或提交到版本控制；
- 生产环境必须使用 HTTPS；`allowInsecureHttp` 只接受显式开启的 loopback 地址；
- 不要记录认证 header、授权 code/password/session、消息正文或一次性 secret；
- 不要从外部输入动态覆盖 `baseUrl`；client 会把凭据限制在初始化时确定的 origin/path；
- 对写操作自行设计业务幂等和失败恢复，不要把读取 operation 的重试假设套用到写入。

更多设计细节见[安全边界](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/zh-CN/security.md)。

## 项目与许可证

- [GitHub 仓库](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs)
- [项目 README](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/README.zh-CN.md)
- [MIT License](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/LICENSE)
