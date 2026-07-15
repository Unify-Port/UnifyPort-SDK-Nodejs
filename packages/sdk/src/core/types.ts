import type { SuccessResponseJSON } from "openapi-typescript-helpers";

export type MaybePromise<T> = T | Promise<T>;
export type SecretProvider = () => MaybePromise<string | undefined>;
export type SecretSource = string | SecretProvider;
export type UnifyPortFetch = (request: Request) => Promise<Response>;

export interface RetryConfig {
  /** 首次请求之后最多重试的次数；仅对 operation policy 标记为 safe 的请求生效。 */
  readonly maxRetries?: number;
  /** full-jitter 指数退避的初始上界。 */
  readonly baseDelayMs?: number;
  /** Retry-After 与指数退避都不会超过该值。 */
  readonly maxDelayMs?: number;
}

interface BaseClientConfig {
  readonly baseUrl: string;
  readonly fetch?: UnifyPortFetch;
  readonly timeoutMs?: number;
  /** 响应体在解析前的字节上限，避免异常上游耗尽 Node.js 进程内存。 */
  readonly maxResponseBytes?: number;
  readonly retry?: RetryConfig;
  /** 明文 HTTP 只允许 loopback，且必须显式打开，防止 credential 被误发到远端。 */
  readonly allowInsecureHttp?: boolean;
}

export interface DeviceClientConfig extends BaseClientConfig {
  readonly apiKey: SecretSource;
}

export interface RequestExecutionOptions {
  readonly timeoutMs?: number;
  /** 单次调用只能关闭重试或收紧次数，不能让非幂等 operation 获得重试能力。 */
  readonly retry?: false | Readonly<Pick<RetryConfig, "maxRetries">>;
  readonly signal?: AbortSignal;
}

// SDK 只覆盖 Device API；这里收窄后可在编译期阻止其他服务重新混入公共 metadata。
export type ApiName = "device";
export type OperationMutability = "read" | "write" | "destructive";
export type McpExposure = OperationMutability | "never";

export interface OperationMetadata {
  readonly api: ApiName;
  readonly operationId: string;
  readonly method: string;
  readonly path: string;
  readonly tag: string;
  readonly summary: string;
  readonly description: string;
  readonly authRequired: boolean;
  readonly toolName: string;
  readonly mutability: OperationMutability;
  readonly retryable: boolean;
  readonly secretInput: boolean;
  readonly secretOutput: boolean;
  readonly mcpExposure: McpExposure;
  readonly inputSchema: Readonly<Record<string, unknown>>;
  readonly outputSchema: Readonly<Record<string, unknown>>;
}

type JsonSuccess<TOperation> =
  TOperation extends Record<string | number, unknown> ? SuccessResponseJSON<TOperation> : never;

export type JsonSafe<T> = T extends number
  ? number | string
  : T extends (infer TItem)[]
    ? JsonSafe<TItem>[]
    : T extends object
      ? { [TKey in keyof T]: JsonSafe<T[TKey]> }
      : T;

/** 204 等无 content operation 统一建模为 undefined，避免调用方被迫处理 never。 */
export type OperationData<TOperation> = [JsonSuccess<TOperation>] extends [never]
  ? undefined
  : JsonSafe<JsonSuccess<TOperation>>;

export interface ApiResult<T> {
  readonly data: T;
  readonly response: Response;
  readonly status: number;
  readonly requestId?: string;
}

export type OpenApiFetchOutcome<T> =
  | { readonly data: T; readonly error?: never; readonly response: Response }
  | { readonly data?: never; readonly error: unknown; readonly response: Response };

export interface ApiRuntime {
  readonly baseUrl: string;
  readonly rawFetch: UnifyPortFetch;
  readonly createFetch: (
    operation: OperationMetadata,
    execution: RequestExecutionOptions
  ) => UnifyPortFetch;
  readonly execute: <T>(
    operation: OperationMetadata,
    request: () => Promise<OpenApiFetchOutcome<string | undefined>>
  ) => Promise<ApiResult<T>>;
}
