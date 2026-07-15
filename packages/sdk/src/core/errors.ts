import type { ApiName } from "./types.js";

interface ErrorContext {
  readonly api?: ApiName;
  readonly operationId?: string;
  readonly cause?: unknown;
}

export class UnifyPortError extends Error {
  public readonly api: ApiName | undefined;
  public readonly operationId: string | undefined;

  public constructor(message: string, context: ErrorContext = {}) {
    super(message, context.cause === undefined ? undefined : { cause: context.cause });
    this.name = new.target.name;
    this.api = context.api;
    this.operationId = context.operationId;
  }
}

export class UnifyPortConfigurationError extends UnifyPortError {}

interface RequestErrorContext extends ErrorContext {
  readonly url: string;
}

export class UnifyPortNetworkError extends UnifyPortError {
  public readonly url: string;

  public constructor(message: string, context: RequestErrorContext) {
    super(message, context);
    this.url = context.url;
  }
}

export class UnifyPortTimeoutError extends UnifyPortNetworkError {
  public readonly timeoutMs: number;

  public constructor(
    message: string,
    context: RequestErrorContext & { readonly timeoutMs: number }
  ) {
    super(message, context);
    this.timeoutMs = context.timeoutMs;
  }
}

export class UnifyPortAbortError extends UnifyPortNetworkError {}

interface ResponseParseErrorContext extends Omit<ErrorContext, "cause"> {
  readonly status?: number;
  readonly requestId?: string;
}

export class UnifyPortResponseParseError extends UnifyPortError {
  public readonly status: number | undefined;
  public readonly requestId: string | undefined;

  public constructor(message: string, context: ResponseParseErrorContext = {}) {
    // Response/header/cause 都可能包含 secret；解析错误只保留筛选后的 HTTP 元数据。
    super(message, context);
    this.status = context.status;
    this.requestId = context.requestId;
  }
}

export class UnifyPortPaginationError extends UnifyPortError {}

interface ApiErrorContext extends ErrorContext {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;
  readonly details?: unknown;
}

export class UnifyPortApiError extends UnifyPortError {
  public readonly status: number;
  public readonly code: string;
  public readonly requestId: string | undefined;
  public readonly details: unknown;

  public constructor(message: string, context: ApiErrorContext) {
    super(message, context);
    this.status = context.status;
    this.code = context.code;
    this.requestId = context.requestId;
    this.details = context.details;
  }
}
