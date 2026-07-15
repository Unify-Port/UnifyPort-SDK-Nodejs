/** library 入口便于 host 嵌入与测试；真正的 stdio 启动副作用只存在于 cli.ts。 */
export { configFromEnvironment } from "./config.js";
export type { McpPermissions, McpRuntimeConfig } from "./config.js";
export { createToolRegistry, safeToolError } from "./registry.js";
export type { RegisteredTool, ToolRegistry } from "./registry.js";
export { createMcpServer } from "./server.js";
export type { McpServerBundle } from "./server.js";
