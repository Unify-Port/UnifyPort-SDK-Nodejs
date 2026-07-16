# 将 SDK Skill 发布到 ClawHub

[English](../clawhub-publishing.md) | [简体中文](clawhub-publishing.md)

## 已确认决策

- ClawHub release 归属 `clawhub login` 当前认证的个人账号，或 `CLAWHUB_TOKEN` 对应的个人账号。发布命令
  和 workflow 有意省略 `--owner` 与 `owner` input。
- 每个 ClawHub Skill release 都按平台要求使用 MIT-0。该许可证只适用于发布到 ClawHub 的 Skill
  bundle，不改变 `@unifyport/sdk-node` 与本仓库当前使用的 MIT 许可证。

## 发布边界

ClawHub 只发布 `skills/unifyport-node-sdk`。

`@unifyport/mcp-server` 仍是没有公开安装渠道的 private package，因此 `skills/unifyport-mcp` 继续留在
仓库内。不得发布整个 `skills/` 目录，也不得执行不受约束的 sync 命令。

发布的 SDK Skill 是开发与集成说明，不包含 SDK runtime，不安装 MCP Server，不会把 Device API
operation 暴露成 OpenClaw tools，也不包含任何凭据。项目仍需单独从 npm 安装
`@unifyport/sdk-node` runtime。

## 前置条件

1. 安装当前版本的 ClawHub CLI，并认证个人发布账号：

   ```bash
   npm install --global clawhub
   clawhub login
   clawhub whoami
   ```

2. GitHub Actions 使用同一个个人账号创建的 `CLAWHUB_TOKEN` repository secret。不得提交或打印该
   token。
3. 首次发布前，或 ClawHub 平台发生重大变化后，重新检查当前的
   [Skill 格式](https://docs.openclaw.ai/clawhub/skill-format)、
   [发布说明](https://docs.openclaw.ai/clawhub/publishing)和
   [安全审计说明](https://docs.openclaw.ai/clawhub/security-audits)。

本流程不使用 GitHub web importer。CLI 与 GitHub Actions 直接发布 checkout 中指定的 Skill 目录，从而
保留明确的发布边界。

## 本地预检

先运行仓库门禁：

```bash
pnpm clawhub:check
pnpm docs:check
pnpm format:check
pnpm public:check
pnpm check
```

再从仓库根目录执行 ClawHub 官方 dry-run：

```bash
clawhub skill publish ./skills/unifyport-node-sdk \
  --slug unifyport-node-sdk \
  --name "UnifyPort Node.js SDK" \
  --dry-run \
  --json
```

命令有意省略 `--owner`，由 ClawHub 根据当前认证账号解析个人 owner。正式发布获批前，dry-run 必须在不
上传内容的情况下成功完成。

## GitHub Actions 流程

`.github/workflows/clawhub-skill-publish.yml` 包含两条路径：

- pull request 使用固定版本的 ClawHub CLI 执行 `--dry-run`，不提供发布 token；
- `workflow_dispatch` 只允许从 `main` 使用 `CLAWHUB_TOKEN` 执行真实发布。

两条路径都传入精确的 `skills/unifyport-node-sdk` 目录和展示名 `UnifyPort Node.js SDK`。CLI 固定为本
仓库已验证的版本，避免上游变化或自动 title case 静默改变发布结果。workflow 不监听普通 push 或 tag，
避免 npm SDK release 隐式触发 Skill 发布。

新的 ClawHub Skill 从 `1.0.0` 开始；bundle 变化后默认递增 patch 版本。Skill 版本独立于 npm SDK
版本，不应强制保持一致。

## 发布后验证

手动 workflow 成功后，用 `clawhub whoami` 返回的账号替换 `<personal-handle>`，检查精确 release：

```bash
clawhub inspect @<personal-handle>/unifyport-node-sdk --versions --files --json
clawhub scan --slug unifyport-node-sdk --version 1.0.0 --json
openclaw skills install @<personal-handle>/unifyport-node-sdk
```

确认公开文件列表、MIT-0 许可证、版本、来源信息和 Security Audit 状态。安装 smoke test 必须在一次性
workspace 中执行，不使用生产凭据，也不发送实时 API 请求。

如果 release 内容错误，优先发布修正后的 patch。只有在检查 ClawHub 当前的保留和 slug 占用规则后，
才能隐藏或删除 release。
