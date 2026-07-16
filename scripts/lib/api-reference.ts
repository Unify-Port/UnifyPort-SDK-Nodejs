import {
  addLanguageNavigation,
  toEnglishApiReferenceSource,
  translateGeneratedMarkdownToEnglish
} from "./api-reference-i18n.js";

// API Reference 与类型检查示例共用同一渲染模型，避免文档调用方式与 SDK 签名分别漂移。
export type OpenApiJsonPrimitive = boolean | null | number | string;
export type OpenApiJsonValue = OpenApiJsonPrimitive | OpenApiJsonObject | OpenApiJsonValue[];

export interface OpenApiJsonObject {
  [key: string]: OpenApiJsonValue;
}

export interface ApiReferencePolicy {
  readonly mutability: "destructive" | "read" | "write";
  readonly retryable: boolean;
  readonly secretInput: boolean;
  readonly secretOutput: boolean;
  readonly mcpExposure: "destructive" | "never" | "read" | "write";
}

export interface ApiReferenceOperation {
  readonly method: string;
  readonly path: string;
  readonly operationId: string;
  readonly summary: string;
  readonly description: string;
  readonly tag: string;
  readonly authRequired: boolean;
  readonly parameters: readonly OpenApiJsonObject[];
  readonly requestBody?: OpenApiJsonObject;
  readonly responses: OpenApiJsonObject;
  readonly policy: ApiReferencePolicy;
}

export interface ApiReferenceSource {
  readonly contract: string;
  readonly clientClassName: string;
  readonly document: OpenApiJsonObject;
  readonly operations: readonly ApiReferenceOperation[];
}

interface FieldRow {
  readonly field: string;
  readonly requirement: "否" | "是" | "父字段存在时必填";
  readonly type: string;
  readonly constraints: string;
  readonly description: string;
}

interface RequestExample {
  readonly request?: OpenApiJsonObject;
}

const MAX_FIELD_DEPTH = 4;
const SENSITIVE_FIELD_PATTERN = /(?:api_?key|authorization|code|password|secret|session|token)/iu;

// 少量覆盖只补 schema 无法表达的互斥或敏感输入语义，operation 清单仍完全来自公开契约。
const REQUEST_BODY_EXAMPLE_OVERRIDES: Readonly<Record<string, OpenApiJsonObject>> = {
  importAccountAuthSession: { session_url: "<session-payload>" },
  sendMessage: {
    account_id: "acc_xxx",
    to: { id: "recipient_xxx", type: "user" },
    message: { type: "text", text: "Hello from UnifyPort" }
  },
  submitAccountAuthCode: { code: "<verification-code>" },
  submitAccountAuthPassword: { password: "<password>" },
  updateGroupInfo: { group_id: "group_xxx", name: "Example group" }
};

function isObject(value: OpenApiJsonValue | undefined): value is OpenApiJsonObject {
  return (
    value !== undefined && value !== null && typeof value === "object" && !Array.isArray(value)
  );
}

function asObject(value: OpenApiJsonValue | undefined, description: string): OpenApiJsonObject {
  if (!isObject(value)) throw new Error(`${description} 必须是 object`);
  return value;
}

function optionalObject(
  parent: OpenApiJsonObject | undefined,
  key: string
): OpenApiJsonObject | undefined {
  const value = parent?.[key];
  if (value === undefined) return undefined;
  return asObject(value, key);
}

function optionalArray(
  parent: OpenApiJsonObject | undefined,
  key: string
): OpenApiJsonValue[] | undefined {
  const value = parent?.[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`${key} 必须是 array`);
  return value;
}

