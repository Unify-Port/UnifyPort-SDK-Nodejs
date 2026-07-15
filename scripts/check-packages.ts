import { execFile } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import { findPublicSafetyIssues } from "./lib/public-safety.js";

const run = promisify(execFile);
const root = resolve(new URL("..", import.meta.url).pathname);

interface PackageDefinition {
  readonly directory: string;
  readonly required: readonly string[];
  readonly executable?: string;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue;
}

const packages = [
  {
    directory: "packages/sdk",
    required: [
      "package/package.json",
      "package/README.md",
      "package/dist/index.js",
      "package/dist/index.d.ts",
      "package/dist/device/index.js",
      "package/dist/device/index.d.ts"
    ]
  },
  {
    directory: "packages/mcp",
    required: [
      "package/package.json",
      "package/README.md",
      "package/dist/index.js",
      "package/dist/index.d.ts",
      "package/dist/cli.js"
    ],
    executable: "package/dist/cli.js"
  }
] as const satisfies readonly PackageDefinition[];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isJsonObject(value: unknown): value is JsonObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((child) => isJsonValue(child));
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.every((child) => isJsonValue(child));
  return isJsonObject(value);
}

async function checkPackage(
  definition: PackageDefinition,
  temporaryDirectory: string
): Promise<void> {
  const directory = resolve(root, definition.directory);
  const before = new Set(await readdir(temporaryDirectory));
  await run("pnpm", ["pack", "--pack-destination", temporaryDirectory], {
    cwd: directory,
    maxBuffer: 10 * 1024 * 1024
  });
  const after = await readdir(temporaryDirectory);
  const archiveName = after.find((name) => name.endsWith(".tgz") && !before.has(name));
  assert(archiveName !== undefined, `${definition.directory} 未生成 tarball`);
  const archive = join(temporaryDirectory, archiveName);
  const { stdout: listOutput } = await run("tar", ["-tzf", archive], {
    maxBuffer: 20 * 1024 * 1024
  });
  const entries = new Set(listOutput.trim().split("\n"));

  for (const required of definition.required) {
    assert(entries.has(required), `${archiveName} 缺少 ${required}`);
  }
  for (const entry of entries) {
    assert(
      !entry.startsWith("package/src/"),
      `${archiveName} 不应发布 TypeScript source: ${entry}`
    );
    assert(!entry.startsWith("package/contracts/"), `${archiveName} 不应内嵌 workspace contract`);
    assert(!entry.endsWith(".tsbuildinfo"), `${archiveName} 不应发布 tsbuildinfo`);
    // declaration 是公开类型的一部分；除此之外的 .ts 暗示 files/构建边界配置错误。
    assert(
      !entry.endsWith(".ts") || entry.endsWith(".d.ts"),
      `${archiveName} 含未编译 .ts: ${entry}`
    );
  }

  const extractedDirectory = await mkdtemp(join(temporaryDirectory, "unpacked-"));
  await run("tar", ["-xzf", archive, "-C", extractedDirectory], {
    maxBuffer: 20 * 1024 * 1024
  });
  // tarball 必须重新扫描；源码树忽略 dist，不能据此证明最终发布内容安全。
  const publicSafety = await findPublicSafetyIssues(extractedDirectory, new Set());
  assert(
    publicSafety.findings.length === 0,
    `${archiveName} 公开信息检查失败: ${publicSafety.findings
      .map((finding) => `${finding.file} (${finding.rule})`)
      .join(", ")}`
  );

  if (definition.executable !== undefined) {
    // 保存已收窄值，避免异步回调重新读取 optional property 时丢失类型保证。
    const executable = definition.executable;
    const { stdout: verbose } = await run("tar", ["-tvzf", archive], {
      maxBuffer: 20 * 1024 * 1024
    });
    const executableLine = verbose.split("\n").find((line) => line.trimEnd().endsWith(executable));
    assert(executableLine?.startsWith("-rwx") === true, `${executable} 缺少 executable mode`);
  }

  // 在真实 tarball 上运行发布检查，避免只验证源码目录而漏掉 files/权限问题。
  await run("pnpm", ["exec", "publint", "run", archive, "--strict"], {
    cwd: root,
    maxBuffer: 20 * 1024 * 1024
  });
  await run("pnpm", ["exec", "attw", archive, "--profile", "esm-only", "--no-definitely-typed"], {
    cwd: root,
    maxBuffer: 20 * 1024 * 1024
  });

  const parsedPackageJson: unknown = JSON.parse(
    await readFile(join(directory, "package.json"), "utf8")
  );
  assert(isJsonObject(parsedPackageJson), `${definition.directory}/package.json 不是 JSON object`);
  const exportsValue = parsedPackageJson["exports"];
  assert(
    exportsValue === undefined || isJsonObject(exportsValue),
    `${definition.directory}/package.json exports 不是 object`
  );
  for (const [entrypoint, conditions] of Object.entries(exportsValue ?? {})) {
    assert(
      isJsonObject(conditions),
      `${definition.directory} export ${entrypoint} 不是 condition map`
    );
    for (const target of Object.values(conditions)) {
      assert(
        typeof target === "string",
        `${definition.directory} export ${entrypoint} target 不是 string`
      );
      const archiveTarget = `package/${target.replace(/^\.\//, "")}`;
      assert(
        entries.has(archiveTarget),
        `${archiveName} export ${entrypoint} 指向缺失文件 ${target}`
      );
    }
  }
  process.stderr.write(`[package:check] ${archiveName} passed\n`);
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "unifyport-pack-"));
try {
  for (const definition of packages) await checkPackage(definition, temporaryDirectory);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
