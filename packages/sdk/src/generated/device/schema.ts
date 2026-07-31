/**
 * 此文件由 `pnpm generate` 根据 contracts/device.openapi.yaml 生成。
 * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。
 */
export interface paths {
    "/v1/accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出账号 */
        get: operations["listAccounts"];
        put?: never;
        /** 创建账号 */
        post: operations["createAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取账号详情 */
        get: operations["getAccount"];
        put?: never;
        post?: never;
        /** 删除账号 */
        delete: operations["deleteAccount"];
        options?: never;
        head?: never;
        /** 更新账号 */
        patch: operations["updateAccount"];
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取账号授权状态 */
        get: operations["getAccountAuthState"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 取消授权流程 */
        post: operations["cancelAccountAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 提交验证码 */
        post: operations["submitAccountAuthCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 提交二次密码 */
        post: operations["submitAccountAuthPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/qr/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 检查二维码授权结果 */
        post: operations["checkAccountQrAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/qr/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 启动二维码授权 */
        post: operations["startAccountQrAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 导入会话授权 */
        post: operations["importAccountAuthSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/auth/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 启动验证码类授权 */
        post: operations["startAccountAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出联系人 */
        get: operations["listContacts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts/block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 封锁联系人 */
        post: operations["blockContact"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts/blocklist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询联系人黑名单 */
        get: operations["listContactBlocklist"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取联系人详情 */
        get: operations["getContact"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts/note": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 设置或清空联系人备注 */
        post: operations["setContactNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/contacts/unblock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 解封联系人 */
        post: operations["unblockContact"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出会话 */
        get: operations["listConversations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取会话详情 */
        get: operations["getConversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/labels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出会话标签 */
        get: operations["listConversationLabels"];
        put?: never;
        /** 给会话打标或移除标签 */
        post: operations["setConversationLabelMembers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/labels/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 删除会话标签 */
        post: operations["deleteConversationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/labels/upsert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 新建或更新会话标签 */
        post: operations["upsertConversationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出会话成员 */
        get: operations["listConversationMembers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/mute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 静音会话 */
        post: operations["muteConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/pin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 置顶会话 */
        post: operations["pinConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 标记会话已读 */
        post: operations["markConversationRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/unmute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 取消静音会话 */
        post: operations["unmuteConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/unpin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 取消置顶会话 */
        post: operations["unpinConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/conversations/unread": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 标记会话未读 */
        post: operations["markConversationUnread"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出群组 */
        get: operations["listGroups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建群组 */
        post: operations["createGroup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取群组详情 */
        get: operations["getGroup"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/invite-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取群邀请链接或邀请码 */
        get: operations["getGroupInviteCode"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/join-approval-mode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 设置入群审批模式 */
        post: operations["setGroupJoinApprovalMode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/join-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出待审批入群申请 */
        get: operations["listGroupJoinRequests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/join-requests/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 处理入群申请 */
        post: operations["updateGroupJoinRequests"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/leave": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 退出群组 */
        post: operations["leaveGroup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 管理群成员 */
        post: operations["updateGroupMembers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/groups/update-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 修改群信息
         * @description `name`、`description`、`avatar_url` 三个字段每次只能传一个。
         */
        post: operations["updateGroupInfo"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/runtime/reconnect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 重连账号运行态 */
        post: operations["reconnectAccountRuntime"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/runtime/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 刷新账号运行态 */
        post: operations["refreshAccountRuntime"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/runtime/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 启动账号运行态 */
        post: operations["startAccountRuntime"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/accounts/{account_id}/runtime/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 停止账号运行态 */
        post: operations["stopAccountRuntime"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/api-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出 API Key */
        get: operations["listApiKeys"];
        put?: never;
        /**
         * 创建 API Key
         * @description 完整 `api_key` 只在创建响应中出现一次，客户端应自行保存。
         */
        post: operations["createApiKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/api-keys/{key_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** 更新 API Key 状态 */
        patch: operations["updateApiKeyStatus"];
        trace?: never;
    };
    "/v1/api-keys/{key_id}/rotate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 轮换 API Key
         * @description 轮换后返回新的完整 `api_key`，旧完整密钥不可恢复。
         */
        post: operations["rotateApiKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 发送消息 */
        post: operations["sendMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages/edit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 编辑消息文本
         * @description 当前主要由支持该能力的 provider 实现，通常仅支持文本消息。
         */
        post: operations["editMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages/pin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 置顶或取消置顶消息 */
        post: operations["pinMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages/reaction": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 给消息加表情回应或取消回应 */
        post: operations["reactMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 撤回消息 */
        post: operations["revokeMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/providers/{provider}/regions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询 provider 地区可用性 */
        get: operations["listProviderRegions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/webhook-endpoints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 列出 webhook endpoint */
        get: operations["listWebhookEndpoints"];
        put?: never;
        /** 创建 webhook endpoint */
        post: operations["createWebhookEndpoint"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/webhook-endpoints/{endpoint_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取 webhook endpoint */
        get: operations["getWebhookEndpoint"];
        put?: never;
        post?: never;
        /** 删除 webhook endpoint */
        delete: operations["deleteWebhookEndpoint"];
        options?: never;
        head?: never;
        /** 更新 webhook endpoint */
        patch: operations["updateWebhookEndpoint"];
        trace?: never;
    };
    "/v1/webhook-endpoints/{endpoint_id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 停用 webhook endpoint */
        post: operations["deactivateWebhookEndpoint"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/workspace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前 workspace */
        get: operations["getWorkspace"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** 更新当前 workspace */
        patch: operations["updateWorkspace"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Account: {
            /** @description 授权模式，例如 qrcode、code、session。 */
            auth_mode?: string;
            capabilities?: string[];
            /** @example acc_xxx */
            id: string;
            metadata?: components["schemas"]["FreeFormObject"];
            name: string;
            provider: components["schemas"]["ProviderName"];
            /** @description provider 侧账号公开标识。 */
            provider_account_ref?: string;
            provider_profile?: components["schemas"]["ProviderProfile"];
            proxy?: components["schemas"]["FreeFormObject"];
            region: string;
            runtime_status?: components["schemas"]["RuntimeStatus"];
            /** @description 账号资源状态，例如 active、inactive、disabled。 */
            status: string;
        };
        AccountRequest: {
            auth_mode?: string;
            capabilities?: string[];
            metadata?: components["schemas"]["FreeFormObject"];
            name?: string;
            provider: components["schemas"]["ProviderName"];
            provider_account_ref?: string;
            provider_data?: components["schemas"]["FreeFormObject"];
            proxy?: components["schemas"]["FreeFormObject"];
            region: string;
            runtime_status?: components["schemas"]["RuntimeStatus"];
            status?: string;
        };
        AccountSession: {
            account_id: string;
            auth_fields?: components["schemas"]["AuthField"][];
            auth_payload?: components["schemas"]["FreeFormObject"];
            expires_at?: string;
            last_error?: string;
            /** @description 授权流程状态，例如 pending_auth、awaiting_qr_scan、authorized、failed。 */
            status: string;
        };
        APIKey: {
            /** @example ak_xxx */
            id: string;
            /** @description 可展示的 Key 前缀，不是完整 API Key。 */
            key_prefix: string;
            name: string;
            /** @enum {string} */
            status: "active" | "inactive";
        };
        APIKeyCreateRequest: {
            name: string;
            /** @description 生成 API Key 时使用的前缀。 */
            prefix?: string;
        };
        APIKeyCreateResult: {
            /** @description 完整明文 API Key，仅创建或轮换响应中出现一次。 */
            api_key: string;
            key: components["schemas"]["APIKey"];
        };
        APIKeyStatusUpdateRequest: {
            /** @enum {string} */
            status: "active" | "inactive";
        };
        AuthField: {
            label?: string;
            placeholder?: string;
            required: boolean;
            type: string;
        };
        Contact: {
            avatar_url: string;
            conversation_id: string;
            display_name: string;
            extra?: components["schemas"]["FreeFormObject"];
            id: string;
            is_blocked?: boolean;
            provider_user_id: string;
        };
        ContactBlocklistResult: {
            blocklist: string[];
            dhash?: string;
        };
        ContactCard: {
            emails?: components["schemas"]["ContactEmail"][];
            name: string;
            organization?: string;
            phones?: components["schemas"]["ContactPhone"][];
            title?: string;
        };
        ContactEmail: {
            /** Format: email */
            address: string;
            type?: string;
        };
        ContactIdRequest: {
            contact_id: string;
        };
        ContactListResult: {
            has_more: boolean;
            items: components["schemas"]["Contact"][];
            next_cursor?: string;
        };
        ContactNoteRequest: {
            contact_id: string;
            /** @description 传空字符串表示清空备注。 */
            note: string;
        };
        ContactPhone: {
            number: string;
            type?: string;
        };
        Conversation: {
            avatar_url: string;
            conversation_id: string;
            /** Format: date-time */
            created_at?: string;
            description?: string;
            extra?: components["schemas"]["FreeFormObject"];
            is_muted: boolean;
            is_pinned: boolean;
            /** Format: date-time */
            last_message_at?: string;
            last_message_text?: string;
            /** Format: int64 */
            members_count?: number;
            /** Format: int64 */
            subscribers_count?: number;
            title: string;
            type: components["schemas"]["ConversationType"];
            /** Format: int64 */
            unread_count: number;
            username?: string;
        };
        ConversationIdRequest: {
            conversation_id: string;
        };
        ConversationLabel: {
            id: string;
            name: string;
        };
        ConversationLabelDeleteRequest: {
            label_id: string;
        };
        ConversationLabelDeleteResult: {
            /** @constant */
            deleted: true;
            label_id: string;
        };
        ConversationLabelListResult: {
            has_more: boolean;
            items: components["schemas"]["ConversationLabel"][];
            next_cursor?: string;
        };
        ConversationLabelMembersRequest: {
            /** @enum {string} */
            action: "add" | "remove";
            conversation_ids: string[];
            label_id: string;
        };
        ConversationLabelMembersResult: {
            /** @enum {string} */
            action: "add" | "remove";
            conversation_ids: string[];
            label_id: string;
        };
        ConversationLabelUpsertRequest: {
            /** @description 为空表示新建，非空表示更新。 */
            label_id?: string;
            name: string;
        };
        ConversationListResult: {
            has_more: boolean;
            items: components["schemas"]["Conversation"][];
            next_cursor?: string;
        };
        ConversationMember: {
            avatar_url: string;
            display_name: string;
            extra?: components["schemas"]["FreeFormObject"];
            /** Format: date-time */
            joined_at?: string;
            /** @description 成员的 provider 侧稳定标识。WhatsApp 优先返回 LID，缺少 LID 映射时回退 JID；纯手机号位于 `extra.phone`。 */
            peer_id: string;
            role?: string;
            username?: string;
        };
        ConversationMemberListResult: {
            has_more: boolean;
            items: components["schemas"]["ConversationMember"][];
            next_cursor?: string;
        };
        ConversationMuteRequest: components["schemas"]["ConversationIdRequest"] & {
            /**
             * Format: int64
             * @description 相对静音时长，单位秒；0 表示永久静音。
             */
            duration?: number;
            /**
             * Format: date-time
             * @description RFC3339 绝对结束时间，与 `duration` 互斥。
             */
            mute_until?: string;
        };
        ConversationReadRequest: components["schemas"]["ConversationIdRequest"] & {
            /** @description 可选。WhatsApp 中与 up_to_message_sender_id 一起发送目标消息的 read receipt；省略两者时标记整个会话已读。 */
            up_to_message_id?: string;
            /** @description up_to_message_id 对应消息的 provider 原始发送者 ID；群聊应传 webhook data.sender.id。与 up_to_message_id 成对必填。 */
            up_to_message_sender_id?: string;
        };
        /** @enum {string} */
        ConversationType: "user" | "group" | "channel";
        Error: {
            /**
             * @description 稳定的机器可读错误码。
             * @example invalid_request
             */
            code: string;
            /** @description 面向开发者的错误说明，不建议作为客户端分支依据。 */
            message: string;
        };
        ErrorEnvelope: components["schemas"]["ResponseMeta"] & {
            error: components["schemas"]["Error"];
        };
        FreeFormObject: {
            [key: string]: unknown;
        };
        Group: {
            avatar_url: string;
            conversation_id: string;
            /** Format: date-time */
            created_at?: string;
            description?: string;
            extra?: components["schemas"]["FreeFormObject"];
            id: string;
            /** Format: date-time */
            joined_at?: string;
            /** Format: int64 */
            member_count?: number;
            name: string;
        };
        GroupCreateRequest: {
            members?: string[];
            name: string;
        };
        GroupCreateResult: {
            id: string;
        };
        GroupIdRequest: {
            group_id: string;
        };
        GroupInfoUpdateRequest: {
            /** Format: uri */
            avatar_url?: string;
            /** @description 传空字符串表示清空描述。 */
            description?: string;
            group_id: string;
            name?: string;
        };
        GroupInviteCode: {
            invite_code: string;
            invite_url: string;
        };
        GroupJoinApprovalModeRequest: {
            enabled: boolean;
            group_id: string;
        };
        GroupJoinRequest: {
            id: string;
            lid?: string;
            phone?: string;
            /** Format: date-time */
            requested_at?: string;
        };
        GroupJoinRequestsResult: {
            group_id: string;
            items: components["schemas"]["GroupJoinRequest"][];
        };
        GroupJoinRequestsUpdateRequest: {
            /** @enum {string} */
            action: "approve" | "reject";
            group_id: string;
            member_ids: string[];
        };
        GroupListResult: {
            has_more: boolean;
            items: components["schemas"]["Group"][];
            next_cursor?: string;
        };
        GroupMemberUpdateRequest: {
            /** @enum {string} */
            action: "add" | "remove" | "promote" | "demote";
            group_id: string;
            member_id: string;
        };
        Mention: {
            id: string;
        };
        MessageEditRequest: {
            account_id: string;
            content: string;
            conversation_id: string;
            message_id: string;
        };
        MessagePayload: {
            caption?: string;
            contacts?: components["schemas"]["ContactCard"][];
            file_key?: string;
            /** Format: uri */
            file_url?: string;
            text?: string;
            /** @enum {string} */
            type: "text" | "image" | "video" | "audio" | "document" | "file" | "contact";
            /** Format: uri */
            url?: string;
        };
        MessagePinRequest: components["schemas"]["MessageTargetRequest"] & {
            /** Format: uint32 */
            duration_seconds?: number;
            pinned: boolean;
        };
        MessageReactionRequest: components["schemas"]["MessageTargetRequest"] & {
            /** @description 空字符串表示取消回应。 */
            emoji?: string;
        };
        MessageRevokeRequest: components["schemas"]["MessageTargetRequest"];
        MessageTargetRequest: {
            account_id: string;
            conversation_id: string;
            message_id: string;
            /** @description 目标消息作者标识；缺省通常表示账号自身。 */
            sender_id?: string;
        };
        OkData: {
            /** @constant */
            ok: true;
        };
        /**
         * @description 正式对外开放的 provider 名称；实际可分配区域以 provider regions 接口为准。
         * @enum {string}
         */
        ProviderName: "telegram" | "whatsapp" | "line" | "twitter" | "x" | "zalo" | "tiktok";
        /** @description 账号在 provider 侧的公开资料。下列为标准字段，其他字段可能因 provider 而异。 */
        ProviderProfile: {
            /** @description 账号头像 URL。 */
            avatar_url?: string;
            bio?: string;
            display_name?: string;
            first_name?: string;
            /** @description provider 侧账号标识。WhatsApp 在资料同步完成后返回 canonical LID（格式为 `{account}@lid`）；其他渠道在取得稳定账号标识后返回。该字段在同步完成前可能缺失。 */
            id?: string;
            last_name?: string;
            /** @description 已归一化的账号手机号。 */
            phone?: string;
            username?: string;
        } & {
            [key: string]: unknown;
        };
        ProviderRegionsResponse: {
            provider: components["schemas"]["ProviderName"];
            regions: components["schemas"]["RegionAvailability"][];
        };
        Recipient: {
            /** @description provider 侧接收方 ID。 */
            id: string;
            type: components["schemas"]["ConversationType"];
        };
        RegionAvailability: {
            allocatable: boolean;
            region: string;
            supported: boolean;
        };
        ReplyTo: {
            /** @description 来自入站事件 `data.message.reply_token` 或发送成功后 `SendMessageResult.reply_token` 的不透明句柄；调用时应原样回传。 */
            reply_token: string;
        };
        ResponseMeta: {
            /** @description 当客户端请求头传入合法 `X-Request-Id` 时回显。 */
            client_request_id?: string;
            /** @description 服务端生成的请求 ID。 */
            request_id?: string;
        };
        RuntimeActionResult: {
            account_id: string;
            /** @enum {string} */
            action: "refresh_status" | "start" | "stop" | "reconnect";
            /** @example succeeded */
            operation_status: string;
            provider: components["schemas"]["ProviderName"];
            runtime_error: string;
            runtime_status: components["schemas"]["RuntimeStatus"];
        };
        /** @enum {string} */
        RuntimeStatus: "unknown" | "starting" | "running" | "stopping" | "stopped" | "reconnecting" | "disconnected" | "error";
        SendMessageRequest: {
            account_id: string;
            mentions?: components["schemas"]["Mention"][];
            message: components["schemas"]["MessagePayload"];
            provider_data?: components["schemas"]["FreeFormObject"];
            reply_to?: components["schemas"]["ReplyTo"];
            to: components["schemas"]["Recipient"];
        };
        SendMessageResult: {
            account_id: string;
            message_id: string;
            provider_ref?: string;
            /** @description WhatsApp 发送成功后可能同步返回不透明引用句柄；无法生成稳定句柄时省略。该值按敏感数据处理，不要写入日志。 */
            reply_token?: string;
            /** @example accepted */
            status: string;
        };
        /** @enum {string} */
        StandardEventType: "*" | "message.received" | "message.updated" | "message.deleted" | "message.read" | "message.reaction" | "message.delivered" | "conversation.updated" | "conversation.deleted" | "conversation.cleared" | "conversation.history" | "group.updated" | "group.join_request" | "account.status.updated" | "account.started" | "account.history.synced" | "account.auth.required" | "account.auth.succeeded" | "account.auth.failed";
        WebhookEndpoint: {
            id: string;
            retry_policy?: components["schemas"]["FreeFormObject"];
            signing_enabled: boolean;
            status: string;
            subscribed_events?: components["schemas"]["StandardEventType"][];
            /** Format: uri */
            url: string;
        };
        WebhookEndpointRequest: {
            retry_policy?: components["schemas"]["FreeFormObject"];
            /** @description 用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。 */
            signing_secret?: string;
            status: string;
            /** @description 为空或省略表示接收全部事件。 */
            subscribed_events?: components["schemas"]["StandardEventType"][];
            /** Format: uri */
            url: string;
        };
        Workspace: {
            /** Format: uint64 */
            account_quota: number;
            account_quota_unlimited: boolean;
            metadata?: {
                [key: string]: string;
            };
            name: string;
            status: string;
        };
        WorkspaceUpdateRequest: {
            metadata?: {
                [key: string]: string;
            };
            name: string;
            status: string;
        };
    };
    responses: {
        /** @description provider 动作结果。字段随 action 与 provider 不同而变化。 */
        ActionResult: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ResponseMeta"] & {
                    data: components["schemas"]["FreeFormObject"];
                };
            };
        };
        /** @description 当前 provider 能力不可用。 */
        BadGateway: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 请求体或参数非法。 */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 请求与当前资源状态冲突。 */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 服务端内部错误或 provider 链路未映射错误。 */
        InternalError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 资源不存在或路由不存在。 */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 操作成功。 */
        OkResult: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ResponseMeta"] & {
                    data: components["schemas"]["OkData"];
                };
            };
        };
        /** @description 账号运行态动作结果。 */
        RuntimeActionResult: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ResponseMeta"] & {
                    data: components["schemas"]["RuntimeActionResult"];
                };
            };
        };
        /** @description 服务暂不可用。 */
        ServiceUnavailable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 缺少或无法校验 API Key。 */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 当前 provider 不支持该能力。 */
        UnsupportedByProvider: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
        AccountId: string;
        /** @description provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。 */
        ConversationIdQuery: string;
        /** @description 会话类型。 */
        ConversationType: components["schemas"]["ConversationType"];
        /** @description 会话类型过滤，支持逗号分隔多选。 */
        ConversationTypeFilter: string;
        /** @description 上一次响应返回的 `next_cursor`。 */
        Cursor: string;
        /** @description Webhook endpoint public_id，例如 `we_xxx`。 */
        EndpointId: string;
        /** @description API Key public_id，例如 `ak_xxx`。 */
        KeyId: string;
        /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
        Limit: number;
        Provider: components["schemas"]["ProviderName"];
    };
    requestBodies: {
        /** @description provider 动作参数。不同 provider 可能支持不同字段；空对象表示不传额外参数。 */
        ActionParams: {
            content: {
                "application/json": components["schemas"]["FreeFormObject"];
            };
        };
        ContactId: {
            content: {
                "application/json": components["schemas"]["ContactIdRequest"];
            };
        };
        ConversationId: {
            content: {
                "application/json": components["schemas"]["ConversationIdRequest"];
            };
        };
        GroupId: {
            content: {
                "application/json": components["schemas"]["GroupIdRequest"];
            };
        };
    };
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listAccounts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当前 workspace 下的账号列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Account"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AccountRequest"];
            };
        };
        responses: {
            /** @description 创建成功。 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Account"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    getAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 账号详情。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Account"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 删除成功，无响应体。 */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    updateAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AccountRequest"];
            };
        };
        responses: {
            /** @description 更新后的账号。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Account"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
        };
    };
    getAccountAuthState: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当前授权状态。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["AccountSession"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    cancelAccountAuth: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    submitAccountAuthCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        /** @description provider 授权参数。常见字段为 `code`。 */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["FreeFormObject"];
            };
        };
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    submitAccountAuthPassword: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        /** @description provider 授权参数。常见字段为 `password`。 */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["FreeFormObject"];
            };
        };
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    checkAccountQrAuth: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    startAccountQrAuth: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    importAccountAuthSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        /** @description provider 授权参数。常见字段为 `session_url`。 */
        requestBody?: {
            content: {
                "application/json": components["schemas"]["FreeFormObject"];
            };
        };
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    startAccountAuth: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["ActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    listContacts: {
        parameters: {
            query?: {
                /** @description 上一次响应返回的 `next_cursor`。 */
                cursor?: components["parameters"]["Cursor"];
                /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
                limit?: components["parameters"]["Limit"];
                /** @description 关键字过滤。 */
                q?: string;
                /** @description RFC3339 时间戳，只返回此时间后更新的联系人；provider 不支持时可能退化为全量。 */
                updated_since?: string;
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 联系人分页列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ContactListResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    blockContact: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ContactId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listContactBlocklist: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 黑名单列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ContactBlocklistResult"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    getContact: {
        parameters: {
            query: {
                /** @description provider 侧联系人 ID，因可能包含 `@` 等字符，固定走 query。 */
                contact_id: string;
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 联系人详情。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Contact"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    setContactNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContactNoteRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    unblockContact: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ContactId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listConversations: {
        parameters: {
            query?: {
                /** @description 上一次响应返回的 `next_cursor`。 */
                cursor?: components["parameters"]["Cursor"];
                /** @description 按会话标签过滤。 */
                label_id?: string;
                /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
                limit?: components["parameters"]["Limit"];
                /** @description 会话类型过滤，支持逗号分隔多选。 */
                type?: components["parameters"]["ConversationTypeFilter"];
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 会话分页列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationListResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    getConversation: {
        parameters: {
            query: {
                /** @description provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。 */
                conversation_id: components["parameters"]["ConversationIdQuery"];
                /** @description 会话类型。 */
                type?: components["parameters"]["ConversationType"];
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 会话详情。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Conversation"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listConversationLabels: {
        parameters: {
            query?: {
                /** @description 上一次响应返回的 `next_cursor`。 */
                cursor?: components["parameters"]["Cursor"];
                /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 会话标签分页列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationLabelListResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    setConversationLabelMembers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationLabelMembersRequest"];
            };
        };
        responses: {
            /** @description 标签成员操作结果。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationLabelMembersResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    deleteConversationLabel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationLabelDeleteRequest"];
            };
        };
        responses: {
            /** @description 删除结果。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationLabelDeleteResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    upsertConversationLabel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationLabelUpsertRequest"];
            };
        };
        responses: {
            /** @description 新建或更新后的标签。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationLabel"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listConversationMembers: {
        parameters: {
            query: {
                /** @description provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。 */
                conversation_id: components["parameters"]["ConversationIdQuery"];
                /** @description 上一次响应返回的 `next_cursor`。 */
                cursor?: components["parameters"]["Cursor"];
                /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
                limit?: components["parameters"]["Limit"];
                /** @description 会话类型。 */
                type?: components["parameters"]["ConversationType"];
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 会话成员分页列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ConversationMemberListResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    muteConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationMuteRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    pinConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ConversationId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    markConversationRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationReadRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    unmuteConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ConversationId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    unpinConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ConversationId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    markConversationUnread: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ConversationId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listGroups: {
        parameters: {
            query?: {
                /** @description 上一次响应返回的 `next_cursor`。 */
                cursor?: components["parameters"]["Cursor"];
                /** @description 每页数量；未提供时的默认值可能因 provider 而异。 */
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 群组分页列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["GroupListResult"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    createGroup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GroupCreateRequest"];
            };
        };
        responses: {
            /** @description 创建成功，返回新群 ID。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["GroupCreateResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    getGroup: {
        parameters: {
            query: {
                /** @description provider 侧群 ID，因可能包含 `@` 等字符，固定走 query。 */
                group_id: string;
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 群组详情。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Group"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    getGroupInviteCode: {
        parameters: {
            query: {
                /** @description provider 侧群 ID。 */
                group_id: string;
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 邀请信息。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["GroupInviteCode"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    setGroupJoinApprovalMode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GroupJoinApprovalModeRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listGroupJoinRequests: {
        parameters: {
            query: {
                /** @description provider 侧群 ID。 */
                group_id: string;
            };
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 入群申请列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["GroupJoinRequestsResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    updateGroupJoinRequests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GroupJoinRequestsUpdateRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    leaveGroup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["GroupId"];
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    updateGroupMembers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GroupMemberUpdateRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    updateGroupInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GroupInfoUpdateRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    reconnectAccountRuntime: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["RuntimeActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    refreshAccountRuntime: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["RuntimeActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    startAccountRuntime: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["RuntimeActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    stopAccountRuntime: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Device API 签发的账号 public_id，例如 `acc_xxx`。 */
                account_id: components["parameters"]["AccountId"];
            };
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["ActionParams"];
        responses: {
            200: components["responses"]["RuntimeActionResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            502: components["responses"]["BadGateway"];
        };
    };
    listApiKeys: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description API Key 列表。不会返回完整明文 API Key。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["APIKey"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createApiKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["APIKeyCreateRequest"];
            };
        };
        responses: {
            /** @description 创建成功，返回一次性明文 API Key 与可持久展示的 Key 元数据。 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["APIKeyCreateResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    updateApiKeyStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description API Key public_id，例如 `ak_xxx`。 */
                key_id: components["parameters"]["KeyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["APIKeyStatusUpdateRequest"];
            };
        };
        responses: {
            /** @description 更新后的 API Key 元数据。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["APIKey"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    rotateApiKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description API Key public_id，例如 `ak_xxx`。 */
                key_id: components["parameters"]["KeyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["APIKeyCreateRequest"];
            };
        };
        responses: {
            /** @description 轮换成功。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["APIKeyCreateResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    sendMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendMessageRequest"];
            };
        };
        responses: {
            /** @description 消息发送请求已被接收或完成。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["SendMessageResult"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    editMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessageEditRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    pinMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessagePinRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    reactMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessageReactionRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    revokeMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessageRevokeRequest"];
            };
        };
        responses: {
            200: components["responses"]["OkResult"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            409: components["responses"]["Conflict"];
            500: components["responses"]["InternalError"];
            501: components["responses"]["UnsupportedByProvider"];
            502: components["responses"]["BadGateway"];
        };
    };
    listProviderRegions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                provider: components["parameters"]["Provider"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description provider 支持的 region 及是否可分配。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["ProviderRegionsResponse"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listWebhookEndpoints: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Webhook endpoint 列表。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["WebhookEndpoint"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookEndpointRequest"];
            };
        };
        responses: {
            /** @description 创建成功。 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    getWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Webhook endpoint public_id，例如 `we_xxx`。 */
                endpoint_id: components["parameters"]["EndpointId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Webhook endpoint 详情。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Webhook endpoint public_id，例如 `we_xxx`。 */
                endpoint_id: components["parameters"]["EndpointId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 删除成功，无响应体。 */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    updateWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Webhook endpoint public_id，例如 `we_xxx`。 */
                endpoint_id: components["parameters"]["EndpointId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookEndpointRequest"];
            };
        };
        responses: {
            /** @description 更新后的 webhook endpoint。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    deactivateWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Webhook endpoint public_id，例如 `we_xxx`。 */
                endpoint_id: components["parameters"]["EndpointId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 停用后的 webhook endpoint。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["WebhookEndpoint"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    getWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当前 workspace 信息。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Workspace"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkspaceUpdateRequest"];
            };
        };
        responses: {
            /** @description 更新后的 workspace 信息。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMeta"] & {
                        data: components["schemas"]["Workspace"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
}
