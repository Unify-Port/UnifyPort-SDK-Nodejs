# 验收报告

验收日期：2026-07-14

## 结论

SDK、MCP Server、公开 skills、生成链路与质量门禁已完成，当前实现通过本地完整验收。项目可以继续接收
新的公开 API 契约；新增 operation 默认不重试、默认不进入 MCP，必须经过显式策略审查。

实际 npm 发布仍保持关闭：两个 package 均为 `private: true`。license、发布渠道和版本策略属于独立的
发布决策，在这些事项明确前不得取消该保护。

## 验收范围

- 一份 Device API 公开 OpenAPI 契约；
- `@unifyport/sdk-node` 的 Device API 客户端；
- `@unifyport/mcp-server` 的 stdio transport、tool registry 与权限策略；
- 两个可公开复用的维护/使用 skill；
- TypeScript 生成器、契约 lint、测试、类型检查、构建、打包与 CI workflow；
- 源码树和真实 npm tarball 的公开信息边界扫描。

## 覆盖结果

| 项目                 |      结果 |
| -------------------- | --------: |
| 公开 operation       |        64 |
| SDK 显式方法         |        64 |
| Device API operation |        64 |
| MCP 显式 allowlist   |         4 |
| MCP 默认/永久排除    |        60 |
| 自动化测试           | 33 个通过 |

完整 operation 映射见 [API 覆盖率](api-coverage.md)。

## 关键边界

- 项目源码、配置和维护脚本统一使用 TypeScript，不包含 `.mjs`；
- Device API key 只能由 client 配置注入，单次 operation 不能覆盖认证字段；
- base URL 默认要求 HTTPS，credential 固定在配置的 origin/path 范围内；
- timeout 覆盖 credential provider、HTTP 请求和完整响应流，timer 与响应体均设有安全上限；
- 自动重试采用显式 allowlist，新 operation 默认不重试；
- 超出 JavaScript 安全范围的整数 token 保留为字符串，包括小数和科学记数法表示；
- 公开错误不保留原始 `Response`/header/body/cause、完整 query 或未筛选 diagnostics；
- MCP input schema 递归关闭额外字段，并与 AJV 校验和执行前投影复用同一份 schema；
- MCP 默认只读，write/destructive 分别需要显式权限，secret operation 永不暴露；
- Device API 中的账号授权 password、code 与 session payload 保持敏感输入边界，不进入 MCP；
- cursor helper 具有页数上限、重复 cursor 检测和 pending fetch 的 abort race。

## 验证记录

在 Node.js 24.14.0、pnpm 11.7.0 环境执行：

| 命令/门禁             | 结果                                                  |
| --------------------- | ----------------------------------------------------- |
| `pnpm public:check`   | 通过，扫描 56 个项目文件                              |
| `pnpm contracts:lint` | Device API 契约通过 Redocly 校验                      |
| `pnpm generate:check` | 生成物可复现且无漂移                                  |
| `pnpm lint`           | ESLint 通过                                           |
| `pnpm format:check`   | Prettier 通过                                         |
| `pnpm test`           | 33/33 通过                                            |
| statements coverage   | 93.67%                                                |
| branches coverage     | 85.15%                                                |
| functions coverage    | 97.89%                                                |
| lines coverage        | 96.59%                                                |
| `pnpm typecheck`      | tooling、SDK、MCP 严格类型检查通过                    |
| `pnpm build`          | 两个 package clean build 通过                         |
| `pnpm package:check`  | 两个 tarball 的 `publint`、类型入口与公开边界扫描通过 |
| `pnpm check`          | 完整门禁通过                                          |

另在不包含 `.git`、`node_modules`、`dist` 与 `coverage` 的临时副本中执行
`pnpm install --frozen-lockfile && pnpm clean && pnpm check`，fresh checkout 场景完整通过。

CI workflow 使用 Node.js 22.12.0 与 24.x matrix 执行相同的 `pnpm check`。本次没有推送远程分支，
因此远程 CI 状态不属于本地验收结果。

## 尚未执行的外部验证

- 未使用真实 credential 调用线上 API；自动化测试通过注入式 `fetch` 覆盖协议、安全与错误边界；
- 未发布 npm package；
- 未执行远程 CI。

这些项目不会削弱当前本地实现门禁，但在正式发布前应分别完成并记录结果。
