import { readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

export interface PublicFinding {
  readonly file: string;
  readonly rule: string;
}

interface ContentRule {
  readonly label: string;
  readonly pattern: RegExp;
  readonly projectOwnedOnly?: boolean;
}

export const DEFAULT_IGNORED_DIRECTORIES: ReadonlySet<string> = new Set([
  ".git",
  "coverage",
  "dist",
  "node_modules"
]);

function joined(...parts: readonly string[]): string {
  // 规则字面量分段存放，避免泄漏扫描模块自身被同一条规则误报。
  return parts.join("");
}

const CONTENT_RULES: readonly ContentRule[] = [
  { label: "macOS user home path", pattern: new RegExp(joined("/", "Users", "/"), "u") },
  { label: "Linux user home path", pattern: new RegExp(joined("/", "home", "/"), "u") },
  {
    label: "Windows user home path",
    pattern: new RegExp(joined("[A-Za-z]:\\\\", "Users", "\\\\"), "u")
  },
  {
    label: "development source manifest",
    pattern: new RegExp(joined("source", "-manifest"), "iu")
  },
  {
    label: "development repository provenance",
    // 只检测通用来源元数据键，避免公开扫描器本身携带任何非公开项目专用词。
    pattern: new RegExp(
      joined("(?:source|upstream)", "(?:Repository|Commit|Path|Branch|Workspace)"),
      "u"
    )
  },
  {
    label: "private network URL",
    pattern: new RegExp(
      joined(
        "https?://(?:10\\.[0-9.]+|192\\.168\\.[0-9.]+|172\\.(?:1[6-9]|2[0-9]|3[01])\\.[0-9.]+|",
        "[A-Za-z0-9.-]+\\.(?:corp|internal|lan|local))(?:[:/]|$)"
      ),
      "iu"
    ),
    projectOwnedOnly: true
  },
  {
    label: "development branch provenance",
    // 只匹配 Git ref 语法，避免把安全文档中的 origin/path 误判为远程分支。
    pattern: new RegExp(joined("refs/(?:", "heads|remotes)/[A-Za-z0-9._/-]+"), "u"),
    projectOwnedOnly: true
  },
  { label: "full Git commit hash", pattern: /\b[0-9a-f]{40}\b/iu },
  { label: "content digest", pattern: /\b[0-9a-f]{64}\b/iu },
  {
    label: "private key material",
    pattern: new RegExp(joined("-----BEGIN ", "(?:RSA |EC |OPENSSH )?PRIVATE KEY-----"), "u")
  },
  {
    label: "well-known access token",
    pattern: new RegExp(
      joined(
        "(?:gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|npm_[A-Za-z0-9]{20,}|",
        "glpat-[A-Za-z0-9_-]{20,}|xox(?:a|b|p|r|s)-[A-Za-z0-9-]{20,})"
      ),
      "u"
    )
  },
  {
    label: "JSON Web Token",
    pattern: new RegExp(
      joined("eyJ[A-Za-z0-9_-]{8,}\\.", "[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}"),
      "u"
    )
  },
  {
    label: "hard-coded environment secret",
    pattern: new RegExp(
      joined(
        "(?:API_KEY|PASSWORD|SECRET|TOKEN)\\s*=\\s*[\"']",
        "(?!<(?:api-key|password|secret|token)>)[A-Za-z0-9_./+=:-]{16,}[\"']"
      ),
      "u"
    ),
    projectOwnedOnly: true
  }
];

export async function collectPublicFiles(
  directory: string,
  ignoredDirectories: ReadonlySet<string> = DEFAULT_IGNORED_DIRECTORIES
): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPublicFiles(path, ignoredDirectories)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

async function checkFile(path: string, displayRoot: string): Promise<readonly PublicFinding[]> {
  const file = relative(displayRoot, path).replaceAll("\\", "/");
  const findings: PublicFinding[] = [];
  if (file.endsWith(".mjs")) findings.push({ file, rule: "JavaScript module file" });
  for (const rule of CONTENT_RULES) {
    if (rule.pattern.test(file)) findings.push({ file, rule: `${rule.label} in path` });
  }

  const content = await readFile(path);
  // 二进制依赖不属于可审查源码；NUL 是简单且稳定的文本边界。
  if (content.includes(0)) return findings;
  const text = content.toString("utf8");
  for (const rule of CONTENT_RULES) {
    if (file === "pnpm-lock.yaml" && rule.projectOwnedOnly === true) continue;
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(text)) findings.push({ file, rule: rule.label });
  }
  return findings;
}

export async function findPublicSafetyIssues(
  directory: string,
  ignoredDirectories: ReadonlySet<string> = DEFAULT_IGNORED_DIRECTORIES
): Promise<{ readonly filesChecked: number; readonly findings: readonly PublicFinding[] }> {
  const files = await collectPublicFiles(directory, ignoredDirectories);
  const findings = (
    await Promise.all(files.map(async (file) => checkFile(file, directory)))
  ).flat();
  return { filesChecked: files.length, findings };
}
