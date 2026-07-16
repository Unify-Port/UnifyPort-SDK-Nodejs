# `@unifyport/mcp-server`

[English](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/mcp/README.md) | [简体中文](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/mcp/README.zh-CN.md)

Exposes UnifyPort Device API tools over stdio after filtering them through the operation policy. The
server is read-only by default, credentials can come only from the startup environment, and operations
with interactive account authorization or secret inputs/outputs never appear in the tool list.

Every tool must map to a fixed SDK operation. The server does not provide a generic request entry point
for arbitrary methods, paths, headers, or base URLs. See the
[project README](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs#readme) for complete configuration.
Before any public release, run:

```bash
pnpm check
pnpm public:check
```

This package is not yet published and remains `private: true`.
