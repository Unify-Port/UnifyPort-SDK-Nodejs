<!-- 此文件由 pnpm generate 生成；修改契约或生成器后重新生成。 -->
# API 覆盖率

本表把 Device API 的每个 `operationId` 映射到 SDK 显式方法和 MCP 暴露策略。`never` 表示该 operation 仍由 SDK 支持，但因权限或 secret 边界不进入模型工具面。

| API | operationId | Method | Path | SDK | MCP policy | Retry | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| device | `blockContact` | POST | `/v1/accounts/{account_id}/contacts/block` | explicit | never | never | - |
| device | `cancelAccountAuth` | POST | `/v1/accounts/{account_id}/auth/cancel` | explicit | never | never | - |
| device | `checkAccountQrAuth` | POST | `/v1/accounts/{account_id}/auth/qr/check` | explicit | never | never | secret output |
| device | `createAccount` | POST | `/v1/accounts` | explicit | never | never | secret input |
| device | `createApiKey` | POST | `/v1/api-keys` | explicit | never | never | secret output |
| device | `createGroup` | POST | `/v1/accounts/{account_id}/groups/create` | explicit | never | never | - |
| device | `createWebhookEndpoint` | POST | `/v1/webhook-endpoints` | explicit | never | never | secret input |
| device | `deactivateWebhookEndpoint` | POST | `/v1/webhook-endpoints/{endpoint_id}/deactivate` | explicit | never | never | - |
| device | `deleteAccount` | DELETE | `/v1/accounts/{account_id}` | explicit | never | never | - |
| device | `deleteConversationLabel` | POST | `/v1/accounts/{account_id}/conversations/labels/delete` | explicit | never | never | - |
| device | `deleteWebhookEndpoint` | DELETE | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | never | - |
| device | `editMessage` | POST | `/v1/messages/edit` | explicit | never | never | - |
| device | `getAccount` | GET | `/v1/accounts/{account_id}` | explicit | never | safe | secret output |
| device | `getAccountAuthState` | GET | `/v1/accounts/{account_id}/auth` | explicit | never | safe | secret output |
| device | `getContact` | GET | `/v1/accounts/{account_id}/contacts/info` | explicit | never | safe | - |
| device | `getConversation` | GET | `/v1/accounts/{account_id}/conversations/info` | explicit | never | safe | - |
| device | `getGroup` | GET | `/v1/accounts/{account_id}/groups/info` | explicit | never | safe | - |
| device | `getGroupInviteCode` | GET | `/v1/accounts/{account_id}/groups/invite-code` | explicit | never | safe | secret output |
| device | `getWebhookEndpoint` | GET | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | safe | - |
| device | `getWorkspace` | GET | `/v1/workspace` | explicit | read | safe | - |
| device | `importAccountAuthSession` | POST | `/v1/accounts/{account_id}/auth/session` | explicit | never | never | secret input |
| device | `leaveGroup` | POST | `/v1/accounts/{account_id}/groups/leave` | explicit | never | never | - |
| device | `listAccounts` | GET | `/v1/accounts` | explicit | never | safe | - |
| device | `listApiKeys` | GET | `/v1/api-keys` | explicit | read | safe | - |
| device | `listContactBlocklist` | GET | `/v1/accounts/{account_id}/contacts/blocklist` | explicit | never | safe | - |
| device | `listContacts` | GET | `/v1/accounts/{account_id}/contacts` | explicit | never | safe | - |
| device | `listConversationLabels` | GET | `/v1/accounts/{account_id}/conversations/labels` | explicit | never | safe | - |
| device | `listConversationMembers` | GET | `/v1/accounts/{account_id}/conversations/members` | explicit | never | safe | - |
| device | `listConversations` | GET | `/v1/accounts/{account_id}/conversations` | explicit | never | safe | - |
| device | `listGroupJoinRequests` | GET | `/v1/accounts/{account_id}/groups/join-requests` | explicit | never | safe | - |
| device | `listGroups` | GET | `/v1/accounts/{account_id}/groups` | explicit | never | safe | - |
| device | `listProviderRegions` | GET | `/v1/providers/{provider}/regions` | explicit | read | safe | - |
| device | `listWebhookEndpoints` | GET | `/v1/webhook-endpoints` | explicit | never | safe | - |
| device | `markConversationRead` | POST | `/v1/accounts/{account_id}/conversations/read` | explicit | never | never | - |
| device | `markConversationUnread` | POST | `/v1/accounts/{account_id}/conversations/unread` | explicit | never | never | - |
| device | `muteConversation` | POST | `/v1/accounts/{account_id}/conversations/mute` | explicit | never | never | - |
| device | `pinConversation` | POST | `/v1/accounts/{account_id}/conversations/pin` | explicit | never | never | - |
| device | `pinMessage` | POST | `/v1/messages/pin` | explicit | never | never | - |
| device | `reactMessage` | POST | `/v1/messages/reaction` | explicit | never | never | - |
| device | `reconnectAccountRuntime` | POST | `/v1/accounts/{account_id}/runtime/reconnect` | explicit | never | never | - |
| device | `refreshAccountRuntime` | POST | `/v1/accounts/{account_id}/runtime/refresh` | explicit | never | never | - |
| device | `revokeMessage` | POST | `/v1/messages/revoke` | explicit | never | never | - |
| device | `rotateApiKey` | POST | `/v1/api-keys/{key_id}/rotate` | explicit | never | never | secret output |
| device | `sendMessage` | POST | `/v1/messages` | explicit | never | never | secret input |
| device | `setContactNote` | POST | `/v1/accounts/{account_id}/contacts/note` | explicit | never | never | - |
| device | `setConversationLabelMembers` | POST | `/v1/accounts/{account_id}/conversations/labels` | explicit | never | never | - |
| device | `setGroupJoinApprovalMode` | POST | `/v1/accounts/{account_id}/groups/join-approval-mode` | explicit | never | never | - |
| device | `startAccountAuth` | POST | `/v1/accounts/{account_id}/auth/start` | explicit | never | never | secret output |
| device | `startAccountQrAuth` | POST | `/v1/accounts/{account_id}/auth/qr/start` | explicit | never | never | secret output |
| device | `startAccountRuntime` | POST | `/v1/accounts/{account_id}/runtime/start` | explicit | never | never | - |
| device | `stopAccountRuntime` | POST | `/v1/accounts/{account_id}/runtime/stop` | explicit | never | never | - |
| device | `submitAccountAuthCode` | POST | `/v1/accounts/{account_id}/auth/code` | explicit | never | never | secret input |
| device | `submitAccountAuthPassword` | POST | `/v1/accounts/{account_id}/auth/password` | explicit | never | never | secret input |
| device | `unblockContact` | POST | `/v1/accounts/{account_id}/contacts/unblock` | explicit | never | never | - |
| device | `unmuteConversation` | POST | `/v1/accounts/{account_id}/conversations/unmute` | explicit | never | never | - |
| device | `unpinConversation` | POST | `/v1/accounts/{account_id}/conversations/unpin` | explicit | never | never | - |
| device | `updateAccount` | PATCH | `/v1/accounts/{account_id}` | explicit | never | never | secret input |
| device | `updateApiKeyStatus` | PATCH | `/v1/api-keys/{key_id}` | explicit | write | never | - |
| device | `updateGroupInfo` | POST | `/v1/accounts/{account_id}/groups/update-info` | explicit | never | never | - |
| device | `updateGroupJoinRequests` | POST | `/v1/accounts/{account_id}/groups/join-requests/update` | explicit | never | never | - |
| device | `updateGroupMembers` | POST | `/v1/accounts/{account_id}/groups/members` | explicit | never | never | - |
| device | `updateWebhookEndpoint` | PATCH | `/v1/webhook-endpoints/{endpoint_id}` | explicit | never | never | secret input |
| device | `updateWorkspace` | PATCH | `/v1/workspace` | explicit | never | never | - |
| device | `upsertConversationLabel` | POST | `/v1/accounts/{account_id}/conversations/labels/upsert` | explicit | never | never | - |

- 公开 operation：64
- SDK 显式方法：64
- 可进入 MCP registry 的 operation：4
- MCP 永久排除：60
