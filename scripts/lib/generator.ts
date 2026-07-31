import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import openapiTS, { astToString, type OpenAPI3 } from "openapi-typescript";
import { format, resolveConfig } from "prettier";
import YAML from "yaml";

import {
  apiReferencePath,
  generateApiReferenceArtifacts,
  type ApiReferenceSource
} from "./api-reference.js";
import {
  addLanguageNavigation,
  translateGeneratedMarkdownToEnglish
} from "./api-reference-i18n.js";

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

interface JsonObject {
  [key: string]: JsonValue;
}

// 公开 SDK 只以 Device API 契约为输入，避免其他服务被生成链重新带回发布产物。
type ApiId = "device";
type HttpMethod = (typeof HTTP_METHODS)[number];
type McpExposure = Mutability | "never";
type Mutability = "destructive" | "read" | "write";
type OperationPolicyKey = `${ApiId}:${string}`;

interface ApiDefinition {
  readonly id: ApiId;
  readonly contract: string;
  readonly schemaOutput: string;
  readonly catalogOutput: string;
  readonly clientOutput: string;
  readonly catalogExport: string;
  readonly className: string;
  readonly configType: string;
  readonly runtimeFactory: string;
}

interface OperationDescriptor {
  readonly api: ApiId;
  readonly method: HttpMethod;
  readonly path: string;
  readonly operationId: string;
  readonly summary: string;
  readonly description: string;
  readonly tag: string;
  readonly authRequired: boolean;
  readonly parameters: readonly JsonObject[];
  readonly requestBody?: JsonObject;
  readonly responses: JsonObject;
}

interface OperationPolicy {
  readonly mutability: Mutability;
  readonly retryable: boolean;
  readonly secretInput: boolean;
  readonly secretOutput: boolean;
  readonly mcpExposure: McpExposure;
}

interface PolicyOverride {
  readonly mutability?: Mutability;
  readonly retryable?: boolean;
  readonly secretInput?: boolean;
  readonly secretOutput?: boolean;
  readonly mcpExposure?: McpExposure;
}

interface ApiGenerationResult {
  readonly api: ApiDefinition;
  readonly operations: readonly OperationDescriptor[];
  readonly document: OpenApiDocument;
}

interface LocationAccumulator {
  readonly properties: JsonObject;
  readonly required: string[];
}

type OpenApiDocument = JsonObject & OpenAPI3;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
// 独占目录由 generate 先清理，避免 tag 或 operation 改名后把旧参考页留在公开仓库。
const GENERATED_ARTIFACT_DIRECTORIES = [
  { path: "packages/sdk/src/generated", suffix: ".ts", cleanBeforeWrite: false },
  { path: "packages/sdk/tests/generated", suffix: ".ts", cleanBeforeWrite: true },
  { path: "docs/api-reference", suffix: ".md", cleanBeforeWrite: true },
  { path: "docs/zh-CN/api-reference", suffix: ".md", cleanBeforeWrite: true }
] as const;
// 覆盖 OpenAPI Path Item 允许的全部 HTTP method，避免未来新增合法 operation 时被静默漏生成。
const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;

