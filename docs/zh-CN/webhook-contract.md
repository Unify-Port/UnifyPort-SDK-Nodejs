# Webhook 契约

[English](../webhook-contract.md) | [简体中文](webhook-contract.md)

本次未发布源码的 `StandardEventType` 包含 24 种标准事件及订阅通配符 `*`。新增 `contact.updated`、`post.comment.created`、`account.profile.updated`、`call.incoming`、`call.answered`、`call.ended`；已有消息和会话事件也有新的载荷变体。SDK 导出类型，不提供接收服务、事件存储或新的签名算法。

```ts
import type { DeviceApiComponents, DeviceApiWebhooks } from "@unifyport/sdk-node";

type ContactUpdate = DeviceApiComponents["schemas"]["ContactUpdatedWebhookEvent"];
type CallRecordUpdate = DeviceApiComponents["schemas"]["CallMessageUpdatedWebhookEvent"];
type IncomingCallContract = DeviceApiWebhooks["callIncoming"];
```

`DeviceApiOperations` 继续只包含可调用的 HTTP 操作，接收声明放在 `DeviceApiWebhooks`。公开契约当前声明 36 种专门的 Webhook 结构，其中 25 种提供了共 49 个示例；已有示例全部进入生成的 TypeScript 检查。24 种事件名是订阅目录，不表示每个通用事件都有完整的专门载荷 schema。

类型不验证不可信 HTTP 请求体。生成类型保留有限状态分支和稀疏更新禁用字段；数值范围、字符串格式及其他跨字段条件仍需运行时校验。接收端应先验签和校验，再使用这些类型。已声明的载荷 schema 与请求示例见[公开契约](../../contracts/device.openapi.yaml)。

| 载荷                                | 消费方式                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 广告归因、商品/订单、交互卡片及响应 | 仅合并本次提供的字段，缺省不清空；保留明确的零值和 false。订单 accepted 不代表付款成功。                 |
| 链接预览                            | 合并本次字段；标题/摘要空串表示清空，缺省保留。明确转为 text 时删除旧预览。                              |
| 名片与实时位置                      | 实际提供的 contacts 整体替换有序名片数组。实时位置只识别类型，不提供坐标或追踪。                         |
| 投票选择                            | decoded 整体替换该投票人的选择，[] 撤票；unavailable 保留旧结果。voted_at 未知或冲突时不按到达顺序判断。 |
| 消息置顶                            | 整体替换 pin 快照，包括清除缺省的旧有效期；其他消息字段保留。                                            |
| 限时消息设置                        | 整体替换设置快照，明确 false/0 表示关闭；缺省不关闭。不删除已保存副本，不提供逐消息到期计时器。          |
| 联系人通讯录名称                    | 只更新出现的字段；空串清空，缺省保留。不覆盖个人昵称，不自动合并 PN/LID 资源键。                         |
| 账号失败                            | 可选 data.error 提供字符串 code/numeric_code/message；按码分支，缺失不代表成功。受限不代表永久封禁。     |
| 账号资料和设备                      | 资料可缺省；设备编号 0 有效，未知时省略。当前登录设备不是历史消息的永久设备标识。                        |

顶层 `id` 用于事件去重，消息更新按 provider、账号、会话和原生消息 ID 关联。不能因消息已存在而丢弃新更新。事件 ID 按不透明字符串处理：在途旧事件保留旧 ID，不能只接受新的 64 字符格式。投递重试保留事件身份，分别收到的生命周期发生不保证共用 ID；不承诺恰好一次或全局顺序。

`conversation.history` 为扁平数组，可能跨多个事件分片。按需批次含 `data.history.source=on_demand`，不产生 `account.history.synced`。空/短批次和超时都不证明完成；request ID 不关联历史批次。继续补拉使用同一条原生内容消息的 `before.message_id`、`sent_at`、`direction`，合成通话记录不能作为锚点。历史及媒体窗口可配置，不保证完整恢复。恢复媒体时同时合并新 URL 与 `expired=false`，缺省字段保留。

通话生命周期事件使用 `voice/video`，受内测资格和订阅控制；呼入暂未开放。准备成功不代表已拨号；`join_url` 和托管 `authorize_url` 是短期敏感链接，不进入日志或模型输入。独立的 `message.*` 通话记录使用 `audio/video` 和稀疏更新。嵌套 call 逐字段合并，终态优先级为 `ended > accepted > offered`；迟到接听只补事实与时间，不恢复结束状态。未收到接听确认表示未知，不证明未接来电。

账号独立端点整体覆盖工作空间端点。停用或未匹配订阅不回退；删除最后一个独立端点后，后续首次投递恢复继承。PATCH 不能改变归属。空、省略或通配订阅包含当前有权接收的事件，具体列表只包含列出的名称；通话资格在投递和重试时检查，通配订阅不授予内测资格。
