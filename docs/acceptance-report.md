# Acceptance Report

[English](acceptance-report.md) | [简体中文](zh-CN/acceptance-report.md)

- Acceptance baseline: July 28, 2026
- Release status reviewed: July 31, 2026

> This document records the pre-release acceptance baseline and the current distribution boundary. For the latest SDK version and installation instructions, see the root `README.md`.

## Conclusion

The SDK, MCP server, public skills, generation pipeline, and quality gates passed the complete local acceptance baseline. The project can continue to adopt new operations from the public API contract. A new operation is not retried or exposed through MCP until its policy has been explicitly reviewed.

`@unifyport/sdk-node` version `0.4.0` is published to npm under the MIT license. `@unifyport/mcp-server` remains `private: true`; publishing the SDK does not expand the MCP server's distribution boundary.

## Scope

- One public OpenAPI contract for the Device API;
- the `@unifyport/sdk-node` Device API client;
- the `@unifyport/mcp-server` stdio transport, tool registry, and permission policies;
- two public, reusable skills for maintaining and using the SDK;
- the TypeScript generator, contract linting, tests, type checking, builds, package validation, and CI workflow;
- public-information boundary scans of both the source tree and the actual npm tarball.

## Coverage

| Item                                   |    Result |
| -------------------------------------- | --------: |
| Public operations                      |        64 |
| Explicit SDK methods                   |        64 |
| Device API operations                  |        64 |
| Explicit MCP allowlist                 |         4 |
| MCP excluded by default or permanently |        60 |
| Automated tests                        | 39 passed |

See [API coverage](api-coverage.md) for the complete operation mapping.

## Key Boundaries

- Project source, configuration, and maintenance scripts use TypeScript and do not include `.mjs` files.
- The Device API key can only be supplied through client configuration; an individual operation cannot override authentication fields.
- The base URL requires HTTPS by default, and credentials remain within the configured origin and path boundary.
- Timeouts cover the credential provider, HTTP request, and complete response stream; timers and response bodies have safe limits.
- Automatic retry uses an explicit allowlist, and a new operation is not retried by default.
- Integer tokens outside JavaScript's safe range remain strings, including tokens written in decimal or scientific notation.
- Public errors do not retain the raw `Response`, headers, body, cause, complete query string, or unfiltered diagnostics.
- MCP input schemas recursively reject extra fields and share one schema across AJV validation and pre-execution projection.
- MCP is read-only by default. Write and destructive operations require separate explicit permissions, and secret operations are never exposed.
- Passwords, verification codes, and session payloads used by Device API account authorization remain sensitive SDK inputs and are not exposed through MCP.
- `Account.provider_profile` and `SendMessageResult.reply_token` remain sensitive SDK outputs: they stay outside MCP, complete containing responses are not logged, and callers pass opaque reply handles back unchanged.
- The cursor helper enforces a page limit, detects repeated cursors, and handles abort races with pending fetches.

## Verification Record

The `0.4.0` release gate was run with Node.js 22.12.0 and pnpm 10.34.5:

| Command or gate       | Result                                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| `pnpm public:check`   | Passed; scanned 102 project files                                                |
| `pnpm contracts:lint` | Device API contract passed Redocly validation                                    |
| `pnpm generate:check` | Generated artifacts were reproducible and had no drift                           |
| `pnpm lint`           | ESLint passed                                                                    |
| `pnpm format:check`   | Prettier passed                                                                  |
| `pnpm test`           | 39/39 passed                                                                     |
| Statement coverage    | 93.67%                                                                           |
| Branch coverage       | 85.15%                                                                           |
| Function coverage     | 97.89%                                                                           |
| Line coverage         | 96.59%                                                                           |
| `pnpm typecheck`      | Strict type checks passed for tooling, the SDK, and MCP                          |
| `pnpm build`          | Clean builds passed for both packages                                            |
| `pnpm package:check`  | `publint`, type entry points, and public-boundary scans passed for both tarballs |
| `pnpm check`          | The complete quality gate passed                                                 |

The published `0.4.0` package was also installed from the public registry in a new temporary project. It passed strict TypeScript compilation for the typed `ProviderProfile`, provider-specific extension fields, and optional `SendMessageResult.reply_token`, plus a runtime import check for the public client export.

The current CI matrix runs `pnpm check` on Node.js 22.12.0 and 24.x. The repository pins pnpm 10.34.5 so that the quality gates can run on the declared minimum Node.js version; both matrix entries passed after this alignment.

## External Verification Status

- No automated test uses a production credential or calls the production API; injected `fetch` implementations cover protocol, security, and error boundaries.
- `@unifyport/sdk-node@0.4.0` has been published to npm, selected by the npm `latest` dist-tag, and tagged as `v0.4.0` in Git at release commit `03d9b37`.
- The public registry shasum matched the pre-publication dry run, and a clean install resolved exactly `0.4.0`.
- The clean installation passed TypeScript `5.9.3` compilation and runtime import checks without calling a production API or using a production credential.
- `@unifyport/mcp-server` has not been published and remains private.

These boundaries should be reviewed again for each release, together with the current CI result and npm package contents.