function optionalString(parent: OpenApiJsonObject | undefined, key: string): string | undefined {
  const value = parent?.[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${key} 必须是 string`);
  return value;
}

function resolveLocalRef(document: OpenApiJsonObject, ref: string): OpenApiJsonValue {
  if (!ref.startsWith("#/")) throw new Error(`API Reference 仅支持本地 ref: ${ref}`);
  let current: OpenApiJsonValue = document;
  for (const part of ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"))) {
    if (!isObject(current)) throw new Error(`无法解析 OpenAPI ref: ${ref}`);
    const next: OpenApiJsonValue | undefined = current[part];
    if (next === undefined) throw new Error(`无法解析 OpenAPI ref: ${ref}`);
    current = next;
  }
  return current;
}

function resolveObject(
  document: OpenApiJsonObject,
  value: OpenApiJsonValue,
  seen: ReadonlySet<string> = new Set()
): OpenApiJsonObject {
  const object = asObject(value, "OpenAPI 节点");
  const ref = optionalString(object, "$ref");
  if (ref === undefined) return object;
  if (seen.has(ref)) throw new Error(`OpenAPI ref 循环: ${ref}`);
  return resolveObject(document, resolveLocalRef(document, ref), new Set([...seen, ref]));
}

function refName(ref: string): string {
  const segment = ref.split("/").at(-1) ?? ref;
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

function slug(value: string): string {
  const normalized = value
    .replaceAll(/([a-z0-9])([A-Z])/gu, "$1-$2")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-|-$/gu, "");
  if (normalized === "") throw new Error(`无法生成文档 slug: ${value}`);
  return normalized;
}

export function apiReferencePath(
  operation: Pick<ApiReferenceOperation, "operationId" | "tag">
): string {
  return `api-reference/${slug(operation.tag)}.md#${slug(operation.operationId)}`;
}

function tableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll(/\r?\n/gu, "<br>").trim() || "-";
}

