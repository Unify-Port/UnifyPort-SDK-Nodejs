import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["packages/*/src/**/*.ts"],
      // CLI 仅做 stdio bootstrap，协议行为由可注入 transport 的 server 集成测试覆盖。
      exclude: [
        "packages/*/src/generated/**",
        "packages/mcp/src/cli.ts",
        "packages/*/src/index.ts",
        "packages/sdk/src/*-api/index.ts"
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 85
      }
    }
  }
});
