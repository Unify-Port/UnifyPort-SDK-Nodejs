#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { UnifyPortConfigurationError } from "@unifyport/sdk-node";

import { configFromEnvironment } from "./config.js";
import { createMcpServer } from "./server.js";

async function main(): Promise<void> {
  const { server } = createMcpServer(configFromEnvironment());
  // connect 会自行启动 stdio transport；重复调用 start 会破坏 MCP 生命周期。
  await server.connect(new StdioServerTransport());
}

void main().catch((error: unknown) => {
  const kind = error instanceof UnifyPortConfigurationError ? "configuration" : "unexpected";
  // stdout 必须保持纯 JSON-RPC；启动异常的原始 message 可能含环境或 transport 细节。
  console.error(`[mcp] fatal startup error kind=${kind}`);
  process.exitCode = 1;
});