function inlineCode(value: string): string {
  return `\`${value.replaceAll("`", "\\`")}\``;
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string[] {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`)
  ];
}

function schemaType(
  document: OpenApiJsonObject,
  rawSchema: OpenApiJsonValue | undefined,
  jsonSafeNumbers = false
): string {
  if (rawSchema === undefined) return "unknown";
  if (!isObject(rawSchema)) return typeof rawSchema;

  const ref = optionalString(rawSchema, "$ref");
  if (ref !== undefined) return refName(ref);

  const oneOf = optionalArray(rawSchema, "oneOf") ?? optionalArray(rawSchema, "anyOf");
  if (oneOf !== undefined) {
    return oneOf.map((item) => schemaType(document, item, jsonSafeNumbers)).join(" | ");
  }
  const allOf = optionalArray(rawSchema, "allOf");
  if (allOf !== undefined) {
    return allOf.map((item) => schemaType(document, item, jsonSafeNumbers)).join(" & ");
  }

  const enumValues = optionalArray(rawSchema, "enum");
  const typeValue = rawSchema["type"];
  const baseType =
    typeof typeValue === "string"
      ? typeValue
      : Array.isArray(typeValue)
        ? typeValue.map(String).join(" | ")
        : optionalObject(rawSchema, "properties") !== undefined ||
            rawSchema["additionalProperties"] !== undefined
          ? "object"
          : "unknown";
  if (enumValues !== undefined && enumValues.length > 0) {
    return `${baseType} enum(${enumValues.map((item) => JSON.stringify(item)).join(" | ")})`;
  }
  if (baseType === "array") {
    return `Array<${schemaType(document, rawSchema["items"], jsonSafeNumbers)}>`;
  }
  if (baseType === "object") {
    const additional = rawSchema["additionalProperties"];
    if (additional === true) return "Record<string, unknown>";
    if (isObject(additional)) {
      return `Record<string, ${schemaType(document, additional, jsonSafeNumbers)}>`;
    }
  }
  const format = optionalString(rawSchema, "format");
  if (jsonSafeNumbers && (baseType === "integer" || baseType === "number")) {
    return format === undefined ? "number | string" : `number | string (${format})`;
  }
  return format === undefined ? baseType : `${baseType} (${format})`;
}

function constraintText(schema: OpenApiJsonObject): string {
  const entries: string[] = [];
  const enumValues = optionalArray(schema, "enum");
  if (enumValues !== undefined && enumValues.length > 0) {
    entries.push(`enum=${enumValues.map((value) => JSON.stringify(value)).join(", ")}`);
  }
  for (const key of [
    "const",
    "minimum",
    "maximum",
    "minLength",
    "maxLength",
    "minItems",
    "maxItems",
    "pattern",
    "default"
  ]) {
    const value = schema[key];
    if (value !== undefined && !isObject(value) && !Array.isArray(value)) {
      entries.push(`${key}=${JSON.stringify(value)}`);
    }
  }
  return entries.join(", ") || "-";
}

interface ObjectShape {
  readonly properties: ReadonlyMap<string, OpenApiJsonValue>;
  readonly required: ReadonlySet<string>;
}

function objectShape(
  document: OpenApiJsonObject,
  rawSchema: OpenApiJsonValue,
  seenRefs: ReadonlySet<string> = new Set()
): ObjectShape {
  if (!isObject(rawSchema)) return { properties: new Map(), required: new Set() };
  const ref = optionalString(rawSchema, "$ref");
  if (ref !== undefined) {
    if (seenRefs.has(ref)) return { properties: new Map(), required: new Set() };
    return objectShape(document, resolveLocalRef(document, ref), new Set([...seenRefs, ref]));
  }

  const properties = new Map<string, OpenApiJsonValue>();
  const required = new Set<string>();
  const ownProperties = optionalObject(rawSchema, "properties");
  if (ownProperties !== undefined) {
    for (const [name, schema] of Object.entries(ownProperties)) properties.set(name, schema);
  }
  for (const item of optionalArray(rawSchema, "required") ?? []) {
    if (typeof item === "string") required.add(item);
  }
  for (const item of optionalArray(rawSchema, "allOf") ?? []) {
    const child = objectShape(document, item, seenRefs);
    for (const [name, schema] of child.properties) properties.set(name, schema);
    for (const name of child.required) required.add(name);
  }
  return { properties, required };
}

function schemaDescription(document: OpenApiJsonObject, rawSchema: OpenApiJsonValue): string {
  if (!isObject(rawSchema)) return "";
  const direct = optionalString(rawSchema, "description");
  if (direct !== undefined) return direct;
  const ref = optionalString(rawSchema, "$ref");
  if (ref === undefined) return "";
  return optionalString(resolveObject(document, rawSchema), "description") ?? "";
}

function fieldRows(
  document: OpenApiJsonObject,
  rawSchema: OpenApiJsonValue,
  rootName: string,
  rootRequired: boolean,
  jsonSafeNumbers = false
): readonly FieldRow[] {
  const rows = new Map<string, FieldRow>();

  const visit = (
    schema: OpenApiJsonValue,
    field: string,
    required: boolean,
    parentRequired: boolean,
    depth: number,
    includeSelf: boolean
  ): void => {
    const resolved = isObject(schema) ? resolveObject(document, schema) : undefined;
    if (includeSelf) {
      rows.set(field, {
        field,
        requirement: required ? (parentRequired ? "是" : "父字段存在时必填") : "否",
        type: schemaType(document, schema, jsonSafeNumbers),
        constraints: resolved === undefined ? "-" : constraintText(resolved),
        description: schemaDescription(document, schema) || "-"
      });
    }
    if (depth >= MAX_FIELD_DEPTH) return;
    const childParentRequired = parentRequired && required;

    const schemaObject = isObject(schema) ? schema : undefined;
    const resolvedType = optionalString(resolved, "type");
    const rawItems = schemaObject?.["items"] ?? resolved?.["items"];
    if (resolvedType === "array" && rawItems !== undefined) {
      const itemShape = objectShape(document, rawItems);
      for (const [name, child] of itemShape.properties) {
        visit(
          child,
          `${field}[].${name}`,
          itemShape.required.has(name),
          childParentRequired,
          depth + 1,
          true
        );
      }
      return;
    }

    const shape = objectShape(document, schema);
    for (const [name, child] of shape.properties) {
      const childField = field === "" ? name : `${field}.${name}`;
      visit(child, childField, shape.required.has(name), childParentRequired, depth + 1, true);
    }
  };

  const rootShape = objectShape(document, rawSchema);
  if (rootShape.properties.size === 0) {
    visit(rawSchema, rootName, rootRequired, true, 0, true);
  } else {
    visit(rawSchema, rootName, rootRequired, true, 0, false);
  }
  return [...rows.values()];
}

function safePlaceholder(name: string, schema: OpenApiJsonObject): OpenApiJsonValue {
  const normalized = name.toLowerCase();
  if (normalized === "account_id") return "acc_xxx";
  if (normalized === "key_id") return "ak_xxx";
  if (normalized === "endpoint_id") return "we_xxx";
  if (normalized.includes("conversation_id")) return "conversation_xxx";
  if (normalized.includes("contact_id")) return "contact_xxx";
  if (normalized.includes("group_id")) return "group_xxx";
  if (normalized.includes("message_id")) return "message_xxx";
  if (normalized.includes("member_id")) return "member_xxx";
  if (normalized.includes("label_id")) return "label_xxx";
  if (normalized === "provider") return "telegram";
  if (SENSITIVE_FIELD_PATTERN.test(normalized)) {
    if (normalized.includes("password")) return "<password>";
    if (normalized.includes("code")) return "<verification-code>";
    if (normalized.includes("session")) return "<session-payload>";
    if (normalized.includes("api") && normalized.includes("key")) return "<api-key>";
    return "<secret>";
  }

  const format = optionalString(schema, "format");
  if (format === "uri") return "https://example.com/resource";
  if (format === "date-time") return "2026-01-01T00:00:00Z";
  if (format === "email") return "user@example.com";
  if (normalized.includes("url")) return "https://example.com/resource";
  if (normalized === "region") return "global";
  if (normalized === "name") return "Example";
  if (normalized === "status") return "active";
  if (normalized === "content" || normalized === "text") return "Example text";
  if (normalized === "note") return "Example note";
  return `${normalized || "value"}_xxx`;
}

function sanitizeExample(value: OpenApiJsonValue, fieldName = ""): OpenApiJsonValue {
  if (Array.isArray(value)) return value.map((item) => sanitizeExample(item, fieldName));
  if (!isObject(value)) {
    if (SENSITIVE_FIELD_PATTERN.test(fieldName)) {
      if (fieldName.includes("password")) return "<password>";
      if (fieldName.includes("code")) return "<verification-code>";
      if (fieldName.includes("session")) return "<session-payload>";
      return "<secret>";
    }
    return value;
  }
  const sanitized: OpenApiJsonObject = {};
  for (const [name, child] of Object.entries(value)) {
    sanitized[name] = sanitizeExample(child, name.toLowerCase());
  }
  return sanitized;
}

function explicitExample(container: OpenApiJsonObject | undefined): OpenApiJsonValue | undefined {
  if (container === undefined) return undefined;
  const direct = container["example"];
  if (direct !== undefined) return direct;
  const examples = container["examples"];
  if (Array.isArray(examples)) return examples[0];
  if (isObject(examples)) {
    const first = Object.values(examples)[0];
    if (isObject(first) && first["value"] !== undefined) return first["value"];
    return first;
  }
  return undefined;
}

function synthesizeExample(
  document: OpenApiJsonObject,
  rawSchema: OpenApiJsonValue,
  fieldName: string,
  seenRefs: ReadonlySet<string> = new Set()
): OpenApiJsonValue {
  if (!isObject(rawSchema)) return rawSchema;
  const direct = explicitExample(rawSchema);
  if (direct !== undefined) return sanitizeExample(direct, fieldName.toLowerCase());
  const defaultValue = rawSchema["default"];
  if (defaultValue !== undefined) return sanitizeExample(defaultValue, fieldName.toLowerCase());
  const enumValues = optionalArray(rawSchema, "enum");
  if (enumValues?.[0] !== undefined) return enumValues[0];

  const ref = optionalString(rawSchema, "$ref");
  if (ref !== undefined) {
    if (seenRefs.has(ref)) return {};
    return synthesizeExample(
      document,
      resolveLocalRef(document, ref),
      fieldName,
      new Set([...seenRefs, ref])
    );
  }
  const alternatives = optionalArray(rawSchema, "oneOf") ?? optionalArray(rawSchema, "anyOf");
  if (alternatives !== undefined) {
    const first = alternatives[0];
    if (first === undefined) throw new Error(`${fieldName} 的 schema alternative 为空`);
    return synthesizeExample(document, first, fieldName, seenRefs);
  }
  const allOf = optionalArray(rawSchema, "allOf");
  if (allOf !== undefined) {
    const merged: OpenApiJsonObject = {};
    for (const item of allOf) {
      const child = synthesizeExample(document, item, fieldName, seenRefs);
      if (isObject(child)) Object.assign(merged, child);
    }
    return merged;
  }

  const type = optionalString(rawSchema, "type");
  if (type === "object" || optionalObject(rawSchema, "properties") !== undefined) {
    const shape = objectShape(document, rawSchema);
    const object: OpenApiJsonObject = {};
    for (const name of shape.required) {
      const property = shape.properties.get(name);
      if (property === undefined) throw new Error(`${fieldName}.${name} 缺少 required schema`);
      object[name] = synthesizeExample(document, property, name, seenRefs);
    }
    return object;
  }
  if (type === "array") {
    const itemSchema = rawSchema["items"];
    if (itemSchema === undefined) return [];
    const minimum = rawSchema["minItems"];
    const length = typeof minimum === "number" && minimum > 0 ? minimum : 1;
    return Array.from({ length }, () =>
      synthesizeExample(document, itemSchema, fieldName, seenRefs)
    );
  }
  if (type === "boolean") return false;
  if (type === "integer" || type === "number") {
    const minimum = rawSchema["minimum"];
    return typeof minimum === "number" ? minimum : 1;
  }
  if (type === "null") return null;
  return safePlaceholder(fieldName, rawSchema);
}

function jsonRequestBody(operation: ApiReferenceOperation): OpenApiJsonObject | undefined {
  const content = optionalObject(operation.requestBody, "content");
  return optionalObject(content, "application/json");
}

function buildRequestExample(
  document: OpenApiJsonObject,
  operation: ApiReferenceOperation
): RequestExample {
  const locations = new Map<string, OpenApiJsonObject>();
  for (const parameter of operation.parameters) {
    const name = optionalString(parameter, "name");
    const location = optionalString(parameter, "in");
    if (name === undefined || location === undefined) {
      throw new Error(`${operation.operationId} parameter 缺少 name 或 in`);
    }
    if (location === "header" && name.toLowerCase() === "x-api-key") continue;
    const include = parameter["required"] === true || (location === "query" && name === "limit");
    if (!include) continue;
    const schema = asObject(parameter["schema"] ?? {}, `${operation.operationId}.${name} schema`);
    let target = locations.get(location);
    if (target === undefined) {
      target = {};
      locations.set(location, target);
    }
    target[name] = synthesizeExample(document, schema, name);
  }

  const request: OpenApiJsonObject = {};
  if (locations.size > 0) {
    const params: OpenApiJsonObject = {};
    for (const location of ["path", "query", "header", "cookie"]) {
      const values = locations.get(location);
      if (values !== undefined) params[location] = values;
    }
    request["params"] = params;
  }

  const jsonBody = jsonRequestBody(operation);
  const bodySchema = jsonBody?.["schema"];
  if (bodySchema !== undefined) {
    const override = REQUEST_BODY_EXAMPLE_OVERRIDES[operation.operationId];
    const mediaExample = explicitExample(jsonBody);
    const includeBody =
      operation.requestBody?.["required"] === true ||
      override !== undefined ||
      (operation.policy.secretInput && mediaExample !== undefined);
    if (includeBody) {
      request["body"] =
        override ??
        (mediaExample === undefined
          ? synthesizeExample(document, bodySchema, "body")
          : sanitizeExample(mediaExample));
    }
  }
  return Object.keys(request).length === 0 ? {} : { request };
}

function requestIsRequired(operation: ApiReferenceOperation): boolean {
  return (
    operation.parameters.some((parameter) => parameter["required"] === true) ||
    operation.requestBody?.["required"] === true
  );
}

function requestExpression(example: RequestExample): string {
  return example.request === undefined ? "" : JSON.stringify(example.request, null, 2);
}

function typecheckFixture(
  operations: readonly ApiReferenceOperation[],
  examples: ReadonlyMap<string, RequestExample>
): string {
  const entries = operations
    .map((operation) => {
      const request = requestExpression(examples.get(operation.operationId) ?? {});
      const call =
        request === ""
          ? `device.${operation.operationId}()`
          : `device.${operation.operationId}(${request})`;
      return `  ${JSON.stringify(operation.operationId)}: async (device) => {\n    await ${call};\n  },`;
    })
    .join("\n");

  return `/**
 * 此文件由 \`pnpm generate\` 根据公开 OpenAPI 契约生成。
 * 仅在编译期验证 API Reference 示例，不会主动执行网络请求。
 */
import type { DeviceApiOperations, UnifyPortDeviceClient } from "../../src/index.js";

type ApiReferenceExamples = {
  readonly [K in keyof DeviceApiOperations]: (device: UnifyPortDeviceClient) => Promise<void>;
};

// 显式映射让新增 operation 在缺少文档示例时直接触发类型或键集合错误。
export const apiReferenceExamples = {
${entries}
} satisfies ApiReferenceExamples;
`;
}

function parameterRows(
  document: OpenApiJsonObject,
  operation: ApiReferenceOperation
): readonly (readonly string[])[] {
  return operation.parameters.map((parameter) => {
    const name = optionalString(parameter, "name") ?? "-";
    const location = optionalString(parameter, "in") ?? "-";
    const schema = parameter["schema"];
    const resolved = schema === undefined ? {} : resolveObject(document, schema);
    const sample = synthesizeExample(document, resolved, name);
    return [
      inlineCode(`params.${location}.${name}`),
      location,
      parameter["required"] === true ? "是" : "否",
      inlineCode(schemaType(document, schema)),
      inlineCode(JSON.stringify(sample)),
      constraintText(resolved),
      optionalString(parameter, "description") ?? optionalString(resolved, "description") ?? "-"
    ];
  });
}

function requestBodySection(
  document: OpenApiJsonObject,
  operation: ApiReferenceOperation
): string[] {
  if (operation.requestBody === undefined) return ["无请求体。"];
  const jsonBody = jsonRequestBody(operation);
  const schema = jsonBody?.["schema"];
  if (schema === undefined) return ["当前 operation 没有 `application/json` 请求体。"];
  const rows = fieldRows(document, schema, "body", operation.requestBody["required"] === true).map(
    (row) => [
      inlineCode(row.field),
      row.requirement,
      inlineCode(row.type),
      row.constraints,
      row.description
    ]
  );
  return [
    optionalString(operation.requestBody, "description") ??
      (operation.requestBody["required"] === true ? "JSON 请求体。" : "可选 JSON 请求体。"),
    "",
    ...markdownTable(["字段", "必填", "类型", "约束", "说明"], rows)
  ];
}

interface SuccessResponse {
  readonly status: string;
  readonly response: OpenApiJsonObject;
  readonly schema?: OpenApiJsonValue;
}

function responseEntries(
  document: OpenApiJsonObject,
  operation: ApiReferenceOperation
): readonly {
  readonly status: string;
  readonly response: OpenApiJsonObject;
  readonly schema?: OpenApiJsonValue;
}[] {
  return Object.entries(operation.responses)
    .map(([status, rawResponse]) => {
      const response = resolveObject(document, rawResponse);
      const content = optionalObject(response, "content");
      const json = optionalObject(content, "application/json");
      const schema = json?.["schema"];
      return { status, response, ...(schema === undefined ? {} : { schema }) };
    })
    .sort((left, right) => left.status.localeCompare(right.status));
}

function firstSuccessResponse(
  document: OpenApiJsonObject,
  operation: ApiReferenceOperation
): SuccessResponse | undefined {
  const match = responseEntries(document, operation).find(({ status }) => /^2\d\d$/u.test(status));
  return match;
}

function responseSection(document: OpenApiJsonObject, operation: ApiReferenceOperation): string[] {
  const entries = responseEntries(document, operation);
  const rows = entries.map(({ status, response, schema }) => [
    inlineCode(status),
    schema === undefined ? "无" : "`application/json`",
    schema === undefined ? "-" : inlineCode(schemaType(document, schema)),
    optionalString(response, "description") ?? "-"
  ]);
  const lines = [
    ...markdownTable(["HTTP status", "Content-Type", "Schema", "说明"], rows),
    "",
    "SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。"
  ];

  const success = firstSuccessResponse(document, operation);
  if (success === undefined) {
    lines.push("", "公开契约未定义 2xx 成功响应。");
  } else if (success.schema === undefined) {
    lines.push(
      "",
      `成功状态 ${inlineCode(success.status)} 无响应体，\`result.data\` 为 \`undefined\`。`
    );
  } else {
    const fields = fieldRows(document, success.schema, "result.data", true, true).map((row) => [
      inlineCode(row.field),
      row.requirement,
      inlineCode(row.type),
      row.constraints,
      row.description
    ]);
    lines.push(
      "",
      `成功状态 ${inlineCode(success.status)} 的响应字段：`,
      "",
      ...markdownTable(["字段", "必有", "类型", "约束", "说明"], fields)
    );
  }
  if (operation.policy.secretOutput) {
    lines.push("", "> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。");
  }
  return lines;
}

