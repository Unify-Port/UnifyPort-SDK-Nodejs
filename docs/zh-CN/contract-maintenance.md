# 契约维护流程

[English](../contract-maintenance.md) | [简体中文](contract-maintenance.md)

## 公开契约是唯一生成输入

| API        | 本仓库契约                      | 允许的更新依据                           |
| ---------- | ------------------------------- | ---------------------------------------- |
| Device API | `contracts/device.openapi.yaml` | 经批准的公开 API schema 与 release notes |

生成器、SDK 和 MCP metadata 只能从这份仓库内契约读取协议。未进入经批准的公开 API schema 或 release notes 的字段、状态码和行为，不得通过猜测加入契约。

Device API 契约中的 `/v1/accounts/...` 是 provider 账号资源，包含账号管理、授权和运行态能力，仍属于本契约的维护范围。

## 前置条件

- Node.js `>=22.12.0`；
- pnpm `10.34.5`；
- 已取得本次变更对应、经批准的公开 API schema 与 release notes；
- 工作区现有修改已经识别并保留；
- 已明确本次变更的兼容性与安全责任人。

如果公开资料不足以确定请求、响应、认证或副作用，应暂停该 operation 的 SDK 扩展并记录待确认项，不能用理想化行为补齐空白。

## 标准更新步骤

### 1. 审查公开变更

逐项确认：

- method、path 与稳定且唯一的 operationId；
- path/query/header/body 参数；
- success/error status、response header、redirect、空 body 与 content type；
- 字段的 required/optional、nullable、format、enum 与整数范围；
- 认证、副作用、幂等性、secret 生命周期和兼容性；
- release notes 标明的新增、废弃和破坏性变化。

### 2. 更新仓库内契约

只修改 Device API 契约：`contracts/device.openapi.yaml`。

每个公开 operation 必须使用稳定且唯一的 operationId。一次性 secret 应在 schema 描述和 operation policy 中同时标识；`uint64` 风格 ID 在无安全范围保证时建模为 string；非 JSON、空 body、`3xx`、`204` 等响应应按公开协议建模，不应强行包装统一 JSON。

### 3. 校验契约

```bash
pnpm contracts:lint
```

lint 通过只说明 OpenAPI 结构和规则通过，不代表 SDK 安全分类正确。仍要检查每个新增或变化 operation 的认证、副作用、retry、secret、destructive 与 MCP exposure。

### 4. 生成并审查差异

```bash
pnpm generate
pnpm generate:check
```

生成结果应包含稳定类型和 operation metadata。审查时重点检查：

- operation 是否缺失、重复或被意外重命名；
- API Reference 是否为每个 operation 生成参数、请求体、响应和可类型检查的示例；
- required/optional、nullable、union 和 content type 是否正确；
- error/status 是否被生成器忽略；
- policy 默认值是否过度开放；
- secret operation 是否进入 MCP；
- 新增 schema 是否引入 `any`、不安全断言或 JavaScript 整数丢精度。

不要手改 generated 文件修正结果。应回到 OpenAPI、policy 或 generator 修复。

### 5. 补齐验证与文档

边界验证至少覆盖：

- 成功响应以及公开定义的错误响应；
- 空或非 JSON body；
- timeout、abort 与 retry 分类；
- redirect 与 credential 隔离；
- 一次性 secret 的脱敏；
- JavaScript 安全整数边界；
- MCP 在 read、write、destructive、never 四种策略下的可见性。

中英文 API Reference 和调用示例由生成器同步更新；字段说明或公开示例缺失时，应补入经批准的 OpenAPI 契约。不要直接编辑 `docs/api-reference/`、`docs/zh-CN/api-reference/` 或生成的示例校验文件。如 operation 改变架构、安全或使用流程，再同步更新 README、非生成 docs 和 skills 的中英文版本。

### 6. 运行完整门禁

```bash
pnpm check
pnpm public:check
```

`pnpm public:check` 是公开交付的强制步骤。它用于检查公开内容、契约命名和发布边界，不能因为 `pnpm check`、构建或类型检查通过而省略。

## 新增 API operation 清单

每个新增 operation 都必须完成以下项目：

1. **批准依据**：确认对应公开 API schema 和 release notes 已批准。
2. **契约**：补齐 method、path、operationId、请求、全部公开响应和安全定义。
3. **认证**：使用契约定义的 `X-Api-Key`；不能允许请求参数覆盖客户端认证。
4. **副作用**：不只看 HTTP method，说明服务端或外部 provider 是否改变状态。
5. **重试**：只有能够证明安全时才 opt in；未知默认不重试。
6. **数据**：检查 `uint64`、cursor、free-form object、binary/stream 和非 JSON body。
7. **secret**：标记敏感输入、一次性输出与日志脱敏要求。
8. **MCP**：分类为 read、write、destructive 或 never；未知采用 never。
9. **验证**：覆盖成功、公开错误、空或非 JSON body、timeout/abort 和相关边界。
10. **文档**：确认 API coverage、API Reference 与示例自动更新，并维护架构、安全、使用说明或 skill 中受影响流程的中英文版本。

## 破坏性变更判断

以下变化至少需要按 breaking change 审查：

- 删除或重命名 operationId、公开方法、类型或 exports；
- required 参数增加，字段类型收窄，成功状态或 content type 改变；
- ID 从 string 改为 number，或丢失原本可见的错误或响应元数据；
- 默认 retry、redirect 或认证注入语义变化；
- MCP 默认暴露更多 write 或 destructive 工具；
- Node engine、ESM exports 或包入口变化。

只增加 optional 字段也可能影响使用 exhaustiveness checking 的调用方，仍应在 release notes 中说明。

## 漂移排查

当 `pnpm generate:check` 失败时：

1. 运行 `pnpm generate` 查看确定性差异；
2. 确认 Node.js 和 pnpm 版本与 lockfile 一致；
3. 检查仓库内 Device API 契约、generator 排序以及输出中是否混入时间戳或绝对路径；
4. 修复 generator 或契约输入，不提交仅为通过 CI 的手工 generated patch；
5. 再次运行 `pnpm generate:check`、`pnpm check` 与 `pnpm public:check`。

若经批准的公开 API schema 或 release notes 暂时不可获得，应保留现有契约并明确未覆盖风险，不能用未确认资料替代公开协议。
