import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { generateArtifacts, ROOT } from "./lib/generator.js";

// 显式保存缺失路径，保证检查模式只报告漂移，不会意外写回生成文件。
const stale: string[] = [];
const artifacts = await generateArtifacts();
for (const [path, expected] of artifacts) {
  let actual: string | undefined;
  try {
    actual = await readFile(resolve(ROOT, path), "utf8");
  } catch {
    actual = undefined;
  }
  if (actual !== expected) stale.push(path);
}

// 同时比较生成目录清单，避免已停止生成的旧客户端继续混入构建或发布包。
const generatedRoot = "packages/sdk/src/generated";
for (const entry of await readdir(resolve(ROOT, generatedRoot), { recursive: true })) {
  if (!entry.endsWith(".ts")) continue;
  const path = `${generatedRoot}/${entry}`;
  if (!artifacts.has(path)) stale.push(path);
}

if (stale.length > 0) {
  process.stderr.write(
    `生成文件缺失或已漂移，请运行 pnpm generate:\n${stale.map((path) => `- ${path}`).join("\n")}\n`
  );
  process.exitCode = 1;
} else {
  process.stderr.write("[generate:check] generated artifacts are current\n");
}
