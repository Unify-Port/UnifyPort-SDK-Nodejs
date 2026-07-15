import {
  UnifyPortAbortError,
  UnifyPortApiError,
  UnifyPortConfigurationError,
  UnifyPortError,
  UnifyPortNetworkError,
  UnifyPortResponseParseError,
  UnifyPortTimeoutError
} from "./errors.js";
import type {
  ApiResult,
  ApiRuntime,
  DeviceClientConfig,
  OpenApiFetchOutcome,
  OperationMetadata,
  RequestExecutionOptions,
  RetryConfig,
  SecretSource,
  UnifyPortFetch
} from "./types.js";

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BASE_DELAY_MS = 200;
const DEFAULT_MAX_DELAY_MS = 5_000;
const DEFAULT_MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 64 * 1024 * 1024;
const MAX_CANONICAL_INTEGER_DIGITS = 1024;
const MAX_RETRIES = 10;
const MAX_TIMER_MS = 2_147_483_647;
const RETRYABLE_STATUSES = new Set([408, 429, 502, 503, 504]);

interface NormalizedRetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

interface RuntimeConfig {
  readonly baseUrl: string;
  readonly fetch: UnifyPortFetch;
  readonly timeoutMs: number;
  readonly maxResponseBytes: number;
  readonly retry: NormalizedRetryConfig;
  readonly injectCredential: (request: Request) => Promise<Request>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertPositiveInteger(value: number, name: string, allowZero = false): number {
  const valid = Number.isInteger(value) && (allowZero ? value >= 0 : value > 0);
  if (!valid) {
    throw new UnifyPortConfigurationError(`${name} 必须是${allowZero ? "非负" : "正"}整数`);
  }
  return value;
}

function assertTimerMilliseconds(value: number, name: string): number {
  const normalized = assertPositiveInteger(value, name);
  if (normalized > MAX_TIMER_MS) {
    // Node 会把超出 32-bit timer 上限的值压缩到约 1ms，必须在进入 setTimeout 前拒绝。
    throw new UnifyPortConfigurationError(`${name} 不能超过 ${String(MAX_TIMER_MS)}`);
  }
  return normalized;
}

function normalizeRetry(config: RetryConfig | undefined): NormalizedRetryConfig {
  const maxRetries = assertPositiveInteger(
    config?.maxRetries ?? DEFAULT_MAX_RETRIES,
    "retry.maxRetries",
    true
  );
  if (maxRetries > MAX_RETRIES) {
    throw new UnifyPortConfigurationError(`retry.maxRetries 不能超过 ${String(MAX_RETRIES)}`);
  }
  return {
    maxRetries,
    baseDelayMs: assertTimerMilliseconds(
      config?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS,
      "retry.baseDelayMs"
    ),
    maxDelayMs: assertTimerMilliseconds(
      config?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS,
      "retry.maxDelayMs"
    )
  };
}

function normalizeMaxResponseBytes(value: number | undefined): number {
  const normalized = assertPositiveInteger(value ?? DEFAULT_MAX_RESPONSE_BYTES, "maxResponseBytes");
  if (normalized > MAX_RESPONSE_BYTES) {
    throw new UnifyPortConfigurationError(
      `maxResponseBytes 不能超过 ${String(MAX_RESPONSE_BYTES)}`
    );
  }
  return normalized;
}

function isLoopback(hostname: string): boolean {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (normalized === "localhost" || normalized === "::1") return true;
  const octets = normalized.split(".").map(Number);
  return octets.length === 4 && octets[0] === 127 && octets.every(Number.isInteger);
}

function normalizeBaseUrl(value: string, allowInsecureHttp: boolean): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // URL parser 的原始异常可能包含完整输入，因此配置错误只返回稳定说明。
    throw new UnifyPortConfigurationError("baseUrl 必须是绝对 URL");
  }
  if (url.username !== "" || url.password !== "") {
    throw new UnifyPortConfigurationError("baseUrl 不能包含 username 或 password");
  }
  if (url.search !== "" || url.hash !== "") {
    throw new UnifyPortConfigurationError("baseUrl 不能包含 query 或 fragment");
  }
  if (url.protocol !== "https:") {
    const allowedLoopback =
      url.protocol === "http:" && allowInsecureHttp && isLoopback(url.hostname);
    if (!allowedLoopback) {
      throw new UnifyPortConfigurationError(
        "baseUrl 默认必须使用 HTTPS；loopback HTTP 需要 allowInsecureHttp: true"
      );
    }
  }
  return url.toString().replace(/\/$/, "");
}