function exampleSection(operation: ApiReferenceOperation, example: RequestExample): string[] {
  const request = requestExpression(example);
  const call =
    request === ""
      ? `const result = await device.${operation.operationId}();`
      : `const result = await device.${operation.operationId}(${request});`;
  const success = Object.keys(operation.responses).find((status) => /^2\d\d$/u.test(status));
  const output =
    success === "204" || operation.policy.secretOutput
      ? "console.log(result.status, result.requestId);"
      : "console.log(result.data.data);";
  const lines = ["```ts", call, output, "```"];
  if (operation.policy.secretInput) {
    lines.push("", "> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。");
  }
  return lines;
}

function tagDescriptions(document: OpenApiJsonObject): ReadonlyMap<string, string> {
  const descriptions = new Map<string, string>();
  for (const value of optionalArray(document, "tags") ?? []) {
    if (!isObject(value)) continue;
    const name = optionalString(value, "name");
    if (name !== undefined) descriptions.set(name, optionalString(value, "description") ?? "");
  }
  return descriptions;
}

function groupedOperations(
  source: ApiReferenceSource
): readonly (readonly [string, readonly ApiReferenceOperation[]])[] {
  const grouped = new Map<string, ApiReferenceOperation[]>();
  for (const operation of source.operations) {
    const current = grouped.get(operation.tag) ?? [];
    current.push(operation);
    grouped.set(operation.tag, current);
  }
  const declaredTags = [...tagDescriptions(source.document).keys()];
  const remainingTags = [...grouped.keys()]
    .filter((tag) => !declaredTags.includes(tag))
    .sort((left, right) => left.localeCompare(right));
  return [...declaredTags, ...remainingTags].flatMap((tag) => {
    const operations = grouped.get(tag);
    if (operations === undefined) return [];
    return [
      [
        tag,
        [...operations].sort((left, right) => left.operationId.localeCompare(right.operationId))
      ] as const
    ];
  });
}

