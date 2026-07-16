---
name: unifyport-mcp
description: Use when configuring, maintaining, or reviewing the UnifyPort MCP Server; covers stdio, the operation-tool allowlist, write and destructive opt-ins, credential isolation, and rules that prohibit exposing sensitive APIs.
---

[English](SKILL.md) | [简体中文](SKILL.zh-CN.md)

# UnifyPort MCP Server

## When to use this skill

Use this skill when a task involves installing or configuring `@unifyport/mcp-server`, adding or removing tools, permissions, stdio troubleshooting, or a security review. For SDK operation or contract changes, also use the `unifyport-node-sdk` skill.

## Required preparation

1. Read the root `AGENTS.md`, `docs/architecture.md`, and `docs/security.md`.
2. Use `rg` to confirm operation metadata, the current tool list, CLI entry points, and tests.
3. Inspect the worktree and preserve existing changes.
4. Determine whether the task changes deployment configuration, an SDK operation, or MCP exposure; each requires a different verification scope.
5. Protocol changes must be backed by an approved public API schema and release notes.

## Startup configuration

MCP reads connection and permission settings only from its startup environment:

- `UNIFYPORT_DEVICE_API_BASE_URL`
- `UNIFYPORT_DEVICE_API_KEY`
- `UNIFYPORT_MCP_ENABLE_WRITES`
- `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE`
- `UNIFYPORT_ALLOW_INSECURE_HTTP`

The Device API base URL and API key must come from the startup environment. Do not include these values in tool input, configuration examples, logs, or error output. Use HTTPS in production. Insecure HTTP is allowed only for an explicitly opted-in local loopback scenario.

Provider account resources within the Device API remain callable through the SDK, but authorization operations containing a password, code, session payload, or temporary secret are not part of the MCP tool surface.

## Tool exposure policy

Every tool must map to one fixed SDK operation and validate input using that operation's JSON Schema. Do not add generic escape hatches such as `raw_request`, `call_api`, or arbitrary path, header, or base URL input.

Classification rules:

| Class       | Visibility condition                                               | Example boundary                                  |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| read        | Visible by default                                                 | Read with no side effects or secret output        |
| write       | `UNIFYPORT_MCP_ENABLE_WRITES=true`                                 | Non-destructive state change                      |
| destructive | Both writes and `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE=true` are active | Delete, revoke, or another irreversible operation |
| never       | Never exposed                                                      | Secret input/output or unknown risk               |

Missing, empty, or unparseable settings are treated as `false`. Destructive access cannot be enabled independently when writes are disabled.

The following operations must use `never` regardless of opt-ins:

- provider account authorization flows that require human interaction or return a temporary secret;
- API key create or rotate operations that return a one-time plaintext secret;
- operations that accept a password, verification code, imported session, or signing secret;
- operations whose side effects, retry behavior, or data exposure boundary cannot be proven.

## Adding or changing a tool

1. Confirm that the operation exists in the in-repository public contract and that its types generate successfully.
2. Review its authentication, side effects, retry behavior, secrets, and destructive classification.
3. Change the operation policy or generation logic instead of writing a tool that can drift from the contract.
4. Confirm that tool input does not contain a base URL, authentication header, or other startup-level setting.
5. Validate path, query, and body input against the schema. Reject undeclared authentication fields and unsafe integer conversions.
6. Return only the data needed for the task, filter secrets, and limit error and response body sizes.
7. Test the default, writes, and writes-plus-destructive lists, and prove that never operations remain hidden in every combination.
8. Run `pnpm generate:check`, `pnpm check`, and `pnpm public:check`.

If a classification is unclear, choose `never` and explain which public protocol information is required before exposure can be enabled.

## stdio constraints

- `stdout` may contain only MCP JSON-RPC frames. Write all diagnostic logs to `stderr`.
- Do not print the complete configuration, headers, request body, response body, or caught error.
- The tool executor must propagate abort and timeout to the SDK and convert SDK errors into stable, redacted, and bounded MCP errors.
- Clean up listeners and timers during server shutdown. A retry timer must not prevent the process from exiting.
- A working directory supplied by the MCP host must not change contract or credential resolution semantics.

When a server disconnects immediately or reports a JSON parse error, first check whether an ordinary log, warning, or stack trace was written to `stdout`. Then check the Node.js engine, build artifacts, and environment variables. Do not disable schema or security validation first.

## Verification matrix

Cover at least:

1. No permission opt-ins: only safe read tools.
2. Destructive only: still only safe read tools.
3. Writes only: read plus non-destructive write tools.
4. Writes and destructive: destructive tools explicitly permitted by policy.
5. Secret tools are absent in every combination.
6. Startup fails without Device API configuration and does not echo the configuration in the error.
7. Malformed input is rejected before any HTTP request is sent.
8. `stdout` contains no non-JSON-RPC output and `stderr` contains no secrets.

Full verification commands:

```bash
pnpm check
pnpm public:check
```

In the delivery note, report the tool exposure diff, opt-in combinations tested, commands actually run, and unverified deployment assumptions. Do not echo real environment variable values.
