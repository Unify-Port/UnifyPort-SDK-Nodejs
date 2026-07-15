# `@unifyport/sdk-node`

面向 Node.js/TypeScript 的 UnifyPort Device API SDK，提供 `UnifyPortDeviceClient`，并通过
`X-Api-Key` 保持固定认证边界以及统一的 timeout、错误和安全重试模型。Device API 内的 provider
账号管理、授权和运行态 operation 仍由该客户端提供。

## 安装

```bash
npm install @unifyport/sdk-node
```

完整用法、契约治理和安全说明见
[项目 README](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs#readme)。公开发布前必须运行：

```bash
pnpm check
pnpm public:check
```
