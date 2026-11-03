/**
 * 此文件由 `pnpm generate` 根据 contracts/device.openapi.yaml 生成。
 * 生成边界用于保证契约、SDK 与 MCP 同步；请修改来源契约或生成器，不要手工编辑。
 */

import type { DeviceApiWebhooks } from "../../src/index.js";
type WebhookBody<T> = T extends {
  post: { requestBody: { content: { "application/json": infer Body } } };
}
  ? Body
  : never;
export const webhookExamples = {
  facebookMessageReceived: [
    {
      id: "evt_facebook_example_1",
      type: "message.received",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        conversation: {
          id: "9007199254740995",
          type: "user"
        },
        sender: {
          id: "9007199254740995",
          type: "user"
        },
        message: {
          id: "9007199254740993",
          direction: "inbound",
          text: "Hello",
          sent_at: "2026-01-01T00:00:00.123456789Z",
          reply_to_message_id: "9007199254740991"
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_facebook_example_2",
      type: "message.received",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        conversation: {
          id: "9007199254740995",
          type: "user"
        },
        sender: {
          id: "9007199254740997",
          type: "user"
        },
        message: {
          id: "9007199254740994",
          direction: "outbound",
          text: ""
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_facebook_example_3",
      type: "message.received",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        conversation: {
          id: "9007199254740995",
          type: "user"
        },
        sender: {
          id: "9007199254740995",
          type: "user"
        },
        message: {
          id: "9007199254740996",
          direction: "inbound",
          attachments: [
            {
              id: "image_example",
              type: "image",
              url: "https://media.example.com/image.jpg",
              thumbnail_url: "https://media.example.com/preview.jpg",
              size: 0,
              metadata: {
                filename: "example.jpg",
                width: 0,
                height: 0,
                animated: false,
                download_status: "ready"
              }
            },
            {
              id: "audio_example",
              type: "audio",
              metadata: {
                duration: 0,
                ptt: false,
                download_status: "failed",
                error_code: "download_failed"
              }
            }
          ]
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_facebook_example_4",
      type: "message.received",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        conversation: {
          id: "9007199254740995",
          type: "user"
        },
        sender: {
          id: "9007199254740995",
          type: "user"
        },
        message: {
          id: "9007199254740998",
          direction: "inbound",
          type: "sticker",
          attachments: [
            {
              type: "image",
              metadata: {
                sticker_id: "sticker_example",
                animated: false
              }
            }
          ]
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_facebook_example_5",
      type: "message.received",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        conversation: {
          id: "9007199254740995",
          type: "user"
        },
        sender: {
          id: "9007199254740995",
          type: "user"
        },
        message: {
          id: "9007199254740999",
          direction: "inbound",
          attachments: [
            {
              type: "document",
              metadata: {
                filename: "example.pdf",
                download_status: "restricted"
              }
            }
          ]
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["facebookMessageReceived"]>[],
  facebookAccountAuthSucceeded: [
    {
      id: "evt_facebook_example_6",
      type: "account.auth.succeeded",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        event: {
          kind: "account_auth_succeeded",
          runtime_status: "running"
        },
        runtime_status: "running",
        auth_status: "authorized"
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["facebookAccountAuthSucceeded"]>[],
  facebookAccountStatusUpdated: [
    {
      id: "evt_facebook_example_7",
      type: "account.status.updated",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        event: {
          kind: "account_status_updated",
          runtime_status: "error"
        },
        runtime_status: "error",
        last_error: "network_timeout"
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["facebookAccountStatusUpdated"]>[],
  facebookAccountAuthFailed: [
    {
      id: "evt_facebook_example_8",
      type: "account.auth.failed",
      provider: "facebook",
      account_id: "acc_example",
      occurred_at: "2026-01-01T00:00:00.123456789Z",
      data: {
        account: {
          provider_account_ref: "9007199254740997"
        },
        event: {
          kind: "account_auth_failed",
          runtime_status: "disconnected"
        },
        runtime_status: "disconnected",
        auth_status: "failed",
        last_error: "cookie_expired"
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["facebookAccountAuthFailed"]>[],
  contactUpdated: [
    {
      id: "evt_example_127019",
      type: "contact.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-20T03:00:00Z",
      data: {
        contact: {
          id: "15550000002@s.whatsapp.net",
          conversation_id: "100000000000002@lid",
          address_book: {
            full_name: "Example customer",
            first_name: "Example"
          }
        },
        event: {
          kind: "contact_updated",
          source: "address_book",
          changed_fields: ["address_book.full_name", "address_book.first_name"],
          changed_at: "2026-09-20T03:00:00Z"
        }
      }
    },
    {
      id: "evt_example_127947",
      type: "contact.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-20T03:05:00Z",
      data: {
        contact: {
          id: "15550000002@s.whatsapp.net",
          address_book: {
            full_name: ""
          }
        },
        event: {
          kind: "contact_updated",
          source: "address_book",
          changed_fields: ["address_book.full_name"],
          changed_at: "2026-09-20T03:05:00Z"
        }
      }
    },
    {
      id: "evt_example_128706",
      type: "contact.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-20T03:10:00Z",
      data: {
        contact: {
          id: "100000000000002@lid",
          conversation_id: "100000000000002@lid",
          address_book: {
            first_name: "Example"
          }
        },
        event: {
          kind: "contact_updated",
          source: "full_sync",
          changed_fields: ["address_book.first_name"]
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["contactUpdated"]>[],
  conversationDisappearingMessagesUpdated: [
    {
      id: "evt_example_130476",
      type: "conversation.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00.123Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        disappearing_messages: {
          enabled: true,
          duration_seconds: 86400
        },
        actor: {
          id: "100000000000003@lid",
          type: "user",
          name: "Example contact"
        },
        event: {
          kind: "conversation_updated",
          change_type: "disappearing_messages",
          changed_at: "2026-09-21T03:00:00.123Z"
        }
      }
    },
    {
      id: "evt_example_131405",
      type: "conversation.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:05:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        disappearing_messages: {
          enabled: true,
          duration_seconds: 604800
        },
        actor: {
          id: "100000000000003@lid",
          type: "user",
          name: "Example contact"
        },
        event: {
          kind: "conversation_updated",
          change_type: "disappearing_messages",
          changed_at: "2026-09-21T03:05:00Z"
        }
      }
    },
    {
      id: "evt_example_132320",
      type: "conversation.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:10:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        disappearing_messages: {
          enabled: false,
          duration_seconds: 0
        },
        actor: {
          id: "100000000000003@lid",
          type: "user",
          name: "Example contact"
        },
        event: {
          kind: "conversation_updated",
          change_type: "disappearing_messages",
          changed_at: "2026-09-21T03:10:00Z"
        }
      }
    },
    {
      id: "evt_example_133252",
      type: "conversation.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:15:00Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        disappearing_messages: {
          enabled: true,
          duration_seconds: 86400
        },
        event: {
          kind: "conversation_updated",
          change_type: "disappearing_messages"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["conversationDisappearingMessagesUpdated"]>[],
  messagePinUpdated: [
    {
      id: "evt_example_134940",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "MSG_PIN_TARGET",
          pin: {
            pinned: true,
            duration_seconds: 86400,
            expires_at: "2026-09-22T03:00:00.123Z"
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000003@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "message_pin",
          changed_at: "2026-09-21T03:00:00.123Z"
        }
      }
    },
    {
      id: "evt_example_136025",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:05:00Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "MSG_PIN_TARGET",
          pin: {
            pinned: false
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "message_pin",
          changed_at: "2026-09-21T03:05:00Z"
        }
      }
    },
    {
      id: "evt_example_136901",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:10:00Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "MSG_PIN_TARGET",
          pin: {
            pinned: true,
            duration_seconds: 0
          }
        },
        event: {
          kind: "message_updated",
          change_type: "message_pin"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messagePinUpdated"]>[],
  messagePollReceived: [
    {
      id: "evt_example_138228",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        sender: {
          id: "100000000000001@lid",
          type: "user"
        },
        message: {
          id: "POLL_EXAMPLE",
          type: "poll",
          poll: {
            question: "Which date works?",
            options: [
              {
                id: "option_monday",
                title: "Monday"
              },
              {
                id: "option_tuesday",
                title: "Tuesday"
              }
            ],
            max_selections: 1
          },
          direction: "outbound"
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messagePollReceived"]>[],
  messagePollVoteUpdated: [
    {
      id: "evt_example_140068",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "POLL_EXAMPLE",
          type: "poll",
          poll_vote: {
            status: "decoded",
            voter_id: "100000000000002@lid",
            voted_at: "2026-09-22T03:00:00.123Z",
            selected_option_ids: ["option_monday"]
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "poll_vote"
        }
      }
    },
    {
      id: "evt_example_141122",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "POLL_EXAMPLE",
          type: "poll",
          poll_vote: {
            status: "decoded",
            voter_id: "100000000000002@lid",
            voted_at: "2026-09-22T03:00:00.123Z",
            selected_option_ids: ["option_tuesday"]
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "poll_vote"
        }
      }
    },
    {
      id: "evt_example_142170",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "POLL_EXAMPLE",
          type: "poll",
          poll_vote: {
            status: "decoded",
            voter_id: "100000000000002@lid",
            voted_at: "2026-09-22T03:00:00.123Z",
            selected_option_ids: []
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "poll_vote"
        }
      }
    },
    {
      id: "evt_example_143180",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        message: {
          id: "POLL_EXAMPLE",
          type: "poll",
          poll_vote: {
            status: "unavailable",
            voter_id: "100000000000002@lid",
            voted_at: "2026-09-22T03:00:00.123Z",
            reason: "unknown"
          }
        },
        actor: {
          id: "100000000000002@lid",
          type: "user"
        },
        event: {
          kind: "message_updated",
          change_type: "poll_vote"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messagePollVoteUpdated"]>[],
  messagePollHistory: [
    {
      id: "evt_example_144750",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00.123Z",
      data: {
        conversation: {
          id: "120000000000001@g.us",
          type: "group"
        },
        messages: [
          {
            id: "POLL_EXAMPLE",
            type: "poll",
            poll: {
              question: "Which date works?",
              options: [
                {
                  id: "option_monday",
                  title: "Monday"
                },
                {
                  id: "option_tuesday",
                  title: "Tuesday"
                }
              ],
              max_selections: 1
            },
            direction: "outbound"
          },
          {
            id: "TEXT_EXAMPLE",
            type: "text",
            text: "Ordinary message"
          }
        ],
        event: {
          kind: "conversation_history"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messagePollHistory"]>[],
  messageLinkPreviewReceived: [
    {
      id: "evt_example_146824",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000001@lid",
          type: "user"
        },
        message: {
          id: "MSG_PREVIEW_EXAMPLE",
          type: "link_preview",
          text: "See https://example.com/product",
          direction: "outbound",
          link_preview: {
            url: "https://example.com/product",
            title: "Example product",
            description: "Product introduction"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_147918",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:01:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PREVIEW_PARTIAL",
          type: "link_preview",
          text: "See https://example.com/details",
          direction: "inbound",
          link_preview: {
            url: "https://example.com/details"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageLinkPreviewReceived"]>[],
  messageLinkPreviewUpdated: [
    {
      id: "evt_example_149615",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:02:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PREVIEW_EXAMPLE",
          type: "link_preview",
          link_preview: {
            url: "https://example.com/product",
            title: "Updated product title"
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    },
    {
      id: "evt_example_150448",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:04:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PREVIEW_EXAMPLE",
          type: "link_preview",
          link_preview: {
            url: "https://example.com/product",
            title: "",
            description: ""
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    },
    {
      id: "evt_example_151301",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T03:03:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PREVIEW_EXAMPLE",
          type: "text",
          text: "Product information is being updated."
        },
        event: {
          kind: "message_updated"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageLinkPreviewUpdated"]>[],
  messageLinkPreviewHistory: [
    {
      id: "evt_example_152781",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-22T04:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        messages: [
          {
            id: "MSG_PREVIEW_EXAMPLE",
            type: "link_preview",
            text: "See https://example.com/product",
            direction: "outbound",
            link_preview: {
              url: "https://example.com/product",
              title: "Example product"
            },
            referral: {
              source: "ad",
              source_id: "ad_example"
            },
            sent_at: "2026-09-22T03:00:00Z"
          },
          {
            id: "MSG_PLAIN_URL_EXAMPLE",
            type: "text",
            text: "https://example.com/plain",
            sent_at: "2026-09-22T03:01:00Z"
          },
          {
            id: "MSG_PRODUCT_EXAMPLE",
            type: "product",
            product: {
              id: "product_example",
              title: "Example product"
            }
          },
          {
            id: "MSG_RESPONSE_EXAMPLE",
            type: "interactive_response",
            interactive_response: {
              kind: "button",
              selected_id: "details"
            }
          }
        ]
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageLinkPreviewHistory"]>[],
  messageInteractiveReceived: [
    {
      id: "evt_example_155214",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_BUTTONS_EXAMPLE",
          type: "interactive",
          direction: "inbound",
          text: "How can we help?",
          interactive: {
            kind: "buttons",
            header: {
              type: "text",
              text: "Choose a topic"
            },
            body: "How can we help?",
            footer: "Select one option",
            buttons: [
              {
                type: "reply",
                id: "sales",
                title: "Sales"
              },
              {
                type: "reply",
                id: "support",
                title: "Support"
              }
            ]
          },
          referral: {
            source: "ad",
            source_id: "ad_example_001"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_156729",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_TEMPLATE_EXAMPLE",
          type: "interactive",
          direction: "inbound",
          interactive: {
            kind: "template",
            header: {
              type: "image",
              attachment: {
                type: "image",
                mimetype: "image/jpeg",
                metadata: {
                  width: 640,
                  height: 480
                }
              }
            },
            body: "Choose how to continue",
            buttons: [
              {
                type: "reply",
                id: "details",
                title: "Details"
              },
              {
                type: "url",
                title: "Website",
                url: "https://example.com?campaign=example"
              },
              {
                type: "phone",
                title: "Call",
                phone_number: "+12025550123"
              }
            ]
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_158417",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_BUTTON_RESPONSE_EXAMPLE",
          type: "interactive_response",
          direction: "inbound",
          text: "Support",
          reply_to_message_id: "MSG_BUTTONS_EXAMPLE",
          interactive_response: {
            kind: "button",
            selected_id: "support",
            title: "Support"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_159498",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_TEMPLATE_RESPONSE_EXAMPLE",
          type: "interactive_response",
          direction: "inbound",
          text: "Details",
          interactive_response: {
            kind: "template_button",
            title: "Details"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageInteractiveReceived"]>[],
  messageInteractiveUpdated: [
    {
      id: "evt_example_161269",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_BUTTONS_EXAMPLE",
          type: "interactive",
          direction: "inbound",
          interactive: {
            kind: "buttons",
            footer: "Support is available"
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageInteractiveUpdated"]>[],
  messageInteractiveHistory: [
    {
      id: "evt_example_163002",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T04:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        messages: [
          {
            id: "MSG_BUTTONS_EXAMPLE",
            type: "interactive",
            direction: "inbound",
            text: "How can we help?",
            interactive: {
              kind: "buttons",
              header: {
                type: "text",
                text: "Choose a topic"
              },
              body: "How can we help?",
              footer: "Select one option",
              buttons: [
                {
                  type: "reply",
                  id: "sales",
                  title: "Sales"
                },
                {
                  type: "reply",
                  id: "support",
                  title: "Support"
                }
              ]
            },
            referral: {
              source: "ad",
              source_id: "ad_example_001"
            },
            sent_at: "2026-09-21T03:00:00Z"
          },
          {
            id: "MSG_BUTTON_RESPONSE_EXAMPLE",
            type: "interactive_response",
            direction: "inbound",
            text: "Support",
            reply_to_message_id: "MSG_BUTTONS_EXAMPLE",
            interactive_response: {
              kind: "button",
              selected_id: "support",
              title: "Support"
            },
            sent_at: "2026-09-21T03:01:00Z"
          },
          {
            id: "MSG_PRODUCT_EXAMPLE",
            type: "product",
            product: {
              id: "product_example",
              title: "Example product"
            }
          },
          {
            id: "MSG_TEXT_EXAMPLE",
            type: "text",
            text: "Thank you."
          }
        ]
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageInteractiveHistory"]>[],
  messageCommerceReceived: [
    {
      id: "evt_example_166040",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PRODUCT_EXAMPLE_001",
          type: "product",
          direction: "inbound",
          product: {
            id: "product_example_001",
            title: "Example product",
            description: "Product introduction",
            url: "https://example.com/product?campaign=example",
            image_url: "https://example.com/product.jpg",
            price: {
              amount: "12.345",
              currency: "USD"
            }
          },
          referral: {
            source: "ad",
            source_id: "ad_example_001"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_167385",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_ORDER_EXAMPLE_001",
          type: "order",
          direction: "inbound",
          order: {
            id: "order_example_001",
            title: "Example order",
            item_count: 0,
            status: "inquiry",
            total: {
              amount: "0.000",
              currency: "USD"
            }
          }
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageCommerceReceived"]>[],
  messageCommerceUpdated: [
    {
      id: "evt_example_169196",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_PRODUCT_EXAMPLE_001",
          type: "product",
          direction: "inbound",
          product: {
            id: "product_example_001",
            title: "Updated product title"
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    },
    {
      id: "evt_example_170114",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_ORDER_EXAMPLE_001",
          type: "order",
          direction: "inbound",
          order: {
            id: "order_example_001",
            status: "accepted",
            total: {
              amount: "9007199254740.993"
            }
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageCommerceUpdated"]>[],
  messageCommerceHistory: [
    {
      id: "evt_example_171797",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-21T04:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        messages: [
          {
            id: "MSG_PRODUCT_EXAMPLE_001",
            type: "product",
            direction: "inbound",
            product: {
              id: "product_example_001",
              title: "Example product",
              description: "Product introduction",
              url: "https://example.com/product?campaign=example",
              image_url: "https://example.com/product.jpg",
              price: {
                amount: "12.345",
                currency: "USD"
              }
            },
            referral: {
              source: "ad",
              source_id: "ad_example_001"
            },
            sent_at: "2026-09-21T03:00:00Z",
            sender: {
              id: "100000000000002@lid"
            }
          },
          {
            id: "MSG_ORDER_EXAMPLE_001",
            type: "order",
            direction: "inbound",
            order: {
              id: "order_example_001",
              title: "Example order",
              item_count: 0,
              status: "inquiry",
              total: {
                amount: "0.000",
                currency: "USD"
              }
            },
            sent_at: "2026-09-21T03:01:00Z",
            sender: {
              id: "100000000000002@lid"
            }
          },
          {
            id: "MSG_TEXT_EXAMPLE_001",
            type: "text",
            text: "Thank you.",
            direction: "inbound",
            sent_at: "2026-09-21T03:02:00Z",
            sender: {
              id: "100000000000002@lid"
            }
          }
        ]
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageCommerceHistory"]>[],
  messageDeviceIdentity: [
    {
      id: "evt_example_174750",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-23T08:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000001@lid",
          device_id: 8
        },
        message: {
          id: "wa_message_example_001",
          direction: "outbound",
          text: "Example"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageDeviceIdentity"]>[],
  messageReferralReceived: [
    {
      id: "evt_example_176338",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-20T03:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_AD_EXAMPLE_001",
          text: "I would like to know more.",
          direction: "inbound",
          referral: {
            source: "ad",
            source_id: "ad_example_001",
            source_url: "https://example.com/ad?campaign=demo&content=example",
            title: "Example promotion",
            body: "Learn more about the product.",
            media_type: "image",
            thumbnail_url: "https://example.com/ad-thumbnail.jpg",
            media_url: "https://example.com/ad-image.jpg",
            provider_extensions: {
              whatsapp: {
                ctwa_clid: "click_example_001",
                greeting_message_body: "Hello! How can we help?",
                automated_greeting_message_shown: true,
                automated_greeting_message_cta_type: "example_cta",
                source_app: "example_app",
                click_to_whatsapp_call: true,
                contains_auto_reply: false,
                contains_ctwa_flows_auto_reply: false
              }
            }
          }
        },
        event: {
          kind: "message_received"
        }
      }
    },
    {
      id: "evt_example_178242",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-20T03:02:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          text: "Please send more details.",
          direction: "inbound",
          referral: {
            source: "ad",
            source_id: "ad_example_001"
          }
        },
        event: {
          kind: "message_received"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageReferralReceived"]>[],
  messageReferralUpdated: [
    {
      id: "evt_example_179990",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-20T03:03:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        sender: {
          id: "100000000000002@lid",
          type: "user"
        },
        message: {
          id: "MSG_AD_EXAMPLE_001",
          text: "I would like to know the price.",
          direction: "inbound",
          referral: {
            source: "ad",
            source_id: "ad_example_001",
            source_url: "https://example.com/ad?campaign=demo&content=example",
            title: "Example promotion",
            body: "Learn more about the product.",
            media_type: "image",
            thumbnail_url: "https://example.com/ad-thumbnail.jpg",
            media_url: "https://example.com/ad-image.jpg",
            provider_extensions: {
              whatsapp: {
                ctwa_clid: "click_example_001",
                greeting_message_body: "Hello! How can we help?",
                automated_greeting_message_shown: true,
                automated_greeting_message_cta_type: "example_cta",
                source_app: "example_app",
                click_to_whatsapp_call: true,
                contains_auto_reply: false,
                contains_ctwa_flows_auto_reply: false
              }
            }
          }
        },
        event: {
          kind: "message_updated"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageReferralUpdated"]>[],
  conversationHistory: [
    {
      id: "evt_example_183342",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-28T03:01:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        history: {
          source: "on_demand"
        },
        messages: [
          {
            id: "MSG_HISTORY_EXAMPLE_001",
            type: "text",
            text: "Earlier message.",
            direction: "inbound",
            sent_at: "2026-09-28T02:00:00Z",
            sender: {
              id: "100000000000002@lid"
            }
          }
        ]
      }
    },
    {
      id: "evt_example_184219",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-28T03:02:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        history: {
          source: "on_demand"
        },
        messages: []
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["conversationHistory"]>[],
  messageReferralHistory: [
    {
      id: "evt_example_185631",
      type: "conversation.history",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-20T04:00:00Z",
      data: {
        conversation: {
          id: "100000000000002@lid",
          type: "user"
        },
        messages: [
          {
            id: "MSG_AD_EXAMPLE_001",
            type: "text",
            text: "I would like to know more.",
            direction: "inbound",
            sent_at: "2026-09-20T03:00:00Z",
            sender: {
              id: "100000000000002@lid",
              name: "Example customer"
            },
            referral: {
              source: "ad",
              source_id: "ad_example_001",
              source_url: "https://example.com/ad?campaign=demo&content=example",
              title: "Example promotion",
              body: "Learn more about the product.",
              media_type: "image",
              thumbnail_url: "https://example.com/ad-thumbnail.jpg",
              media_url: "https://example.com/ad-image.jpg",
              provider_extensions: {
                whatsapp: {
                  ctwa_clid: "click_example_001",
                  greeting_message_body: "Hello! How can we help?",
                  automated_greeting_message_shown: true,
                  automated_greeting_message_cta_type: "example_cta",
                  source_app: "example_app",
                  click_to_whatsapp_call: true,
                  contains_auto_reply: false,
                  contains_ctwa_flows_auto_reply: false
                }
              }
            }
          },
          {
            id: "MSG_NORMAL_EXAMPLE_002",
            type: "text",
            text: "Thank you.",
            direction: "inbound",
            sent_at: "2026-09-20T03:01:00Z",
            sender: {
              id: "100000000000002@lid"
            }
          }
        ]
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["messageReferralHistory"]>[],
  callMessageReceived: [
    {
      id: "evt_example_call_offered_001",
      type: "message.received",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-17T08:00:00Z",
      data: {
        conversation: {
          id: "100000000000001@lid",
          type: "user"
        },
        sender: {
          id: "100000000000001@lid",
          type: "user"
        },
        message: {
          id: "call_record_example_001",
          type: "call",
          direction: "inbound",
          call: {
            id: "call_example_001",
            media_type: "audio",
            status: "offered"
          }
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["callMessageReceived"]>[],
  callMessageUpdated: [
    {
      id: "evt_example_call_accepted_001",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-17T08:00:05Z",
      data: {
        conversation: {
          id: "100000000000001@lid",
          type: "user"
        },
        sender: {
          id: "100000000000001@lid",
          type: "user"
        },
        message: {
          id: "call_record_example_001",
          type: "call",
          call: {
            id: "call_example_001",
            status: "accepted",
            accepted_at: "2026-09-17T08:00:05Z"
          }
        }
      }
    },
    {
      id: "evt_example_call_ended_001",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-17T08:00:10Z",
      data: {
        conversation: {
          id: "100000000000001@lid",
          type: "user"
        },
        sender: {
          id: "100000000000001@lid",
          type: "user"
        },
        message: {
          id: "call_record_example_001",
          type: "call",
          call: {
            id: "call_example_001",
            status: "ended"
          }
        }
      }
    },
    {
      id: "evt_example_call_ended_001",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-17T08:00:30Z",
      data: {
        message: {
          id: "call_record_example_001",
          type: "call",
          call: {
            id: "call_example_001",
            status: "ended",
            end_reason: "timeout"
          }
        }
      }
    },
    {
      id: "evt_example_call_ended_002",
      type: "message.updated",
      provider: "whatsapp",
      account_id: "acc_example_001",
      occurred_at: "2026-09-17T08:01:10Z",
      data: {
        message: {
          id: "call_record_example_002",
          type: "call",
          call: {
            id: "call_example_002",
            status: "ended",
            end_reason: "rejected_elsewhere"
          }
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["callMessageUpdated"]>[],
  accountAuthFailed: [
    {
      id: "evt_whatsapp_example_auth_failed",
      type: "account.auth.failed",
      provider: "whatsapp",
      account_id: "acc_example_account",
      occurred_at: "2026-09-07T01:00:00Z",
      data: {
        auth_status: "failed",
        runtime_status: "disconnected",
        event: {
          kind: "account_auth_status",
          auth_status: "failed",
          runtime_status: "disconnected"
        },
        error: {
          code: "account_restricted",
          numeric_code: "20102",
          message: "Account login is restricted. Check the official WhatsApp app for details."
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["accountAuthFailed"]>[],
  accountProfileUpdated: [
    {
      id: "evt_profile_7e91d2c4",
      type: "account.profile.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-08-28T09:51:51Z",
      data: {
        account: {
          provider_account_ref: "provider_account_example"
        },
        profile: {
          display_name: "Example Business",
          business_name: "Example Business",
          push_name: "Example Account",
          avatar_url: "https://assets.example.com/accounts/avatar.jpg"
        },
        event: {
          kind: "account_profile_updated",
          source: "self_rename",
          changed_fields: ["display_name", "push_name", "business_name"]
        }
      }
    },
    {
      id: "evt_profile_avatar_a21e7d9c",
      type: "account.profile.updated",
      provider: "whatsapp",
      account_id: "acc_example",
      occurred_at: "2026-09-03T02:00:00Z",
      data: {
        account: {
          provider_account_ref: "provider_account_example"
        },
        profile: {
          display_name: "Example Account",
          push_name: "Example Account",
          avatar_url: "https://assets.example.com/accounts/avatar-new.jpg"
        },
        event: {
          kind: "account_profile_updated",
          source: "avatar_change",
          changed_fields: ["avatar_url"]
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["accountProfileUpdated"]>[],
  accountStarted: [
    {
      id: "evt_acc_2b3c4d5e6f",
      type: "account.started",
      provider: "whatsapp",
      account_id: "acc_8c21d0",
      occurred_at: "2026-06-08T13:21:00Z",
      data: {
        runtime_status: "running",
        event: {
          kind: "account_started",
          runtime_status: "running"
        }
      }
    }
  ] satisfies WebhookBody<DeviceApiWebhooks["accountStarted"]>[]
};
