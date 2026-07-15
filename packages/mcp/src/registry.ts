import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  UnifyPortApiError,
  UnifyPortError,
  deviceOperations,
  type OperationMetadata
} from "@unifyport/sdk-node";
import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";

import { invokeGeneratedTool, type ToolClients } from "./generated/tool-invokers.js";
import type { McpPermissions } from "./config.js";

type ToolSchema = Tool["inputSchema"];
type NormalizedToolSchema = ToolSchema & Readonly<Record<string, unknown>>;
const MAX_MCP_INPUT_BYTES = 256 * 1024;
const MAX_MCP_OUTPUT_BYTES = 1024 * 1024;
const MAX_SCHEMA_DEPTH = 40;
const SAFE_DIAGNOSTIC = /^[A-Za-z0-9_.:/-]+$/u;
const SENSITIVE_FIELD =
  /(?:api[_-]?key|authorization|cookie|password|secret|token|(?:^|_)code$|(?:^|_)state$|proxy|auth_payload|provider_data|provider_profile|metadata|reply_token|session)/iu;

export interface RegisteredTool {
  readonly definition: Tool;
  readonly metadata: OperationMetadata;
  readonly inputSchema: NormalizedToolSchema;
  readonly outputSchema: NormalizedToolSchema;
  readonly validateInput: SchemaValidator;
  readonly validateOutput: SchemaValidator;
}

type SchemaValidationResult =
  | { readonly valid: true; readonly data: Record<string, unknown> }
  | { readonly valid: false; readonly errorMessage: string };
type SchemaValidator = (input: unknown) => SchemaValidationResult;

export interface ToolRegistry {
  readonly definitions: readonly Tool[];
  readonly registrations: ReadonlyMap<string, RegisteredTool>;
  readonly invoke: (
    name: string,
    input: unknown,
    signal: AbortSignal
  ) => Promise<Record<string, unknown>>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function serializedSize(value: unknown, limit: number, label: string): void {
  let serialized: unknown;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error(`${label} is not JSON serializable`);
  }
  if (typeof serialized !== "string") throw new Error(`${label} is not JSON serializable`);
  if (Buffer.byteLength(serialized, "utf8") > limit) {
    throw new Error(`${label} exceeds the configured size limit`);
  }
}

function localDefinition(
  root: Readonly<Record<string, unknown>>,
  reference: string
): Readonly<Record<string, unknown>> | undefined {
  const prefix = "#/$defs/";
  if (!reference.startsWith(prefix)) return undefined;
  const definitions = root["$defs"];
  if (!isRecord(definitions)) return undefined;
  const definition = definitions[reference.slice(prefix.length)];
  return isRecord(definition) ? definition : undefined;
}

function declaredProperties(
  schema: Readonly<Record<string, unknown>>,
  root: Readonly<Record<string, unknown>>,
  depth: number
): ReadonlyMap<string, readonly Readonly<Record<string, unknown>>[]> {
  if (depth > MAX_SCHEMA_DEPTH) throw new Error("MCP schema exceeds the supported depth");
  const collected = new Map<string, Readonly<Record<string, unknown>>[]>();
  const add = (name: string, child: Readonly<Record<string, unknown>>): void => {
    collected.set(name, [...(collected.get(name) ?? []), child]);
  };
  const reference = schema["$ref"];
  if (typeof reference === "string") {
    const target = localDefinition(root, reference);
    if (target !== undefined) {
      for (const [name, children] of declaredProperties(target, root, depth + 1)) {
        for (const child of children) add(name, child);
      }
    }
  }
  const properties = schema["properties"];
  if (isRecord(properties)) {
    for (const [name, child] of Object.entries(properties)) {
      if (isRecord(child)) add(name, child);
    }
  }
  for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
    const branches = schema[keyword];
    if (!Array.isArray(branches)) continue;
    for (const branch of branches) {
      if (!isRecord(branch)) continue;
      for (const [name, children] of declaredProperties(branch, root, depth + 1)) {
        for (const child of children) add(name, child);
      }
    }
  }
  return collected;
}

function projectDeclaredValue(
  value: unknown,
  schema: Readonly<Record<string, unknown>>,
  root: Readonly<Record<string, unknown>>,
  redactSensitive: boolean,
  depth = 0
): unknown {
  if (depth > MAX_SCHEMA_DEPTH) throw new Error("MCP value exceeds the supported depth");
  const reference = schema["$ref"];
  if (typeof reference === "string") {
    const target = localDefinition(root, reference);
    if (target !== undefined) {
      return projectDeclaredValue(value, target, root, redactSensitive, depth + 1);
    }
  }
  if (Array.isArray(value)) {
    const items = schema["items"];
    if (!isRecord(items)) return [];
    return value.map((item) => projectDeclaredValue(item, items, root, redactSensitive, depth + 1));
  }
  if (!isRecord(value)) return value;

  const properties = declaredProperties(schema, root, depth + 1);
  const projected: Record<string, unknown> = {};
  for (const [name, child] of Object.entries(value)) {
    if (redactSensitive && SENSITIVE_FIELD.test(name)) continue;
    const candidates = properties.get(name);
    if (candidates === undefined || candidates.length === 0) continue;
    const childSchema = candidates.length === 1 ? candidates[0] : ({ anyOf: candidates } as const);
    if (childSchema === undefined) continue;
    projected[name] = projectDeclaredValue(child, childSchema, root, redactSensitive, depth + 1);
  }
  return projected;
}