function indexMarkdown(source: ApiReferenceSource): string {
  const tags = tagDescriptions(source.document);

  const lines = [
    "<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->",
    "# Device API Reference",
    "",
    `本 Reference 由 \`${source.contract}\` 自动生成，当前包含 ${String(source.operations.length)} 个 operation。`,
    "每个 operation 都提供参数、请求体、响应和 TypeScript 调用示例。",
    "字段说明严格来自公开契约；`-` 表示契约尚未提供额外说明，不根据实现推测。",
    "",
    "示例默认已有配置完成的 `UnifyPortDeviceClient` 实例 `device`。API key 只在 client 初始化时提供，",
    "不会出现在 operation 参数中。",
    "",
    "```ts",
    'import { UnifyPortDeviceClient } from "@unifyport/sdk-node";',
    "",
    "function requiredEnv(name: string): string {",
    "  const value = process.env[name];",
    "  if (!value) throw new Error(`Missing required environment variable: ${name}`);",
    "  return value;",
    "}",
    "",
    "const device = new UnifyPortDeviceClient({",
    '  baseUrl: requiredEnv("UNIFYPORT_DEVICE_API_BASE_URL"),',
    '  apiKey: requiredEnv("UNIFYPORT_DEVICE_API_KEY")',
    "});",
    "```",
    "",
    "## 分组"
  ];

  for (const [tag, operations] of groupedOperations(source)) {
    const tagSlug = slug(tag);
    lines.push(
      "",
      `### ${tag}`,
      "",
      tags.get(tag) ?? "",
      "",
      ...markdownTable(
        ["operationId", "Method", "Path", "说明"],
        operations.map((operation) => [
          `[${inlineCode(operation.operationId)}](${tagSlug}.md#${slug(operation.operationId)})`,
          operation.method.toUpperCase(),
          inlineCode(operation.path),
          operation.summary
        ])
      )
    );
  }
  lines.push(
    "",
    "## 维护方式",
    "",
    "这些页面不手工编辑。API 变更应先更新经批准的",
    "[Device OpenAPI 契约](../../contracts/device.openapi.yaml)，再运行：",
    "",
    "```bash",
    "pnpm generate",
    "pnpm generate:check",
    "pnpm typecheck",
    "```",
    "",
    "同一生成过程还会更新 API 覆盖表和 TypeScript 示例校验文件；示例与 SDK 类型不一致时，",
    "`pnpm typecheck` 会失败。"
  );
  return `${lines.join("\n")}\n`;
}