// 这些覆盖项记录“仅从 HTTP method 无法推导”的业务语义，避免安全策略散落在 MCP 实现里。
const POLICY_OVERRIDES: Readonly<Partial<Record<OperationPolicyKey, PolicyOverride>>> = {
  "device:deleteAccount": { mutability: "destructive" },
  "device:deleteConversationLabel": { mutability: "destructive" },
  "device:leaveGroup": { mutability: "destructive" },
  "device:revokeMessage": { mutability: "destructive" },
  "device:deleteWebhookEndpoint": { mutability: "destructive" },
  "device:updateGroupMembers": { mutability: "destructive" },
  "device:updateGroupJoinRequests": { mutability: "destructive" },
  "device:createApiKey": { secretOutput: true, mcpExposure: "never" },
  "device:rotateApiKey": { secretOutput: true, mcpExposure: "never" },
  "device:getGroupInviteCode": { secretOutput: true, mcpExposure: "never" },
  // 账号资料与回复句柄可能包含身份信息或可复用能力，统一按敏感输出处理并永久排除模型面。
  "device:getAccount": { secretOutput: true, mcpExposure: "never" },
  "device:listAccounts": { secretOutput: true, mcpExposure: "never" },
  "device:createAccount": { secretInput: true, secretOutput: true, mcpExposure: "never" },
  "device:updateAccount": { secretInput: true, secretOutput: true, mcpExposure: "never" },
  "device:sendMessage": { secretInput: true, secretOutput: true, mcpExposure: "never" },
  "device:getAccountAuthState": { secretOutput: true, mcpExposure: "never" },
  "device:checkAccountQrAuth": { secretOutput: true, mcpExposure: "never" },
  "device:startAccountAuth": { secretOutput: true, mcpExposure: "never" },
  "device:startAccountQrAuth": { secretOutput: true, mcpExposure: "never" },
  "device:submitAccountAuthCode": { secretInput: true, mcpExposure: "never" },
  "device:submitAccountAuthPassword": { secretInput: true, mcpExposure: "never" },
  "device:importAccountAuthSession": { secretInput: true, mcpExposure: "never" },
  "device:createWebhookEndpoint": { secretInput: true, mcpExposure: "never" },
  "device:updateWebhookEndpoint": { secretInput: true, mcpExposure: "never" }
};

// MCP 是更窄的模型权限面；新增 operation 默认不进入，必须逐项审查后才能加入显式 allowlist。
const MCP_EXPOSURE_ALLOWLIST: Readonly<Partial<Record<OperationPolicyKey, Mutability>>> = {
  "device:getWorkspace": "read",
  "device:listApiKeys": "read",
  "device:listProviderRegions": "read",
  "device:updateApiKeyStatus": "write"
};

// 重试也采用显式 allowlist；未来新增 GET 在完成幂等性审查前保持不重试。
const RETRY_ALLOWLIST: ReadonlySet<OperationPolicyKey> = new Set([
  "device:getAccount",
  "device:getAccountAuthState",
  "device:getContact",
  "device:getConversation",
  "device:getGroup",
  "device:getGroupInviteCode",
  "device:getWebhookEndpoint",
  "device:getWorkspace",
  "device:listAccounts",
  "device:listApiKeys",
  "device:listContactBlocklist",
  "device:listContacts",
  "device:listConversationLabels",
  "device:listConversationMembers",
  "device:listConversations",
  "device:listGroupJoinRequests",
  "device:listGroups",
  "device:listProviderRegions",
  "device:listWebhookEndpoints"
]);

const API_DEFINITIONS = [
  {
    id: "device",
    contract: "contracts/device.openapi.yaml",
    schemaOutput: "packages/sdk/src/generated/device/schema.ts",
    catalogOutput: "packages/sdk/src/generated/device/operation-catalog.ts",
    clientOutput: "packages/sdk/src/generated/device/client.ts",
    catalogExport: "deviceOperations",
    className: "UnifyPortDeviceClient",
    configType: "DeviceClientConfig",
    runtimeFactory: "createDeviceRuntime"
  }
] as const satisfies readonly ApiDefinition[];

function isJsonObject(value: unknown): value is JsonObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((child) => isJsonValue(child));
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.every((child) => isJsonValue(child));
  return isJsonObject(value);
}

function isOpenApiDocument(value: unknown): value is OpenApiDocument {
  if (!isJsonObject(value)) return false;
  const info = value["info"];
  return (
    typeof value["openapi"] === "string" &&
    isJsonObject(info) &&
    typeof info["title"] === "string" &&
    typeof info["version"] === "string"
  );
}

function parseOpenApiDocument(source: string, contract: string): OpenApiDocument {
  // YAML.parse 的返回值由外部契约决定；先收窄到可递归验证的 JSON，再进入生成逻辑。
  const parsed: unknown = YAML.parse(source);
  if (!isOpenApiDocument(parsed)) {
    throw new Error(`${contract} 不是有效的 OpenAPI JSON object`);
  }
  return parsed;
}

function parseJsonObject(source: string, description: string): JsonObject {
  // JSON.parse 的静态类型无法证明文件结构，边界校验避免生成器内部传播 any。
  const parsed: unknown = JSON.parse(source);
  if (!isJsonObject(parsed)) throw new Error(`${description} 不是 JSON object`);
  return parsed;
}

