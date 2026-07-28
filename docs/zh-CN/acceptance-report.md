# 验收报告

[English](../acceptance-report.md) | [简体中文](acceptance-report.md)

- 验收基线日期：2026-07-28
- 发布状态复核日期：2026-07-28

> 本文记录发布前验收基线和当前分发边界；最新 SDK 版本与安装方式以根 `README.md` 为准。

## 结论

SDK、MCP Server、公开 skills、生成链路与质量门禁已通过完整的本地验收基线。项目可以继续接收新的公开 API 契约 operation；新增 operation 默认不重试、默认不进入 MCP，必须经过显式策略审查。

`@unifyport/sdk-node` `0.2.0` 已按 MIT 许可证发布到 npm。`@unifyport/mcp-server` 仍保持 `private: true`；发布 SDK 不会扩大 MCP Server 的分发边界。

## 验收范围

- 一份 Device API 公开 OpenAPI 契约；
- `@unifyport/sdk-node` 的 Device API 客户端；
- `@unifyport/mcp-server` 的 stdio transport、tool registry 与权限策略；
- 两个可公开复用的 SDK 维护和使用 skill；
- TypeScript 生成器、契约 lint、测试、类型检查、构建、打包检查与 CI workflow；
- 源码树和真实 npm tarball 的公开信息边界扫描。

## 覆盖结果

| 项目                 |      结果 |
| -------------------- | --------: |
| 公开 operation       |        64 |
| SDK 显式方法         |        64 |
| Device API operation |        64 |
| MCP 显式 allowlist   |         4 |
| MCP 默认或永久排除   |        60 |
| 自动化测试           | 34 个通过 |

完整 operation 映射见 [API 覆盖率](api-coverage.md)。

## 关键边界

- 项目源码、配置和维护脚本统一使用 TypeScript，不包含 `.mjs`；
- Device API key 只能由 client 配置注入，单次 operation 不能覆盖认证字段；
- base URL 默认要求 HTTPS，credential 固定在配置的 origin/path 范围内；
- timeout 覆盖 credential provider、HTTP 请求和完整响应流，timer 与响应体均设有安全上限；
- 自动重试采用显式 allowlist，新 operation 默认不重试；
- 超出 JavaScript 安全范围的整数 token 保留为字符串，包括小数和科学记数法表示；
- 公开错误不保留原始 `Response`、header、body、cause、完整 query 或未筛选 diagnostics；
- MCP input schema 递归关闭额外字段，并与 AJV 校验和执行前投影复用同一份 schema；
- MCP 默认只读，write/destructive 分别需要显式权限，secret operation 永不暴露；
- Device API 账号授权流程中的 password、verification code 与 session payload 保持敏感 SDK 输入边界，不进入 MCP；
- cursor helper 具有页数上限、重复 cursor 检测和 pending fetch 的 abort race 处理。

## 验证记录

发布前基线在 Node.js 24.18.0、pnpm 10.34.5 环境执行：

| 命令或门禁            | 结果                                                  |
| --------------------- | ----------------------------------------------------- |
| `pnpm public:check`   | 通过，扫描 102 个项目文件                             |
| `pnpm contracts:lint` | Device API 契约通过 Redocly 校验                      |
| `pnpm generate:check` | 生成物可复现且无漂移                                  |
| `pnpm lint`           | ESLint 通过                                           |
| `pnpm format:check`   | Prettier 通过                                         |
| `pnpm test`           | 34/34 通过                                            |
| statements coverage   | 93.67%                                                |
| branches coverage     | 85.15%                                                |
| functions coverage    | 97.89%                                                |
| lines coverage        | 96.59%                                                |
| `pnpm typecheck`      | tooling、SDK、MCP 严格类型检查通过                    |
| `pnpm build`          | 两个 package clean build 通过                         |
| `pnpm package:check`  | 两个 tarball 的 `publint`、类型入口与公开边界扫描通过 |
| `pnpm check`          | 完整门禁通过                                          |

已发布的 `0.2.0` 包还在全新临时项目中从公开 registry 安装，并使用成对的会话已读回执字段通过严格 TypeScript 编译。

当前 CI matrix 在 Node.js 22.12.0 与 24.x 上执行 `pnpm check`。仓库固定使用 pnpm 10.34.5，使质量门禁可以在声明的最低 Node.js 版本上运行；工具链对齐后，两个 matrix 任务均已通过。

## 外部验证状态

- 自动化测试不使用生产 credential，也不调用生产 API；通过注入式 `fetch` 覆盖协议、安全与错误边界；
- `@unifyport/sdk-node@0.2.0` 已发布到 npm，npm `latest` dist-tag 已指向该版本，并在 Git 中标记为 `v0.2.0`；
- 全新项目从公开 registry 安装到精确的 `0.2.0`，并通过 TypeScript `5.9.3` 编译；
- `@unifyport/mcp-server` 未发布并保持私有。

每次发布都应重新复核这些边界，以及当次 CI 结果和 npm package 内容。
