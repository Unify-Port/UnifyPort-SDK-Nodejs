# UnifyPort Node.js SDK

[English](README.md) | [简体中文](README.zh-CN.md)

面向 Node.js/TypeScript 的 UnifyPort SDK 工作区，提供类型安全 SDK、受最小权限约束的 stdio MCP
Server，以及供自动化代理复用的公开 skills。

`@unifyport/sdk-node` 采用 MIT 许可证并通过 npm 公开发布；`@unifyport/mcp-server` 仍保持
`private: true`，在 MCP 的独立发布策略明确前不进入 registry。

## 能力与边界

| 资产                    | 作用                                        | 关键边界                     |
| ----------------------- | ------------------------------------------- | ---------------------------- |
| `@unifyport/sdk-node`   | Device API 类型、客户端和传输错误模型       | 认证固定为 `X-Api-Key`       |
| `@unifyport/mcp-server` | 把策略允许的 SDK operation 暴露为 MCP tools | 默认只读，无通用 raw request |
| `contracts/`            | 保存经批准的公开 OpenAPI 契约               | 是生成代码的唯一协议输入     |
| `skills/`               | 维护 SDK/MCP 的公开 agent workflow          | 不替代契约和验证             |

SDK 不会为公开契约没有定义的能力推测请求格式、认证方法或安全语义。

## Device API 客户端

- `UnifyPortDeviceClient` 使用 `X-Api-Key` 调用 Device API；
- API key 只从 client 配置读取，不能由单次 operation input 覆盖。

Device API 中的 `/v1/accounts/...` 是 provider 账号资源，包含账号管理、授权和运行态能力，并由同一个
`UnifyPortDeviceClient` 提供。

## 环境要求

- Node.js `>=22.12.0`
- pnpm `10.34.5`

在仓库根目录安装依赖：

```bash
pnpm install --frozen-lockfile
```

## SDK 快速开始

从 npm 安装 SDK：

```bash
npm install @unifyport/sdk-node
```

完整的 client 配置、operation 参数、分页和错误处理示例见
[SDK 使用说明](packages/sdk/README.zh-CN.md)。
全部 operation 的独立参数表、返回字段和 TypeScript 示例见
[Device API Reference](docs/zh-CN/api-reference/README.md)。

然后从 package 根入口导入客户端：

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

