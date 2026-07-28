import type { ApiReferenceSource, OpenApiJsonObject, OpenApiJsonValue } from "./api-reference.js";

// 公开契约保留现有中文说明；英文目录只维护一份扁平翻译表，避免复制 OpenAPI 结构后发生协议漂移。
const ENGLISH_CONTRACT_TEXT: Readonly<Record<string, string>> = {
  "Device API 是 UnifyPort 的控制面 HTTP API，用于管理 workspace、API Key、provider 账号、账号授权与运行态、消息发送、会话、联系人、群组以及业务 webhook endpoint。 本契约仅描述面向 SDK 调用方公开的 `/v1/` 接口，并使用 `X-Api-Key` 解析 workspace 上下文。":
    "The Device API is UnifyPort's control-plane HTTP API for managing workspaces, API keys, provider accounts, account authorization and runtime state, messaging, conversations, contacts, groups, and application webhook endpoints. This contract covers only the public `/v1/` endpoints intended for SDK consumers and uses `X-Api-Key` to resolve the workspace context.",
  "SDK 调用方通过 baseUrl 显式配置 API 根地址。":
    "SDK consumers explicitly configure the API base URL through `baseUrl`.",
  "当前 API Key 所属 workspace。": "The workspace associated with the current API key.",
  "workspace API Key 管理。": "Workspace API key management.",
  "provider 元数据查询。": "Provider metadata queries.",
  "provider 账号资源管理。": "Provider account resource management.",
  "provider 账号授权流程。": "Provider account authorization flows.",
  "provider 账号运行态控制。": "Provider account runtime controls.",
  "会话列表、详情、成员、读写状态、静音、置顶与标签。":
    "Conversation lists, details, members, read state, mute state, pinning, and labels.",
  "provider 联系人视图与联系人动作。": "Provider contact views and contact actions.",
  "provider 群组视图与群组动作。": "Provider group views and group actions.",
  "统一消息发送与消息动作。": "Unified message sending and message actions.",
  "业务 webhook endpoint 管理。": "Application webhook endpoint management.",
  "获取当前 workspace": "Get the current workspace",
  "当前 workspace 信息。": "Information about the current workspace.",
  "更新当前 workspace": "Update the current workspace",
  "更新后的 workspace 信息。": "Information about the updated workspace.",
  "列出 API Key": "List API keys",
  "API Key 列表。不会返回完整明文 API Key。":
    "A list of API keys. Full plaintext API keys are never returned.",
  "创建 API Key": "Create an API key",
  "完整 `api_key` 只在创建响应中出现一次，客户端应自行保存。":
    "The full `api_key` appears only once in the creation response. The client is responsible for storing it.",
  "创建成功，返回一次性明文 API Key 与可持久展示的 Key 元数据。":
    "Created successfully. Returns the one-time plaintext API key and key metadata that may be displayed later.",
  "更新 API Key 状态": "Update API key status",
  "更新后的 API Key 元数据。": "Metadata for the updated API key.",
  "轮换 API Key": "Rotate an API key",
  "轮换后返回新的完整 `api_key`，旧完整密钥不可恢复。":
    "Returns a new full `api_key` after rotation. The previous full key cannot be recovered.",
  "轮换成功。": "Rotated successfully.",
  "查询 provider 地区可用性": "Get provider region availability",
  "provider 支持的 region 及是否可分配。":
    "Regions supported by the provider and whether each region can be allocated.",
  列出账号: "List accounts",
  "当前 workspace 下的账号列表。": "A list of accounts in the current workspace.",
  创建账号: "Create an account",
  "创建成功。": "Created successfully.",
  获取账号详情: "Get account details",
  "账号详情。": "Account details.",
  更新账号: "Update an account",
  "更新后的账号。": "The updated account.",
  删除账号: "Delete an account",
  "删除成功，无响应体。": "Deleted successfully. The response has no body.",
  获取账号授权状态: "Get account authorization status",
  "当前授权状态。": "The current authorization status.",
  启动验证码类授权: "Start code-based authorization",
  启动二维码授权: "Start QR code authorization",
  检查二维码授权结果: "Check the QR code authorization result",
  提交验证码: "Submit an authorization code",
  "provider 授权参数。常见字段为 `code`。":
    "Provider authorization parameters. A common field is `code`.",
  提交二次密码: "Submit a two-step verification password",
  "provider 授权参数。常见字段为 `password`。":
    "Provider authorization parameters. A common field is `password`.",
  导入会话授权: "Import session authorization",
  "provider 授权参数。常见字段为 `session_url`。":
    "Provider authorization parameters. A common field is `session_url`.",
  取消授权流程: "Cancel the authorization flow",
  刷新账号运行态: "Refresh account runtime state",
  启动账号运行态: "Start account runtime",
  停止账号运行态: "Stop account runtime",
  重连账号运行态: "Reconnect account runtime",
  列出会话: "List conversations",
  "按会话标签过滤。": "Filter by conversation label.",
  "会话分页列表。": "A paginated list of conversations.",
  获取会话详情: "Get conversation details",
  "会话详情。": "Conversation details.",
  列出会话成员: "List conversation members",
  "会话成员分页列表。": "A paginated list of conversation members.",
  "成员的 provider 侧稳定标识。WhatsApp 优先返回 LID，缺少 LID 映射时回退 JID；纯手机号位于 `extra.phone`。":
    "The stable provider-side member identifier. WhatsApp prefers LID and falls back to JID when no LID mapping is available; a plain phone number is available in `extra.phone`.",
  标记会话已读: "Mark a conversation as read",
  标记会话未读: "Mark a conversation as unread",
  静音会话: "Mute a conversation",
  取消静音会话: "Unmute a conversation",
  置顶会话: "Pin a conversation",
  取消置顶会话: "Unpin a conversation",
  列出会话标签: "List conversation labels",
  "会话标签分页列表。": "A paginated list of conversation labels.",
  给会话打标或移除标签: "Add or remove a conversation label",
  "标签成员操作结果。": "The result of the label membership operation.",
  新建或更新会话标签: "Create or update a conversation label",
  "新建或更新后的标签。": "The newly created or updated label.",
  删除会话标签: "Delete a conversation label",
  "删除结果。": "The deletion result.",
  列出联系人: "List contacts",
  "关键字过滤。": "Filter by keyword.",
  "RFC3339 时间戳，只返回此时间后更新的联系人；provider 不支持时可能退化为全量。":
    "An RFC3339 timestamp. Returns only contacts updated after this time; if the provider does not support incremental queries, the operation may fall back to a full result set.",
  "联系人分页列表。": "A paginated list of contacts.",
  获取联系人详情: "Get contact details",
  "provider 侧联系人 ID，因可能包含 `@` 等字符，固定走 query。":
    "The provider-side contact ID. Because it may contain characters such as `@`, it is always passed as a query parameter.",
  "联系人详情。": "Contact details.",
  查询联系人黑名单: "List blocked contacts",
  "黑名单列表。": "A list of blocked contacts.",
  封锁联系人: "Block a contact",
  解封联系人: "Unblock a contact",
  设置或清空联系人备注: "Set or clear a contact note",
  列出群组: "List groups",
  "群组分页列表。": "A paginated list of groups.",
  获取群组详情: "Get group details",
  "provider 侧群 ID，因可能包含 `@` 等字符，固定走 query。":
    "The provider-side group ID. Because it may contain characters such as `@`, it is always passed as a query parameter.",
  "群组详情。": "Group details.",
  创建群组: "Create a group",
  "创建成功，返回新群 ID。": "Created successfully. Returns the new group ID.",
  退出群组: "Leave a group",
  管理群成员: "Manage group members",
  修改群信息: "Update group information",
  "`name`、`description`、`avatar_url` 三个字段每次只能传一个。":
    "Only one of `name`, `description`, and `avatar_url` may be provided per request.",
  列出待审批入群申请: "List pending group join requests",
  "provider 侧群 ID。": "The provider-side group ID.",
  "入群申请列表。": "A list of group join requests.",
  处理入群申请: "Process a group join request",
  设置入群审批模式: "Set the group join approval mode",
  获取群邀请链接或邀请码: "Get a group invitation link or code",
  "邀请信息。": "Invitation details.",
  发送消息: "Send a message",
  "消息发送请求已被接收或完成。": "The message send request has been accepted or completed.",
  置顶或取消置顶消息: "Pin or unpin a message",
  撤回消息: "Revoke a message",
  给消息加表情回应或取消回应: "Add or remove a message reaction",
  编辑消息文本: "Edit message text",
  "当前主要由支持该能力的 provider 实现，通常仅支持文本消息。":
    "This operation is currently implemented mainly by providers that support the capability and generally supports text messages only.",
  "列出 webhook endpoint": "List webhook endpoints",
  "Webhook endpoint 列表。": "A list of webhook endpoints.",
  "创建 webhook endpoint": "Create a webhook endpoint",
  "获取 webhook endpoint": "Get a webhook endpoint",
  "Webhook endpoint 详情。": "Webhook endpoint details.",
  "更新 webhook endpoint": "Update a webhook endpoint",
  "更新后的 webhook endpoint。": "The updated webhook endpoint.",
  "删除 webhook endpoint": "Delete a webhook endpoint",
  "停用 webhook endpoint": "Disable a webhook endpoint",
  "停用后的 webhook endpoint。": "The disabled webhook endpoint.",
  "当前 workspace 的 API Key。": "The API key for the current workspace.",
  "Device API 签发的账号 public_id，例如 `acc_xxx`。":
    "The account `public_id` issued by the Device API, for example `acc_xxx`.",
  "API Key public_id，例如 `ak_xxx`。": "The API key `public_id`, for example `ak_xxx`.",
  "Webhook endpoint public_id，例如 `we_xxx`。":
    "The webhook endpoint `public_id`, for example `we_xxx`.",
  "上一次响应返回的 `next_cursor`。": "The `next_cursor` returned by the previous response.",
  "每页数量；未提供时的默认值可能因 provider 而异。":
    "The number of items per page. The default may vary by provider when omitted.",
  "会话类型。": "The conversation type.",
  "会话类型过滤，支持逗号分隔多选。":
    "Filter by conversation type. Multiple values may be separated by commas.",
  "provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。":
    "The provider-side conversation ID. Because it may contain characters such as `@` or `:`, it is always passed as a query parameter.",
  "provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。":
    "Provider action parameters. Supported fields may vary by provider; an empty object means no additional parameters are sent.",
  "请求体或参数非法。": "The request body or parameters are invalid.",
  "缺少或无法校验 API Key。": "The API key is missing or cannot be validated.",
  "资源不存在或路由不存在。": "The resource or route does not exist.",
  "请求与当前资源状态冲突。": "The request conflicts with the current state of the resource.",
  "服务端内部错误或 provider 链路未映射错误。":
    "An internal server error or an unmapped error in the provider integration.",
  "服务暂不可用。": "The service is temporarily unavailable.",
  "当前 provider 不支持该能力。": "The current provider does not support this capability.",
  "当前 provider 能力不可用。": "This capability is unavailable for the current provider.",
  "操作成功。": "The operation succeeded.",
  "provider 动作结果。字段随 action 与 provider 不同而变化。":
    "The provider action result. Fields vary by action and provider.",
  "账号运行态动作结果。": "The account runtime action result.",
  "服务端生成的请求 ID。": "The request ID generated by the server.",
  "当客户端请求头传入合法 `X-Request-Id` 时回显。":
    "Echoed when the client supplies a valid `X-Request-Id` request header.",
  "稳定的机器可读错误码。": "A stable, machine-readable error code.",
  "面向开发者的错误说明，不建议作为客户端分支依据。":
    "A developer-facing error description. Do not use it to control client-side branching.",
  "provider 名称；实际可用范围以当前账号能力为准。":
    "The provider name. Actual availability depends on the capabilities of the current account.",
  "可展示的 Key 前缀，不是完整 API Key。": "A display-safe key prefix, not the full API key.",
  "生成 API Key 时使用的前缀。": "The prefix used when generating the API key.",
  "完整明文 API Key，仅创建或轮换响应中出现一次。":
    "The full plaintext API key. It appears only once in a creation or rotation response.",
  "账号资源状态，例如 active、inactive、disabled。":
    "The account resource status, for example `active`, `inactive`, or `disabled`.",
  "授权模式，例如 qrcode、code、session。":
    "The authorization mode, for example `qrcode`, `code`, or `session`.",
  "provider 侧账号公开标识。": "The provider-side public account identifier.",
  "授权流程状态，例如 pending_auth、awaiting_qr_scan、authorized、failed。":
    "The authorization flow status, for example `pending_auth`, `awaiting_qr_scan`, `authorized`, or `failed`.",
  "可选。WhatsApp 中与 up_to_message_sender_id 一起发送目标消息的 read receipt；省略两者时标记整个会话已读。":
    "Optional. For WhatsApp, send this together with `up_to_message_sender_id` as the target message read receipt; omit both fields to mark the whole conversation as read.",
  "up_to_message_id 对应消息的 provider 原始发送者 ID；群聊应传 webhook data.sender.id。与 up_to_message_id 成对必填。":
    "The original provider sender ID for the message identified by `up_to_message_id`. For group messages, use webhook `data.sender.id`. This field and `up_to_message_id` must be supplied together.",
  "相对静音时长，单位秒；0 表示永久静音。":
    "The relative mute duration in seconds. A value of `0` means muted indefinitely.",
  "RFC3339 绝对结束时间，与 `duration` 互斥。":
    "An absolute RFC3339 end time. Mutually exclusive with `duration`.",
  "为空表示新建，非空表示更新。":
    "An empty value creates a new resource; a non-empty value updates an existing one.",
  "传空字符串表示清空备注。": "Pass an empty string to clear the note.",
  "传空字符串表示清空描述。": "Pass an empty string to clear the description.",
  "provider 侧接收方 ID。": "The provider-side recipient ID.",
  "来自入站事件 `data.message.reply_token` 的不透明句柄。":
    "An opaque handle from `data.message.reply_token` in an inbound event.",
  "目标消息作者标识；缺省通常表示账号自身。":
    "The target message author's identifier. Omitting it usually refers to the account itself.",
  "空字符串表示取消回应。": "An empty string removes the reaction.",
  "为空或省略表示接收全部事件。": "An empty or omitted value subscribes to all events.",
  "用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。":
    "The secret used to sign webhook deliveries. It is submitted only in requests and is never returned in responses."
};

