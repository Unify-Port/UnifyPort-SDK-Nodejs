# `@unifyport/mcp-server`

通过 stdio 暴露经 operation policy 过滤的 UnifyPort Device API tools。默认只读，credential 只能来自
启动环境；交互式账号授权与 secret 输入/输出 operation 永不进入工具列表。

tool 必须对应固定 SDK operation，不能提供任意 method、path、header 或 base URL 的通用请求入口。
完整配置见 [项目 README](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs#readme)。公开发布前必须运行：

```bash
pnpm check
pnpm public:check
```

当前 package 为发布前状态，`private: true`。
