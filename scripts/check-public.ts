import { findPublicSafetyIssues } from "./lib/public-safety.js";
import { ROOT } from "./lib/generator.js";

const result = await findPublicSafetyIssues(ROOT);
if (result.findings.length > 0) {
  for (const finding of result.findings) {
    process.stderr.write(`[public:check] ${finding.file}: ${finding.rule}\n`);
  }
  throw new Error(`公开信息检查发现 ${String(result.findings.length)} 项问题`);
}

process.stderr.write(`[public:check] checked ${String(result.filesChecked)} files\n`);