const STATIC_MARKDOWN_TRANSLATIONS: Readonly<Record<string, string>> = {
  // 契约示例值也会进入英文文档，只翻译展示文本，字段名和示例结构保持不变。
  默认密钥: "Default key",
  张三: "Example User",
  "<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->":
    "<!-- Generated by pnpm generate. Update the public contract or generator instead of editing this file. -->",
  "<!-- 此文件由 pnpm generate 生成；修改契约或生成器后重新生成。 -->":
    "<!-- Generated by pnpm generate. Update the contract or generator instead of editing this file. -->",
  "本表把 Device API 的每个 `operationId` 映射到 SDK 显式方法和 MCP 暴露策略。`never` 表示该 operation 仍由 SDK 支持，但因权限或 secret 边界不进入模型工具面。":
    "This table maps every Device API `operationId` to its explicit SDK method and MCP exposure policy. `never` means the SDK supports the operation, but the model tool surface excludes it because of permission or secret boundaries.",
  "SDK 返回 `ApiResult<T>`，包含 `data`、`status`、可选 `requestId` 与底层 `response`。":
    "The SDK returns `ApiResult<T>` with `data`, `status`, an optional `requestId`, and the underlying `response`.",
  "> 此 operation 可能返回一次性或敏感数据。只在受控位置处理，不要记录完整响应。":
    "> This operation may return one-time or sensitive data. Handle it only in controlled locations and never log the full response.",
  "> 示例中的敏感值只是占位符；实际值应从受控运行环境读取，且不得写入日志。":
    "> Sensitive values in this example are placeholders. Read real values from a controlled runtime environment and never write them to logs.",
  "字段说明严格来自公开契约；`-` 表示契约尚未提供额外说明，不根据实现推测。":
    "Field descriptions come strictly from the public contract. `-` means the contract provides no additional description; implementation details are never inferred.",
  "示例默认已有配置完成的 `UnifyPortDeviceClient` 实例 `device`。API key 只在 client 初始化时提供，":
    "Examples assume a configured `UnifyPortDeviceClient` instance named `device`. The API key is provided only when the client is initialized",
  "同一生成过程还会更新 API 覆盖表和 TypeScript 示例校验文件；示例与 SDK 类型不一致时，":
    "The same generation step also updates the API coverage table and the TypeScript example fixture. If an example no longer matches the SDK types,",
  "每个 operation 都提供参数、请求体、响应和 TypeScript 调用示例。":
    "Every operation includes parameters, request-body details, responses, and a TypeScript example.",
  "无 path、query、header 或 cookie 参数。": "No path, query, header, or cookie parameters.",
  "当前 operation 没有 `application/json` 请求体。":
    "This operation has no `application/json` request body.",
  "公开契约未定义 2xx 成功响应。": "The public contract does not define a 2xx response.",
  "这些页面不手工编辑。API 变更应先更新经批准的":
    "Do not edit these pages manually. For API changes, first update the approved",
  "[Device OpenAPI 契约](../../contracts/device.openapi.yaml)，再运行：":
    "[Device OpenAPI contract](../../contracts/device.openapi.yaml), then run:",
  "[返回 API Reference 索引](README.md)": "[Back to the API Reference index](README.md)",
  "可选 JSON 请求体。": "Optional JSON request body.",
  "JSON 请求体。": "JSON request body.",
  "无请求体。": "No request body.",
  "不会出现在 operation 参数中。": "and never appears in operation parameters.",
  允许安全重试: "Safe retries enabled",
  不自动重试: "No automatic retries",
  父字段存在时必填: "Required when parent is present",
  "`X-Api-Key`（由 client 注入）": "`X-Api-Key` (injected by the client)",
  "本 Reference 由 ": "This reference is generated from ",
  " 自动生成，当前包含 ": " and currently contains ",
  " 个 operation。": " operations.",
  "成功状态 ": "Success status ",
  " 无响应体，": " has no response body; ",
  " 的响应字段：": " response fields:",
  "`result.data` 为 `undefined`。": "`result.data` is `undefined`.",
  "`pnpm typecheck` 会失败。": "`pnpm typecheck` fails.",
  "## 本页 operation": "## Operations on this page",
  "## 维护方式": "## Maintenance",
  "## 分组": "## Groups",
  "### 参数": "### Parameters",
  "### 请求体": "### Request body",
  "### 返回值": "### Responses",
  "### TypeScript 示例": "### TypeScript example",
  "# API 覆盖率": "# API coverage",
  "- 公开 operation：": "- Public operations: ",
  "- SDK 显式方法：": "- Explicit SDK methods: ",
  "- 可进入 MCP registry 的 operation：": "- Operations eligible for the MCP registry: ",
  "- MCP 永久排除：": "- Operations permanently excluded from MCP: ",
  "SDK 方法": "SDK method",
  "SDK 返回": "SDK return type",
  "SDK 字段": "SDK field",
  "Content-Type": "Content-Type",
  "HTTP status": "HTTP status",
  operationId: "operationId",
  "MCP policy": "MCP policy",
  变更类型: "Mutability",
  自动重试: "Automatic retry",
  认证: "Authentication",
  属性: "Property",
  位置: "Location",
  必填: "Required",
  必有: "Present",
  类型: "Type",
  示例: "Example",
  约束: "Constraints",
  说明: "Description",
  字段: "Field",
  值: "Value",
  是: "Yes",
  否: "No",
  无: "None",
  "：": ": "
};

