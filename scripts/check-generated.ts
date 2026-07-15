import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { generateArtifacts, GENERATED_ARTIFACT_DIRECTORIES, ROOT } from "./lib/generator.js";

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

// 同时比较所有生成目录清单，避免已停止生成的客户端、示例或参考页继续留在公开仓库。
for (const directory of GENERATED_ARTIFACT_DIRECTORIES) {
  let entries: string[];
  try {
    entries = await readdir(resolve(ROOT, directory.path), { recursive: true });
  } catch {
    entries = [];
  }
  for (const entry of entries) {
    if (!entry.endsWith(directory.suffix)) continue;
    const path = `${directory.path}/${entry}`;
    if (!artifacts.has(path)) stale.push(path);
  }
}

if (stale.length > 0) {
  process.stderr.write(
    `生成文件缺失或已漂移，请运行 pnpm generate:\n${stale.map((path) => `- ${path}`).join("\n")}\n`
  );
  process.exitCode = 1;
} else {
  process.stderr.write("[generate:check] generated artifacts are current\n");
}