async function resolveSecret(source: SecretSource, name: string): Promise<string> {
  const value = typeof source === "function" ? await source() : source;
  if (value === undefined || value.trim() === "") {
    throw new UnifyPortConfigurationError(`${name} 不能为空`);
  }
  // CRLF 会改变 header 边界，因此在进入 fetch 前拒绝而不是尝试转义。
  if (/[\r\n]/.test(value)) {
    throw new UnifyPortConfigurationError(`${name} 包含不允许的 header 字符`);
  }
  return value;
}

function targetIsInsideBase(requestUrl: URL, baseUrl: URL): boolean {
  if (requestUrl.origin !== baseUrl.origin) return false;
  const prefix = baseUrl.pathname.replace(/\/$/, "");
  return prefix === "" || prefix === "/" || requestUrl.pathname.startsWith(`${prefix}/`);
}

function ensureSafeTarget(request: Request, baseUrl: string): void {
  const requestUrl = new URL(request.url);
  const expected = new URL(baseUrl);
  if (!targetIsInsideBase(requestUrl, expected)) {
    throw new UnifyPortConfigurationError(
      `拒绝向配置 baseUrl 之外发送 credential: ${requestUrl.origin}${requestUrl.pathname}`
    );
  }
}

function effectiveRetries(
  operation: OperationMetadata,
  configured: NormalizedRetryConfig,
  execution: RequestExecutionOptions
): number {
  if (!operation.retryable || execution.retry === false) return 0;
  const requested = execution.retry?.maxRetries;
  if (requested === undefined) return configured.maxRetries;
  const normalized = assertPositiveInteger(requested, "execution.retry.maxRetries", true);
  // 单次 operation 只允许收紧全局预算，避免调用点意外制造重试风暴。
  return Math.min(normalized, configured.maxRetries);
}

function parseRetryAfter(value: string | null, now = Date.now()): number | undefined {
  if (value === null) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - now);
}

function retryDelay(
  response: Response | undefined,
  attempt: number,
  retry: NormalizedRetryConfig
): number {
  const exponentialCap = Math.min(retry.maxDelayMs, retry.baseDelayMs * 2 ** attempt);
  const jitter = Math.random() * exponentialCap;
  const retryAfter = parseRetryAfter(response?.headers.get("retry-after") ?? null);
  return Math.min(retry.maxDelayMs, Math.max(jitter, retryAfter ?? 0));
}

function abortReason(): DOMException {
  return new DOMException("The operation was aborted", "AbortError");
}

async function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) throw abortReason();
  let onAbort: (() => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    onAbort = (): void => {
      reject(abortReason());
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    // custom fetch/credential provider 不一定主动监听 signal；竞速保证调用方仍能按时返回。
    return await Promise.race([promise, aborted]);
  } finally {
    if (onAbort !== undefined) signal.removeEventListener("abort", onAbort);
  }
}

function safeRequestUrl(value: string): string {
  const url = new URL(value);
  // query/fragment 可能携带敏感输入，公开错误对象只保留定位 endpoint 所需部分。
  return `${url.origin}${url.pathname}`;
}

