# Contract Maintenance Workflow

[English](contract-maintenance.md) | [简体中文](zh-CN/contract-maintenance.md)

## The public contract is the only generation input

| API        | Contract in this repository     | Permitted update sources                      |
| ---------- | ------------------------------- | --------------------------------------------- |
| Device API | `contracts/device.openapi.yaml` | Approved public API schemas and release notes |

The generator, SDK, and MCP metadata may read protocol information only from this in-repository contract. Fields, status codes, and behavior that do not appear in an approved public API schema or release notes must not be added by inference.

The `/v1/accounts/...` paths in the Device API contract represent provider account resources. Account management, authorization, and runtime capabilities remain in scope for this contract.

## Prerequisites

- Node.js `>=22.12.0`;
- pnpm `10.34.5`;
- the approved public API schema and release notes for the change;
- all existing worktree changes identified and preserved;
- compatibility and security owners identified for the change.

If public material is insufficient to determine a request, response, authentication rule, or side effect, pause SDK support for that operation and record the open question. Do not fill gaps with idealized behavior.

## Standard update procedure

### 1. Review the public change

Confirm each of the following:

- method, path, and a stable, unique operationId;
- path, query, header, and body parameters;
- success and error statuses, response headers, redirects, empty bodies, and content types;
- whether fields are required or optional, plus nullable, format, enum, and integer ranges;
- authentication, side effects, idempotency, secret lifecycle, and compatibility;
- additions, deprecations, and breaking changes identified in the release notes.

### 2. Update the in-repository contract

Modify only the Device API contract: `contracts/device.openapi.yaml`.

Every public operation must use a stable, unique operationId. Identify one-time secrets in both the schema description and operation policy. Model `uint64`-style IDs as strings when their safe range is not guaranteed. Model non-JSON responses, empty bodies, `3xx`, `204`, and similar responses according to the public protocol instead of forcing them into a common JSON envelope.

### 3. Validate the contract

```bash
pnpm contracts:lint
```

A successful lint run proves only that the OpenAPI structure and rules are valid. It does not prove that SDK security classifications are correct. Review authentication, side effects, retry behavior, secrets, destructive behavior, and MCP exposure for every added or changed operation.

### 4. Generate and review the diff

```bash
pnpm generate
pnpm generate:check
```

Generated output must contain stable types and operation metadata. During review, check that:

- operations are not missing, duplicated, or unintentionally renamed;
- the API Reference contains parameters, request bodies, responses, and type-checked examples for every operation;
- required and optional fields, nullable types, unions, and content types are correct;
- the generator did not omit errors or statuses;
- policy defaults are not overly permissive;
- secret operations are not exposed through MCP;
- new schemas do not introduce `any`, unsafe assertions, or JavaScript integer precision loss.

Do not edit generated files to correct the result. Fix the OpenAPI contract, policy, or generator instead.

### 5. Complete verification and documentation

Boundary verification must cover at least:

- success responses and publicly defined error responses;
- empty and non-JSON bodies;
- timeout, abort, and retry classifications;
- redirects and credential isolation;
- redaction of one-time secrets;
- JavaScript safe-integer boundaries;
- MCP visibility under the read, write, destructive, and never policies.

The generator updates both API Reference languages and the call examples together. If field descriptions or public examples are missing, add them to the approved OpenAPI contract. Do not edit `docs/api-reference/`, `docs/zh-CN/api-reference/`, or the generated example type-check fixture directly. If an operation changes architecture, security, or usage workflows, also update the README files, non-generated documentation, and skills.

### 6. Run the full quality gates

```bash
pnpm check
pnpm public:check
```

`pnpm public:check` is mandatory for every public delivery. It checks public content, contract naming, and release boundaries and cannot be skipped because `pnpm check`, a build, or type checking passed.

## New API operation checklist

Every new operation must complete all of the following:

1. **Approval source**: confirm that the corresponding public API schema and release notes are approved.
2. **Contract**: define the method, path, operationId, request, all public responses, and security requirements.
3. **Authentication**: use the contract-defined `X-Api-Key`; request parameters must not override client authentication.
4. **Side effects**: describe whether server or external provider state changes; do not infer this only from the HTTP method.
5. **Retry**: opt in only when safety is proven; unknown operations are not retried by default.
6. **Data**: review `uint64`, cursors, free-form objects, binary or streaming data, and non-JSON bodies.
7. **Secrets**: identify sensitive input, one-time output, and logging redaction requirements.
8. **MCP**: classify the operation as read, write, destructive, or never; unknown operations use never.
9. **Verification**: cover success, public errors, empty and non-JSON bodies, timeout or abort, and relevant boundaries.
10. **Documentation**: confirm that API coverage, API Reference, and examples update automatically, then maintain any affected architecture, security, usage, or skill documentation in both supported languages.

## Breaking-change review

At minimum, review the following as breaking changes:

- removing or renaming an operationId, public method, type, or export;
- adding a required parameter, narrowing a field type, or changing a success status or content type;
- changing an ID from string to number or dropping previously visible error or response metadata;
- changing default retry, redirect, or authentication-injection semantics;
- exposing more write or destructive MCP tools by default;
- changing the Node.js engine, ESM exports, or package entry points.

Adding only optional fields may still affect callers that use exhaustiveness checking and must be documented in release notes.

## Investigating drift

When `pnpm generate:check` fails:

1. Run `pnpm generate` and inspect the deterministic diff.
2. Confirm that the Node.js and pnpm versions match the lockfile.
3. Inspect the in-repository Device API contract, generator ordering, and output for timestamps or absolute paths.
4. Fix the generator or contract input. Do not commit a manual generated patch solely to make CI pass.
5. Run `pnpm generate:check`, `pnpm check`, and `pnpm public:check` again.

If an approved public API schema or release notes are temporarily unavailable, preserve the existing contract and state the uncovered risk. Do not substitute unverified material for the public protocol.
