import { UnifyPortPaginationError } from "./errors.js";

export interface CursorPage<T> {
  readonly items: readonly T[];
  readonly has_more: boolean;
  readonly next_cursor?: string;
}

export interface CursorPaginationOptions {
  readonly initialCursor?: string;
  /** 有限上限防止上游 cursor 异常时代理或 worker 无限运行。 */
  readonly maxPages?: number;
  readonly signal?: AbortSignal;
}

function paginationAbortError(): UnifyPortPaginationError {
  // AbortSignal.reason 可由调用方放入任意敏感对象；公开分页错误只返回稳定取消语义。
  return new UnifyPortPaginationError("cursor pagination 已取消");
}

function signalAborted(signal: AbortSignal | undefined): boolean {
  // aborted 会在异步边界外部变化；函数读取可避免把首次 false 错误视为永久窄化。
  return signal?.aborted === true;
}

async function abortablePage<T>(promise: Promise<T>, signal: AbortSignal | undefined): Promise<T> {
  if (signal === undefined) return await promise;
  if (signal.aborted) throw paginationAbortError();
  let onAbort: (() => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    onAbort = (): void => {
      reject(paginationAbortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    // fetchPage 未必自行监听 signal；竞速保证挂起请求也能及时结束分页调用。
    return await Promise.race([promise, aborted]);
  } finally {
    if (onAbort !== undefined) signal.removeEventListener("abort", onAbort);
  }
}

export async function* paginateCursor<T>(
  fetchPage: (cursor: string | undefined, signal?: AbortSignal) => Promise<CursorPage<T>>,
  options: CursorPaginationOptions = {}
): AsyncGenerator<T, void, undefined> {
  const maxPages = options.maxPages ?? 10_000;
  if (!Number.isInteger(maxPages) || maxPages <= 0) {
    throw new UnifyPortPaginationError("maxPages 必须是正整数");
  }

  let cursor = options.initialCursor;
  const seen = new Set<string>();
  if (cursor !== undefined) seen.add(cursor);
  for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
    if (signalAborted(options.signal)) {
      throw paginationAbortError();
    }
    const page = await abortablePage(fetchPage(cursor, options.signal), options.signal);
    for (const item of page.items) {
      // consumer 可在同一页两次 yield 之间取消，不能继续泄出已预取的剩余数据。
      if (signalAborted(options.signal)) throw paginationAbortError();
      yield item;
    }
    if (!page.has_more) return;

    const nextCursor = page.next_cursor;
    if (nextCursor === undefined || nextCursor === "") {
      throw new UnifyPortPaginationError("上游返回 has_more=true 但缺少 next_cursor");
    }
    if (seen.has(nextCursor)) {
      throw new UnifyPortPaginationError("上游返回重复 next_cursor，已停止避免无限循环");
    }
    seen.add(nextCursor);
    cursor = nextCursor;
  }
  throw new UnifyPortPaginationError(`cursor pagination 超过 maxPages=${String(maxPages)}`);
}