function optionalObject(parent: JsonObject | undefined, key: string): JsonObject | undefined {
  const value = parent?.[key];
  if (value === undefined) return undefined;
  if (!isJsonObject(value)) throw new Error(`${key} 必须是 object`);
  return value;
}

function optionalArray(parent: JsonObject, key: string): JsonValue[] | undefined {
  const value = parent[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`${key} 必须是 array`);
  return value;
}

function optionalString(parent: JsonObject, key: string): string | undefined {
  const value = parent[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${key} 必须是 string`);
  return value;
}

function clone<T extends JsonValue>(value: T): T {
  return structuredClone(value);
}

function resolveLocalRef(document: JsonObject, ref: string): JsonValue {
  if (!ref.startsWith("#/")) {
    throw new Error(`仅支持本地 OpenAPI ref，收到: ${ref}`);
  }

  let current: JsonValue = document;
  for (const part of ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"))) {
    if (!isJsonObject(current)) throw new Error(`无法解析 OpenAPI ref: ${ref}`);
    const next: JsonValue | undefined = current[part];
    if (next === undefined) throw new Error(`无法解析 OpenAPI ref: ${ref}`);
    current = next;
  }
  return current;
}

function resolveObject(document: JsonObject, value: JsonValue): JsonObject {
  if (!isJsonObject(value)) throw new Error("OpenAPI 节点必须是 object");
  const ref = value["$ref"];
  if (typeof ref === "string") {
    return resolveObject(document, resolveLocalRef(document, ref));
  }
  return value;
}

function firstTag(operation: JsonObject): string {
  const tags = optionalArray(operation, "tags");
  const first = tags?.[0];
  return typeof first === "string" ? first : "Other";
}

function collectOperations(
  api: ApiDefinition,
  document: OpenApiDocument
): readonly OperationDescriptor[] {
  const operationIds = new Set<string>();
  const operations: OperationDescriptor[] = [];
  const paths = optionalObject(document, "paths") ?? {};

  for (const [path, rawPathItem] of Object.entries(paths)) {
    const pathItem = resolveObject(document, rawPathItem);
    for (const method of HTTP_METHODS) {
      const rawOperation = pathItem[method];
      if (rawOperation === undefined) continue;

      const operation = resolveObject(document, rawOperation);
      const operationId = optionalString(operation, "operationId");
      if (operationId === undefined || operationId === "") {
        throw new Error(`${api.id} ${method.toUpperCase()} ${path} 缺少 operationId`);
      }
      if (operationIds.has(operationId)) {
        throw new Error(`${api.id} operationId 重复: ${operationId}`);
      }
      operationIds.add(operationId);

      const rawParameters = [
        ...(optionalArray(pathItem, "parameters") ?? []),
        ...(optionalArray(operation, "parameters") ?? [])
      ];
      const parameters = rawParameters.map((parameter) => resolveObject(document, parameter));
      const rawRequestBody = operation["requestBody"];
      const requestBody =
        rawRequestBody === undefined ? undefined : resolveObject(document, rawRequestBody);
      const operationSecurity = optionalArray(operation, "security");
      const documentSecurity = optionalArray(document, "security");
      const responses = optionalObject(operation, "responses") ?? {};
      const descriptor = {
        api: api.id,
        method,
        path,
        operationId,
        summary: optionalString(operation, "summary") ?? operationId,
        description: optionalString(operation, "description") ?? "",
        tag: firstTag(operation),
        authRequired: (operationSecurity ?? documentSecurity ?? []).length > 0,
        parameters,
        responses,
        ...(requestBody === undefined ? {} : { requestBody })
      } satisfies OperationDescriptor;
      operations.push(descriptor);
    }
  }

  return operations.sort((left, right) => left.operationId.localeCompare(right.operationId));
}

function operationPolicyKey(operation: OperationDescriptor): OperationPolicyKey {
  return `${operation.api}:${operation.operationId}`;
}

function defaultPolicy(operation: OperationDescriptor): OperationPolicy {
  // HEAD/OPTIONS 不改变资源；TRACE 保守按 write 分类，且所有新 operation 仍默认禁用重试和 MCP。
  const readOnly = ["get", "head", "options"].includes(operation.method);
  const defaultMutability: Mutability = readOnly
    ? "read"
    : operation.method === "delete"
      ? "destructive"
      : "write";
  const key = operationPolicyKey(operation);
  const override: PolicyOverride | undefined = POLICY_OVERRIDES[key];
  const mutability = override?.mutability ?? defaultMutability;
  const retryable = override?.retryable ?? RETRY_ALLOWLIST.has(key);
  const secretInput = override?.secretInput ?? false;
  const secretOutput = override?.secretOutput ?? false;
  const allowlistedExposure = MCP_EXPOSURE_ALLOWLIST[key];
  if (allowlistedExposure !== undefined && allowlistedExposure !== mutability) {
    throw new Error(
      `${operation.operationId} MCP allowlist=${allowlistedExposure} 与 mutability=${mutability} 不一致`
    );
  }
  const mcpExposure =
    override?.mcpExposure ??
    (secretInput || secretOutput ? "never" : (allowlistedExposure ?? "never"));

  return {
    mutability,
    retryable,
    secretInput,
    secretOutput,
    mcpExposure
  };
}

function validatePolicyConfiguration(operations: readonly OperationDescriptor[]): void {
  const policyKeys = new Set([
    ...Object.keys(POLICY_OVERRIDES),
    ...Object.keys(MCP_EXPOSURE_ALLOWLIST),
    ...RETRY_ALLOWLIST
  ]);
  for (const key of policyKeys) {
    const matches = operations.filter((operation) => operationPolicyKey(operation) === key).length;
    if (matches !== 1) {
      // API 维度 key 防止同名 operation 继承策略；悬空或歧义配置都在生成阶段失败。
      throw new Error(`operation policy key 必须恰好匹配一个 operation: ${key}`);
    }
  }
}

function operationHasRequiredInput(operation: OperationDescriptor): boolean {
  return (
    operation.parameters.some((parameter) => parameter["required"] === true) ||
    operation.requestBody?.["required"] === true
  );
}

function toolName(operation: OperationDescriptor): string {
  const snakeCase = operation.operationId
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replaceAll(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
  return `${operation.api}_${snakeCase}`;
}

function rewriteSchemaRefs(value: JsonValue, referencedSchemas: Set<string>): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteSchemaRefs(item, referencedSchemas));
  }
  if (!isJsonObject(value)) return value;

  const output: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "$ref" && typeof child === "string" && child.startsWith("#/components/schemas/")) {
      const schemaName = child.slice("#/components/schemas/".length);
      referencedSchemas.add(schemaName);
      output[key] = `#/$defs/${schemaName}`;
    } else {
      output[key] = rewriteSchemaRefs(child, referencedSchemas);
    }
  }
  return output;
}