function projectInput(
  input: Record<string, unknown>,
  schema: Readonly<Record<string, unknown>>
): Record<string, unknown> {
  const projected = projectDeclaredValue(input, schema, schema, false);
  if (!isRecord(projected) || JSON.stringify(projected) !== JSON.stringify(input)) {
    // OpenAPI 默认允许额外字段；MCP 仍拒绝未声明字段，避免把 credential 混入业务 body。
    throw new Error("Input contains undeclared properties");
  }
  return projected;
}

function projectOutput(
  output: Record<string, unknown>,
  schema: Readonly<Record<string, unknown>>
): Record<string, unknown> {
  const projected = projectDeclaredValue(output, schema, schema, true);
  if (!isRecord(projected)) throw new Error("Projected MCP output must be an object");
  return projected;
}

function safeDiagnostic(value: string, fallback: string, maximumLength: number): string {
  return value.length <= maximumLength && SAFE_DIAGNOSTIC.test(value) ? value : fallback;
}

/** @internal 仅供同仓库边界测试；package exports 不公开 registry 子路径。 */
export function closeMcpInputSchema(
  schema: Readonly<Record<string, unknown>>,
  depth = 0
): Readonly<Record<string, unknown>> {
  if (depth > MAX_SCHEMA_DEPTH) throw new Error("MCP input schema exceeds the supported depth");
  for (const keyword of [
    "allOf",
    "not",
    "if",
    "then",
    "else",
    "patternProperties",
    "dependentSchemas"
  ] as const) {
    if (schema[keyword] !== undefined) {
      // 组合或动态属性可能让 additionalProperties 产生歧义；新增此类契约前必须显式设计投影规则。
      throw new Error(`MCP input schema keyword requires explicit support: ${keyword}`);
    }
  }

  const output: Record<string, unknown> = { ...schema };
  for (const keyword of ["properties", "$defs", "definitions"] as const) {
    const children = schema[keyword];
    if (children === undefined) continue;
    if (!isRecord(children)) throw new Error(`MCP input schema ${keyword} must be an object`);
    output[keyword] = Object.fromEntries(
      Object.entries(children).map(([name, child]) => {
        if (!isRecord(child))
          throw new Error(`MCP input schema ${keyword}.${name} must be an object`);
        return [name, closeMcpInputSchema(child, depth + 1)];
      })
    );
  }
  for (const keyword of ["items", "contains"] as const) {
    const child = schema[keyword];
    if (child === undefined) continue;
    if (!isRecord(child)) throw new Error(`MCP input schema ${keyword} must be an object`);
    output[keyword] = closeMcpInputSchema(child, depth + 1);
  }
  for (const keyword of ["anyOf", "oneOf", "prefixItems"] as const) {
    const children = schema[keyword];
    if (children === undefined) continue;
    if (!Array.isArray(children)) throw new Error(`MCP input schema ${keyword} must be an array`);
    output[keyword] = children.map((child) => {
      if (!isRecord(child)) throw new Error(`MCP input schema ${keyword} item must be an object`);
      return closeMcpInputSchema(child, depth + 1);
    });
  }

  const type = schema["type"];
  if (Array.isArray(type) && type.includes("object")) {
    throw new Error("MCP nullable object schema requires explicit support");
  }
  if (
    type === "object" ||
    schema["properties"] !== undefined ||
    schema["additionalProperties"] !== undefined
  ) {
    // projector 只接受声明字段；发布给 MCP client 的 schema 必须表达相同的 deep-closed 边界。
    output["additionalProperties"] = false;
  }
  return output;
}

function normalizeToolSchema(
  schema: Readonly<Record<string, unknown>>,
  closeInput = false
): NormalizedToolSchema {
  const normalized = closeInput ? closeMcpInputSchema(schema) : schema;
  if (normalized["type"] !== "object") {
    throw new Error("Generated MCP schema root must be an object");
  }
  const rawProperties = normalized["properties"];
  const properties: Record<string, object> = {};
  if (rawProperties !== undefined) {
    if (!isRecord(rawProperties)) throw new Error("Generated MCP properties must be an object");
    for (const [name, value] of Object.entries(rawProperties)) {
      if (!isRecord(value)) throw new Error(`Generated MCP property ${name} must be an object`);
      properties[name] = value;
    }
  }
  const rawRequired = normalized["required"];
  const required =
    rawRequired === undefined
      ? undefined
      : Array.isArray(rawRequired) && rawRequired.every((value) => typeof value === "string")
        ? [...rawRequired]
        : undefined;
  if (rawRequired !== undefined && required === undefined) {
    throw new Error("Generated MCP required must be a string array");
  }

  // 重建 mutable properties/required 是 MCP SDK 类型边界；其余 $defs 等标准关键字原样保留。
  return {
    ...normalized,
    type: "object",
    ...(rawProperties === undefined ? {} : { properties }),
    ...(required === undefined ? {} : { required })
  };
}