async function bufferedResponse(
  response: Response,
  signal: AbortSignal,
  maximumBytes: number,
  operation: OperationMetadata
): Promise<Response> {
  if (response.body === null) {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await abortable(reader.read(), signal);
      if (done) break;
      length += value.byteLength;
      if (length > maximumBytes) {
        const requestId = requestIdFrom(undefined, response);
        throw new UnifyPortResponseParseError(
          `UnifyPort 响应体超过 ${String(maximumBytes)} bytes`,
          {
            api: operation.api,
            operationId: operation.operationId,
            status: response.status,
            ...(requestId === undefined ? {} : { requestId })
          }
        );
      }
      chunks.push(value);
    }
  } catch (error) {
    // 读取失败后取消源 stream，避免连接继续接收不会再被消费的数据。
    void reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  // 重建 Response 会有意移除原始 URL，避免敏感 query 通过 response.url 泄漏。
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

/** @internal 仅供同仓库验证 retry listener 生命周期；package exports 不公开 runtime 子路径。 */
export async function waitForRetryDelay(milliseconds: number, signal: AbortSignal): Promise<void> {
  if (milliseconds <= 0) return;
  await new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortReason());
      return;
    }
    const cleanup = (): void => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    };
    const onAbort = (): void => {
      cleanup();
      reject(abortReason());
    };
    const timer = setTimeout(() => {
      // 正常 backoff 完成也要移除 listener，避免组合 signal 持有已结束请求的闭包。
      cleanup();
      resolve();
    }, milliseconds);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function createTransport(runtime: RuntimeConfig): ApiRuntime["createFetch"] {
  return (operation: OperationMetadata, execution: RequestExecutionOptions): UnifyPortFetch => {
    return async (request: Request): Promise<Response> => {
      ensureSafeTarget(request, runtime.baseUrl);
      const requestUrl = safeRequestUrl(request.url);
      const timeoutMs = assertTimerMilliseconds(
        execution.timeoutMs ?? runtime.timeoutMs,
        "execution.timeoutMs"
      );
      const timeoutController = new AbortController();
      const timer = setTimeout(() => {
        timeoutController.abort();
      }, timeoutMs);
      const signals = [request.signal, timeoutController.signal];
      if (execution.signal !== undefined) signals.push(execution.signal);
      const signal = AbortSignal.any(signals);

      try {
        const credentialRequest = await abortable(runtime.injectCredential(request), signal);
        const prepared = new Request(credentialRequest, {
          // SDK 不承载浏览器跳转流程，任何 redirect 都交给调用方显式处理。
          redirect: "error",
          signal
        });
        const maxRetries = effectiveRetries(operation, runtime.retry, execution);

        for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
          try {
            const response = await abortable(runtime.fetch(prepared.clone()), signal);
            if (!RETRYABLE_STATUSES.has(response.status) || attempt === maxRetries) {
              // 在 transport 内读完 body，让 timeout 覆盖 headers 到完整 body 的整个周期。
              return await bufferedResponse(response, signal, runtime.maxResponseBytes, operation);
            }
            // 放弃的响应体必须主动取消，避免 keep-alive 连接和 stream 长时间占用资源。
            if (response.body !== null) await abortable(response.body.cancel(), signal);
            await waitForRetryDelay(retryDelay(response, attempt, runtime.retry), signal);
          } catch (error) {
            if (error instanceof UnifyPortError) throw error;
            if (isAbort(error) || signal.aborted) throw error;
            if (attempt === maxRetries) {
              if (maxRetries === 0) throw error;
              break;
            }
            await waitForRetryDelay(retryDelay(undefined, attempt, runtime.retry), signal);
          }
        }

        throw new UnifyPortNetworkError("UnifyPort 请求在重试后仍失败", {
          api: operation.api,
          operationId: operation.operationId,
          url: requestUrl
        });
      } catch (error) {
        if (error instanceof UnifyPortError) throw error;
        if (timeoutController.signal.aborted) {
          throw new UnifyPortTimeoutError(`UnifyPort 请求超过 ${String(timeoutMs)}ms`, {
            api: operation.api,
            operationId: operation.operationId,
            url: requestUrl,
            timeoutMs
          });
        }
        if (signal.aborted || isAbort(error)) {
          throw new UnifyPortAbortError("UnifyPort 请求已取消", {
            api: operation.api,
            operationId: operation.operationId,
            url: requestUrl
          });
        }
        throw new UnifyPortNetworkError("UnifyPort 网络请求失败", {
          api: operation.api,
          operationId: operation.operationId,
          url: requestUrl
        });
      } finally {
        clearTimeout(timer);
      }
    };
  };
}

function readDiagnostic(
  record: Record<string, unknown>,
  key: string,
  maximumLength: number
): string | undefined {
  const value = record[key];
  return typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximumLength &&
    /^[A-Za-z0-9_.:/-]+$/u.test(value)
    ? value
    : undefined;
}

function requestIdFrom(value: unknown, response: Response): string | undefined {
  if (isRecord(value)) {
    const requestId =
      readDiagnostic(value, "request_id", 128) ?? readDiagnostic(value, "requestId", 128);
    if (requestId !== undefined) return requestId;
  }
  const header = response.headers.get("x-request-id");
  if (header === null) return undefined;
  return header.length <= 128 && /^[A-Za-z0-9_.:/-]+$/u.test(header) ? header : undefined;
}

interface ParsedErrorPayload {
  readonly code: string;
  readonly message: string;
  readonly requestId: string | undefined;
  readonly details: undefined;
}

function parseErrorPayload(value: unknown, response: Response): ParsedErrorPayload {
  const fallback = {
    code: `HTTP_${String(response.status)}`,
    message: `UnifyPort API 返回 HTTP ${String(response.status)}`,
    requestId: requestIdFrom(value, response),
    details: undefined
  };
  if (!isRecord(value)) return fallback;
  const nested = isRecord(value["error"]) ? value["error"] : value;
  const code = readDiagnostic(nested, "code", 64) ?? fallback.code;
  return {
    code,
    // 上游 message/details 可能回显请求参数；错误对象只公开稳定 code/status/request ID。
    message: `UnifyPort API 返回 ${code} (HTTP ${String(response.status)})`,
    requestId: requestIdFrom(value, response),
    details: undefined
  };
}