function tagMarkdown(
  source: ApiReferenceSource,
  tag: string,
  operations: readonly ApiReferenceOperation[],
  examples: ReadonlyMap<string, RequestExample>
): string {
  const description = tagDescriptions(source.document).get(tag) ?? "";
  const lines = [
    "<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->",
    `# ${tag}`,
    "",
    "[返回 API Reference 索引](README.md)",
    "",
    description,
    "",
    "## 本页 operation",
    "",
    ...operations.map(
      (operation) =>
        `- [\`${operation.operationId}\`](#${slug(operation.operationId)})：${operation.summary}`
    )
  ];

  for (const operation of operations) {
    const parameterTable = parameterRows(source.document, operation);
    lines.push(
      "",
      "---",
      "",
      `<a id="${slug(operation.operationId)}"></a>`,
      `## \`${operation.operationId}\``,
      "",
      operation.summary,
      "",
      operation.description,
      "",
      ...markdownTable(
        ["属性", "值"],
        [
          ["HTTP", `${inlineCode(operation.method.toUpperCase())} ${inlineCode(operation.path)}`],
          [
            "SDK 方法",
            inlineCode(
              `device.${operation.operationId}(${requestIsRequired(operation) ? "request" : "request?"}, execution?)`
            )
          ],
          [
            "SDK 返回",
            inlineCode(
              `Promise<ApiResult<OperationData<DeviceApiOperations["${operation.operationId}"]>>>`
            )
          ],
          ["认证", operation.authRequired ? "`X-Api-Key`（由 client 注入）" : "无"],
          ["变更类型", inlineCode(operation.policy.mutability)],
          ["自动重试", operation.policy.retryable ? "允许安全重试" : "不自动重试"]
        ]
      ),
      "",
      "### 参数",
      "",
      ...(parameterTable.length === 0
        ? ["无 path、query、header 或 cookie 参数。"]
        : markdownTable(
            ["SDK 字段", "位置", "必填", "类型", "示例", "约束", "说明"],
            parameterTable
          )),
      "",
      "### 请求体",
      "",
      ...requestBodySection(source.document, operation),
      "",
      "### 返回值",
      "",
      ...responseSection(source.document, operation),
      "",
      "### TypeScript 示例",
      "",
      ...exampleSection(operation, examples.get(operation.operationId) ?? {})
    );
  }
  return `${lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n")}\n`;
}