function attachReferencedSchemas(
  document: OpenApiDocument,
  rootSchema: JsonObject,
  initialReferences: Iterable<string>
): JsonObject {
  const referencedSchemas = new Set(initialReferences);
  const definitions: JsonObject = {};
  const pending = [...referencedSchemas];
  const schemas = optionalObject(optionalObject(document, "components"), "schemas");

  while (pending.length > 0) {
    const schemaName = pending.shift();
    if (schemaName === undefined) break;
    if (schemaName in definitions) continue;

    const schema = schemas?.[schemaName];
    if (schema === undefined) {
      throw new Error(`缺少 components.schemas.${schemaName}`);
    }
    const before = new Set(referencedSchemas);
    definitions[schemaName] = rewriteSchemaRefs(clone(schema), referencedSchemas);
    for (const candidate of referencedSchemas) {
      if (!before.has(candidate)) pending.push(candidate);
    }
  }

  return Object.keys(definitions).length === 0 ? rootSchema : { ...rootSchema, $defs: definitions };
}

function schemaForOperationInput(
  document: OpenApiDocument,
  operation: OperationDescriptor
): JsonObject {
  const referencedSchemas = new Set<string>();
  const locations = new Map<string, LocationAccumulator>();

  for (const parameter of operation.parameters) {
    const name = optionalString(parameter, "name");
    const location = optionalString(parameter, "in");
    if (name === undefined || location === undefined) {
      throw new Error(`${operation.operationId} parameter 缺少 name 或 in`);
    }
    if (location === "header") {
      // X-Api-Key 只能来自 client 启动配置，不能作为单次 operation 输入暴露。
      if (name.toLowerCase() === "x-api-key") continue;
    }

    let accumulator = locations.get(location);
    if (accumulator === undefined) {
      accumulator = { properties: {}, required: [] };
      locations.set(location, accumulator);
    }
    const rawSchema: JsonValue = parameter["schema"] ?? {};
    const parameterSchema = rewriteSchemaRefs(clone(rawSchema), referencedSchemas);
    const description = optionalString(parameter, "description");
    if (
      description !== undefined &&
      isJsonObject(parameterSchema) &&
      parameterSchema["description"] === undefined
    ) {
      parameterSchema["description"] = description;
    }
    accumulator.properties[name] = parameterSchema;
    if (parameter["required"] === true) accumulator.required.push(name);
  }

  const locationSchemas: JsonObject = {};
  const requiredLocations: string[] = [];
  for (const [location, accumulator] of locations) {
    const locationSchema: JsonObject = {
      type: "object",
      additionalProperties: false,
      properties: accumulator.properties
    };
    if (accumulator.required.length > 0) {
      locationSchema["required"] = accumulator.required;
      requiredLocations.push(location);
    }
    locationSchemas[location] = locationSchema;
  }

  const rootProperties: JsonObject = {};
  const rootRequired: string[] = [];
  if (Object.keys(locationSchemas).length > 0) {
    const paramsSchema: JsonObject = {
      type: "object",
      additionalProperties: false,
      properties: locationSchemas
    };
    if (requiredLocations.length > 0) paramsSchema["required"] = requiredLocations;
    rootProperties["params"] = paramsSchema;
    if (requiredLocations.length > 0) rootRequired.push("params");
  }

  if (operation.requestBody !== undefined) {
    const content = optionalObject(operation.requestBody, "content");
    const jsonContent = optionalObject(content, "application/json");
    const bodySchema = jsonContent?.["schema"];
    if (bodySchema === undefined) {
      throw new Error(`${operation.operationId} 仅支持 application/json requestBody`);
    }
    rootProperties["body"] = rewriteSchemaRefs(clone(bodySchema), referencedSchemas);
    if (operation.requestBody["required"] === true) rootRequired.push("body");
  }

  const root: JsonObject = {
    type: "object",
    additionalProperties: false,
    properties: rootProperties
  };
  if (rootRequired.length > 0) root["required"] = rootRequired;
  return attachReferencedSchemas(document, root, referencedSchemas);
}