function canonicalUnsafeIntegerToken(token: string): string | undefined {
  const maximum = BigInt(Number.MAX_SAFE_INTEGER);
  const minimum = BigInt(Number.MIN_SAFE_INTEGER);
  const parts = /^(-?)([0-9]+)(?:\.([0-9]+))?(?:[eE]([+-]?[0-9]+))?$/u.exec(token);
  if (parts === null) return undefined;

  const sign = parts[1] ?? "";
  const whole = parts[2] ?? "0";
  const fraction = parts[3] ?? "";
  const coefficient = `${whole}${fraction}`;
  if (/^0+$/u.test(coefficient)) return undefined;

  const numeric = Number(token);
  if (!Number.isFinite(numeric) || numeric === 0) {
    // 极端 exponent 会溢出或下溢；直接拒绝比返回错误的 Infinity/0 或放大字符串更安全。
    throw new SyntaxError("JSON number magnitude exceeds the supported range");
  }

  const exponentText = parts[4] ?? "0";
  const exponentMagnitude = exponentText.replace(/^[+-]?0*/u, "");
  if (exponentMagnitude.length > 6) {
    throw new SyntaxError("JSON number exponent exceeds the supported range");
  }
  const exponent = Number(exponentText);
  if (!Number.isSafeInteger(exponent)) {
    throw new SyntaxError("JSON number exponent exceeds the supported range");
  }

  const scale = fraction.length - exponent;
  let integerDigits: string;
  if (scale > 0) {
    if (scale >= coefficient.length) return undefined;
    const split = coefficient.length - scale;
    if (!/^0*$/u.test(coefficient.slice(split))) return undefined;
    integerDigits = coefficient.slice(0, split);
  } else {
    const significant = coefficient.replace(/^0+/u, "");
    const appendedZeroes = -scale;
    if (significant.length + appendedZeroes > MAX_CANONICAL_INTEGER_DIGITS) {
      throw new SyntaxError("JSON integer exceeds the supported digit limit");
    }
    integerDigits = `${significant}${"0".repeat(appendedZeroes)}`;
  }

  const normalized = integerDigits.replace(/^0+/u, "") || "0";
  if (normalized.length > MAX_CANONICAL_INTEGER_DIGITS) {
    throw new SyntaxError("JSON integer exceeds the supported digit limit");
  }
  const canonical = sign === "-" ? `-${normalized}` : normalized;
  if (normalized.length > 16) return canonical;
  const integer = BigInt(sign === "-" ? `-${normalized}` : normalized);
  return integer > maximum || integer < minimum ? canonical : undefined;
}

function preserveUnsafeIntegerTokens(json: string, maximumBytes: number): string {
  const output: string[] = [];
  let outputBytes = 0;
  let index = 0;
  let rawStart = 0;
  // sticky regex 直接在原字符串游标匹配，避免大量小数字时反复 slice 剩余正文形成平方级复制。
  const numberToken = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
  const append = (value: string): void => {
    outputBytes += Buffer.byteLength(value, "utf8");
    if (outputBytes > maximumBytes) {
      // 数字规范化可能放大短 exponent；派生 JSON 仍受与 wire body 相同的硬上限约束。
      throw new SyntaxError("Normalized JSON exceeds the configured response limit");
    }
    output.push(value);
  };

  while (index < json.length) {
    const character = json[index];
    if (character === undefined) break;
    if (character === '"') {
      index += 1;
      while (index < json.length) {
        if (json[index] === "\\") {
          index += 2;
        } else if (json[index] === '"') {
          index += 1;
          break;
        } else {
          index += 1;
        }
      }
      continue;
    }

    if (character === "-" || /[0-9]/.test(character)) {
      numberToken.lastIndex = index;
      const token = numberToken.exec(json)?.[0];
      if (token !== undefined) {
        const canonical = canonicalUnsafeIntegerToken(token);
        if (canonical !== undefined) {
          // 统一成十进制整数串，使 SDK 类型、MCP schema 与不同 JSON 数字拼写保持同一语义。
          append(json.slice(rawStart, index));
          append(JSON.stringify(canonical));
          index += token.length;
          rawStart = index;
          continue;
        }
        index += token.length;
        continue;
      }
    }

    index += 1;
  }
  append(json.slice(rawStart));
  return output.join("");
}

