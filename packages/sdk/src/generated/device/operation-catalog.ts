/**
 * 此文件由 `pnpm generate` 根据 contracts/device.openapi.yaml 生成。
 * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。
 */
import type { OperationMetadata } from "../../core/types.js";

export const deviceOperations = {
  "blockContact": {
    "api": "device",
    "operationId": "blockContact",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/contacts/block",
    "tag": "Contacts",
    "summary": "封锁联系人",
    "description": "",
    "authRequired": true,
    "toolName": "device_block_contact",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ContactIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ContactIdRequest": {
          "type": "object",
          "required": [
            "contact_id"
          ],
          "properties": {
            "contact_id": {
              "type": "string",
              "description": "渠道侧联系人标识。WhatsApp 封锁和解封操作必须传 LID，格式为 `数字@lid`。",
              "example": "123456789012345@lid"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "cancelAccountAuth": {
    "api": "device",
    "operationId": "cancelAccountAuth",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/cancel",
    "tag": "Account Auth",
    "summary": "取消授权流程",
    "description": "",
    "authRequired": true,
    "toolName": "device_cancel_account_auth",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "checkAccountQrAuth": {
    "api": "device",
    "operationId": "checkAccountQrAuth",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/qr/check",
    "tag": "Account Auth",
    "summary": "检查二维码授权结果",
    "description": "轮询二维码授权状态。普通二维码步骤通过 `auth_payload.qr_code` 返回二维码； WhatsApp 授权也可能进入 `passkey_required`，此时调用方应使用 `auth_payload.public_key` 发起 WebAuthn 操作，而不能继续把响应当作二维码。 渠道历史兼容字段可能随普通二维码结果一并返回，调用方应以 `status`、`auth_status` 和 `auth_payload` 标准字段为准。Passkey 结果不会把 Provider 原始 `code` 或 `info` 作为公共字段返回。 Provider 返回空状态且没有二维码或 Passkey 载荷时，平台不会用该空结果覆盖当前 Session。已有 `authorized`、`failed`、`cancelled`、`expired` 或 Passkey 状态按 当前快照返回；Provider 明确返回终态时会清除旧二维码和原始兼容载荷，不会回放 已失效的认证材料。没有可确认状态时返回 409 `provider_not_ready`。",
    "authRequired": true,
    "toolName": "device_check_account_qr_auth",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/QRAuthCheckData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "QRAuthCheckData": {
          "type": "object",
          "description": "二维码授权检查的标准结果。字段可能因渠道和当前步骤扩展；调用方应优先读取 `status`、`auth_status` 和 `auth_payload`。TikTok 扫码后可能返回 `awaiting_code`，自动处理验证码时返回 `pending`。`account_id`、`expires_at` 等字段不是所有 Provider 都稳定返回，因此不作为必填字段。",
          "properties": {
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "const": "check_qr_auth"
            },
            "status": {
              "type": "string",
              "description": "当前授权流程状态，例如 `awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required` 或 `authorized`。"
            },
            "auth_status": {
              "type": "string",
              "description": "与当前授权步骤对应的标准状态，通常与 `status` 一致。"
            },
            "auth_payload": {
              "$ref": "#/$defs/QRAuthCheckPayload"
            }
          },
          "additionalProperties": true
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "QRAuthCheckPayload": {
          "type": "object",
          "description": "当前步骤所需的标准载荷。普通二维码使用 `qr_code`；验证码步骤使用 `type=code`；Passkey 使用 `type=passkey` 和 `public_key`。互斥步骤的载荷 不会同时出现。",
          "properties": {
            "type": {
              "type": "string",
              "description": "当前载荷类型；验证码步骤为 `code`，Passkey 步骤为 `passkey`。"
            },
            "qr_code": {
              "type": "string",
              "description": "普通二维码内容或可直接展示的二维码 data URL。"
            },
            "public_key": {
              "$ref": "#/$defs/FreeFormObject"
            }
          },
          "additionalProperties": true
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "confirmAccountPasskey": {
    "api": "device",
    "operationId": "confirmAccountPasskey",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/passkey-confirm",
    "tag": "Account Auth",
    "summary": "确认 Passkey 授权",
    "description": "确认当前账号授权流程中等待用户确认的 Passkey 挑战。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。",
    "authRequired": true,
    "toolName": "device_confirm_account_passkey",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "createAccount": {
    "api": "device",
    "operationId": "createAccount",
    "method": "POST",
    "path": "/v1/accounts",
    "tag": "Accounts",
    "summary": "创建账号",
    "description": "`region` 表示默认网络出口地区；指定自定义 `proxy` 时沿用原代理规则。已有账号不会因默认分配策略调整而迁移。 额度和余额模式没有合格默认容量时可能返回 409 `egress_region_unavailable`（20031）；配置暂不可确认返回 409 `egress_configuration_pending`（20032）；默认分配暂时关闭返回 503 `network_maintenance`（20035）。 额度模式创建不提供请求去重或历史结果重放；响应结果不明时请先核对账号列表，避免重复创建。 额度模式兼容原请求；余额模式直接创建，在同一事务内按当前梯度核价并扣款，不需要报价接口。 余额模式优先使用所选地区的直连容量；没有直连候选且未指定自定义 `proxy` 时，Telegram、WhatsApp 和 WhatsApp Protocol TCP 可使用已启用的平台代理补充。未开放的渠道仍沿用原分配规则。 代理分配与核价扣款原子提交；分配竞争或配置不可用不会自动改选其他候选。删除或退款完成不保证该地区立即有新容量。 同一工作区同步建号执行中，第二笔请求立即返回 409 wallet_account_creation_in_progress（20030）；请等待前一笔完成。 Idempotency-Key 可选。同工作区同键同参数返回原账号和周期，不重复扣款；同键异请求返回冲突。 未传幂等键时，前一笔完成后的再次请求视为新建号；调用方负责避免重复提交。 有键重试返回首次创建的安全身份与周期快照，即使账号随后删除也不会再次建号或扣款；当前状态请查询原操作。 新建事务提交后计时 720 小时，必要配置异步执行；返回账号不代表已完成渠道授权。 未扫码、重新授权、掉线和重连均不重新扣款或重置周期。本版不执行自动续费或到期停服。 余额不足返回 409 wallet_insufficient_funds（20023）；同键异请求返回 409 wallet_idempotency_conflict（20024）。 新消费关闭返回 409 wallet_workspace_disabled（20022）；资金或配置不可用返回 503 wallet_unavailable（20028）。",
    "authRequired": true,
    "toolName": "device_create_account",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "header": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "Idempotency-Key": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 128,
                  "description": "可选；提供后在工作区范围内唯一，重试时保持同值和同一请求参数。"
                }
              }
            }
          }
        },
        "body": {
          "$ref": "#/$defs/AccountCreateRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "AccountCreateRequest": {
          "type": "object",
          "description": "创建账号请求。`whatsapp-protocol` 凭证只能提交到 `/v1/accounts/{account_id}/auth/session` 的嵌套 `whatsapp-protocol` 对象；不能通过 provider_data 提交。`whatsapp-protocol` 账号不能在该 provider 与其他 provider 之间切换。",
          "required": [
            "provider",
            "region",
            "auth_mode"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderInputName"
            },
            "region": {
              "type": "string",
              "minLength": 1
            },
            "status": {
              "type": "string"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "enum": [
                "qrcode",
                "code",
                "session"
              ]
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string"
            },
            "provider_data": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "TikTok 可设置 `provider_data.enable_comment` 为 Boolean，默认 false；字符串、数字、null 均返回 400 invalid_request。 在线修改后需 reconnect 生效，start 成功不证明配置已应用；关闭不撤回已排队事件。 渠道扩展配置。创建 Telegram 账号时，`provider_data.api_id` 和 `provider_data.api_hash` 均为可选，适用于 `auth_mode=code`、`qrcode` 和 `session`；未指定自定义应用凭证时使用平台默认 Telegram 应用凭证。 使用自定义应用凭证时，请成对提供同一 Telegram 应用的 `api_id` 和 `api_hash`，两者均使用字符串。 需要使用平台默认凭证但默认配置不可用时，创建请求失败；平台调整默认凭证不会自动替换已有账号凭证。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "ProviderInputName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol",
            "x",
            "x_client",
            "twitter_client"
          ],
          "description": "provider 输入名称。兼容 `x`、`x_client`、`twitter_client`，这些输入会归一化为 `twitter` 并以 `twitter` 输出；Webhook URL path 不适用该别名规则。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Account"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Account": {
          "type": "object",
          "required": [
            "id",
            "name",
            "provider",
            "region",
            "status",
            "runtime_status"
          ],
          "examples": [
            {
              "id": "acc_xxx",
              "name": "Customer Support",
              "provider": "whatsapp",
              "region": "sg",
              "status": "active",
              "runtime_status": "running"
            }
          ],
          "properties": {
            "billing": {
              "$ref": "#/$defs/AccountBilling"
            },
            "id": {
              "type": "string",
              "examples": [
                "acc_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string",
              "description": "账号选择的默认网络出口地区。"
            },
            "status": {
              "type": "string",
              "description": "账号资源状态，例如 active、inactive、disabled。"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "description": "授权模式，例如 qrcode、code、session。"
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string",
              "description": "渠道侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "客户显式配置的代理；不返回平台默认出口凭据。"
            },
            "provider_profile": {
              "$ref": "#/$defs/ProviderProfile"
            }
          },
          "allOf": [
            {
              "if": {
                "properties": {
                  "provider": {
                    "not": {
                      "const": "whatsapp"
                    }
                  }
                }
              },
              "then": {
                "properties": {
                  "provider_profile": {
                    "properties": {
                      "device_id": false
                    }
                  }
                }
              }
            }
          ]
        },
        "AccountBilling": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "period_start_at": {
              "type": "string",
              "format": "date-time"
            },
            "period_end_at": {
              "type": "string",
              "format": "date-time"
            },
            "amount_minor": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64",
                  "minimum": 1
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "currency": {
              "const": "USD",
              "type": "string"
            },
            "operation_id": {
              "type": "string"
            },
            "state": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "DELETING",
                "DELETED",
                "COMPENSATED",
                "REVIEW"
              ]
            }
          },
          "required": [
            "period_start_at",
            "period_end_at",
            "amount_minor",
            "currency",
            "operation_id",
            "state"
          ],
          "description": "独立的资金业务状态，不与 runtime_status 混用；周期时间按 RFC 3339 UTC Z 返回。"
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        },
        "ProviderProfile": {
          "type": "object",
          "description": "账号在渠道侧的资料。下列为标准字段，其他字段因渠道而异。",
          "properties": {
            "id": {
              "type": "string",
              "description": "渠道侧账号标识。WhatsApp 返回 LID 格式；该字段在账号资料同步完成前可能缺失。"
            },
            "device_id": {
              "$ref": "#/$defs/WhatsAppDeviceID",
              "description": "仅 WhatsApp 账号详情在可确认当前授权会话时提供的登录设备编号；未知时省略。重新授权后可能变化，不作为永久设备标识，也不用于比较历史消息来源。"
            },
            "phone": {
              "type": "string",
              "description": "账号手机号，已归一化（去除空格、连字符、加号）。"
            },
            "username": {
              "type": "string"
            },
            "display_name": {
              "type": "string",
              "description": "账号展示名称；WhatsApp 按 BusinessName 优先、PushName 回退的规则生成。"
            },
            "push_name": {
              "type": "string",
              "description": "WhatsApp 当前账号设置的 PushName；其他渠道不定义该字段语义。"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp BusinessName；渠道未返回时该字段缺失。"
            },
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string",
              "description": "账号头像 URL。"
            },
            "bio": {
              "type": "string"
            },
            "platform": {
              "type": "string",
              "description": "目前仅 WhatsApp 定义并返回该字段，表示配对时的登录平台标识，按不透明字符串透传。取值集合不封闭，客户端必须兼容未知值；其他渠道不定义该字段语义。该字段与 device_platform 不同。",
              "example": "smba"
            }
          },
          "additionalProperties": true
        },
        "WhatsAppDeviceID": {
          "type": "integer",
          "minimum": 0,
          "maximum": 65535,
          "description": "已确认的 WhatsApp 设备编号；0 是有效值，未知时整个字段省略，不返回 null 或空串。"
        }
      }
    }
  },
  "createAccountAuthSession": {
    "api": "device",
    "operationId": "createAccountAuthSession",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth-sessions",
    "tag": "Account Auth",
    "summary": "创建 Provider 授权会话",
    "description": "为当前账号创建短期有效的 Provider 授权会话，并返回可在浏览器中打开的 `authorize_url`。当前仅支持使用 `qrcode` 授权模式的 WhatsApp 账号。 创建与授权模式切换冲突时返回 `409 provider_not_ready`，重新查询当前模式后再重试。",
    "authRequired": true,
    "toolName": "device_create_account_auth_session",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ProviderAuthSession"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ProviderAuthSession": {
          "type": "object",
          "required": [
            "account_id",
            "provider",
            "auth_mode",
            "status",
            "authorize_url",
            "expires_at",
            "switchable",
            "available_auth_modes"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "auth_mode": {
              "type": "string",
              "examples": [
                "qrcode"
              ]
            },
            "status": {
              "type": "string",
              "examples": [
                "pending_auth",
                "passkey_required",
                "authorized"
              ]
            },
            "auth_payload": {
              "description": "当前授权步骤所需的渠道载荷，结构会随授权状态变化。",
              "allOf": [
                {
                  "$ref": "#/$defs/FreeFormObject"
                }
              ]
            },
            "authorize_url": {
              "type": "string",
              "format": "uri",
              "description": "短期有效的 Provider 授权页面地址，其中包含不透明授权凭证。调用方应将其 作为敏感信息处理，不得写入公开日志或分享给无关用户。"
            },
            "expires_at": {
              "type": "string",
              "format": "date-time"
            },
            "switchable": {
              "type": "boolean",
              "description": "当前授权会话是否允许切换授权模式。"
            },
            "available_auth_modes": {
              "type": "array",
              "description": "当前会话允许使用的授权模式。",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "createApiKey": {
    "api": "device",
    "operationId": "createApiKey",
    "method": "POST",
    "path": "/v1/api-keys",
    "tag": "API Keys",
    "summary": "创建 API Key",
    "description": "完整 `api_key` 只在创建响应中出现一次，客户端应自行保存。",
    "authRequired": true,
    "toolName": "device_create_api_key",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/APIKeyCreateRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "APIKeyCreateRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "prefix": {
              "type": "string",
              "description": "生成 API Key 时使用的前缀。省略时使用默认前缀；不接受 null。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/APIKeyCreateResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "APIKeyCreateResult": {
          "type": "object",
          "required": [
            "key",
            "api_key"
          ],
          "properties": {
            "key": {
              "$ref": "#/$defs/APIKey"
            },
            "api_key": {
              "type": "string",
              "description": "完整明文 API Key，仅创建或轮换响应中出现一次。"
            }
          }
        },
        "APIKey": {
          "type": "object",
          "required": [
            "id",
            "name",
            "key_prefix",
            "status"
          ],
          "properties": {
            "id": {
              "type": "string",
              "examples": [
                "ak_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "key_prefix": {
              "type": "string",
              "description": "可展示的 Key 前缀，不是完整 API Key。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            }
          }
        }
      }
    }
  },
  "createCall": {
    "api": "device",
    "operationId": "createCall",
    "method": "POST",
    "path": "/v1/calls",
    "tag": "Calls",
    "summary": "准备主动通话",
    "description": "仅 is_beta=true 的内测工作区可用；普通工作区返回 403 beta_feature_not_enabled（41002）。呼入暂未开放，内测资格不会自动开启呼入。 为 WhatsApp 账号准备单聊语音或视频呼叫。创建成功仅表示准备完成，不会立即拨号。 to 与发送消息使用相同的 {id,type} 结构；id 填当前账号下的 conversation_id，type 填会话类型。 首期仅支持 WhatsApp 的 user 目标，id 必须是数字用户标识组成的 @lid 或 @s.whatsapp.net 单聊 JID，最长 128 字符；不支持裸手机号或字符串形式的 to。 group、channel 及其他尚未支持通话的渠道返回 501 unsupported_by_provider；WhatsApp user 目标 JID 无效返回 400 provider_invalid_request。 用户在 expires_at 前打开 join_url，允许麦克风并点击 Start call，媒体连接后才开始拨号。 视频通话的摄像头可选；未允许摄像头时仍可收看远端视频和语音通话。 一个账号最多同时保留一通活跃通话；准备期从创建通话起默认 2 分钟，可由服务端调整，实际截止时间以 expires_at 为准，过期后需重新创建。此期限不限制已接通通话的时长。 join_url 是短期一次性访问链接，应原样传递给预期用户，禁止写入日志或公开分享。 接通和结束通过 call.answered、call.ended 事件通知；内测工作区可使用通配订阅或逐项订阅，外呼不会产生 call.incoming。",
    "authRequired": true,
    "toolName": "device_create_call",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/CreateCallRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "CreateCallRequest": {
          "type": "object",
          "required": [
            "account_id",
            "to",
            "media_type"
          ],
          "properties": {
            "account_id": {
              "type": "string",
              "pattern": "^acc_[A-Za-z0-9][A-Za-z0-9_-]*$",
              "description": "当前工作空间内账号的公开 ID。"
            },
            "to": {
              "allOf": [
                {
                  "$ref": "#/$defs/Recipient"
                }
              ],
              "description": "与发送消息共用目标结构，id 使用 conversation_id。首期仅支持 WhatsApp user 的数字 @lid 或 @s.whatsapp.net 单聊 JID（最长 128 字符），不接受手机号字符串；group、channel 暂不支持。"
            },
            "media_type": {
              "type": "string",
              "enum": [
                "voice",
                "video"
              ]
            }
          }
        },
        "Recipient": {
          "type": "object",
          "required": [
            "id",
            "type"
          ],
          "properties": {
            "id": {
              "type": "string",
              "minLength": 1,
              "description": "渠道侧接收方标识。"
            },
            "type": {
              "$ref": "#/$defs/ConversationType"
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/CreateCallData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "CreateCallData": {
          "type": "object",
          "required": [
            "call_id",
            "direction",
            "media_type",
            "state",
            "join_url",
            "expires_at"
          ],
          "properties": {
            "call_id": {
              "type": "string"
            },
            "direction": {
              "type": "string",
              "enum": [
                "outbound"
              ]
            },
            "media_type": {
              "type": "string",
              "enum": [
                "voice",
                "video"
              ]
            },
            "state": {
              "type": "string",
              "enum": [
                "preparing"
              ]
            },
            "join_url": {
              "type": "string",
              "format": "uri",
              "description": "原样传递的短期一次性 HTTPS 通话链接，禁止记录完整链接。"
            },
            "expires_at": {
              "type": "string",
              "format": "date-time",
              "description": "RFC3339 格式的准备失效时间；从创建通话起默认 2 分钟，可由服务端调整，请以此字段判断截止时间，不要自行写死时长。"
            }
          }
        }
      }
    }
  },
  "createContact": {
    "api": "device",
    "operationId": "createContact",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/contacts/add",
    "tag": "Contacts",
    "summary": "添加联系人",
    "description": "在指定账号所属渠道中添加一个联系人。`phone_number` 和 `username` 至少提供一个； `whatsapp_options` 仅适用于 WhatsApp 账号。 添加失败时，`numeric_code=30017` 表示 Provider 限流，调用方应延迟退避重试； `numeric_code=30018` 表示账号 App State 失步，调用方应等待 Provider 恢复后再重试。 两种细分原因均保持接口原有 HTTP 状态与字符串 `code`。 仅 whatsapp 添加联系人明确未将目标号码识别为有效 WhatsApp 联系人时，返回 HTTP 500、 `code=create_contact_failed` 和 `numeric_code=35009`；`message` 保留完整原始原因，不增加前缀， 原因缺失时为 `Target phone number was not recognized as an active WhatsApp contact`。 调用方应按数字码提示用户核对国家区号、号码及 WhatsApp 注册状态，核对实际响应与页面错误提示后再请求， 不应持续自动重试；该错误不确认号码未注册或永久不可用。其他添加失败沿用原有分类。",
    "authRequired": true,
    "toolName": "device_create_contact",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ContactCreateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ContactCreateRequest": {
          "type": "object",
          "additionalProperties": false,
          "anyOf": [
            {
              "required": [
                "phone_number"
              ]
            },
            {
              "required": [
                "username"
              ]
            }
          ],
          "properties": {
            "phone_number": {
              "type": "string",
              "minLength": 1,
              "description": "包含国家或地区代码的纯数字电话号码，不包含加号、空格或分隔符。",
              "example": "8613800000000"
            },
            "username": {
              "type": "string",
              "minLength": 1,
              "description": "渠道用户名，格式要求以目标渠道为准。",
              "example": "alice"
            },
            "whatsapp_options": {
              "$ref": "#/$defs/WhatsAppContactCreateOptions"
            }
          }
        },
        "WhatsAppContactCreateOptions": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "first_name": {
              "type": "string"
            },
            "full_name": {
              "type": "string"
            },
            "sync_to_device_contacts": {
              "type": "boolean",
              "default": false,
              "description": "是否同步至当前 WhatsApp 账号关联设备的系统通讯录。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Contact"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Contact": {
          "type": "object",
          "required": [
            "id",
            "conversation_id",
            "display_name",
            "avatar_url",
            "provider_user_id"
          ],
          "properties": {
            "id": {
              "type": "string",
              "description": "联系人标识。"
            },
            "conversation_id": {
              "type": "string",
              "description": "用于发送消息或定位会话的标识，请按不透明字符串保存和使用。"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "provider_user_id": {
              "type": "string",
              "description": "渠道用户标识，请按不透明字符串保存和使用。"
            },
            "is_blocked": {
              "type": "boolean"
            },
            "extra": {
              "$ref": "#/$defs/ContactExtra"
            }
          }
        },
        "ContactExtra": {
          "type": "object",
          "additionalProperties": true,
          "description": "渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。",
          "properties": {
            "phone": {
              "type": "string",
              "description": "WhatsApp phone JID 中解析出的纯手机号。"
            },
            "first_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的联系人简称或名字部分。"
            },
            "full_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的完整联系人名称。"
            },
            "push_name": {
              "type": "string",
              "description": "联系人自行在 WhatsApp 设置的个人名称。"
            },
            "username": {
              "type": "string",
              "minLength": 1,
              "description": "WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。",
              "example": "alice_handle"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp Business 账号的商业或认证名称。"
            },
            "redacted_phone": {
              "type": "string",
              "description": "Provider 仅返回部分号码时的遮蔽手机号。"
            }
          }
        }
      }
    }
  },
  "createGroup": {
    "api": "device",
    "operationId": "createGroup",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/create",
    "tag": "Groups",
    "summary": "创建群组",
    "description": "",
    "authRequired": true,
    "toolName": "device_create_group",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupCreateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupCreateRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 100
            },
            "members": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/GroupCreateResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "GroupCreateResult": {
          "type": "object",
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "createWebhookEndpoint": {
    "api": "device",
    "operationId": "createWebhookEndpoint",
    "method": "POST",
    "path": "/v1/webhook-endpoints",
    "tag": "Webhook Endpoints",
    "summary": "创建 webhook endpoint",
    "description": "body 省略 account_id 时创建工作空间端点；指定公开账号 ID 时创建该账号的独立端点。 账号独立配置整体优先于工作空间配置，停用或未订阅某类事件不会回退；删除最后一个独立端点后，后续首次投递恢复继承。 account_id 只接受 body 中的非空字符串，不接受 query、null 或重复字段。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 有效的账号配置请求直接创建账号端点，不改建为工作空间端点。 同一 account_id 最多一个 active 独立端点；创建 status=active 时已有 active 端点返回 409 account_webhook_already_exists（40008）。 status=inactive 可创建多个，不占用 active 名额。更换 URL 或其他配置使用 PATCH 更新已有端点。工作空间端点仍可配置多个；历史多 active 端点不会自动清理。 创建后应核对响应的 account_id；账号绑定不可通过 PATCH 修改。",
    "authRequired": true,
    "toolName": "device_create_webhook_endpoint",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/WebhookEndpointRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "WebhookEndpointRequest": {
          "type": "object",
          "description": "url 与 status 必填；其他配置按完整更新语义处理。 account_id 为可选公开账号 ID：创建时省略表示工作空间端点，更新时省略保留已有绑定。 同一账号最多一个 active 独立端点，inactive 可配置多个且不占用 active 名额；创建 active 或将 inactive 改为 active 时，存在其他 active 端点返回 409 account_webhook_already_exists（40008）。原 active 端点保持 active 的更新允许执行。 更新时提供 account_id 只校验一致，不能修改端点归属；不接受 null、空白或重复的 account_id。 字段名必须精确使用 account_id；大小写变体返回 400 invalid_request。",
          "required": [
            "url",
            "status"
          ],
          "properties": {
            "account_id": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "description": "可选的公开账号 ID，例如 `acc_example`；创建用于绑定，更新只用于校验原绑定。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              },
              "description": "为空、省略或包含 `*` 表示接收当前工作区有权接收的全部事件，包括 contact.updated；is_beta=true 的内测工作区还包含 call.incoming、call.answered、call.ended，无需额外逐项订阅。非内测工作区可以使用通配订阅，但不会收到通话事件；明确订阅通话事件仍返回 403 beta_feature_not_enabled（41002）。非通配的具体事件列表仅接收列出的事件。每次投递、重试及死信重放均重新核验内测资格，查询异常不放行。呼入暂未开放；message.* 通话记录不受内测门禁影响。"
            },
            "signing_secret": {
              "type": "string",
              "description": "用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/WebhookEndpoint"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "WebhookEndpoint": {
          "type": "object",
          "required": [
            "id",
            "url",
            "status",
            "signing_enabled"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "account_id": {
              "type": "string",
              "minLength": 1,
              "description": "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              }
            },
            "signing_enabled": {
              "type": "boolean"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "deactivateWebhookEndpoint": {
    "api": "device",
    "operationId": "deactivateWebhookEndpoint",
    "method": "POST",
    "path": "/v1/webhook-endpoints/{endpoint_id}/deactivate",
    "tag": "Webhook Endpoints",
    "summary": "停用 webhook endpoint",
    "description": "停用当前工作空间内的端点；可选 query account_id 仅校验原绑定，不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 停用账号全部独立端点表示暂停该账号回调，不恢复工作空间继承。 端点不存在时保持 HTTP 500 deactivate_webhook_endpoint_failed，numeric_code 为 40006。",
    "authRequired": true,
    "toolName": "device_deactivate_webhook_endpoint",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "endpoint_id": {
                  "type": "string",
                  "description": "Webhook endpoint public_id，例如 `we_xxx`。"
                }
              },
              "required": [
                "endpoint_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "\\S",
                  "description": "可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/WebhookEndpoint"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "WebhookEndpoint": {
          "type": "object",
          "required": [
            "id",
            "url",
            "status",
            "signing_enabled"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "account_id": {
              "type": "string",
              "minLength": 1,
              "description": "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              }
            },
            "signing_enabled": {
              "type": "boolean"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "deleteAccount": {
    "api": "device",
    "operationId": "deleteAccount",
    "method": "DELETE",
    "path": "/v1/accounts/{account_id}",
    "tag": "Accounts",
    "summary": "删除账号",
    "description": "WhatsApp 账号删除前会实时确认设备状态。未连接或已停止时完成平台侧清理， 不保证 WhatsApp 侧的登录会话已注销；在线时先退登再清理。 删除过程中确认设备已不存在时按已删除处理。 额度账号删除完成后、余额账号删除受理后，账号立即从当前账号列表中消失。余额账号先在事务内受理并禁用；返回202与同一个DELETE操作，完成后重复删除返回204。 结算按受理锁下本平台已落库的授权成功记录冻结：无记录且不足24小时全退，其他按剩余完整天计算。 已扫码但回调未落库同样视为无记录；迟到回调不改结算、不二退、不恢复账号。未知HTTP或清理失败不会伪报成功。",
    "authRequired": true,
    "toolName": "device_delete_account",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "oneOf": [
            {
              "allOf": [
                {
                  "$ref": "#/$defs/ResponseMeta"
                },
                {
                  "type": "object",
                  "required": [
                    "data"
                  ],
                  "properties": {
                    "data": {
                      "$ref": "#/$defs/AccountOperation"
                    }
                  }
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "AccountOperation": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "operation_id": {
              "type": "string"
            },
            "kind": {
              "type": "string",
              "enum": [
                "QUOTE",
                "CREATE",
                "DELETE",
                "COMPENSATE"
              ]
            },
            "state": {
              "type": "string",
              "enum": [
                "QUOTED",
                "CONSUMED",
                "EXPIRED",
                "PENDING",
                "PROCESSING",
                "SUCCEEDED",
                "FAILED",
                "REVIEW"
              ]
            },
            "account_id": {
              "type": "string"
            },
            "last_error_code": {
              "type": "string"
            }
          },
          "required": [
            "operation_id",
            "kind",
            "state"
          ],
          "description": "Safe public business operation result."
        }
      }
    }
  },
  "deleteConversationLabel": {
    "api": "device",
    "operationId": "deleteConversationLabel",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/labels/delete",
    "tag": "Conversations",
    "summary": "删除会话标签",
    "description": "",
    "authRequired": true,
    "toolName": "device_delete_conversation_label",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationLabelDeleteRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationLabelDeleteRequest": {
          "type": "object",
          "required": [
            "label_id"
          ],
          "properties": {
            "label_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationLabelDeleteResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationLabelDeleteResult": {
          "type": "object",
          "required": [
            "label_id",
            "deleted"
          ],
          "properties": {
            "label_id": {
              "type": "string"
            },
            "deleted": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "deleteWebhookEndpoint": {
    "api": "device",
    "operationId": "deleteWebhookEndpoint",
    "method": "DELETE",
    "path": "/v1/webhook-endpoints/{endpoint_id}",
    "tag": "Webhook Endpoints",
    "summary": "删除 webhook endpoint",
    "description": "按 endpoint_id 幂等删除当前工作空间内的端点；可选 query account_id 仅校验原绑定。 已找到端点但账号归属不匹配返回 400 invalid_request，不执行删除。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点确实不存在时返回 204；删除账号最后一个独立端点后，后续首次投递恢复继承工作空间配置。 原端点尚未完成的投递停止，不转投工作空间；已经发出的 HTTP 请求无法撤回。",
    "authRequired": true,
    "toolName": "device_delete_webhook_endpoint",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "endpoint_id": {
                  "type": "string",
                  "description": "Webhook endpoint public_id，例如 `we_xxx`。"
                }
              },
              "required": [
                "endpoint_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "\\S",
                  "description": "可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "type": "null"
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "editMessage": {
    "api": "device",
    "operationId": "editMessage",
    "method": "POST",
    "path": "/v1/messages/edit",
    "tag": "Messages",
    "summary": "编辑消息文本",
    "description": "由支持该能力的渠道提供，通常仅适用于文本消息。",
    "authRequired": true,
    "toolName": "device_edit_message",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/MessageEditRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "MessageEditRequest": {
          "type": "object",
          "required": [
            "account_id",
            "conversation_id",
            "message_id",
            "content"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "message_id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "getAccount": {
    "api": "device",
    "operationId": "getAccount",
    "method": "GET",
    "path": "/v1/accounts/{account_id}",
    "tag": "Accounts",
    "summary": "获取账号详情",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_account",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Account"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Account": {
          "type": "object",
          "required": [
            "id",
            "name",
            "provider",
            "region",
            "status",
            "runtime_status"
          ],
          "examples": [
            {
              "id": "acc_xxx",
              "name": "Customer Support",
              "provider": "whatsapp",
              "region": "sg",
              "status": "active",
              "runtime_status": "running"
            }
          ],
          "properties": {
            "billing": {
              "$ref": "#/$defs/AccountBilling"
            },
            "id": {
              "type": "string",
              "examples": [
                "acc_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string",
              "description": "账号选择的默认网络出口地区。"
            },
            "status": {
              "type": "string",
              "description": "账号资源状态，例如 active、inactive、disabled。"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "description": "授权模式，例如 qrcode、code、session。"
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string",
              "description": "渠道侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "客户显式配置的代理；不返回平台默认出口凭据。"
            },
            "provider_profile": {
              "$ref": "#/$defs/ProviderProfile"
            }
          },
          "allOf": [
            {
              "if": {
                "properties": {
                  "provider": {
                    "not": {
                      "const": "whatsapp"
                    }
                  }
                }
              },
              "then": {
                "properties": {
                  "provider_profile": {
                    "properties": {
                      "device_id": false
                    }
                  }
                }
              }
            }
          ]
        },
        "AccountBilling": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "period_start_at": {
              "type": "string",
              "format": "date-time"
            },
            "period_end_at": {
              "type": "string",
              "format": "date-time"
            },
            "amount_minor": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64",
                  "minimum": 1
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "currency": {
              "const": "USD",
              "type": "string"
            },
            "operation_id": {
              "type": "string"
            },
            "state": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "DELETING",
                "DELETED",
                "COMPENSATED",
                "REVIEW"
              ]
            }
          },
          "required": [
            "period_start_at",
            "period_end_at",
            "amount_minor",
            "currency",
            "operation_id",
            "state"
          ],
          "description": "独立的资金业务状态，不与 runtime_status 混用；周期时间按 RFC 3339 UTC Z 返回。"
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        },
        "ProviderProfile": {
          "type": "object",
          "description": "账号在渠道侧的资料。下列为标准字段，其他字段因渠道而异。",
          "properties": {
            "id": {
              "type": "string",
              "description": "渠道侧账号标识。WhatsApp 返回 LID 格式；该字段在账号资料同步完成前可能缺失。"
            },
            "device_id": {
              "$ref": "#/$defs/WhatsAppDeviceID",
              "description": "仅 WhatsApp 账号详情在可确认当前授权会话时提供的登录设备编号；未知时省略。重新授权后可能变化，不作为永久设备标识，也不用于比较历史消息来源。"
            },
            "phone": {
              "type": "string",
              "description": "账号手机号，已归一化（去除空格、连字符、加号）。"
            },
            "username": {
              "type": "string"
            },
            "display_name": {
              "type": "string",
              "description": "账号展示名称；WhatsApp 按 BusinessName 优先、PushName 回退的规则生成。"
            },
            "push_name": {
              "type": "string",
              "description": "WhatsApp 当前账号设置的 PushName；其他渠道不定义该字段语义。"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp BusinessName；渠道未返回时该字段缺失。"
            },
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string",
              "description": "账号头像 URL。"
            },
            "bio": {
              "type": "string"
            },
            "platform": {
              "type": "string",
              "description": "目前仅 WhatsApp 定义并返回该字段，表示配对时的登录平台标识，按不透明字符串透传。取值集合不封闭，客户端必须兼容未知值；其他渠道不定义该字段语义。该字段与 device_platform 不同。",
              "example": "smba"
            }
          },
          "additionalProperties": true
        },
        "WhatsAppDeviceID": {
          "type": "integer",
          "minimum": 0,
          "maximum": 65535,
          "description": "已确认的 WhatsApp 设备编号；0 是有效值，未知时整个字段省略，不返回 null 或空串。"
        }
      }
    }
  },
  "getAccountAuthState": {
    "api": "device",
    "operationId": "getAccountAuthState",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/auth",
    "tag": "Account Auth",
    "summary": "获取账号授权状态",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_account_auth_state",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/AccountSession"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "AccountSession": {
          "type": "object",
          "required": [
            "account_id",
            "status"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "description": "授权流程状态，例如 `pending_auth`、`awaiting_qr_scan`、`awaiting_code`、`pending`、`passkey_required`、 `passkey_pending`、`passkey_confirmation`、`passkey_confirmation_sent`、 `authorized`、`failed`。"
            },
            "auth_fields": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/AuthField"
              }
            },
            "auth_payload": {
              "description": "当前授权步骤所需的渠道载荷。Passkey 流程可能返回 `type=passkey` 和 `public_key`，或返回 `type=passkey_confirmation` 及确认提示字段。",
              "allOf": [
                {
                  "$ref": "#/$defs/FreeFormObject"
                }
              ]
            },
            "expires_at": {
              "type": "string",
              "format": "date-time"
            },
            "last_error": {
              "type": "string"
            }
          }
        },
        "AuthField": {
          "type": "object",
          "required": [
            "type",
            "required"
          ],
          "properties": {
            "type": {
              "type": "string"
            },
            "required": {
              "type": "boolean"
            },
            "label": {
              "type": "string"
            },
            "placeholder": {
              "type": "string"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "getAccountOperation": {
    "api": "device",
    "operationId": "getAccountOperation",
    "method": "GET",
    "path": "/v1/account-operations/{operation_id}",
    "tag": "Accounts",
    "summary": "查询账号计费操作",
    "description": "只返回当前 API Key 工作区的安全业务结果。REVIEW 表示结果尚未确认，不代表已经退款。 创建成功后应复用原账号并查询本操作；没有提供幂等键的后续请求会视为新的建号。",
    "authRequired": true,
    "toolName": "device_get_account_operation",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "operation_id": {
                  "type": "string"
                }
              },
              "required": [
                "operation_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/AccountOperation"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "AccountOperation": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "operation_id": {
              "type": "string"
            },
            "kind": {
              "type": "string",
              "enum": [
                "QUOTE",
                "CREATE",
                "DELETE",
                "COMPENSATE"
              ]
            },
            "state": {
              "type": "string",
              "enum": [
                "QUOTED",
                "CONSUMED",
                "EXPIRED",
                "PENDING",
                "PROCESSING",
                "SUCCEEDED",
                "FAILED",
                "REVIEW"
              ]
            },
            "account_id": {
              "type": "string"
            },
            "last_error_code": {
              "type": "string"
            }
          },
          "required": [
            "operation_id",
            "kind",
            "state"
          ],
          "description": "Safe public business operation result."
        }
      }
    }
  },
  "getActiveCall": {
    "api": "device",
    "operationId": "getActiveCall",
    "method": "GET",
    "path": "/v1/calls/active",
    "tag": "Calls",
    "summary": "查询账号当前活动通话",
    "description": "仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。当前账号没有活动通话时返回 200 且 data 为空对象 {}；这不表示通话服务不可用。有活动通话时仅返回通话 ID、状态、方向和媒体类型，不返回链接或凭证。",
    "authRequired": true,
    "toolName": "device_get_active_call",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "pattern": "^acc_[A-Za-z0-9][A-Za-z0-9_-]*$"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "oneOf": [
                    {
                      "$ref": "#/$defs/ActiveCallData"
                    },
                    {
                      "type": "object",
                      "maxProperties": 0
                    }
                  ]
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ActiveCallData": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "call_id",
            "state",
            "direction",
            "media_type"
          ],
          "properties": {
            "call_id": {
              "type": "string",
              "maxLength": 128
            },
            "state": {
              "type": "string",
              "enum": [
                "preparing",
                "dialing",
                "ringing",
                "connecting",
                "active"
              ]
            },
            "direction": {
              "type": "string",
              "enum": [
                "inbound",
                "outbound"
              ]
            },
            "media_type": {
              "type": "string",
              "enum": [
                "voice",
                "video"
              ]
            }
          }
        }
      }
    }
  },
  "getContact": {
    "api": "device",
    "operationId": "getContact",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/contacts/info",
    "tag": "Contacts",
    "summary": "获取联系人详情",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_contact",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "contact_id": {
                  "type": "string",
                  "description": "渠道侧联系人标识，按不透明字符串传递。`whatsapp` 和 `whatsapp-protocol` 统一使用 LID（`xxx@lid`）；`whatsapp-protocol` 联系人资料字段缺失时仍可能返回成功， 调用方应以实际返回字段为准。"
                }
              },
              "required": [
                "contact_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Contact"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Contact": {
          "type": "object",
          "required": [
            "id",
            "conversation_id",
            "display_name",
            "avatar_url",
            "provider_user_id"
          ],
          "properties": {
            "id": {
              "type": "string",
              "description": "联系人标识。"
            },
            "conversation_id": {
              "type": "string",
              "description": "用于发送消息或定位会话的标识，请按不透明字符串保存和使用。"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "provider_user_id": {
              "type": "string",
              "description": "渠道用户标识，请按不透明字符串保存和使用。"
            },
            "is_blocked": {
              "type": "boolean"
            },
            "extra": {
              "$ref": "#/$defs/ContactExtra"
            }
          }
        },
        "ContactExtra": {
          "type": "object",
          "additionalProperties": true,
          "description": "渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。",
          "properties": {
            "phone": {
              "type": "string",
              "description": "WhatsApp phone JID 中解析出的纯手机号。"
            },
            "first_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的联系人简称或名字部分。"
            },
            "full_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的完整联系人名称。"
            },
            "push_name": {
              "type": "string",
              "description": "联系人自行在 WhatsApp 设置的个人名称。"
            },
            "username": {
              "type": "string",
              "minLength": 1,
              "description": "WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。",
              "example": "alice_handle"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp Business 账号的商业或认证名称。"
            },
            "redacted_phone": {
              "type": "string",
              "description": "Provider 仅返回部分号码时的遮蔽手机号。"
            }
          }
        }
      }
    }
  },
  "getContactMembership": {
    "api": "device",
    "operationId": "getContactMembership",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/contacts/membership",
    "tag": "Contacts",
    "summary": "查询联系人是否在联系人列表中",
    "description": "查询指定联系人是否存在于目标账号的渠道联系人列表中。",
    "authRequired": true,
    "toolName": "device_get_contact_membership",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "contact_id": {
                  "type": "string",
                  "description": "联系人标识。WhatsApp 账号请使用联系人接口返回的 LID，例如 `123456789012345@lid`。"
                }
              },
              "required": [
                "contact_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ContactMembership"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ContactMembership": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "contact_id",
            "is_in_contacts"
          ],
          "properties": {
            "contact_id": {
              "type": "string",
              "description": "查询请求中的联系人标识。"
            },
            "is_in_contacts": {
              "type": "boolean",
              "description": "是否存在于目标账号的渠道联系人列表中。"
            }
          }
        }
      }
    }
  },
  "getConversation": {
    "api": "device",
    "operationId": "getConversation",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/conversations/info",
    "tag": "Conversations",
    "summary": "获取会话详情",
    "description": "查询目标会话详情。WhatsApp 群明确不存在或当前账号未参与该群时，返回 HTTP 404， `error.code` 为 `conversation_not_found`；`error.numeric_code` 分别为 `34004`（群不存在） 或 `34011`（账号未参与该群）。这类错误不应按临时网关故障自动重试。 未知上游业务失败、网络异常和超时仍返回 HTTP 502。",
    "authRequired": true,
    "toolName": "device_get_conversation",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "conversation_id": {
                  "type": "string",
                  "description": "渠道侧会话标识，部分渠道的标识可能包含 `@`、`:` 等字符。"
                },
                "type": {
                  "$ref": "#/$defs/ConversationType",
                  "description": "会话类型；按枚举原值精确匹配，不执行去空格或大小写转换。"
                }
              },
              "required": [
                "conversation_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Conversation"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Conversation": {
          "type": "object",
          "required": [
            "conversation_id",
            "type",
            "title",
            "avatar_url",
            "unread_count",
            "is_pinned",
            "is_muted"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            },
            "type": {
              "$ref": "#/$defs/ConversationType"
            },
            "title": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "last_message_at": {
              "type": "string",
              "format": "date-time"
            },
            "last_message_text": {
              "type": "string"
            },
            "unread_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "members_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "subscribers_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "is_pinned": {
              "type": "boolean"
            },
            "is_muted": {
              "type": "boolean"
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "extra": {
              "type": "object",
              "additionalProperties": true,
              "description": "渠道扩展字段；WhatsApp 群会话可包含公告群分类，会话列表不保证提供该分类。",
              "properties": {
                "is_announcement_group": {
                  "type": "boolean",
                  "description": "仅 WhatsApp 群会话提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。分类不表示当前账号具备发送权限。",
                  "example": false
                }
              }
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        }
      }
    }
  },
  "getGroup": {
    "api": "device",
    "operationId": "getGroup",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/groups/info",
    "tag": "Groups",
    "summary": "获取群组详情",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_group",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "group_id": {
                  "type": "string",
                  "description": "渠道侧群组标识，部分渠道的标识可能包含 `@` 等字符。"
                }
              },
              "required": [
                "group_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Group"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Group": {
          "type": "object",
          "required": [
            "id",
            "conversation_id",
            "name",
            "avatar_url"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "member_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "joined_at": {
              "type": "string",
              "format": "date-time"
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "description": {
              "type": "string"
            },
            "permissions": {
              "$ref": "#/$defs/GroupPermissions"
            },
            "extra": {
              "type": "object",
              "additionalProperties": true,
              "description": "渠道扩展字段；WhatsApp 群资料可包含公告群分类，是否返回取决于本次查询可用资料。",
              "properties": {
                "is_announcement_group": {
                  "type": "boolean",
                  "description": "仅 WhatsApp 群提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。此属性独立于 permissions.admins_only，不表示当前账号具备发送权限。",
                  "example": false
                }
              }
            }
          }
        },
        "GroupPermissions": {
          "type": "object",
          "additionalProperties": false,
          "description": "群整体发言权限快照，仅来源明确提供时返回。缺失表示未知；false 表示普通成员可发言，不表示当前账号一定可发送。",
          "properties": {
            "admins_only": {
              "type": "boolean",
              "description": "true 表示仅管理员发言；false 是明确状态，不能视为缺省。"
            }
          }
        }
      }
    }
  },
  "getGroupInviteCode": {
    "api": "device",
    "operationId": "getGroupInviteCode",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/groups/invite-code",
    "tag": "Groups",
    "summary": "获取群邀请链接或邀请码",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_group_invite_code",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "group_id": {
                  "type": "string",
                  "description": "渠道侧群组标识。"
                }
              },
              "required": [
                "group_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/GroupInviteCode"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "GroupInviteCode": {
          "type": "object",
          "required": [
            "invite_url",
            "invite_code"
          ],
          "properties": {
            "invite_url": {
              "type": "string"
            },
            "invite_code": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "getPost": {
    "api": "device",
    "operationId": "getPost",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/posts/info",
    "tag": "Posts",
    "summary": "获取帖子详情",
    "description": "仅支持 TikTok；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询本账号帖子列表。目标是否可访问由渠道结果决定，不保证其他账号的帖子可读取。 JSON body 必填非空字符串 post_id，不接受 null、未知字段或重复键；非法请求返回 400 invalid_request（10000）。 TikTok 的 post_id 须为无前导零的正十进制整数字符串，按原值传递；不符合渠道格式时返回 400 provider_invalid_request。 账号不在当前工作空间返回 404 account_not_found（20020）；可靠确认帖子不存在时返回 404 post_not_found（39000）。 当前账号无法访问目标时返回 403 post_inaccessible（39005），不能据此判断具体是登录、权限还是资源归属原因，也不能视为不存在。 只有可靠取得与请求帖子 ID 一致的资源后才返回标准 Post；上游异常返回失败，不返回部分详情。 现有可选字段仅在可靠取得时提供，不新增帖子媒体或统计计数。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他详情读取失败返回 502 get_post_failed（39006）。",
    "authRequired": true,
    "toolName": "device_get_post",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/PostInfoRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "PostInfoRequest": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "post_id"
          ],
          "properties": {
            "post_id": {
              "$ref": "#/$defs/PostResourceID"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Post"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Post": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "text": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "author": {
              "$ref": "#/$defs/PostAuthor"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "description": "可靠取得的创建时间，RFC3339 UTC；未知时省略。"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        },
        "PostAuthor": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "display_name": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "avatar_url": {
              "type": "string",
              "minLength": 1,
              "description": "可靠取得的非空头像地址；未知时省略。"
            }
          }
        }
      }
    }
  },
  "getWebhookEndpoint": {
    "api": "device",
    "operationId": "getWebhookEndpoint",
    "method": "GET",
    "path": "/v1/webhook-endpoints/{endpoint_id}",
    "tag": "Webhook Endpoints",
    "summary": "获取 webhook endpoint",
    "description": "按 endpoint_id 获取当前工作空间内的端点，包括工作空间和账号端点。 可选 query account_id 仅校验端点的账号归属；不匹配返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 端点不存在时保持 HTTP 500 get_webhook_endpoint_failed，numeric_code 为 40006。",
    "authRequired": true,
    "toolName": "device_get_webhook_endpoint",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "endpoint_id": {
                  "type": "string",
                  "description": "Webhook endpoint public_id，例如 `we_xxx`。"
                }
              },
              "required": [
                "endpoint_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "\\S",
                  "description": "可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/WebhookEndpoint"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "WebhookEndpoint": {
          "type": "object",
          "required": [
            "id",
            "url",
            "status",
            "signing_enabled"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "account_id": {
              "type": "string",
              "minLength": 1,
              "description": "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              }
            },
            "signing_enabled": {
              "type": "boolean"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "getWorkspace": {
    "api": "device",
    "operationId": "getWorkspace",
    "method": "GET",
    "path": "/v1/workspace",
    "tag": "Workspace",
    "summary": "获取当前 workspace",
    "description": "",
    "authRequired": true,
    "toolName": "device_get_workspace",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "read",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Workspace"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Workspace": {
          "type": "object",
          "required": [
            "name",
            "status",
            "is_beta",
            "account_quota",
            "account_quota_used",
            "account_quota_unlimited"
          ],
          "properties": {
            "is_beta": {
              "type": "boolean",
              "readOnly": true,
              "default": false,
              "description": "工作区是否已开通内测，默认关闭；仅服务端可管理，客户不能通过 PATCH 或 metadata 修改。"
            },
            "name": {
              "type": "string"
            },
            "status": {
              "$ref": "#/$defs/WorkspaceStatus"
            },
            "metadata": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            },
            "account_quota": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "uint64",
                  "readOnly": true,
                  "description": "当前生效的只读账号总容量，包含免费额度和有效期内的付费额度，不扣除已用数量；已到期的付费额度不计入。"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_used": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "uint64",
                  "readOnly": true,
                  "description": "当前已占用的只读账号额度，账号创建后即占用，删除后释放；待授权、停止或断线的账号仍计入。付费额度到期后，已用额度可能超过 account_quota，按实际已用值返回。"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_unlimited": {
              "type": "boolean",
              "readOnly": true,
              "description": "兼容保留的只读字段，当前配额模式固定返回 false；账号容量以 account_quota 为准。"
            }
          }
        },
        "WorkspaceStatus": {
          "type": "string",
          "enum": [
            "active",
            "inactive"
          ],
          "description": "Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。"
        }
      }
    }
  },
  "hangupCall": {
    "api": "device",
    "operationId": "hangupCall",
    "method": "POST",
    "path": "/v1/calls/{call_id}/hangup",
    "tag": "Calls",
    "summary": "挂断指定通话",
    "description": "仅内测工作区可用，普通工作区返回 403 beta_feature_not_enabled（41002）。挂断当前账号归属的指定通话。存储保留期内重复挂断已结束通话仍返回其终态对象；通话不存在或不属于该账号返回 404 call_not_found。撤销内测资格前应先结束活动通话并等待准备链接过期；资格撤销不会立即使已发链接失效或强制结束通话。",
    "authRequired": true,
    "toolName": "device_hangup_call",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "call_id": {
                  "type": "string",
                  "pattern": "^[A-Za-z0-9][A-Za-z0-9_-]*$",
                  "maxLength": 128
                }
              },
              "required": [
                "call_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "type": "object",
          "required": [
            "account_id"
          ],
          "properties": {
            "account_id": {
              "type": "string",
              "pattern": "^acc_[A-Za-z0-9][A-Za-z0-9_-]*$"
            }
          }
        }
      },
      "required": [
        "params",
        "body"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/EndedCallData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "EndedCallData": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "call_id",
            "state",
            "direction",
            "media_type"
          ],
          "properties": {
            "call_id": {
              "type": "string",
              "maxLength": 128
            },
            "state": {
              "type": "string",
              "enum": [
                "ended",
                "failed"
              ]
            },
            "direction": {
              "type": "string",
              "enum": [
                "inbound",
                "outbound"
              ]
            },
            "media_type": {
              "type": "string",
              "enum": [
                "voice",
                "video"
              ]
            }
          }
        }
      }
    }
  },
  "importAccountAuthSession": {
    "api": "device",
    "operationId": "importAccountAuthSession",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/session",
    "tag": "Account Auth",
    "summary": "导入会话授权",
    "description": "",
    "authRequired": true,
    "toolName": "device_import_account_auth_session",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/SessionImportRequest"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "SessionImportRequest": {
          "type": "object",
          "description": "provider 会话导入参数。`whatsapp-protocol` 的协议凭证使用同名嵌套对象； 其他 provider 的既有自由字段通过 additionalProperties 保持兼容。",
          "properties": {
            "session_url": {
              "type": "string",
              "format": "uri"
            },
            "whatsapp-protocol": {
              "$ref": "#/$defs/WhatsAppProtocolSessionImportParams"
            }
          },
          "additionalProperties": true
        },
        "WhatsAppProtocolSessionImportParams": {
          "type": "object",
          "description": "WhatsApp Protocol 的会话导入凭证，仅可提交至账号会话导入接口。 响应不回显协议密钥或其他敏感凭证。手机号用于身份一致性校验；协议公钥、协议私钥 仅供上游启动使用。`edge_routing` 由平台固定注入，业务方不得提交。",
          "required": [
            "phone",
            "static_pub_key",
            "static_pri_key",
            "identity_pub_key",
            "identity_pri_key"
          ],
          "properties": {
            "phone": {
              "type": "string",
              "minLength": 1,
              "description": "允许带空格、连字符、括号或加号的格式化输入；服务端会归一化为正数字符串。",
              "examples": [
                "<normalized-phone>"
              ]
            },
            "platform": {
              "type": "integer",
              "format": "int32"
            },
            "app_version": {
              "type": "string",
              "examples": [
                "<app-version>"
              ]
            },
            "server_address": {
              "type": "string",
              "examples": [
                "<provider-server-address>"
              ]
            },
            "fallback_server_addresses": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "country": {
              "type": "string",
              "examples": [
                "<country-code>"
              ]
            },
            "device": {
              "type": "integer",
              "format": "uint32"
            },
            "static_pub_key": {
              "type": "string",
              "minLength": 1,
              "description": "协议公钥。",
              "writeOnly": true,
              "examples": [
                "<base64-public-key>"
              ]
            },
            "static_pri_key": {
              "type": "string",
              "minLength": 1,
              "description": "协议私钥。",
              "writeOnly": true,
              "examples": [
                "<base64-private-key>"
              ]
            },
            "identity_pub_key": {
              "type": "string",
              "minLength": 1,
              "description": "身份公钥。",
              "writeOnly": true,
              "examples": [
                "<base64-public-key>"
              ]
            },
            "identity_pri_key": {
              "type": "string",
              "minLength": 1,
              "description": "身份私钥。",
              "writeOnly": true,
              "examples": [
                "<base64-private-key>"
              ]
            },
            "hash": {
              "type": "string",
              "description": "兼容旧调用方保留；当前值会被忽略且不保存，建议调用方省略。",
              "writeOnly": true,
              "deprecated": true
            },
            "peer_kem_public": {
              "type": "string",
              "description": "对端 KEM 公钥。",
              "writeOnly": true,
              "examples": [
                "<base64-kem-public-key>"
              ]
            },
            "auth_hex_data": {
              "type": "string",
              "description": "当前认证十六进制数据。",
              "writeOnly": true,
              "examples": [
                "<hex-auth-data>"
              ]
            },
            "authhexdata": {
              "type": "string",
              "description": "兼容旧字段：认证十六进制数据。",
              "writeOnly": true,
              "deprecated": true,
              "examples": [
                "<hex-auth-data>"
              ]
            },
            "pq_handshake_mode": {
              "type": "string",
              "examples": [
                "<handshake-mode>"
              ]
            },
            "use_xxkem_handshake": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "leaveGroup": {
    "api": "device",
    "operationId": "leaveGroup",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/leave",
    "tag": "Groups",
    "summary": "退出群组",
    "description": "",
    "authRequired": true,
    "toolName": "device_leave_group",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupIdRequest": {
          "type": "object",
          "required": [
            "group_id"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "listAccounts": {
    "api": "device",
    "operationId": "listAccounts",
    "method": "GET",
    "path": "/v1/accounts",
    "tag": "Accounts",
    "summary": "列出账号",
    "description": "按稳定顺序分页返回当前 workspace 未删除的账号，账号数组位于 `data.items`。额度删除完成或余额删除受理后，该账号立即不再出现在列表及后续分页中。省略分页参数时只返回第一页，默认最多 20 个账号。 `data.has_more=true` 时，将 `data.next_cursor` 原样作为下一次请求的 `cursor`；续页可调整 `limit`。末页 `data.has_more=false` 且省略 `data.next_cursor`，空结果返回 `data.items: []`。 游标仅适用于签发时的 workspace，调用方不得解析或构造游标。分页期间新创建的账号需重新读取首页查看；跨页查询不提供时间点快照。 `limit` 非法、`cursor` 非法或跨 workspace 使用，以及重复传入 `limit` 或 `cursor`，均返回 `400 invalid_request`（`numeric_code=10000`）。",
    "authRequired": true,
    "toolName": "device_list_accounts",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "default": 20,
                  "description": "每页最多返回的账号数。省略时为 20；非法值或重复传入时返回 400 invalid_request（numeric_code=10000）。续页可调整此值。"
                },
                "cursor": {
                  "type": "string",
                  "description": "账号列表的不透明游标，省略或传入空字符串时读取第一页；续页原样回传上次响应的 data.next_cursor。 仅适用于签发时的 workspace。非法、重复传入或跨 workspace 使用时返回 400 invalid_request（numeric_code=10000）。"
                }
              }
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/AccountListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "AccountListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Account"
              }
            },
            "has_more": {
              "type": "boolean",
              "description": "是否还有下一页。"
            },
            "next_cursor": {
              "type": "string",
              "description": "下一页的不透明游标，仅在 has_more=true 时返回；续页时原样传入 cursor。"
            }
          }
        },
        "Account": {
          "type": "object",
          "required": [
            "id",
            "name",
            "provider",
            "region",
            "status",
            "runtime_status"
          ],
          "examples": [
            {
              "id": "acc_xxx",
              "name": "Customer Support",
              "provider": "whatsapp",
              "region": "sg",
              "status": "active",
              "runtime_status": "running"
            }
          ],
          "properties": {
            "billing": {
              "$ref": "#/$defs/AccountBilling"
            },
            "id": {
              "type": "string",
              "examples": [
                "acc_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string",
              "description": "账号选择的默认网络出口地区。"
            },
            "status": {
              "type": "string",
              "description": "账号资源状态，例如 active、inactive、disabled。"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "description": "授权模式，例如 qrcode、code、session。"
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string",
              "description": "渠道侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "客户显式配置的代理；不返回平台默认出口凭据。"
            },
            "provider_profile": {
              "$ref": "#/$defs/ProviderProfile"
            }
          },
          "allOf": [
            {
              "if": {
                "properties": {
                  "provider": {
                    "not": {
                      "const": "whatsapp"
                    }
                  }
                }
              },
              "then": {
                "properties": {
                  "provider_profile": {
                    "properties": {
                      "device_id": false
                    }
                  }
                }
              }
            }
          ]
        },
        "AccountBilling": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "period_start_at": {
              "type": "string",
              "format": "date-time"
            },
            "period_end_at": {
              "type": "string",
              "format": "date-time"
            },
            "amount_minor": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64",
                  "minimum": 1
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "currency": {
              "const": "USD",
              "type": "string"
            },
            "operation_id": {
              "type": "string"
            },
            "state": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "DELETING",
                "DELETED",
                "COMPENSATED",
                "REVIEW"
              ]
            }
          },
          "required": [
            "period_start_at",
            "period_end_at",
            "amount_minor",
            "currency",
            "operation_id",
            "state"
          ],
          "description": "独立的资金业务状态，不与 runtime_status 混用；周期时间按 RFC 3339 UTC Z 返回。"
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        },
        "ProviderProfile": {
          "type": "object",
          "description": "账号在渠道侧的资料。下列为标准字段，其他字段因渠道而异。",
          "properties": {
            "id": {
              "type": "string",
              "description": "渠道侧账号标识。WhatsApp 返回 LID 格式；该字段在账号资料同步完成前可能缺失。"
            },
            "device_id": {
              "$ref": "#/$defs/WhatsAppDeviceID",
              "description": "仅 WhatsApp 账号详情在可确认当前授权会话时提供的登录设备编号；未知时省略。重新授权后可能变化，不作为永久设备标识，也不用于比较历史消息来源。"
            },
            "phone": {
              "type": "string",
              "description": "账号手机号，已归一化（去除空格、连字符、加号）。"
            },
            "username": {
              "type": "string"
            },
            "display_name": {
              "type": "string",
              "description": "账号展示名称；WhatsApp 按 BusinessName 优先、PushName 回退的规则生成。"
            },
            "push_name": {
              "type": "string",
              "description": "WhatsApp 当前账号设置的 PushName；其他渠道不定义该字段语义。"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp BusinessName；渠道未返回时该字段缺失。"
            },
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string",
              "description": "账号头像 URL。"
            },
            "bio": {
              "type": "string"
            },
            "platform": {
              "type": "string",
              "description": "目前仅 WhatsApp 定义并返回该字段，表示配对时的登录平台标识，按不透明字符串透传。取值集合不封闭，客户端必须兼容未知值；其他渠道不定义该字段语义。该字段与 device_platform 不同。",
              "example": "smba"
            }
          },
          "additionalProperties": true
        },
        "WhatsAppDeviceID": {
          "type": "integer",
          "minimum": 0,
          "maximum": 65535,
          "description": "已确认的 WhatsApp 设备编号；0 是有效值，未知时整个字段省略，不返回 null 或空串。"
        }
      }
    }
  },
  "listApiKeys": {
    "api": "device",
    "operationId": "listApiKeys",
    "method": "GET",
    "path": "/v1/api-keys",
    "tag": "API Keys",
    "summary": "列出 API Key",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_api_keys",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "read",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/$defs/APIKey"
                  }
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "APIKey": {
          "type": "object",
          "required": [
            "id",
            "name",
            "key_prefix",
            "status"
          ],
          "properties": {
            "id": {
              "type": "string",
              "examples": [
                "ak_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "key_prefix": {
              "type": "string",
              "description": "可展示的 Key 前缀，不是完整 API Key。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            }
          }
        }
      }
    }
  },
  "listContactBlocklist": {
    "api": "device",
    "operationId": "listContactBlocklist",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/contacts/blocklist",
    "tag": "Contacts",
    "summary": "查询联系人黑名单",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_contact_blocklist",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ContactBlocklistResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ContactBlocklistResult": {
          "type": "object",
          "required": [
            "blocklist"
          ],
          "properties": {
            "blocklist": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dhash": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "listContacts": {
    "api": "device",
    "operationId": "listContacts",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/contacts",
    "tag": "Contacts",
    "summary": "列出联系人",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_contacts",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "cursor": {
                  "type": "string",
                  "description": "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "description": "每页返回数量。"
                },
                "q": {
                  "type": "string",
                  "description": "关键字过滤。"
                },
                "updated_since": {
                  "type": "string",
                  "format": "date-time",
                  "description": "RFC3339 时间戳，只返回此时间后更新的联系人；渠道不支持增量过滤时可能返回全量结果。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ContactListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ContactListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Contact"
              }
            },
            "next_cursor": {
              "type": "string"
            },
            "has_more": {
              "type": "boolean"
            }
          }
        },
        "Contact": {
          "type": "object",
          "required": [
            "id",
            "conversation_id",
            "display_name",
            "avatar_url",
            "provider_user_id"
          ],
          "properties": {
            "id": {
              "type": "string",
              "description": "联系人标识。"
            },
            "conversation_id": {
              "type": "string",
              "description": "用于发送消息或定位会话的标识，请按不透明字符串保存和使用。"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "provider_user_id": {
              "type": "string",
              "description": "渠道用户标识，请按不透明字符串保存和使用。"
            },
            "is_blocked": {
              "type": "boolean"
            },
            "extra": {
              "$ref": "#/$defs/ContactExtra"
            }
          }
        },
        "ContactExtra": {
          "type": "object",
          "additionalProperties": true,
          "description": "渠道联系人扩展资料；字段仅在 Provider 返回可靠值时出现。",
          "properties": {
            "phone": {
              "type": "string",
              "description": "WhatsApp phone JID 中解析出的纯手机号。"
            },
            "first_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的联系人简称或名字部分。"
            },
            "full_name": {
              "type": "string",
              "description": "当前账号通讯录中保存的完整联系人名称。"
            },
            "push_name": {
              "type": "string",
              "description": "联系人自行在 WhatsApp 设置的个人名称。"
            },
            "username": {
              "type": "string",
              "minLength": 1,
              "description": "WhatsApp 联系人的用户名（provider=whatsapp），与个人名称 push_name 独立。列表和详情仅在已获取到非空用户名时返回；缺失表示当前未知，不代表对方未设置，也不应据此清空已保存的用户名。",
              "example": "alice_handle"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp Business 账号的商业或认证名称。"
            },
            "redacted_phone": {
              "type": "string",
              "description": "Provider 仅返回部分号码时的遮蔽手机号。"
            }
          }
        }
      }
    }
  },
  "listConversationLabels": {
    "api": "device",
    "operationId": "listConversationLabels",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/conversations/labels",
    "tag": "Conversations",
    "summary": "列出会话标签",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_conversation_labels",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "cursor": {
                  "type": "string",
                  "description": "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "description": "每页返回数量。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationLabelListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationLabelListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/ConversationLabel"
              }
            },
            "next_cursor": {
              "type": "string"
            },
            "has_more": {
              "type": "boolean"
            }
          }
        },
        "ConversationLabel": {
          "type": "object",
          "required": [
            "id",
            "name"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "listConversationMembers": {
    "api": "device",
    "operationId": "listConversationMembers",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/conversations/members",
    "tag": "Conversations",
    "summary": "列出会话成员",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_conversation_members",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "conversation_id": {
                  "type": "string",
                  "description": "渠道侧会话标识，部分渠道的标识可能包含 `@`、`:` 等字符。"
                },
                "type": {
                  "$ref": "#/$defs/ConversationType",
                  "description": "会话类型；按枚举原值精确匹配，不执行去空格或大小写转换。"
                },
                "cursor": {
                  "type": "string",
                  "description": "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "description": "每页返回数量。"
                }
              },
              "required": [
                "conversation_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationMemberListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationMemberListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/ConversationMember"
              }
            },
            "next_cursor": {
              "type": "string"
            },
            "has_more": {
              "type": "boolean"
            }
          }
        },
        "ConversationMember": {
          "type": "object",
          "required": [
            "peer_id",
            "display_name",
            "avatar_url"
          ],
          "properties": {
            "peer_id": {
              "type": "string",
              "description": "成员的渠道侧稳定标识，请按不透明字符串保存和使用。"
            },
            "username": {
              "type": "string"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "member",
                "admin",
                "superadmin"
              ],
              "description": "标准化成员角色。群主或创建者为 `superadmin`，管理员为 `admin`，普通成员以及暂时无法识别权限的成员为 `member`。"
            },
            "joined_at": {
              "type": "string",
              "format": "date-time"
            },
            "extra": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "listConversations": {
    "api": "device",
    "operationId": "listConversations",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/conversations",
    "tag": "Conversations",
    "summary": "列出会话",
    "description": "WhatsApp 未提供 label_id 时返回“特别关注”会话，提供时返回指定标签成员；其他 Provider 使用各自的默认会话语义。 Twitter 仅返回用户会话；next_cursor 是不透明值，has_more 为 true 时调用方应将其原样用于下一页，分页结束时 has_more 为 false 且不返回 next_cursor。格式非法或不完整的 cursor 返回 400 provider_invalid_request。",
    "authRequired": true,
    "toolName": "device_list_conversations",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "type": {
                  "type": "string",
                  "examples": [
                    "user",
                    "group",
                    "user,group"
                  ],
                  "description": "会话类型过滤，支持逗号分隔多选；每一项按枚举原值精确匹配，不忽略空项。 可选值为 `user`、`group`、`channel`；非法值返回 400 invalid_conversation_type。 WhatsApp 的 `group` 包含社群公告群，所有群会话的返回类型均为 `group`。"
                },
                "cursor": {
                  "type": "string",
                  "description": "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "description": "每页返回数量。"
                },
                "label_id": {
                  "type": "string",
                  "description": "WhatsApp 会话标签 ID；未提供时返回“特别关注”会话。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Conversation"
              }
            },
            "next_cursor": {
              "type": "string"
            },
            "has_more": {
              "type": "boolean"
            }
          }
        },
        "Conversation": {
          "type": "object",
          "required": [
            "conversation_id",
            "type",
            "title",
            "avatar_url",
            "unread_count",
            "is_pinned",
            "is_muted"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            },
            "type": {
              "$ref": "#/$defs/ConversationType"
            },
            "title": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "last_message_at": {
              "type": "string",
              "format": "date-time"
            },
            "last_message_text": {
              "type": "string"
            },
            "unread_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "members_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "subscribers_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "is_pinned": {
              "type": "boolean"
            },
            "is_muted": {
              "type": "boolean"
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "extra": {
              "type": "object",
              "additionalProperties": true,
              "description": "渠道扩展字段；WhatsApp 群会话可包含公告群分类，会话列表不保证提供该分类。",
              "properties": {
                "is_announcement_group": {
                  "type": "boolean",
                  "description": "仅 WhatsApp 群会话提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。分类不表示当前账号具备发送权限。",
                  "example": false
                }
              }
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        }
      }
    }
  },
  "listGroupJoinRequests": {
    "api": "device",
    "operationId": "listGroupJoinRequests",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/groups/join-requests",
    "tag": "Groups",
    "summary": "列出待审批入群申请",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_group_join_requests",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "group_id": {
                  "type": "string",
                  "description": "渠道侧群组标识。"
                }
              },
              "required": [
                "group_id"
              ]
            }
          },
          "required": [
            "path",
            "query"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/GroupJoinRequestsResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "GroupJoinRequestsResult": {
          "type": "object",
          "required": [
            "group_id",
            "items"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/GroupJoinRequest"
              }
            }
          }
        },
        "GroupJoinRequest": {
          "type": "object",
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "lid": {
              "type": "string"
            },
            "requested_at": {
              "type": "string",
              "format": "date-time"
            }
          }
        }
      }
    }
  },
  "listGroups": {
    "api": "device",
    "operationId": "listGroups",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/groups",
    "tag": "Groups",
    "summary": "列出群组",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_groups",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "cursor": {
                  "type": "string",
                  "description": "Provider 不透明游标，应原样回传上一次响应的 `next_cursor`。 伪造、失效或跨查询复用的 cursor 可能被 Provider 忽略、重置为第一页，或返回 Provider 错误；客户端不得依赖统一的 400 行为。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 100,
                  "description": "每页返回数量。"
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/GroupListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "GroupListResult": {
          "type": "object",
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Group"
              }
            },
            "next_cursor": {
              "type": "string"
            },
            "has_more": {
              "type": "boolean"
            }
          }
        },
        "Group": {
          "type": "object",
          "required": [
            "id",
            "conversation_id",
            "name",
            "avatar_url"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "member_count": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64"
                },
                {
                  "type": "string",
                  "pattern": "^-?[0-9]+$"
                }
              ]
            },
            "joined_at": {
              "type": "string",
              "format": "date-time"
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "description": {
              "type": "string"
            },
            "permissions": {
              "$ref": "#/$defs/GroupPermissions"
            },
            "extra": {
              "type": "object",
              "additionalProperties": true,
              "description": "渠道扩展字段；WhatsApp 群资料可包含公告群分类，是否返回取决于本次查询可用资料。",
              "properties": {
                "is_announcement_group": {
                  "type": "boolean",
                  "description": "仅 WhatsApp 群提供。true 表示已确认是社群公告群，false 表示本次资料已确认不符合公告群条件；缺失表示未知，不返回 null。此属性独立于 permissions.admins_only，不表示当前账号具备发送权限。",
                  "example": false
                }
              }
            }
          }
        },
        "GroupPermissions": {
          "type": "object",
          "additionalProperties": false,
          "description": "群整体发言权限快照，仅来源明确提供时返回。缺失表示未知；false 表示普通成员可发言，不表示当前账号一定可发送。",
          "properties": {
            "admins_only": {
              "type": "boolean",
              "description": "true 表示仅管理员发言；false 是明确状态，不能视为缺省。"
            }
          }
        }
      }
    }
  },
  "listPostComments": {
    "api": "device",
    "operationId": "listPostComments",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/posts/comments/list",
    "tag": "Posts",
    "summary": "列出帖子的一级评论",
    "description": "仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 可直接提交已知 post_id，无需先查询帖子列表或详情；目标是否可访问由渠道结果决定。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 分页核验未完成返回可重试失败，不能视为资源不存在。 第三方 post_id 放在 JSON body，不要求帖子属于当前账号。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request。 仅保证一级评论，不提供完整回复分页。空列表为 []，has_more=false 时省略 next_cursor。 读取失败保留既有 provider 错误分类；其他读取失败返回 502 list_post_comments_failed（39003）。",
    "authRequired": true,
    "toolName": "device_list_post_comments",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/PostCommentListRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "PostCommentListRequest": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "post_id"
          ],
          "properties": {
            "post_id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "cursor": {
              "type": "string",
              "minLength": 1,
              "description": "原样传回上一页的 next_cursor；首次请求省略。"
            },
            "limit": {
              "type": "integer",
              "minimum": 1,
              "maximum": 50,
              "default": 20
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/PostCommentListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "PostCommentListResult": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/PostComment"
              }
            },
            "has_more": {
              "type": "boolean"
            },
            "next_cursor": {
              "type": "string",
              "minLength": 1,
              "description": "不透明游标，仅 has_more=true 时提供，调用方原样传回。"
            }
          },
          "oneOf": [
            {
              "properties": {
                "has_more": {
                  "const": true
                }
              },
              "required": [
                "next_cursor"
              ]
            },
            {
              "properties": {
                "has_more": {
                  "const": false
                }
              },
              "not": {
                "required": [
                  "next_cursor"
                ]
              }
            }
          ]
        },
        "PostComment": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id",
            "post_id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "post_id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "text": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "author": {
              "$ref": "#/$defs/PostAuthor"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "description": "可靠取得的评论创建时间，RFC3339 UTC；未知时省略，不用观察时间代替。"
            },
            "parent_comment_id": {
              "$ref": "#/$defs/PostResourceID",
              "description": "仅在确认父子关系后提供；缺失本身不能证明该评论是可回复的一级评论。"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        },
        "PostAuthor": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "display_name": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "avatar_url": {
              "type": "string",
              "minLength": 1,
              "description": "可靠取得的非空头像地址；未知时省略。"
            }
          }
        }
      }
    }
  },
  "listPosts": {
    "api": "device",
    "operationId": "listPosts",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/posts",
    "tag": "Posts",
    "summary": "列出本账号帖子",
    "description": "仅支持 TikTok 当前登录账号；其他渠道返回 501 unsupported_by_provider。 非法字段、null、空白 ID、分页范围错误返回 400 invalid_request（10000）。limit 默认 20，范围 1–50。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 归属或分页核验未完成返回可重试失败，不能视为资源不存在。 has_more=true 时提供 next_cursor；末页 has_more=false 并省略 next_cursor。 读取失败保留 provider_not_ready、provider_invalid_request、provider_unavailable 分类；其他读取失败返回 502 list_posts_failed（39002）。",
    "authRequired": true,
    "toolName": "device_list_posts",
    "mutability": "read",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            },
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "cursor": {
                  "type": "string",
                  "minLength": 1,
                  "description": "原样传回上一页的 next_cursor；首次请求省略。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 50,
                  "default": 20
                }
              }
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ]
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/PostListResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "PostListResult": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "items",
            "has_more"
          ],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Post"
              }
            },
            "has_more": {
              "type": "boolean"
            },
            "next_cursor": {
              "type": "string",
              "minLength": 1,
              "description": "不透明游标，仅 has_more=true 时提供，调用方原样传回。"
            }
          },
          "oneOf": [
            {
              "properties": {
                "has_more": {
                  "const": true
                }
              },
              "required": [
                "next_cursor"
              ]
            },
            {
              "properties": {
                "has_more": {
                  "const": false
                }
              },
              "not": {
                "required": [
                  "next_cursor"
                ]
              }
            }
          ]
        },
        "Post": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "text": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "author": {
              "$ref": "#/$defs/PostAuthor"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "description": "可靠取得的创建时间，RFC3339 UTC；未知时省略。"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        },
        "PostAuthor": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "display_name": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "avatar_url": {
              "type": "string",
              "minLength": 1,
              "description": "可靠取得的非空头像地址；未知时省略。"
            }
          }
        }
      }
    }
  },
  "listProviderRegions": {
    "api": "device",
    "operationId": "listProviderRegions",
    "method": "GET",
    "path": "/v1/providers/{provider}/regions",
    "tag": "Providers",
    "summary": "查询 provider 地区可用性",
    "description": "",
    "authRequired": true,
    "toolName": "device_list_provider_regions",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "read",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "provider": {
                  "$ref": "#/$defs/ProviderInputName"
                }
              },
              "required": [
                "provider"
              ]
            }
          },
          "required": [
            "path"
          ]
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "ProviderInputName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol",
            "x",
            "x_client",
            "twitter_client"
          ],
          "description": "provider 输入名称。兼容 `x`、`x_client`、`twitter_client`，这些输入会归一化为 `twitter` 并以 `twitter` 输出；Webhook URL path 不适用该别名规则。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ProviderRegionsResponse"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ProviderRegionsResponse": {
          "type": "object",
          "required": [
            "provider",
            "regions"
          ],
          "properties": {
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "regions": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/RegionAvailability"
              }
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RegionAvailability": {
          "type": "object",
          "required": [
            "region",
            "supported",
            "allocatable"
          ],
          "properties": {
            "region": {
              "type": "string"
            },
            "supported": {
              "type": "boolean"
            },
            "allocatable": {
              "type": "boolean"
            }
          }
        }
      }
    }
  },
  "listWebhookEndpoints": {
    "api": "device",
    "operationId": "listWebhookEndpoints",
    "method": "GET",
    "path": "/v1/webhook-endpoints",
    "tag": "Webhook Endpoints",
    "summary": "列出 webhook endpoint",
    "description": "省略 account_id 时只列当前工作空间的 Webhook 端点；指定时只列该账号的独立配置。 账号没有独立配置时 data 为 []，不混入继承的工作空间配置。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。",
    "authRequired": true,
    "toolName": "device_list_webhook_endpoints",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "query": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "\\S",
                  "description": "可选的公开账号 ID，例如 `acc_example`。不可为空、仅含空白或重复出现。 参数名必须精确使用 account_id；大小写变体返回 400 invalid_request，不按省略处理。 列表接口用它筛选账号独立配置；详情、停用、删除接口只校验端点已有账号归属。"
                }
              }
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/$defs/WebhookEndpoint"
                  }
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "WebhookEndpoint": {
          "type": "object",
          "required": [
            "id",
            "url",
            "status",
            "signing_enabled"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "account_id": {
              "type": "string",
              "minLength": 1,
              "description": "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              }
            },
            "signing_enabled": {
              "type": "boolean"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "markConversationRead": {
    "api": "device",
    "operationId": "markConversationRead",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/read",
    "tag": "Conversations",
    "summary": "标记会话已读",
    "description": "按账号所属渠道校验已读目标。Telegram 必须提供单个 up_to_message_id， 来自当前账号在该会话收到的消息，例如 message.received 的 data.message.id，且 data.message.direction=inbound；不能使用发送响应的 data.message_id 或事件顶层 id。 将当前账号在该会话中截至该消息（含自身及此前消息）的记录标为已读； 不支持省略消息 ID 标记整个会话，也不支持非空 up_to_message_sender_id。 WhatsApp 的消息级已读须成对提供非空 up_to_message_id 和 up_to_message_sender_id； 省略两者，或两者去除首尾空白后均为空时，标记整个会话。成功返回 data.ok=true；本次操作不查询对方已读状态，也不新增 Webhook 事件。",
    "authRequired": true,
    "toolName": "device_mark_conversation_read",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationReadRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationReadRequest": {
          "allOf": [
            {
              "$ref": "#/$defs/ConversationIdRequest"
            },
            {
              "type": "object",
              "properties": {
                "up_to_message_id": {
                  "type": "string",
                  "description": "按账号所属渠道校验，字段类型始终为字符串。 Telegram 必填：当前账号在该会话收到的单个消息 ID，例如 message.received 的 data.message.id，且 data.message.direction=inbound。 去除首尾空白后必须只含 ASCII 十进制数字，数值范围为 1–2147483647； 截止该消息（含自身及此前消息）标记已读。不能使用逗号列表、正负号、小数、指数、内部空白或非 ASCII 数字，不能省略或使用 0 表示整个会话。 WhatsApp 可选：一个消息 ID，或属于同一发送者的多个消息 ID（英文逗号分隔）； 与 up_to_message_sender_id 成对提供非空值。省略两者时标记整个会话已读；两者去除首尾空白后均为空时同样标记整个会话。"
                },
                "up_to_message_sender_id": {
                  "type": "string",
                  "description": "WhatsApp 消息级已读的渠道侧发送者标识，与非空 up_to_message_id 成对提供；群聊应传 Webhook 事件中的 data.sender.id。多个消息 ID 必须属于同一发送者。Telegram 不支持此参数，提供非空值时返回 invalid_request。"
                }
              }
            }
          ]
        },
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "markConversationUnread": {
    "api": "device",
    "operationId": "markConversationUnread",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/unread",
    "tag": "Conversations",
    "summary": "标记会话未读",
    "description": "",
    "authRequired": true,
    "toolName": "device_mark_conversation_unread",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "muteConversation": {
    "api": "device",
    "operationId": "muteConversation",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/mute",
    "tag": "Conversations",
    "summary": "静音会话",
    "description": "",
    "authRequired": true,
    "toolName": "device_mute_conversation",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationMuteRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationMuteRequest": {
          "allOf": [
            {
              "$ref": "#/$defs/ConversationIdRequest"
            },
            {
              "type": "object",
              "properties": {
                "duration": {
                  "type": "integer",
                  "format": "int64",
                  "minimum": 0,
                  "description": "相对静音时长，单位秒；0 表示永久静音。"
                },
                "mute_until": {
                  "type": "string",
                  "format": "date-time",
                  "description": "RFC3339 绝对结束时间，与 `duration` 互斥。"
                }
              }
            }
          ]
        },
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "pinConversation": {
    "api": "device",
    "operationId": "pinConversation",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/pin",
    "tag": "Conversations",
    "summary": "置顶会话",
    "description": "",
    "authRequired": true,
    "toolName": "device_pin_conversation",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "pinMessage": {
    "api": "device",
    "operationId": "pinMessage",
    "method": "POST",
    "path": "/v1/messages/pin",
    "tag": "Messages",
    "summary": "置顶或取消置顶消息",
    "description": "",
    "authRequired": true,
    "toolName": "device_pin_message",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/MessagePinRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "MessagePinRequest": {
          "allOf": [
            {
              "$ref": "#/$defs/MessageTargetRequest"
            },
            {
              "type": "object",
              "required": [
                "pinned"
              ],
              "properties": {
                "pinned": {
                  "type": "boolean"
                },
                "duration_seconds": {
                  "type": "integer",
                  "format": "uint32"
                }
              }
            }
          ]
        },
        "MessageTargetRequest": {
          "type": "object",
          "required": [
            "account_id",
            "conversation_id",
            "message_id"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "message_id": {
              "type": "string"
            },
            "sender_id": {
              "type": "string",
              "description": "目标消息作者标识；缺省通常表示账号自身。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "reactMessage": {
    "api": "device",
    "operationId": "reactMessage",
    "method": "POST",
    "path": "/v1/messages/reaction",
    "tag": "Messages",
    "summary": "给消息加表情回应或取消回应",
    "description": "",
    "authRequired": true,
    "toolName": "device_react_message",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/MessageReactionRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "MessageReactionRequest": {
          "allOf": [
            {
              "$ref": "#/$defs/MessageTargetRequest"
            },
            {
              "type": "object",
              "properties": {
                "emoji": {
                  "type": "string",
                  "description": "空字符串表示取消回应。"
                }
              }
            }
          ]
        },
        "MessageTargetRequest": {
          "type": "object",
          "required": [
            "account_id",
            "conversation_id",
            "message_id"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "message_id": {
              "type": "string"
            },
            "sender_id": {
              "type": "string",
              "description": "目标消息作者标识；缺省通常表示账号自身。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "reconnectAccountRuntime": {
    "api": "device",
    "operationId": "reconnectAccountRuntime",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/runtime/reconnect",
    "tag": "Account Runtime",
    "summary": "重连账号运行态",
    "description": "TikTok 重连会应用最新 provider_data.enable_comment；可在 body 中临时传入 Boolean enable_comment 覆盖，false 显式关闭。 字符串、数字或 null 返回 400 invalid_request。轮询默认关闭；关闭不撤回已排队事件。",
    "authRequired": true,
    "toolName": "device_reconnect_account_runtime",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/RuntimeActionResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "RuntimeActionResult": {
          "type": "object",
          "required": [
            "account_id",
            "provider",
            "action",
            "operation_status",
            "runtime_status",
            "runtime_error"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "enum": [
                "refresh_status",
                "start",
                "stop",
                "reconnect"
              ]
            },
            "operation_status": {
              "type": "string",
              "examples": [
                "succeeded"
              ]
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "runtime_error": {
              "type": "string"
            },
            "auth_required": {
              "type": "boolean",
              "description": "可选的授权提示。本次 Provider 明确返回二维码、Passkey 等授权证据， 或当前 Session 已持久化此前由 Provider/Webhook 明确确认的授权进行态时 才为 `true`；不能仅根据 `runtime_status=disconnected` 或 `client_connect=false` 推断。运行态接口不返回二维码、`code`、 `qrcode`、`auth_payload` 或 `provider_data`；调用方应改用 `/v1/accounts/{account_id}/auth/qr/start` 和 `/v1/accounts/{account_id}/auth/qr/check` 获取标准授权状态与载荷。"
            },
            "auth_status": {
              "type": "string",
              "description": "可选的标准授权状态快照，仅在本次运行态操作取得 Provider 明确授权证据， 或复用当前 Session 中已确认的授权进行态时返回，例如 `pending`、 `awaiting_qr_scan` 或 `passkey_required`。该字段用于指引调用方进入授权流程， 不替代授权接口返回的完整状态与载荷。",
              "examples": [
                "pending",
                "awaiting_qr_scan",
                "passkey_required"
              ]
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        }
      }
    }
  },
  "refreshAccountRuntime": {
    "api": "device",
    "operationId": "refreshAccountRuntime",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/runtime/refresh",
    "tag": "Account Runtime",
    "summary": "刷新账号运行态",
    "description": "",
    "authRequired": true,
    "toolName": "device_refresh_account_runtime",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/RuntimeActionResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "RuntimeActionResult": {
          "type": "object",
          "required": [
            "account_id",
            "provider",
            "action",
            "operation_status",
            "runtime_status",
            "runtime_error"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "enum": [
                "refresh_status",
                "start",
                "stop",
                "reconnect"
              ]
            },
            "operation_status": {
              "type": "string",
              "examples": [
                "succeeded"
              ]
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "runtime_error": {
              "type": "string"
            },
            "auth_required": {
              "type": "boolean",
              "description": "可选的授权提示。本次 Provider 明确返回二维码、Passkey 等授权证据， 或当前 Session 已持久化此前由 Provider/Webhook 明确确认的授权进行态时 才为 `true`；不能仅根据 `runtime_status=disconnected` 或 `client_connect=false` 推断。运行态接口不返回二维码、`code`、 `qrcode`、`auth_payload` 或 `provider_data`；调用方应改用 `/v1/accounts/{account_id}/auth/qr/start` 和 `/v1/accounts/{account_id}/auth/qr/check` 获取标准授权状态与载荷。"
            },
            "auth_status": {
              "type": "string",
              "description": "可选的标准授权状态快照，仅在本次运行态操作取得 Provider 明确授权证据， 或复用当前 Session 中已确认的授权进行态时返回，例如 `pending`、 `awaiting_qr_scan` 或 `passkey_required`。该字段用于指引调用方进入授权流程， 不替代授权接口返回的完整状态与载荷。",
              "examples": [
                "pending",
                "awaiting_qr_scan",
                "passkey_required"
              ]
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        }
      }
    }
  },
  "replyPostComment": {
    "api": "device",
    "operationId": "replyPostComment",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/posts/comments/reply",
    "tag": "Posts",
    "summary": "发布一级评论或回复一级评论",
    "description": "仅支持 TikTok；省略 comment_id 时发布一级评论，提供非空白字符串 comment_id 时回复指定的一级评论。其他渠道返回 501 unsupported_by_provider。 不要求帖子属于当前账号；发布或回复无需先查询帖子列表、详情或评论。 接口不预先确认帖子可访问性、评论所属帖子或层级；调用方应提供目标帖子的一级评论 ID。实际是否允许评论或回复由渠道结果决定，不保证任意帖子都可写入。 第三方 post_id、可选 comment_id 和必填 text 放在 JSON body；正文保留实际发送的原文。 comment_id 只有省略字段才表示发布一级评论；显式空串、纯空白、null 或非字符串仍返回 400 invalid_request（10000），不会改为发布一级评论。 TikTok 的 post_id 须为无前导零的正十进制整数字符串；不符合渠道格式时返回 400 provider_invalid_request，comment_id 沿用非空字符串要求。 账号不存在或不属于当前工作空间返回 404 account_not_found（20020）；非法参数返回 400 invalid_request（10000）。 200 data.status=accepted 表示请求已被接受，不表示已展示、送达或一定收到 Webhook；仅可靠取得新评论时附带 comment。 发布一级评论的 comment 不含 parent_comment_id；回复的 comment.parent_comment_id 对应本次请求的 comment_id。 写入后超时、断连或无法确认回执时结果未知，不自动重发；读取未找到评论或回复不能证明此前未创建。 写入前的 provider_not_ready、provider_invalid_request、provider_unavailable 分类保持不变；已确认的业务拒绝保留 provider_invalid_request。 写入后无法确认回执（如超时、断连）返回 502 reply_post_comment_failed（39004），结果可能未知；不自动重试写入。",
    "authRequired": true,
    "toolName": "device_reply_post_comment",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/PostCommentReplyRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "PostCommentReplyRequest": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "post_id",
            "text"
          ],
          "properties": {
            "post_id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "comment_id": {
              "$ref": "#/$defs/PostResourceID",
              "description": "省略时发布一级评论；提供时表示回复目标帖子下的一级评论，不预先确认其所属帖子或层级。显式空串、纯空白、null 或非字符串均不合法。"
            },
            "text": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "description": "非空白正文，保留原文，不自动删除首尾空格。"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/PostCommentReplyResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "PostCommentReplyResult": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "accepted"
              ]
            },
            "comment": {
              "$ref": "#/$defs/PostComment",
              "description": "仅可靠取得本次新评论回执时提供，不保证每次都有。发布一级评论时不含 parent_comment_id；回复时 parent_comment_id 与请求 comment_id 一致。"
            }
          }
        },
        "PostComment": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id",
            "post_id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "post_id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "text": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "author": {
              "$ref": "#/$defs/PostAuthor"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "description": "可靠取得的评论创建时间，RFC3339 UTC；未知时省略，不用观察时间代替。"
            },
            "parent_comment_id": {
              "$ref": "#/$defs/PostResourceID",
              "description": "仅在确认父子关系后提供；缺失本身不能证明该评论是可回复的一级评论。"
            }
          }
        },
        "PostResourceID": {
          "type": "string",
          "minLength": 1,
          "pattern": "\\S",
          "description": "第三方字符串标识；按原值传递，不转换为数字。"
        },
        "PostAuthor": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "$ref": "#/$defs/PostResourceID"
            },
            "display_name": {
              "type": "string",
              "description": "可靠取得时保留原文，包括空字符串；未知时省略。"
            },
            "avatar_url": {
              "type": "string",
              "minLength": 1,
              "description": "可靠取得的非空头像地址；未知时省略。"
            }
          }
        }
      }
    }
  },
  "requestConversationHistory": {
    "api": "device",
    "operationId": "requestConversationHistory",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/history/request",
    "tag": "Conversations",
    "summary": "请求补拉会话历史消息",
    "description": "仅支持 provider=whatsapp 的私聊，不包含 whatsapp-protocol；使用同一会话中一条原生内容消息的完整 before 请求更早的历史。 account_id 必须是单个非空路径段，不能包含空白或斜杠（包括编码斜杠）；入口账号参数校验失败返回 400 invalid_request。 HTTP 202 和 data.status=accepted 仅表示补拉请求已受理，不同步返回消息，也不表示历史已经拉取完成。 先订阅 conversation.history，再发起请求；可用历史批次通过该事件异步返回，并携带 data.history.source=on_demand。 顶层 request_id 仅用于本次 HTTP 请求排障，不是补拉任务 ID，不能用于关联后续回调；一次请求可能对应多个、重复或晚到的批次，也可能没有回调。 继续补拉时，从已收到的原生内容消息中选择最早且 id、sent_at、direction 完整的消息构造 before。 type=call 的合成通话记录不能作为锚点；即使三个字段完整，合成记录 ID 也不是原生消息 ID。before 不增加 type 字段，由调用方选择消息时排除通话记录。 不提供下一页游标或完成状态；不能根据空批次、消息少于 limit 或等待超时判断历史已到底，HTTP 超时后也可能收到回调，不应自动重试。 群聊和频道返回 400 unsupported_conversation_type；其他渠道返回 501 unsupported_by_provider。",
    "authRequired": true,
    "toolName": "device_request_conversation_history",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationHistoryRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationHistoryRequest": {
          "type": "object",
          "required": [
            "conversation_id",
            "before"
          ],
          "properties": {
            "conversation_id": {
              "type": "string",
              "pattern": "^[0-9]+@lid$",
              "description": "WhatsApp 标准私聊 LID；必须属于 before 指向的会话，不接受手机号或其他会话类型。"
            },
            "before": {
              "$ref": "#/$defs/ConversationHistoryBefore"
            },
            "limit": {
              "type": "integer",
              "minimum": 1,
              "maximum": 50,
              "default": 50,
              "description": "请求数量，不保证实际返回相同数量；仅省略时默认 50，显式 null、0、非整数或超过 50 均返回 invalid_request。"
            }
          }
        },
        "ConversationHistoryBefore": {
          "type": "object",
          "required": [
            "message_id",
            "sent_at",
            "direction"
          ],
          "description": "同一会话中同一条原生内容消息的位置；所有字段必须来自该消息，不接受 null。type=call 的合成通话记录即使三个字段完整也不能作为锚点；请求不包含 type 字段。",
          "properties": {
            "message_id": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "not": {
                "pattern": "^call_record_[0-9a-f]{64}$"
              },
              "description": "原生内容消息的 id；不接受合成通话记录 ID，去除首尾空白后仍为该记录格式时同样无效。不能使用顶层事件 id 或 HTTP request_id 代替。"
            },
            "sent_at": {
              "type": "string",
              "format": "date-time",
              "description": "该消息的 RFC3339 发送时间，Unix 秒值必须大于 0；不能使用事件 occurred_at 或当前时间代替。"
            },
            "direction": {
              "type": "string",
              "enum": [
                "inbound",
                "outbound"
              ],
              "description": "该消息相对于当前账号的收发方向；inbound 为接收，outbound 为发送。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationHistoryAccepted"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationHistoryAccepted": {
          "type": "object",
          "required": [
            "status",
            "conversation_id",
            "limit"
          ],
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "accepted"
              ],
              "description": "仅确认请求已受理，不表示收到历史或完成补拉。"
            },
            "conversation_id": {
              "type": "string",
              "description": "本次请求的标准会话 ID。"
            },
            "limit": {
              "type": "integer",
              "minimum": 1,
              "maximum": 50,
              "description": "本次实际请求的数量上限。"
            }
          }
        }
      }
    }
  },
  "revokeMessage": {
    "api": "device",
    "operationId": "revokeMessage",
    "method": "POST",
    "path": "/v1/messages/revoke",
    "tag": "Messages",
    "summary": "撤回消息",
    "description": "",
    "authRequired": true,
    "toolName": "device_revoke_message",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/MessageRevokeRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "MessageRevokeRequest": {
          "$ref": "#/$defs/MessageTargetRequest"
        },
        "MessageTargetRequest": {
          "type": "object",
          "required": [
            "account_id",
            "conversation_id",
            "message_id"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "message_id": {
              "type": "string"
            },
            "sender_id": {
              "type": "string",
              "description": "目标消息作者标识；缺省通常表示账号自身。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "rotateApiKey": {
    "api": "device",
    "operationId": "rotateApiKey",
    "method": "POST",
    "path": "/v1/api-keys/{key_id}/rotate",
    "tag": "API Keys",
    "summary": "轮换 API Key",
    "description": "轮换后返回新的完整 `api_key`，旧完整密钥不可恢复。",
    "authRequired": true,
    "toolName": "device_rotate_api_key",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "key_id": {
                  "type": "string",
                  "description": "API Key public_id，例如 `ak_xxx`。"
                }
              },
              "required": [
                "key_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/APIKeyCreateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "APIKeyCreateRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "prefix": {
              "type": "string",
              "description": "生成 API Key 时使用的前缀。省略时使用默认前缀；不接受 null。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/APIKeyCreateResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "APIKeyCreateResult": {
          "type": "object",
          "required": [
            "key",
            "api_key"
          ],
          "properties": {
            "key": {
              "$ref": "#/$defs/APIKey"
            },
            "api_key": {
              "type": "string",
              "description": "完整明文 API Key，仅创建或轮换响应中出现一次。"
            }
          }
        },
        "APIKey": {
          "type": "object",
          "required": [
            "id",
            "name",
            "key_prefix",
            "status"
          ],
          "properties": {
            "id": {
              "type": "string",
              "examples": [
                "ak_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "key_prefix": {
              "type": "string",
              "description": "可展示的 Key 前缀，不是完整 API Key。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            }
          }
        }
      }
    }
  },
  "sendMessage": {
    "api": "device",
    "operationId": "sendMessage",
    "method": "POST",
    "path": "/v1/messages",
    "tag": "Messages",
    "summary": "发送消息",
    "description": "`message.type=sticker` 用于发送贴纸，当前仅 WhatsApp user/group 支持，不包含 whatsapp-protocol。 url/file_url/file_key 恰好提供一个非空来源；本期 WhatsApp 只支持 HTTP(S) url/file_url，file_key、非空 mentions 或不支持的目标返回 501 unsupported_by_provider。 API 按原字节提交 WebP，不设置静态性、像素尺寸或渠道业务大小限制；静态、动画及具体素材兼容性由渠道判定。 本接口仅检查基本 WebP 容器完整性，不解码或转码。下载与暂存的硬资源上限为 10 MiB（10485760 字节），下载最多 15 秒、3 次跳转。 该上限是本接口的资源边界，不代表渠道接受该大小以内的所有素材。accepted 仅表示受理，不保证送达、素材可解码或动画播放效果。 sticker 不允许 text/caption/contacts/poll/link_preview 等其他内容字段，即使为 null 或空值也返回 400 invalid_request。 sticker 的 provider_data 只能省略或为空对象；非对象为 400 invalid_request，非空对象为 400 provider_invalid_request。 支持既有 reply_to.reply_token；无效或无法解封的 token 返回 400 invalid_reply_token。 基本 WebP 容器不完整、不可接受的素材来源地址或超过硬资源上限时，发送前返回 400 provider_invalid_request、numeric_code=36007，表示贴纸尚未发送。 message 提供具体素材校验原因，原因缺失时为 Invalid sticker media；调用方按数字码判断，修正素材或来源地址后再发送。 非空 provider_data、公共结构错误和实际渠道参数拒绝沿用各自分类，实际渠道参数拒绝仍为 400 provider_invalid_request、numeric_code=30001。 贴纸实际发送失败保留既有 HTTP、code、numeric_code 和专属分类提示，提供可用的具体失败原因；上游未提供时沿用默认提示。其他消息类型保持既有行为。 素材获取的 HTTP 故障、超时、存储或其他准备失败返回 500 send_message_failed、numeric_code=36001，message 提供具体准备失败原因，缺失时沿用默认提示；不使用 36007。 sticker 超时或结果不明时不会自动重发；request_id/client_request_id 仅用于追踪，不提供发送幂等保证。 `message.type=poll` 用于创建投票；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 投票必须提供非空白题目、至少两个非空白标题的选项及整数 max_selections（1 到选项数）；原文保持不变。 本项目 WhatsApp 发送策略限制题目最多 255 个 Unicode 字符、选项最多 12 个、每项标题最多 100 个 Unicode 字符，并拒绝完全相同的原文标题；这些不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 投票不支持 reply_to 或非空 mentions；不支持的渠道、目标或组合返回 HTTP 501 unsupported_by_provider。 投票公共结构、null、未知字段或混合载荷错误返回 HTTP 400 invalid_request；违反 WhatsApp 字段策略或提供 provider_data.context_info/extra 返回 HTTP 400 provider_invalid_request。 创建成功沿用发送响应；引用上下文完整时可选返回 data.reply_token，普通文字消息可通过 reply_to.reply_token 引用该投票，无需等待创建回调。 缺少可引用上下文时省略 token，accepted 状态不因此改变；不能用 message_id 或 provider_ref 代替 token。新投票自身仍不支持 reply_to，不提供投票统计或代替账号投票。 超时或响应不完整时发送结果可能未知，先核对实际消息与回调再决定重试。 `message.type=link_preview` 用于发送自定义链接预览；当前仅 WhatsApp 的 user/group 目标支持，不包含 `whatsapp-protocol`。 公共结构要求非空正文和 HTTP(S) 目标链接；WhatsApp 还要求非空标题、图片 URL，以及目标链接原文出现在正文中。 本项目 WhatsApp 发送策略限制标题最多 255 个 Unicode 字符、摘要最多 1024 个 Unicode 字符；这不是其他渠道的公共限制或平台硬性限制声明。 WhatsApp 链接预览不支持 `reply_to` 或非空 `mentions`，不支持的渠道、目标或组合返回 HTTP 501 `unsupported_by_provider`。 公共字段格式错误返回 HTTP 400 `invalid_request`；违反上述 WhatsApp 字段策略或使用覆盖卡片数据的渠道扩展返回 HTTP 400 `provider_invalid_request`。 本接口不抓取目标网页生成预览，调用方提供卡片内容。HTTP 200 / accepted 不表示已送达，也不保证一定收到自同步回调。 WhatsApp 消息发送被平台明确限制时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30019`。 调用方应按该数字码停止对此类失败的自动重试，确认平台限制解除后再发送。 `whatsapp` 群消息发送被明确拒绝为需要管理员权限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=34012`，`message` 为 `Group administrator privileges are required to send messages to this group`。 调用方应停止自动重试，核实群发言权限和当前账号角色，由群管理员调整权限后再发送。 此错误不表示该群一定是社群公告群，也不确认群设置或账号角色的具体状态；不适用于 `whatsapp-protocol`。 Device API 在 `whatsapp` 发送操作中识别到账号受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=20102`，与该渠道账号受限 Webhook 的数字码一致。调用方应停止该账号的自动发送和重试， 引导用户在官方 WhatsApp 客户端检查并处理限制，恢复正常后再按需重新授权。 此分类不会自动修改账号状态或产生额外回调，不能仅因运行状态为 `running` 恢复发送。 Device API 识别到 `whatsapp-protocol` 账号当前登录受限时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30020`。调用方必须停止自动重试，引导用户前往官方 WhatsApp 客户端检查， 处理完成并重新授权后再恢复发送。上述错误都不表示永久封号，也不能据此认定账号已确认封禁或存在固定恢复期限； 其他发送失败沿用原有错误分类。 Device API 识别到 WhatsApp 账号连接未建立时，返回 HTTP 502、`code=provider_unavailable` 和 `numeric_code=30021`，`message` 保留原始连接错误；此错误不表示已登出或授权失效。 调用方应暂停发送，调用 `POST /v1/accounts/{account_id}/runtime/refresh`，按最新状态恢复连接， 确认 `runtime_status=running` 后再发送。失败请求不会自动重发或重连。 `numeric_code=30010` 的 `message` 在有原因时为 `Provider operation failed: <原始错误原因>`， 没有原因时为 `Provider operation failed`；调用方应按数字码判断，不依赖可变化的文案。",
    "authRequired": true,
    "toolName": "device_send_message",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/SendMessageRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "SendMessageRequest": {
          "type": "object",
          "required": [
            "account_id",
            "to",
            "message"
          ],
          "allOf": [
            {
              "if": {
                "type": "object",
                "additionalProperties": true,
                "properties": {
                  "message": {
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                      "type": {
                        "not": {
                          "const": "sticker"
                        }
                      }
                    }
                  }
                }
              },
              "then": {
                "type": "object",
                "additionalProperties": true,
                "properties": {
                  "provider_data": {
                    "$ref": "#/$defs/SendMessageProviderData"
                  }
                }
              }
            }
          ],
          "properties": {
            "account_id": {
              "type": "string",
              "minLength": 1
            },
            "to": {
              "$ref": "#/$defs/Recipient"
            },
            "message": {
              "$ref": "#/$defs/MessagePayload"
            },
            "provider_data": {
              "type": "object",
              "additionalProperties": true
            },
            "reply_to": {
              "$ref": "#/$defs/ReplyTo"
            },
            "mentions": {
              "type": "array",
              "description": "群消息的 @ 目标列表。`type=member` 使用对应 Provider 的成员 `id`； `type=all` 表示 @所有人，仅在 Provider 支持时生效，否则返回 `unsupported_message_type`。",
              "items": {
                "$ref": "#/$defs/Mention"
              }
            }
          }
        },
        "SendMessageProviderData": {
          "type": "object",
          "description": "发送消息时使用的渠道扩展参数。字段仅在对应渠道和消息类型支持时生效。",
          "properties": {
            "seconds": {
              "type": "integer",
              "minimum": 0,
              "description": "音频或视频时长，单位为秒。仅适用于使用 WhatsApp 账号发送的 `audio` 或 `video` 消息；发送 `video` 时取值范围为 0 到 4294967295（uint32）。"
            },
            "waveform": {
              "type": "string",
              "description": "音频波形数据。仅适用于使用 WhatsApp 账号发送的 `audio` 消息。 非空值必须使用标准 Base64 编码，且解码后必须是可解析的 JSON 波形数据；空字符串按未提供处理，其他格式错误返回 HTTP 400 `provider_invalid_request`。"
            }
          },
          "additionalProperties": true
        },
        "Recipient": {
          "type": "object",
          "required": [
            "id",
            "type"
          ],
          "properties": {
            "id": {
              "type": "string",
              "minLength": 1,
              "description": "渠道侧接收方标识。"
            },
            "type": {
              "$ref": "#/$defs/ConversationType"
            }
          }
        },
        "MessagePayload": {
          "allOf": [
            {
              "if": {
                "properties": {
                  "type": {
                    "not": {
                      "const": "link_preview"
                    }
                  }
                }
              },
              "then": {
                "type": "object",
                "additionalProperties": true,
                "properties": {
                  "link_preview": false
                }
              }
            },
            {
              "if": {
                "properties": {
                  "type": {
                    "not": {
                      "const": "poll"
                    }
                  }
                }
              },
              "then": {
                "type": "object",
                "additionalProperties": true,
                "properties": {
                  "poll": false
                }
              }
            }
          ],
          "oneOf": [
            {
              "$ref": "#/$defs/TextMessagePayload"
            },
            {
              "$ref": "#/$defs/MediaMessagePayload"
            },
            {
              "$ref": "#/$defs/ContactMessagePayload"
            },
            {
              "$ref": "#/$defs/LinkPreviewMessagePayload"
            },
            {
              "$ref": "#/$defs/PollMessagePayload"
            },
            {
              "$ref": "#/$defs/StickerMessagePayload"
            }
          ],
          "discriminator": {
            "propertyName": "type"
          }
        },
        "ReplyTo": {
          "type": "object",
          "required": [
            "reply_token"
          ],
          "properties": {
            "reply_token": {
              "type": "string",
              "minLength": 1,
              "description": "来自可引用消息事件 `data.message.reply_token` 或发送响应 `data.reply_token` 的不透明句柄，按原账号及会话原样使用；不能用消息 ID 替代。"
            }
          }
        },
        "Mention": {
          "type": "object",
          "description": "@ 目标。`type` 缺省时按 `member` 处理，以兼容旧请求； `type=member` 必须传 `id`，`type=all` 不传 `id` 且仅适用于群聊。",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "member",
                "all"
              ],
              "default": "member"
            },
            "id": {
              "type": "string",
              "minLength": 1,
              "description": "`type=member` 时必填的 Provider 成员标识。"
            }
          },
          "anyOf": [
            {
              "required": [
                "id"
              ],
              "properties": {
                "type": {
                  "enum": [
                    "member"
                  ]
                }
              }
            },
            {
              "required": [
                "type"
              ],
              "properties": {
                "type": {
                  "const": "all"
                }
              },
              "not": {
                "required": [
                  "id"
                ]
              }
            }
          ]
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ],
          "description": "标准会话类型；WhatsApp 社群公告群继续使用 group。"
        },
        "TextMessagePayload": {
          "type": "object",
          "required": [
            "type",
            "text"
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text"
              ]
            },
            "text": {
              "type": "string",
              "minLength": 1
            },
            "caption": {
              "type": "string"
            }
          }
        },
        "MediaMessagePayload": {
          "type": "object",
          "required": [
            "type"
          ],
          "anyOf": [
            {
              "required": [
                "url"
              ],
              "properties": {
                "url": {}
              }
            },
            {
              "required": [
                "file_url"
              ],
              "properties": {
                "file_url": {}
              }
            },
            {
              "required": [
                "file_key"
              ],
              "properties": {
                "file_key": {}
              }
            }
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "image",
                "video",
                "audio",
                "document",
                "file"
              ]
            },
            "url": {
              "type": "string",
              "format": "uri",
              "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://"
            },
            "file_url": {
              "type": "string",
              "format": "uri",
              "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://"
            },
            "file_key": {
              "type": "string",
              "minLength": 1
            },
            "caption": {
              "type": "string"
            }
          }
        },
        "ContactMessagePayload": {
          "type": "object",
          "required": [
            "type",
            "contacts"
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "contact"
              ]
            },
            "contacts": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/$defs/ContactCard"
              }
            }
          }
        },
        "LinkPreviewMessagePayload": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "type",
            "text",
            "link_preview"
          ],
          "description": "链接预览发送结构；不能与媒体、名片或其他消息载荷字段混用。渠道支持范围和附加限制见发送接口说明。",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "link_preview"
              ]
            },
            "text": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "description": "消息正文；WhatsApp 要求其中包含 link_preview.url 的原文。"
            },
            "link_preview": {
              "$ref": "#/$defs/SendMessageLinkPreview"
            }
          }
        },
        "PollMessagePayload": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "type",
            "poll"
          ],
          "description": "创建投票；不能附带 text、媒体、名片、链接预览或其他消息载荷。渠道限制见发送接口说明。",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "poll"
              ]
            },
            "poll": {
              "$ref": "#/$defs/SendMessagePoll"
            }
          }
        },
        "StickerMessagePayload": {
          "type": "object",
          "additionalProperties": false,
          "description": "公共结构要求恰好一种非空来源；WhatsApp 当前支持 WebP 的 url/file_url，静态、动画及素材兼容性由渠道判定。API 检查基本容器完整性，下载与暂存硬资源上限为 10 MiB（10485760 字节），不解码或转码；file_key 结构合法但返回 501 unsupported_by_provider。额外字段即使为空也不允许。",
          "required": [
            "type"
          ],
          "oneOf": [
            {
              "required": [
                "url"
              ],
              "properties": {
                "url": {}
              }
            },
            {
              "required": [
                "file_url"
              ],
              "properties": {
                "file_url": {}
              }
            },
            {
              "required": [
                "file_key"
              ],
              "properties": {
                "file_key": {}
              }
            }
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "sticker"
              ]
            },
            "url": {
              "type": "string",
              "format": "uri",
              "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://"
            },
            "file_url": {
              "type": "string",
              "format": "uri",
              "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://"
            },
            "file_key": {
              "type": "string",
              "pattern": "\\S"
            }
          }
        },
        "ContactCard": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "minLength": 1
            },
            "phones": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/ContactPhone"
              }
            },
            "emails": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/ContactEmail"
              }
            },
            "organization": {
              "type": "string"
            },
            "title": {
              "type": "string"
            }
          }
        },
        "SendMessageLinkPreview": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "url"
          ],
          "description": "公共请求只要求目标链接；可选标题和摘要允许空字符串，但不允许 null。WhatsApp 额外要求非空 title/image_url，title 最多 255 个 Unicode 字符、description 最多 1024 个 Unicode 字符；限制由本项目的渠道发送策略执行。",
          "properties": {
            "url": {
              "$ref": "#/$defs/MessageLinkPreviewHTTPURL"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "image_url": {
              "$ref": "#/$defs/MessageLinkPreviewHTTPURL"
            }
          }
        },
        "SendMessagePoll": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "question",
            "options",
            "max_selections"
          ],
          "description": "题目和选项标题保留原文；max_selections 必须是 1 到选项数量之间的整数，不表示投票人数。1.0、1e0 等整数数值与 1 等价，非整数非法。公共结构不限制题目长度、最大选项数量或标题重复；具体渠道可有额外限制。",
          "properties": {
            "question": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S"
            },
            "options": {
              "type": "array",
              "minItems": 2,
              "items": {
                "$ref": "#/$defs/SendMessagePollOption"
              }
            },
            "max_selections": {
              "type": "integer",
              "minimum": 1,
              "description": "每位投票者最多可选的选项数量；不得大于 options 数量，该跨字段约束由接口验证。"
            }
          }
        },
        "ContactPhone": {
          "type": "object",
          "required": [
            "number"
          ],
          "properties": {
            "number": {
              "type": "string"
            },
            "type": {
              "type": "string"
            }
          }
        },
        "ContactEmail": {
          "type": "object",
          "required": [
            "address"
          ],
          "properties": {
            "address": {
              "type": "string",
              "format": "email"
            },
            "type": {
              "type": "string"
            }
          }
        },
        "MessageLinkPreviewHTTPURL": {
          "allOf": [
            {
              "$ref": "#/$defs/MessageCommerceHTTPURL"
            }
          ],
          "not": {
            "pattern": "\\s"
          },
          "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://(?:[^/?#@\\s]*@)?(?:\\[[0-9A-Fa-f:.]+\\]|[^/?#:@\\s\\[\\]]+)(?::[0-9]*)?(?:[/?#]|$)",
          "description": "带主机名且不含空白的绝对 HTTP(S) URI，方括号地址仅接受 IPv6 字面量；保留原文，不保证资源可访问。"
        },
        "SendMessagePollOption": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "title"
          ],
          "properties": {
            "title": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "description": "选项原始标题，发送时不 trim、不改大小写或 Unicode 形式。"
            }
          }
        },
        "MessageCommerceHTTPURL": {
          "type": "string",
          "format": "uri",
          "pattern": "^[Hh][Tt][Tt][Pp][Ss]?://(?:[^/?#@\\s]*@)?(?:\\[[^/?#\\s]+\\]|[^/?#:@\\s]+)(?::[0-9]*)?(?:[/?#]|$)",
          "description": "带主机名的绝对 HTTP(S) URI，保留查询参数；格式有效不保证资源可访问或永久有效。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/SendMessageResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "SendMessageResult": {
          "type": "object",
          "required": [
            "message_id",
            "account_id",
            "status"
          ],
          "properties": {
            "message_id": {
              "type": "string"
            },
            "account_id": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "examples": [
                "accepted"
              ]
            },
            "provider_ref": {
              "type": "string"
            },
            "reply_token": {
              "type": "string",
              "minLength": 1,
              "description": "WhatsApp 发送成功且可引用上下文完整时返回；包括新发送投票，普通文字可据此引用它。未提供时省略，accepted 状态不因此改变。"
            }
          }
        }
      }
    }
  },
  "setContactNote": {
    "api": "device",
    "operationId": "setContactNote",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/contacts/note",
    "tag": "Contacts",
    "summary": "设置或清空联系人备注",
    "description": "",
    "authRequired": true,
    "toolName": "device_set_contact_note",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ContactNoteRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ContactNoteRequest": {
          "type": "object",
          "required": [
            "contact_id",
            "note"
          ],
          "properties": {
            "contact_id": {
              "type": "string"
            },
            "note": {
              "type": "string",
              "description": "传空字符串表示清空备注。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "setConversationLabelMembers": {
    "api": "device",
    "operationId": "setConversationLabelMembers",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/labels",
    "tag": "Conversations",
    "summary": "给会话打标或移除标签",
    "description": "",
    "authRequired": true,
    "toolName": "device_set_conversation_label_members",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationLabelMembersRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationLabelMembersRequest": {
          "type": "object",
          "required": [
            "label_id",
            "action",
            "conversation_ids"
          ],
          "properties": {
            "label_id": {
              "type": "string"
            },
            "action": {
              "type": "string",
              "enum": [
                "add",
                "remove"
              ]
            },
            "conversation_ids": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationLabelMembersResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationLabelMembersResult": {
          "type": "object",
          "required": [
            "label_id",
            "action",
            "conversation_ids"
          ],
          "properties": {
            "label_id": {
              "type": "string"
            },
            "action": {
              "type": "string",
              "enum": [
                "add",
                "remove"
              ]
            },
            "conversation_ids": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "setGroupJoinApprovalMode": {
    "api": "device",
    "operationId": "setGroupJoinApprovalMode",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/join-approval-mode",
    "tag": "Groups",
    "summary": "设置入群审批模式",
    "description": "",
    "authRequired": true,
    "toolName": "device_set_group_join_approval_mode",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupJoinApprovalModeRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupJoinApprovalModeRequest": {
          "type": "object",
          "required": [
            "group_id",
            "enabled"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            },
            "enabled": {
              "type": "boolean"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "startAccountAuth": {
    "api": "device",
    "operationId": "startAccountAuth",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/start",
    "tag": "Account Auth",
    "summary": "启动验证码类授权",
    "description": "启动 `auth_mode=code` 的授权流程。通常发送 `{}`，手机号从账号的 `provider_data.phone` 读取。 WhatsApp 手机号配对从 `data.verify_code` 读取配对码，交由用户在手机端输入， 不调用 `/auth/code`。Telegram 等待用户收到验证码后调用 `/auth/code`， 如需二次密码再调用 `/auth/password`。 `awaiting_code` 仅表示等待用户操作，不代表授权成功；通过 `GET /auth` 查询后续授权状态，并在发送消息前确认账号连接可用。",
    "authRequired": true,
    "toolName": "device_start_account_auth",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/StartCodeAuthData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "StartCodeAuthData": {
          "type": "object",
          "required": [
            "provider",
            "action"
          ],
          "description": "授权动作的结果，字段随渠道和当前授权步骤变化。 WhatsApp 配对码位于 `verify_code`；Telegram 可通过 `auth_payload.type=code` 提示等待用户提交验证码。`account_id`、`auth_fields` 和 `expires_at` 不是此动作的统一返回字段，不能按授权状态查询的响应结构读取本接口。",
          "properties": {
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "enum": [
                "start_auth"
              ]
            },
            "status": {
              "type": "string",
              "description": "当前授权流程状态；awaiting_code 表示等待用户操作，authorized 才表示授权完成。"
            },
            "auth_status": {
              "type": "string",
              "description": "当前授权步骤的标准状态，通常与 status 一致。"
            },
            "verify_code": {
              "type": "string",
              "description": "仅 WhatsApp 手机号配对返回；直接位于 data 下，不在 auth_payload 内。 展示给用户在手机 WhatsApp 中输入，不回传 /auth/code。 响应不保证提供过期时间，配对码失效时需重新发起配对。"
            },
            "auth_payload": {
              "type": "object",
              "description": "渠道特定的授权提示；Telegram 可返回 type=code，不包含用户收到的验证码。",
              "properties": {
                "type": {
                  "type": "string",
                  "description": "当前授权提示的类型；Telegram 验证码步骤为 code。"
                }
              },
              "additionalProperties": true
            }
          },
          "additionalProperties": true
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        }
      }
    }
  },
  "startAccountQrAuth": {
    "api": "device",
    "operationId": "startAccountQrAuth",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/qr/start",
    "tag": "Account Auth",
    "summary": "启动二维码授权",
    "description": "TikTok 可在 body 临时传入 Boolean enable_comment 覆盖账号配置；缺省 false，非法类型返回 400 invalid_request。 显式启动或继续二维码授权。WhatsApp Provider 返回 `init` 或尚未生成二维码时， 响应保持 `pending`，不会伪装成可扫码状态。 Provider 已进入 Passkey 时会继续现有流程；响应只保留标准 `auth_payload`， 不返回 Provider 原始 `code`、`info` 或二维码兼容字段。",
    "authRequired": true,
    "toolName": "device_start_account_qr_auth",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "startAccountRuntime": {
    "api": "device",
    "operationId": "startAccountRuntime",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/runtime/start",
    "tag": "Account Runtime",
    "summary": "启动账号运行态",
    "description": "TikTok 可在 body 中临时传入 Boolean enable_comment 覆盖账号设置；默认沿用 provider_data.enable_comment，缺省 false。 在线 TikTok 账号重复 start 不保证配置更新，配置变化须通过 reconnect 生效。 HTTP 200 表示启动请求已被接受或由当前状态幂等满足，不等同于账号已经连接成功， 也不保证本次实际调用了 Provider。WhatsApp 在真正启动前会先只读探测 Provider； `client_connect=true` 是强在线证据，即使同一响应带有滞后的 QR/Passkey 标签也返回 `running`；`status=init` 且 `client_connect=false` 返回 `starting`，不推断需要授权。 当 Provider 明确返回需要继续授权的状态时，响应会额外包含 `auth_required=true` 和标准化的 `auth_status`；调用方应转入账号授权接口， 不应把 `runtime_status=disconnected` 当作启动接口失败并反复重试。Provider 已进入 QR 流程但二维码仍在异步生成时，`auth_status` 为 `pending`，不会把 Session 写成无二维码内容的 `awaiting_qr_scan`。其他情况下，共享 Session 已处于 `pending`、 `awaiting_qr_scan` 或 Passkey 进行态时，重复调用只返回当前授权提示，不会 再次启动 Provider 或刷新现有授权流程。",
    "authRequired": true,
    "toolName": "device_start_account_runtime",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/RuntimeActionResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "RuntimeActionResult": {
          "type": "object",
          "required": [
            "account_id",
            "provider",
            "action",
            "operation_status",
            "runtime_status",
            "runtime_error"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "enum": [
                "refresh_status",
                "start",
                "stop",
                "reconnect"
              ]
            },
            "operation_status": {
              "type": "string",
              "examples": [
                "succeeded"
              ]
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "runtime_error": {
              "type": "string"
            },
            "auth_required": {
              "type": "boolean",
              "description": "可选的授权提示。本次 Provider 明确返回二维码、Passkey 等授权证据， 或当前 Session 已持久化此前由 Provider/Webhook 明确确认的授权进行态时 才为 `true`；不能仅根据 `runtime_status=disconnected` 或 `client_connect=false` 推断。运行态接口不返回二维码、`code`、 `qrcode`、`auth_payload` 或 `provider_data`；调用方应改用 `/v1/accounts/{account_id}/auth/qr/start` 和 `/v1/accounts/{account_id}/auth/qr/check` 获取标准授权状态与载荷。"
            },
            "auth_status": {
              "type": "string",
              "description": "可选的标准授权状态快照，仅在本次运行态操作取得 Provider 明确授权证据， 或复用当前 Session 中已确认的授权进行态时返回，例如 `pending`、 `awaiting_qr_scan` 或 `passkey_required`。该字段用于指引调用方进入授权流程， 不替代授权接口返回的完整状态与载荷。",
              "examples": [
                "pending",
                "awaiting_qr_scan",
                "passkey_required"
              ]
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        }
      }
    }
  },
  "stopAccountRuntime": {
    "api": "device",
    "operationId": "stopAccountRuntime",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/runtime/stop",
    "tag": "Account Runtime",
    "summary": "停止账号运行态",
    "description": "",
    "authRequired": true,
    "toolName": "device_stop_account_runtime",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/RuntimeActionResult"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "RuntimeActionResult": {
          "type": "object",
          "required": [
            "account_id",
            "provider",
            "action",
            "operation_status",
            "runtime_status",
            "runtime_error"
          ],
          "properties": {
            "account_id": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "action": {
              "type": "string",
              "enum": [
                "refresh_status",
                "start",
                "stop",
                "reconnect"
              ]
            },
            "operation_status": {
              "type": "string",
              "examples": [
                "succeeded"
              ]
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "runtime_error": {
              "type": "string"
            },
            "auth_required": {
              "type": "boolean",
              "description": "可选的授权提示。本次 Provider 明确返回二维码、Passkey 等授权证据， 或当前 Session 已持久化此前由 Provider/Webhook 明确确认的授权进行态时 才为 `true`；不能仅根据 `runtime_status=disconnected` 或 `client_connect=false` 推断。运行态接口不返回二维码、`code`、 `qrcode`、`auth_payload` 或 `provider_data`；调用方应改用 `/v1/accounts/{account_id}/auth/qr/start` 和 `/v1/accounts/{account_id}/auth/qr/check` 获取标准授权状态与载荷。"
            },
            "auth_status": {
              "type": "string",
              "description": "可选的标准授权状态快照，仅在本次运行态操作取得 Provider 明确授权证据， 或复用当前 Session 中已确认的授权进行态时返回，例如 `pending`、 `awaiting_qr_scan` 或 `passkey_required`。该字段用于指引调用方进入授权流程， 不替代授权接口返回的完整状态与载荷。",
              "examples": [
                "pending",
                "awaiting_qr_scan",
                "passkey_required"
              ]
            }
          }
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        }
      }
    }
  },
  "submitAccountAuthCode": {
    "api": "device",
    "operationId": "submitAccountAuthCode",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/code",
    "tag": "Account Auth",
    "summary": "提交验证码",
    "description": "提交当前授权步骤要求的验证码。TikTok 账号仍使用 `auth_mode=qrcode`；扫码后 `/auth/qr/check` 返回 `awaiting_code` 时，通过本接口提交 2FA 验证码。提交成功 只表示已接受，调用方必须继续轮询 `/auth/qr/check`，直到返回 `authorized` 或 `failed`。 Provider 明确拒绝验证码时保持 HTTP 400 `provider_invalid_request`，并使用 `numeric_code=30016` 区分一般参数拒绝；客户端可允许用户重新输入验证码。",
    "authRequired": true,
    "toolName": "device_submit_account_auth_code",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "submitAccountAuthPassword": {
    "api": "device",
    "operationId": "submitAccountAuthPassword",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/password",
    "tag": "Account Auth",
    "summary": "提交二次密码",
    "description": "",
    "authRequired": true,
    "toolName": "device_submit_account_auth_password",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/FreeFormObject"
        }
      },
      "required": [
        "params"
      ],
      "$defs": {
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "submitAccountPasskeyResponse": {
    "api": "device",
    "operationId": "submitAccountPasskeyResponse",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/passkey-response",
    "tag": "Account Auth",
    "summary": "提交 Passkey 凭证响应",
    "description": "向当前账号的授权流程提交浏览器生成的 WebAuthn 凭证响应。 `webauthn_response` 必须是完整凭证响应序列化后的 JSON 字符串。当前仅支持 使用 `qrcode` 授权模式的 WhatsApp 账号。只有 Provider 明确拒绝输入时才恢复上一可操作步骤。",
    "authRequired": true,
    "toolName": "device_submit_account_passkey_response",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/PasskeyResponseRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "PasskeyResponseRequest": {
          "type": "object",
          "required": [
            "webauthn_response"
          ],
          "properties": {
            "webauthn_response": {
              "type": "string",
              "minLength": 1,
              "description": "浏览器生成的 WebAuthn 凭证响应序列化后的完整 JSON 字符串。"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/FreeFormObject"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "unblockContact": {
    "api": "device",
    "operationId": "unblockContact",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/contacts/unblock",
    "tag": "Contacts",
    "summary": "解封联系人",
    "description": "",
    "authRequired": true,
    "toolName": "device_unblock_contact",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ContactIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ContactIdRequest": {
          "type": "object",
          "required": [
            "contact_id"
          ],
          "properties": {
            "contact_id": {
              "type": "string",
              "description": "渠道侧联系人标识。WhatsApp 封锁和解封操作必须传 LID，格式为 `数字@lid`。",
              "example": "123456789012345@lid"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "unmuteConversation": {
    "api": "device",
    "operationId": "unmuteConversation",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/unmute",
    "tag": "Conversations",
    "summary": "取消静音会话",
    "description": "",
    "authRequired": true,
    "toolName": "device_unmute_conversation",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "unpinConversation": {
    "api": "device",
    "operationId": "unpinConversation",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/unpin",
    "tag": "Conversations",
    "summary": "取消置顶会话",
    "description": "",
    "authRequired": true,
    "toolName": "device_unpin_conversation",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationIdRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationIdRequest": {
          "type": "object",
          "required": [
            "conversation_id"
          ],
          "properties": {
            "conversation_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "updateAccount": {
    "api": "device",
    "operationId": "updateAccount",
    "method": "PATCH",
    "path": "/v1/accounts/{account_id}",
    "tag": "Accounts",
    "summary": "更新账号",
    "description": "实际改变 `auth_mode` 时，请求体必须仅包含该字段，目标模式必须为该渠道支持的方式。 同一账号须串行切换：先暂停授权（含二维码轮询）、运行、配置及删除操作并等待在途请求处理结束，切换完成后再继续；切换不能撤回已发给渠道的请求。 实际变更 `provider` 时也须暂停同账号其他业务操作并等待在途请求处理结束；变更请求处理结束且结果确认后再恢复。失败或超时导致处理状态或结果不确定时保持暂停，先确认后继续。原样回传当前 `provider` 不增加该串行要求。 切换至 `code` 前须先保存手机号；缺少手机号返回 400 `auth_mode_phone_required`。 Telegram、WhatsApp 实际切换会清除旧会话，包括已授权会话；完成后旧授权会话记录统一为 `cancelled`，临时材料清空，调用方应重新授权。 成功后保存目标模式，授权状态为 `pending_auth`，运行状态为 `stopped`；不自动启动授权或连接。 提交与当前相同的模式保留当前授权进度和临时材料，不重启授权；其他字段仍按普通部分更新处理。 清理失败时不提交目标模式，但远端会话可能已经清除；可重试仅包含同一目标 `auth_mode` 的 PATCH。 清理失败或切换结果未确认（包括超时）时仍须暂停上述操作，直到同一目标模式切换完成；提交当前模式的无操作成功不表示未决切换已完成。 请求明确在参数校验阶段被拒绝且没有此前未完成的切换时，可修正参数或补齐配置后重新发起。 切换冲突返回 409 `provider_not_ready`。成功响应继续使用原账号结构，授权状态通过既有授权查询读取。 TikTok 账号更新无法安全完成或被中断时返回 502 provider_unavailable。 收到该错误后先重新查询账号状态，再决定是否重新提交更新。",
    "authRequired": true,
    "toolName": "device_update_account",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": true,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/AccountUpdateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "AccountUpdateRequest": {
          "type": "object",
          "description": "PATCH 部分更新；字段省略时保留原值，显式 null 不合法，空数组或空对象表示清空对应集合。 实际改变 auth_mode 必须仅提交 auth_mode，不能混入其他字段或未知字段。 目标模式必须为该渠道支持的方式；相同模式保留原授权。Telegram、WhatsApp 实际切换会清除旧会话，包括已授权会话；成功后须重新授权。 `whatsapp-protocol` 凭证只能提交到 `/v1/accounts/{account_id}/auth/session` 的嵌套 `whatsapp-protocol` 对象，不能通过 provider_data 提交；不能在 whatsapp-protocol 与其他 provider 之间切换。",
          "properties": {
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderInputName"
            },
            "region": {
              "type": "string",
              "minLength": 1
            },
            "status": {
              "type": "string"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "enum": [
                "qrcode",
                "code",
                "session"
              ]
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string"
            },
            "provider_data": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "渠道扩展配置；省略整个 `provider_data` 时保留原配置。 TikTok 的 `enable_comment` 仅接受 Boolean，未配置为 false；在线修改后需 reconnect 生效，关闭不撤回已排队事件。 Telegram 的 `provider_data.api_id` 和 `provider_data.api_hash` 均为可选； 更新自定义应用凭证时，请成对提供同一 Telegram 应用的两个字段，均使用字符串。 非空配置替换中的缺省凭证字段使用平台默认值；默认配置不可用时，该更新请求失败。 显式空对象表示清空，不补充默认凭证。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "自定义代理优先；清空后恢复账号创建时的默认配置。旧账号沿用原清空行为。"
            }
          }
        },
        "ProviderInputName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol",
            "x",
            "x_client",
            "twitter_client"
          ],
          "description": "provider 输入名称。兼容 `x`、`x_client`、`twitter_client`，这些输入会归一化为 `twitter` 并以 `twitter` 输出；Webhook URL path 不适用该别名规则。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Account"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Account": {
          "type": "object",
          "required": [
            "id",
            "name",
            "provider",
            "region",
            "status",
            "runtime_status"
          ],
          "examples": [
            {
              "id": "acc_xxx",
              "name": "Customer Support",
              "provider": "whatsapp",
              "region": "sg",
              "status": "active",
              "runtime_status": "running"
            }
          ],
          "properties": {
            "billing": {
              "$ref": "#/$defs/AccountBilling"
            },
            "id": {
              "type": "string",
              "examples": [
                "acc_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string",
              "description": "账号选择的默认网络出口地区。"
            },
            "status": {
              "type": "string",
              "description": "账号资源状态，例如 active、inactive、disabled。"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string",
              "description": "授权模式，例如 qrcode、code、session。"
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metadata": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_account_ref": {
              "type": "string",
              "description": "渠道侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject",
              "description": "客户显式配置的代理；不返回平台默认出口凭据。"
            },
            "provider_profile": {
              "$ref": "#/$defs/ProviderProfile"
            }
          },
          "allOf": [
            {
              "if": {
                "properties": {
                  "provider": {
                    "not": {
                      "const": "whatsapp"
                    }
                  }
                }
              },
              "then": {
                "properties": {
                  "provider_profile": {
                    "properties": {
                      "device_id": false
                    }
                  }
                }
              }
            }
          ]
        },
        "AccountBilling": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "period_start_at": {
              "type": "string",
              "format": "date-time"
            },
            "period_end_at": {
              "type": "string",
              "format": "date-time"
            },
            "amount_minor": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "int64",
                  "minimum": 1
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "currency": {
              "const": "USD",
              "type": "string"
            },
            "operation_id": {
              "type": "string"
            },
            "state": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "DELETING",
                "DELETED",
                "COMPENSATED",
                "REVIEW"
              ]
            }
          },
          "required": [
            "period_start_at",
            "period_end_at",
            "amount_minor",
            "currency",
            "operation_id",
            "state"
          ],
          "description": "独立的资金业务状态，不与 runtime_status 混用；周期时间按 RFC 3339 UTC Z 返回。"
        },
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "facebook",
            "zalo",
            "tiktok",
            "whatsapp-protocol"
          ],
          "description": "响应输出的 canonical provider 名称。`whatsapp-protocol` 仅支持 session，本期支持 text 和 image，以及联系人详情；不支持 reply、mentions、联系人列表及写动作、会话或群组能力。"
        },
        "RuntimeStatus": {
          "type": "string",
          "description": "平台标准账号运行态。Provider 原始值不会直接对外返回：`ready`、`online`、 `connected`、`active`、`started` 统一为 `running`；`offline`、`inactive`、 `stop` 统一为 `stopped`；`failed` 统一为 `error`。",
          "enum": [
            "unknown",
            "starting",
            "running",
            "stopping",
            "stopped",
            "reconnecting",
            "disconnected",
            "error"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        },
        "ProviderProfile": {
          "type": "object",
          "description": "账号在渠道侧的资料。下列为标准字段，其他字段因渠道而异。",
          "properties": {
            "id": {
              "type": "string",
              "description": "渠道侧账号标识。WhatsApp 返回 LID 格式；该字段在账号资料同步完成前可能缺失。"
            },
            "device_id": {
              "$ref": "#/$defs/WhatsAppDeviceID",
              "description": "仅 WhatsApp 账号详情在可确认当前授权会话时提供的登录设备编号；未知时省略。重新授权后可能变化，不作为永久设备标识，也不用于比较历史消息来源。"
            },
            "phone": {
              "type": "string",
              "description": "账号手机号，已归一化（去除空格、连字符、加号）。"
            },
            "username": {
              "type": "string"
            },
            "display_name": {
              "type": "string",
              "description": "账号展示名称；WhatsApp 按 BusinessName 优先、PushName 回退的规则生成。"
            },
            "push_name": {
              "type": "string",
              "description": "WhatsApp 当前账号设置的 PushName；其他渠道不定义该字段语义。"
            },
            "business_name": {
              "type": "string",
              "description": "WhatsApp BusinessName；渠道未返回时该字段缺失。"
            },
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string",
              "description": "账号头像 URL。"
            },
            "bio": {
              "type": "string"
            },
            "platform": {
              "type": "string",
              "description": "目前仅 WhatsApp 定义并返回该字段，表示配对时的登录平台标识，按不透明字符串透传。取值集合不封闭，客户端必须兼容未知值；其他渠道不定义该字段语义。该字段与 device_platform 不同。",
              "example": "smba"
            }
          },
          "additionalProperties": true
        },
        "WhatsAppDeviceID": {
          "type": "integer",
          "minimum": 0,
          "maximum": 65535,
          "description": "已确认的 WhatsApp 设备编号；0 是有效值，未知时整个字段省略，不返回 null 或空串。"
        }
      }
    }
  },
  "updateApiKeyStatus": {
    "api": "device",
    "operationId": "updateApiKeyStatus",
    "method": "PATCH",
    "path": "/v1/api-keys/{key_id}",
    "tag": "API Keys",
    "summary": "更新 API Key 状态",
    "description": "",
    "authRequired": true,
    "toolName": "device_update_api_key_status",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "write",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "key_id": {
                  "type": "string",
                  "description": "API Key public_id，例如 `ak_xxx`。"
                }
              },
              "required": [
                "key_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/APIKeyStatusUpdateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "APIKeyStatusUpdateRequest": {
          "type": "object",
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/APIKey"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "APIKey": {
          "type": "object",
          "required": [
            "id",
            "name",
            "key_prefix",
            "status"
          ],
          "properties": {
            "id": {
              "type": "string",
              "examples": [
                "ak_xxx"
              ]
            },
            "name": {
              "type": "string"
            },
            "key_prefix": {
              "type": "string",
              "description": "可展示的 Key 前缀，不是完整 API Key。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            }
          }
        }
      }
    }
  },
  "updateGroupInfo": {
    "api": "device",
    "operationId": "updateGroupInfo",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/update-info",
    "tag": "Groups",
    "summary": "修改群信息",
    "description": "`name`、`description`、`avatar_url` 三个字段每次只能传一个。",
    "authRequired": true,
    "toolName": "device_update_group_info",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupInfoUpdateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupInfoUpdateRequest": {
          "type": "object",
          "required": [
            "group_id"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            },
            "name": {
              "type": "string",
              "maxLength": 100
            },
            "description": {
              "type": "string",
              "description": "传空字符串表示清空描述。"
            },
            "avatar_url": {
              "type": "string",
              "format": "uri"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "updateGroupJoinRequests": {
    "api": "device",
    "operationId": "updateGroupJoinRequests",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/join-requests/update",
    "tag": "Groups",
    "summary": "处理入群申请",
    "description": "",
    "authRequired": true,
    "toolName": "device_update_group_join_requests",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupJoinRequestsUpdateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupJoinRequestsUpdateRequest": {
          "type": "object",
          "required": [
            "group_id",
            "action",
            "member_ids"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            },
            "action": {
              "type": "string",
              "enum": [
                "approve",
                "reject"
              ]
            },
            "member_ids": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "updateGroupMembers": {
    "api": "device",
    "operationId": "updateGroupMembers",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/groups/members",
    "tag": "Groups",
    "summary": "管理群成员",
    "description": "",
    "authRequired": true,
    "toolName": "device_update_group_members",
    "mutability": "destructive",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/GroupMemberUpdateRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "GroupMemberUpdateRequest": {
          "type": "object",
          "required": [
            "group_id",
            "action",
            "member_id"
          ],
          "properties": {
            "group_id": {
              "type": "string"
            },
            "action": {
              "type": "string",
              "enum": [
                "add",
                "remove",
                "promote",
                "demote"
              ]
            },
            "member_id": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/OkData"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "OkData": {
          "type": "object",
          "required": [
            "ok"
          ],
          "properties": {
            "ok": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    }
  },
  "updateWebhookEndpoint": {
    "api": "device",
    "operationId": "updateWebhookEndpoint",
    "method": "PATCH",
    "path": "/v1/webhook-endpoints/{endpoint_id}",
    "tag": "Webhook Endpoints",
    "summary": "更新 webhook endpoint",
    "description": "提交 url、status 和需要保留的完整配置。省略 body account_id 时保留端点的已有归属。 提供 account_id 仅校验原绑定一致；不允许切换账号、把工作空间端点改为账号端点或清空绑定。 account_id 不接受 query、null 或重复字段，归属不匹配返回 400 invalid_request。 字段名必须精确使用 account_id；body 或 query 中的大小写变体返回 400 invalid_request。 显式账号不存在或不属于当前工作空间返回 404 account_not_found（20020）。 账号端点可直接从停用恢复启用，归属保持不变。 inactive 改为 active 时，账号已有其他 active 端点返回 409 account_webhook_already_exists（40008）；原端点已为 active 且保持 active 时允许更新，包括历史多 active 配置。 省略 signing_secret 关闭签名；省略 retry_policy 恢复默认策略；订阅数组整体替换。 端点不存在时保持 HTTP 500 update_webhook_endpoint_failed，numeric_code 为 40006。",
    "authRequired": true,
    "toolName": "device_update_webhook_endpoint",
    "mutability": "write",
    "retryable": false,
    "secretInput": true,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "endpoint_id": {
                  "type": "string",
                  "description": "Webhook endpoint public_id，例如 `we_xxx`。"
                }
              },
              "required": [
                "endpoint_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/WebhookEndpointRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "WebhookEndpointRequest": {
          "type": "object",
          "description": "url 与 status 必填；其他配置按完整更新语义处理。 account_id 为可选公开账号 ID：创建时省略表示工作空间端点，更新时省略保留已有绑定。 同一账号最多一个 active 独立端点，inactive 可配置多个且不占用 active 名额；创建 active 或将 inactive 改为 active 时，存在其他 active 端点返回 409 account_webhook_already_exists（40008）。原 active 端点保持 active 的更新允许执行。 更新时提供 account_id 只校验一致，不能修改端点归属；不接受 null、空白或重复的 account_id。 字段名必须精确使用 account_id；大小写变体返回 400 invalid_request。",
          "required": [
            "url",
            "status"
          ],
          "properties": {
            "account_id": {
              "type": "string",
              "minLength": 1,
              "pattern": "\\S",
              "description": "可选的公开账号 ID，例如 `acc_example`；创建用于绑定，更新只用于校验原绑定。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              },
              "description": "为空、省略或包含 `*` 表示接收当前工作区有权接收的全部事件，包括 contact.updated；is_beta=true 的内测工作区还包含 call.incoming、call.answered、call.ended，无需额外逐项订阅。非内测工作区可以使用通配订阅，但不会收到通话事件；明确订阅通话事件仍返回 403 beta_feature_not_enabled（41002）。非通配的具体事件列表仅接收列出的事件。每次投递、重试及死信重放均重新核验内测资格，查询异常不放行。呼入暂未开放；message.* 通话记录不受内测门禁影响。"
            },
            "signing_secret": {
              "type": "string",
              "description": "用于签名 webhook 投递的密钥；仅请求中提交，不会在响应中返回。"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/WebhookEndpoint"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "WebhookEndpoint": {
          "type": "object",
          "required": [
            "id",
            "url",
            "status",
            "signing_enabled"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "account_id": {
              "type": "string",
              "minLength": 1,
              "description": "账号独立端点的公开账号 ID；工作空间端点省略此字段，不返回 null。"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "必须是绝对 HTTP(S) URL。"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              }
            },
            "signing_enabled": {
              "type": "boolean"
            },
            "retry_policy": {
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "StandardEventType": {
          "type": "string",
          "enum": [
            "*",
            "contact.updated",
            "post.comment.created",
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "call.incoming",
            "call.answered",
            "call.ended",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "conversation.history",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.profile.updated",
            "account.started",
            "account.history.synced",
            "account.auth.required",
            "account.auth.succeeded",
            "account.auth.failed"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        }
      }
    }
  },
  "updateWorkspace": {
    "api": "device",
    "operationId": "updateWorkspace",
    "method": "PATCH",
    "path": "/v1/workspace",
    "tag": "Workspace",
    "summary": "更新当前 workspace",
    "description": "",
    "authRequired": true,
    "toolName": "device_update_workspace",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "body": {
          "$ref": "#/$defs/WorkspaceUpdateRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "WorkspaceUpdateRequest": {
          "type": "object",
          "required": [
            "name",
            "status"
          ],
          "not": {
            "required": [
              "is_beta"
            ]
          },
          "properties": {
            "name": {
              "type": "string",
              "minLength": 1
            },
            "status": {
              "$ref": "#/$defs/WorkspaceStatus"
            },
            "metadata": {
              "type": "object",
              "description": "省略时保留现有 metadata；传入空对象时只清空客户可写字段。 `account_quota`、`account_quota_unlimited` 与 `is_beta` 是服务端保留键，提交任一保留键返回 `400 invalid_request`；顶层提交 `is_beta` 同样拒绝。",
              "propertyNames": {
                "not": {
                  "enum": [
                    "account_quota",
                    "account_quota_unlimited",
                    "is_beta"
                  ]
                }
              },
              "additionalProperties": {
                "type": "string"
              }
            }
          }
        },
        "WorkspaceStatus": {
          "type": "string",
          "enum": [
            "active",
            "inactive"
          ],
          "description": "Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。"
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/Workspace"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "Workspace": {
          "type": "object",
          "required": [
            "name",
            "status",
            "is_beta",
            "account_quota",
            "account_quota_used",
            "account_quota_unlimited"
          ],
          "properties": {
            "is_beta": {
              "type": "boolean",
              "readOnly": true,
              "default": false,
              "description": "工作区是否已开通内测，默认关闭；仅服务端可管理，客户不能通过 PATCH 或 metadata 修改。"
            },
            "name": {
              "type": "string"
            },
            "status": {
              "$ref": "#/$defs/WorkspaceStatus"
            },
            "metadata": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            },
            "account_quota": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "uint64",
                  "readOnly": true,
                  "description": "当前生效的只读账号总容量，包含免费额度和有效期内的付费额度，不扣除已用数量；已到期的付费额度不计入。"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_used": {
              "oneOf": [
                {
                  "type": "integer",
                  "format": "uint64",
                  "readOnly": true,
                  "description": "当前已占用的只读账号额度，账号创建后即占用，删除后释放；待授权、停止或断线的账号仍计入。付费额度到期后，已用额度可能超过 account_quota，按实际已用值返回。"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_unlimited": {
              "type": "boolean",
              "readOnly": true,
              "description": "兼容保留的只读字段，当前配额模式固定返回 false；账号容量以 account_quota 为准。"
            }
          }
        },
        "WorkspaceStatus": {
          "type": "string",
          "enum": [
            "active",
            "inactive"
          ],
          "description": "Workspace 状态。设置为 inactive 后，当前 Workspace 的 API Key 将不再通过鉴权。"
        }
      }
    }
  },
  "upsertConversationLabel": {
    "api": "device",
    "operationId": "upsertConversationLabel",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/conversations/labels/upsert",
    "tag": "Conversations",
    "summary": "新建或更新会话标签",
    "description": "",
    "authRequired": true,
    "toolName": "device_upsert_conversation_label",
    "mutability": "write",
    "retryable": false,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "path": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "account_id": {
                  "type": "string",
                  "description": "device-api 签发的账号 public_id，例如 `acc_xxx`。"
                }
              },
              "required": [
                "account_id"
              ]
            }
          },
          "required": [
            "path"
          ]
        },
        "body": {
          "$ref": "#/$defs/ConversationLabelUpsertRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "ConversationLabelUpsertRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "label_id": {
              "type": "string",
              "description": "为空表示新建，非空表示更新。"
            },
            "name": {
              "type": "string"
            }
          }
        }
      }
    },
    "outputSchema": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "data",
        "meta"
      ],
      "properties": {
        "data": {
          "allOf": [
            {
              "$ref": "#/$defs/ResponseMeta"
            },
            {
              "type": "object",
              "required": [
                "data"
              ],
              "properties": {
                "data": {
                  "$ref": "#/$defs/ConversationLabel"
                }
              }
            }
          ]
        },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "integer",
              "minimum": 100,
              "maximum": 599
            },
            "requestId": {
              "type": "string"
            }
          }
        }
      },
      "$defs": {
        "ResponseMeta": {
          "type": "object",
          "properties": {
            "request_id": {
              "type": "string",
              "description": "服务端生成的请求 ID。"
            },
            "client_request_id": {
              "type": "string",
              "description": "当客户端请求头传入合法 `X-Request-Id` 时回显。"
            }
          }
        },
        "ConversationLabel": {
          "type": "object",
          "required": [
            "id",
            "name"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          }
        }
      }
    }
  },
} as const satisfies Readonly<Record<string, OperationMetadata>>;