function normalizeContractText(value: string): string {
  return value.replaceAll(/\s+/gu, " ").trim();
}

function translateContractText(value: string, usedTranslations?: Set<string>): string {
  if (!/[\p{Script=Han}]/u.test(value)) return value;
  const normalized = normalizeContractText(value);
  usedTranslations?.add(normalized);
  const translated = ENGLISH_CONTRACT_TEXT[normalized];
  if (translated === undefined) throw new Error(`API Reference 缺少英文翻译: ${normalized}`);
  return translated;
}

function translateOpenApiValue(
  value: OpenApiJsonValue,
  usedTranslations?: Set<string>
): OpenApiJsonValue {
  if (Array.isArray(value)) {
    return value.map((child) => translateOpenApiValue(child, usedTranslations));
  }
  if (value === null || typeof value !== "object") return value;
  const translated: OpenApiJsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    translated[key] =
      (key === "summary" || key === "description") && typeof child === "string"
        ? translateContractText(child, usedTranslations)
        : translateOpenApiValue(child, usedTranslations);
  }
  return translated;
}

function translateOpenApiObject(
  value: OpenApiJsonObject,
  usedTranslations?: Set<string>
): OpenApiJsonObject {
  const translated = translateOpenApiValue(value, usedTranslations);
  // 显式守卫避免把生成器边界建立在不安全类型断言上。
  if (translated === null || Array.isArray(translated) || typeof translated !== "object") {
    throw new Error("API Reference 翻译结果必须是 object");
  }
  return translated;
}

