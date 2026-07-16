# 安全边界

[English](../security.md) | [简体中文](security.md)

## 威胁模型

本项目需要防止以下风险：

- API key、账号授权密码、验证码、session payload 或一次性 secret 进入源码、日志或模型上下文；
- 认证信息被发送到错误 origin，或在 redirect 时意外转发；
- 自动重试重复执行有副作用的 operation；
- 超大或恶意响应污染日志、错误对象或 MCP 上下文；
- JavaScript 数值精度丢失导致操作错误资源；
- 通用 MCP 工具绕过 operation allowlist 与权限开关；
- webhook 签名规则不完整时产生虚假的安全保证。

## 认证域隔离

- Device API 凭据不能跨 origin 或跨 redirect 转发；
- `X-Api-Key` 只能由 `DeviceClientConfig` 或 MCP 启动环境提供；
- 单次 operation 的 `headers` 或 tool input 不能覆盖认证字段；
- base URL 在 client 创建时完成校验，默认要求 HTTPS；仅 loopback 开发场景可显式允许 HTTP；
- SDK 不应自动跟随可能把认证 header 带到不同 origin 的 redirect。

Device API 中 `/v1/accounts/...` 下的账号授权操作可能接收密码、验证码或 session payload，也可能返回临时授权 secret。这些是 provider 账号资源，不是另一个独立认证服务，但仍必须遵守相同的凭据隔离规则。

## 凭据生命周期

### Device API

API key 只保存在 client 闭包或请求 header 中，不出现在公开 config dump、错误详情、retry 日志或 MCP result。创建或轮换返回的一次性明文只能交给直接 SDK 调用方。

## 日志与错误脱敏

公开错误允许保留：

- HTTP status；
- 经过字符 allowlist 和长度限制的服务端错误 `code`；
- 经过字符 allowlist 和长度限制的 request ID；
- SDK 自身生成的稳定、通用错误说明。

禁止记录：

- `Authorization`、`X-Api-Key`；
- password、verification code、session payload、webhook signing secret；
- API key create/rotate 返回的一次性明文；
- 完整 request/response body 或 client config；
- 上游原始 message、details、完整 URL query 与原始 cause；
- 原始 `Response`、response headers 或其他可绕过字段级脱敏的传输对象。

非 JSON 错误体需要限制读取长度并使用通用错误信息。错误解析失败不能回退为打印原始 body。成功结果可以保留调用方明确需要的 `Response`，但公开错误类只保存经过筛选的 status、code 与 request ID，避免异常被日志或序列化工具展开时泄露 header 或 body。

响应限制必须同时约束 wire body 和整数规范化后的 JSON。科学记数法等短 token 在规范化时可能显著膨胀；如果规范化结果将超过 `maxResponseBytes`，应立即失败并返回稳定错误，不能先构造完整大字符串。

## 超时、取消与重试

每次请求必须有有限 timeout，并支持调用方 `AbortSignal`。合并 signal 时要在请求结束后清理 timer 和 listener，避免保留资源。

自动重试采用显式 allowlist：

- 仅对策略标记为 `retryable` 的安全 operation 生效；
- 仅处理连接失败、`408`、`429`、`502`、`503`、`504` 等临时故障；
- 尊重合法且有上限的 `Retry-After`；
- 其余使用 full jitter，并限制最大次数与总等待时间；
- 调用方 abort 后立即停止，不再 sleep 或发请求。

普通写操作、一次性 secret 操作和账号授权步骤默认不重试。未来若公开协议提供 idempotency key，也必须在契约和测试明确覆盖后，才能为对应 operation 单独启用。

## MCP 最小权限

MCP 暴露不是 SDK 覆盖率的镜像。SDK 可以支持直接应用调用，但 MCP 必须进一步限制模型可见面：

| 分类        | 默认 | 开启 writes | 开启 writes + destructive |
| ----------- | ---- | ----------- | ------------------------- |
| read        | 可见 | 可见        | 可见                      |
| write       | 隐藏 | 可见        | 可见                      |
| destructive | 隐藏 | 隐藏        | 可见                      |
| never       | 隐藏 | 隐藏        | 隐藏                      |

以下 operation 固定为 `never`：

- 账号授权中需要人工交互或返回临时 secret 的流程；
- 接收 password、verification code、session payload 或 signing secret 的操作；
- 返回一次性 API key、invite code 或同等级 secret 的操作；
- 无法证明副作用、数据暴露或重试边界的操作。

MCP 禁止提供任意 base URL、任意 header、任意 method 或任意 path 的通用工具。tool input 必须通过对应 OpenAPI JSON Schema 校验并拒绝额外认证字段。tool result 也应过滤敏感字段，并限制错误体大小。

stdio 模式下，普通日志写入 `stdout` 会破坏 JSON-RPC 帧。实现必须把日志写到 `stderr`，并在写出前脱敏；不要直接打印完整 config、request headers、response body 或 caught error 对象。

## JavaScript `uint64` 与数据完整性

把超过 `Number.MAX_SAFE_INTEGER` 的 ID 解析成 `number` 会静默改变值，随后可能操作错误账号、API key 或资源。这是安全和完整性问题，不只是类型偏好。公开契约没有明确安全范围的 `uint64` 应保持字符串；边界测试至少覆盖 `9007199254740991` 和更大的合法值。

## Webhook 边界

只有经批准的公开 API schema 与 release notes 完整定义签名版本、canonical payload、时间容差和重放规则后，SDK 才能提供验证 helper。在协议不完整时加入推测算法会给调用方虚假的安全保证。

## 依赖与发布

- 依赖使用 lockfile 固定，升级时审查 changelog、Node engine、ESM/CJS exports 和 transitive diff；
- `pnpm package:check` 必须检查 tarball 内容、exports 与声明文件；开发 fixture 和本地凭据不得被打包；
- 新版本 `@unifyport/sdk-node` 只有在 license、version、registry 配置和完整质量门禁复核后才允许发布；`@unifyport/mcp-server` 保持 `private: true`，避免 SDK 发布同时扩大 MCP 的分发范围；
- 每次公开交付都必须运行 `pnpm public:check`，确认文档、配置和产物没有越过公开边界。

## 安全评审清单

新增或变更 operation 时至少回答：

1. 它的认证是否可能跨 origin 泄露？
2. 它是否改变服务端或浏览器状态，失败后能否证明可安全重试？
3. 请求或响应是否包含 secret、个人数据或大 payload？
4. ID/cursor 是否可能超过 JavaScript 安全整数？
5. 它的 MCP 分类是 `read`、`write`、`destructive` 还是 `never`？
6. 是否存在 redirect、webhook 重放或 SSRF 边界？
7. 哪些自动化检查能证明上述分类，而不是只覆盖 happy path？
