<!-- 此文件由 pnpm generate 生成；修改契约或生成器后重新生成。 -->
# API 覆盖率

本表把 Device API 的每个 `operationId` 映射到 SDK 显式方法和 MCP 暴露策略。`never` 表示该 operation 仍由 SDK 支持，但因权限或 secret 边界不进入模型工具面。

| API | operationId | Method | Path | SDK | MCP policy | Retry | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| device | [`blockContact`](api-reference/contacts.md#block-contact) | POST | `/v1/accounts/{account_id}/contacts/block` | explicit | never | never | - |
| device | [`cancelAccountAuth`](api-reference/account-auth.md#cancel-account-auth) | POST | `/v1/accounts/{account_id}/auth/cancel` | explicit | never | never | - |
| device | [`checkAccountQrAuth`](api-reference/account-auth.md#check-account-qr-auth) | POST | `/v1/accounts/{account_id}/auth/qr/check` | explicit | never | never | secret output |
| device | [`createAccount`](api-reference/accounts.md#create-account) | POST | `/v1/accounts` | explicit | never | never | secret input |
| device | [`createApiKey`](api-reference/api-keys.md#create-api-key) | POST | `/v1/api-keys` | explicit | never | never | secret output |
| device | [`createGroup`](api-reference/groups.md#create-group) | POST | `/v1/accounts/{account_id}/groups/create` | explicit | never | never | - |
| device | [`createWebhookEndpoint`](api-reference/webhook-endpoints.md#create-webhook-endpoint) | POST | `/v1/webhook-endpoints` | explicit | never | never | secret input |
| device | [`deactivateWebhookEndpoint`](api-reference/webhook-endpoints.md#deactivate-webhook-endpoint) | POST | `/v1/webhook-endpoints/{endpoint_id}/deactivate` | explicit | never | never | - |
| device | [`deleteAccount`](api-reference/accounts.md#delete-account) | DELETE | `/v1/accounts/{account_id}` | explicit | never | never | - |
| device | [`deleteConversationLabel`](api-reference/conversations.md#delete-conversation-label) | POST | `/v1/accounts/{account_id}/conversations/labels/delete` | explicit | never | never | - |
| device | [`deleteWebhookEndpoint`](api-reference/webhook-endpoints.md#delete-webhook-endpoint) | DELETE | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | never | - |
| device | [`editMessage`](api-reference/messages.md#edit-message) | POST | `/v1/messages/edit` | explicit | never | never | - |
| device | [`getAccount`](api-reference/accounts.md#get-account) | GET | `/v1/accounts/{account_id}` | explicit | never | safe | secret output |
| device | [`getAccountAuthState`](api-reference/account-auth.md#get-account-auth-state) | GET | `/v1/accounts/{account_id}/auth` | explicit | never | safe | secret output |
| device | [`getContact`](api-reference/contacts.md#get-contact) | GET | `/v1/accounts/{account_id}/contacts/info` | explicit | never | safe | - |
| device | [`getConversation`](api-reference/conversations.md#get-conversation) | GET | `/v1/accounts/{account_id}/conversations/info` | explicit | never | safe | - |
| device | [`getGroup`](api-reference/groups.md#get-group) | GET | `/v1/accounts/{account_id}/groups/info` | explicit | never | safe | - |
| device | [`getGroupInviteCode`](api-reference/groups.md#get-group-invite-code) | GET | `/v1/accounts/{account_id}/groups/invite-code` | explicit | never | safe | secret output |
| device | [`getWebhookEndpoint`](api-reference/webhook-endpoints.md#get-webhook-endpoint) | GET | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | safe | - |
| device | [`getWorkspace`](api-reference/workspace.md#get-workspace) | GET | `/v1/workspace` | explicit | read | safe | - |
| device | [`importAccountAuthSession`](api-reference/account-auth.md#import-account-auth-session) | POST | `/v1/accounts/{account_id}/auth/session` | explicit | never | never | secret input |
| device | [`leaveGroup`](api-reference/groups.md#leave-group) | POST | `/v1/accounts/{account_id}/groups/leave` | explicit | never | never | - |
| device | [`listAccounts`](api-reference/accounts.md#list-accounts) | GET | `/v1/accounts` | explicit | never | safe | - |
| device | [`listApiKeys`](api-reference/api-keys.md#list-api-keys) | GET | `/v1/api-keys` | explicit | read | safe | - |
| device | [`listContactBlocklist`](api-reference/contacts.md#list-contact-blocklist) | GET | `/v1/accounts/{account_id}/contacts/blocklist` | explicit | never | safe | - |
| device | [`listContacts`](api-reference/contacts.md#list-contacts) | GET | `/v1/accounts/{account_id}/contacts` | explicit | never | safe | - |
| device | [`listConversationLabels`](api-reference/conversations.md#list-conversation-labels) | GET | `/v1/accounts/{account_id}/conversations/labels` | explicit | never | safe | - |
| device | [`listConversationMembers`](api-reference/conversations.md#list-conversation-members) | GET | `/v1/accounts/{account_id}/conversations/members` | explicit | never | safe | - |
| device | [`listConversations`](api-reference/conversations.md#list-conversations) | GET | `/v1/accounts/{account_id}/conversations` | explicit | never | safe | - |
| device | [`listGroupJoinRequests`](api-reference/groups.md#list-group-join-requests) | GET | `/v1/accounts/{account_id}/groups/join-requests` | explicit | never | safe | - |
| device | [`listGroups`](api-reference/groups.md#list-groups) | GET | `/v1/accounts/{account_id}/groups` | explicit | never | safe | - |
| device | [`listProviderRegions`](api-reference/providers.md#list-provider-regions) | GET | `/v1/providers/{provider}/regions` | explicit | read | safe | - |
| device | [`listWebhookEndpoints`](api-reference/webhook-endpoints.md#list-webhook-endpoints) | GET | `/v1/webhook-endpoints` | explicit | never | safe | - |
| device | [`markConversationRead`](api-reference/conversations.md#mark-conversation-read) | POST | `/v1/accounts/{account_id}/conversations/read` | explicit | never | never | - |
| device | [`markConversationUnread`](api-reference/conversations.md#mark-conversation-unread) | POST | `/v1/accounts/{account_id}/conversations/unread` | explicit | never | never | - |
| device | [`muteConversation`](api-reference/conversations.md#mute-conversation) | POST | `/v1/accounts/{account_id}/conversations/mute` | explicit | never | never | - |
| device | [`pinConversation`](api-reference/conversations.md#pin-conversation) | POST | `/v1/accounts/{account_id}/conversations/pin` | explicit | never | never | - |
| device | [`pinMessage`](api-reference/messages.md#pin-message) | POST | `/v1/messages/pin` | explicit | never | never | - |
| device | [`reactMessage`](api-reference/messages.md#react-message) | POST | `/v1/messages/reaction` | explicit | never | never | - |
| device | [`reconnectAccountRuntime`](api-reference/account-runtime.md#reconnect-account-runtime) | POST | `/v1/accounts/{account_id}/runtime/reconnect` | explicit | never | never | - |
| device | [`refreshAccountRuntime`](api-reference/account-runtime.md#refresh-account-runtime) | POST | `/v1/accounts/{account_id}/runtime/refresh` | explicit | never | never | - |
| device | [`revokeMessage`](api-reference/messages.md#revoke-message) | POST | `/v1/messages/revoke` | explicit | never | never | - |
| device | [`rotateApiKey`](api-reference/api-keys.md#rotate-api-key) | POST | `/v1/api-keys/{key_id}/rotate` | explicit | never | never | secret output |
| device | [`sendMessage`](api-reference/messages.md#send-message) | POST | `/v1/messages` | explicit | never | never | secret input |
| device | [`setContactNote`](api-reference/contacts.md#set-contact-note) | POST | `/v1/accounts/{account_id}/contacts/note` | explicit | never | never | - |
| device | [`setConversationLabelMembers`](api-reference/conversations.md#set-conversation-label-members) | POST | `/v1/accounts/{account_id}/conversations/labels` | explicit | never | never | - |
| device | [`setGroupJoinApprovalMode`](api-reference/groups.md#set-group-join-approval-mode) | POST | `/v1/accounts/{account_id}/groups/join-approval-mode` | explicit | never | never | - |
| device | [`startAccountAuth`](api-reference/account-auth.md#start-account-auth) | POST | `/v1/accounts/{account_id}/auth/start` | explicit | never | never | secret output |
| device | [`startAccountQrAuth`](api-reference/account-auth.md#start-account-qr-auth) | POST | `/v1/accounts/{account_id}/auth/qr/start` | explicit | never | never | secret output |
| device | [`startAccountRuntime`](api-reference/account-runtime.md#start-account-runtime) | POST | `/v1/accounts/{account_id}/runtime/start` | explicit | never | never | - |
| device | [`stopAccountRuntime`](api-reference/account-runtime.md#stop-account-runtime) | POST | `/v1/accounts/{account_id}/runtime/stop` | explicit | never | never | - |
| device | [`submitAccountAuthCode`](api-reference/account-auth.md#submit-account-auth-code) | POST | `/v1/accounts/{account_id}/auth/code` | explicit | never | never | secret input |
| device | [`submitAccountAuthPassword`](api-reference/account-auth.md#submit-account-auth-password) | POST | `/v1/accounts/{account_id}/auth/password` | explicit | never | never | secret input |
| device | [`unblockContact`](api-reference/contacts.md#unblock-contact) | POST | `/v1/accounts/{account_id}/contacts/unblock` | explicit | never | never | - |
| device | [`unmuteConversation`](api-reference/conversations.md#unmute-conversation) | POST | `/v1/accounts/{account_id}/conversations/unmute` | explicit | never | never | - |
| device | [`unpinConversation`](api-reference/conversations.md#unpin-conversation) | POST | `/v1/accounts/{account_id}/conversations/unpin` | explicit | never | never | - |
| device | [`updateAccount`](api-reference/accounts.md#update-account) | PATCH | `/v1/accounts/{account_id}` | explicit | never | never | secret input |
| device | [`updateApiKeyStatus`](api-reference/api-keys.md#update-api-key-status) | PATCH | `/v1/api-keys/{key_id}` | explicit | write | never | - |
| device | [`updateGroupInfo`](api-reference/groups.md#update-group-info) | POST | `/v1/accounts/{account_id}/groups/update-info` | explicit | never | never | - |
| device | [`updateGroupJoinRequests`](api-reference/groups.md#update-group-join-requests) | POST | `/v1/accounts/{account_id}/groups/join-requests/update` | explicit | never | never | - |
| device | [`updateGroupMembers`](api-reference/groups.md#update-group-members) | POST | `/v1/accounts/{account_id}/groups/members` | explicit | never | never | - |
| device | [`updateWebhookEndpoint`](api-reference/webhook-endpoints.md#update-webhook-endpoint) | PATCH | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | never | secret input |
| device | [`updateWorkspace`](api-reference/workspace.md#update-workspace) | PATCH | `/v1/workspace` | explicit | never | never | - |
| device | [`upsertConversationLabel`](api-reference/conversations.md#upsert-conversation-label) | POST | `/v1/accounts/{account_id}/conversations/labels/upsert` | explicit | never | never | - |

- 公开 operation：64
- SDK 显式方法：64
- 可进入 MCP registry 的 operation：4
- MCP 永久排除：60
