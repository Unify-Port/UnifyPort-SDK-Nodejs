/**
 * 此文件由 `pnpm generate` 根据 contracts/device.openapi.yaml 生成。
 * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。
 */
import type { UnifyPortDeviceClient } from "@unifyport/sdk-node";

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
    case "device_block_contact": {
      const client = clients.device;
      return await client.blockContact(
        input as Parameters<UnifyPortDeviceClient["blockContact"]>[0],
        { signal },
      );
    }
    case "device_cancel_account_auth": {
      const client = clients.device;
      return await client.cancelAccountAuth(
        input as Parameters<UnifyPortDeviceClient["cancelAccountAuth"]>[0],
        { signal },
      );
    }
    case "device_check_account_qr_auth": {
      const client = clients.device;
      return await client.checkAccountQrAuth(
        input as Parameters<UnifyPortDeviceClient["checkAccountQrAuth"]>[0],
        { signal },
      );
    }
    case "device_create_account": {
      const client = clients.device;
      return await client.createAccount(
        input as Parameters<UnifyPortDeviceClient["createAccount"]>[0],
        { signal },
      );
    }
    case "device_create_api_key": {
      const client = clients.device;
      return await client.createApiKey(
        input as Parameters<UnifyPortDeviceClient["createApiKey"]>[0],
        { signal },
      );
    }
    case "device_create_group": {
      const client = clients.device;
      return await client.createGroup(
        input as Parameters<UnifyPortDeviceClient["createGroup"]>[0],
        { signal },
      );
    }
    case "device_create_webhook_endpoint": {
      const client = clients.device;
      return await client.createWebhookEndpoint(
        input as Parameters<UnifyPortDeviceClient["createWebhookEndpoint"]>[0],
        { signal },
      );
    }
    case "device_deactivate_webhook_endpoint": {
      const client = clients.device;
      return await client.deactivateWebhookEndpoint(
        input as Parameters<UnifyPortDeviceClient["deactivateWebhookEndpoint"]>[0],
        { signal },
      );
    }
    case "device_delete_account": {
      const client = clients.device;
      return await client.deleteAccount(
        input as Parameters<UnifyPortDeviceClient["deleteAccount"]>[0],
        { signal },
      );
    }
    case "device_delete_conversation_label": {
      const client = clients.device;
      return await client.deleteConversationLabel(
        input as Parameters<UnifyPortDeviceClient["deleteConversationLabel"]>[0],
        { signal },
      );
    }
    case "device_delete_webhook_endpoint": {
      const client = clients.device;
      return await client.deleteWebhookEndpoint(
        input as Parameters<UnifyPortDeviceClient["deleteWebhookEndpoint"]>[0],
        { signal },
      );
    }
    case "device_edit_message": {
      const client = clients.device;
      return await client.editMessage(
        input as Parameters<UnifyPortDeviceClient["editMessage"]>[0],
        { signal },
      );
    }
    case "device_get_account": {
      const client = clients.device;
      return await client.getAccount(
        input as Parameters<UnifyPortDeviceClient["getAccount"]>[0],
        { signal },
      );
    }
    case "device_get_account_auth_state": {
      const client = clients.device;
      return await client.getAccountAuthState(
        input as Parameters<UnifyPortDeviceClient["getAccountAuthState"]>[0],
        { signal },
      );
    }
    case "device_get_contact": {
      const client = clients.device;
      return await client.getContact(
        input as Parameters<UnifyPortDeviceClient["getContact"]>[0],
        { signal },
      );
    }
    case "device_get_conversation": {
      const client = clients.device;
      return await client.getConversation(
        input as Parameters<UnifyPortDeviceClient["getConversation"]>[0],
        { signal },
      );
    }
    case "device_get_group": {
      const client = clients.device;
      return await client.getGroup(
        input as Parameters<UnifyPortDeviceClient["getGroup"]>[0],
        { signal },
      );
    }
    case "device_get_group_invite_code": {
      const client = clients.device;
      return await client.getGroupInviteCode(
        input as Parameters<UnifyPortDeviceClient["getGroupInviteCode"]>[0],
        { signal },
      );
    }
    case "device_get_webhook_endpoint": {
      const client = clients.device;
      return await client.getWebhookEndpoint(
        input as Parameters<UnifyPortDeviceClient["getWebhookEndpoint"]>[0],
        { signal },
      );
    }
    case "device_get_workspace": {
      const client = clients.device;
      return await client.getWorkspace(
        input as Parameters<UnifyPortDeviceClient["getWorkspace"]>[0],
        { signal },
      );
    }
    case "device_import_account_auth_session": {
      const client = clients.device;
      return await client.importAccountAuthSession(
        input as Parameters<UnifyPortDeviceClient["importAccountAuthSession"]>[0],
        { signal },
      );
    }
    case "device_leave_group": {
      const client = clients.device;
      return await client.leaveGroup(
        input as Parameters<UnifyPortDeviceClient["leaveGroup"]>[0],
        { signal },
      );
    }
    case "device_list_accounts": {
      const client = clients.device;
      return await client.listAccounts(
        input as Parameters<UnifyPortDeviceClient["listAccounts"]>[0],
        { signal },
      );
    }
    case "device_list_api_keys": {
      const client = clients.device;
      return await client.listApiKeys(
        input as Parameters<UnifyPortDeviceClient["listApiKeys"]>[0],
        { signal },
      );
    }
    case "device_list_contact_blocklist": {
      const client = clients.device;
      return await client.listContactBlocklist(
        input as Parameters<UnifyPortDeviceClient["listContactBlocklist"]>[0],
        { signal },
      );
    }
    case "device_list_contacts": {
      const client = clients.device;
      return await client.listContacts(
        input as Parameters<UnifyPortDeviceClient["listContacts"]>[0],
        { signal },
      );
    }
    case "device_list_conversation_labels": {
      const client = clients.device;
      return await client.listConversationLabels(
        input as Parameters<UnifyPortDeviceClient["listConversationLabels"]>[0],
        { signal },
      );
    }
    case "device_list_conversation_members": {
      const client = clients.device;
      return await client.listConversationMembers(
        input as Parameters<UnifyPortDeviceClient["listConversationMembers"]>[0],
        { signal },
      );
    }
    case "device_list_conversations": {
      const client = clients.device;
      return await client.listConversations(
        input as Parameters<UnifyPortDeviceClient["listConversations"]>[0],
        { signal },
      );
    }
    case "device_list_group_join_requests": {
      const client = clients.device;
      return await client.listGroupJoinRequests(
        input as Parameters<UnifyPortDeviceClient["listGroupJoinRequests"]>[0],
        { signal },
      );
    }
    case "device_list_groups": {
      const client = clients.device;
      return await client.listGroups(
        input as Parameters<UnifyPortDeviceClient["listGroups"]>[0],
        { signal },
      );
    }
    case "device_list_provider_regions": {
      const client = clients.device;
      return await client.listProviderRegions(
        input as Parameters<UnifyPortDeviceClient["listProviderRegions"]>[0],
        { signal },
      );
    }
    case "device_list_webhook_endpoints": {
      const client = clients.device;
      return await client.listWebhookEndpoints(
        input as Parameters<UnifyPortDeviceClient["listWebhookEndpoints"]>[0],
        { signal },
      );
    }
    case "device_mark_conversation_read": {
      const client = clients.device;
      return await client.markConversationRead(
        input as Parameters<UnifyPortDeviceClient["markConversationRead"]>[0],
        { signal },
      );
    }
    case "device_mark_conversation_unread": {
      const client = clients.device;
      return await client.markConversationUnread(
        input as Parameters<UnifyPortDeviceClient["markConversationUnread"]>[0],
        { signal },
      );
    }
    case "device_mute_conversation": {
      const client = clients.device;
      return await client.muteConversation(
        input as Parameters<UnifyPortDeviceClient["muteConversation"]>[0],
        { signal },
      );
    }
    case "device_pin_conversation": {
      const client = clients.device;
      return await client.pinConversation(
        input as Parameters<UnifyPortDeviceClient["pinConversation"]>[0],
        { signal },
      );
    }
    case "device_pin_message": {
      const client = clients.device;
      return await client.pinMessage(
        input as Parameters<UnifyPortDeviceClient["pinMessage"]>[0],
        { signal },
      );
    }
    case "device_react_message": {
      const client = clients.device;
      return await client.reactMessage(
        input as Parameters<UnifyPortDeviceClient["reactMessage"]>[0],
        { signal },
      );
    }
    case "device_reconnect_account_runtime": {
      const client = clients.device;
      return await client.reconnectAccountRuntime(
        input as Parameters<UnifyPortDeviceClient["reconnectAccountRuntime"]>[0],
        { signal },
      );
    }
    case "device_refresh_account_runtime": {
      const client = clients.device;
      return await client.refreshAccountRuntime(
        input as Parameters<UnifyPortDeviceClient["refreshAccountRuntime"]>[0],
        { signal },
      );
    }
    case "device_revoke_message": {
      const client = clients.device;
      return await client.revokeMessage(
        input as Parameters<UnifyPortDeviceClient["revokeMessage"]>[0],
        { signal },
      );
    }
    case "device_rotate_api_key": {
      const client = clients.device;
      return await client.rotateApiKey(
        input as Parameters<UnifyPortDeviceClient["rotateApiKey"]>[0],
        { signal },
      );
    }
    case "device_send_message": {
      const client = clients.device;
      return await client.sendMessage(
        input as Parameters<UnifyPortDeviceClient["sendMessage"]>[0],
        { signal },
      );
    }
    case "device_set_contact_note": {
      const client = clients.device;
      return await client.setContactNote(
        input as Parameters<UnifyPortDeviceClient["setContactNote"]>[0],
        { signal },
      );
    }
    case "device_set_conversation_label_members": {
      const client = clients.device;
      return await client.setConversationLabelMembers(
        input as Parameters<UnifyPortDeviceClient["setConversationLabelMembers"]>[0],
        { signal },
      );
    }
    case "device_set_group_join_approval_mode": {
      const client = clients.device;
      return await client.setGroupJoinApprovalMode(
        input as Parameters<UnifyPortDeviceClient["setGroupJoinApprovalMode"]>[0],
        { signal },
      );
    }
    case "device_start_account_auth": {
      const client = clients.device;
      return await client.startAccountAuth(
        input as Parameters<UnifyPortDeviceClient["startAccountAuth"]>[0],
        { signal },
      );
    }
    case "device_start_account_qr_auth": {
      const client = clients.device;
      return await client.startAccountQrAuth(
        input as Parameters<UnifyPortDeviceClient["startAccountQrAuth"]>[0],
        { signal },
      );
    }
    case "device_start_account_runtime": {
      const client = clients.device;
      return await client.startAccountRuntime(
        input as Parameters<UnifyPortDeviceClient["startAccountRuntime"]>[0],
        { signal },
      );
    }
    case "device_stop_account_runtime": {
      const client = clients.device;
      return await client.stopAccountRuntime(
        input as Parameters<UnifyPortDeviceClient["stopAccountRuntime"]>[0],
        { signal },
      );
    }
    case "device_submit_account_auth_code": {
      const client = clients.device;
      return await client.submitAccountAuthCode(
        input as Parameters<UnifyPortDeviceClient["submitAccountAuthCode"]>[0],
        { signal },
      );
    }
    case "device_submit_account_auth_password": {
      const client = clients.device;
      return await client.submitAccountAuthPassword(
        input as Parameters<UnifyPortDeviceClient["submitAccountAuthPassword"]>[0],
        { signal },
      );
    }
    case "device_unblock_contact": {
      const client = clients.device;
      return await client.unblockContact(
        input as Parameters<UnifyPortDeviceClient["unblockContact"]>[0],
        { signal },
      );
    }
    case "device_unmute_conversation": {
      const client = clients.device;
      return await client.unmuteConversation(
        input as Parameters<UnifyPortDeviceClient["unmuteConversation"]>[0],
        { signal },
      );
    }
    case "device_unpin_conversation": {
      const client = clients.device;
      return await client.unpinConversation(
        input as Parameters<UnifyPortDeviceClient["unpinConversation"]>[0],
        { signal },
      );
    }
    case "device_update_account": {
      const client = clients.device;
      return await client.updateAccount(
        input as Parameters<UnifyPortDeviceClient["updateAccount"]>[0],
        { signal },
      );
    }
    case "device_update_api_key_status": {
      const client = clients.device;
      return await client.updateApiKeyStatus(
        input as Parameters<UnifyPortDeviceClient["updateApiKeyStatus"]>[0],
        { signal },
      );
    }
    case "device_update_group_info": {
      const client = clients.device;
      return await client.updateGroupInfo(
        input as Parameters<UnifyPortDeviceClient["updateGroupInfo"]>[0],
        { signal },
      );
    }
    case "device_update_group_join_requests": {
      const client = clients.device;
      return await client.updateGroupJoinRequests(
        input as Parameters<UnifyPortDeviceClient["updateGroupJoinRequests"]>[0],
        { signal },
      );
    }
    case "device_update_group_members": {
      const client = clients.device;
      return await client.updateGroupMembers(
        input as Parameters<UnifyPortDeviceClient["updateGroupMembers"]>[0],
        { signal },
      );
    }
    case "device_update_webhook_endpoint": {
      const client = clients.device;
      return await client.updateWebhookEndpoint(
        input as Parameters<UnifyPortDeviceClient["updateWebhookEndpoint"]>[0],
        { signal },
      );
    }
    case "device_update_workspace": {
      const client = clients.device;
      return await client.updateWorkspace(
        input as Parameters<UnifyPortDeviceClient["updateWorkspace"]>[0],
        { signal },
      );
    }
    case "device_upsert_conversation_label": {
      const client = clients.device;
      return await client.upsertConversationLabel(
        input as Parameters<UnifyPortDeviceClient["upsertConversationLabel"]>[0],
        { signal },
      );
    }
    default:
      throw new Error(`Unknown generated tool: ${name}`);
  }
}
