# UnifyPort MCP Server Skill（简体中文）

[English](SKILL.md) | [简体中文](SKILL.zh-CN.md)

本文档是 canonical `SKILL.md` 的简体中文说明，不是独立的可执行 skill 入口。

## 适用场景

当任务涉及 `@unifyport/mcp-server` 的安装、配置、tool 增删、权限、stdio 故障或安全审查时使用本 skill。涉及 SDK operation 或契约变化时，同时使用 `unifyport-node-sdk` skill。

## 开始前必须做

1. 阅读根 `AGENTS.zh-CN.md`、`docs/zh-CN/architecture.md` 和 `docs/zh-CN/security.md`。
2. 用 `rg` 确认 operation metadata、当前 tool 列表、CLI 入口和测试。
3. 检查工作区状态并保留现有修改。
4. 明确任务是部署配置、SDK operation 变化还是 MCP exposure 变化；三者验证范围不同。
5. 协议变化必须有经批准的公开 API schema 与 release notes。

## 启动配置

MCP 只从启动环境读取连接和权限：

- `UNIFYPORT_DEVICE_API_BASE_URL`
- `UNIFYPORT_DEVICE_API_KEY`
- `UNIFYPORT_MCP_ENABLE_WRITES`
- `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE`
- `UNIFYPORT_ALLOW_INSECURE_HTTP`

Device API base URL 和 API key 必须来自启动环境。不要把这些值写进 tool input、配置样例、日志或错误输出。生产环境使用 HTTPS；insecure HTTP 只允许显式 opt in 的本地 loopback 场景。

Device API 内的 provider 账号资源仍可由 SDK 调用，但含 password、code、session payload 或临时 secret 的授权 operation 不进入 MCP 工具面。

## Tool 暴露策略

每个 tool 必须对应一个固定 SDK operation，并使用该 operation 的 JSON Schema 校验输入。禁止添加 `raw_request`、`call_api`、任意 path/header/base URL 等通用逃生入口。

分类规则：

| 分类        | 可见条件                                                   | 示例边界                       |
| ----------- | ---------------------------------------------------------- | ------------------------------ |
| read        | 默认可见                                                   | 无副作用且不返回 secret 的读取 |
| write       | `UNIFYPORT_MCP_ENABLE_WRITES=true`                         | 非破坏性状态变更               |
| destructive | writes 与 `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE=true` 同时成立 | 删除、撤销或不可逆操作         |
| never       | 永不暴露                                                   | secret 输入或输出、未知风险    |

配置缺失、空值或无法解析时按 `false`。destructive 不能在 writes 关闭时单独生效。

以下 operation 无论开关如何都必须归入 `never`：

- 需要人工交互或返回临时 secret 的 provider 账号授权流程；
- API key create/rotate 等返回一次性明文 secret 的接口；
- 接收密码、验证码、导入 session 或 signing secret 的接口；
- 无法证明副作用、retry 或数据暴露边界的接口。

## 新增或修改 tool

1. 先在仓库内公开契约中确认 operation 存在且类型生成成功。
2. 审查 auth、side effect、retry、secret 与 destructive 属性。
3. 修改 operation policy 或生成逻辑，而不是手写一条会与契约漂移的工具。
4. 确认 tool input 不包含 base URL、认证 header 或其他启动级配置。
5. 使用 schema 校验 path、query 和 body；拒绝未声明的认证字段和不安全整数转换。
6. result 只返回任务需要的数据，过滤 secret，并限制错误和响应体大小。
7. 测试默认、writes、writes + destructive 三种列表，并证明 never operation 在所有组合下都不可见。
8. 运行 `pnpm generate:check`、`pnpm check` 与 `pnpm public:check`。

无法明确分类时选择 `never`，并在交付中说明需要哪项公开协议说明才能开放。

## stdio 约束

- `stdout` 只允许 MCP JSON-RPC 帧；所有诊断日志写 `stderr`。
- 不打印完整 config、headers、request body、response body 或 caught error。
- tool 执行器必须把 abort 和 timeout 传到 SDK，并把 SDK error 转换为稳定、脱敏且有界的 MCP error。
- Server shutdown 时清理 listener 和 timer；不要让 retry timer 阻止进程退出。
- MCP host 提供的 cwd 不能改变契约或凭据解析语义。

当出现“server 立即断开”或 JSON parse 错误时，先检查是否有普通日志、warning 或 stack trace 写到了 `stdout`，再检查 Node engine、构建产物和环境变量；不要先关闭 schema 或安全校验。

## 验证矩阵

至少覆盖：

1. 无权限开关：只有安全 read tools。
2. 只开 destructive：仍只有安全 read tools。
3. 只开 writes：read + 非 destructive write。
4. 同时开 writes/destructive：允许策略明确的 destructive tools。
5. secret tools 在所有组合下缺失。
6. 缺少 Device API 配置时启动失败，且错误中不回显配置。
7. malformed input 在发出 HTTP 请求前被拒绝。
8. `stdout` 没有非 JSON-RPC 输出，`stderr` 不包含 secret。

完整验证命令：

```bash
pnpm check
pnpm public:check
```

交付时报告 tool exposure diff、使用的开关组合、实际验证命令及尚未验证的部署假设。不要在报告中回显真实环境变量值。
