/** Device API 子路径导出 X-Api-Key 客户端与对应公开契约。 */
export { UnifyPortDeviceClient } from "../generated/device/client.js";
export { deviceOperations } from "../generated/device/operation-catalog.js";
export type { components, operations, paths } from "../generated/device/schema.js";
export type {
  ApiResult,
  DeviceClientConfig,
  OperationData,
  RequestExecutionOptions,
  RetryConfig,
  SecretProvider,
  SecretSource
} from "../core/types.js";
export {
  UnifyPortAbortError,
  UnifyPortApiError,
  UnifyPortConfigurationError,
  UnifyPortError,
  UnifyPortNetworkError,
  UnifyPortPaginationError,
  UnifyPortResponseParseError,
  UnifyPortTimeoutError
} from "../core/errors.js";
export { paginateCursor } from "../core/pagination.js";
export type { CursorPage, CursorPaginationOptions } from "../core/pagination.js";
