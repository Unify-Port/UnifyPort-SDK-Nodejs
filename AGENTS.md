# AGENTS.md

本文件约束所有在本仓库工作的自动化代理和维护者。这里的规则覆盖整个仓库；子目录若新增
`AGENTS.md`，只能补充更具体的限制，不能放宽本文件的安全与契约边界。

## 语言与注释

- 默认使用简体中文沟通和写文档；代码标识符、命令、配置键、协议字段、错误码保持英文原文。
- 每次修改代码都要同步添加或更新简短中文注释。注释只解释 why：设计意图、边界、历史兼容、
  外部限制或风险；不要把代码逐行翻译成中文。
- 行为变化后必须删除或更新过期注释，避免注释和真实实现互相矛盾。
- 提交说明、测试名和代码块默认使用英文，除非现有文件已有更具体的中文规范。

## 仓库职责与禁止事项

- 本仓库只覆盖 Device API 的公开能力。Device API 内的 provider 账号资源仍属于本仓库范围。
- 这是对外项目；源码、文档、测试、生成物和发布包不得包含其他非公开项目的名称、路径、仓库/
  分支/commit、hostname、实现细节或凭据。
- 代码生成的协议输入仅为 `contracts/device.openapi.yaml`。
- 仓库源码、配置和维护脚本统一使用 TypeScript；不得新增 `.mjs` 文件。
- 契约只能依据经批准的公开 API schema 和 release notes 更新；不得根据未发布实现推测字段或行为。
- 不要手改带有 generated 标记的文件。应修改契约、生成策略或模板，再运行 `pnpm generate`。
- 默认最小改动，不进行与当前目标无关的重构、升级依赖或发布操作。
- 任何公开交付都必须运行 `pnpm public:check`，不能用其他检查结果替代。

## 开始修改前

1. 先阅读本文件、`README.md` 以及与改动相关的 `docs/*.md`。
2. 用 `rg` 确认真正的文件、operationId、导出和现有测试，不根据印象猜路径或 API 名称。
3. 检查工作区状态，保留用户和其他代理已有的修改；共享工作区中不得覆盖未知改动。
4. 如果一个需求有多种会改变公开 API 或安全边界的解释，先把差异和影响说明清楚。
5. 涉及协议变化时，先确认公开 API schema 和 release notes 已经批准，再更新本仓库契约。

## 架构不变量

- 保持 `UnifyPortDeviceClient` 作为公开客户端。Device API 使用 `X-Api-Key`，认证材料必须来自客户端
  配置或 MCP 启动环境，不能由单次 operation input 覆盖。
- Device API 中 `/v1/accounts/...` 下的账号管理、授权和运行态 operation 是 provider 账号资源，不得
  因收窄 SDK 目标范围而删除。
- 自动重试只允许用于已明确标记为安全的 operation。写操作、账号授权中的 code/password/session
  提交、一次性 secret 返回等操作不得仅凭 HTTP method 推断为可重试。
- `uint64` 风格 ID 不得无条件转换成 JavaScript `number`；在没有安全范围保证时保留为字符串。
- SDK 的公开错误保留 HTTP status、经过白名单和长度限制的服务端 `code`、request ID；原始 cause、
  message 和 details 可能回显输入，不得直接进入公开错误、日志或 MCP。
- MCP 必须是逐 operation 的白名单工具，禁止加入绕过策略的通用 `raw_request`/`call_api` 工具。
- MCP 默认只读；写操作需要显式开启，破坏性操作还需要第二个独立开关。secret 输出或 secret 输入
  operation 永远不得暴露给模型。
- stdio MCP 的 `stdout` 只写 JSON-RPC；诊断日志写 `stderr`，并进行敏感信息脱敏。

## 契约与生成流程

涉及 API 变更时按以下顺序工作：

1. 审查经批准的公开 API schema 和 release notes。
2. 更新 `contracts/device.openapi.yaml`。
3. 运行 `pnpm contracts:lint`，修复契约问题而不是在生成物中打补丁。
4. 更新 operation 安全策略后运行 `pnpm generate`。
5. 添加或调整传输、错误、类型、MCP 策略及契约覆盖测试。
6. 运行 `pnpm generate:check`，确保生成结果可复现且工作区没有漂移。
7. 运行 `pnpm check` 和 `pnpm public:check`。

新增 operation 时必须明确分类：认证方式、是否有副作用、是否可重试、是否返回/接收 secret、是否
destructive、是否允许进入 MCP。无法证明安全时采用更严格的分类。

## 验证要求

- 修改后至少运行与改动直接相关的命令，并在交付说明中列出实际执行结果。
- 完整工程验收命令是 `pnpm check`；公开交付还必须单独运行 `pnpm public:check`。
- 只改文档时至少运行 `pnpm format:check` 与 `pnpm public:check`；涉及 generated 内容时还要运行
  `pnpm generate:check`。
- 无法执行某项验证时，要说明具体原因、未覆盖风险和建议的后续命令，不能把未运行写成已通过。
- 不得把真实 API key、账号授权 code/password/session payload、webhook secret 或一次性返回的 key
  写入 fixture、snapshot、命令示例或文档。

## 交付说明

交付时先给结论，再列出修改文件、关键边界和验证命令。涉及公开 API 或 MCP 暴露面时，必须同时
说明兼容性和安全影响；契约变化还要说明采用的已批准 API schema/release notes 版本及对应影响。