function schemaForOperationOutput(
  document: OpenApiDocument,
  operation: OperationDescriptor
): JsonObject {
  const referencedSchemas = new Set<string>();
  const successSchemas: JsonValue[] = [];

  for (const [status, rawResponse] of Object.entries(operation.responses)) {
    if (!/^(2\d\d|3\d\d)$/.test(status)) continue;
    const response = resolveObject(document, rawResponse);
    const content = optionalObject(response, "content");
    const jsonContent = optionalObject(content, "application/json");
    const schema = jsonContent?.["schema"];
    successSchemas.push(
      schema === undefined ? { type: "null" } : rewriteSchemaRefs(clone(schema), referencedSchemas)
    );
  }

  const uniqueSchemas = [
    ...new Map(successSchemas.map((schema) => [JSON.stringify(schema), schema])).values()
  ];
  const dataSchema: JsonValue =
    uniqueSchemas.length === 0
      ? {}
      : uniqueSchemas.length === 1
        ? (uniqueSchemas[0] ?? {})
        : { oneOf: uniqueSchemas };
  const root: JsonObject = {
    type: "object",
    additionalProperties: false,
    required: ["data", "meta"],
    properties: {
      data: dataSchema,
      meta: {
        type: "object",
        additionalProperties: false,
        required: ["status"],
        properties: {
          status: { type: "integer", minimum: 100, maximum: 599 },
          requestId: { type: "string" }
        }
      }
    }
  };
  const widened = widenUnsafeNumericOutputs(
    attachReferencedSchemas(document, root, referencedSchemas)
  );
  if (!isJsonObject(widened)) throw new Error(`${operation.operationId} output schema 非 object`);
  return widened;
}