export function toEnglishApiReferenceSource(source: ApiReferenceSource): ApiReferenceSource {
  const usedTranslations = new Set<string>();
  const document = translateOpenApiObject(source.document, usedTranslations);
  // 公开契约是翻译键的唯一来源；拒绝陈旧条目，避免 API 删除后遗留不可见翻译。
  const unusedTranslations = Object.keys(ENGLISH_CONTRACT_TEXT).filter(
    (sourceText) => !usedTranslations.has(sourceText)
  );
  if (unusedTranslations.length > 0) {
    throw new Error(`API Reference 存在多余英文翻译: ${unusedTranslations.join(" | ")}`);
  }
  return {
    ...source,
    document,
    operations: source.operations.map((operation) => ({
      ...operation,
      summary: translateContractText(operation.summary),
      description: translateContractText(operation.description),
      parameters: operation.parameters.map((parameter) => translateOpenApiObject(parameter)),
      ...(operation.requestBody === undefined
        ? {}
        : { requestBody: translateOpenApiObject(operation.requestBody) }),
      responses: translateOpenApiObject(operation.responses)
    }))
  };
}

export function translateGeneratedMarkdownToEnglish(markdown: string): string {
  let translated = markdown;
  const replacements = Object.entries(STATIC_MARKDOWN_TRANSLATIONS).sort(
    ([left], [right]) => right.length - left.length
  );
  for (const [source, target] of replacements) translated = translated.replaceAll(source, target);
  const untranslated = /[\p{Script=Han}]/u.exec(translated);
  if (untranslated !== null) {
    const start = Math.max(0, untranslated.index - 40);
    throw new Error(`英文生成文档仍包含中文: ${translated.slice(start, start + 120)}`);
  }
  return translated;
}

export function addLanguageNavigation(
  markdown: string,
  englishHref: string,
  chineseHref: string
): string {
  const lines = markdown.trimEnd().split("\n");
  const headingIndex = lines.findIndex((line) => line.startsWith("# "));
  if (headingIndex < 0) throw new Error("双语文档缺少一级标题");
  // 语言入口固定跟随 H1，避免每个模板分别维护导航位置。
  lines.splice(headingIndex + 1, 0, "", `[English](${englishHref}) | [简体中文](${chineseHref})`);
  return `${lines.join("\n")}\n`;
}
