# UnifyPort Node.js SDK

[English](README.md) | [简体中文](README.zh-CN.md)

The UnifyPort SDK workspace for Node.js and TypeScript. It provides a type-safe SDK, a least-privilege
stdio MCP server, and public skills that automation agents can reuse.

`@unifyport/sdk-node` is licensed under MIT and published publicly on npm. `@unifyport/mcp-server`
remains `private: true` and is not published to a registry until a separate MCP release policy is
defined.

## Capabilities and boundaries

| Asset                   | Purpose                                             | Key boundary                                |
| ----------------------- | --------------------------------------------------- | ------------------------------------------- |
| `@unifyport/sdk-node`   | Device API types, client, and transport error model | Authentication is always `X-Api-Key`        |
| `@unifyport/mcp-server` | Exposes policy-approved SDK operations as MCP tools | Read-only by default; no raw request tool   |
| `contracts/`            | Stores the approved public OpenAPI contract         | The only protocol input for code generation |
| `skills/`               | Maintains public SDK and MCP agent workflows        | Does not replace the contract or validation |

The SDK does not infer request formats, authentication methods, or security semantics for capabilities
that are absent from the public contract.

## Device API client

- `UnifyPortDeviceClient` calls the Device API with `X-Api-Key`.
- The API key is read only from the client configuration and cannot be overridden by an individual
  operation input.

The Device API routes under `/v1/accounts/...` represent provider account resources. They cover account
management, authorization, and runtime capabilities, all through the same `UnifyPortDeviceClient`.

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.34.5`

Install dependencies from the repository root:

```bash
pnpm install --frozen-lockfile
```

## SDK quick start

Install the SDK from npm:

```bash
npm install @unifyport/sdk-node
```

See the [SDK guide](packages/sdk/README.md) for complete client configuration, operation parameters,
pagination, and error handling examples. See the
[Device API Reference](docs/api-reference/README.md) for per-operation parameter tables, response
fields, and TypeScript examples.

Then import the client from the package root:

```ts
import { UnifyPortDeviceClient } from "@unifyport/sdk-node";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Read credentials only from the runtime environment so they never enter source or build artifacts.
const device = new UnifyPortDeviceClient({
  baseUrl: requiredEnv("UNIFYPORT_DEVICE_API_BASE_URL"),
  apiKey: requiredEnv("UNIFYPORT_DEVICE_API_KEY")
});