function widenUnsafeNumericOutputs(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map((item) => widenUnsafeNumericOutputs(item));
  if (!isJsonObject(value)) return value;

  const transformed: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    transformed[key] = widenUnsafeNumericOutputs(child);
  }
  const schemaType = transformed["type"];
  const typeList = Array.isArray(schemaType) ? schemaType : [schemaType];
  if (
    (typeList.includes("integer") || typeList.includes("number")) &&
    !typeList.includes("string")
  ) {
    const format = transformed["format"];
    const minimum = transformed["minimum"];
    const maximum = transformed["maximum"];
    const explicitlySafe =
      format === "int32" ||
      format === "uint32" ||
      (typeof minimum === "number" &&
        Number.isFinite(minimum) &&
        minimum >= Number.MIN_SAFE_INTEGER &&
        typeof maximum === "number" &&
        Number.isFinite(maximum) &&
        maximum <= Number.MAX_SAFE_INTEGER);
    if (explicitlySafe) return transformed;

    // JSON Schema number 也允许整数；未被安全上下界证明的数值都可能被 runtime 规范化为 string。
    const unsigned = format === "uint64" || (typeof minimum === "number" && minimum >= 0);
    return {
      oneOf: [
        transformed,
        {
          type: "string",
          pattern: unsigned ? "^[0-9]+$" : "^-?[0-9]+$"
        }
      ]
    };
  }
  return transformed;
}

function generatedHeader(source: string): string {
  return `/**\n * 此文件由 \`pnpm generate\` 根据 ${source} 生成。\n * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。\n */\n`;
}

function generateCatalog(
  api: ApiDefinition,
  operations: readonly OperationDescriptor[],
  document: OpenApiDocument
): string {
  const entries = operations
    .map((operation) => {
      const policy = defaultPolicy(operation);
      const metadata = {
        api: operation.api,
        operationId: operation.operationId,
        method: operation.method.toUpperCase(),
        path: operation.path,
        tag: operation.tag,
        summary: operation.summary,
        description: operation.description,
        authRequired: operation.authRequired,
        toolName: toolName(operation),
        ...policy,
        inputSchema: schemaForOperationInput(document, operation),
        outputSchema: schemaForOperationOutput(document, operation)
      };
      return `  ${JSON.stringify(operation.operationId)}: ${JSON.stringify(metadata, null, 2).replaceAll("\n", "\n  ")},`;
    })
    .join("\n");

  return `${generatedHeader(api.contract)}import type { OperationMetadata } from "../../core/types.js";\n\nexport const ${api.catalogExport} = {\n${entries}\n} as const satisfies Readonly<Record<string, OperationMetadata>>;\n`;
}

function generateClient(api: ApiDefinition, operations: readonly OperationDescriptor[]): string {
  const methods = operations
    .map((operation) => {
      const required = operationHasRequiredInput(operation);
      const requestDefault = required ? "" : " = {}";
      const returnType = `ApiResult<OperationData<operations[${JSON.stringify(operation.operationId)}]>>`;
      const executeType = `<OperationData<operations[${JSON.stringify(operation.operationId)}]>>`;
      // 显式方法先读取 text，再由 runtime 保留无法由 JavaScript number 精确表达的整数 token。
      const parseOverride = `\n          parseAs: "text",`;

      return `  /** ${operation.summary.replaceAll("*/", "* /")} */
  public async ${operation.operationId}(
    request: FetchOptions<operations[${JSON.stringify(operation.operationId)}]>${requestDefault},
    execution: RequestExecutionOptions = {},
  ): Promise<${returnType}> {
    const operation = ${api.catalogExport}[${JSON.stringify(operation.operationId)}];
    return await this.#runtime.execute${executeType}(operation, async () =>
      await this.#client.${operation.method.toUpperCase()}(${JSON.stringify(operation.path)}, {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",${parseOverride}
      }),
    );
  }`;
    })
    .join("\n\n");

  return `${generatedHeader(api.contract)}import createClient, { type Client, type FetchOptions } from "openapi-fetch";

import { ${api.runtimeFactory} } from "../../core/runtime.js";
import type {
  ApiResult,
  ApiRuntime,
  ${api.configType},
  OperationData,
  RequestExecutionOptions,
} from "../../core/types.js";
import { ${api.catalogExport} } from "./operation-catalog.js";
import type { operations, paths } from "./schema.js";

export class ${api.className} {
  readonly #runtime: ApiRuntime;
  readonly #client: Client<paths>;

  public constructor(config: ${api.configType}) {
    this.#runtime = ${api.runtimeFactory}(config);
    // 底层 OpenAPI client 保持私有，避免绕过安全整数解析、错误归一化和 operation policy。
    this.#client = createClient<paths>({
      baseUrl: this.#runtime.baseUrl,
      fetch: this.#runtime.rawFetch,
    });
  }

${methods}
}
`;
}

