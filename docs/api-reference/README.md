<!-- 此文件由 pnpm generate 生成；修改公开契约或生成器后重新生成。 -->

# Device API Reference

本 Reference 由 `contracts/device.openapi.yaml` 自动生成，当前包含 64 个 operation。
每个 operation 都提供参数、请求体、响应和 TypeScript 调用示例。
字段说明严格来自公开契约；`-` 表示契约尚未提供额外说明，不根据实现推测。

示例默认已有配置完成的 `UnifyPortDeviceClient` 实例 `device`。API key 只在 client 初始化时提供，
不会出现在 operation 参数中。

```ts
import { UnifyPortDeviceClient } from "@unifyport/sdk-node";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const device = new UnifyPortDeviceClient({
  baseUrl: requiredEnv("UNIFYPORT_DEVICE_API_BASE_URL"),
  apiKey: requiredEnv("UNIFYPORT_DEVICE_API_KEY")
});
```

## 分组

### Workspace

当前 API Key 所属 workspace。

| operationId                                        | Method | Path            | 说明               |
| -------------------------------------------------- | ------ | --------------- | ------------------ |
| [`getWorkspace`](workspace.md#get-workspace)       | GET    | `/v1/workspace` | 获取当前 workspace |
| [`updateWorkspace`](workspace.md#update-workspace) | PATCH  | `/v1/workspace` | 更新当前 workspace |

### API Keys

workspace API Key 管理。

| operationId                                               | Method | Path                           | 说明              |
| --------------------------------------------------------- | ------ | ------------------------------ | ----------------- |
| [`createApiKey`](api-keys.md#create-api-key)              | POST   | `/v1/api-keys`                 | 创建 API Key      |
| [`listApiKeys`](api-keys.md#list-api-keys)                | GET    | `/v1/api-keys`                 | 列出 API Key      |
| [`rotateApiKey`](api-keys.md#rotate-api-key)              | POST   | `/v1/api-keys/{key_id}/rotate` | 轮换 API Key      |
| [`updateApiKeyStatus`](api-keys.md#update-api-key-status) | PATCH  | `/v1/api-keys/{key_id}`        | 更新 API Key 状态 |

### Providers

provider 元数据查询。

| operationId                                                 | Method | Path                               | 说明                     |
| ----------------------------------------------------------- | ------ | ---------------------------------- | ------------------------ |
| [`listProviderRegions`](providers.md#list-provider-regions) | GET    | `/v1/providers/{provider}/regions` | 查询 provider 地区可用性 |

### Accounts

provider 账号资源管理。

| operationId                                   | Method | Path                        | 说明         |
| --------------------------------------------- | ------ | --------------------------- | ------------ |
| [`createAccount`](accounts.md#create-account) | POST   | `/v1/accounts`              | 创建账号     |
| [`deleteAccount`](accounts.md#delete-account) | DELETE | `/v1/accounts/{account_id}` | 删除账号     |
| [`getAccount`](accounts.md#get-account)       | GET    | `/v1/accounts/{account_id}` | 获取账号详情 |
| [`listAccounts`](accounts.md#list-accounts)   | GET    | `/v1/accounts`              | 列出账号     |
| [`updateAccount`](accounts.md#update-account) | PATCH  | `/v1/accounts/{account_id}` | 更新账号     |

### Account Auth

provider 账号授权流程。

| operationId                                                                 | Method | Path                                      | 说明               |
| --------------------------------------------------------------------------- | ------ | ----------------------------------------- | ------------------ |
| [`cancelAccountAuth`](account-auth.md#cancel-account-auth)                  | POST   | `/v1/accounts/{account_id}/auth/cancel`   | 取消授权流程       |
| [`checkAccountQrAuth`](account-auth.md#check-account-qr-auth)               | POST   | `/v1/accounts/{account_id}/auth/qr/check` | 检查二维码授权结果 |
| [`getAccountAuthState`](account-auth.md#get-account-auth-state)             | GET    | `/v1/accounts/{account_id}/auth`          | 获取账号授权状态   |
| [`importAccountAuthSession`](account-auth.md#import-account-auth-session)   | POST   | `/v1/accounts/{account_id}/auth/session`  | 导入会话授权       |
| [`startAccountAuth`](account-auth.md#start-account-auth)                    | POST   | `/v1/accounts/{account_id}/auth/start`    | 启动验证码类授权   |
| [`startAccountQrAuth`](account-auth.md#start-account-qr-auth)               | POST   | `/v1/accounts/{account_id}/auth/qr/start` | 启动二维码授权     |
| [`submitAccountAuthCode`](account-auth.md#submit-account-auth-code)         | POST   | `/v1/accounts/{account_id}/auth/code`     | 提交验证码         |
| [`submitAccountAuthPassword`](account-auth.md#submit-account-auth-password) | POST   | `/v1/accounts/{account_id}/auth/password` | 提交二次密码       |

### Account Runtime

provider 账号运行态控制。

| operationId                                                               | Method | Path                                          | 说明           |
| ------------------------------------------------------------------------- | ------ | --------------------------------------------- | -------------- |
| [`reconnectAccountRuntime`](account-runtime.md#reconnect-account-runtime) | POST   | `/v1/accounts/{account_id}/runtime/reconnect` | 重连账号运行态 |
| [`refreshAccountRuntime`](account-runtime.md#refresh-account-runtime)     | POST   | `/v1/accounts/{account_id}/runtime/refresh`   | 刷新账号运行态 |
| [`startAccountRuntime`](account-runtime.md#start-account-runtime)         | POST   | `/v1/accounts/{account_id}/runtime/start`     | 启动账号运行态 |
| [`stopAccountRuntime`](account-runtime.md#stop-account-runtime)           | POST   | `/v1/accounts/{account_id}/runtime/stop`      | 停止账号运行态 |

### Conversations

会话列表、详情、成员、读写状态、静音、置顶与标签。

| operationId                                                                      | Method | Path                                                    | 说明                 |
| -------------------------------------------------------------------------------- | ------ | ------------------------------------------------------- | -------------------- |
| [`deleteConversationLabel`](conversations.md#delete-conversation-label)          | POST   | `/v1/accounts/{account_id}/conversations/labels/delete` | 删除会话标签         |
| [`getConversation`](conversations.md#get-conversation)                           | GET    | `/v1/accounts/{account_id}/conversations/info`          | 获取会话详情         |
| [`listConversationLabels`](conversations.md#list-conversation-labels)            | GET    | `/v1/accounts/{account_id}/conversations/labels`        | 列出会话标签         |
| [`listConversationMembers`](conversations.md#list-conversation-members)          | GET    | `/v1/accounts/{account_id}/conversations/members`       | 列出会话成员         |
| [`listConversations`](conversations.md#list-conversations)                       | GET    | `/v1/accounts/{account_id}/conversations`               | 列出会话             |
| [`markConversationRead`](conversations.md#mark-conversation-read)                | POST   | `/v1/accounts/{account_id}/conversations/read`          | 标记会话已读         |
| [`markConversationUnread`](conversations.md#mark-conversation-unread)            | POST   | `/v1/accounts/{account_id}/conversations/unread`        | 标记会话未读         |
| [`muteConversation`](conversations.md#mute-conversation)                         | POST   | `/v1/accounts/{account_id}/conversations/mute`          | 静音会话             |
| [`pinConversation`](conversations.md#pin-conversation)                           | POST   | `/v1/accounts/{account_id}/conversations/pin`           | 置顶会话             |
| [`setConversationLabelMembers`](conversations.md#set-conversation-label-members) | POST   | `/v1/accounts/{account_id}/conversations/labels`        | 给会话打标或移除标签 |
| [`unmuteConversation`](conversations.md#unmute-conversation)                     | POST   | `/v1/accounts/{account_id}/conversations/unmute`        | 取消静音会话         |
| [`unpinConversation`](conversations.md#unpin-conversation)                       | POST   | `/v1/accounts/{account_id}/conversations/unpin`         | 取消置顶会话         |
| [`upsertConversationLabel`](conversations.md#upsert-conversation-label)          | POST   | `/v1/accounts/{account_id}/conversations/labels/upsert` | 新建或更新会话标签   |

### Contacts

provider 联系人视图与联系人动作。

| operationId                                                  | Method | Path                                           | 说明                 |
| ------------------------------------------------------------ | ------ | ---------------------------------------------- | -------------------- |
| [`blockContact`](contacts.md#block-contact)                  | POST   | `/v1/accounts/{account_id}/contacts/block`     | 封锁联系人           |
| [`getContact`](contacts.md#get-contact)                      | GET    | `/v1/accounts/{account_id}/contacts/info`      | 获取联系人详情       |
| [`listContactBlocklist`](contacts.md#list-contact-blocklist) | GET    | `/v1/accounts/{account_id}/contacts/blocklist` | 查询联系人黑名单     |
| [`listContacts`](contacts.md#list-contacts)                  | GET    | `/v1/accounts/{account_id}/contacts`           | 列出联系人           |
| [`setContactNote`](contacts.md#set-contact-note)             | POST   | `/v1/accounts/{account_id}/contacts/note`      | 设置或清空联系人备注 |
| [`unblockContact`](contacts.md#unblock-contact)              | POST   | `/v1/accounts/{account_id}/contacts/unblock`   | 解封联系人           |

### Groups

provider 群组视图与群组动作。

| operationId                                                          | Method | Path                                                    | 说明                   |
| -------------------------------------------------------------------- | ------ | ------------------------------------------------------- | ---------------------- |
| [`createGroup`](groups.md#create-group)                              | POST   | `/v1/accounts/{account_id}/groups/create`               | 创建群组               |
| [`getGroup`](groups.md#get-group)                                    | GET    | `/v1/accounts/{account_id}/groups/info`                 | 获取群组详情           |
| [`getGroupInviteCode`](groups.md#get-group-invite-code)              | GET    | `/v1/accounts/{account_id}/groups/invite-code`          | 获取群邀请链接或邀请码 |
| [`leaveGroup`](groups.md#leave-group)                                | POST   | `/v1/accounts/{account_id}/groups/leave`                | 退出群组               |
| [`listGroupJoinRequests`](groups.md#list-group-join-requests)        | GET    | `/v1/accounts/{account_id}/groups/join-requests`        | 列出待审批入群申请     |
| [`listGroups`](groups.md#list-groups)                                | GET    | `/v1/accounts/{account_id}/groups`                      | 列出群组               |
| [`setGroupJoinApprovalMode`](groups.md#set-group-join-approval-mode) | POST   | `/v1/accounts/{account_id}/groups/join-approval-mode`   | 设置入群审批模式       |
| [`updateGroupInfo`](groups.md#update-group-info)                     | POST   | `/v1/accounts/{account_id}/groups/update-info`          | 修改群信息             |
| [`updateGroupJoinRequests`](groups.md#update-group-join-requests)    | POST   | `/v1/accounts/{account_id}/groups/join-requests/update` | 处理入群申请           |
| [`updateGroupMembers`](groups.md#update-group-members)               | POST   | `/v1/accounts/{account_id}/groups/members`              | 管理群成员             |

### Messages

统一消息发送与消息动作。

| operationId                                   | Method | Path                    | 说明                       |
| --------------------------------------------- | ------ | ----------------------- | -------------------------- |
| [`editMessage`](messages.md#edit-message)     | POST   | `/v1/messages/edit`     | 编辑消息文本               |
| [`pinMessage`](messages.md#pin-message)       | POST   | `/v1/messages/pin`      | 置顶或取消置顶消息         |
| [`reactMessage`](messages.md#react-message)   | POST   | `/v1/messages/reaction` | 给消息加表情回应或取消回应 |
| [`revokeMessage`](messages.md#revoke-message) | POST   | `/v1/messages/revoke`   | 撤回消息                   |
| [`sendMessage`](messages.md#send-message)     | POST   | `/v1/messages`          | 发送消息                   |

### Webhook Endpoints

业务 webhook endpoint 管理。

| operationId                                                                     | Method | Path                                             | 说明                  |
| ------------------------------------------------------------------------------- | ------ | ------------------------------------------------ | --------------------- |
| [`createWebhookEndpoint`](webhook-endpoints.md#create-webhook-endpoint)         | POST   | `/v1/webhook-endpoints`                          | 创建 webhook endpoint |
| [`deactivateWebhookEndpoint`](webhook-endpoints.md#deactivate-webhook-endpoint) | POST   | `/v1/webhook-endpoints/{endpoint_id}/deactivate` | 停用 webhook endpoint |
| [`deleteWebhookEndpoint`](webhook-endpoints.md#delete-webhook-endpoint)         | DELETE | `/v1/webhook-endpoints/{endpoint_id}`            | 删除 webhook endpoint |
| [`getWebhookEndpoint`](webhook-endpoints.md#get-webhook-endpoint)               | GET    | `/v1/webhook-endpoints/{endpoint_id}`            | 获取 webhook endpoint |
| [`listWebhookEndpoints`](webhook-endpoints.md#list-webhook-endpoints)           | GET    | `/v1/webhook-endpoints`                          | 列出 webhook endpoint |
| [`updateWebhookEndpoint`](webhook-endpoints.md#update-webhook-endpoint)         | PATCH  | `/v1/webhook-endpoints/{endpoint_id}`            | 更新 webhook endpoint |

## 维护方式

这些页面不手工编辑。API 变更应先更新经批准的
[Device OpenAPI 契约](../../contracts/device.openapi.yaml)，再运行：

```bash
pnpm generate
pnpm generate:check
pnpm typecheck
```

同一生成过程还会更新 API 覆盖表和 TypeScript 示例校验文件；示例与 SDK 类型不一致时，
`pnpm typecheck` 会失败。
