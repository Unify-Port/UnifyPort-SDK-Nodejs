import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 本地门禁只维护仓库额外边界；ClawHub 官方 dry-run 仍负责完整格式和服务端校验。
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLISHED_SKILL_PATH = "skills/unifyport-node-sdk";
const SKILL_PATH = `${PUBLISHED_SKILL_PATH}/SKILL.md`;
const WORKFLOW_PATH = ".github/workflows/clawhub-skill-publish.yml";
const PUBLISHING_DOC_PATH = "docs/clawhub-publishing.md";
const PUBLISHING_DOC_ZH_PATH = "docs/zh-CN/clawhub-publishing.md";

const [skill, workflow, publishingDoc, publishingDocZh, mcpPackage] = await Promise.all([
  readFile(resolve(ROOT, SKILL_PATH), "utf8"),
  readFile(resolve(ROOT, WORKFLOW_PATH), "utf8"),
  readFile(resolve(ROOT, PUBLISHING_DOC_PATH), "utf8"),
  readFile(resolve(ROOT, PUBLISHING_DOC_ZH_PATH), "utf8"),
  readFile(resolve(ROOT, "packages/mcp/package.json"), "utf8")
]);

const failures: string[] = [];

function requireCondition(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

const frontmatterMatch = /^---\r?\n(?<content>[\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(skill);
const frontmatter = frontmatterMatch?.groups?.["content"];
requireCondition(frontmatter !== undefined, `${SKILL_PATH}: 缺少 YAML frontmatter`);

if (frontmatter !== undefined) {
  requireCondition(
    /^name:\s*unifyport-node-sdk\s*$/mu.test(frontmatter),
    `${SKILL_PATH}: name 必须与发布目录一致`
  );
  requireCondition(
    /^description:\s*\S.+$/mu.test(frontmatter),
    `${SKILL_PATH}: 缺少非空 description`
  );
  requireCondition(
    /^metadata:\s*$[\s\S]*?^\s{2}openclaw:\s*$/mu.test(frontmatter),
    `${SKILL_PATH}: 缺少 metadata.openclaw`
  );
  for (const binary of ["node", "npm"] as const) {
    requireCondition(
      new RegExp(`^\\s*- ${binary}\\s*$`, "mu").test(frontmatter),
      `${SKILL_PATH}: metadata.openclaw 未声明 ${binary} binary`
    );
  }
  for (const variable of ["UNIFYPORT_DEVICE_API_BASE_URL", "UNIFYPORT_DEVICE_API_KEY"] as const) {
    requireCondition(
      new RegExp(`^\\s*- name: ${variable}\\r?\\n\\s+required: false\\s*$`, "mu").test(frontmatter),
      `${SKILL_PATH}: ${variable} 必须声明为条件式可选变量`
    );
  }
  requireCondition(
    /^\s{4}homepage:\s*["']?https:\/\/www\.npmjs\.com\/package\/@unifyport\/sdk-node["']?\s*$/mu.test(
      frontmatter
    ),
    `${SKILL_PATH}: homepage 必须指向公开 npm package`
  );
  requireCondition(
    !/^version:\s*/mu.test(frontmatter),
    `${SKILL_PATH}: 不应把 ClawHub Skill 版本绑定到 SDK frontmatter`
  );
}

requireCondition(
  skill.includes("Installing it does not expose Device API operations as"),
  `${SKILL_PATH}: 缺少 Skill 与 runtime/plugin 的边界说明`
);

const publishedPathOccurrences = [...workflow.matchAll(/\.\/skills\/unifyport-node-sdk(?:\s|$)/gu)]
  .length;
requireCondition(
  publishedPathOccurrences === 2,
  `${WORKFLOW_PATH}: dry-run 与 publish 必须都固定 SDK Skill path`
);
requireCondition(
  !workflow.includes("skills/unifyport-mcp"),
  `${WORKFLOW_PATH}: 不得包含 private MCP Skill`
);
// 同时拒绝空格与等号两种 CLI 参数形式，避免绕过固定账号边界。
requireCondition(
  !/(?:^\s+owner:\s*|--owner(?:=|\s|$))/mu.test(workflow),
  `${WORKFLOW_PATH}: 必须由已验证的认证账号解析 owner`
);
requireCondition(
  workflow.includes("pull_request:") && workflow.includes("workflow_dispatch:"),
  `${WORKFLOW_PATH}: 必须同时包含 PR dry-run 与手动发布入口`
);
requireCondition(
  workflow.includes("--dry-run") && workflow.includes("github.ref_name == 'main'"),
  `${WORKFLOW_PATH}: PR 必须 dry-run，真实发布必须限制在 main`
);
requireCondition(
  workflow.includes("CLAWHUB_TOKEN: ${{ secrets.CLAWHUB_TOKEN }}"),
  `${WORKFLOW_PATH}: 真实发布必须只从 CLAWHUB_TOKEN secret 读取凭据`
);
// 固定校验公开发布账号，避免后续更换 Secret 时意外回退到个人命名空间。
requireCondition(
  workflow.includes('test "$(npx --yes clawhub@0.23.1 whoami)" = "unifyport"'),
  `${WORKFLOW_PATH}: 真实发布前必须验证 @unifyport 账号`
);
requireCondition(
  [...workflow.matchAll(/clawhub@0\.23\.1/gu)].length === 3,
  `${WORKFLOW_PATH}: dry-run、账号校验与 publish 必须使用已验证的固定 CLI 版本`
);
requireCondition(
  [...workflow.matchAll(/--name "UnifyPort Node\.js SDK"/gu)].length === 2,
  `${WORKFLOW_PATH}: dry-run 与 publish 必须保留正式展示名`
);

requireCondition(
  publishingDoc.includes("@unifyport") && publishingDoc.includes("MIT-0"),
  `${PUBLISHING_DOC_PATH}: 缺少 @unifyport owner 或 MIT-0 决策`
);
requireCondition(
  publishingDocZh.includes("@unifyport") && publishingDocZh.includes("MIT-0"),
  `${PUBLISHING_DOC_ZH_PATH}: 缺少 @unifyport owner 或 MIT-0 决策`
);
requireCondition(
  /"private":\s*true/u.test(mcpPackage),
  "packages/mcp/package.json: MCP 公开状态变化后必须重新评审 ClawHub 发布边界"
);

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`[clawhub:check] ${failure}\n`);
  throw new Error(`ClawHub Skill 检查发现 ${String(failures.length)} 项问题`);
}

process.stderr.write(
  `[clawhub:check] validated ${SKILL_PATH} and fixed @unifyport publication boundary\n`
);
