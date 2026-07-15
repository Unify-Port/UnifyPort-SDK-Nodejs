import { generateArtifacts, writeGeneratedArtifacts } from "./lib/generator.js";

// 生成过程只读取本仓库公开契约，并仅写入可重复生成的派生文件。
await writeGeneratedArtifacts(await generateArtifacts());