export function generateApiReferenceArtifacts(
  source: ApiReferenceSource
): ReadonlyMap<string, string> {
  const artifacts = new Map<string, string>();
  const examples = new Map<string, RequestExample>();
  const operationIds = new Set<string>();
  const paths = new Set<string>();
  // operationId 本身唯一仍不足以保证 Markdown anchor 唯一，归一化后的冲突必须在生成时失败。
  const anchors = new Set<string>();

  for (const operation of source.operations) {
    if (operationIds.has(operation.operationId)) {
      throw new Error(`API Reference operationId 重复: ${operation.operationId}`);
    }
    operationIds.add(operation.operationId);
    examples.set(operation.operationId, buildRequestExample(source.document, operation));
  }

  const englishSource = toEnglishApiReferenceSource(source);
  const chineseIndex = indexMarkdown(source).replace(
    "(../../contracts/device.openapi.yaml)",
    "(../../../contracts/device.openapi.yaml)"
  );
  artifacts.set(
    "docs/api-reference/README.md",
    addLanguageNavigation(
      translateGeneratedMarkdownToEnglish(indexMarkdown(englishSource)),
      "README.md",
      "../zh-CN/api-reference/README.md"
    )
  );
  artifacts.set(
    "docs/zh-CN/api-reference/README.md",
    addLanguageNavigation(chineseIndex, "../../api-reference/README.md", "README.md")
  );
  for (const [tag, operations] of groupedOperations(source)) {
    const filename = `${slug(tag)}.md`;
    const path = `docs/api-reference/${filename}`;
    if (paths.has(path)) throw new Error(`API Reference tag slug 重复: ${tag}`);
    paths.add(path);
    for (const operation of operations) {
      const anchor = `${path}#${slug(operation.operationId)}`;
      if (anchors.has(anchor)) {
        throw new Error(`API Reference operation anchor 重复: ${operation.operationId}`);
      }
      anchors.add(anchor);
    }
    artifacts.set(
      path,
      addLanguageNavigation(
        translateGeneratedMarkdownToEnglish(
          tagMarkdown(
            englishSource,
            tag,
            englishSource.operations.filter((operation) => operation.tag === tag),
            examples
          )
        ),
        filename,
        `../zh-CN/api-reference/${filename}`
      )
    );
    artifacts.set(
      `docs/zh-CN/api-reference/${filename}`,
      addLanguageNavigation(
        tagMarkdown(source, tag, operations, examples),
        `../../api-reference/${filename}`,
        filename
      )
    );
  }
  artifacts.set(
    "packages/sdk/tests/generated/api-reference-examples.ts",
    typecheckFixture(source.operations, examples)
  );
  return artifacts;
}
