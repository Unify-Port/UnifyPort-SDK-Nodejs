# AGENTS.md

[English](AGENTS.md) | [简体中文](AGENTS.zh-CN.md)

This file defines the rules for all automated agents and maintainers working in this repository. These rules apply to the entire repository. A nested `AGENTS.md` may add more specific restrictions, but it must not relax the security or contract boundaries defined here.

## Language and comments

- Use Simplified Chinese for collaboration by default. Keep code identifiers, commands, configuration keys, protocol fields, and error codes in their original English form.
- Public user-facing documentation uses English as the canonical and default entry. When changing such documentation, update its complete Simplified Chinese counterpart in the same change.
- Every code change must add or update a brief Chinese comment where an explanation is needed. Comments explain only why: design intent, boundaries, historical compatibility, external constraints, or risks. Do not translate the code line by line into Chinese.
- Delete or update stale comments whenever behavior changes so that comments never contradict the implementation.
- Commit messages, test names, and code blocks use English by default unless a file has a more specific existing convention.

## Repository scope and prohibitions

- This repository covers only the public Device API capabilities. Provider account resources within the Device API remain in scope.
- This is a public project. Source code, documentation, tests, generated artifacts, and release packages must not contain names, paths, repositories, branches, commits, hostnames, implementation details, or credentials from any other non-public project.
- The only protocol input for code generation is `contracts/device.openapi.yaml`.
- Repository source code, configuration, and maintenance scripts use TypeScript. Do not add `.mjs` files.
- Update the contract only from approved public API schemas and release notes. Do not infer fields or behavior from unpublished implementations.
- Do not edit files marked as generated. Update the contract, generation policy, or templates, then run `pnpm generate`.
- Keep changes minimal by default. Do not perform unrelated refactors, dependency upgrades, or releases.
- Every public delivery must run `pnpm public:check`; no other check can replace it.

## Before making changes

1. Read this file, `README.md`, and any relevant `docs/*.md` files.
2. Use `rg` to confirm the real files, operationIds, exports, and existing tests. Do not guess paths or API names from memory.
3. Inspect the worktree and preserve changes made by the user or other agents. Never overwrite unknown changes in a shared worktree.
4. If a requirement has multiple interpretations that would change the public API or security boundary, explain the differences and impact first.
5. For protocol changes, confirm that the public API schema and release notes have been approved before updating this repository's contract.

## Architectural invariants

- Keep `UnifyPortDeviceClient` as the public client. The Device API uses `X-Api-Key`; credentials must come from client configuration or the MCP startup environment and cannot be overridden by a single operation input.
- Account management, authorization, and runtime operations under `/v1/accounts/...` are provider account resources within the Device API. Do not remove them when narrowing the SDK's target scope.
- Automatic retries are allowed only for operations explicitly marked as safe. Write operations, code/password/session submissions during account authorization, and operations returning one-time secrets must not be treated as retryable based only on their HTTP method.
- Do not unconditionally convert `uint64`-style IDs to JavaScript `number`. Preserve them as strings unless their safe range is guaranteed.
- Public SDK errors preserve the HTTP status, a length-limited and allowlisted server `code`, and the request ID. Raw causes, messages, and details may echo input and must not be exposed in public errors, logs, or MCP output.
- MCP must use a per-operation allowlist. Do not add generic `raw_request` or `call_api` tools that bypass policy.
- MCP is read-only by default. Write operations require an explicit opt-in, and destructive operations require a second independent opt-in. Operations with secret input or output must never be exposed to the model.
- A stdio MCP server writes only JSON-RPC to `stdout`. Diagnostic logs go to `stderr` and must redact sensitive information.

## Contract and generation workflow

For API changes, work in this order:

1. Review the approved public API schema and release notes.
2. Update `contracts/device.openapi.yaml`.
3. Run `pnpm contracts:lint` and fix the contract instead of patching generated artifacts.
4. Update operation security policies, then run `pnpm generate`.
5. Add or update transport, error, type, MCP policy, and contract coverage tests.
6. Run `pnpm generate:check` to confirm deterministic output and no worktree drift.
7. Run `pnpm check` and `pnpm public:check`.

Every new operation must explicitly classify its authentication, side effects, retry safety, secret input/output, destructive behavior, and MCP eligibility. When safety cannot be proven, choose the stricter classification.

## Verification requirements

- Run at least the commands directly relevant to the change and list their actual results in the delivery note.
- The full project acceptance command is `pnpm check`. Public delivery must also run `pnpm public:check` separately.
- For documentation-only changes, run at least `pnpm format:check` and `pnpm public:check`. Changes involving generated content also require `pnpm generate:check`.
- If a check cannot run, state the exact reason, uncovered risk, and recommended follow-up command. Never claim an unexecuted check passed.
- Never put real API keys, account authorization codes/passwords/session payloads, webhook secrets, or one-time returned keys in fixtures, snapshots, command examples, or documentation.

## Delivery notes

Lead with the outcome, then list changed files, key boundaries, and verification commands. For changes to the public API or MCP exposure, also explain compatibility and security impact. For contract changes, identify the approved API schema or release notes version used and its impact.
