import type { ApiReferenceSource, OpenApiJsonObject, OpenApiJsonValue } from "./api-reference.js";

// 公开契约保留现有中文说明；英文目录只维护一份扁平翻译表，避免复制 OpenAPI 结构后发生协议漂移。
const ENGLISH_CONTRACT_TEXT: Readonly<Record<string, string>> = {
  // FB 描述与公开字段同步翻译，避免生成英文参考时遗漏渠道边界。
  "Facebook 标准回调；是否可用以接入环境开放情况为准，不代表真实账号投递已验收。":
    "Facebook standard callback. Availability depends on the integration environment; this is not evidence of real-account delivery acceptance.",
  "原生媒体时长，单位尚未确认；不得按 duration_ms 解读或转换。":
    "Native media duration with an unconfirmed unit. Do not interpret or convert it as duration_ms.",
  "FB 单条消息中的有序附件。媒体 URL 可缺失；加密或下载失败的地址不作为可用明文地址。":
    "Ordered attachments in one Facebook message. Media URLs may be absent; encrypted or failed-download addresses are not usable plaintext URLs.",
  "普通文本和媒体消息省略 type，单个无正文贴纸可为 sticker。ID 是字符串；reply_to_message_id 不表示支持引用发送。":
    "Ordinary text and media messages omit type; a single sticker without text may use sticker. IDs are strings; reply_to_message_id does not imply support for sending replies.",
  "不透明事件 ID；重试保留原值，SDK 不重算。":
    "Opaque event ID. Retries retain the original value; the SDK does not recompute it.",
  "@ 目标。`type` 缺省时按 `member` 处理，以兼容旧请求； `type=member` 必须传 `id`，`type=all` 不传 `id` 且仅适用于群聊。":
    "Mention target. Omitted type defaults to member for compatibility. member requires id; all omits id and is group-only.",
  "API Key public_id，例如 `ak_xxx`。": "The API key `public_id`, for example `ak_xxx`.",
  "API Key 列表。不会返回完整明文 API Key。":
    "A list of API keys. Full plaintext API keys are never returned.",
  "API 基础地址，实际地址以当前环境提供的接入信息为准。":
    "API base address; configure the address provided for your environment.",
  "Device API 分配的五位数字字符串错误码；Provider 细分原因可以在不改变 HTTP 和 code 的前提下覆盖默认值。whatsapp 发送时的账号受限使用 20102，与该渠道账号受限回调的数字码一致；whatsapp-protocol 同步账号受限仍使用 30020。仅 whatsapp 群消息发送明确需要管理员权限时使用 34012，保持 HTTP 502 和 code=provider_unavailable。仅 whatsapp 添加联系人明确未将目标号码识别为有效联系人时使用 35009，保持 HTTP 500 和 code=create_contact_failed，不确认号码未注册或永久不可用。":
    "Five-digit API error code represented as a string. Detailed reasons may refine it without changing HTTP/code. WhatsApp send restriction uses 20102; Protocol login restriction uses 30020. WhatsApp group-admin send rejection uses 34012 with HTTP 502 provider_unavailable. Unrecognized WhatsApp contact uses 35009 with HTTP 500 create_contact_failed, without proving nonregistration/permanent absence.",
  "Device API 签发的账号 public_id。": "Public account ID issued by the API.",
  "PATCH 部分更新；字段省略时保留原值，显式 null 不合法，空数组或空对象表示清空对应集合。 实际改变 auth_mode 必须仅提交 auth_mode，不能混入其他字段或未知字段。 目标模式必须为该渠道支持的方式；相同模式保留原授权。Telegram、WhatsApp 实际切换会清除旧会话，包括已授权会话；成功后须重新授权。 `whatsapp-protocol` 凭证只能提交到 `/v1/accounts/{account_id}/auth/session` 的嵌套 `whatsapp-protocol` 对象，不能通过 provider_data 提交；不能在 whatsapp-protocol 与其他 provider 之间切换。":
    "PATCH preserves omitted fields, rejects null and clears collections with empty arrays/objects. Actual auth_mode changes must be the sole field, supported by the channel; unchanged mode preserves authorization. Telegram/WhatsApp changes clear existing sessions and require reauthorization. Protocol credentials belong only in nested auth/session input; switching between Protocol and other providers is forbidden.",
  "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。":
    "Opaque provider cursor: return next_cursor unchanged. Forged/expired/reused cursors may be ignored, restart pagination or produce channel errors; no universal 400 behavior is guaranteed.",
  "Provider 仅返回部分号码时的遮蔽手机号。": "Masked phone when only partial digits are available.",
  "Provider 授权会话已创建。": "Hosted authorization session created.",
  "RFC3339 时间戳，只返回此时间后更新的联系人；渠道不支持增量过滤时可能返回全量结果。":
    "RFC3339 timestamp for contacts updated after this time; channels without incremental filtering may return all contacts.",
  "RFC3339 格式的准备失效时间；从创建通话起默认 2 分钟，可由服务端调整，请以此字段判断截止时间，不要自行写死时长。":
    "RFC3339 preparation expiry, normally two minutes after creation but configurable. Use this timestamp rather than a fixed client duration.",
  "RFC3339 绝对结束时间，与 `duration` 互斥。":
    "An absolute RFC3339 end time. Mutually exclusive with `duration`.",
  "Telegram 截至指定消息已读": "Telegram read through one message",
  "TikTok 可在 body 中临时传入 Boolean enable_comment 覆盖账号设置；默认沿用 provider_data.enable_comment，缺省 false。 在线 TikTok 账号重复 start 不保证配置更新，配置变化须通过 reconnect 生效。 HTTP 200 表示启动请求已被接受或由当前状态幂等满足，不等同于账号已经连接成功， 也不保证本次实际调用了 Provider。WhatsApp 在真正启动前会先只读探测 Provider； `client_connect=true` 是强在线证据，即使同一响应带有滞后的 QR/Passkey 标签也返回 `running`；`status=init` 且 `client_connect=false` 返回 `starting`，不推断需要授权。 当 Provider 明确返回需要继续授权的状态时，响应会额外包含 `auth_required=true` 和标准化的 `auth_status`；调用方应转入账号授权接口， 不应把 `runtime_status=disconnected` 当作启动接口失败并反复重试。Provider 已进入 QR 流程但二维码仍在异步生成时，`auth_status` 为 `pending`，不会把 Session 写成无二维码内容的 `awaiting_qr_scan`。其他情况下，共享 Session 已处于 `pending`、 `awaiting_qr_scan` 或 Passkey 进行态时，重复调用只返回当前授权提示，不会 再次启动 Provider 或刷新现有授权流程。":
    "TikTok accepts a Boolean enable_comment override, otherwise uses provider_data.enable_comment, default false. Repeated start does not guarantee configuration application; reconnect to apply changes. HTTP 200 means accepted or already satisfied, not connected. WhatsApp running/starting/reconnecting/stopping results must not trigger repeated starts. auth_required=true and auth_status direct the caller to authorization; disconnected alone does not prove authorization is needed. pending can mean QR generation is in progress. Existing QR/Passkey progress is preserved. Uncertain or concurrently changed state can return 409 without starting again.",
  "TikTok 可在 body 临时传入 Boolean enable_comment 覆盖账号配置；缺省 false，非法类型返回 400 invalid_request。 显式启动或继续二维码授权。WhatsApp Provider 返回 `init` 或尚未生成二维码时， 响应保持 `pending`，不会伪装成可扫码状态。 Provider 已进入 Passkey 时会继续现有流程；响应只保留标准 `auth_payload`， 不返回 Provider 原始 `code`、`info` 或二维码兼容字段。":
    "Starts or continues QR authorization. TikTok accepts a Boolean enable_comment override, default false; invalid types return 400 invalid_request. A QR still being generated remains pending. An uncertain state may return 409 rather than refresh or interrupt authorization. After a timeout or unknown result, query existing progress instead of starting repeatedly. Existing Passkey flows continue through standard auth_payload. After WhatsApp authorization, explicitly call /runtime/start if runtime remains stopped or disconnected.",
  "TikTok 可设置 `provider_data.enable_comment` 为 Boolean，默认 false；字符串、数字、null 均返回 400 invalid_request。 在线修改后需 reconnect 生效，start 成功不证明配置已应用；关闭不撤回已排队事件。 渠道扩展配置。创建 Telegram 账号时，`provider_data.api_id` 和 `provider_data.api_hash` 均为可选，适用于 `auth_mode=code`、`qrcode` 和 `session`；未指定自定义应用凭证时使用平台默认 Telegram 应用凭证。 使用自定义应用凭证时，请成对提供同一 Telegram 应用的 `api_id` 和 `api_hash`，两者均使用字符串。 需要使用平台默认凭证但默认配置不可用时，创建请求失败；平台调整默认凭证不会自动替换已有账号凭证。":
    "TikTok enable_comment accepts Boolean only, default false; other types/null return 400. Online changes need reconnect; disabling does not retract queued events. Telegram api_id/api_hash are optional in code/qrcode/session modes; omitted custom credentials use platform defaults. Custom credentials must be paired strings from the same application. Missing required defaults fail creation; changing platform defaults does not replace existing account credentials.",
  "TikTok 扫码后需要提交验证码": "TikTok requires a code after scanning",
  "TikTok 重连会应用最新 provider_data.enable_comment；可在 body 中临时传入 Boolean enable_comment 覆盖，false 显式关闭。 字符串、数字或 null 返回 400 invalid_request。轮询默认关闭；关闭不撤回已排队事件。":
    "TikTok reconnect applies provider_data.enable_comment; a Boolean body override may explicitly disable it. String, numeric and null values return 400 invalid_request. Polling defaults off; disabling does not retract queued events.",
  "UnifyPort Device API 提供统一的多渠道账号接入与业务操作能力，涵盖账号授权与管理、 消息、会话、联系人、群组和 Webhook 等功能。 对外响应及 Webhook 中表示绝对时刻的时间字段使用 RFC 3339 格式，并规范化为 UTC `Z`； 客户端展示时可转换为用户所在时区。请求中的时间字段按各接口说明接受带时区的 RFC 3339 值。 `/v1/` 下的接口默认使用 `X-Api-Key` 鉴权；具体请求参数、响应结构和渠道支持范围以各接口说明为准。":
    "Unified multi-channel accounts, authorization, messaging, conversations, contacts, groups and Webhooks. Absolute response and Webhook timestamps use RFC 3339 UTC Z; convert for display. Requests accept timezone-aware timestamps as documented. Public /v1/ operations use X-Api-Key unless stated otherwise; consult each operation for its supported channels and fields.",
  "UnifyPort 本次通话 ID，同一通话生命周期内保持不变。":
    "Opaque call ID stable throughout this call lifecycle.",
  "Webhook endpoint public_id，例如 `we_xxx`。":
    "The webhook endpoint `public_id`, for example `we_xxx`.",
  "Webhook endpoint 列表。": "A list of webhook endpoints.",
  "Webhook endpoint 详情。": "Webhook endpoint details.",
  "WhatsApp Business 账号的商业或认证名称。": "WhatsApp Business or verified name.",
  "WhatsApp BusinessName；渠道未返回时省略。": "WhatsApp BusinessName; omitted when unavailable.",
  "WhatsApp BusinessName；渠道未返回时该字段缺失。":
    "WhatsApp BusinessName; absent when unavailable.",
  "WhatsApp Protocol 的会话导入凭证，仅可提交至账号会话导入接口。 响应不回显协议密钥或其他敏感凭证。手机号用于身份一致性校验；协议公钥、协议私钥 仅供上游启动使用。`edge_routing` 由平台固定注入，业务方不得提交。":
    "Protocol session credentials for the session-import endpoint only. Responses do not echo keys/secrets. Phone validates identity; protocol keys are used for startup. edge_routing is platform-managed and must not be supplied.",
  "WhatsApp phone JID 中解析出的纯手机号。": "Plain phone parsed from a WhatsApp phone JID.",
  "WhatsApp 会话标签 ID；未提供时返回“特别关注”会话。":
    "WhatsApp label ID; omitted means favorite conversations.",
  "WhatsApp 单选投票": "WhatsApp single-choice poll",
  "WhatsApp 发送成功且可引用上下文完整时返回；包括新发送投票，普通文字可据此引用它。未提供时省略，accepted 状态不因此改变。":
    "Optional WhatsApp reply handle when complete context is available, including new polls that ordinary text may reference. Omission does not change accepted status.",
  "WhatsApp 同一发送者的多条消息已读": "WhatsApp read multiple messages from one sender",
  "WhatsApp 对端标识；外呼事件中表示被呼叫方。":
    "WhatsApp peer identifier; outbound events identify the called peer.",
  "WhatsApp 当前账号设置的 PushName；其他渠道不定义该字段语义。":
    "Current WhatsApp PushName; no cross-channel semantics.",
  "WhatsApp 提供的广告点击标识；作为不透明字符串保存，未提供时省略该字段。":
    "Opaque WhatsApp advertising click identifier; omitted when unavailable.",
  "WhatsApp 整个会话已读": "WhatsApp whole-conversation read",
  "WhatsApp 未提供 label_id 时返回“特别关注”会话，提供时返回指定标签成员；其他 Provider 使用各自的默认会话语义。 Twitter 仅返回用户会话；next_cursor 是不透明值，has_more 为 true 时调用方应将其原样用于下一页，分页结束时 has_more 为 false 且不返回 next_cursor。格式非法或不完整的 cursor 返回 400 provider_invalid_request。":
    "WhatsApp returns favorite conversations without label_id, or label members with it. Other channels retain their conversation semantics. Twitter returns user conversations only. Pass next_cursor unchanged while has_more=true; the last page omits it. Invalid/incomplete cursors return 400 provider_invalid_request.",
  "WhatsApp 标准私聊 LID；必须属于 before 指向的会话，不接受手机号或其他会话类型。":
    "WhatsApp user LID matching the anchor conversation; phone numbers and other conversation types are invalid.",
  "WhatsApp 消息级已读的渠道侧发送者标识，与非空 up_to_message_id 成对提供；群聊应传 Webhook 事件中的 data.sender.id。多个消息 ID 必须属于同一发送者。Telegram 不支持此参数，提供非空值时返回 invalid_request。":
    "WhatsApp message-level sender paired with nonempty message IDs; use Webhook data.sender.id for groups. Multiple IDs must share a sender. Nonempty sender is invalid for Telegram.",
  "WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。":
    "WhatsApp contact username, independent of push_name. Returned only when a nonempty value is known. Absence is unknown, not proof of no username and not a clearing instruction.",
  "WhatsApp 自动历史同步与按需补拉使用相同的历史保留与媒体获取规则：默认每批每会话最多保留最近 100 条消息，并尝试获取已保留的最近 100 条消息内的受支持交互头部媒体，文本消息也计数。历史保留数量和媒体获取范围可由服务配置独立调整；不设历史条数上限时只处理实际收到的批次，不主动补齐全部历史；不设额外媒体窗口时，对本批已保留消息中的所有受支持交互头部媒体尝试获取。不保证收到 100 条消息或全部媒体可恢复。获取成功且提供有效 URL 时为 false；获取失败或超出所配置的媒体窗口时为 true。未尝试且状态未知时可省略。媒体恢复后应同时合并本次 url 和 expired=false，覆盖旧 true；缺失字段不清空旧状态，该状态不保证 URL 永久可下载。":
    "Automatic/on-demand WhatsApp history shares retention/media rules: default latest 100 messages per conversation/batch, including text, with supported interactive-header media attempted within that window. Retention/media settings are independent; unlimited settings still process received batches only. Neither 100 messages nor complete media recovery is guaranteed. expired=false requires recovered valid URL; failure/outside-window means true, unknown may be omitted. Merge recovered URL and false together; absence preserves prior state and no URL permanence is guaranteed.",
  "WhatsApp 账号删除前会实时确认设备状态。未连接或已停止时完成平台侧清理， 不保证 WhatsApp 侧的登录会话已注销；在线时先退登再清理。 删除过程中确认设备已不存在时按已删除处理。 额度账号删除完成后、余额账号删除受理后，账号立即从当前账号列表中消失。余额账号先在事务内受理并禁用；返回202与同一个DELETE操作，完成后重复删除返回204。 结算按受理锁下本平台已落库的授权成功记录冻结：无记录且不足24小时全退，其他按剩余完整天计算。 已扫码但回调未落库同样视为无记录；迟到回调不改结算、不二退、不恢复账号。未知HTTP或清理失败不会伪报成功。":
    "WhatsApp deletion checks current connectivity. Offline/stopped accounts are removed from the platform without guaranteeing remote logout; online accounts are logged out first. An already missing device is treated as removed. Accounts disappear from lists after quota deletion completion or wallet deletion acceptance. Wallet deletion disables the account and returns 202 with the same DELETE operation; repeats return 204 after completion. Settlement uses the authorization-success records recorded at acceptance: no record and less than 24 hours gives a full refund; otherwise remaining full days apply. Scanning without a recorded callback counts as no record. Late callbacks do not change settlement, refund twice or restore accounts. Unknown HTTP outcomes and cleanup failures are not reported as success.",
  "WhatsApp 账号授权失效事件": "WhatsApp authorization failure",
  "WhatsApp 通话消息创建事件": "WhatsApp call-record creation",
  "WhatsApp 通话消息状态更新事件": "WhatsApp call-record update",
  "WhatsApp 链接预览": "WhatsApp link preview",
  "Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。":
    "Workspace state. inactive prevents this workspace's API keys from authenticating.",
  "`full_sync` 表示全量同步完成后的快照；`self_rename` 表示当前账号主动改名；`avatar_change` 表示账号头像变化。":
    "full_sync=completed sync snapshot; self_rename=self name change; avatar_change=account avatar change.",
  "`message.type=sticker` 用于发送贴纸，当前仅 WhatsApp user/group 支持，不包含 whatsapp-protocol。 url/file_url/file_key 恰好提供一个非空来源；本期 WhatsApp 只支持 HTTP(S) url/file_url，file_key、非空 mentions 或不支持的目标返回 501 unsupported_by_provider。 API 按原字节提交 WebP，不设置静态性、像素尺寸或渠道业务大小限制；静态、动画及具体素材兼容性由渠道判定。 本接口仅检查基本 WebP 容器完整性，不解码或转码。下载与暂存的硬资源上限为 10 MiB（10485760 字节），下载最多 15 秒、3 次跳转。 该上限是本接口的资源边界，不代表渠道接受该大小以内的所有素材。accepted 仅表示受理，不保证送达、素材可解码或动画播放效果。 sticker 不允许 text/caption/contacts/poll/link_preview 等其他内容字段，即使为 null 或空值也返回 400 invalid_request。 sticker 的 provider_data 只能省略或为空对象；非对象为 400 invalid_request，非空对象为 400 provider_invalid_request。 支持既有 reply_to.reply_token；无效或无法解封的 token 返回 400 invalid_reply_token。 基本 WebP 容器不完整、不可接受的素材来源地址或超过硬资源上限时，发送前返回 400 provider_invalid_request、numeric_code=36007，表示贴纸尚未发送。 message 提供具体素材校验原因，原因缺失时为 Invalid sticker media；调用方按数字码判断，修正素材或来源地址后再发送。 非空 provider_data、公共结构错误和实际渠道参数拒绝沿用各自分类，实际渠道参数拒绝仍为 400 provider_invalid_request、numeric_code=30001。 贴纸实际发送失败保留既有 HTTP、code、numeric_code 和专属分类提示，提供可用的具体失败原因；上游未提供时沿用默认提示。其他消息类型保持既有行为。 素材获取的 HTTP 故障、超时、存储或其他准备失败返回 500 send_message_failed、numeric_code=36001，message 提供具体准备失败原因，缺失时沿用默认提示；不使用 36007。 sticker 超时或结果不明时不会自动重发；request_id/client_request_id 仅用于追踪，不提供发送幂等保证。 `message.type=poll` 用于创建投票；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 投票必须提供非空白题目、至少两个非空白标题的选项及整数 max_selections（1 到选项数）；原文保持不变。 本项目 WhatsApp 发送策略限制题目最多 255 个 Unicode 字符、选项最多 12 个、每项标题最多 100 个 Unicode 字符，并拒绝完全相同的原文标题；这些不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 投票不支持 reply_to 或非空 mentions；不支持的渠道、目标或组合返回 HTTP 501 unsupported_by_provider。 投票公共结构、null、未知字段或混合载荷错误返回 HTTP 400 invalid_request；违反 WhatsApp 字段策略或提供 provider_data.context_info/extra 返回 HTTP 400 provider_invalid_request。 创建成功沿用发送响应；引用上下文完整时可选返回 data.reply_token，普通文字消息可通过 reply_to.reply_token 引用该投票，无需等待创建回调。 缺少可引用上下文时省略 token，accepted 状态不因此改变；不能用 message_id 或 provider_ref 代替 token。新投票自身仍不支持 reply_to，不提供投票统计或代替账号投票。 超时或响应不完整时发送结果可能未知，先核对实际消息与回调再决定重试。 `message.type=link_preview` 用于发送自定义链接预览；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 公共结构要求非空正文和 HTTP(S) 目标链接；WhatsApp 还要求非空标题、图片 URL，以及目标链接原文出现在正文中。 本项目 WhatsApp 发送策略限制标题最多 255 个 Unicode 字符、摘要最多 1024 个 Unicode 字符；这不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 链接预览不支持 `reply_to` 或非空 `mentions`，不支持的渠道、目标或组合返回 HTTP 501 `unsupported_by_provider`。 公共字段格式错误返回 HTTP 400 `invalid_request`；违反上述 WhatsApp 字段策略或使用覆盖卡片数据的渠道扩展返回 HTTP 400 `provider_invalid_request`。 本接口不抓取目标网页生成预览，调用方提供卡片内容。HTTP 200 / accepted 不表示已送达，也不保证一定收到自同步回调。 WhatsApp 消息发送被平台明确限制时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30019`。 调用方应按该数字码停止对此类失败的自动重试，确认平台限制解除后再发送。 `whatsapp` 群消息发送被明确拒绝为需要管理员权限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=34012`，`message` 为 `Group administrator privileges are required to send messages to this group`。 调用方应停止自动重试，核实群发言权限和当前账号角色，由群管理员调整权限后再发送。 此错误不表示该群一定是社群公告群，也不确认群设置或账号角色的具体状态；不适用于 `whatsapp-protocol`。 Device API 在 `whatsapp` 发送操作中识别到账号受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=20102`，与该渠道账号受限 Webhook 的数字码一致。调用方应停止该账号的自动发送和重试， 引导用户在官方 WhatsApp 客户端检查并处理限制，恢复正常后再按需重新授权。 此分类不会自动修改账号状态或产生额外回调，不能仅因运行状态为 `running` 恢复发送。 Device API 识别到 `whatsapp-protocol` 账号当前登录受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30020`。调用方必须停止自动重试，引导用户前往官方 WhatsApp 客户端检查， 处理完成并重新授权后再恢复发送。上述错误都不表示永久封号，也不能据此认定账号已确认封禁或存在固定恢复期限； 其他发送失败沿用原有错误分类。 Device API 识别到 WhatsApp 账号连接未建立时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30021`，`message` 保留原始连接错误；此错误不表示已登出或授权失效。 调用方应暂停发送，调用 `POST /v1/accounts/{account_id}/runtime/refresh`，按最新状态恢复连接， 确认 `runtime_status=running` 后再发送。失败请求不会自动重发或重连。 `numeric_code=30010` 的 `message` 在有原因时为 `Provider operation failed: <原始错误原因>`， 没有原因时为 `Provider operation failed`；调用方应按数字码判断，不依赖可变化的文案。":
    "sticker sends WebP to WhatsApp user/group targets only, excluding whatsapp-protocol. Provide exactly one nonempty url/file_url/file_key; WhatsApp currently accepts HTTP(S) url/file_url only. file_key, nonempty mentions or unsupported targets return 501 unsupported_by_provider. Original WebP bytes are sent without transcoding; basic container integrity is checked, not channel rendering compatibility. Fetching is limited to 10 MiB, 15 seconds and three redirects. accepted does not guarantee delivery or animation. Other content fields are forbidden even when empty/null. provider_data must be omitted or {}; nonobjects return invalid_request and nonempty objects provider_invalid_request. Existing reply_to.reply_token is supported. Invalid material/source/size returns 400 provider_invalid_request / 36007 before sending; fix the material before resubmission. Actual channel rejection remains 30001. Fetch/storage/preparation failures return 500 send_message_failed / 36001. Unknown sticker outcomes are not retried; tracking IDs do not provide idempotency. poll creates WhatsApp user/group polls only. Require a nonblank question, at least two nonblank distinct original option titles and integer max_selections from 1 to the option count. WhatsApp policy limits question to 255 Unicode characters, options to 12 and titles to 100; these are not universal channel limits. reply_to/nonempty mentions are unsupported (501); invalid public structure/null/unknown/mixed fields return 400 invalid_request; channel field policy or provider_data.context_info/extra violations return provider_invalid_request. Optional returned reply_token can be used by ordinary text messages to reference the poll; do not substitute message_id/provider_ref. The poll itself cannot reply to another message; statistics and voting are not provided. Reconcile uncertain results before retrying. link_preview sends caller-supplied cards to WhatsApp user/group only. Require nonempty text and an HTTP(S) target; WhatsApp additionally requires title, image URL and the literal target URL in text. Title/description limits are 255/1024 Unicode characters. reply_to/nonempty mentions are unsupported (501); invalid structure returns invalid_request, while channel policy/card overrides return provider_invalid_request. The API does not scrape the target page. accepted proves neither delivery nor a self-sync callback. Stop automatic retries on WhatsApp platform restriction 30019, group-admin requirement 34012, or account restriction 20102; all retain HTTP 502 provider_unavailable. Verify permissions or resolve restrictions in the official app before resuming. whatsapp-protocol restriction uses 30020 and requires recovery/reauthorization. None proves permanent suspension or a recovery deadline. WhatsApp disconnected sends use 30021, not proof of logout; refresh runtime, restore connectivity and confirm running before sending. Failed requests are not automatically resent or reconnected. numeric_code 30010 may include an original reason; branch on codes, never mutable error text.",
  "`name`、`description`、`avatar_url` 三个字段每次只能传一个。":
    "Only one of `name`, `description`, and `avatar_url` may be provided per request.",
  "`region` 表示默认网络出口地区；指定自定义 `proxy` 时沿用原代理规则。已有账号不会因默认分配策略调整而迁移。 额度和余额模式没有合格默认容量时可能返回 409 `egress_region_unavailable`（20031）；配置暂不可确认返回 409 `egress_configuration_pending`（20032）；默认分配暂时关闭返回 503 `network_maintenance`（20035）。 额度模式创建不提供请求去重或历史结果重放；响应结果不明时请先核对账号列表，避免重复创建。 额度模式兼容原请求；余额模式直接创建，在同一事务内按当前梯度核价并扣款，不需要报价接口。 余额模式优先使用所选地区的直连容量；没有直连候选且未指定自定义 `proxy` 时，Telegram、WhatsApp 和 WhatsApp Protocol TCP 可使用已启用的平台代理补充。未开放的渠道仍沿用原分配规则。 代理分配与核价扣款原子提交；分配竞争或配置不可用不会自动改选其他候选。删除或退款完成不保证该地区立即有新容量。 同一工作区同步建号执行中，第二笔请求立即返回 409 wallet_account_creation_in_progress（20030）；请等待前一笔完成。 Idempotency-Key 可选。同工作区同键同参数返回原账号和周期，不重复扣款；同键异请求返回冲突。 未传幂等键时，前一笔完成后的再次请求视为新建号；调用方负责避免重复提交。 有键重试返回首次创建的安全身份与周期快照，即使账号随后删除也不会再次建号或扣款；当前状态请查询原操作。 新建事务提交后计时 720 小时，必要配置异步执行；返回账号不代表已完成渠道授权。 未扫码、重新授权、掉线和重连均不重新扣款或重置周期。本版不执行自动续费或到期停服。 余额不足返回 409 wallet_insufficient_funds（20023）；同键异请求返回 409 wallet_idempotency_conflict（20024）。 新消费关闭返回 409 wallet_workspace_disabled（20022）；资金或配置不可用返回 503 wallet_unavailable（20028）。":
    "region selects the default network egress region; a custom proxy retains its existing behavior. Existing accounts are not migrated by allocation changes. Missing capacity returns 409 egress_region_unavailable (20031), unresolved configuration returns 409 egress_configuration_pending (20032), and maintenance returns 503 network_maintenance (20035). Quota creation has no deduplication or historical replay: reconcile the account list after uncertain results. Wallet creation directly prices and debits the current tier atomically, without a quote. Direct capacity is preferred; enabled platform proxies can supplement Telegram, WhatsApp and WhatsApp Protocol TCP without custom proxies. Other channels retain their allocation behavior. Contention/configuration errors do not automatically select another candidate; deletion/refund does not guarantee immediate capacity. Concurrent creation in a workspace returns 409 wallet_account_creation_in_progress (20030). Optional Idempotency-Key replays the original account and period for identical parameters; changed parameters conflict. Without a key, another request after completion creates another account. Replays retain the original identity/period even after deletion; query the original operation for current state. The 720-hour period starts at transaction commit; configuration may be asynchronous and creation does not prove authorization. Reauthorization or reconnection does not charge again or restart the period. Automatic renewal and expiry suspension are not implemented. Insufficient funds: 409 wallet_insufficient_funds (20023); key conflict: 409 wallet_idempotency_conflict (20024); new purchases disabled: 409 wallet_workspace_disabled (20022); unavailable funds/configuration: 503 wallet_unavailable (20028).",
  "`type=member` 时必填的 Provider 成员标识。": "Provider member ID, required for type=member.",
  "address_book 表示通讯录更新；full_sync 表示收到的同步快照，不表示刚刚手动改名，也不保证完整通讯录或同步完成通知。":
    "address_book is an address-book update; full_sync is a received snapshot, not proof of manual rename, complete address book or sync completion.",
  "audio 为语音，video 为视频；未知时省略，省略不清空原记录。":
    "audio=voice, video=video. Unknown is omitted and does not clear prior media type.",
  "body 省略 account_id 时创建工作空间端点；指定公开账号 ID 时创建该账号的独立端点。 账号独立配置整体优先于工作空间配置，停用或未订阅某类事件不会回退；删除最后一个独立端点后，后续首次投递恢复继承。 account_id 只接受 body 中的非空字符串，不接受 query、null 或重复字段。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 有效的账号配置请求直接创建账号端点，不改建为工作空间端点。 同一 account_id 最多一个 active 独立端点；创建 status=active 时已有 active 端点返回 409 account_webhook_already_exists（40008）。 status=inactive 可创建多个，不占用 active 名额。更换 URL 或其他配置使用 PATCH 更新已有端点。工作空间端点仍可配置多个；历史多 active 端点不会自动清理。 创建后应核对响应的 account_id；账号绑定不可通过 PATCH 修改。":
    "Omitting body account_id creates a workspace endpoint; a public account ID creates an independent account endpoint. Independent configuration entirely overrides workspace configuration, even if inactive or unsubscribed; deleting its last endpoint restores inheritance for subsequent initial deliveries. account_id must be a nonempty body string, not query/null/duplicate; case variants return 400 invalid_request. Missing accounts return 404 account_not_found (20020). One active independent endpoint per account is allowed; conflicts return 409 account_webhook_already_exists (40008). Multiple inactive endpoints are allowed. PATCH existing endpoints to change URL/configuration. Multiple workspace endpoints remain supported; historical multiple-active account configurations are not automatically removed. Verify response account_id; PATCH cannot change ownership.",
  "device-api 签发的账号 public_id。": "Public account ID issued by the API.",
  "device-api 签发的账号 public_id，例如 `acc_xxx`。":
    "Public account ID issued by the API, for example acc_example.",
  "id 是原投票消息 ID，仅更新此投票人的选择；不带操作消息的正文、作者、方向、发送时间或引用凭据。":
    "Original poll message ID; update only this voter. No operation-message body/author/direction/sent_at/reply handle.",
  "inquiry 为询单，accepted 为已接受，declined 为已拒绝；未知时省略，accepted 不表示付款成功。":
    "inquiry/accepted/declined are known order states. Omit unknown; accepted is not payment success.",
  "offered 表示收到邀请，accepted 表示收到接听确认，ended 表示呼叫尝试或通话结束；均不承诺媒体连接已建立。":
    "offered=invitation, accepted=answer confirmation, ended=call attempt/call ended. None alone promises media connection.",
  "post_id 必须与 data.post.id 完全一致。": "post_id must exactly equal data.post.id.",
  "provider 会话导入参数。`whatsapp-protocol` 的协议凭证使用同名嵌套对象； 其他 provider 的既有自由字段通过 additionalProperties 保持兼容。":
    "Session import parameters. Protocol credentials use the nested whatsapp-protocol object; other providers retain supported free fields through additionalProperties.",
  "provider 输入名称。兼容 `x`、`x_client`、`twitter_client`，这些输入会归一化为 `twitter` 并以 `twitter` 输出；Webhook URL path 不适用该别名规则。":
    "Input provider names x/x_client/twitter_client normalize to twitter output. Webhook URL paths do not share these aliases.",
  "provider=whatsapp 的私聊历史补拉复用 conversation.history；按需批次携带 data.history.source=on_demand，自动历史同步不要求该字段。 data.messages[] 是扁平消息数组，能够确定会话的空批次可返回 messages=[]；无法确定会话时不会补造会话或消息。 自动历史同步与按需补拉使用相同的历史保留与媒体获取规则：默认每批每会话最多保留最近 100 条消息，并按已保留的最近 100 条消息（文本消息也计数），对当前支持的普通附件、商品图片和交互头部媒体尝试获取资源。历史保留数量和媒体获取范围可由服务配置独立调整；不设历史条数上限时仍只处理实际收到的批次，不主动补齐全部历史；不设额外媒体窗口时，对本批已保留消息中的所有受支持媒体尝试获取。不保证收到 100 条消息或每条媒体都获得可访问的 URL。请求 limit 仍为 1～50，省略时为 50，不控制媒体窗口。 普通附件和交互头部附件获取成功且提供有效 URL 时 expired=false，获取失败或超出所配置的媒体窗口时为 true；媒体恢复后应同时合并本次 url 和 expired=false，覆盖旧 true，缺失字段不清空旧状态。商品图片仍按实际提供的 product.image_url 保存，URL 不保证永久有效。 按 provider + account_id + data.conversation.id + data.messages[].id 逐条合并消息；顶层 id 用于识别重复批次，不能替代逐消息处理，也不能仅因批次 ID 相同而丢弃整批消息。不将回调顺序视为请求顺序。 只有具有原生消息 ID 且 id、sent_at、direction 完整的内容消息才可构造下一次 before；type=call 的合成通话记录不可用，缺失字段时不使用 occurred_at、当前时间或默认方向替代。 不提供 request_id 关联、下一页游标、分片进度或完成状态。空批次、消息不足 limit 或等待超时均不表示历史已到底。 按需补拉不触发 account.history.synced，不应将其当作账号初始化完成信号。":
    "WhatsApp user history uses conversation.history with history.source=on_demand; automatic sync need not include this field. messages is flat and may be empty for a known conversation. Default retention is the latest 100 messages per conversation/batch, with media attempted within the retained latest 100, including text in the count. Retention/media windows are independently configurable; unlimited settings still process received batches only, without actively restoring all history. Neither 100 messages nor accessible media is guaranteed. Request limit is 1-50, default 50, independent of media windows. Attachments use expired=false with a recovered URL, true on failure/outside the window; merge recovered URL and false together, preserving absent fields. Product images use actual image_url without permanence guarantees. Merge individual messages by provider/account/conversation/message IDs; batch IDs do not replace per-message processing or imply request order. Next before anchors require native content ID/sent_at/direction; exclude synthetic calls and never substitute occurred_at/current time/default direction. No request correlation, next cursor, progress or completion state exists. Empty/short batches and timeouts do not prove exhaustion. On-demand history does not emit account.history.synced.",
  "true 为置顶，false 为取消；字段必需，不能将缺失当成取消。":
    "Explicit required pinned state; missing does not mean unpin.",
  "true 表示仅管理员发言；false 是明确状态，不能视为缺省。":
    "true means admins-only sending. Preserve explicit false.",
  "true 表示开启，false 表示关闭；不能由缺失值推测关闭。":
    "Explicit enabled/disabled state; missing is not false.",
  "url 与 status 必填；其他配置按完整更新语义处理。 account_id 为可选公开账号 ID：创建时省略表示工作空间端点，更新时省略保留已有绑定。 同一账号最多一个 active 独立端点，inactive 可配置多个且不占用 active 名额；创建 active 或将 inactive 改为 active 时，存在其他 active 端点返回 409 account_webhook_already_exists（40008）。原 active 端点保持 active 的更新允许执行。 更新时提供 account_id 只校验一致，不能修改端点归属；不接受 null、空白或重复的 account_id。 字段名必须精确使用 account_id；大小写变体返回 400 invalid_request。":
    "url/status required; other configuration uses full replacement. Optional account_id binds on creation and validates the existing binding on update. One active account endpoint is allowed; multiple inactive endpoints do not occupy that slot. Activation conflicts return 409 account_webhook_already_exists (40008); an already active endpoint can be updated. Cannot change ownership. Null/blank/duplicate/case-variant account_id is invalid_request.",
  "whatsapp 发送时识别到账号受限": "WhatsApp account restriction detected during sending",
  "whatsapp 群消息发送需要管理员权限": "WhatsApp group sending requires administrator privileges",
  "whatsapp-protocol 协议会话（仅示意，不包含真实凭证）":
    "Illustrative whatsapp-protocol session without real credentials",
  "whatsapp-protocol 账号当前登录受限": "WhatsApp Protocol login restricted",
  "workspace API Key 管理。": "Workspace API key management.",
  "上游提供的 CTWA Flows 自动回复标记；保留 false，不代表提供 Flows 内容或执行能力。":
    "CTWA Flows automatic-reply flag; preserve false. Does not expose Flows content/execution.",
  "上游提供的广告通话入口标记；保留 false，该标记不证明已发生通话。":
    "Advertising call-entry flag; preserve false. Does not prove a call happened.",
  "上游提供的来源应用标识；仅在有原值时提供，不从其他来源信息推断。":
    "Original source-application identifier; never infer from other attribution.",
  "上游提供的欢迎语交互入口类型；按不透明字符串保存，不限定枚举。":
    "Opaque welcome interaction-entry type, not a closed enum.",
  "上游提供的自动回复标记；保留 false，不用于推断或覆盖欢迎语展示状态。":
    "Automatic-reply flag; preserve false without overriding welcome-display state.",
  "上游明确提供的欢迎语展示标记；保留 false，缺失时不推断展示状态。":
    "Explicit welcome-message display flag; preserve false and do not infer missing state.",
  "下一页的不透明游标，仅在 has_more=true 时返回；续页时原样传入 cursor。":
    "Opaque next cursor only when has_more=true; pass unchanged as cursor.",
  "不透明游标，仅 has_more=true 时提供，调用方原样传回。":
    "Opaque cursor included only when has_more=true; return unchanged.",
  "与 code 对应的五位数字字符串，不作为数值计算。":
    "Five-digit string corresponding to code; never use for arithmetic.",
  "与发送消息共用目标结构，id 使用 conversation_id。首期仅支持 WhatsApp user 的数字 @lid 或 @s.whatsapp.net 单聊 JID（最长 128 字符），不接受手机号字符串；group、channel 暂不支持。":
    "Same target structure as messaging: conversation_id in id. Initially WhatsApp user numeric @lid/@s.whatsapp.net JIDs only, maximum 128 characters; bare phone strings, group and channel are unsupported.",
  "与当前授权步骤对应的标准状态，通常与 `status` 一致。":
    "Standard state for this step, usually equal to status.",
  "与本次 address_book 中出现的字段精确对应，顺序无含义；表示提供的更新字段，不证明服务端已比较旧值。":
    "Exactly the supplied address-book update fields, unordered; does not prove comparison against old values.",
  "业务方已可靠接收本次事件，重复投递也应幂等接受；不表示全部历史已完成。":
    "Accept history events idempotently; receipt does not mean all history is complete.",
  "业务方已接收事件。": "Event received by the consumer.",
  "业务方已接收并接受处理该事件，重复投递也应幂等接受。":
    "Accept the event idempotently, including repeated delivery.",
  "业务方已接收并接受处理该事件；账号失败不代表回调投递失败。":
    "Event accepted; account failure is not Webhook delivery failure.",
  "业务方已接收并接受处理该事件；通话状态更新不是回调投递失败。":
    "Event accepted; call state changes are not Webhook delivery failures.",
  "业务方已接收并接受处理该批次，重复投递也应幂等接受。":
    "Accept history batches idempotently, including repeats.",
  "业务方已接收并接受处理该编辑事件，重复投递也应幂等接受。":
    "Accept edited events idempotently, including repeats.",
  "为当前账号创建短期有效的 Provider 授权会话，并返回可在浏览器中打开的 `authorize_url`。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。 创建与授权模式切换冲突时返回 `409 provider_not_ready`，重新查询当前模式后再重试。":
    "Creates a short-lived authorization session with a browser authorize_url. Currently only WhatsApp qrcode accounts are supported. Conflicts with mode switching return 409 provider_not_ready; recheck the mode before retrying.",
  "为空、省略或包含 `*` 表示接收当前工作区有权接收的全部事件，包括 contact.updated；is_beta=true 的内测工作区还包含 call.incoming、call.answered、call.ended，无需额外逐项订阅。非内测工作区可以使用通配订阅，但不会收到通话事件；明确订阅通话事件仍返回 403 beta_feature_not_enabled（41002）。非通配的具体事件列表仅接收列出的事件。每次投递、重试及死信重放均重新核验内测资格，查询异常不放行。呼入暂未开放；message.* 通话记录不受内测门禁影响。":
    "Omitted/empty/* subscriptions include all authorized events, including contact.updated. Beta workspaces additionally receive call.incoming/answered/ended without explicit entries. Nonbeta wildcard subscriptions exclude calls; explicit call subscriptions return 403 beta_feature_not_enabled (41002). Explicit lists receive listed types only. Eligibility is rechecked for delivery/retry/replay; failures do not grant access. Incoming calls remain unavailable; message.* call records are independent.",
  "为空表示新建，非空表示更新。":
    "An empty value creates a new resource; a non-empty value updates an existing one.",
  "事件去重标识，不是补拉请求 ID。": "Batch deduplication ID, not a history-request ID.",
  "事件发生时间，未知时可为接收时间；不保证为可靠名称变更时间，不能代替 changed_at 排序。":
    "Event time may be receipt time; not a reliable name-change time or changed_at ordering substitute.",
  "事件发生时间，未知时可为接收时间；不保证是可靠操作时间，不用于补 changed_at 或计算有效期。":
    "Event time may be receipt time; do not use it as changed_at or to calculate expiry.",
  "事件发生时间，未知时可为接收时间；不保证是可靠设置变更时间，不能代替 changed_at 判断新旧。":
    "Event time may be receipt time, not reliable settings-change time; do not order by it instead of changed_at.",
  "事件幂等键，同次操作重放保持一致；置顶、取消和再次置顶为独立操作。":
    "Event idempotency key stable across replays; pin/unpin/repin are separate operations.",
  "事件幂等键；不同事件可能提供同值设置快照，不保证跨来源只通知一次。":
    "Event idempotency key. Separate events can have equal snapshots; no cross-source exactly-once guarantee.",
  "事件幂等键；同一阶段重复投递保持一致，邀请、接听与结束使用不同事件 ID。":
    "Event idempotency key stable within a stage; invitation/acceptance/end have distinct IDs.",
  "事件幂等键；同值更新也可能来自不同事件，不保证跨来源仅通知一次。":
    "Event idempotency key. Equal-value updates may be separate events; no cross-source exactly-once guarantee.",
  "事件时间，不能替代每条消息的 sent_at。": "Event time, not a substitute for message sent_at.",
  "二维码授权检查的标准结果。字段可能因渠道和当前步骤扩展；调用方应优先读取 `status`、`auth_status` 和 `auth_payload`。TikTok 扫码后可能返回 `awaiting_code`，自动处理验证码时返回 `pending`。`account_id`、`expires_at` 等字段不是所有 Provider 都稳定返回，因此不作为必填字段。":
    "Standard QR-check result may vary by channel/step. Prefer status/auth_status/auth_payload. TikTok may report awaiting_code after scanning or pending during automatic verification. account_id/expires_at are not universally required.",
  "仅 WhatsApp 手机号配对返回；直接位于 data 下，不在 auth_payload 内。 展示给用户在手机 WhatsApp 中输入，不回传 /auth/code。 响应不保证提供过期时间，配对码失效时需重新发起配对。":
    "WhatsApp pairing only: directly under data, not auth_payload. Show it for entry in WhatsApp on the phone, never /auth/code. Expiry may be absent; restart pairing if the code expires.",
  "仅 WhatsApp 群会话提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。分类不表示当前账号具备发送权限。":
    "WhatsApp groups only: true confirms announcement group, false confirms otherwise, omission is unknown, never null. Classification does not grant send permission.",
  "仅 WhatsApp 群提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。此属性独立于 permissions.admins_only，不表示当前账号具备发送权限。":
    "WhatsApp group announcement classification: true confirmed, false confirmed otherwise, omitted unknown, never null. Independent of admins_only and does not establish send permission.",
  "仅 WhatsApp 账号详情在可确认当前授权会话时提供的登录设备编号；未知时省略。重新授权后可能变化，不作为永久设备标识，也不用于比较历史消息来源。":
    "Confirmed WhatsApp current-session device number in account detail only. Omitted when unknown and may change after reauthorization; not a permanent device identity or historical source comparison.",
  "仅 decoded 提供且必须出现；允许空数组。每个值来自原投票选项 ID，不表示本次新增票数。":
    "Required only for decoded, including []. Values refer to original option IDs, not incremental vote counts.",
  "仅 ended 可有；timeout 表示超时，rejected_elsewhere 表示其他端拒接，不确认具体设备或执行方。未知时省略，不抹去已有接听事实，不能单独证明从未接听。":
    "ended only: timeout or rejected_elsewhere, without a specific device/operator. Unknown is omitted. Preserve prior acceptance; reason alone does not prove an unanswered call.",
  "仅 is_beta=true 的内测工作区可用；普通工作区返回 403 beta_feature_not_enabled（41002）。呼入暂未开放，内测资格不会自动开启呼入。 为 WhatsApp 账号准备单聊语音或视频呼叫。创建成功仅表示准备完成，不会立即拨号。 to 与发送消息使用相同的 {id,type} 结构；id 填当前账号下的 conversation_id，type 填会话类型。 首期仅支持 WhatsApp 的 user 目标，id 必须是数字用户标识组成的 @lid 或 @s.whatsapp.net 单聊 JID，最长 128 字符；不支持裸手机号或字符串形式的 to。 group、channel 及其他尚未支持通话的渠道返回 501 unsupported_by_provider；WhatsApp user 目标 JID 无效返回 400 provider_invalid_request。 用户在 expires_at 前打开 join_url，允许麦克风并点击 Start call，媒体连接后才开始拨号。 视频通话的摄像头可选；未允许摄像头时仍可收看远端视频和语音通话。 一个账号最多同时保留一通活跃通话；准备期从创建通话起默认 2 分钟，可由服务端调整，实际截止时间以 expires_at 为准，过期后需重新创建。此期限不限制已接通通话的时长。 join_url 是短期一次性访问链接，应原样传递给预期用户，禁止写入日志或公开分享。 接通和结束通过 call.answered、call.ended 事件通知；内测工作区可使用通配订阅或逐项订阅，外呼不会产生 call.incoming。":
    "Requires is_beta=true; other workspaces receive 403 beta_feature_not_enabled (41002). Incoming calls remain unavailable. Prepares a WhatsApp user voice/video call without dialing immediately. Use to={id,type}, with a conversation_id that is a numeric @lid or @s.whatsapp.net JID of at most 128 characters; bare phone numbers and string targets are invalid. Groups, channels and unsupported providers return 501 unsupported_by_provider; invalid WhatsApp user JIDs return 400 provider_invalid_request. The intended user opens join_url before expires_at, permits the microphone and clicks Start call; dialing begins after media connects. Camera permission is optional for video calls. Only one active call per account is allowed. Preparation normally expires after two minutes; use expires_at, since this is configurable. Connected call duration is not limited by preparation expiry. Treat join_url as a short-lived one-time secret; do not log or publicly share it. Observe call.answered/call.ended through wildcard or explicit subscriptions; outbound calls do not emit call.incoming.",
  "仅 unavailable 可提供；只描述本次选择不可用，不承诺额外恢复接口。WhatsApp 当前无法细分时提供 unknown。":
    "Optional only for unavailable; describes current unavailability without promising recovery APIs. WhatsApp uses unknown when no finer reason exists.",
  "仅内测工作区可准备、查询和结束 WhatsApp 单聊语音或视频通话；呼入暂未开放。":
    "Beta workspaces can prepare, query and end WhatsApp one-to-one voice/video calls. Incoming calls are not currently available.",
  "仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。当前账号没有活动通话时返回 200 且 data 为空对象 {}；这不表示通话服务不可用。有活动通话时仅返回通话 ID、状态、方向和媒体类型，不返回链接或凭证。":
    "Beta workspaces only; otherwise 403 beta_feature_not_enabled (41002). No active call returns 200 with data={}, which does not indicate service failure. Active calls expose only ID, state, direction and media type, without links or credentials.",
  "仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。挂断当前账号归属的指定通话。存储保留期内重复挂断已结束通话仍返回其终态对象；通话不存在或不属于该账号返回 404 call_not_found。撤销内测资格前应先结束活动通话并等待准备链接过期；资格撤销不会立即使已发链接失效或强制结束通话。":
    "Beta only; otherwise 403 beta_feature_not_enabled (41002). Ends a call owned by this account. Repeating hangup during retention returns the terminal object. Missing calls or calls owned by another account return 404 call_not_found. End active calls and wait for preparation links to expire before revoking beta access; revocation does not immediately invalidate issued links or terminate calls.",
  "仅内测工作区订阅匹配时投递，`*`、空数组或省略订阅均可匹配，具体事件列表须包含 call.answered；每次投递及重试重新核验资格，与 message.* 通话记录独立。呼入暂未开放。":
    "Beta and matching subscriptions only; wildcard/empty/omitted match, explicit lists need call.answered. Eligibility is rechecked on delivery/retry. Independent of message.* records; incoming calls remain unavailable.",
  "仅内测工作区订阅匹配时投递，`*`、空数组或省略订阅均可匹配，具体事件列表须包含 call.ended；每次投递及重试重新核验资格，与 message.* 通话记录独立。呼入暂未开放。外呼在尚无对端标识时结束，省略 data.sender；来电结束仍必须提供 sender，提供时必须包含真实 id。":
    "Beta and matching subscriptions only, rechecked on delivery/retry. Wildcard/empty/omitted match; explicit lists need call.ended. Independent of message.* records. Incoming calls remain unavailable. Outbound calls ending before peer identification omit sender; inbound endings require a real sender.id.",
  "仅可靠取得本次新评论回执时提供，不保证每次都有。发布一级评论时不含 parent_comment_id；回复时 parent_comment_id 与请求 comment_id 一致。":
    "Included only when the new comment receipt is reliable. First-level publication omits parent_comment_id; replies match the requested comment_id.",
  "仅向具备内测资格且订阅匹配的工作区投递；内测工作区的 `*`、空数组或省略订阅均包含通话事件，具体事件列表则按列表匹配。投递及重试时重新核验资格。呼入或外呼的语音/视频通话已接通，data.call.state 为 active；不携带 join_url。呼入暂未开放；message.* 通话记录不受此门禁影响。":
    "Eligible subscribed beta workspaces only, rechecked on delivery/retry. Wildcard/empty/omitted subscriptions include calls; explicit lists must match. Voice/video call connected with state=active and no join_url. Incoming calls remain unavailable; message.* call records are independent of this gate.",
  "仅向具备内测资格且订阅匹配的工作区投递；内测工作区的 `*`、空数组或省略订阅均包含通话事件，具体事件列表则按列表匹配。投递及重试时重新核验资格。呼入或外呼的语音/视频通话已结束，data.call.state 为 ended；原因保持在 data.reason，不携带 join_url。呼入暂未开放；message.* 通话记录不受此门禁影响。":
    "Eligible subscribed beta workspaces only, rechecked on delivery/retry. Wildcard/empty/omitted subscriptions include calls; explicit lists must match. Ended inbound/outbound voice/video call uses state=ended and data.reason, without join_url. Incoming calls remain unavailable; message.* call records are independent.",
  "仅在确认父子关系后提供；缺失本身不能证明该评论是可回复的一级评论。":
    "Included only for a confirmed parent relationship; absence does not prove a replyable first-level comment.",
  "仅按需补拉批次提供；自动历史同步继续沿用原有结构。":
    "Present only on on-demand batches; automatic history retains its existing shape.",
  "仅接听更新可有，可靠的接听确认时间；未知时省略，业务方在结束后仍应保留已有值。":
    "Optional reliable answer-confirmation time on accepted updates only. Preserve existing value after ending.",
  "仅描述已收到的既有 message.updated 形态，不表示提供持续位置更新服务或承诺客户端可编辑此内容。":
    "Describes received message.updated shapes only, not a continuous tracking service or a promise of client editing support.",
  "仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询帖子列表或详情；目标是否可访问由渠道结果决定。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 分页核验未完成返回可重试失败，不能视为资源不存在。 第三方 post_id 放在 JSON body，不要求帖子属于当前账号。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request。 仅保证一级评论，不提供完整回复分页。空列表为 []，has_more=false 时省略 next_cursor。 读取失败保留既有 provider 错误分类；其他读取失败返回 502 list_post_comments_failed（39003）。":
    "TikTok only. A known post_id may be queried directly, including another account's post; access is decided by the channel. Invalid/null fields, blank IDs and invalid pagination return 400 invalid_request (10000). limit defaults 20, range 1-50. Missing accounts return 404 account_not_found (20020). Unverified pagination is retryable, not absence. TikTok post_id must be a positive decimal string without leading zeros; format errors return provider_invalid_request. Only first-level comments are guaranteed; complete reply pagination is unavailable. Empty lists use []; the last page omits next_cursor. Existing provider classifications remain; other failures return 502 list_post_comments_failed (39003).",
  "仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 归属或分页核验未完成返回可重试失败，不能视为资源不存在。 has_more=true 时提供 next_cursor；末页 has_more=false 并省略 next_cursor。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他读取失败返回 502 list_posts_failed（39002）。":
    "TikTok only; other channels return 501 unsupported_by_provider. Invalid/null fields, blank IDs or invalid pagination return 400 invalid_request (10000). limit defaults to 20, range 1-50. Missing/out-of-workspace accounts return 404 account_not_found (20020). Unverified ownership/pagination is a retryable failure, not absence. has_more=true provides next_cursor; the last page omits it. Existing provider error classifications remain; other failures return 502 list_posts_failed (39002).",
  "仅支持 TikTok；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询本账号帖子列表。目标是否可访问由渠道结果决定，不保证其他账号的帖子可读取。 JSON body 必填非空字符串 post_id，不接受 null、未知字段或重复键；非法请求返回 400 invalid_request（10000）。 TikTok 的 post_id 须为无前导零的正十进制整数字符串，按原值传递；不符合渠道格式时返回 400 provider_invalid_request。 账号不在当前工作空间返回 404 account_not_found（20020）；可靠确认帖子不存在时返回 404 post_not_found（39000）。 当前账号无法访问目标时返回 403 post_inaccessible（39005），不能据此判断具体是登录、权限还是资源归属原因，也不能视为不存在。 只有可靠取得与请求帖子 ID 一致的资源后才返回标准 Post；上游异常返回失败，不返回部分详情。 现有可选字段仅在可靠取得时提供，不新增帖子媒体或统计计数。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他详情读取失败返回 502 get_post_failed（39006）。":
    "TikTok only; other channels return 501 unsupported_by_provider. A known post_id may be submitted directly; access to other accounts' posts is not guaranteed. Required JSON post_id must be nonempty; null, unknown fields and duplicate keys return 400 invalid_request (10000). TikTok IDs must be positive decimal strings without leading zeros; invalid channel format returns 400 provider_invalid_request. Missing accounts return 404 account_not_found (20020); confirmed missing posts return 404 post_not_found (39000). Inaccessibility returns 403 post_inaccessible (39005), which does not prove absence or a particular permission/login cause. Only a verified matching resource returns Post; no partial detail on failure. Optional fields require reliable data; media/statistics are not added. Existing provider errors remain; other failures return 502 get_post_failed (39006).",
  "仅支持 TikTok；省略 comment_id 时发布一级评论，提供非空白字符串 comment_id 时回复指定的一级评论。其他渠道返回 501 unsupported_by_provider。 不要求帖子属于当前账号；发布或回复无需先查询帖子列表、详情或评论。 接口不预先确认帖子可访问性、评论所属帖子或层级；调用方应提供目标帖子的一级评论 ID。实际是否允许评论或回复由渠道结果决定，不保证任意帖子都可写入。 第三方 post_id、可选 comment_id 和必填 text 放在 JSON body；正文保留实际发送的原文。 comment_id 只有省略字段才表示发布一级评论；显式空串、纯空白、null 或非字符串仍返回 400 invalid_request（10000），不会改为发布一级评论。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request，comment_id 沿用非空字符串要求。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）；非法参数返回 400 invalid_request（10000）。 200 data.status=accepted 表示请求已被接受，不表示已展示、送达或一定收到 Webhook；仅可靠取得新评论时附带 comment。 发布一级评论的 comment 不含 parent_comment_id；回复的 comment.parent_comment_id 对应本次请求的 comment_id。 写入后超时、断连或无法确认回执时结果未知，不自动重发；读取未找到评论或回复不能证明此前未创建。 写入前的 provider_not_ready、provider_invalid_request、provider_unavailable 分类保持不变；已确认的业务拒绝保留 provider_invalid_request。 写入后无法确认回执（如超时、断连）返回 502 reply_post_comment_failed（39004），结果可能未知；不自动重试写入。":
    "TikTok only. Omit comment_id to publish a first-level comment; provide a nonblank comment_id to reply to a first-level comment. No preceding list/detail query or post ownership is required; the caller supplies the correct target and the channel decides write access. Supply post_id, optional comment_id and required text in JSON, preserving text. Empty/blank/null/nonstring comment_id is invalid_request (10000), not a new top-level comment. TikTok post_id must be a positive decimal string without leading zeros or return provider_invalid_request. Missing accounts return 404 account_not_found (20020). 200 status=accepted does not prove visibility, delivery or a Webhook; comment is included only when reliably obtained. New top-level comments omit parent_comment_id; replies reference the requested comment_id. Timeout or connection loss after writing leaves an unknown outcome: do not automatically resend, and absence in a read does not prove failure. Existing pre-write provider errors remain; uncertain post-write results return 502 reply_post_comment_failed (39004), without automatic write retry.",
  "仅支持 provider=whatsapp 的私聊，不包含 whatsapp-protocol；使用同一会话中一条原生内容消息的完整 before 请求更早的历史。 account_id 必须是单个非空路径段，不能包含空白或斜杠（包括编码斜杠）；入口账号参数校验失败返回 400 invalid_request。 HTTP 202 和 data.status=accepted 仅表示补拉请求已受理，不同步返回消息，也不表示历史已经拉取完成。 先订阅 conversation.history，再发起请求；可用历史批次通过该事件异步返回，并携带 data.history.source=on_demand。 顶层 request_id 仅用于本次 HTTP 请求排障，不是补拉任务 ID，不能用于关联后续回调；一次请求可能对应多个、重复或晚到的批次，也可能没有回调。 继续补拉时，从已收到的原生内容消息中选择最早且 id、sent_at、direction 完整的消息构造 before。 type=call 的合成通话记录不能作为锚点；即使三个字段完整，合成记录 ID 也不是原生消息 ID。before 不增加 type 字段，由调用方选择消息时排除通话记录。 不提供下一页游标或完成状态；不能根据空批次、消息少于 limit 或等待超时判断历史已到底，HTTP 超时后也可能收到回调，不应自动重试。 群聊和频道返回 400 unsupported_conversation_type；其他渠道返回 501 unsupported_by_provider。":
    "WhatsApp user conversations only, excluding whatsapp-protocol. Use a native content message's complete before anchor from the same conversation. account_id must be a nonblank single path segment without whitespace or slash, including encoded slash; invalid paths return 400 invalid_request. HTTP 202 accepted does not return messages or prove completion. Subscribe to conversation.history first; available asynchronous batches carry data.history.source=on_demand. request_id is diagnostic, not a task ID. One request can produce multiple, repeated, late or no batches. Continue from the earliest native content message with id/sent_at/direction. Synthetic call records are not anchors; before has no type field, so callers must exclude them. No next cursor or completion state is provided; empty/short batches and timeouts do not prove exhaustion. Do not automatically retry unknown outcomes. Groups/channels return 400 unsupported_conversation_type; other channels return 501 unsupported_by_provider.",
  "仅明确确认对方结束时可有 remote，无法确认时省略；提供 end_reason 时不提供此字段。它不代表我方未接听，也不表示原消息的发起方向。":
    "remote only when peer termination is confirmed; omit unknown and when end_reason is present. Does not prove unanswered status or original direction.",
  "仅更新目标消息的置顶状态；不提供或改写原消息类型、方向、正文和发送时间。":
    "Target message pin state only, without rewriting original type/direction/body/sent_at.",
  "仅有目标链接，其他公开预览字段未提供": "Target URL only; other preview fields absent",
  "仅确认广告来源时提供 ad，来源未知时省略。":
    "ad only for confirmed advertising origin; omitted when unknown.",
  "仅确认请求已受理，不表示收到历史或完成补拉。":
    "Request accepted only; no proof of history receipt or completion.",
  "仅置顶时可有，以秒为单位；未知时省略，0 不代表永久置顶。":
    "Optional seconds while pinned; omit unknown. Zero does not mean permanently pinned.",
  "仅识别实时位置类型，调用方可提示在 WhatsApp 中查看；不提供坐标、追踪、共享时长、终止状态或回复句柄，不开放此类型发送。":
    "Live-location marker only. View in WhatsApp; no coordinates, tracking, duration, terminal state, reply handle or sending capability.",
  "会话不存在或当前账号无法访问目标群；群不存在与未参与群通过细分数字码区分。":
    "Conversation missing or group inaccessible; numeric codes distinguish a missing group from lack of membership.",
  "会话分页列表。": "A paginated list of conversations.",
  "会话列表、详情、成员、历史补拉、读写状态、静音、置顶与标签。":
    "Conversations, members, history requests, read state, mute, pins and labels.",
  "会话成员分页列表。": "A paginated list of conversation members.",
  "会话标签分页列表。": "A paginated list of conversation labels.",
  "会话类型过滤，支持逗号分隔多选；每一项按枚举原值精确匹配，不忽略空项。 可选值为 `user`、`group`、`channel`；非法值返回 400 invalid_conversation_type。 WhatsApp 的 `group` 包含社群公告群，所有群会话的返回类型均为 `group`。":
    "Comma-separated conversation types, matched exactly without ignoring empty entries. user/group/channel only; invalid values return 400 invalid_conversation_type. WhatsApp announcement groups remain group.",
  "会话类型；按枚举原值精确匹配，不执行去空格或大小写转换。":
    "Exact conversation-type enum; no trimming or case conversion.",
  "会话详情。": "Conversation details.",
  会话限时消息设置更新事件: "Conversation disappearing-message settings update",
  "传空字符串表示清空备注。": "Pass an empty string to clear the note.",
  "传空字符串表示清空描述。": "Pass an empty string to clear the description.",
  "余额删除已受理且不可撤回；清理或退款仍处理中，重复请求复用原操作。":
    "Wallet deletion irreversibly accepted. Cleanup/refund remains in progress; repeats reuse the original operation.",
  保留链接卡片并清空标题和摘要: "Keep the card and clear its title/description",
  修改群信息: "Update group information",
  停止账号运行态: "Stop account runtime",
  "停用 webhook endpoint": "Disable a webhook endpoint",
  "停用后的 webhook endpoint。": "The disabled webhook endpoint.",
  "停用当前工作空间内的端点；可选 query account_id 仅校验原绑定，不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 停用账号全部独立端点表示暂停该账号回调，不恢复工作空间继承。 端点不存在时保持 HTTP 500 deactivate_webhook_endpoint_failed，numeric_code 为 40006。":
    "Deactivate an endpoint. Optional query account_id validates ownership; mismatch returns 400 invalid_request and missing accounts return 404 account_not_found (20020). Deactivating all independent endpoints pauses callbacks without restoring inheritance. Missing endpoints return HTTP 500 deactivate_webhook_endpoint_failed / 40006.",
  "允许带空格、连字符、括号或加号的格式化输入；服务端会归一化为正数字符串。":
    "Formatted phone input may contain spaces, hyphens, parentheses or plus; normalized to a positive digit string.",
  "入群申请列表。": "A list of group join requests.",
  "公共结构要求恰好一种非空来源；WhatsApp 当前支持 WebP 的 url/file_url，静态、动画及素材兼容性由渠道判定。API 检查基本容器完整性，下载与暂存硬资源上限为 10 MiB（10485760 字节），不解码或转码；file_key 结构合法但返回 501 unsupported_by_provider。额外字段即使为空也不允许。":
    "Exactly one nonempty sticker source. WhatsApp supports original WebP url/file_url; rendering compatibility is channel-defined. Basic container checks and 10 MiB fetching/staging limit apply without decoding/transcoding. file_key is structurally valid but unsupported (501). Extra fields are forbidden even when empty.",
  "公共请求只要求目标链接；可选标题和摘要允许空字符串，但不允许 null。WhatsApp 额外要求非空 title/image_url，title 最多 255 个 Unicode 字符、description 最多 1024 个 Unicode 字符；限制由本项目的渠道发送策略执行。":
    "Public input requires the target URL. Optional title/description allow empty strings, not null. WhatsApp requires nonempty title/image_url and limits title/description to 255/1024 Unicode characters.",
  公共请求结构或参数非法: "Invalid public request or parameters",
  "关键字过滤。": "Filter by keyword.",
  其他渠道业务发送失败: "Other channel send failure",
  "兼容保留的只读字段，当前配额模式固定返回 false；账号容量以 account_quota 为准。":
    "Legacy read-only field, currently false in quota mode; use account_quota for capacity.",
  "兼容旧字段：认证十六进制数据。": "Legacy authentication hex field.",
  "兼容旧调用方保留；当前值会被忽略且不保存，建议调用方省略。":
    "Legacy compatibility field; ignored and not stored. Omit it.",
  准备主动通话: "Prepare an outbound call",
  "列出 API Key": "List API keys",
  "列出 webhook endpoint": "List webhook endpoints",
  列出会话: "List conversations",
  列出会话成员: "List conversation members",
  列出会话标签: "List conversation labels",
  列出帖子的一级评论: "List first-level post comments",
  "列出帖子的一级评论结果。": "First-level comment list result.",
  列出待审批入群申请: "List pending group join requests",
  列出本账号帖子: "List the signed-in account's posts",
  "列出本账号帖子结果。": "Post list result.",
  列出群组: "List groups",
  列出联系人: "List contacts",
  列出账号: "List accounts",
  "创建 API Key": "Create an API key",
  "创建 Provider 授权会话": "Create a hosted authorization session",
  "创建 active 端点或将 inactive 端点改为 active 时，账号已有其他 active Webhook 端点；查询并更新已有 active 端点，或先停用它再启用其他端点。":
    "Another active account endpoint exists. Update the existing active endpoint or deactivate it before activating another.",
  "创建 webhook endpoint": "Create a webhook endpoint",
  "创建成功。": "Created successfully.",
  "创建成功，返回一次性明文 API Key 与可持久展示的 Key 元数据。":
    "Created successfully. Returns the one-time plaintext API key and key metadata that may be displayed later.",
  "创建成功，返回新群 ID。": "Created successfully. Returns the new group ID.",
  "创建投票；不能附带 text、媒体、名片、链接预览或其他消息载荷。渠道限制见发送接口说明。":
    "Poll creation cannot include text/media/cards/previews or another payload. See sending rules for channel limits.",
  创建群组: "Create a group",
  创建账号: "Create an account",
  "创建账号请求。`whatsapp-protocol` 凭证只能提交到 `/v1/accounts/{account_id}/auth/session` 的嵌套 `whatsapp-protocol` 对象；不能通过 provider_data 提交。`whatsapp-protocol` 账号不能在该 provider 与其他 provider 之间切换。":
    "Account creation request. Protocol credentials go only to auth/session in the nested whatsapp-protocol object, never provider_data. Accounts cannot switch between Protocol and other providers.",
  "删除 webhook endpoint": "Delete a webhook endpoint",
  删除会话标签: "Delete a conversation label",
  "删除成功，无响应体。": "Deleted successfully. The response has no body.",
  "删除结果。": "The deletion result.",
  删除账号: "Delete an account",
  刷新账号运行态: "Refresh account runtime state",
  "包含国家或地区代码的纯数字电话号码，不包含加号、空格或分隔符。":
    "Digits-only phone including country/region code, without plus, spaces or separators.",
  "协议公钥。": "Protocol public key.",
  "协议私钥。": "Protocol private key.",
  "单个具名投票人的本次完整选择。decoded 的数组整体替换此人已有选择，空数组表示撤票；unavailable 保留已有结果并标记待确认，不能当作撤票。":
    "One named voter's complete current selection. decoded replaces prior choices, [] withdraws; unavailable preserves prior results pending confirmation.",
  单条消息置顶状态更新事件: "Message pin-state update",
  "卡片编辑为普通文本，清除原预览对象": "Convert card to text and clear the old preview",
  "历史失败原因字段，保持原有取值与省略规则；新增集成优先使用 error。":
    "Legacy failure field preserves its existing semantics/omission. Prefer error for new integrations.",
  历史投票创建内容: "Historical poll creation content",
  历史消息中的商品和订单卡片: "Historical product and order cards",
  历史消息中的广告归因信息: "Historical advertising referrals",
  "历史消息中的按钮、模板及选择响应": "Historical interactive cards and responses",
  历史消息中的链接预览: "Historical link previews",
  "历史静态消息中已确认的原作者；实时作者在 data.sender。":
    "Confirmed original author in static history; realtime author is data.sender.",
  "原始币种标识，按非空不透明字符串保存；不默认 USD，也不强制三字符编码。":
    "Original nonempty opaque currency identifier. No default USD or required three-letter code.",
  "原始通话发起者的 WhatsApp LID；邀请、接听和结束均可提供，不表示接听或结束通知的执行者。":
    "Original caller's WhatsApp LID on any stage; not necessarily the acceptance/end operator.",
  "原投票的静态内容，不是累计结果。保持选项顺序和原始标题；max_selections 是每人最大选择数而非参与人数。接收历史可能存在重复选项 ID，不能据此声称可以区分同名选项。":
    "Static poll content, not cumulative results. Preserve option order/original titles. max_selections is per-voter choice limit, not participant count. Historical duplicate IDs can exist; identical titles cannot necessarily be distinguished.",
  "原样传回上一页的 next_cursor；首次请求省略。":
    "Pass the previous next_cursor unchanged; omit on the first page.",
  "原样传递的短期一次性 HTTPS 通话链接，禁止记录完整链接。":
    "Opaque short-lived one-time HTTPS call link; never log the full URL.",
  "原生内容消息的 id；不接受合成通话记录 ID，去除首尾空白后仍为该记录格式时同样无效。不能使用顶层事件 id 或 HTTP request_id 代替。":
    "Native content message ID, never a synthetic call-record ID, including after trimming. Event IDs/request IDs are not substitutes.",
  "参数缺失或非法；invalid_request 表示请求字段或账号路径校验失败，provider_invalid_request 表示渠道参数无效（包括使用合成通话记录 ID 作为锚点），unsupported_conversation_type 表示会话类型不支持。":
    "invalid_request for invalid fields/account paths; provider_invalid_request for invalid channel anchors, including synthetic call records; unsupported_conversation_type for unsupported targets.",
  发布一级评论: "Publish a first-level comment",
  发布一级评论或回复一级评论: "Publish a first-level comment or reply to one",
  "发布一级评论或回复一级评论的接受结果。": "Accepted comment publication/reply result.",
  "发生未分类的内部错误，code 为 request_conversation_history_failed，numeric_code 为 37016。":
    "Unclassified history request error: request_conversation_history_failed (37016).",
  "发送 WhatsApp 视频消息": "Send WhatsApp video",
  "发送 WhatsApp 音频消息": "Send WhatsApp audio",
  发送消息: "Send a message",
  "发送消息时使用的渠道扩展参数。字段仅在对应渠道和消息类型支持时生效。":
    "Channel send extensions apply only to supported channels/message types.",
  "发送消息时发生内部错误；贴纸素材下载、存储或其他准备失败保留 send_message_failed 和 numeric_code=36001，message 提供具体原因，缺失时沿用默认提示。":
    "Message processing error. Sticker download/storage/preparation failures retain send_message_failed / 36001 with an available reason or default message.",
  取消授权流程: "Cancel the authorization flow",
  取消置顶会话: "Unpin a conversation",
  取消静音会话: "Unmute a conversation",
  "只对实际收到的 conversation.history 消息识别类型，不提供坐标轨迹或历史查询能力。":
    "Recognizes types only in received conversation.history messages; provides no coordinate trace or history query service.",
  "只返回当前 API Key 工作区的安全业务结果。REVIEW 表示结果尚未确认，不代表已经退款。 创建成功后应复用原账号并查询本操作；没有提供幂等键的后续请求会视为新的建号。":
    "Returns safe business results for the current API key's workspace only. REVIEW means unresolved, not refunded. Reuse the created account and query this operation; a later creation request without an idempotency key is a new purchase.",
  "可信发生时间，缺失时为观察时间；不等价于评论创建时间，重试保持原值。":
    "Reliable occurrence time or observation time if unknown, not necessarily comment creation time. Retries preserve it.",
  "可展示的 Key 前缀，不是完整 API Key。": "A display-safe key prefix, not the full API key.",
  "可用时返回对端展示名称。": "Peer display name when available.",
  "可确认的邀请发生时间；缺失时省略，接听和结束通知不提供此字段。":
    "Reliable invitation occurrence time, omitted when unknown and absent on accepted/ended updates.",
  "可选商品标识，与消息 ID 和顶层事件 ID 含义不同，不能用于替代消息关联。":
    "Optional product identifier, distinct from message/event IDs and not an association substitute.",
  "可选回复按钮标识；不得用显示文字或位置代替。":
    "Optional reply-button ID; title/position are not substitutes.",
  "可选消息 ID；未提供时不能用顶层事件 ID、来源标识或点击标识替代。":
    "Optional message ID; event/source/click IDs are not substitutes.",
  "可选的 WhatsApp 广告上下文；各字段独立提供，无有效字段时省略整个扩展。显式 false 与字段缺失含义不同。":
    "Optional WhatsApp advertising context. Fields are independent; omit empty objects. Explicit false differs from absence.",
  "可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。":
    "Optional public account ID. Empty/blank/duplicate values and case variants of account_id return 400 invalid_request. Lists filter independent account endpoints; get/deactivate/delete only validate existing ownership.",
  "可选的公开账号 ID，例如 `acc_example`；创建用于绑定，更新只用于校验原绑定。":
    "Optional public account ID; binds on creation, validates existing binding on update.",
  "可选的授权提示。本次 Provider 明确返回二维码、Passkey 等授权证据， 或当前 Session 已持久化此前由 Provider/Webhook 明确确认的授权进行态时 才为 `true`；不能仅根据 `runtime_status=disconnected` 或 `client_connect=false` 推断。运行态接口不返回二维码、`code`、 `qrcode`、`auth_payload` 或 `provider_data`；调用方应改用 `/v1/accounts/{account_id}/auth/qr/start` 和 `/v1/accounts/{account_id}/auth/qr/check` 获取标准授权状态与载荷。":
    "Optional true only with confirmed QR/Passkey or persisted authorization-progress evidence, never inferred from disconnected/client_connect=false alone. Runtime results do not contain QR/code/qrcode/auth_payload/provider_data. Use auth/qr/start and auth/qr/check for standard state/payload.",
  "可选的标准授权状态快照，仅在本次运行态操作取得 Provider 明确授权证据， 或复用当前 Session 中已确认的授权进行态时返回，例如 `pending`、 `awaiting_qr_scan` 或 `passkey_required`。该字段用于指引调用方进入授权流程， 不替代授权接口返回的完整状态与载荷。":
    "Optional confirmed authorization-state snapshot, such as pending/awaiting_qr_scan/passkey_required. Directs callers to authorization but does not replace its complete result.",
  "可选的渠道扩展；仅 provider=whatsapp 时允许出现，无可用字段时省略。":
    "Optional channel extensions, WhatsApp only; omitted when empty.",
  "可选的结构化失败原因；旧事件或其他失败场景可以省略，缺失不表示成功。":
    "Optional structured failure reason. Older/other events may omit it; absence is not success.",
  "可选订单标识，与消息 ID 和顶层事件 ID 含义不同，不能用于替代消息关联。":
    "Optional order identifier, distinct from message/event IDs and not an association substitute.",
  "可选预览图片地址，不保证永久可用；WhatsApp 当前不提供接收侧图片地址，不应依赖该字段。":
    "Optional preview image, without permanence guarantees. WhatsApp currently does not provide received image_url.",
  "可选；提供后在工作区范围内唯一，重试时保持同值和同一请求参数。":
    "Optional workspace-scoped idempotency key. Preserve the same key and parameters when retrying.",
  "可靠 changed_at 加正 duration_seconds 得到的到期时间；未知时省略，不能从回调接收时间计算。":
    "Reliable changed_at plus positive duration_seconds. Omit unknown; never compute from callback receipt time.",
  "可靠业务时间，UTC RFC3339 并保留精度；未知省略，不以 occurred_at 或到达顺序代替。":
    "Reliable business timestamp in UTC RFC3339 with precision; omit unknown, never substitute occurred_at/arrival order.",
  "可靠取得时保留原文，包括空字符串；未知时省略。":
    "Preserve reliable original text, including an empty string; omit when unknown.",
  "可靠取得的创建时间，RFC3339 UTC；未知时省略。":
    "Reliable resource creation timestamp in RFC3339 UTC; omitted when unknown.",
  "可靠取得的评论创建时间，RFC3339 UTC；未知时省略，不用观察时间代替。":
    "Reliable comment creation timestamp in RFC3339 UTC; never substitute observation time.",
  "可靠取得的非空头像地址；未知时省略。": "Reliable nonempty avatar URL; omitted when unknown.",
  "可靠的原消息作者，未知时省略；不从 actor 或操作方向兜底。":
    "Reliable original message author, omitted when unknown; never substitute actor or operation direction.",
  "可靠的名称变更时间，以 RFC3339 UTC 表示并保留精度；未知时省略，不用 occurred_at 补齐。":
    "Reliable name-change time in RFC3339 UTC with precision. Omit unknown; do not substitute occurred_at.",
  "同一会话中同一条原生内容消息的位置；所有字段必须来自该消息，不接受 null。type=call 的合成通话记录即使三个字段完整也不能作为锚点；请求不包含 type 字段。":
    "Position of one native content message in the same conversation; all fields come from that message and cannot be null. Synthetic call records are invalid even with complete fields; no type field is accepted.",
  "同一会话的一批历史可通过多个 conversation.history 事件提供；按 provider、account_id、data.conversation.id 和消息 id 合并全部事件，不以事件个数或单个事件内的消息数量判断完整历史已恢复。每条消息保持完整，不截短字段；按需事件均保留 data.history.source=on_demand，不产生 account.history.synced。":
    "One conversation's history can span multiple events. Merge all by provider/account/conversation/message IDs; event counts or per-event message counts do not establish completeness. Individual messages are not truncated. On-demand events retain source=on_demand without account.history.synced.",
  "同一次通话保持一致的不透明通话 ID；按 provider 与 account_id 隔离。":
    "Opaque call ID stable for one call, scoped to provider/account.",
  "向当前账号的授权流程提交浏览器生成的 WebAuthn 凭证响应。 `webauthn_response` 必须是完整凭证响应序列化后的 JSON 字符串。当前仅支持 使用 `qrcode` 授权模式的 WhatsApp 账号。只有 Provider 明确拒绝输入时才恢复上一可操作步骤。":
    "Submits the complete serialized browser WebAuthn credential response in webauthn_response. Currently WhatsApp qrcode accounts only. Unknown results retain passkey_pending and retries do not resubmit; only an explicit rejection restores an actionable step. After authorization, explicitly start runtime if it is not running.",
  "启动 `auth_mode=code` 的授权流程。通常发送 `{}`，手机号从账号的 `provider_data.phone` 读取。 WhatsApp 手机号配对从 `data.verify_code` 读取配对码，交由用户在手机端输入， 不调用 `/auth/code`。Telegram 等待用户收到验证码后调用 `/auth/code`， 如需二次密码再调用 `/auth/password`。 `awaiting_code` 仅表示等待用户操作，不代表授权成功；通过 `GET /auth` 查询后续授权状态，并在发送消息前确认账号连接可用。":
    "Starts auth_mode=code, usually with {} and the saved provider_data.phone. For WhatsApp, show data.verify_code for entry on the phone; do not call /auth/code. For Telegram, submit the user's received code through /auth/code and a required second password through /auth/password. awaiting_code is not authorization success. Query GET /auth and verify connectivity before sending messages.",
  启动二维码授权: "Start QR code authorization",
  启动账号运行态: "Start account runtime",
  启动验证码类授权: "Start code-based authorization",
  "呼入暂未开放，内测资格不会自动开启呼入。该事件仅向具备内测资格且订阅匹配的工作区投递；内测工作区的 `*`、空数组或省略订阅均包含通话事件，具体事件列表则按列表匹配。该事件仅表示 inbound。`join_url` 是短期、一次性的浏览器接听链接，不应持久化或写入日志。":
    "Incoming calls are not enabled by beta access. Only eligible, subscribed workspaces receive this inbound event. For beta workspaces wildcard/empty/omitted subscriptions include calls; explicit lists match listed types. join_url is a short-lived one-time browser answer link: do not persist or log it.",
  呼入通话事件: "Incoming call event",
  "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。":
    "Canonical response provider name. whatsapp-protocol supports session authorization, text/image and contact detail; reply, mentions, contact-list/writes, conversations and groups are unsupported. Availability depends on the deployed service.",
  商品和订单消息接收事件: "Received product and order messages",
  商品和订单消息编辑事件: "Edited product and order messages",
  回复指定一级评论: "Reply to a first-level comment",
  "回调已接收。": "Callback received.",
  "在指定账号所属渠道中添加一个联系人。`phone_number` 和 `username` 至少提供一个； `whatsapp_options` 仅适用于 WhatsApp 账号。 添加失败时，`numeric_code=30017` 表示 Provider 限流，调用方应延迟退避重试； `numeric_code=30018` 表示账号 App State 失步，调用方应等待 Provider 恢复后再重试。 两种细分原因均保持接口原有 HTTP 状态与字符串 `code`。 仅 whatsapp 添加联系人明确未将目标号码识别为有效 WhatsApp 联系人时，返回 HTTP 500、 `code=create_contact_failed` 和 `numeric_code=35009`；`message` 保留完整原始原因，不增加前缀， 原因缺失时为 `Target phone number was not recognized as an active WhatsApp contact`。 调用方应按数字码提示用户核对国家区号、号码及 WhatsApp 注册状态，核对实际响应与页面错误提示后再请求， 不应持续自动重试；该错误不确认号码未注册或永久不可用。其他添加失败沿用原有分类。":
    "Add a contact through the account's channel. Provide phone_number or username; whatsapp_options is WhatsApp-only. numeric_code 30017 indicates throttling; back off. 30018 indicates App State desynchronization; wait for recovery. Both retain existing HTTP/code classifications. A WhatsApp number not recognized as a valid contact returns HTTP 500 create_contact_failed / 35009, with the available original reason or a default explanation. Ask the user to verify country code, number and WhatsApp registration before retrying; do not loop. This does not establish permanent unavailability or lack of registration. Other failures retain their classifications.",
  "在本投票内稳定的不透明选项 ID；使用回调值，不按标题自行计算。":
    "Opaque option ID stable within this poll. Use callback values, not title-derived calculations.",
  处理入群申请: "Process a group join request",
  "复用 group.updated。公告模式保留明确 true/false，邀请链接变更只通知缓存失效；无可靠 changed_at 或状态冲突时回查详情，邀请变化始终查询当前链接。":
    "Uses group.updated. Preserve explicit true/false announcement state. Invite changes invalidate cached links only; query the current link. Requery details if changed_at is unknown or states conflict.",
  "复用 message.received，contacts 保留一条消息中的完整有序名片。旧单张 text 继续兼容，多名片不提供引用句柄。":
    "Uses message.received; contacts retains complete card order within one message. Legacy single-card text remains compatible; multiple cards have no reply handle.",
  "复用 message.received，只提供 live_location 类型标记，建议提示在 WhatsApp 查看；不提供持续坐标、共享时长或结束状态。":
    "Uses message.received with a live_location marker only. View it in WhatsApp; continuous coordinates, duration and termination state are unavailable.",
  "复用实际收到的 conversation.history；messages 为扁平消息数组，允许与其他消息混排，不保证历史完整。":
    "Uses received conversation.history batches with flat messages arrays mixed with other types; completeness is not guaranteed.",
  "复用已有 message.updated，按目标消息 ID 整体替换实际提供的 contacts；缺省不清空。":
    "Uses message.updated. Replace the complete provided contacts array for the target message; omission does not clear it.",
  "复用普通消息的 message.received 与 message.updated，不新增订阅事件。 仅 provider=whatsapp 支持可选 data.sender.device_id；其他渠道不返回。 sender.id 保持不含设备后缀的账号级标识。发送设备号缺失表示未知，明确的 0 是有效编号。 账号登录设备号通过账号详情 provider_profile.device_id 获取；Webhook 不返回 data.account.device_id。 设备号比较、账号设备资料维护及历史消息判断由调用方自行处理。 历史或补拉重建消息、通话、回执、反应和撤回事件不提供发送设备字段，不能根据设备号推断设备新旧。":
    "Uses ordinary message.received/updated subscriptions. Only WhatsApp exposes optional sender.device_id; sender.id remains account-level without a device suffix. Missing is unknown; zero is valid. The current login device is account detail provider_profile.device_id, not Webhook data.account.device_id. Callers maintain device comparisons/history. Historical/rebuilt messages, calls, receipts, reactions and deletions omit sender device IDs; do not infer device age.",
  "复用消息附件字段；URL 可缺失，已知媒体类型仍可保留。size 为字节，duration_ms 为毫秒；仅输出已知有效字段。":
    "Shared attachment fields; URL may be absent while known type remains. size is bytes, duration_ms milliseconds; emit only known valid fields.",
  "多名片始终为一个 type=contact 消息和完整有序 contacts；单张旧消息可继续省略 type 并保留 text。编辑出现 contacts 时整体替换，不支持空数组清空。多名片不提供 reply_token。":
    "Multiple cards remain one type=contact message with ordered contacts. Legacy single-card messages may omit type and retain text. Edits replace a supplied contacts array; [] clearing is unsupported. Multiple cards have no reply_token.",
  "完成渠道账号授权。": "Authorize channel accounts.",
  "完整 `api_key` 只在创建响应中出现一次，客户端应自行保存。":
    "The full `api_key` appears only once in the creation response. The client is responsible for storing it.",
  "完整原文，保留换行、Unicode 和扩展字段；载体非空不等于内容适合直接展示。":
    "Complete original content including newlines, Unicode and extension fields; nonempty content is not necessarily safe to display directly.",
  "完整明文 API Key，仅创建或轮换响应中出现一次。":
    "The full plaintext API key. It appears only once in a creation or rotation response.",
  实时位置内容编辑识别: "Edited live-location recognition",
  实时位置历史识别: "Historical live-location recognition",
  实时位置识别: "Live-location recognition",
  "实际改变 `auth_mode` 时，请求体必须仅包含该字段，目标模式必须为该渠道支持的方式。 同一账号须串行切换：先暂停授权（含二维码轮询）、运行、配置及删除操作并等待在途请求处理结束，切换完成后再继续；切换不能撤回已发给渠道的请求。 实际变更 `provider` 时也须暂停同账号其他业务操作并等待在途请求处理结束；变更请求处理结束且结果确认后再恢复。失败或超时导致处理状态或结果不确定时保持暂停，先确认后继续。原样回传当前 `provider` 不增加该串行要求。 切换至 `code` 前须先保存手机号；缺少手机号返回 400 `auth_mode_phone_required`。 Telegram、WhatsApp 实际切换会清除旧会话，包括已授权会话；完成后旧授权会话记录统一为 `cancelled`，临时材料清空，调用方应重新授权。 成功后保存目标模式，授权状态为 `pending_auth`，运行状态为 `stopped`；不自动启动授权或连接。 提交与当前相同的模式保留当前授权进度和临时材料，不重启授权；其他字段仍按普通部分更新处理。 清理失败时不提交目标模式，但远端会话可能已经清除；可重试仅包含同一目标 `auth_mode` 的 PATCH。 清理失败或切换结果未确认（包括超时）时仍须暂停上述操作，直到同一目标模式切换完成；提交当前模式的无操作成功不表示未决切换已完成。 请求明确在参数校验阶段被拒绝且没有此前未完成的切换时，可修正参数或补齐配置后重新发起。 切换冲突返回 409 `provider_not_ready`。成功响应继续使用原账号结构，授权状态通过既有授权查询读取。 TikTok 账号更新无法安全完成或被中断时返回 502 provider_unavailable。 收到该错误后先重新查询账号状态，再决定是否重新提交更新。":
    "An actual auth_mode change must be the only body field and must be supported by the channel. Serialize changes per account: pause authorization/polling, runtime, configuration and deletion until in-flight requests finish; changing modes cannot undo requests already sent. Actual provider changes require the same pause until the result is confirmed; resubmitting the unchanged provider does not. Before switching to code, save a phone number or receive 400 auth_mode_phone_required. Telegram/WhatsApp mode changes clear even authorized sessions, cancel old authorization and remove temporary materials. Success leaves pending_auth and stopped without starting authorization or connection. An unchanged mode preserves authorization progress; other fields retain ordinary PATCH semantics. Cleanup failure may already have removed the remote session; retry a PATCH containing only the same target mode. Keep other operations paused after failure or timeout until that switch completes; an unchanged-mode no-op does not resolve a pending switch. Validation failures with no previous pending switch can be corrected and resubmitted. Conflicts return 409 provider_not_ready. Read authorization state separately. Interrupted/unsafe TikTok updates return 502 provider_unavailable; query account state before resubmitting.",
  "客户显式配置的代理；不返回平台默认出口凭据。":
    "Customer-configured proxy; platform default egress credentials are not returned.",
  "对应渠道及账号范围内的不透明会话 ID。": "Opaque conversation ID scoped to provider/account.",
  "对应渠道及账号范围内的不透明操作者 ID。": "Opaque actor ID scoped to provider/account.",
  "对应渠道及账号范围内的联系人不透明资源 ID，可关联联系人列表中同 ID 的资源；不保证可直接用于会话或详情查询。WhatsApp 详情可能返回映射后的不同 PN 资源 ID，不能据此自动替换事件资源键或合并不同 PN/LID 记录。":
    "Opaque contact resource ID scoped to provider/account. Matches the corresponding list resource but not necessarily conversation/detail IDs. WhatsApp detail can return a different mapped PN ID; do not replace event keys or automatically merge PN/LID records.",
  "对端 KEM 公钥。": "Peer KEM public key.",
  "对端 WhatsApp LID；无法确认会话时整个对象省略。":
    "WhatsApp peer LID; omit the whole conversation object when unknown.",
  导入会话授权: "Import session authorization",
  封锁联系人: "Block a contact",
  "将 data.verify_code 展示给用户在手机端输入，无需提交到 /auth/code。":
    "Show data.verify_code for entry on the phone; do not submit it to /auth/code.",
  "工作区是否已开通内测，默认关闭；仅服务端可管理，客户不能通过 PATCH 或 metadata 修改。":
    "Server-managed beta eligibility, default false; cannot be changed through PATCH or metadata.",
  "已发送链接预览的自同步，图片未提供": "Sent preview self-sync without an image",
  "已可靠关联的会话 ID，未知时省略。WhatsApp 的详情查询使用此处已确认的 LID；不能从 contact.id 推算。":
    "Reliably associated conversation ID, omitted when unknown. WhatsApp detail uses this confirmed LID; do not derive from contact.id.",
  "已接收。": "Received.",
  "已接收事件。": "Event received.",
  "已提供的商品数量；零值保留，缺失不补零，也不根据数量构造明细。":
    "Known item count; preserve zero, never default or fabricate order lines.",
  "已生成准备态通话，尚未拨号。": "Call prepared; dialing has not started.",
  "已知的可靠操作时间，以 RFC3339 UTC 表示并保留精度；未知时省略，occurred_at 不保证可替代此时间。":
    "Reliable operation timestamp in RFC3339 UTC with precision; omitted when unknown. occurred_at is not a substitute.",
  "已知的可靠操作时间，保留毫秒精度；未知时省略，不用回调到达时间代替。未知时间或同时间冲突应保留待核对。":
    "Reliable vote-operation time preserving milliseconds; omitted when unknown. Never substitute receipt time; unknown/equal-time conflicts remain unresolved.",
  "已知的可靠设置变更时间，以 RFC3339 UTC 表示并保留精度；未知时省略，不用 occurred_at 补齐。":
    "Reliable settings-change time in RFC3339 UTC with precision. Omit unknown; no occurred_at substitution.",
  "已知的非空显示名称，可省略；不用于事件身份或排序。":
    "Known nonempty display name, optional and excluded from event identity/ordering.",
  "已知的非空显示名称，可省略；不用于参与者身份或事件去重。":
    "Known nonempty display name, optional and excluded from participant/event identity.",
  "已知选项标识；未提供时不能由显示文字生成。":
    "Known option ID; never generate from display text.",
  "已确认并归一化的 0 基位置；0 必须保留。WhatsApp 当前不提供，不可依赖。":
    "Confirmed zero-based position; preserve zero. WhatsApp currently does not provide it.",
  "已确认的 WhatsApp 设备编号；0 是有效值，未知时整个字段省略，不返回 null 或空串。":
    "Confirmed WhatsApp device number; zero is valid. Unknown means omitted, never null/empty.",
  "已确认的渠道账号标识，可用于关联账号；未提供时不推测。":
    "Confirmed channel account reference; do not infer when absent.",
  "已结束通话的终态对象。": "Terminal state of the ended call.",
  "币种主单位的非负精确十进制字符串；保留零值，不使用指数、正负号或空白，不限制为固定小数位。":
    "Exact nonnegative decimal string in major currency units. Preserve zero; no exponent/sign/whitespace or fixed decimal-place requirement.",
  "带主机名且不含空白的绝对 HTTP(S) URI，方括号地址仅接受 IPv6 字面量；保留原文，不保证资源可访问。":
    "Absolute HTTP(S) URI with a host and no whitespace. Bracket hosts must be IPv6 literals. Preserve original URI; accessibility is not guaranteed.",
  "带主机名的绝对 HTTP(S) URI，保留查询参数；格式有效不保证资源可访问或永久有效。":
    "Absolute HTTP(S) URI with a host, preserving its query. Valid syntax does not guarantee accessibility/permanence.",
  带广告归因信息的消息事件: "Message with advertising referral",
  带广告归因信息的消息编辑事件: "Edited message advertising referral",
  "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。":
    "Standard runtime state: ready/online/connected/active/started normalize to running; offline/inactive/stop to stopped; failed to error. Raw states are not returned.",
  "平台维护的英文说明，可以调整文案，不用于客户端分支。":
    "Platform-maintained English explanation; mutable and unsuitable for client branching.",
  "平台账号 ID。": "Platform account ID.",
  平台限制发送消息: "Platform restricted message sending",
  "广告上下文提供的欢迎语正文，原样保存；不代表一条具有独立消息身份的发送记录。":
    "Original advertising welcome text, not an independent sent-message record.",
  "广告归因以可选字段补充原消息，不改变消息正文、附件及已有类型。":
    "Optional referral augments a message without changing body, attachments or type.",
  "开启时为正秒数，关闭时明确为 0；不表示每条消息的剩余时间。":
    "Positive seconds when enabled, explicit zero when disabled; not remaining per-message lifetime.",
  "当前 API Key 所属 workspace。": "The workspace associated with the current API key.",
  "当前 workspace 下的一页账号。": "One page of accounts in the current workspace.",
  "当前 workspace 信息。": "Information about the current workspace.",
  "当前 workspace 的 API Key。": "The API key for the current workspace.",
  "当前事件提供的可用历史消息，可为空数组；同一会话可能还有其他历史事件。空数组或数量不足不代表全部历史已完成。":
    "Available messages in this event, possibly []. More events may follow; empty/short batches do not prove completion.",
  "当前二维码授权步骤。调用方应根据标准状态区分二维码、验证码、自动验证与 Passkey。":
    "Current QR authorization step: distinguish QR, verification code, automatic processing and Passkey through standard state.",
  "当前会话允许使用的授权模式。": "Authorization modes available to this session.",
  "当前工作空间内账号的公开 ID。": "Public account ID in the current workspace.",
  "当前已占用的只读账号额度，账号创建后即占用，删除后释放；待授权、停止或断线的账号仍计入。付费额度到期后，已用额度可能超过 account_quota，按实际已用值返回。":
    "Read-only occupied quota. Created accounts count even while unauthorized/stopped/disconnected; deletion releases it. Actual usage can exceed quota after paid capacity expires.",
  "当前授权会话是否允许切换授权模式。":
    "Whether authorization-mode switching is allowed for this session.",
  "当前授权提示的类型；Telegram 验证码步骤为 code。":
    "Authorization hint type; code for Telegram verification.",
  "当前授权步骤所需的渠道载荷。Passkey 流程可能返回 `type=passkey` 和 `public_key`，或返回 `type=passkey_confirmation` 及确认提示字段。":
    "Channel step payload; Passkey may provide type=passkey/public_key or type=passkey_confirmation with confirmation hints.",
  "当前授权步骤所需的渠道载荷，结构会随授权状态变化。":
    "Channel payload varies with authorization state.",
  "当前授权步骤的标准状态，通常与 status 一致。": "Standard step state, usually equal to status.",
  "当前授权流程状态，例如 `awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required` 或 `authorized`。":
    "Authorization state such as awaiting_qr_scan, awaiting_code, pending, passkey_required or authorized.",
  "当前授权流程状态；awaiting_code 表示等待用户操作，authorized 才表示授权完成。":
    "Current authorization state; awaiting_code waits for user action, authorized confirms completion.",
  "当前授权状态。": "The current authorization status.",
  "当前操作状态。": "Current operation state.",
  "当前步骤所需的标准载荷。普通二维码使用 `qr_code`；验证码步骤使用 `type=code`；Passkey 使用 `type=passkey` 和 `public_key`。互斥步骤的载荷 不会同时出现。":
    "Step payload: QR uses qr_code, verification uses type=code, Passkey uses type=passkey/public_key. Mutually exclusive step payloads do not appear together.",
  "当前活动通话或空对象 {}。": "Current active call, or an empty object {}.",
  "当前消息中的商品卡片，至少包含一个已知有效字段；缺图片或价格不影响其他商品信息。":
    "Product card with at least one valid known field. Missing image/price does not invalidate other information.",
  "当前消息中的订单汇总；至少包含一个已知有效字段，不包含商品明细，也不表示支付结果或完整订单生命周期。":
    "Order summary with at least one known valid field, without line items, payment confirmation or a complete order lifecycle.",
  "当前消息的可选来源信息；仅输出类型正确的已知字段，字符串必须非空，显式 false 保留，无可用字段时省略整个对象。所有字段均可省略，缺失不表示否定或清空。":
    "Optional source metadata for this message. Known nonempty strings and explicit false are preserved; all fields are optional, and absence does not mean false or clearing.",
  "当前消息的链接预览；目标链接必需。title/description 仅在明确提供时出现，空字符串表示清空，缺省表示不改，null 和全空白字符串非法；其他可选字段缺省不表示清空。普通正文 URL 不自动成为本对象。":
    "Current link preview with a required target URL. title/description are supplied strings: empty clears, omitted preserves; null/whitespace-only is invalid. Other omissions do not clear. Plain body URLs are not automatic previews.",
  "当前生效的只读账号总容量，包含免费额度和有效期内的付费额度，不扣除已用数量；已到期的付费额度不计入。":
    "Read-only total account capacity, including free and unexpired paid quota without subtracting usage. Expired paid quota is excluded.",
  "当前登录账号的帖子、一级评论查询和回复。":
    "Read the signed-in account's posts and first-level comments, and publish or reply to comments.",
  "当前认证十六进制数据。": "Current authentication hex data.",
  "当前账号无法访问目标帖子（post_inaccessible，39005）；不代表帖子不存在，也不指明具体拒绝原因。":
    "Post inaccessible: post_inaccessible (39005). Does not prove absence or a specific denial cause.",
  "当前账号通讯录中保存的完整联系人名称。":
    "Saved full contact name in this account's address book.",
  "当前账号通讯录中保存的联系人简称或名字部分。":
    "Saved short/first contact name in this account's address book.",
  "当前载荷类型；验证码步骤为 `code`，Passkey 步骤为 `passkey`。":
    "Payload type: code or passkey for the corresponding step.",
  "当前适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `conversation.history`；data.messages[] 为扁平数组，可混合链接预览、商品、交互和普通消息。 按 provider、account_id、会话 ID 和消息 ID 关联；批次 occurred_at 不替代消息 sent_at。 title/description 按出现字段合并，空字符串表示清空，缺省不改；null 和全空白字符串不是合法值。 普通含 URL 文本保持 text；WhatsApp 当前不提供预览 image_url，不因图片缺失丢弃其他可靠预览字段。":
    "WhatsApp only, excluding Protocol. conversation.history contains flat, mixed message arrays. Associate by provider/account/conversation/message IDs; batch occurred_at is not sent_at. Merge supplied title/description, empty clears and omission preserves; null/blank-only is invalid. Plain URL text stays text. Missing preview images do not invalidate other reliable fields.",
  "当前适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.received`，消息类型为 `link_preview`，目标链接必需；标题、摘要和图片仅在有可靠信息时提供。 title/description 保留明确提供的字符串；空字符串表示清空，缺省表示不改，null 和全空白字符串不是合法值。 WhatsApp 当前不提供接收侧 image_url；该字段保留为公共可选契约，不应从发送请求推断回调一定包含图片。 普通正文包含 URL 不会自动成为预览卡片；可与 referral 共存，正文和已有引用字段保持各自语义。 自同步可为 outbound，不能将所有 message.received 当成对方发来的消息。 消息 ID 未提供时不能用顶层事件 ID 替代；只有可靠消息 ID 时才可能提供 reply_token。":
    "WhatsApp only, excluding Protocol. Uses message.received and type=link_preview with a required target URL. Merge reliable title/description/image fields; explicit empty title/description clears, omission preserves, null/whitespace-only is invalid. WhatsApp currently supplies no received image_url; do not infer it from sends. Plain URL text is not automatically a card. referral and reply fields retain their own semantics. Self-sync may be outbound. Missing message IDs cannot be replaced with event IDs; reply_token requires reliable message identity.",
  '当前适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.updated`，data.message.id 为被编辑消息的非空 ID；type=link_preview 时 link_preview.url 仍为必需字段。 按出现字段逐项合并消息和嵌套预览对象，缺少 title/description/image_url 不表示清空。 title/description 明确为 "" 时清空对应字段；null 和全空白字符串不是清空指令，也不是合法值。 WhatsApp 当前不提供接收侧 image_url；不能根据省略字段覆盖已有业务资料。 编辑后成为普通文本时明确提供 type=text 且不带 link_preview；业务方应先清除原消息的预览对象，再合并本次提供的正文等字段。':
    "WhatsApp only, excluding Protocol. Uses message.updated with a nonempty original message ID. link_preview requires its URL. Merge supplied message/nested-preview fields; omitted title/description/image do not clear. Explicit empty title/description clears; null/blank-only strings are invalid. WhatsApp currently omits received image_url. Conversion to ordinary text explicitly provides type=text without link_preview: clear the old preview, then merge supplied body fields.",
  "当客户端请求头传入合法 `X-Request-Id` 时回显。":
    "Echoed when the client supplies a valid `X-Request-Id` request header.",
  "必须是绝对 HTTP(S) URL。": "Absolute HTTP(S) URL required.",
  "成员的渠道侧稳定标识，请按不透明字符串保存和使用。": "Opaque stable channel member identifier.",
  "执行本次置顶或取消的人，未知时省略；不得用来推测原消息作者。":
    "Pin/unpin actor, omitted when unknown; never infer original author from it.",
  "执行本次设置变更的人，未知时省略；不生成消息作者或方向。":
    "Settings-change actor, omitted when unknown. Does not identify a message author/direction.",
  "投票人的不透明 ID，与 data.actor.id 一致；不是原投票作者。":
    "Opaque voter ID equal to data.actor.id, not the original poll author.",
  投票创建消息: "Poll creation message",
  "投票创建消息；id 标识原投票，创建、自同步及静态历史不提供 reply_token，也不生成正文或媒体附件。":
    "Poll creation message. id identifies the original poll. Creation/self-sync/static history has no reply_token, generated text or media attachments.",
  投票选择更新: "Poll vote update",
  挂断指定通话: "Hang up a call",
  "按 BusinessName 优先、PushName 回退规则生成的展示名称。":
    "Display name prefers BusinessName, falling back to PushName.",
  "按 endpoint_id 幂等删除当前工作空间内的端点；可选 query account_id 仅校验原绑定。 已找到端点但账号归属不匹配返回 400 invalid_request，不执行删除。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点确实不存在时返回 204；删除账号最后一个独立端点后，后续首次投递恢复继承工作空间配置。 原端点尚未完成的投递停止，不转投工作空间；已经发出的 HTTP 请求无法撤回。":
    "Idempotently delete a workspace endpoint by endpoint_id. Optional query account_id validates ownership; mismatch returns 400 without deletion. Missing accounts return 404 account_not_found (20020). Missing endpoints return 204. Deleting the last independent endpoint restores workspace inheritance for subsequent initial deliveries. Pending deliveries to the old endpoint stop rather than reroute; already issued HTTP requests cannot be recalled.",
  "按 endpoint_id 获取当前工作空间内的端点，包括工作空间和账号端点。 可选 query account_id 仅校验端点的账号归属；不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点不存在时保持 HTTP 500 get_webhook_endpoint_failed，numeric_code 为 40006。":
    "Get a workspace/account endpoint by endpoint_id. Optional query account_id validates existing ownership only; mismatch returns 400 invalid_request. Missing accounts return 404 account_not_found (20020). Missing endpoints retain HTTP 500 get_webhook_endpoint_failed / 40006.",
  "按稳定顺序分页返回当前 workspace 未删除的账号，账号数组位于 `data.items`。额度删除完成或余额删除受理后，该账号立即不再出现在列表及后续分页中。省略分页参数时只返回第一页，默认最多 20 个账号。 `data.has_more=true` 时，将 `data.next_cursor` 原样作为下一次请求的 `cursor`；续页可调整 `limit`。末页 `data.has_more=false` 且省略 `data.next_cursor`，空结果返回 `data.items: []`。 游标仅适用于签发时的 workspace，调用方不得解析或构造游标。分页期间新创建的账号需重新读取首页查看；跨页查询不提供时间点快照。 `limit` 非法、`cursor` 非法或跨 workspace 使用，以及重复传入 `limit` 或 `cursor`，均返回 `400 invalid_request`（`numeric_code=10000`）。":
    "Pages through undeleted accounts in stable order; accounts are in data.items. Quota deletion completion or wallet deletion acceptance immediately removes an account from subsequent list results. Omitting pagination returns only the first page, default 20. When data.has_more=true, pass data.next_cursor unchanged as cursor; limit may change between pages. The last page has has_more=false and omits next_cursor; empty results use items=[]. Cursors are opaque and workspace-bound. Restart at the first page to discover newly created accounts; pagination is not a point-in-time snapshot. Invalid, duplicate or cross-workspace cursor/limit parameters return 400 invalid_request (10000).",
  "按账号所属渠道校验已读目标。Telegram 必须提供单个 up_to_message_id， 来自当前账号在该会话收到的消息，例如 message.received 的 data.message.id，且 data.message.direction=inbound；不能使用发送响应的 data.message_id 或事件顶层 id。 将当前账号在该会话中截至该消息（含自身及此前消息）的记录标为已读； 不支持省略消息 ID 标记整个会话，也不支持非空 up_to_message_sender_id。 WhatsApp 的消息级已读须成对提供非空 up_to_message_id 和 up_to_message_sender_id； 省略两者，或两者去除首尾空白后均为空时，标记整个会话。成功返回 data.ok=true；本次操作不查询对方已读状态，也不新增 Webhook 事件。":
    "Read targets depend on the account's channel. Telegram requires one received native up_to_message_id from this conversation, for example an inbound message.received data.message.id, not the send response or top-level event ID. Marks through that message inclusive; whole-conversation mode and nonempty sender ID are unsupported. WhatsApp message-level reads require nonempty message and sender IDs together. Omit both, or provide both blank after trimming, for whole-conversation mode. data.ok=true confirms the operation, not the peer's read state; no new Webhook is added.",
  "按账号所属渠道校验，字段类型始终为字符串。 Telegram 必填：当前账号在该会话收到的单个消息 ID，例如 message.received 的 data.message.id，且 data.message.direction=inbound。 去除首尾空白后必须只含 ASCII 十进制数字，数值范围为 1–2147483647； 截止该消息（含自身及此前消息）标记已读。不能使用逗号列表、正负号、小数、指数、内部空白或非 ASCII 数字，不能省略或使用 0 表示整个会话。 WhatsApp 可选：一个消息 ID，或属于同一发送者的多个消息 ID（英文逗号分隔）； 与 up_to_message_sender_id 成对提供非空值。省略两者时标记整个会话已读；两者去除首尾空白后均为空时同样标记整个会话。":
    "String read target with channel-specific validation. Telegram requires one received native message ID: trimmed ASCII decimal 1-2147483647, no lists/signs/decimals/exponents/internal spaces/Unicode digits. Marks through that message inclusive; omission/zero is not whole-conversation mode. WhatsApp accepts one ID or comma-separated IDs from one sender, paired with nonempty sender ID. Omitting both or supplying both blank after trimming means whole-conversation read.",
  "按钮、模板及选择响应接收事件": "Received interactive cards and responses",
  "按钮、模板及选择响应的消息编辑事件": "Edited interactive cards and responses",
  "按钮保留原顺序；各类型只能出现适用字段，位置不能单独构成有效按钮。":
    "Ordered buttons with type-specific fields only; position alone is not a valid button.",
  按需补拉的会话历史消息: "On-demand conversation history",
  "授权动作的结果，字段随渠道和当前授权步骤变化。 WhatsApp 配对码位于 `verify_code`；Telegram 可通过 `auth_payload.type=code` 提示等待用户提交验证码。`account_id`、`auth_fields` 和 `expires_at` 不是此动作的统一返回字段，不能按授权状态查询的响应结构读取本接口。":
    "Authorization action result varies by channel/step. WhatsApp pairing code is verify_code; Telegram may use auth_payload.type=code. account_id/auth_fields/expires_at are not universal fields; do not parse this as an authorization-state query.",
  "授权模式，例如 qrcode、code、session。":
    "The authorization mode, for example `qrcode`, `code`, or `session`.",
  "授权流程状态，例如 `pending_auth`、`awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required`、 `passkey_pending`、`passkey_confirmation`、`passkey_confirmation_sent`、 `authorized`、`failed`。":
    "Authorization states include pending_auth, awaiting_qr_scan, awaiting_code, pending, passkey_required, passkey_pending, passkey_confirmation, passkey_confirmation_sent, authorized and failed.",
  "接收名片保留完整 vCard 原文和原始顺序；与发送用结构化 ContactCard 分开，不解析重写电话等字段。":
    "Received cards preserve complete original vCards and order, separately from structured sending ContactCard. Do not rewrite phone fields.",
  "接收成功。": "Received successfully.",
  "接收的按钮或模板卡片；至少包含一个有效组件，kind 本身不构成卡片。省略的字段不清空已有值；buttons 若提供则按本次有序数组整体替换。":
    "Received buttons/template card with at least one valid component; kind alone is insufficient. Merge supplied fields; provided buttons replace the complete ordered array.",
  "提交 Passkey 凭证响应": "Submit a Passkey response",
  "提交 url、status 和需要保留的完整配置。省略 body account_id 时保留端点的已有归属。 提供 account_id 仅校验原绑定一致；不允许切换账号、把工作空间端点改为账号端点或清空绑定。 account_id 不接受 query、null 或重复字段，归属不匹配返回 400 invalid_request。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 账号端点可直接从停用恢复启用，归属保持不变。 inactive 改为 active 时，账号已有其他 active 端点返回 409 account_webhook_already_exists（40008）；原端点已为 active 且保持 active 时允许更新，包括历史多 active 配置。 省略 signing_secret 关闭签名；省略 retry_policy 恢复默认策略；订阅数组整体替换。 端点不存在时保持 HTTP 500 update_webhook_endpoint_failed，numeric_code 为 40006。":
    "Submit url/status and the complete desired configuration. Omitting body account_id retains ownership; supplying it validates the existing binding only. Ownership cannot change or be cleared. Query/null/duplicate/case-variant account_id and mismatches are invalid_request; missing accounts return 404 account_not_found (20020). Reactivation preserves ownership and conflicts with another active endpoint return 409 account_webhook_already_exists (40008). Updating an already active endpoint remains allowed, including historical configurations. Omitting signing_secret disables signing; omitting retry_policy restores defaults; subscriptions replace the entire array. Missing endpoints return HTTP 500 update_webhook_endpoint_failed / 40006.",
  提交二次密码: "Submit a two-step verification password",
  "提交当前授权步骤要求的验证码。TikTok 账号仍使用 `auth_mode=qrcode`；扫码后 `/auth/qr/check` 返回 `awaiting_code` 时，通过本接口提交 2FA 验证码。提交成功 只表示已接受，调用方必须继续轮询 `/auth/qr/check`，直到返回 `authorized` 或 `failed`。 Provider 明确拒绝验证码时保持 HTTP 400 `provider_invalid_request`，并使用 `numeric_code=30016` 区分一般参数拒绝；客户端可允许用户重新输入验证码。":
    "Submit the current authorization code. TikTok remains auth_mode=qrcode; submit 2FA here after /auth/qr/check returns awaiting_code. Acceptance is not success: keep polling QR check until authorized or failed. A rejected code returns 400 provider_invalid_request with numeric_code=30016; the user may re-enter it.",
  提交验证码: "Submit an authorization code",
  撤回消息: "Revoke a message",
  "操作不存在或不属于当前工作区，account_operation_not_found（20029）。":
    "Operation missing or outside the workspace: account_operation_not_found (20029).",
  "操作成功。": "The operation succeeded.",
  "支持接收历史消息中的商品和订单卡片，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `conversation.history`，`data.messages[]` 为扁平消息数组，同批可以混合商品、订单和普通消息。 按消息 ID 合并已有记录，保留本次未提供的字段；消息 ID 缺失时不以事件 ID 或商品、订单 ID 替代。 历史批次不保证完整归档；图片缺失、过期或暂不可用时仍保留其他有效商品、订单信息。":
    "WhatsApp only, excluding Protocol. conversation.history mixes flat product/order/ordinary messages. Merge by message ID and preserve absent fields. Event/product/order IDs cannot replace missing message IDs. History completeness and image availability are not guaranteed; retain other valid content.",
  "支持接收历史消息中的广告归因信息，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `conversation.history`；每条历史消息的可选 `referral` 与实时消息使用相同结构。 `data.messages[]` 是扁平消息对象，同批消息可以没有归因信息；不将实时归因复制给同会话的其他消息。 历史事件只表示本次收到的历史批次，不保证全部消息或全部广告来源均可补齐。 按顶层 `id` 去重，按 `provider + account_id + data.conversation.id + data.messages[].id` 与实时消息合并。 缺失 `referral` 或其中字段表示本次没有提供该信息，不应清空已保存的归因信息。":
    "WhatsApp only, excluding Protocol. Optional referrals in flat conversation.history messages use the realtime structure. Do not copy attribution between messages. Neither all messages nor all referral data is guaranteed. Deduplicate by event ID and merge with realtime records by provider/account/conversation/message IDs. Omitted referral fields preserve stored information.",
  "支持接收商品和订单卡片的消息编辑，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.updated`；`data.message.id` 为被编辑消息的非空 ID，顶层 `id` 是本次事件的幂等键。 按 provider、account_id、会话 ID 和消息 ID 关联原消息，仅合并本次提供的字段，缺失不清空。 该事件表示消息内容更新，不承诺订单生命周期通知；`order.status=accepted` 不表示付款成功。":
    "WhatsApp only, excluding Protocol. message.updated uses a nonempty target message ID and a separate event idempotency key. Associate by provider/account/conversation/message IDs and merge supplied fields only. This is content editing, not an order lifecycle; accepted does not mean paid.",
  "支持接收商品和订单卡片，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.received`；`data.message.type=product/order` 分别对应 `product/order` 对象，二者不能同时出现。 各业务字段按实际提供的信息输出，金额与币种可以分别缺失；零金额和零数量保留，不生成订单明细。 可与可选 `referral` 共存；WhatsApp 商品和订单回调依赖原消息 ID，缺少该 ID 时不提供可关联的卡片事件。 顶层事件 `id` 仅用于事件去重，不能替代消息 ID。 不新增发送类型、商品写入、订单写入或支付能力。":
    "WhatsApp only, excluding Protocol. message.received uses mutually exclusive type=product/order objects. Fields appear only when known; amount/currency may be independently absent and zero values remain. No order lines are generated. referral may coexist. Native message IDs are required for association; event IDs cannot replace them. No commerce sending, product/order writes or payment capability is added.",
  "支持接收消息广告归因信息，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.received`，仅在当前消息确有可用来源信息时附加 `data.message.referral`，不产生独立广告事件或新的消息类型。 仅确认广告来源时提供 `source=ad`；字段缺失表示未知，不能据此推断不是广告来源。 归因信息只属于当前消息，不继承其引用消息的归因。保留 `source_url` 查询参数，不按链接自行推断点击标识。 按顶层 `id` 去重；提供 `data.message.id` 时，按 `provider + account_id + data.conversation.id + data.message.id` 关联消息，用 `direction` 判断收发方向。 `data.message.id` 可能缺失，此时仅保存本次事件，不伪造消息关联，也不把顶层事件 `id` 当作消息 ID。 本节只扩展接收结构，不支持通过发送接口构造广告归因信息。":
    "WhatsApp only, excluding Protocol. Optional message.referral augments the current message.received, without a separate advertising event/type. source=ad requires confirmed advertising; absence is unknown. Referral belongs only to this message, not its quoted parent. Preserve source_url query parameters and do not derive click IDs from URLs. Deduplicate by event ID and associate by provider/account/conversation/message IDs when present; direction determines inbound/outbound. Without message ID, store the event without fabricated association. Sending advertising attribution is not supported.",
  "支持接收消息编辑中的广告归因信息，仅适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.updated`，编辑后的当前消息携带可用来源信息时附加 `data.message.referral`。 同时订阅 `message.received`、`message.updated` 和 `conversation.history` 可处理新消息、编辑与历史批次。 `data.message.id` 是被编辑消息的 ID；按顶层 `id` 对事件去重，按 `provider + account_id + data.conversation.id + data.message.id` 关联原消息。 只合并本次提供的字段；缺失 `referral` 或其中字段不清空已有信息，也不把一次编辑的归因复制到其他消息。":
    "WhatsApp only, excluding Protocol. message.updated includes referral when available for the edited message. Subscribe to received/updated/history for complete handling. Use event ID for deduplication and provider/account/conversation/message IDs for association. Merge only provided fields; absent referral preserves prior information and must not propagate to other messages.",
  "支持符合识别与当前账号帖子归属条件的 post.comment.created；需确认接入环境已开放通知后启用。 通知范围有限，不保证覆盖所有评论和回复；未知通知不作为公开事件。parent_comment_id 仅在父子关系可靠时提供，缺失不能证明一级评论或可回复目标。 回复时应确认通知评论属于目标帖子的一级评论；回复接口不预先确认其所属帖子或层级，不能仅凭通知字段缺失认定可回复。 评论轮询默认关闭。provider_data.enable_comment=true 后需启动或重连生效；在线账号修改配置必须重连，start 成功不证明配置已更新。 尽力而为通知可能延迟、重复、乱序或遗漏，不保证实时、完整历史或每条评论都有事件；接收方按事件 id 去重。 精确订阅需包含 post.comment.created，空订阅和 * 会包含该类型；订阅本身不会开启轮询。 已开启轮询且具有匹配订阅的账号，在环境开放后可能开始收到该事件；启用前须核对现有配置与接收端处理能力。":
    "post.comment.created covers recognized notifications for posts bound to the current account, only after the environment enables notifications. Coverage is best effort: events can be delayed, duplicated, reordered or missing. Unknown notices remain unexposed. parent_comment_id requires reliable evidence; its absence proves neither a first-level comment nor a valid reply target. Verify first-level targets before replying; the write API does not prevalidate hierarchy. Polling defaults off. Set provider_data.enable_comment=true and start/reconnect; online changes require reconnect and start success does not prove application. Explicit subscriptions must include this event; empty/* subscriptions include it but do not enable polling. Review receiver readiness before enabling existing polling configurations.",
  新建或更新会话标签: "Create or update a conversation label",
  "新建或更新后的标签。": "The newly created or updated label.",
  新评论事件: "New comment event",
  无账号: "No accounts",
  "既有消息事件辅助信息；通话识别和状态以 message.type 与 message.call 为准。":
    "Existing message event metadata; recognize calls through message.type and message.call.",
  "既有账号级发送者标识，不包含设备后缀，取值规则不因 device_id 改变。":
    "Existing account-level sender ID without a device suffix; device_id does not change its meaning.",
  "是否同步至当前 WhatsApp 账号关联设备的系统通讯录。":
    "Whether to synchronize to linked WhatsApp devices' system address books.",
  "是否存在于目标账号的渠道联系人列表中。":
    "Whether the contact exists in this account's channel contact list.",
  "是否还有下一页。": "Whether another page exists.",
  "普通二维码内容或可直接展示的二维码 data URL。":
    "QR content or directly displayable QR data URL.",
  "更新 API Key 状态": "Update API key status",
  "更新 webhook endpoint": "Update a webhook endpoint",
  "更新后的 API Key 元数据。": "Metadata for the updated API key.",
  "更新后的 webhook endpoint。": "The updated webhook endpoint.",
  "更新后的 workspace 信息。": "Information about the updated workspace.",
  "更新后的账号。": "The updated account.",
  "更新当前 workspace": "Update the current workspace",
  更新账号: "Update an account",
  最后一页: "Last page",
  "最大选择数，不超过 options 数量；单选为 1，全部可选时等于选项数量。":
    "Maximum selectable choices, at most the option count. One means single-choice; option count means all choices allowed.",
  "服务器处理请求时发生错误。": "Server request processing failed.",
  "服务暂不可用。": "The service is temporarily unavailable.",
  "服务端生成的请求 ID。": "The request ID generated by the server.",
  "未知原生时间时可能是接收时间；判断投票新旧使用可靠 voted_at。":
    "May be receipt time when native time is unknown; order votes using reliable voted_at.",
  "本次完整限时消息设置快照；整体替换旧设置，缺失对象不表示关闭，不改变会话其他字段。":
    "Complete current disappearing-message settings snapshot. Replace the old settings object only; absence does not disable or change other conversation fields.",
  "本次实际请求的数量上限。": "Actual requested count limit.",
  "本次批次来自按需补拉；不标识具体请求或补拉完成状态。":
    "On-demand batch source, not a request identifier or completion signal.",
  "本次投票人，id 必须与 poll_vote.voter_id 一致；不能据此填充原消息作者。":
    "Current voter; id must equal poll_vote.voter_id. Do not fill the original author from it.",
  "本次提供的通讯录保存名；仅更新出现的字段，空字符串表示明确清空，缺省表示保持原值，null 非法。不要覆盖对方昵称。":
    "Supplied address-book names only. Empty clears, omission preserves, null is invalid. Do not overwrite the peer's nickname.",
  "本次标准事件的幂等键，不是原投票 ID 或选项 ID；不暴露渠道的操作消息 ID。":
    "Event idempotency key, not poll/option ID. Channel operation-message IDs are not exposed.",
  "本次相对已保存账号资料实际变化的公开字段；兼容旧事件，字段可以省略。":
    "Public profile fields actually changed relative to saved data; optional for older events.",
  "本次置顶状态快照，每次整体替换旧 pin 对象；缺失的有效期也清除旧值，不影响消息其他字段。":
    "Complete pin snapshot replacing the previous pin object, including clearing omitted expiry. Other message fields remain unchanged.",
  "本次请求的标准会话 ID。": "Standard requested conversation ID.",
  "本次邀请、接听或结束的发生时间；无法确认时使用接收时间，重试保持不变，但接收时间不会用于填充 accepted_at。":
    "Invitation/acceptance/end occurrence time, falling back to receipt time when unknown. Retries preserve it; receipt time never populates accepted_at.",
  "本节描述 WhatsApp 账号授权失效回调。部分事件在 `data.error` 中提供结构化失败原因， 业务方按 `code` 或 `numeric_code` 分支，不根据 `message` 判断。 `data.error` 缺失不表示成功，旧事件或其他失败场景可能没有该对象；仍须检查事件类型和状态。 `account_restricted` 只表示当前登录受限，不代表已确认封禁、永久封禁或固定恢复期限。 原有 `last_error` 保持兼容，账号与会话查询不会因此增加错误对象。":
    "Some WhatsApp authorization-failure events include data.error. Branch on code/numeric_code, not message. Omission does not mean success; inspect event type/state. account_restricted means current login restriction, not confirmed/permanent suspension or a recovery deadline. last_error stays compatible; account/session queries gain no error object from this change.",
  "本节描述现有 `message.received` 事件中 `data.message.type=call` 的通话子类型； 首期仅支持 `whatsapp`，不包含 `whatsapp-protocol` 或群通话，不改变普通消息格式。 同时订阅 `message.received` 和 `message.updated` 可接收邀请、接听与结束通知，沿用 endpoint 的签名配置。 邀请创建一条通话消息，`offered` 不表示已接听。媒体类型未知时省略。 按顶层 `id` 去重，按 `provider + account_id + data.message.id` 关联消息记录。 已接听或已结束记录收到迟到邀请时只补全缺失字段，不恢复来电状态，不再次提醒。 通话消息 ID 仅用于记录关联，不代表支持发送、回复、编辑、撤回或转发该记录。":
    "Uses message.received with message.type=call, initially WhatsApp one-to-one only, excluding Protocol/groups. Subscribe to received and updated for offered/accepted/ended stages using endpoint signing. offered is not answered; unknown media is omitted. Deduplicate events and associate by provider/account/message IDs. Late offers only fill missing fields after acceptance/end; do not restore ringing or notify again. Record IDs do not imply native send/reply/edit/revoke/forward support.",
  "本节描述现有 `message.updated` 事件中 `data.message.type=call` 的通话子类型； 首期仅支持 `whatsapp` 单聊，接听确认或收到结束信号时更新原通话记录，不新增第二条消息。 邀请、接听与结束的 `data.message.id`、`data.message.call.id` 相同，三个阶段的顶层事件 `id` 不同。 通话更新按字段合并，嵌套 `call` 对象也逐字段合并；缺失字段保留原值，不用整个对象替换。 接听和结束通知可提供原通话发起者 `sender` 和对端会话 `conversation`；无法确认的字段单独省略。 不提供发起方向或原消息发送时间，不能覆盖原消息排序时间；缺少身份字段不影响通知投递。 `accepted` 表示收到接听确认；时间可靠时提供 `accepted_at`，未知时省略，不携带 `ended_by` 或 `end_reason`。 接听确认可按稳定消息 ID 关联；尚无原记录时补建最小已接听记录。 结束时没有原记录则补建最小已结束记录；会话缺失时先按消息 ID 保存待关联记录。 状态优先级为 `ended > accepted > offered`，`ended` 为终态；本规则只适用于通话消息。 迟到接听只补接听事实和时间，不能恢复已结束状态；迟到邀请不能恢复来电或再次提醒。 业务方独立保存已收到接听确认的事实，即使 `accepted_at` 缺失或状态已变为 `ended` 也应保留。 未收到接听确认仍是未知，不能将记录直接归类为未接来电。接听确认不保证媒体连接已建立， 也不能据此推断拒接、忙线或计算实际媒体通话时长。 结束通知可提供 `end_reason`：`timeout` 表示收到超时原因，`rejected_elsewhere` 表示其他端拒接， 不推断具体设备或执行方。这两种原因不携带 `ended_by`，未知原因省略，不输出任意原因字符串。 已有接听事实和时间应继续保留，不能因结束原因覆盖成未接听；无接听事实时可展示“呼叫超时”或“其他端拒接”。":
    "Uses message.updated with type=call for WhatsApp one-to-one calls. Offered/accepted/ended share message.id and call.id but have distinct event IDs. Merge nested call fields individually, preserving omitted values. Reliable original sender/conversation may be supplied; direction and original sent_at are omitted and must not overwrite ordering. Missing identities do not block receipt. accepted records confirmation with optional reliable accepted_at; no end fields. Build minimal records if updates precede offers, retaining pending conversation association. State precedence is ended > accepted > offered; late acceptance adds facts/time without reopening an ended call, and late offers cannot ring again. Preserve the fact of acceptance even without its timestamp. Missing acceptance is unknown, not a missed call. Acceptance does not prove media connectivity or actual duration. End reasons timeout/rejected_elsewhere do not identify a device/operator and omit ended_by; unknown reasons are omitted. Preserve prior acceptance facts despite end reasons.",
  "来源 URL，不承诺为广告主落地页；必须为带主机名的绝对 HTTP(S) URL，保留完整查询参数。":
    "Absolute HTTP(S) source URL with a host and complete query; not necessarily the advertiser's landing page.",
  "来源提供的显示名；未知或空白省略，不代表通讯录清空。":
    "Available source display name; absent/blank means unknown, not an address-book clear.",
  "来源标识；作为不透明字符串保存，不转换成数字。":
    "Opaque source identifier, never numeric-converted.",
  "来源素材的已知媒体类型，未知时省略。": "Known source media type; omitted when unknown.",
  "来源素材的绝对 HTTP(S) URL，不等同于当前消息附件地址。":
    "Absolute HTTP(S) source media URL, distinct from this message's attachment.",
  "来源素材缩略图的绝对 HTTP(S) URL；缺失不影响其他归因字段。":
    "Absolute HTTP(S) source thumbnail URL; absence does not invalidate other referral fields.",
  "来电事件，携带短期浏览器接听链接；仅内测工作区订阅匹配时投递，`*`、空数组或省略订阅均可匹配，具体事件列表须包含 call.incoming。与 message.* 通话记录独立。呼入暂未开放，内测资格不会自动开启呼入；投递及重试时重新核验资格。":
    "Incoming-call event with a short-lived browser answer link. Beta access and matching subscriptions are required; wildcard/empty/omitted match, explicit lists need call.incoming. Independent of message.* call records. Incoming calls remain unavailable; beta eligibility does not enable them. Eligibility is checked on delivery/retry.",
  "来自可引用消息事件 `data.message.reply_token` 或发送响应 `data.reply_token` 的不透明句柄，按原账号及会话原样使用；不能用消息 ID 替代。":
    "Opaque reply handle from message.reply_token or send response data.reply_token, scoped to the original account/conversation. A message ID is not a substitute.",
  "查询 provider 地区可用性": "Get provider region availability",
  "查询可用渠道及其元数据。": "Query available channels and metadata.",
  "查询指定联系人是否存在于目标账号的渠道联系人列表中。":
    "Check whether a contact belongs to this account's channel contact list.",
  "查询目标会话详情。WhatsApp 群明确不存在或当前账号未参与该群时，返回 HTTP 404， `error.code` 为 `conversation_not_found`；`error.numeric_code` 分别为 `34004`（群不存在） 或 `34011`（账号未参与该群）。这类错误不应按临时网关故障自动重试。 未知上游业务失败、网络异常和超时仍返回 HTTP 502。":
    "Get a conversation. Confirmed missing WhatsApp groups or accounts not in the group return 404 conversation_not_found, with numeric_code 34004 or 34011 respectively; do not automatically retry as temporary gateway errors. Unknown upstream, network and timeout failures remain HTTP 502.",
  "查询群组及执行群组操作。": "Query and manage groups.",
  "查询联系人及执行联系人操作。": "Query and manage contacts.",
  查询联系人是否在联系人列表中: "Check contact-list membership",
  查询联系人黑名单: "List blocked contacts",
  "查询请求中的联系人标识。": "Contact identifier from the query.",
  查询账号当前活动通话: "Get the account's active call",
  查询账号计费操作: "Get an account billing operation",
  "标准会话类型；WhatsApp 社群公告群继续使用 group。":
    "Standard conversation type; WhatsApp announcement groups remain group.",
  "标准化成员角色。群主或创建者为 `superadmin`，管理员为 `admin`，普通成员以及暂时无法识别权限的成员为 `member`。":
    "Normalized role: owner/creator=superadmin, administrator=admin, ordinary/unknown privilege=member.",
  "标准历史消息，沿用现有正文、附件和可选归因字段；仅具有原生消息 ID 且 id、sent_at、direction 完整的内容消息可用于继续补拉，合成通话记录不可用。":
    "Standard historical content with body/attachments/optional referral. Only native ID plus complete id/sent_at/direction can anchor another request; synthetic calls cannot.",
  "标签成员操作结果。": "The result of the label membership operation.",
  标记会话已读: "Mark a conversation as read",
  标记会话未读: "Mark a conversation as unread",
  检查二维码授权结果: "Check the QR code authorization result",
  "每位投票者最多可选的选项数量；不得大于 options 数量，该跨字段约束由接口验证。":
    "Maximum options selectable per voter, no greater than the option count; cross-field validation is server-side.",
  "每页最多返回的账号数。省略时为 20；非法值或重复传入时返回 400 invalid_request（numeric_code=10000）。续页可调整此值。":
    "Account page size, default 20. Invalid/duplicate values return 400 invalid_request (10000). May change between pages.",
  "每页返回数量。": "Maximum page size.",
  "沿用 conversation.history 订阅。历史只补充实际收到的静态投票题目与选项，可与其他消息混合；不重放 poll_vote 或累计选择结果，不能据此声称恢复全部投票。创建消息仍不提供 reply_token。":
    "Uses conversation.history with received static questions/options mixed with other messages. Does not replay votes, cumulative results or all polls. Creation messages have no reply_token.",
  "沿用 message.received 订阅。当前仅 WhatsApp 支持投票创建。自同步可为 outbound；投票内容不包含累计票数、媒体正文或 reply_token。选项 ID 为不透明值，调用方使用回调值。":
    "Uses message.received, currently WhatsApp only. Self-sync may be outbound. Poll content has no aggregate counts, media body or reply_token. Use opaque option IDs from callbacks.",
  "沿用 message.updated 订阅，event.change_type=poll_vote。message.id 是原投票；actor.id 与 voter_id 是同一投票人，不是原作者。decoded 用完整选择替换此人记录，空数组明确撤票；unavailable 保留旧结果，不提供 selected_option_ids。更新可先于创建到达，先暂存关联；可靠 voted_at 缺失或冲突时不能凭到达顺序覆盖。此事件不提供操作消息正文、sender、direction、sent_at 或 reply_token。":
    "Uses message.updated with change_type=poll_vote and the original poll message.id. actor.id and voter_id identify the voter, not the author. decoded replaces that voter's complete selection; [] withdraws it. unavailable preserves prior results and omits selected_option_ids. Updates may precede creation; retain pending association. Unknown/conflicting voted_at cannot be ordered by arrival. No operation-message body/sender/direction/sent_at/reply_token is supplied.",
  "浏览器生成的 WebAuthn 凭证响应序列化后的完整 JSON 字符串。":
    "Complete serialized JSON browser WebAuthn credential response.",
  "消息发送请求已被接收或完成。": "The message send request has been accepted or completed.",
  "消息正文；WhatsApp 要求其中包含 link_preview.url 的原文。":
    "Message text; WhatsApp requires the literal link_preview.url within it.",
  消息设备信息: "Message device information",
  "消费时从 Provider 查询到的 WhatsApp 当前 PushName。":
    "Current WhatsApp PushName obtained during processing.",
  "添加成功后的联系人信息。": "Contact returned after successful creation.",
  添加联系人: "Add a contact",
  "添加联系人失败；whatsapp 目标号码未被识别为有效联系人时，numeric_code=35009，保持 code=create_contact_failed，并保留完整原始原因。":
    "Contact creation failed. An unrecognized WhatsApp number uses create_contact_failed / 35009 with its available original reason.",
  "渠道会话授权参数。Telegram、Twitter 等既有 provider 可继续使用 `session_url` 或其已支持的自由字段；`whatsapp-protocol` 的协议凭证必须放入同名嵌套对象。 账号定位、webhook 与代理由平台注入，不应在此提交。":
    "Channel session import. Telegram/Twitter retain session_url and supported free fields. whatsapp-protocol credentials must be in the same-named nested object. Do not submit account routing, webhook or proxy configuration here.",
  "渠道侧会话标识，部分渠道的标识可能包含 `@`、`:` 等字符。":
    "Opaque channel conversation ID; may contain @ or :.",
  "渠道侧接入账号引用，无法提供时省略。":
    "Connected channel account reference, omitted when unavailable.",
  "渠道侧接收方标识。": "Channel recipient identifier.",
  "渠道侧群组标识。": "Channel group ID.",
  "渠道侧群组标识，部分渠道的标识可能包含 `@` 等字符。":
    "Channel group ID; may contain characters such as @.",
  "渠道侧联系人标识。WhatsApp 封锁和解封操作必须传 LID，格式为 `数字@lid`。":
    "Channel contact ID. WhatsApp block/unblock requires a numeric @lid identifier.",
  "渠道侧联系人标识，按不透明字符串传递。`whatsapp` 和 `whatsapp-protocol` 统一使用 LID（`xxx@lid`）；`whatsapp-protocol` 联系人资料字段缺失时仍可能返回成功， 调用方应以实际返回字段为准。":
    "Opaque channel contact ID. whatsapp and whatsapp-protocol use LID (xxx@lid). Successful whatsapp-protocol detail can omit profile fields; use the actual response.",
  "渠道侧账号公开标识。": "Public channel account identifier.",
  "渠道侧账号标识。WhatsApp 返回 LID 格式；该字段在账号资料同步完成前可能缺失。":
    "Channel account ID. WhatsApp uses LID; may be absent before profile synchronization.",
  "渠道侧账号标识；无法提供时可以省略。": "Channel account identifier, omitted when unavailable.",
  "渠道发送失败或暂不可用；numeric_code=20102 表示 whatsapp 账号受限，30020 表示 whatsapp-protocol 账号登录受限，30019 表示平台限制发送，34012 表示 whatsapp 群消息发送需要管理员权限，均不应自动重试；34012 应先核实群权限和账号角色，由管理员调整后再发送；30021 表示连接未建立，应先刷新账号状态；30010 附带可用的原始错误原因。":
    "Channel send failure. Do not automatically retry restrictions 20102 (WhatsApp account), 30020 (Protocol login), 30019 (platform) or 34012 (WhatsApp group admin required). Resolve permissions/restrictions first. 30021 means disconnected: refresh runtime first. 30010 may include an original reason.",
  "渠道扩展字段；WhatsApp 群会话可包含公告群分类，会话列表不保证提供该分类。":
    "Channel extensions; WhatsApp group announcement classification may be absent from conversation lists.",
  "渠道扩展字段；WhatsApp 群资料可包含公告群分类，是否返回取决于本次查询可用资料。":
    "Channel extensions; WhatsApp group announcement classification depends on available detail.",
  "渠道扩展配置；省略整个 `provider_data` 时保留原配置。 TikTok 的 `enable_comment` 仅接受 Boolean，未配置为 false；在线修改后需 reconnect 生效，关闭不撤回已排队事件。 Telegram 的 `provider_data.api_id` 和 `provider_data.api_hash` 均为可选； 更新自定义应用凭证时，请成对提供同一 Telegram 应用的两个字段，均使用字符串。 非空配置替换中的缺省凭证字段使用平台默认值；默认配置不可用时，该更新请求失败。 显式空对象表示清空，不补充默认凭证。":
    "Omitting provider_data preserves it. TikTok enable_comment accepts Boolean, defaults false and requires reconnect after online changes; disabling does not retract events. Telegram custom api_id/api_hash must be paired strings; omitted credentials in a nonempty replacement use platform defaults, failing if unavailable. Explicit {} clears without adding defaults.",
  "渠道拒绝贴纸素材，提供具体失败原因":
    "Channel rejected sticker material with an available reason",
  "渠道授权参数，常见字段为 `code`。": "Channel authorization parameters, commonly code.",
  "渠道授权参数，常见字段为 `password`。": "Channel authorization parameters, commonly password.",
  "渠道操作参数。支持的字段因渠道和操作而异；空对象表示不传额外参数。":
    "Channel action parameters vary by operation/provider; {} supplies no extra parameters.",
  渠道操作失败并附带原始原因: "Channel operation failed with an original reason",
  "渠道操作结果，返回字段因操作和渠道而异。":
    "Channel action result; fields vary by action and provider.",
  "渠道支持的 `region` 及其可分配状态。": "Supported regions and allocation availability.",
  渠道服务暂不可用: "Channel service temporarily unavailable",
  "渠道服务暂不可用或返回了无效响应；Device API 识别到 whatsapp-protocol 账号当前登录受限时使用 numeric_code=30020，调用方应停止自动重试并引导用户检查官方 WhatsApp 客户端。 Device API 识别到 whatsapp 账号连接未建立时使用 numeric_code=30021，适用于消息、联系人、群组等操作，message 保留原始连接错误。 调用方应暂停依赖连接的请求，调用 POST /v1/accounts/{account_id}/runtime/refresh，按最新状态恢复连接，确认 runtime_status=running 后再发起业务请求。 该错误不表示已登出或授权失效，也不会自动重发请求、重连或修正账号状态。 numeric_code=30010 表示操作失败，message 在有原因时附带原始错误原因；调用方按数字码判断，不依赖错误文案。 仅 whatsapp 的群消息发送明确需要管理员权限时使用 numeric_code=34012；停止自动重试，核实群权限和账号角色，由管理员调整后再发送。":
    "Channel unavailable or invalid response. Protocol login restriction uses 30020: stop automatic retry and check the official WhatsApp app. WhatsApp disconnection uses 30021 across messages/contacts/groups: pause dependent requests, refresh runtime, restore connection and confirm running before resuming. It does not prove logout or invalid authorization, nor automatically retry/reconnect/change state. 30010 may include an original reason; branch on codes, not text. WhatsApp group-admin send rejection uses 34012: resolve permissions before resending.",
  "渠道特定的授权提示；Telegram 可返回 type=code，不包含用户收到的验证码。":
    "Channel authorization hint. Telegram may return type=code without the user's verification code.",
  "渠道用户名，格式要求以目标渠道为准。": "Channel username in the channel's required format.",
  "渠道用户标识，请按不透明字符串保存和使用。": "Opaque channel user identifier.",
  "渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。":
    "Channel contact extensions, only when reliable values are available.",
  "渠道账号引用；渠道无法提供引用时可以省略该对象。":
    "Channel account reference; omit the object when unavailable.",
  "独立的资金业务状态，不与 runtime_status 混用；周期时间按 RFC 3339 UTC Z 返回。":
    "Financial business state, independent from runtime_status. Period timestamps use RFC3339 UTC Z.",
  "独立的选择响应消息；至少提供标识、已确认位置或显示文字之一。不要求必有原卡片引用。":
    "Independent selection-response message with at least an ID, confirmed position or text. An original-card reference is not required.",
  "生成 API Key 时使用的前缀。省略时使用默认前缀；不接受 null。":
    "API-key prefix; default applies only when omitted, not null.",
  "用于发送消息或定位会话的标识，请按不透明字符串保存和使用。":
    "Opaque messaging or conversation identifier.",
  "用于幂等处理的事件 ID。": "Event ID for idempotent processing.",
  "用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。":
    "The secret used to sign webhook deliveries. It is submitted only in requests and is never returned in responses.",
  "由支持该能力的渠道提供，通常仅适用于文本消息。":
    "Available only on supporting channels, usually for text messages.",
  "目前仅 WhatsApp 定义并返回该字段，表示配对时的登录平台标识，按不透明字符串透传。取值集合不封闭，客户端必须兼容未知值；其他渠道不定义该字段语义。该字段与 device_platform 不同。":
    "WhatsApp pairing platform identifier, an open opaque string distinct from device_platform. Accept unknown values; no semantics are defined for other channels.",
  "目标号码未被识别为有效 WhatsApp 联系人；message 以实际返回的原始原因为准，示例为无原因时的固定提示。":
    "Number not recognized as a valid WhatsApp contact; actual message may differ from the default example.",
  "目标工作区未开通内测时返回 beta_feature_not_enabled（41002）；当前 API Key 无权切换到目标工作区时仍返回原鉴权错误。":
    "403 beta_feature_not_enabled (41002) for a workspace without beta access; unauthorized workspace access retains its authentication error.",
  "目标工作区未开通内测时返回 beta_feature_not_enabled（41002）；当前 API Key 无权访问目标工作区时仍返回原鉴权错误。":
    "403 beta_feature_not_enabled (41002) without beta access; unauthorized access retains its authentication error.",
  "目标工作区未开通内测，无法调用通话接口或显式订阅 call.incoming、call.answered、call.ended。":
    "Workspace lacks beta access for call operations or explicit call.incoming/answered/ended subscriptions.",
  "目标帖子详情。": "Target post details.",
  "目标消息作者标识；缺省通常表示账号自身。":
    "The target message author's identifier. Omitting it usually refers to the account itself.",
  "目标账号所属渠道不支持该能力。": "The account's channel does not support this capability.",
  "相对于接入账号的发起方向；首期邀请为 inbound，接听和结束通知省略。":
    "Initiation direction relative to this account. Initial offers are inbound; accepted/ended omit it.",
  "相对静音时长，单位秒；0 表示永久静音。":
    "The relative mute duration in seconds. A value of `0` means muted indefinitely.",
  "相应渠道和账号范围内的不透明用户 ID，不要求特定渠道格式。":
    "Opaque user ID scoped to provider/account, without a required channel-specific format.",
  "省略 account_id 时只列当前工作空间的 Webhook 端点；指定时只列该账号的独立配置。 账号没有独立配置时 data 为 []，不混入继承的工作空间配置。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。":
    "Without account_id, lists workspace endpoints only; with it, lists that account's independent configuration only. No configuration returns data=[], without inherited endpoints. Missing/out-of-workspace accounts return 404 account_not_found (20020).",
  "省略时保留现有 metadata；传入空对象时只清空客户可写字段。 `account_quota`、`account_quota_unlimited` 与 `is_beta` 是服务端保留键，提交任一保留键返回 `400 invalid_request`；顶层提交 `is_beta` 同样拒绝。":
    "Omission preserves metadata; {} clears customer-writable fields only. account_quota/account_quota_unlimited/is_beta are reserved and return 400 invalid_request, including top-level is_beta.",
  "省略时发布一级评论；提供时表示回复目标帖子下的一级评论，不预先确认其所属帖子或层级。显式空串、纯空白、null 或非字符串均不合法。":
    "Omit to publish a first-level comment; otherwise reply to a first-level comment under the target post. Ownership/hierarchy is not prevalidated. Empty/blank/null/nonstring values are invalid.",
  "短期、一次性的 HTTPS 浏览器接听链接。": "Short-lived one-time HTTPS browser answer link.",
  "短期有效的 Provider 授权页面地址，其中包含不透明授权凭证。调用方应将其 作为敏感信息处理，不得写入公开日志或分享给无关用户。":
    "Short-lived hosted authorization URL with an opaque credential. Treat as sensitive; never publicly log or share with unrelated users.",
  "确认 Passkey 授权": "Confirm Passkey authorization",
  "确认当前账号授权流程中等待用户确认的 Passkey 挑战。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。":
    "Confirms a waiting Passkey challenge for WhatsApp qrcode accounts only. Unknown results retain passkey_confirmation_sent; retries do not confirm again unless the previous input was explicitly rejected. After authorization, explicitly start runtime if needed.",
  "稳定事件 ID；重复通知、重试和正文补全不会改变，接收方据此去重。":
    "Stable event ID across duplicate notices, retries and text completion; deduplicate with it.",
  "稳定的机器可读失败分类。": "Stable machine-readable failure classification.",
  "稳定的机器可读错误码。": "A stable, machine-readable error code.",
  "空字符串表示取消回应。": "An empty string removes the reaction.",
  "第三方字符串标识；按原值传递，不转换为数字。":
    "Third-party string ID; preserve it without numeric conversion.",
  等待扫描二维码: "Waiting for QR scan",
  "等待用户收到验证码后通过 /auth/code 提交；响应不包含用户的验证码。":
    "Wait for the user's verification code and submit through /auth/code; it is not included in this response.",
  "管理 Webhook 接收地址。": "Manage Webhook receiver endpoints.",
  "管理渠道账号资源。": "Manage channel accounts.",
  "管理渠道账号运行状态。": "Manage account runtime state.",
  管理群成员: "Manage group members",
  "素材获取失败，贴纸尚未发送": "Material retrieval failed; sticker not sent",
  给会话打标或移除标签: "Add or remove a conversation label",
  给消息加表情回应或取消回应: "Add or remove a message reaction",
  "统一消息发送与消息动作。": "Unified message sending and message actions.",
  "编辑后明确成为普通文本；业务方清除旧 link_preview 后合并实际提供的字段，缺省正文不捏造为空字符串。":
    "Explicit conversion to ordinary text: clear the old preview, then merge provided fields. Missing body must not be fabricated as empty.",
  编辑消息文本: "Edit message text",
  "缺少或无法校验 API Key。": "The API key is missing or cannot be validated.",
  置顶会话: "Pin a conversation",
  置顶或取消置顶消息: "Pin or unpin a message",
  群发言权限和邀请链接变化: "Group send permissions and invite-link changes",
  "群整体发言权限快照，仅来源明确提供时返回。缺失表示未知；false 表示普通成员可发言，不表示当前账号一定可发送。":
    "Known group-wide send permissions. Omitted means unknown; false permits ordinary members but does not prove this account can send.",
  "群消息的 @ 目标列表。`type=member` 使用对应 Provider 的成员 `id`； `type=all` 表示 @所有人，仅在 Provider 支持时生效，否则返回 `unsupported_message_type`。":
    "Group mentions. member uses the provider member ID; all mentions everyone only on supporting channels, otherwise unsupported_message_type.",
  "群组分页列表。": "A paginated list of groups.",
  "群组详情。": "Group details.",
  "联系人分页列表。": "A paginated list of contacts.",
  "联系人列表归属状态。": "Contact-list membership result.",
  联系人名片历史批次: "Historical contact cards",
  联系人名片接收: "Received contact cards",
  联系人名片编辑: "Edited contact cards",
  "联系人标识。": "Contact identifier.",
  "联系人标识。WhatsApp 账号请使用联系人接口返回的 LID，例如 `123456789012345@lid`。":
    "Contact ID; for WhatsApp use the LID returned by the contacts API.",
  "联系人自行在 WhatsApp 设置的个人名称。": "Contact's self-configured WhatsApp personal name.",
  "联系人详情。": "Contact details.",
  联系人通讯录名称更新事件: "Contact address-book name update",
  "自定义代理优先；清空后恢复账号创建时的默认配置。旧账号沿用原清空行为。":
    "Custom proxy takes priority. Clearing restores the creation-time default; legacy accounts retain prior clearing behavior.",
  "获取 webhook endpoint": "Get a webhook endpoint",
  获取会话详情: "Get conversation details",
  获取帖子详情: "Get post details",
  "获取当前 workspace": "Get the current workspace",
  获取群组详情: "Get group details",
  获取群邀请链接或邀请码: "Get a group invitation link or code",
  获取联系人详情: "Get contact details",
  获取账号授权状态: "Get account authorization status",
  获取账号详情: "Get account details",
  "补拉请求已受理，等待可用历史批次；不代表已收到消息或补拉完成。":
    "History request accepted; available batches are asynchronous and completion is not guaranteed.",
  "被操作的原消息 ID，在 provider、账号和会话范围内不透明；不是本次事件 ID。":
    "Opaque original message ID scoped to provider/account/conversation, not this event's ID.",
  "被编辑消息的 ID，与该消息原记录保持一致。": "Edited message ID, matching the original record.",
  解封联系人: "Unblock a contact",
  设置入群审批模式: "Set the group join approval mode",
  设置或清空联系人备注: "Set or clear a contact note",
  "该实时消息的发送设备编号，未知时省略。":
    "Realtime message's sending device number; omitted when unknown.",
  "该消息的 RFC3339 发送时间，Unix 秒值必须大于 0；不能使用事件 occurred_at 或当前时间代替。":
    "Message RFC3339 sent_at with Unix seconds >0; do not substitute occurred_at or current time.",
  "该消息相对于当前账号的收发方向；inbound 为接收，outbound 为发送。":
    "Direction relative to this account: inbound received, outbound sent.",
  "请求与当前资源状态冲突。": "The request conflicts with the current state of the resource.",
  "请求体或参数非法。": "The request body or parameters are invalid.",
  "请求体或参数非法；贴纸素材校验失败使用 provider_invalid_request 和 numeric_code=36007，message 提供具体原因，贴纸尚未发送。":
    "Invalid body/parameters. Invalid sticker material returns provider_invalid_request / 36007 with a reason before sending.",
  "请求参数有效，但目标会话不存在。": "Request valid, but the target conversation does not exist.",
  "请求字段或当前渠道的已读目标无效时返回 invalid_request（10000）；渠道拒绝参数时返回 provider_invalid_request（30001）。":
    "Invalid public/channel read targets return invalid_request (10000); channel parameter rejection returns provider_invalid_request (30001).",
  "请求数量，不保证实际返回相同数量；仅省略时默认 50，显式 null、0、非整数或超过 50 均返回 invalid_request。":
    "Requested count, not guaranteed result count. Default 50 only when omitted; null/zero/nonintegers/>50 return invalid_request.",
  请求补拉会话历史消息: "Request earlier conversation history",
  "账号不在当前工作空间（account_not_found，20020）；可靠确认帖子不存在时返回 post_not_found（39000）。":
    "Missing/out-of-workspace account: account_not_found (20020). Confirmed missing post: post_not_found (39000).",
  "账号不存在或不属于当前工作空间时返回 account_not_found（20020）。":
    "Missing/out-of-workspace account: account_not_found (20020).",
  "账号与 Provider 建立运行连接后投递。`runtime_status` 只使用平台标准值 `running`；Provider 原始值 `ready`、`online`、`connected` 等不会对外透传。":
    "Emitted after runtime connection. runtime_status uses standard running, never raw ready/online/connected values.",
  "账号事件中的失败原因，不代表回调 HTTP 投递失败。account_auth_failed / 20100：授权失败，具体原因未确定；按现有授权失败流程处理，不推断具体原因。 account_logged_out / 20101：当前登录态已失效；引导重新授权。 account_restricted / 20102：当前账号登录受限，不代表已确认封禁；到官方 WhatsApp 客户端检查并处理，恢复正常后再重新授权。":
    "Account failure, not HTTP delivery failure. account_auth_failed/20100 means unknown authorization failure; use the existing failure flow. account_logged_out/20101 requires reauthorization. account_restricted/20102 means current login restriction, not confirmed suspension; check the official WhatsApp app and recover before reauthorization.",
  账号公开资料更新事件: "Account public-profile update",
  "账号列表的不透明游标，省略或传入空字符串时读取第一页；续页原样回传上次响应的 data.next_cursor。 仅适用于签发时的 workspace。非法、重复传入或跨 workspace 使用时返回 400 invalid_request（numeric_code=10000）。":
    "Opaque workspace-bound account cursor. Omit or use an empty string for page one; return data.next_cursor unchanged. Invalid, duplicated or cross-workspace cursors return 400 invalid_request (10000).",
  "账号删除操作达到期望终态，无响应体。": "Deletion reached its terminal state; no response body.",
  "账号在渠道侧的资料。下列为标准字段，其他字段因渠道而异。":
    "Channel account profile. Standard fields are listed; extensions vary by provider.",
  "账号头像 URL。": "The account avatar URL.",
  "账号展示名称；WhatsApp 按 BusinessName 优先、PushName 回退的规则生成。":
    "Account display name; WhatsApp prefers BusinessName, falling back to PushName.",
  "账号已有活跃通话、尚未绑定节点或当前运行实例未就绪；遇到 38000 可先查询 GET /v1/calls/active，再按需调用 POST /v1/calls/{call_id}/hangup；也可等待当前通话结束或准备过期后重试。":
    "An active call exists or the account is not ready. For 38000, query GET /v1/calls/active and optionally POST /v1/calls/{call_id}/hangup, or wait for completion or preparation expiry.",
  "账号当前头像 URL；确认没有可用头像时返回空字符串。":
    "Current account avatar URL; empty confirms no available avatar.",
  "账号手机号，已归一化（去除空格、连字符、加号）。":
    "Normalized phone without spaces, hyphens or plus.",
  "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。":
    "Independent endpoint's public account ID; omitted for workspace endpoints, never null.",
  "账号的公开资料完成同步后投递。目前由 WhatsApp 名称或账号头像事件触发。 `display_name` 按 BusinessName 优先、PushName 回退的规则生成； `avatar_url` 为空表示当前确认没有可用头像；`changed_fields` 标识本次实际变化字段。 `source` 用于区分全量同步、当前账号主动改名与头像变化。":
    "Emitted after public profile synchronization, currently for WhatsApp name/avatar changes. display_name prefers BusinessName over PushName; empty avatar_url confirms no usable avatar. changed_fields lists actual changes; source distinguishes full sync, self rename and avatar changes.",
  "账号详情。": "Account details.",
  "账号资源状态，例如 active、inactive、disabled。":
    "The account resource status, for example `active`, `inactive`, or `disabled`.",
  "账号路径格式有效，但账号不存在或不属于当前工作空间，code 为 account_not_found，numeric_code 为 20020。":
    "Valid account path but missing/out-of-workspace account: account_not_found (20020).",
  账号运行态上线事件: "Account runtime connected",
  "账号运行态动作结果。": "The account runtime action result.",
  账号连接未建立: "Account is not connected",
  "账号选择的默认网络出口地区。": "Selected default network egress region.",
  "贴纸素材不符合要求，尚未发送": "Invalid sticker material; not sent",
  "资源不存在或路由不存在。": "The resource or route does not exist.",
  "身份公钥。": "Identity public key.",
  "身份私钥。": "Identity private key.",
  "轮换 API Key": "Rotate an API key",
  "轮换后返回新的完整 `api_key`，旧完整密钥不可恢复。":
    "Returns a new full `api_key` after rotation. The previous full key cannot be recovered.",
  "轮换成功。": "Rotated successfully.",
  "轮询二维码授权状态。普通二维码步骤通过 `auth_payload.qr_code` 返回二维码； WhatsApp 授权也可能进入 `passkey_required`，此时调用方应使用 `auth_payload.public_key` 发起 WebAuthn 操作，而不能继续把响应当作二维码。 渠道历史兼容字段可能随普通二维码结果一并返回，调用方应以 `status`、`auth_status` 和 `auth_payload` 标准字段为准。Passkey 结果不会把 Provider 原始 `code` 或 `info` 作为公共字段返回。 Provider 返回空状态且没有二维码或 Passkey 载荷时，平台不会用该空结果覆盖当前 Session。已有 `authorized`、`failed`、`cancelled`、`expired` 或 Passkey 状态按 当前快照返回；Provider 明确返回终态时会清除旧二维码和原始兼容载荷，不会回放 已失效的认证材料。没有可确认状态时返回 409 `provider_not_ready`。":
    "Polls QR authorization. Use auth_payload.qr_code for a QR; passkey_required instead requires WebAuthn with auth_payload.public_key. Prefer standard status/auth_status/auth_payload over legacy QR fields. A blank upstream result does not erase a known state. Terminal results clear obsolete QR materials; unavailable state returns 409 provider_not_ready. After WhatsApp authorization, call /runtime/start if still stopped or disconnected.",
  退出群组: "Leave a group",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 可精确订阅 `contact.updated`；省略订阅、空数组或 `*` 也会接收该新增事件。 仅修改 `data.contact.address_book` 中出现的保存名字段；空字符串表示清空，缺省保持原值，null 非法，不覆盖对方昵称或账号本人资料。 `changed_fields` 与实际提供的名称字段精确对应，不证明服务端已比对旧值。 `contact.id` 可关联联系人列表中同 ID 的资源，不能据此推算会话；可靠 `conversation_id` 缺失时仍可更新通讯录记录。WhatsApp 详情查询使用已确认的 conversation_id（LID），不能直接使用 PN 资源 ID。 WhatsApp 详情在已有 LID 与 PN 映射时可能返回不同的 PN 资源 ID；成功回查也不保证详情 id 与事件 contact.id 相同。保留原事件资源键，不用详情返回的 id 自动替换它或合并不同 PN/LID 记录。 `full_sync` 只表示收到的同步快照，不承诺完整通讯录、每次同步必有事件或同步完成通知。 按事件 ID 幂等；以可靠 changed_at 防止旧快照覆盖新名称。未知或同时间冲突不按接收顺序认定最新名称，occurred_at 不能代替 changed_at。":
    "WhatsApp only, excluding Protocol. contact.updated is included in explicit, omitted, empty and wildcard subscriptions. Update only supplied data.contact.address_book fields: empty strings clear, omitted values preserve, null is invalid. Do not overwrite personal nicknames or self profiles. changed_fields describes supplied fields, not a server-side old/new comparison. contact.id can associate the corresponding contact-list resource, not infer a conversation. Detail lookup uses a reliable LID conversation_id; returned PN IDs may differ, so preserve the event resource key and do not automatically merge PN/LID records. full_sync is a received snapshot, not guaranteed complete address-book synchronization. Deduplicate by event ID. Use reliable changed_at for ordering; unknown/equal-time conflicts cannot be resolved by arrival order or occurred_at.",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用 `message.updated`，`data.message.id` 是被操作的原消息 ID，`data.event.change_type=message_pin`。 `message.pin` 是本次置顶状态快照：每次整体替换该对象，缺失有效期也清除旧有效期；消息其他字段仍按稀疏更新处理。 `pinned=false` 明确取消置顶，不提供时长或有效期。`duration_seconds=0` 不代表永久置顶。 `expires_at` 仅在提供可靠 `changed_at` 和正时长时存在；不能用收到回调的时间重新计算有效期。 `actor` 是操作者，`sender` 仅在原消息作者可靠时提供，两者未知时省略；不提供原消息类型、方向、正文或发送时间。 原消息尚未保存也可收到更新，按目标消息 ID 暂存。到期不保证收到新的取消事件；历史消息不提供置顶状态快照。 本事件与会话置顶分开；既有 `POST /v1/messages/pin` 的路径、支持范围及响应不变，调用成功不保证产生本回调。":
    "WhatsApp only, excluding Protocol. Uses message.updated with the original message.id and event.change_type=message_pin. Replace the complete pin snapshot, including clearing omitted expiry; other message fields remain sparse updates. pinned=false unpins without duration/expiry; duration_seconds=0 is not permanent. expires_at requires reliable changed_at plus positive duration, never receipt time. actor is the operator; sender is the reliable original author. Missing identities are omitted. Original type/direction/body/sent_at are not supplied. Updates can precede message creation; retain pending association. Expiry does not guarantee an unpin event, and history has no pin snapshots. This is separate from conversation pinning; POST /v1/messages/pin support is unchanged and success does not guarantee this callback.",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`。 复用已有 `conversation.updated`；`data.event.change_type=disappearing_messages`，不新增订阅名称或设置写接口。 `disappearing_messages` 是本次完整设置快照，整体替换该对象；会话其他资料不受影响。 开启时 `enabled=true` 且 `duration_seconds` 为正数；关闭时明确提供 `enabled=false` 和 `duration_seconds=0`，缺失不表示关闭。 操作者与可靠 `changed_at` 未知时省略；`occurred_at` 不保证是可靠操作时间，不可代替它判断新旧。 按事件 ID 幂等，同值快照也可能来自不同事件。乱序使用可靠 changed_at；未知或同时间冲突不能按回调接收顺序推断最新设置。 同次操作可能另有群变化通知，应分别处理；历史消息不重放设置更新，也不保证提供当前设置快照。 设置变化不删除已有消息或业务系统副本，不提供逐消息到期时间、自动删除通知或定时器。":
    "WhatsApp only, excluding Protocol. Uses conversation.updated with event.change_type=disappearing_messages, without a new subscription/write API. Replace the complete disappearing_messages snapshot only. Enabled means true with positive seconds; disabled means false with zero. Omission does not disable. Unknown actor/changed_at are omitted; occurred_at is not an ordering substitute. Deduplicate events and retain unresolved ordering conflicts. Other group notifications are separate. History does not replay settings or guarantee a current snapshot. This does not delete stored messages/copies or provide per-message expiry/deletion events/timers.",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`；仅接收，不新增发送类型、模板注册或事件订阅名称。 卡片与响应分别为 `interactive/interactive_response`，可与可选 `referral` 共存。 WhatsApp 当前不提供 `index/selected_index`；使用可靠 ID 及实际提供的引用关联，不能按标题或最近消息猜测。 复用 `conversation.history`；`data.messages[]` 是扁平数组，可混合交互、商品、订单和普通消息。 按 provider、account_id、会话 ID 和消息 ID 关联，批次时间不替代消息的 sent_at。":
    "WhatsApp only, excluding Protocol. Receive-only interactive/interactive_response, optionally with referral. No template registration or new subscriptions. WhatsApp supplies no index/selected_index; use reliable IDs/references. conversation.history has flat arrays mixed with commerce/ordinary messages. Associate by provider/account/conversation/message IDs, not batch time.",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`；仅接收，不新增发送类型、模板注册或事件订阅名称。 卡片与响应分别为 `interactive/interactive_response`，可与可选 `referral` 共存。 WhatsApp 当前不提供 `index/selected_index`；使用可靠 ID 及实际提供的引用关联，不能按标题或最近消息猜测。 复用 `message.received`。WhatsApp 交互消息依赖原消息 ID；顶层事件 ID 仅用于事件去重。 缺少媒体 URL 或部分组件不丢其他有效信息；未知交互变体不承诺为本类型。":
    "WhatsApp only, excluding Protocol. Receive-only interactive/interactive_response types; no new send/template/subscription capability. Optional referral may coexist. WhatsApp provides no index/selected_index; associate by reliable IDs/references, never titles or nearest messages. Uses message.received and native message IDs; event IDs are for deduplication. Missing media URLs/components do not discard other valid content. Unknown variants are not guaranteed.",
  "适用于 `provider=whatsapp`，不包含 `whatsapp-protocol`；仅接收，不新增发送类型、模板注册或事件订阅名称。 卡片与响应分别为 `interactive/interactive_response`，可与可选 `referral` 共存。 WhatsApp 当前不提供 `index/selected_index`；使用可靠 ID 及实际提供的引用关联，不能按标题或最近消息猜测。 复用 `message.updated`，`data.message.id` 是被编辑消息的非空 ID。 仅合并本次提供的字段；嵌套对象逐字段合并，buttons 若提供则整体替换有序数组，缺失不清空。":
    "WhatsApp only, excluding Protocol. Receive-only interactive/interactive_response, optionally with referral. No template registration or new subscriptions. WhatsApp supplies no index/selected_index; use reliable IDs/references, not titles or proximity. Uses message.updated with the original nonempty ID. Merge supplied nested fields; provided buttons replace the complete ordered array, omission preserves it.",
  "选项原始标题，发送时不 trim、不改大小写或 Unicode 形式。":
    "Original option title; no trimming, case conversion or Unicode normalization.",
  "通讯录保存全名；允许空字符串表示清空。": "Saved full contact name; empty explicitly clears it.",
  "通讯录保存名字；允许空字符串表示清空。": "Saved first contact name; empty explicitly clears it.",
  "通话不存在或不属于该账号，错误码 call_not_found / 38003；账号不存在仍沿用 account_not_found。":
    "Call missing or owned by another account: call_not_found / 38003. Missing accounts retain account_not_found.",
  "通话准备失败或发生内部处理错误。": "Call preparation or processing failed.",
  通话已接听事件: "Call answered event",
  通话已结束事件: "Call ended event",
  "通话挂断失败，错误码 call_control_failed / 38004。":
    "Hangup failed: call_control_failed / 38004.",
  "通话服务不可用，错误码 call_service_unavailable / 38001。":
    "Call service unavailable: call_service_unavailable / 38001.",
  "通话服务当前不可用，稍后重试；未知渠道故障仍使用既有 502 分类。":
    "Call service temporarily unavailable. Unknown channel failures retain the existing 502 classification.",
  "通话查询失败，错误码 call_control_failed / 38004。":
    "Call query failed: call_control_failed / 38004.",
  "通话消息记录 ID；邀请、接听和结束保持一致，仅用于记录关联，不代表支持原生消息操作。":
    "Stable record ID across invitation/acceptance/end, for association only, not native message operations.",
  "邀请信息。": "Invitation details.",
  "邀请链接缓存失效信号；不携带链接或邀请码，应调用现有群邀请链接查询获取当前值。":
    "Invite-link cache invalidation only, without a link/code. Query the current group invite link.",
  重连账号运行态: "Reconnect account runtime",
  "金额与币种按各自是否提供分别输出；缺失不补零或默认币种，两者均未知时省略整个对象。":
    "Amount/currency are independently optional; do not default to zero/currency. Omit when both unknown.",
  "钱包服务暂不可用，wallet_unavailable（20028）。":
    "Wallet temporarily unavailable: wallet_unavailable (20028).",
  "链接预览发送结构；不能与媒体、名片或其他消息载荷字段混用。渠道支持范围和附加限制见发送接口说明。":
    "Link-preview payload, mutually exclusive with media/contact/other payload fields. See channel support and additional restrictions in sendMessage.",
  链接预览消息接收事件: "Received link-preview message",
  链接预览消息编辑及转普通文本事件: "Edited preview or conversion to text",
  "链接预览请求已接受，不代表送达或自同步回调已发生":
    "Preview accepted; delivery and self-sync are not confirmed",
  "需要完成 Passkey 验证": "Passkey verification required",
  静音会话: "Mute a conversation",
  "非空白正文，保留原文，不自动删除首尾空格。":
    "Nonblank original text; leading/trailing spaces are preserved.",
  "面向开发者的错误说明，不建议作为客户端分支依据。 numeric_code=30010 时，有原始原因则为 Provider operation failed: <原始错误原因>，没有则为 Provider operation failed。 numeric_code=30021 时保留原始连接错误，原因缺失时为 Account is not connected to the messaging platform。 numeric_code=34012 时为 Group administrator privileges are required to send messages to this group，表示当前账号的群消息发送被明确拒绝为需要管理员权限，不反推群类型、具体群设置或账号角色。 numeric_code=35009 时保留完整原始原因，不增加前缀；原因缺失时为 Target phone number was not recognized as an active WhatsApp contact。 numeric_code=36007 时提供具体贴纸素材校验原因，原因缺失时为 Invalid sticker media。 贴纸素材准备失败及实际发送失败保留既有错误分类和专属提示，并提供可用的具体失败原因；原因缺失时沿用默认提示。 这些细分原因保留所在接口既有的 HTTP 状态和 code；调用方应按 numeric_code 判断，不依赖可变化的文案。":
    "Developer-facing explanation; do not branch on mutable text. 30010 may include an original operation reason. 30021 preserves a connection reason or a default disconnection message. 34012 indicates admin privileges required without proving group type/settings/role. 35009 preserves an original contact reason or a default unrecognized-number message. 36007 describes invalid sticker material. Sticker preparation/send failures retain their original classifications and available reasons. Branch on numeric_code while preserving HTTP/code semantics.",
  "音频或视频时长，单位为秒。仅适用于使用 WhatsApp 账号发送的 `audio` 或 `video` 消息；发送 `video` 时取值范围为 0 到 4294967295（uint32）。":
    "Audio/video duration in seconds, for WhatsApp audio/video only. Video range is uint32: 0-4294967295.",
  "音频波形数据。仅适用于使用 WhatsApp 账号发送的 `audio` 消息。 非空值必须使用标准 Base64 编码，且解码后必须是可解析的 JSON 波形数据；空字符串按未提供处理，其他格式错误返回 HTTP 400 `provider_invalid_request`。":
    "WhatsApp audio waveform. Nonempty input must be standard Base64 decoding to valid JSON waveform data. Empty means omitted; invalid format returns 400 provider_invalid_request.",
  "题目和选项标题保留原文；max_selections 必须是 1 到选项数量之间的整数，不表示投票人数。1.0、1e0 等整数数值与 1 等价，非整数非法。公共结构不限制题目长度、最大选项数量或标题重复；具体渠道可有额外限制。":
    "Preserve question/option text. max_selections is an integer 1..option count, not voter count. Integer numeric forms such as 1.0/1e0 equal 1. Public schema does not impose question length, maximum options or title uniqueness; channels can add limits.",
  "首期仅支持 WhatsApp 单聊通话消息。": "Initially WhatsApp one-to-one call records only.",
  "验证码授权启动结果；按渠道区分手机号配对与验证码提交。":
    "Code-authorization start result; distinguish phone pairing from verification-code submission.",
  "黑名单列表。": "A list of blocked contacts."
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
