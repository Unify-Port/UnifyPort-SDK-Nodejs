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

interface DocumentationLocale {
  readonly name: "en" | "zh-CN";
  readonly referencePrefix: string;
  readonly coveragePath: string;
}

const DOCUMENTATION_LOCALES = [
  {
    name: "en",
    referencePrefix: "docs/api-reference/",
    coveragePath: "docs/api-coverage.md"
  },
  {
    name: "zh-CN",
    referencePrefix: "docs/zh-CN/api-reference/",
    coveragePath: "docs/zh-CN/api-coverage.md"
  }
] as const satisfies readonly DocumentationLocale[];

// 手写文档采用显式清单；新增公开说明时必须主动决定是否需要双语版本。
const BILINGUAL_DOCUMENTS = [
  ["AGENTS.md", "AGENTS.zh-CN.md"],
  ["README.md", "README.zh-CN.md"],
  ["packages/sdk/README.md", "packages/sdk/README.zh-CN.md"],
  ["packages/mcp/README.md", "packages/mcp/README.zh-CN.md"],
  ["docs/acceptance-report.md", "docs/zh-CN/acceptance-report.md"],
  ["docs/architecture.md", "docs/zh-CN/architecture.md"],
  ["docs/contract-maintenance.md", "docs/zh-CN/contract-maintenance.md"],
  ["docs/security.md", "docs/zh-CN/security.md"],
  ["skills/unifyport-node-sdk/SKILL.md", "skills/unifyport-node-sdk/SKILL.zh-CN.md"],
  ["skills/unifyport-mcp/SKILL.md", "skills/unifyport-mcp/SKILL.zh-CN.md"]
] as const;

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
let checkedOperationSections = 0;

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

function checkLanguageNavigation(path: string, content: string): void {
  if (!content.includes("[English]") || !content.includes("[简体中文]")) {
    failures.push(`${path}: 缺少中英文切换入口`);
  }
}

function checkLocalizedContent(
  path: string,
  content: string,
  locale: DocumentationLocale["name"]
): void {
  checkLanguageNavigation(path, content);
  const withoutNavigationLabel = content.replaceAll("简体中文", "");
  if (locale === "en" && /[\p{Script=Han}]/u.test(withoutNavigationLabel)) {
    failures.push(`${path}: 英文文档仍包含中文正文`);
  }
  if (locale === "zh-CN" && !/[\p{Script=Han}]/u.test(content)) {
    failures.push(`${path}: 中文文档缺少中文正文`);
  }
}

// 所有公开 Markdown 都必须进入手写双语清单或双语生成目录，避免新增说明只维护一种语言。
const classifiedDocuments = new Set<string>([
  ...BILINGUAL_DOCUMENTS.flat(),
  ...DOCUMENTATION_LOCALES.map((locale) => locale.coveragePath)
]);
for (const file of markdownFiles) {
  const path = displayPath(file);
  if (
    !classifiedDocuments.has(path) &&
    !DOCUMENTATION_LOCALES.some((locale) => path.startsWith(locale.referencePrefix))
  ) {
    failures.push(`${path}: 未登记双语文档策略`);
  }
}

for (const [englishPath, chinesePath] of BILINGUAL_DOCUMENTS) {
  const english = contents.get(resolve(ROOT, englishPath));
  const chinese = contents.get(resolve(ROOT, chinesePath));
  if (english === undefined) failures.push(`${englishPath}: 英文文档不存在`);
  if (chinese === undefined) failures.push(`${chinesePath}: 中文文档不存在`);
  if (english === undefined || chinese === undefined) continue;
  checkLocalizedContent(englishPath, english, "en");
  checkLocalizedContent(chinesePath, chinese, "zh-CN");
}

for (const locale of DOCUMENTATION_LOCALES) {
  const referenceFiles = [...contents.entries()].filter(([path]) =>
    displayPath(path).startsWith(locale.referencePrefix)
  );
  const coveragePath = resolve(ROOT, locale.coveragePath);
  const coverage = contents.get(coveragePath) ?? (await readFile(coveragePath, "utf8"));
  checkLocalizedContent(locale.coveragePath, coverage, locale.name);

  for (const [path, content] of referenceFiles) {
    checkLocalizedContent(displayPath(path), content, locale.name);
  }

  for (const operationId of Object.keys(deviceOperations)) {
    const heading = `## \`${operationId}\``;
    const sections = referenceFiles.filter(([, content]) => content.includes(heading));
    if (sections.length !== 1) {
      failures.push(
        `${locale.name}:${operationId}: API Reference section 数量应为 1，实际为 ${String(sections.length)}`
      );
    }
    checkedOperationSections += sections.length;

    const escapedId = operationId.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const coverageLink = new RegExp("\\[`" + escapedId + "`\\]\\(([^)]+)\\)", "u").exec(
      coverage
    )?.[1];
    if (coverageLink === undefined) {
      failures.push(`${locale.name}:${operationId}: API 覆盖表缺少 Reference 链接`);
      continue;
    }
    const target = localTarget(coveragePath, coverageLink);
    if (target === undefined || target.anchor === "") {
      failures.push(`${locale.name}:${operationId}: API 覆盖表链接缺少本地 anchor`);
      continue;
    }
    const targetContent = contents.get(target.path) ?? (await readFile(target.path, "utf8"));
    // operation anchor 由生成器显式输出，避免依赖不同 Markdown renderer 的标题 slug 规则。
    if (!targetContent.includes(`<a id="${target.anchor}"></a>`)) {
      failures.push(`${locale.name}:${operationId}: API Reference anchor 不存在 ${coverageLink}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`[docs:check] ${failure}\n`);
  throw new Error(`文档检查发现 ${String(failures.length)} 项问题`);
}

process.stderr.write(
  `[docs:check] checked ${String(checkedLinks)} links and ${String(checkedOperationSections)} bilingual operation sections\n`
);
