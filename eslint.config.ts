import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

// ESLint 10 已原生提供 flat config 组合器，使用官方入口避免依赖已废弃的兼容 API。
export default defineConfig(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**", "packages/*/src/generated/**"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // 根目录没有默认 tsconfig.json；显式列出工程，确保 tooling 与两个 package 都做类型感知 lint。
        project: [
          "./tsconfig.tooling.json",
          "./packages/sdk/tsconfig.json",
          "./packages/mcp/tsconfig.json"
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unsafe-type-assertion": "error"
    }
  },
  {
    files: ["scripts/**/*.ts", "eslint.config.ts", "vitest.config.ts"],
    rules: {
      "no-console": "off"
    }
  },
  {
    files: ["packages/*/tests/**/*.ts"],
    rules: {
      // 测试中的 fetch/generator stub 需要保持 Promise 签名；强制伪造 await/返回类型会降低断言可读性。
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/require-await": "off"
    }
  }
);
