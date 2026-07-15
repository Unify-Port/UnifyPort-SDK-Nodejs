import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import { ROOT } from "./lib/generator.js";

const generatedDirectories = ["coverage", "packages/sdk/dist", "packages/mcp/dist"] as const;

for (const directory of generatedDirectories) {
  // 统一清理测试和构建产物，避免直接分发工作目录时携带本机绝对路径或过期代码。
  await rm(resolve(ROOT, directory), { recursive: true, force: true });
}