// 方法名保持 OpenAPI operationId，避免在 SDK 与协议之间维护第二套命名。
const workspace = await device.getWorkspace();
```

operation 方法由仓库内 OpenAPI operationId 生成。统一签名为 `(request?, execution?)`：有 required
path/body 时 `request` 必填，`execution` 可覆盖本次调用的 `timeoutMs`、`retry` 和 `signal`。调用参数、
响应类型与当前覆盖范围以 package 导出和公开契约为准，不要手拼 path 或认证 header。

client 可通过 `maxResponseBytes` 收紧 wire body 与整数规范化后 JSON 的共同上限；默认上限用于防止异常
响应或短 exponent 放大耗尽 Node.js 进程内存。
仓库源码、配置和维护脚本统一使用 TypeScript，不接受 `.mjs` 文件。

默认只允许 HTTPS。开发环境如确实需要 loopback HTTP，必须通过 client 配置显式 opt in；生产环境
不应开启该例外。

## MCP 快速开始

先构建工作区：

```bash
pnpm build
```

然后由 MCP host 以 stdio 启动：

```bash
UNIFYPORT_DEVICE_API_BASE_URL="https://device.example.com" \
UNIFYPORT_DEVICE_API_KEY="<secret>" \
node packages/mcp/dist/cli.js
```

连接与权限配置：

| 环境变量                           | 含义                                             | 默认值  |
| ---------------------------------- | ------------------------------------------------ | ------- |
| `UNIFYPORT_DEVICE_API_BASE_URL`    | Device API base URL                              | 未配置  |
| `UNIFYPORT_DEVICE_API_KEY`         | `X-Api-Key` 值                                   | 未配置  |
| `UNIFYPORT_MCP_ENABLE_WRITES`      | 显式设置 `true` 才暴露允许的非破坏性写 tools     | `false` |
| `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE` | 与 writes 同时为 `true` 才暴露允许的破坏性 tools | `false` |
| `UNIFYPORT_ALLOW_INSECURE_HTTP`    | 显式设置 `true` 才允许本地 HTTP 例外             | `false` |

MCP 默认只读。secret 输入、一次性 secret 输出和未明确分类的 operation 永不暴露，
即使写/破坏性开关都已开启。base URL 和 API key 只能从进程启动环境提供，不是 tool input。
stdio 的 `stdout` 仅用于 JSON-RPC；部署脚本必须把普通日志留在 `stderr`。

## 公开契约维护

代码生成只读取本仓库中的一份公开契约：

- `contracts/device.openapi.yaml`

契约变更必须基于经批准的公开 API schema 和 release notes。不要根据未发布实现或观察结果补写
协议。修改契约后运行：

```bash
pnpm contracts:lint
pnpm generate
pnpm generate:check
pnpm docs:check
pnpm public:check
```

任何 generated 文件都不应手改；应修改契约、operation policy 或 generator 后重新生成。完整流程见
[契约维护说明](docs/zh-CN/contract-maintenance.md)。

## 常用命令

所有命令都从根 `package.json` 执行：

| 命令                  | 作用                                |
| --------------------- | ----------------------------------- |
| `pnpm build`          | 按 workspace 顺序构建 package       |
| `pnpm clean`          | 清理 coverage 与 package 构建产物   |
| `pnpm check`          | 运行完整工程门禁                    |
| `pnpm public:check`   | 检查公开仓库内容与发布边界          |
| `pnpm contracts:lint` | 用 Redocly lint Device OpenAPI      |
| `pnpm docs:check`     | 检查 API Reference 覆盖和文档链接   |
| `pnpm generate`       | 从公开契约生成类型和 operation 资产 |
| `pnpm generate:check` | 检查生成物是否可复现且无漂移        |
| `pnpm lint`           | 运行 ESLint                         |
| `pnpm format:check`   | 只检查格式                          |
| `pnpm test`           | 运行 Vitest 与 coverage             |
| `pnpm typecheck`      | 对所有 package 做无输出类型检查     |
| `pnpm package:check`  | 检查 tarball、exports 与声明文件    |

完整工程验收：

```bash
pnpm check
pnpm public:check
```

`pnpm public:check` 是公开交付的独立强制门禁；即使 `pnpm check` 通过，也不能跳过它。

`pnpm lint` 与 `pnpm test` 都会先 clean build SDK。MCP 源码、测试和 CLI 子进程按真实 package
exports 解析 SDK，这一步保证 fresh checkout 不依赖本地残留的 `dist`。

## 目录

```text
unifyport-sdk-node/
├── contracts/              # 经批准的公开 OpenAPI 契约
├── docs/                   # 架构、安全和契约维护说明
├── packages/
│   ├── sdk/                # @unifyport/sdk-node
│   └── mcp/                # @unifyport/mcp-server
├── scripts/                # 生成与质量检查
├── skills/
│   ├── unifyport-node-sdk/ # SDK 维护/使用 skill
│   └── unifyport-mcp/      # MCP 配置/安全 skill
└── AGENTS.md               # 仓库级协作约束
```

## 设计与安全文档

- [Device API Reference](docs/zh-CN/api-reference/README.md)
- [架构说明](docs/zh-CN/architecture.md)
- [安全边界](docs/zh-CN/security.md)
- [契约维护流程](docs/zh-CN/contract-maintenance.md)
- [验收报告](docs/zh-CN/acceptance-report.md)
- [SDK skill](skills/unifyport-node-sdk/SKILL.md)
- [MCP skill](skills/unifyport-mcp/SKILL.md)

新增 API 前先完成认证、副作用、retry、secret、destructive、JavaScript `uint64` 与 MCP
exposure 分类。无法证明安全时，SDK 不自动重试，MCP 采用不暴露的保守默认值。