// 泛型只表达 OpenAPI operation 的返回契约；运行时校验由生成 schema 与测试共同保证。
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function parseSuccessData<T>(value: string | undefined, maximumBytes: number): T {
  const parsed: unknown =
    value === undefined ? undefined : JSON.parse(preserveUnsafeIntegerTokens(value, maximumBytes));
  // OpenAPI 类型与 text parser 在生成器中成对维护；此断言只跨越 JSON.parse 无法表达的契约边界。
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return parsed as T;
}

function unwrap<T>(
  outcome: OpenApiFetchOutcome<string | undefined>,
  operation: OperationMetadata,
  maximumBytes: number
): ApiResult<T> {
  if ("data" in outcome && outcome.response.ok) {
    let data: T;
    try {
      data = parseSuccessData<T>(outcome.data, maximumBytes);
    } catch {
      // JSON.parse 的原始 SyntaxError 可能包含响应片段，公开错误只携带稳定说明与筛选后元数据。
      const requestId = requestIdFrom(undefined, outcome.response);
      throw new UnifyPortResponseParseError("无法解析 UnifyPort API 响应", {
        api: operation.api,
        operationId: operation.operationId,
        status: outcome.response.status,
        ...(requestId === undefined ? {} : { requestId })
      });
    }
    const requestId = requestIdFrom(data, outcome.response);
    return {
      data,
      response: outcome.response,
      status: outcome.response.status,
      ...(requestId === undefined ? {} : { requestId })
    };
  }

  const errorValue = "error" in outcome ? outcome.error : undefined;
  const parsed = parseErrorPayload(errorValue, outcome.response);
  throw new UnifyPortApiError(parsed.message, {
    api: operation.api,
    operationId: operation.operationId,
    status: outcome.response.status,
    code: parsed.code,
    requestId: parsed.requestId,
    details: parsed.details
  });
}

function createRuntime(config: RuntimeConfig): ApiRuntime {
  const transport = createTransport(config);
  const rawOperation: OperationMetadata = {
    api: "device",
    operationId: "raw",
    method: "RAW",
    path: "*",
    tag: "Raw",
    summary: "Raw typed OpenAPI request",
    description: "",
    authRequired: true,
    toolName: "",
    mutability: "write",
    retryable: false,
    secretInput: false,
    secretOutput: false,
    mcpExposure: "never",
    inputSchema: {},
    outputSchema: {}
  };
  return {
    baseUrl: config.baseUrl,
    rawFetch: transport(rawOperation, {}),
    createFetch: transport,
    execute: async <T>(
      operation: OperationMetadata,
      request: () => Promise<OpenApiFetchOutcome<string | undefined>>
    ): Promise<ApiResult<T>> => {
      try {
        return unwrap<T>(await request(), operation, config.maxResponseBytes);
      } catch (error) {
        if (error instanceof UnifyPortError) throw error;
        throw new UnifyPortResponseParseError("无法解析 UnifyPort API 响应", {
          api: operation.api,
          operationId: operation.operationId
        });
      }
    }
  };
}

function baseRuntimeConfig(
  config: Pick<
    DeviceClientConfig,
    "baseUrl" | "fetch" | "timeoutMs" | "maxResponseBytes" | "retry" | "allowInsecureHttp"
  >,
  injectCredential: RuntimeConfig["injectCredential"]
): RuntimeConfig {
  return {
    baseUrl: normalizeBaseUrl(config.baseUrl, config.allowInsecureHttp === true),
    fetch:
      config.fetch ??
      (async (request: Request): Promise<Response> => await globalThis.fetch(request)),
    timeoutMs: assertTimerMilliseconds(config.timeoutMs ?? DEFAULT_TIMEOUT_MS, "timeoutMs"),
    maxResponseBytes: normalizeMaxResponseBytes(config.maxResponseBytes),
    retry: normalizeRetry(config.retry),
    injectCredential
  };
}

export function createDeviceRuntime(config: DeviceClientConfig): ApiRuntime {
  const runtimeConfig = baseRuntimeConfig(config, async (request): Promise<Request> => {
    const headers = new Headers(request.headers);
    // Device client 只允许自身注入认证，调用参数中的通用 credential header 一律丢弃。
    headers.delete("authorization");
    headers.delete("cookie");
    headers.set("x-api-key", await resolveSecret(config.apiKey, "apiKey"));
    return new Request(request, { headers });
  });
  // 闭包只保存 provider/string 的引用，不把解析出的 secret 持久化到 client 可枚举字段。
  return createRuntime(runtimeConfig);
}
