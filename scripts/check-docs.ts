import { access, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { deviceOperations } from "../packages/sdk/src/generated/device/operation-catalog.js";
import { collectPublicFiles } from "./lib/public-safety.js";

// 文档链接和 operation section 进入统一门禁，避免生成成功但公开导航已经失效。
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY_BLOB_PREFIX = "https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/blob/main/";
const REPOSITORY_TREE_PREFIX = "https://github.com/Unify-Port/UnifyPort-SDK-Nodejs/tree/main/";
const MARKDOWN_LINK = /!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/gu;

interface LinkTarget {
  readonly path: string;
  readonly anchor: string;
}

function localTarget(source: string, rawTarget: string): LinkTarget | undefined {
  const target = rawTarget.replace(/^<|>$/gu, "");
  if (/^(?:mailto:|https?:\/\/)/u.test(target)) {
    const prefix = target.startsWith(REPOSITORY_BLOB_PREFIX)
      ? REPOSITORY_BLOB_PREFIX
      : target.startsWith(REPOSITORY_TREE_PREFIX)
        ? REPOSITORY_TREE_PREFIX
        : undefined;
    if (prefix === undefined) return undefined;
    const [path = "", anchor = ""] = target.slice(prefix.length).split("#", 2);
    return { path: resolve(ROOT, decodeURIComponent(path)), anchor };
  }

  const [path = "", anchor = ""] = target.split("#", 2);
  const withoutQuery = path.split("?", 1)[0] ?? "";
  return {
    path: withoutQuery === "" ? source : resolve(dirname(source), decodeURIComponent(withoutQuery)),
    anchor
  };
}

function displayPath(path: string): string {
  return relative(ROOT, path).replaceAll("\\", "/");
}

const markdownFiles = (await collectPublicFiles(ROOT)).filter((path) => path.endsWith(".md"));
const contents = new Map<string, string>();
const failures: string[] = [];
let checkedLinks = 0;

for (const file of markdownFiles) {
  const content = await readFile(file, "utf8");
  contents.set(file, content);
  for (const match of content.matchAll(MARKDOWN_LINK)) {
    const rawTarget = match[1];
    if (rawTarget === undefined) continue;
    const target = localTarget(file, rawTarget);
    if (target === undefined) continue;
    checkedLinks += 1;
    if (relative(ROOT, target.path).startsWith("..")) {
      failures.push(`${displayPath(file)}: link 超出仓库 ${rawTarget}`);
      continue;
    }
    try {
      await access(target.path);
    } catch {
      failures.push(`${displayPath(file)}: link 目标不存在 ${rawTarget}`);
    }
  }
}

const referenceFiles = [...contents.entries()].filter(([path]) =>
  displayPath(path).startsWith("docs/api-reference/")
);
const coveragePath = resolve(ROOT, "docs/api-coverage.md");
const coverage = contents.get(coveragePath) ?? (await readFile(coveragePath, "utf8"));

for (const operationId of Object.keys(deviceOperations)) {
  const heading = `## \`${operationId}\``;
  const sections = referenceFiles.filter(([, content]) => content.includes(heading));
  if (sections.length !== 1) {
    failures.push(
      `${operationId}: API Reference section 数量应为 1，实际为 ${String(sections.length)}`
    );
  }

  const escapedId = operationId.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const coverageLink = new RegExp("\\[`" + escapedId + "`\\]\\(([^)]+)\\)", "u").exec(
    coverage
  )?.[1];
  if (coverageLink === undefined) {
    failures.push(`${operationId}: API 覆盖表缺少 Reference 链接`);
    continue;
  }
  const target = localTarget(coveragePath, coverageLink);
  if (target === undefined || target.anchor === "") {
    failures.push(`${operationId}: API 覆盖表链接缺少本地 anchor`);
    continue;
  }
  const targetContent = contents.get(target.path) ?? (await readFile(target.path, "utf8"));
  // operation anchor 由生成器显式输出，避免依赖不同 Markdown renderer 的标题 slug 规则。
  if (!targetContent.includes(`<a id="${target.anchor}"></a>`)) {
    failures.push(`${operationId}: API Reference anchor 不存在 ${coverageLink}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`[docs:check] ${failure}\n`);
  throw new Error(`文档检查发现 ${String(failures.length)} 项问题`);
}

process.stderr.write(
  `[docs:check] checked ${String(checkedLinks)} links and ${String(Object.keys(deviceOperations).length)} operation sections\n`
);