function permissionAllows(metadata: OperationMetadata, permissions: McpPermissions): boolean {
  if (metadata.mcpExposure === "never") return false;
  if (metadata.mcpExposure === "read") return true;
  if (metadata.mcpExposure === "write") return permissions.enableWrites;
  return permissions.enableWrites && permissions.enableDestructive;
}

function metadataAllowed(metadata: OperationMetadata, permissions: McpPermissions): boolean {
  return permissionAllows(metadata, permissions);
}

function structuredResult(value: unknown): Record<string, unknown> {
  if (!isRecord(value) || typeof value["status"] !== "number" || !("data" in value)) {
    throw new Error("SDK operation returned an unexpected result shape");
  }
  const requestId = value["requestId"];
  return {
    data: value["data"] ?? null,
    meta: {
      status: value["status"],
      ...(typeof requestId === "string" ? { requestId } : {})
    }
  };
}

function schemaValidator(ajv: Ajv2020, schema: Readonly<Record<string, unknown>>): SchemaValidator {
  const validate: ValidateFunction<Record<string, unknown>> =
    ajv.compile<Record<string, unknown>>(schema);
  return (input) => {
    if (validate(input)) return { valid: true, data: input };
    return { valid: false, errorMessage: ajv.errorsText(validate.errors) };
  };
}

export function safeToolError(error: unknown): string {
  if (error instanceof UnifyPortApiError) {
    const code = safeDiagnostic(error.code, `HTTP_${String(error.status)}`, 64);
    const requestId =
      error.requestId === undefined
        ? ""
        : `, request_id=${safeDiagnostic(error.requestId, "redacted", 128)}`;
    // 上游 message/details 可能回显输入，因此 MCP 只返回可诊断但不含 payload 的稳定字段。
    return `UnifyPort API error: ${code} (HTTP ${String(error.status)}${requestId})`;
  }
  // 嵌入方可提供 custom fetch/provider 并抛出 SDK error 子类；其 message 仍不能视为可信诊断。
  if (error instanceof UnifyPortError) return "UnifyPort SDK error";
  return "Unexpected UnifyPort SDK error";
}

export function createToolRegistry(
  clients: ToolClients,
  permissions: McpPermissions
): ToolRegistry {
  // format 只作 OpenAPI annotation；结构/枚举/范围仍严格校验，避免未知 provider format 误拒请求。
  const validator = new Ajv2020({ strict: false, allErrors: true, validateFormats: false });
  const registrations = new Map<string, RegisteredTool>();
  const metadata: readonly OperationMetadata[] = Object.values(deviceOperations);

  for (const operation of metadata) {
    if (!metadataAllowed(operation, permissions)) continue;
    const inputSchema = normalizeToolSchema(operation.inputSchema, true);
    const outputSchema = normalizeToolSchema(operation.outputSchema);
    const definition: Tool = {
      name: operation.toolName,
      title: operation.summary,
      description:
        operation.description === ""
          ? `${operation.api} ${operation.operationId}`
          : operation.description,
      inputSchema,
      outputSchema,
      annotations: {
        readOnlyHint: operation.mutability === "read",
        destructiveHint: operation.mutability === "destructive",
        idempotentHint: operation.retryable,
        openWorldHint: true
      }
    };
    registrations.set(operation.toolName, {
      definition,
      metadata: operation,
      inputSchema,
      outputSchema,
      validateInput: schemaValidator(validator, inputSchema),
      validateOutput: schemaValidator(validator, outputSchema)
    });
  }

  const definitions = [...registrations.values()]
    .map((registration) => registration.definition)
    .sort((left, right) => left.name.localeCompare(right.name));
  return {
    definitions,
    registrations,
    invoke: async (name, input, signal): Promise<Record<string, unknown>> => {
      const registration = registrations.get(name);
      if (registration === undefined) throw new Error(`Unknown tool: ${name}`);
      serializedSize(input, MAX_MCP_INPUT_BYTES, "MCP input");
      const inputResult = registration.validateInput(input);
      if (!inputResult.valid) throw new Error(`Invalid input: ${inputResult.errorMessage}`);
      // AJV 与 projector 复用同一份 closed schema；投影继续作为未来 schema 漂移的纵深防护。
      const projectedInput = projectInput(inputResult.data, registration.inputSchema);
      const rawResult = structuredResult(
        await invokeGeneratedTool(name, projectedInput, clients, signal)
      );
      serializedSize(rawResult, MAX_MCP_OUTPUT_BYTES, "MCP output");
      const result = projectOutput(rawResult, registration.outputSchema);
      const outputResult = registration.validateOutput(result);
      if (!outputResult.valid) {
        throw new Error(`Invalid upstream output: ${outputResult.errorMessage}`);
      }
      return outputResult.data;
    }
  };
}
