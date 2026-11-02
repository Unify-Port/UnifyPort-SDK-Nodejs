import type { deviceOperations } from "../generated/device/operation-catalog.js";
import type { operations } from "../generated/device/schema.js";

// 类型生成器共用 operations 存放 HTTP 与 Webhook；旧公开入口只保留客户端可调用操作。
export type DeviceHttpOperations = Pick<operations, keyof typeof deviceOperations>;