// Keep method names aligned with OpenAPI operationId values to avoid a second naming layer.
const workspace = await device.getWorkspace();
```

Operation methods are generated from OpenAPI `operationId` values in this repository. Every method uses
the `(request?, execution?)` signature: `request` is required when the operation has a required path or
body, while `execution` can override `timeoutMs`, `retry`, and `signal` for that call. Treat the package
exports and public contract as authoritative for request parameters, response types, and current
coverage; do not construct paths or authentication headers manually.

Use `maxResponseBytes` to tighten the shared limit applied to the wire body and the JSON produced after
integer normalization. The default limit protects the Node.js process from unusually large responses
and compact exponent notation that expands dramatically. Repository source, configuration, and
maintenance scripts use TypeScript; `.mjs` files are not accepted.

HTTPS is required by default. A development environment that genuinely needs loopback HTTP must opt in
explicitly through the client configuration. Do not enable this exception in production.

## ClawHub SDK skill

`skills/unifyport-node-sdk` is the only ClawHub publication candidate in this repository. It is a
development and integration guide for the public npm SDK; it does not bundle the SDK runtime, install
the MCP server, expose Device API operations as OpenClaw tools, or contain credentials.

The ClawHub release belongs to the authenticated GitHub user account `@unifyport` and uses MIT-0 as
required by ClawHub. Skill versions are independent from npm SDK versions. `skills/unifyport-mcp` remains
repository-local while `@unifyport/mcp-server` is private. See
[Publishing the SDK Skill to ClawHub](docs/clawhub-publishing.md) for the exact boundary, dry-run,
manual release, and post-release verification process.

## MCP quick start

Build the workspace first:

```bash
pnpm build
```

Then start the stdio server from an MCP host:

```bash
UNIFYPORT_DEVICE_API_BASE_URL="https://device.example.com" \
UNIFYPORT_DEVICE_API_KEY="<secret>" \
node packages/mcp/dist/cli.js
```

Connection and permission settings:

| Environment variable               | Meaning                                                            | Default        |
| ---------------------------------- | ------------------------------------------------------------------ | -------------- |
| `UNIFYPORT_DEVICE_API_BASE_URL`    | Device API base URL                                                | Not configured |
| `UNIFYPORT_DEVICE_API_KEY`         | Value sent as `X-Api-Key`                                          | Not configured |
| `UNIFYPORT_MCP_ENABLE_WRITES`      | Exposes approved non-destructive write tools only when `true`      | `false`        |
| `UNIFYPORT_MCP_ENABLE_DESTRUCTIVE` | Exposes approved destructive tools when this and writes are `true` | `false`        |
| `UNIFYPORT_ALLOW_INSECURE_HTTP`    | Allows the local HTTP exception only when explicitly `true`        | `false`        |

The MCP server is read-only by default. Operations with secret inputs, one-time secret outputs, or no
explicit classification are never exposed, even when the write and destructive switches are both
enabled. The base URL and API key can be provided only through the process startup environment; they are
not tool inputs. For stdio, `stdout` is reserved for JSON-RPC, so deployment scripts must send ordinary
logs to `stderr`.

## Maintaining the public contract

Code generation reads exactly one public contract from this repository:

- `contracts/device.openapi.yaml`

Contract changes must be based on approved public API schemas and release notes. Do not add protocol
details based on unpublished implementations or observations. After changing the contract, run:

```bash
pnpm contracts:lint
pnpm generate
pnpm generate:check
pnpm docs:check
pnpm public:check
```

Never edit generated files directly. Update the contract, operation policy, or generator and regenerate
instead. See [Maintaining the public contract](docs/contract-maintenance.md) for the complete workflow.

## Commands

Run all commands from the root `package.json`:

| Command               | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| `pnpm build`          | Builds packages in workspace order                      |
| `pnpm clawhub:check`  | Checks the SDK Skill metadata and publication boundary  |
| `pnpm clean`          | Removes coverage and package build artifacts            |
| `pnpm check`          | Runs the complete engineering quality gate              |
| `pnpm public:check`   | Checks public repository content and release boundaries |
| `pnpm contracts:lint` | Lints the Device OpenAPI contract with Redocly          |
| `pnpm docs:check`     | Checks API Reference coverage and documentation links   |
| `pnpm generate`       | Generates types and operation assets from the contract  |
| `pnpm generate:check` | Verifies generated files are reproducible and current   |
| `pnpm lint`           | Runs ESLint                                             |
| `pnpm format:check`   | Checks formatting without modifying files               |
| `pnpm test`           | Runs Vitest with coverage                               |
| `pnpm typecheck`      | Type-checks every package without emitting files        |
| `pnpm package:check`  | Validates tarballs, exports, and declaration files      |

Run the complete project validation with:

```bash
pnpm check
pnpm public:check
```

`pnpm public:check` is an independent, mandatory gate for public delivery. Do not skip it even when
`pnpm check` passes.

Both `pnpm lint` and `pnpm test` perform a clean SDK build first. MCP source, tests, and CLI subprocesses
resolve the SDK through its real package exports so a fresh checkout never depends on a stale local
`dist`.

## Repository structure

```text
unifyport-sdk-node/
├── contracts/              # Approved public OpenAPI contract
├── docs/                   # Architecture, security, and contract maintenance guides
├── packages/
│   ├── sdk/                # @unifyport/sdk-node
│   └── mcp/                # @unifyport/mcp-server
├── scripts/                # Generation and quality checks
├── skills/
│   ├── unifyport-node-sdk/ # SDK maintenance and usage skill
│   └── unifyport-mcp/      # MCP configuration and security skill
└── AGENTS.md               # Repository collaboration rules
```

## Design and security documentation

- [Device API Reference](docs/api-reference/README.md)
- [Architecture](docs/architecture.md)
- [Security boundaries](docs/security.md)
- [Contract maintenance](docs/contract-maintenance.md)
- [ClawHub publishing](docs/clawhub-publishing.md)
- [Acceptance report](docs/acceptance-report.md)
- [SDK skill](skills/unifyport-node-sdk/SKILL.md)
- [MCP skill](skills/unifyport-mcp/SKILL.md)

Before adding an API, classify its authentication, side effects, retry behavior, secret handling,
destructive behavior, JavaScript `uint64` handling, and MCP exposure. When safety cannot be demonstrated,
the SDK does not retry automatically and the MCP server defaults to not exposing the operation.
