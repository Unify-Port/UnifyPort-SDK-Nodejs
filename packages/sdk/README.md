# `@unifyport/sdk-node`

[English](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/sdk/README.md) | [简体中文](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/packages/sdk/README.zh-CN.md) | [Website](https://www.unifyport.ai)

The UnifyPort Device API SDK for Node.js and TypeScript. It provides the type-safe
`UnifyPortDeviceClient`, consistent success response and error models, timeouts, safe retries,
cancellation, and cursor pagination.

The SDK uses a fixed `X-Api-Key` authentication boundary. Operations under `/v1/accounts/...` belong to
the Device API and are all available through `UnifyPortDeviceClient`.

## Features

Every operation in the current public contract has a same-named SDK method. Major areas include:

- workspace and provider region queries;
- provider account resources, authorization flows, and runtime status;
- conversations, contacts, and groups;
- message sending and message actions;
- API key and webhook endpoint management.

Method names match their OpenAPI `operationId` values. See the
[API Reference](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/api-reference/README.md)
for each operation's parameters, request body, response fields, and TypeScript example. See
[API coverage](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/api-coverage.md) for
HTTP paths, retry behavior, and MCP policies.

## Requirements

- Node.js `>=22.12.0`
- A TypeScript project or a Node.js project with ESM support

This package provides only ESM `import` exports and TypeScript declarations. It does not provide a
CommonJS `require()` entry point.

## Installation

```bash
npm install @unifyport/sdk-node
```

Or with pnpm:

```bash
pnpm add @unifyport/sdk-node
```

## Quick start

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

const result = await device.getWorkspace();

console.log(result.data.data.name);
console.log(result.status, result.requestId);
```

`ApiResult.data` contains the complete API JSON envelope, so resource data is usually available at
`result.data.data`.

## Client configuration

```ts
const device = new UnifyPortDeviceClient({
  baseUrl: "https://device.example.com",
  apiKey: () => requiredEnv("UNIFYPORT_DEVICE_API_KEY"),
  timeoutMs: 15_000,
  maxResponseBytes: 4 * 1024 * 1024,
  retry: {
    maxRetries: 2,
    baseDelayMs: 200,
    maxDelayMs: 5_000
  }
});
```

| Option              | Required | Description                                                                      |
| ------------------- | -------- | -------------------------------------------------------------------------------- |
| `baseUrl`           | Yes      | Absolute Device API URL; remote URLs must use HTTPS                              |
| `apiKey`            | Yes      | A string or a synchronous/asynchronous provider that returns a string            |
| `fetch`             | No       | Custom `fetch` implementation with `(request: Request) => Promise<Response>`     |
| `timeoutMs`         | No       | Defaults to `30000`; total timeout for each operation                            |
| `maxResponseBytes`  | No       | Defaults to 8 MiB, maximum 64 MiB; limits both wire body and normalized JSON     |
| `retry`             | No       | Retry count and full-jitter backoff settings for safe operations                 |
| `allowInsecureHttp` | No       | Defaults to `false`; allows only explicitly enabled loopback HTTP in development |

`baseUrl` must not contain a username, password, query, or fragment. The client injects the API key
centrally, and an individual operation cannot override the authentication header.

## Calling operations

Every method uses `(request?, execution?)`:

- Omit `request` for operations without parameters.
- Put path and query parameters in `request.params`.
- Put a JSON request body in `request.body`.
- Put per-call timeout, tighter retry settings, and the cancellation signal in `execution`.

### No-parameter reads

```ts
const workspace = await device.getWorkspace();
console.log(workspace.data.data);

const accounts = await device.listAccounts();
for (const account of accounts.data.data) {
  console.log(account.id, account.provider, account.status);
}
```

### Path parameters

```ts
const regions = await device.listProviderRegions({
  params: {
    path: { provider: "whatsapp" }
  }
});

for (const region of regions.data.data.regions) {
  console.log(region.region, region.supported, region.allocatable);
}
```

### Path and query parameters

```ts
const contacts = await device.listContacts({
  params: {
    path: { account_id: "acc_xxx" },
    query: { limit: 100, q: "Alice" }
  }
});

console.log(contacts.data.data.items);
console.log(contacts.data.data.next_cursor);
```

### JSON request body

```ts
const message = await device.sendMessage({
  body: {
    account_id: "acc_xxx",
    to: { id: "recipient_xxx", type: "user" },
    message: { type: "text", text: "Hello from UnifyPort" }
  }
});

console.log(message.data.data.message_id, message.data.data.status);
```

A write operation does not become retryable because of its HTTP method or caller configuration. Do not
write sensitive inputs such as message bodies to logs.

## Successful responses

Every operation returns `ApiResult<T>`:

| Field       | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `data`      | Complete API JSON envelope parsed according to the public contract        |
| `status`    | HTTP status                                                               |
| `requestId` | Optional server request ID                                                |
| `response`  | Underlying `Response` for headers and other successful transport metadata |

The SDK has already parsed the `response` body; do not depend on reading it again. Use the typed `data`
for application data.

## Timeouts, cancellation, and retries

```ts
const controller = new AbortController();

const workspace = await device.getWorkspace(
  {},
  {
    timeoutMs: 5_000,
    retry: { maxRetries: 1 },
    signal: controller.signal
  }
);
```

A per-call `execution.retry` setting can only disable or tighten client-level retries:

```ts
await device.getWorkspace({}, { retry: false });
await device.getWorkspace({}, { retry: { maxRetries: 0 } });
```

Automatic retries apply only to safe operations explicitly allowed by policy. They handle network
failures and temporary statuses such as `408`, `429`, `502`, `503`, and `504`, and honor a valid
`Retry-After` value. Ordinary writes, account authorization submissions, and one-time secret operations
are not retried automatically.

## Cursor pagination

`paginateCursor` iterates page items and supports a maximum page count, repeated cursor detection, and
`AbortSignal`:

```ts
import { paginateCursor } from "@unifyport/sdk-node";

const accountId = "acc_xxx";
const controller = new AbortController();

for await (const contact of paginateCursor(
  async (cursor, pageSignal) => {
    // With exactOptionalPropertyTypes, do not assign undefined to an optional query field.
    const query = cursor === undefined ? { limit: 100 } : { cursor, limit: 100 };
    const result = await device.listContacts(
      {
        params: {
          path: { account_id: accountId },
          query
        }
      },
      pageSignal === undefined ? {} : { signal: pageSignal }
    );
    return result.data.data;
  },
  { maxPages: 100, signal: controller.signal }
)) {
  console.log(contact.id, contact.display_name);
}
```

The pagination helper reads at most 10,000 pages by default. Application code should normally set a
smaller `maxPages` value appropriate to its workload.

## Error handling

All public errors extend `UnifyPortError`. Record only reviewed fields such as `status`, `code`,
`requestId`, `api`, and `operationId`. Do not serialize complete errors, requests, responses, or
headers.

```ts
import { UnifyPortAbortError, UnifyPortApiError, UnifyPortTimeoutError } from "@unifyport/sdk-node";

try {
  await device.getWorkspace();
} catch (error) {
  if (error instanceof UnifyPortApiError) {
    console.error({
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      operationId: error.operationId
    });
  } else if (error instanceof UnifyPortTimeoutError) {
    console.error({ timeoutMs: error.timeoutMs, operationId: error.operationId });
  } else if (error instanceof UnifyPortAbortError) {
    console.error({ aborted: true, operationId: error.operationId });
  } else {
    throw error;
  }
}
```

| Error type                    | Scenario                                                              |
| ----------------------------- | --------------------------------------------------------------------- |
| `UnifyPortConfigurationError` | Invalid client configuration                                          |
| `UnifyPortNetworkError`       | Network or custom credential provider failure                         |
| `UnifyPortTimeoutError`       | Operation timeout                                                     |
| `UnifyPortAbortError`         | Caller cancellation through `AbortSignal`                             |
| `UnifyPortApiError`           | API returned a non-success HTTP status                                |
| `UnifyPortResponseParseError` | Successful response could not be parsed safely                        |
| `UnifyPortPaginationError`    | Missing/repeated cursor, page limit exceeded, or pagination cancelled |

## TypeScript types

The package root also exports the public contract types:

```ts
import type { DeviceApiComponents, DeviceApiOperations, DeviceApiPaths } from "@unifyport/sdk-node";

type Workspace = DeviceApiComponents["schemas"]["Workspace"];
type SendMessageOperation = DeviceApiOperations["sendMessage"];
type DevicePaths = DeviceApiPaths;
```

To avoid JavaScript precision loss, the SDK preserves integers outside the safe range as strings.
Fields modeled like `uint64` or `int64` may therefore be `number | string`. Do not call `Number(...)`
unconditionally unless the value's range is guaranteed.

## Security considerations

- Provide the API key through a secret manager or runtime environment; never hard-code or commit it.
- Require HTTPS in production. `allowInsecureHttp` accepts only explicitly enabled loopback addresses.
- Do not log authentication headers, authorization codes/passwords/sessions, message bodies, or
  one-time secrets.
- Do not override `baseUrl` dynamically from external input. The client confines credentials to the
  origin and path established during initialization.
- Design application-level idempotency and failure recovery for writes. Do not apply read-operation
  retry assumptions to writes.

For more detail, see the
[security boundaries](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/docs/security.md).

## Project and license

- [GitHub repository](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs)
- [Project README](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs#readme)
- [MIT License](https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/LICENSE)
