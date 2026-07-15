import type { DeviceClientConfig } from "@unifyport/sdk-node";
import { UnifyPortConfigurationError } from "@unifyport/sdk-node";

export interface McpPermissions {
  readonly enableWrites: boolean;
  readonly enableDestructive: boolean;
}

export interface McpRuntimeConfig {
  readonly device: DeviceClientConfig;
  readonly permissions: McpPermissions;
}

function present(value: string | undefined): string | undefined {
  return value === undefined || value.trim() === "" ? undefined : value;
}

function enabled(value: string | undefined): boolean {
  // 只有精确 true 才扩大权限；拼写错误和未知值都按 false 收紧处理。
  return value === "true";
}

export function configFromEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env
): McpRuntimeConfig {
  const deviceBaseUrl = present(environment["UNIFYPORT_DEVICE_API_BASE_URL"]);
  const deviceApiKey = present(environment["UNIFYPORT_DEVICE_API_KEY"]);
  const allowInsecureHttp = enabled(environment["UNIFYPORT_ALLOW_INSECURE_HTTP"]);

  // MCP 只承载 Device API，启动时必须有完整 credential pair，避免产生看似可用的空 registry。
  if (deviceBaseUrl === undefined || deviceApiKey === undefined) {
    throw new UnifyPortConfigurationError(
      "Device API 必须同时配置 UNIFYPORT_DEVICE_API_BASE_URL 与 UNIFYPORT_DEVICE_API_KEY"
    );
  }

  const enableWrites = enabled(environment["UNIFYPORT_MCP_ENABLE_WRITES"]);
  const enableDestructive =
    enableWrites && enabled(environment["UNIFYPORT_MCP_ENABLE_DESTRUCTIVE"]);
  return {
    device: {
      baseUrl: deviceBaseUrl,
      apiKey: deviceApiKey,
      allowInsecureHttp
    },
    permissions: { enableWrites, enableDestructive }
  };
}
