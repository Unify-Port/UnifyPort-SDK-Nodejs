/**
 * 此文件由 `pnpm generate` 根据 contracts/device.openapi.yaml 生成。
 * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。
 */
import createClient, { type Client, type FetchOptions } from "openapi-fetch";

import { createDeviceRuntime } from "../../core/runtime.js";
import type {
  ApiResult,
  ApiRuntime,
  DeviceClientConfig,
  OperationData,
  RequestExecutionOptions,
} from "../../core/types.js";
import { deviceOperations } from "./operation-catalog.js";
import type { operations, paths } from "./schema.js";

export class UnifyPortDeviceClient {
  readonly #runtime: ApiRuntime;
  readonly #client: Client<paths>;

  public constructor(config: DeviceClientConfig) {
    this.#runtime = createDeviceRuntime(config);
    // 底层 OpenAPI client 保持私有，避免绕过安全整数解析、错误归一化和 operation policy。
    this.#client = createClient<paths>({
      baseUrl: this.#runtime.baseUrl,
      fetch: this.#runtime.rawFetch,
    });
  }

  /** 封锁联系人 */
  public async blockContact(
    request: FetchOptions<operations["blockContact"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["blockContact"]>>> {
    const operation = deviceOperations["blockContact"];
    return await this.#runtime.execute<OperationData<operations["blockContact"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/contacts/block", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 取消授权流程 */
  public async cancelAccountAuth(
    request: FetchOptions<operations["cancelAccountAuth"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["cancelAccountAuth"]>>> {
    const operation = deviceOperations["cancelAccountAuth"];
    return await this.#runtime.execute<OperationData<operations["cancelAccountAuth"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/cancel", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 检查二维码授权结果 */
  public async checkAccountQrAuth(
    request: FetchOptions<operations["checkAccountQrAuth"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["checkAccountQrAuth"]>>> {
    const operation = deviceOperations["checkAccountQrAuth"];
    return await this.#runtime.execute<OperationData<operations["checkAccountQrAuth"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/qr/check", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 创建账号 */
  public async createAccount(
    request: FetchOptions<operations["createAccount"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["createAccount"]>>> {
    const operation = deviceOperations["createAccount"];
    return await this.#runtime.execute<OperationData<operations["createAccount"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 创建 API Key */
  public async createApiKey(
    request: FetchOptions<operations["createApiKey"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["createApiKey"]>>> {
    const operation = deviceOperations["createApiKey"];
    return await this.#runtime.execute<OperationData<operations["createApiKey"]>>(operation, async () =>
      await this.#client.POST("/v1/api-keys", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 创建群组 */
  public async createGroup(
    request: FetchOptions<operations["createGroup"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["createGroup"]>>> {
    const operation = deviceOperations["createGroup"];
    return await this.#runtime.execute<OperationData<operations["createGroup"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/create", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 创建 webhook endpoint */
  public async createWebhookEndpoint(
    request: FetchOptions<operations["createWebhookEndpoint"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["createWebhookEndpoint"]>>> {
    const operation = deviceOperations["createWebhookEndpoint"];
    return await this.#runtime.execute<OperationData<operations["createWebhookEndpoint"]>>(operation, async () =>
      await this.#client.POST("/v1/webhook-endpoints", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 停用 webhook endpoint */
  public async deactivateWebhookEndpoint(
    request: FetchOptions<operations["deactivateWebhookEndpoint"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["deactivateWebhookEndpoint"]>>> {
    const operation = deviceOperations["deactivateWebhookEndpoint"];
    return await this.#runtime.execute<OperationData<operations["deactivateWebhookEndpoint"]>>(operation, async () =>
      await this.#client.POST("/v1/webhook-endpoints/{endpoint_id}/deactivate", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 删除账号 */
  public async deleteAccount(
    request: FetchOptions<operations["deleteAccount"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["deleteAccount"]>>> {
    const operation = deviceOperations["deleteAccount"];
    return await this.#runtime.execute<OperationData<operations["deleteAccount"]>>(operation, async () =>
      await this.#client.DELETE("/v1/accounts/{account_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 删除会话标签 */
  public async deleteConversationLabel(
    request: FetchOptions<operations["deleteConversationLabel"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["deleteConversationLabel"]>>> {
    const operation = deviceOperations["deleteConversationLabel"];
    return await this.#runtime.execute<OperationData<operations["deleteConversationLabel"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/labels/delete", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 删除 webhook endpoint */
  public async deleteWebhookEndpoint(
    request: FetchOptions<operations["deleteWebhookEndpoint"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["deleteWebhookEndpoint"]>>> {
    const operation = deviceOperations["deleteWebhookEndpoint"];
    return await this.#runtime.execute<OperationData<operations["deleteWebhookEndpoint"]>>(operation, async () =>
      await this.#client.DELETE("/v1/webhook-endpoints/{endpoint_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 编辑消息文本 */
  public async editMessage(
    request: FetchOptions<operations["editMessage"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["editMessage"]>>> {
    const operation = deviceOperations["editMessage"];
    return await this.#runtime.execute<OperationData<operations["editMessage"]>>(operation, async () =>
      await this.#client.POST("/v1/messages/edit", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取账号详情 */
  public async getAccount(
    request: FetchOptions<operations["getAccount"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getAccount"]>>> {
    const operation = deviceOperations["getAccount"];
    return await this.#runtime.execute<OperationData<operations["getAccount"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取账号授权状态 */
  public async getAccountAuthState(
    request: FetchOptions<operations["getAccountAuthState"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getAccountAuthState"]>>> {
    const operation = deviceOperations["getAccountAuthState"];
    return await this.#runtime.execute<OperationData<operations["getAccountAuthState"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/auth", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取联系人详情 */
  public async getContact(
    request: FetchOptions<operations["getContact"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getContact"]>>> {
    const operation = deviceOperations["getContact"];
    return await this.#runtime.execute<OperationData<operations["getContact"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/contacts/info", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取会话详情 */
  public async getConversation(
    request: FetchOptions<operations["getConversation"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getConversation"]>>> {
    const operation = deviceOperations["getConversation"];
    return await this.#runtime.execute<OperationData<operations["getConversation"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/conversations/info", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取群组详情 */
  public async getGroup(
    request: FetchOptions<operations["getGroup"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getGroup"]>>> {
    const operation = deviceOperations["getGroup"];
    return await this.#runtime.execute<OperationData<operations["getGroup"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/groups/info", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取群邀请链接或邀请码 */
  public async getGroupInviteCode(
    request: FetchOptions<operations["getGroupInviteCode"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getGroupInviteCode"]>>> {
    const operation = deviceOperations["getGroupInviteCode"];
    return await this.#runtime.execute<OperationData<operations["getGroupInviteCode"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/groups/invite-code", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取 webhook endpoint */
  public async getWebhookEndpoint(
    request: FetchOptions<operations["getWebhookEndpoint"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getWebhookEndpoint"]>>> {
    const operation = deviceOperations["getWebhookEndpoint"];
    return await this.#runtime.execute<OperationData<operations["getWebhookEndpoint"]>>(operation, async () =>
      await this.#client.GET("/v1/webhook-endpoints/{endpoint_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 获取当前 workspace */
  public async getWorkspace(
    request: FetchOptions<operations["getWorkspace"]> = {},
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["getWorkspace"]>>> {
    const operation = deviceOperations["getWorkspace"];
    return await this.#runtime.execute<OperationData<operations["getWorkspace"]>>(operation, async () =>
      await this.#client.GET("/v1/workspace", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 导入会话授权 */
  public async importAccountAuthSession(
    request: FetchOptions<operations["importAccountAuthSession"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["importAccountAuthSession"]>>> {
    const operation = deviceOperations["importAccountAuthSession"];
    return await this.#runtime.execute<OperationData<operations["importAccountAuthSession"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/session", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 退出群组 */
  public async leaveGroup(
    request: FetchOptions<operations["leaveGroup"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["leaveGroup"]>>> {
    const operation = deviceOperations["leaveGroup"];
    return await this.#runtime.execute<OperationData<operations["leaveGroup"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/leave", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出账号 */
  public async listAccounts(
    request: FetchOptions<operations["listAccounts"]> = {},
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listAccounts"]>>> {
    const operation = deviceOperations["listAccounts"];
    return await this.#runtime.execute<OperationData<operations["listAccounts"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出 API Key */
  public async listApiKeys(
    request: FetchOptions<operations["listApiKeys"]> = {},
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listApiKeys"]>>> {
    const operation = deviceOperations["listApiKeys"];
    return await this.#runtime.execute<OperationData<operations["listApiKeys"]>>(operation, async () =>
      await this.#client.GET("/v1/api-keys", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 查询联系人黑名单 */
  public async listContactBlocklist(
    request: FetchOptions<operations["listContactBlocklist"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listContactBlocklist"]>>> {
    const operation = deviceOperations["listContactBlocklist"];
    return await this.#runtime.execute<OperationData<operations["listContactBlocklist"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/contacts/blocklist", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出联系人 */
  public async listContacts(
    request: FetchOptions<operations["listContacts"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listContacts"]>>> {
    const operation = deviceOperations["listContacts"];
    return await this.#runtime.execute<OperationData<operations["listContacts"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/contacts", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出会话标签 */
  public async listConversationLabels(
    request: FetchOptions<operations["listConversationLabels"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listConversationLabels"]>>> {
    const operation = deviceOperations["listConversationLabels"];
    return await this.#runtime.execute<OperationData<operations["listConversationLabels"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/conversations/labels", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出会话成员 */
  public async listConversationMembers(
    request: FetchOptions<operations["listConversationMembers"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listConversationMembers"]>>> {
    const operation = deviceOperations["listConversationMembers"];
    return await this.#runtime.execute<OperationData<operations["listConversationMembers"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/conversations/members", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出会话 */
  public async listConversations(
    request: FetchOptions<operations["listConversations"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listConversations"]>>> {
    const operation = deviceOperations["listConversations"];
    return await this.#runtime.execute<OperationData<operations["listConversations"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/conversations", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出待审批入群申请 */
  public async listGroupJoinRequests(
    request: FetchOptions<operations["listGroupJoinRequests"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listGroupJoinRequests"]>>> {
    const operation = deviceOperations["listGroupJoinRequests"];
    return await this.#runtime.execute<OperationData<operations["listGroupJoinRequests"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/groups/join-requests", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出群组 */
  public async listGroups(
    request: FetchOptions<operations["listGroups"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listGroups"]>>> {
    const operation = deviceOperations["listGroups"];
    return await this.#runtime.execute<OperationData<operations["listGroups"]>>(operation, async () =>
      await this.#client.GET("/v1/accounts/{account_id}/groups", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 查询 provider 地区可用性 */
  public async listProviderRegions(
    request: FetchOptions<operations["listProviderRegions"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listProviderRegions"]>>> {
    const operation = deviceOperations["listProviderRegions"];
    return await this.#runtime.execute<OperationData<operations["listProviderRegions"]>>(operation, async () =>
      await this.#client.GET("/v1/providers/{provider}/regions", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 列出 webhook endpoint */
  public async listWebhookEndpoints(
    request: FetchOptions<operations["listWebhookEndpoints"]> = {},
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["listWebhookEndpoints"]>>> {
    const operation = deviceOperations["listWebhookEndpoints"];
    return await this.#runtime.execute<OperationData<operations["listWebhookEndpoints"]>>(operation, async () =>
      await this.#client.GET("/v1/webhook-endpoints", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 标记会话已读 */
  public async markConversationRead(
    request: FetchOptions<operations["markConversationRead"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["markConversationRead"]>>> {
    const operation = deviceOperations["markConversationRead"];
    return await this.#runtime.execute<OperationData<operations["markConversationRead"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/read", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 标记会话未读 */
  public async markConversationUnread(
    request: FetchOptions<operations["markConversationUnread"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["markConversationUnread"]>>> {
    const operation = deviceOperations["markConversationUnread"];
    return await this.#runtime.execute<OperationData<operations["markConversationUnread"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/unread", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 静音会话 */
  public async muteConversation(
    request: FetchOptions<operations["muteConversation"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["muteConversation"]>>> {
    const operation = deviceOperations["muteConversation"];
    return await this.#runtime.execute<OperationData<operations["muteConversation"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/mute", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 置顶会话 */
  public async pinConversation(
    request: FetchOptions<operations["pinConversation"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["pinConversation"]>>> {
    const operation = deviceOperations["pinConversation"];
    return await this.#runtime.execute<OperationData<operations["pinConversation"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/pin", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 置顶或取消置顶消息 */
  public async pinMessage(
    request: FetchOptions<operations["pinMessage"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["pinMessage"]>>> {
    const operation = deviceOperations["pinMessage"];
    return await this.#runtime.execute<OperationData<operations["pinMessage"]>>(operation, async () =>
      await this.#client.POST("/v1/messages/pin", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 给消息加表情回应或取消回应 */
  public async reactMessage(
    request: FetchOptions<operations["reactMessage"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["reactMessage"]>>> {
    const operation = deviceOperations["reactMessage"];
    return await this.#runtime.execute<OperationData<operations["reactMessage"]>>(operation, async () =>
      await this.#client.POST("/v1/messages/reaction", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 重连账号运行态 */
  public async reconnectAccountRuntime(
    request: FetchOptions<operations["reconnectAccountRuntime"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["reconnectAccountRuntime"]>>> {
    const operation = deviceOperations["reconnectAccountRuntime"];
    return await this.#runtime.execute<OperationData<operations["reconnectAccountRuntime"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/runtime/reconnect", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 刷新账号运行态 */
  public async refreshAccountRuntime(
    request: FetchOptions<operations["refreshAccountRuntime"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["refreshAccountRuntime"]>>> {
    const operation = deviceOperations["refreshAccountRuntime"];
    return await this.#runtime.execute<OperationData<operations["refreshAccountRuntime"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/runtime/refresh", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 撤回消息 */
  public async revokeMessage(
    request: FetchOptions<operations["revokeMessage"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["revokeMessage"]>>> {
    const operation = deviceOperations["revokeMessage"];
    return await this.#runtime.execute<OperationData<operations["revokeMessage"]>>(operation, async () =>
      await this.#client.POST("/v1/messages/revoke", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 轮换 API Key */
  public async rotateApiKey(
    request: FetchOptions<operations["rotateApiKey"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["rotateApiKey"]>>> {
    const operation = deviceOperations["rotateApiKey"];
    return await this.#runtime.execute<OperationData<operations["rotateApiKey"]>>(operation, async () =>
      await this.#client.POST("/v1/api-keys/{key_id}/rotate", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 发送消息 */
  public async sendMessage(
    request: FetchOptions<operations["sendMessage"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["sendMessage"]>>> {
    const operation = deviceOperations["sendMessage"];
    return await this.#runtime.execute<OperationData<operations["sendMessage"]>>(operation, async () =>
      await this.#client.POST("/v1/messages", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 设置或清空联系人备注 */
  public async setContactNote(
    request: FetchOptions<operations["setContactNote"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["setContactNote"]>>> {
    const operation = deviceOperations["setContactNote"];
    return await this.#runtime.execute<OperationData<operations["setContactNote"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/contacts/note", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 给会话打标或移除标签 */
  public async setConversationLabelMembers(
    request: FetchOptions<operations["setConversationLabelMembers"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["setConversationLabelMembers"]>>> {
    const operation = deviceOperations["setConversationLabelMembers"];
    return await this.#runtime.execute<OperationData<operations["setConversationLabelMembers"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/labels", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 设置入群审批模式 */
  public async setGroupJoinApprovalMode(
    request: FetchOptions<operations["setGroupJoinApprovalMode"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["setGroupJoinApprovalMode"]>>> {
    const operation = deviceOperations["setGroupJoinApprovalMode"];
    return await this.#runtime.execute<OperationData<operations["setGroupJoinApprovalMode"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/join-approval-mode", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 启动验证码类授权 */
  public async startAccountAuth(
    request: FetchOptions<operations["startAccountAuth"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["startAccountAuth"]>>> {
    const operation = deviceOperations["startAccountAuth"];
    return await this.#runtime.execute<OperationData<operations["startAccountAuth"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/start", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 启动二维码授权 */
  public async startAccountQrAuth(
    request: FetchOptions<operations["startAccountQrAuth"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["startAccountQrAuth"]>>> {
    const operation = deviceOperations["startAccountQrAuth"];
    return await this.#runtime.execute<OperationData<operations["startAccountQrAuth"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/qr/start", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 启动账号运行态 */
  public async startAccountRuntime(
    request: FetchOptions<operations["startAccountRuntime"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["startAccountRuntime"]>>> {
    const operation = deviceOperations["startAccountRuntime"];
    return await this.#runtime.execute<OperationData<operations["startAccountRuntime"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/runtime/start", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 停止账号运行态 */
  public async stopAccountRuntime(
    request: FetchOptions<operations["stopAccountRuntime"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["stopAccountRuntime"]>>> {
    const operation = deviceOperations["stopAccountRuntime"];
    return await this.#runtime.execute<OperationData<operations["stopAccountRuntime"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/runtime/stop", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 提交验证码 */
  public async submitAccountAuthCode(
    request: FetchOptions<operations["submitAccountAuthCode"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["submitAccountAuthCode"]>>> {
    const operation = deviceOperations["submitAccountAuthCode"];
    return await this.#runtime.execute<OperationData<operations["submitAccountAuthCode"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/code", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 提交二次密码 */
  public async submitAccountAuthPassword(
    request: FetchOptions<operations["submitAccountAuthPassword"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["submitAccountAuthPassword"]>>> {
    const operation = deviceOperations["submitAccountAuthPassword"];
    return await this.#runtime.execute<OperationData<operations["submitAccountAuthPassword"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/auth/password", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 解封联系人 */
  public async unblockContact(
    request: FetchOptions<operations["unblockContact"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["unblockContact"]>>> {
    const operation = deviceOperations["unblockContact"];
    return await this.#runtime.execute<OperationData<operations["unblockContact"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/contacts/unblock", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 取消静音会话 */
  public async unmuteConversation(
    request: FetchOptions<operations["unmuteConversation"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["unmuteConversation"]>>> {
    const operation = deviceOperations["unmuteConversation"];
    return await this.#runtime.execute<OperationData<operations["unmuteConversation"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/unmute", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 取消置顶会话 */
  public async unpinConversation(
    request: FetchOptions<operations["unpinConversation"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["unpinConversation"]>>> {
    const operation = deviceOperations["unpinConversation"];
    return await this.#runtime.execute<OperationData<operations["unpinConversation"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/unpin", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 更新账号 */
  public async updateAccount(
    request: FetchOptions<operations["updateAccount"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateAccount"]>>> {
    const operation = deviceOperations["updateAccount"];
    return await this.#runtime.execute<OperationData<operations["updateAccount"]>>(operation, async () =>
      await this.#client.PATCH("/v1/accounts/{account_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 更新 API Key 状态 */
  public async updateApiKeyStatus(
    request: FetchOptions<operations["updateApiKeyStatus"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateApiKeyStatus"]>>> {
    const operation = deviceOperations["updateApiKeyStatus"];
    return await this.#runtime.execute<OperationData<operations["updateApiKeyStatus"]>>(operation, async () =>
      await this.#client.PATCH("/v1/api-keys/{key_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 修改群信息 */
  public async updateGroupInfo(
    request: FetchOptions<operations["updateGroupInfo"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateGroupInfo"]>>> {
    const operation = deviceOperations["updateGroupInfo"];
    return await this.#runtime.execute<OperationData<operations["updateGroupInfo"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/update-info", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 处理入群申请 */
  public async updateGroupJoinRequests(
    request: FetchOptions<operations["updateGroupJoinRequests"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateGroupJoinRequests"]>>> {
    const operation = deviceOperations["updateGroupJoinRequests"];
    return await this.#runtime.execute<OperationData<operations["updateGroupJoinRequests"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/join-requests/update", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 管理群成员 */
  public async updateGroupMembers(
    request: FetchOptions<operations["updateGroupMembers"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateGroupMembers"]>>> {
    const operation = deviceOperations["updateGroupMembers"];
    return await this.#runtime.execute<OperationData<operations["updateGroupMembers"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/groups/members", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 更新 webhook endpoint */
  public async updateWebhookEndpoint(
    request: FetchOptions<operations["updateWebhookEndpoint"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateWebhookEndpoint"]>>> {
    const operation = deviceOperations["updateWebhookEndpoint"];
    return await this.#runtime.execute<OperationData<operations["updateWebhookEndpoint"]>>(operation, async () =>
      await this.#client.PATCH("/v1/webhook-endpoints/{endpoint_id}", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 更新当前 workspace */
  public async updateWorkspace(
    request: FetchOptions<operations["updateWorkspace"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["updateWorkspace"]>>> {
    const operation = deviceOperations["updateWorkspace"];
    return await this.#runtime.execute<OperationData<operations["updateWorkspace"]>>(operation, async () =>
      await this.#client.PATCH("/v1/workspace", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }

  /** 新建或更新会话标签 */
  public async upsertConversationLabel(
    request: FetchOptions<operations["upsertConversationLabel"]>,
    execution: RequestExecutionOptions = {},
  ): Promise<ApiResult<OperationData<operations["upsertConversationLabel"]>>> {
    const operation = deviceOperations["upsertConversationLabel"];
    return await this.#runtime.execute<OperationData<operations["upsertConversationLabel"]>>(operation, async () =>
      await this.#client.POST("/v1/accounts/{account_id}/conversations/labels/upsert", {
        ...request,
        baseUrl: this.#runtime.baseUrl,
        fetch: this.#runtime.createFetch(operation, execution),
        redirect: "error",
          parseAs: "text",
      }),
    );
  }
}
