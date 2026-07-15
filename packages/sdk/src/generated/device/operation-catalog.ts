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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
  "createAccount": {
    "api": "device",
    "operationId": "createAccount",
    "method": "POST",
    "path": "/v1/accounts",
    "tag": "Accounts",
    "summary": "创建账号",
    "description": "",
    "authRequired": true,
    "toolName": "device_create_account",
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
          "$ref": "#/$defs/AccountRequest"
        }
      },
      "required": [
        "body"
      ],
      "$defs": {
        "AccountRequest": {
          "type": "object",
          "required": [
            "provider",
            "region"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string"
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
              "$ref": "#/$defs/FreeFormObject"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
            "status"
          ],
          "properties": {
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
              "type": "string"
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
              "description": "provider 侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_profile": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
              "description": "生成 API Key 时使用的前缀。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
          "required": [
            "url",
            "status"
          ],
          "properties": {
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              },
              "description": "为空或省略表示接收全部事件。"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
    "description": "",
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
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
    "description": "当前主要由支持该能力的 provider 实现，通常仅支持文本消息。",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
            "status"
          ],
          "properties": {
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
              "type": "string"
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
              "description": "provider 侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_profile": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
              "description": "授权流程状态，例如 pending_auth、awaiting_qr_scan、authorized、failed。"
            },
            "auth_fields": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/AuthField"
              }
            },
            "auth_payload": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "expires_at": {
              "type": "string"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧联系人 ID，因可能包含 `@` 等字符，固定走 query。"
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
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "provider_user_id": {
              "type": "string"
            },
            "is_blocked": {
              "type": "boolean"
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
  "getConversation": {
    "api": "device",
    "operationId": "getConversation",
    "method": "GET",
    "path": "/v1/accounts/{account_id}/conversations/info",
    "tag": "Conversations",
    "summary": "获取会话详情",
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。"
                },
                "type": {
                  "$ref": "#/$defs/ConversationType",
                  "description": "会话类型。"
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
          ]
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
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧群 ID，因可能包含 `@` 等字符，固定走 query。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧群 ID。"
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
  "getWebhookEndpoint": {
    "api": "device",
    "operationId": "getWebhookEndpoint",
    "method": "GET",
    "path": "/v1/webhook-endpoints/{endpoint_id}",
    "tag": "Webhook Endpoints",
    "summary": "获取 webhook endpoint",
    "description": "",
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
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
            "account_quota",
            "account_quota_unlimited"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "status": {
              "type": "string"
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
                  "format": "uint64"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_unlimited": {
              "type": "boolean"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
    "authRequired": true,
    "toolName": "device_list_accounts",
    "mutability": "read",
    "retryable": true,
    "secretInput": false,
    "secretOutput": false,
    "mcpExposure": "never",
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
                    "$ref": "#/$defs/Account"
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
        "Account": {
          "type": "object",
          "required": [
            "id",
            "name",
            "provider",
            "region",
            "status"
          ],
          "properties": {
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
              "type": "string"
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
              "description": "provider 侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_profile": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "上一次响应返回的 `next_cursor`。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "每页数量；未提供时的默认值可能因 provider 而异。"
                },
                "q": {
                  "type": "string",
                  "description": "关键字过滤。"
                },
                "updated_since": {
                  "type": "string",
                  "format": "date-time",
                  "description": "RFC3339 时间戳，只返回此时间后更新的联系人；provider 不支持时可能退化为全量。"
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
              "type": "string"
            },
            "conversation_id": {
              "type": "string"
            },
            "display_name": {
              "type": "string"
            },
            "avatar_url": {
              "type": "string"
            },
            "provider_user_id": {
              "type": "string"
            },
            "is_blocked": {
              "type": "boolean"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "上一次响应返回的 `next_cursor`。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "每页数量；未提供时的默认值可能因 provider 而异。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧会话 ID，因可能包含 `@`、`:` 等字符，固定走 query。"
                },
                "type": {
                  "$ref": "#/$defs/ConversationType",
                  "description": "会话类型。"
                },
                "cursor": {
                  "type": "string",
                  "description": "上一次响应返回的 `next_cursor`。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "每页数量；未提供时的默认值可能因 provider 而异。"
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
          ]
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
              "type": "string"
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
              "type": "string"
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "会话类型过滤，支持逗号分隔多选。"
                },
                "cursor": {
                  "type": "string",
                  "description": "上一次响应返回的 `next_cursor`。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "每页数量；未提供时的默认值可能因 provider 而异。"
                },
                "label_id": {
                  "type": "string",
                  "description": "按会话标签过滤。"
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
              "$ref": "#/$defs/FreeFormObject"
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ]
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "provider 侧群 ID。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "上一次响应返回的 `next_cursor`。"
                },
                "limit": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "每页数量；未提供时的默认值可能因 provider 而异。"
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
                  "$ref": "#/$defs/ProviderName"
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
        "ProviderName": {
          "type": "string",
          "enum": [
            "telegram",
            "whatsapp",
            "line",
            "twitter",
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
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
    "description": "",
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
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "可选，省略时标记整个会话已读。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
              "description": "生成 API Key 时使用的前缀。"
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
    "description": "",
    "authRequired": true,
    "toolName": "device_send_message",
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
          "properties": {
            "account_id": {
              "type": "string"
            },
            "to": {
              "$ref": "#/$defs/Recipient"
            },
            "message": {
              "$ref": "#/$defs/MessagePayload"
            },
            "provider_data": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "reply_to": {
              "$ref": "#/$defs/ReplyTo"
            },
            "mentions": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/Mention"
              }
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
              "description": "provider 侧接收方 ID。"
            },
            "type": {
              "$ref": "#/$defs/ConversationType"
            }
          }
        },
        "MessagePayload": {
          "type": "object",
          "required": [
            "type"
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text",
                "image",
                "video",
                "audio",
                "document",
                "file",
                "contact"
              ]
            },
            "text": {
              "type": "string"
            },
            "url": {
              "type": "string",
              "format": "uri"
            },
            "file_url": {
              "type": "string",
              "format": "uri"
            },
            "file_key": {
              "type": "string"
            },
            "caption": {
              "type": "string"
            },
            "contacts": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/ContactCard"
              }
            }
          }
        },
        "FreeFormObject": {
          "type": "object",
          "additionalProperties": true
        },
        "ReplyTo": {
          "type": "object",
          "required": [
            "reply_token"
          ],
          "properties": {
            "reply_token": {
              "type": "string",
              "description": "来自入站事件 `data.message.reply_token` 的不透明句柄。"
            }
          }
        },
        "Mention": {
          "type": "object",
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "string"
            }
          }
        },
        "ConversationType": {
          "type": "string",
          "enum": [
            "user",
            "group",
            "channel"
          ]
        },
        "ContactCard": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
  "startAccountQrAuth": {
    "api": "device",
    "operationId": "startAccountQrAuth",
    "method": "POST",
    "path": "/v1/accounts/{account_id}/auth/qr/start",
    "tag": "Account Auth",
    "summary": "启动二维码授权",
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
    "description": "",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
    "authRequired": true,
    "toolName": "device_update_account",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
          "$ref": "#/$defs/AccountRequest"
        }
      },
      "required": [
        "params",
        "body"
      ],
      "$defs": {
        "AccountRequest": {
          "type": "object",
          "required": [
            "provider",
            "region"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "provider": {
              "$ref": "#/$defs/ProviderName"
            },
            "region": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "runtime_status": {
              "$ref": "#/$defs/RuntimeStatus"
            },
            "auth_mode": {
              "type": "string"
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
              "$ref": "#/$defs/FreeFormObject"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
            "status"
          ],
          "properties": {
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
              "type": "string"
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
              "description": "provider 侧账号公开标识。"
            },
            "proxy": {
              "$ref": "#/$defs/FreeFormObject"
            },
            "provider_profile": {
              "$ref": "#/$defs/FreeFormObject"
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
            "x",
            "zalo",
            "tiktok",
            "whatsapp_protocol"
          ],
          "description": "provider 名称；实际可用范围以当前账号能力为准。"
        },
        "RuntimeStatus": {
          "type": "string",
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
    "description": "",
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
          "required": [
            "url",
            "status"
          ],
          "properties": {
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
            },
            "subscribed_events": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/StandardEventType"
              },
              "description": "为空或省略表示接收全部事件。"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
            "url": {
              "type": "string",
              "format": "uri"
            },
            "status": {
              "type": "string"
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
            "message.received",
            "message.updated",
            "message.deleted",
            "message.read",
            "message.reaction",
            "message.delivered",
            "conversation.updated",
            "conversation.deleted",
            "conversation.cleared",
            "group.updated",
            "group.join_request",
            "account.status.updated",
            "account.started",
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
          "properties": {
            "name": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "metadata": {
              "type": "object",
              "additionalProperties": {
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
            "account_quota",
            "account_quota_unlimited"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "status": {
              "type": "string"
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
                  "format": "uint64"
                },
                {
                  "type": "string",
                  "pattern": "^[0-9]+$"
                }
              ]
            },
            "account_quota_unlimited": {
              "type": "boolean"
            }
          }
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
                  "description": "Device API 签发的账号 public_id，例如 `acc_xxx`。"
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