function generateToolInvokers(allOperations: readonly OperationDescriptor[]): string {
  const cases = allOperations
    .map((operation) => {
      return `    case ${JSON.stringify(toolName(operation))}: {
      const client = clients.device;
      return await client.${operation.operationId}(
        input as Parameters<UnifyPortDeviceClient[${JSON.stringify(operation.operationId)}]>[0],
        { signal },
      );
    }`;
    })
    .join("\n");

  return `${generatedHeader("contracts/device.openapi.yaml")}import type { UnifyPortDeviceClient } from "@unifyport/sdk-node";

export interface ToolClients {
  readonly device: UnifyPortDeviceClient;
}

// 参数已经过同一份 OpenAPI JSON Schema 校验；断言只跨越 JSON Schema 与 TypeScript 无法自动关联的边界。
export async function invokeGeneratedTool(
  name: string,
  input: Record<string, unknown>,
  clients: ToolClients,
  signal: AbortSignal,
): Promise<unknown> {
  switch (name) {
${cases}
    default:
      throw new Error(\`Unknown generated tool: \${name}\`);
  }
}
`;
}

function generateCoverageMarkdown(apiResults: readonly ApiGenerationResult[]): string {
  const lines = [
    "<!-- 此文件由 pnpm generate 生成；修改契约或生成器后重新生成。 -->",
    "# API 覆盖率",
    "",
    "本表把 Device API 的每个 `operationId` 映射到 SDK 显式方法和 MCP 暴露策略。`never` 表示该 operation 仍由 SDK 支持，但因权限或 secret 边界不进入模型工具面。",
    "",
    "| API | operationId | Method | Path | SDK | MCP policy | Retry | Reason |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |"
  ];

  for (const { operations } of apiResults) {
    for (const operation of operations) {
      const policy = defaultPolicy(operation);
      const reasons = [
        policy.secretInput ? "secret input" : "",
        policy.secretOutput ? "secret output" : ""
      ].filter(Boolean);
      lines.push(
        `| ${operation.api} | [\`${operation.operationId}\`](${apiReferencePath(operation)}) | ${operation.method.toUpperCase()} | \`${operation.path}\` | explicit | ${policy.mcpExposure} | ${policy.retryable ? "safe" : "never"} | ${reasons.join(", ") || "-"} |`
      );
    }
  }

  const total = apiResults.reduce((sum, result) => sum + result.operations.length, 0);
  const mcp = apiResults
    .flatMap((result) => result.operations)
    .filter((operation) => defaultPolicy(operation).mcpExposure !== "never").length;
  // 生成文件末尾只保留一个换行，避免首个公开提交出现无意义的空白行噪音。
  lines.push(
    "",
    `- 公开 operation：${String(total)}`,
    `- SDK 显式方法：${String(total)}`,
    `- 可进入 MCP registry 的 operation：${String(mcp)}`,
    `- MCP 永久排除：${String(total - mcp)}`
  );
  return `${lines.join("\n")}\n`;
}

function generateMetadata(
  apiResults: readonly ApiGenerationResult[],
  serverVersion: string
): string {
  const summary = apiResults.map(({ api, operations }) => ({
    api: api.id,
    sourceOperations: operations.length,
    sdkMethods: operations.length,
    mcpEligible: operations.filter((operation) => defaultPolicy(operation).mcpExposure !== "never")
      .length
  }));

  // 对外 metadata 只包含公开契约覆盖率，避免把开发环境或实现溯源打进可发布 package。
  return `${generatedHeader("contracts/device.openapi.yaml 与 MCP package version")}export const generatedServerVersion = ${JSON.stringify(serverVersion)};

export const generatedCoverage = ${JSON.stringify(summary, null, 2)} as const;
`;
}

