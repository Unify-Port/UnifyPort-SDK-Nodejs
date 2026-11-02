/**
 * 此文件由 `pnpm generate` 根据公开 OpenAPI 契约生成。
 * 仅在编译期验证 API Reference 示例，不会主动执行网络请求。
 */
import type { UnifyPortDeviceClient } from "../../src/index.js";

type ApiReferenceExamples = {
  // Webhook operationId 描述接收契约，调用示例只覆盖 HTTP 客户端方法。
  readonly [K in keyof UnifyPortDeviceClient]: (device: UnifyPortDeviceClient) => Promise<void>;
};

// 显式映射让新增 operation 在缺少文档示例时直接触发类型或键集合错误。
export const apiReferenceExamples = {
  blockContact: async (device) => {
    await device.blockContact({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        contact_id: "123456789012345@lid"
      }
    });
  },
  cancelAccountAuth: async (device) => {
    await device.cancelAccountAuth({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  checkAccountQrAuth: async (device) => {
    await device.checkAccountQrAuth({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  confirmAccountPasskey: async (device) => {
    await device.confirmAccountPasskey({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  createAccount: async (device) => {
    await device.createAccount({
      body: {
        provider: "telegram",
        region: "global",
        auth_mode: "qrcode"
      }
    });
  },
  createAccountAuthSession: async (device) => {
    await device.createAccountAuthSession({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  createApiKey: async (device) => {
    await device.createApiKey({
      body: {
        name: "Example",
        prefix: "dk_live"
      }
    });
  },
  createCall: async (device) => {
    await device.createCall({
      body: {
        account_id: "acc_example",
        to: {
          id: "100000000000002@lid",
          type: "user"
        },
        media_type: "video"
      }
    });
  },
  createContact: async (device) => {
    await device.createContact({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        phone_number: "8613800000000",
        username: "alice_user",
        whatsapp_options: {
          first_name: "Alice",
          full_name: "Alice Example",
          sync_to_device_contacts: false
        }
      }
    });
  },
  createGroup: async (device) => {
    await device.createGroup({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        name: "Example"
      }
    });
  },
  createWebhookEndpoint: async (device) => {
    await device.createWebhookEndpoint({
      body: {
        url: "https://example.com/resource",
        status: "active"
      }
    });
  },
  deactivateWebhookEndpoint: async (device) => {
    await device.deactivateWebhookEndpoint({
      params: {
        path: {
          endpoint_id: "we_xxx"
        }
      }
    });
  },
  deleteAccount: async (device) => {
    await device.deleteAccount({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  deleteConversationLabel: async (device) => {
    await device.deleteConversationLabel({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        label_id: "label_xxx"
      }
    });
  },
  deleteWebhookEndpoint: async (device) => {
    await device.deleteWebhookEndpoint({
      params: {
        path: {
          endpoint_id: "we_xxx"
        }
      }
    });
  },
  editMessage: async (device) => {
    await device.editMessage({
      body: {
        account_id: "acc_xxx",
        conversation_id: "conversation_xxx",
        message_id: "message_xxx",
        content: "Example text"
      }
    });
  },
  getAccount: async (device) => {
    await device.getAccount({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  getAccountAuthState: async (device) => {
    await device.getAccountAuthState({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  getAccountOperation: async (device) => {
    await device.getAccountOperation({
      params: {
        path: {
          operation_id: "operation_id_xxx"
        }
      }
    });
  },
  getActiveCall: async (device) => {
    await device.getActiveCall({
      params: {
        query: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  getContact: async (device) => {
    await device.getContact({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          contact_id: "contact_xxx"
        }
      }
    });
  },
  getContactMembership: async (device) => {
    await device.getContactMembership({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          contact_id: "contact_xxx"
        }
      }
    });
  },
  getConversation: async (device) => {
    await device.getConversation({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          conversation_id: "conversation_xxx"
        }
      }
    });
  },
  getGroup: async (device) => {
    await device.getGroup({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          group_id: "group_xxx"
        }
      }
    });
  },
  getGroupInviteCode: async (device) => {
    await device.getGroupInviteCode({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          group_id: "group_xxx"
        }
      }
    });
  },
  getPost: async (device) => {
    await device.getPost({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        post_id: "7500000000000000101"
      }
    });
  },
  getWebhookEndpoint: async (device) => {
    await device.getWebhookEndpoint({
      params: {
        path: {
          endpoint_id: "we_xxx"
        }
      }
    });
  },
  getWorkspace: async (device) => {
    await device.getWorkspace();
  },
  hangupCall: async (device) => {
    await device.hangupCall({
      params: {
        path: {
          call_id: "call_id_xxx"
        }
      },
      body: {
        account_id: "acc_example"
      }
    });
  },
  importAccountAuthSession: async (device) => {
    await device.importAccountAuthSession({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        session_url: "<session-payload>"
      }
    });
  },
  leaveGroup: async (device) => {
    await device.leaveGroup({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        group_id: "group_xxx"
      }
    });
  },
  listAccounts: async (device) => {
    await device.listAccounts({
      params: {
        query: {
          limit: 20
        }
      }
    });
  },
  listApiKeys: async (device) => {
    await device.listApiKeys();
  },
  listContactBlocklist: async (device) => {
    await device.listContactBlocklist({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  listContacts: async (device) => {
    await device.listContacts({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          limit: 1
        }
      }
    });
  },
  listConversationLabels: async (device) => {
    await device.listConversationLabels({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          limit: 1
        }
      }
    });
  },
  listConversationMembers: async (device) => {
    await device.listConversationMembers({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          conversation_id: "conversation_xxx",
          limit: 1
        }
      }
    });
  },
  listConversations: async (device) => {
    await device.listConversations({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          limit: 1
        }
      }
    });
  },
  listGroupJoinRequests: async (device) => {
    await device.listGroupJoinRequests({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          group_id: "group_xxx"
        }
      }
    });
  },
  listGroups: async (device) => {
    await device.listGroups({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          limit: 1
        }
      }
    });
  },
  listPostComments: async (device) => {
    await device.listPostComments({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        post_id: "post_id_xxx"
      }
    });
  },
  listPosts: async (device) => {
    await device.listPosts({
      params: {
        path: {
          account_id: "acc_xxx"
        },
        query: {
          limit: 20
        }
      }
    });
  },
  listProviderRegions: async (device) => {
    await device.listProviderRegions({
      params: {
        path: {
          provider: "telegram"
        }
      }
    });
  },
  listWebhookEndpoints: async (device) => {
    await device.listWebhookEndpoints();
  },
  markConversationRead: async (device) => {
    await device.markConversationRead({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "-1001234567890",
        up_to_message_id: "12345"
      }
    });
  },
  markConversationUnread: async (device) => {
    await device.markConversationUnread({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "conversation_xxx"
      }
    });
  },
  muteConversation: async (device) => {
    await device.muteConversation({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "conversation_xxx"
      }
    });
  },
  pinConversation: async (device) => {
    await device.pinConversation({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "conversation_xxx"
      }
    });
  },
  pinMessage: async (device) => {
    await device.pinMessage({
      body: {
        account_id: "acc_xxx",
        conversation_id: "conversation_xxx",
        message_id: "message_xxx",
        pinned: false
      }
    });
  },
  reactMessage: async (device) => {
    await device.reactMessage({
      body: {
        account_id: "acc_xxx",
        conversation_id: "conversation_xxx",
        message_id: "message_xxx"
      }
    });
  },
  reconnectAccountRuntime: async (device) => {
    await device.reconnectAccountRuntime({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  refreshAccountRuntime: async (device) => {
    await device.refreshAccountRuntime({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  replyPostComment: async (device) => {
    await device.replyPostComment({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        post_id: "7500000000000000101",
        text: "Example"
      }
    });
  },
  requestConversationHistory: async (device) => {
    await device.requestConversationHistory({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "100000000000002@lid",
        before: {
          message_id: "MSG_HISTORY_ANCHOR_001",
          sent_at: "2026-09-28T03:00:00Z",
          direction: "inbound"
        },
        limit: 50
      }
    });
  },
  revokeMessage: async (device) => {
    await device.revokeMessage({
      body: {
        account_id: "acc_xxx",
        conversation_id: "conversation_xxx",
        message_id: "message_xxx"
      }
    });
  },
  rotateApiKey: async (device) => {
    await device.rotateApiKey({
      params: {
        path: {
          key_id: "ak_xxx"
        }
      },
      body: {
        name: "Example"
      }
    });
  },
  sendMessage: async (device) => {
    await device.sendMessage({
      body: {
        account_id: "acc_xxx",
        to: {
          id: "recipient_xxx",
          type: "user"
        },
        message: {
          type: "text",
          text: "Hello from UnifyPort"
        }
      }
    });
  },
  setContactNote: async (device) => {
    await device.setContactNote({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        contact_id: "contact_xxx",
        note: "Example note"
      }
    });
  },
  setConversationLabelMembers: async (device) => {
    await device.setConversationLabelMembers({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        label_id: "label_xxx",
        action: "add",
        conversation_ids: ["conversation_xxx"]
      }
    });
  },
  setGroupJoinApprovalMode: async (device) => {
    await device.setGroupJoinApprovalMode({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        group_id: "group_xxx",
        enabled: false
      }
    });
  },
  startAccountAuth: async (device) => {
    await device.startAccountAuth({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  startAccountQrAuth: async (device) => {
    await device.startAccountQrAuth({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  startAccountRuntime: async (device) => {
    await device.startAccountRuntime({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  stopAccountRuntime: async (device) => {
    await device.stopAccountRuntime({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      }
    });
  },
  submitAccountAuthCode: async (device) => {
    await device.submitAccountAuthCode({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        code: "<verification-code>"
      }
    });
  },
  submitAccountAuthPassword: async (device) => {
    await device.submitAccountAuthPassword({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        password: "<password>"
      }
    });
  },
  submitAccountPasskeyResponse: async (device) => {
    await device.submitAccountPasskeyResponse({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        webauthn_response: '{"id":"credential-id","response":{"clientDataJSON":"..."}}'
      }
    });
  },
  unblockContact: async (device) => {
    await device.unblockContact({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        contact_id: "123456789012345@lid"
      }
    });
  },
  unmuteConversation: async (device) => {
    await device.unmuteConversation({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "conversation_xxx"
      }
    });
  },
  unpinConversation: async (device) => {
    await device.unpinConversation({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        conversation_id: "conversation_xxx"
      }
    });
  },
  updateAccount: async (device) => {
    await device.updateAccount({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {}
    });
  },
  updateApiKeyStatus: async (device) => {
    await device.updateApiKeyStatus({
      params: {
        path: {
          key_id: "ak_xxx"
        }
      },
      body: {
        status: "active"
      }
    });
  },
  updateGroupInfo: async (device) => {
    await device.updateGroupInfo({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        group_id: "group_xxx",
        name: "Example group"
      }
    });
  },
  updateGroupJoinRequests: async (device) => {
    await device.updateGroupJoinRequests({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        group_id: "group_xxx",
        action: "approve",
        member_ids: ["member_xxx"]
      }
    });
  },
  updateGroupMembers: async (device) => {
    await device.updateGroupMembers({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        group_id: "group_xxx",
        action: "add",
        member_id: "member_xxx"
      }
    });
  },
  updateWebhookEndpoint: async (device) => {
    await device.updateWebhookEndpoint({
      params: {
        path: {
          endpoint_id: "we_xxx"
        }
      },
      body: {
        url: "https://example.com/resource",
        status: "active"
      }
    });
  },
  updateWorkspace: async (device) => {
    await device.updateWorkspace({
      body: {
        name: "Example",
        status: "active"
      }
    });
  },
  upsertConversationLabel: async (device) => {
    await device.upsertConversationLabel({
      params: {
        path: {
          account_id: "acc_xxx"
        }
      },
      body: {
        name: "Example"
      }
    });
  }
} satisfies ApiReferenceExamples;