export async function generateArtifacts(): Promise<ReadonlyMap<string, string>> {
  const artifacts = new Map<string, string>();
  const apiResults: ApiGenerationResult[] = [];

  for (const api of API_DEFINITIONS) {
    const source = await readFile(resolve(ROOT, api.contract), "utf8");
    const document = parseOpenApiDocument(source, api.contract);
    const operations = collectOperations(api, document);
    const typeAst = await openapiTS(document, {
      alphabetize: true,
      // openapi-fetch 0.17 的 Readable helper 会把 readonly array 展开成对象；保留 mutable array 才能维持响应类型。
      immutable: false
    });
    artifacts.set(api.schemaOutput, `${generatedHeader(api.contract)}${astToString(typeAst)}`);
    artifacts.set(api.catalogOutput, generateCatalog(api, operations, document));
    artifacts.set(api.clientOutput, generateClient(api, operations));
    apiResults.push({ api, operations, document });
  }

  const allOperations = apiResults.flatMap((result) => result.operations);
  validatePolicyConfiguration(allOperations);
  for (const result of apiResults) {
    const referenceSource = {
      contract: result.api.contract,
      clientClassName: result.api.className,
      document: result.document,
      operations: result.operations.map((operation) => ({
        ...operation,
        policy: defaultPolicy(operation)
      }))
    } satisfies ApiReferenceSource;
    for (const [path, content] of generateApiReferenceArtifacts(referenceSource)) {
      // 生成的 Markdown 与类型检查 fixture 使用仓库同一份 Prettier 配置，保证 check 可重复。
      const prettierConfig = await resolveConfig(resolve(ROOT, path));
      artifacts.set(
        path,
        await format(content, {
          ...(prettierConfig ?? {}),
          filepath: resolve(ROOT, path)
        })
      );
    }
  }
  const mcpPackage = parseJsonObject(
    await readFile(resolve(ROOT, "packages/mcp/package.json"), "utf8"),
    "packages/mcp/package.json"
  );
  const serverVersion = mcpPackage["version"];
  if (typeof serverVersion !== "string") {
    throw new Error("packages/mcp/package.json version 必须是 string");
  }
  artifacts.set("packages/mcp/src/generated/tool-invokers.ts", generateToolInvokers(allOperations));
  artifacts.set(
    "packages/mcp/src/generated/metadata.ts",
    generateMetadata(apiResults, serverVersion)
  );
  const chineseCoverage = generateCoverageMarkdown(apiResults);
  const coverageArtifacts = [
    [
      "docs/api-coverage.md",
      addLanguageNavigation(
        translateGeneratedMarkdownToEnglish(chineseCoverage),
        "api-coverage.md",
        "zh-CN/api-coverage.md"
      )
    ],
    [
      "docs/zh-CN/api-coverage.md",
      addLanguageNavigation(chineseCoverage, "../api-coverage.md", "api-coverage.md")
    ]
  ] as const;
  for (const [path, content] of coverageArtifacts) {
    // 覆盖表与 Reference 使用同一格式化入口，避免 generate 后立刻出现 Prettier 漂移。
    const prettierConfig = await resolveConfig(resolve(ROOT, path));
    artifacts.set(
      path,
      await format(content, {
        ...(prettierConfig ?? {}),
        filepath: resolve(ROOT, path)
      })
    );
  }
  return artifacts;
}

export async function writeGeneratedArtifacts(
  artifacts: ReadonlyMap<string, string>
): Promise<void> {
  for (const directory of GENERATED_ARTIFACT_DIRECTORIES) {
    if (directory.cleanBeforeWrite) {
      await rm(resolve(ROOT, directory.path), { recursive: true, force: true });
    }
  }
  for (const [path, content] of artifacts) {
    const absolutePath = resolve(ROOT, path);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
    process.stderr.write(`[generate] ${relative(ROOT, absolutePath)}\n`);
  }
}

export { GENERATED_ARTIFACT_DIRECTORIES, ROOT };
