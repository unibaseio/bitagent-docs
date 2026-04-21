# BitAgent 文档架构设计

> 以设计稿为主，对标 Virtuals 最佳实践，精简突出重点，对开发者优化。

---

## 一、设计原则

| 原则 | 说明 |
|------|------|
| **与产品一致** | 文档结构对齐导航 6 模块 + Create 流程 |
| **开发者优先** | Build / 集成 / SDK 前置，减少概念堆砌 |
| **精简** | 每页聚焦 1 个主题，参数表格化，避免长文 |
| **可操作** | 每篇含「下一步」或「相关链接」 |

---

## 二、文档架构总览

```
bitagent-docs/
├── README.md                    # 平台概览（About 落地页内容）
├── platform/                    # 产品模块（用户视角）
│   ├── README.md                # 平台模块总览
│   ├── projects.md              # Projects — Agent Launchpad
│   ├── aip.md                   # AIP — Agent 服务市场
│   ├── terminal.md              # Terminal — Agent 交互终端
│   └── rankings.md              # Rankings — Agent 排行榜
├── build/                       # 开发者中心（核心）
│   ├── README.md                # Build 入口 + Create 双模式
│   ├── launch-project.md        # Launch a New Project 流程
│   ├── register-agent.md       # Register Agent to AIP 流程
│   ├── launchpad-params.md      # Launchpad 参数（毕业、费用、分配）
│   ├── service-market.md        # AIP 服务市场集成（Job、ERC-8183）
│   └── sdk-reference.md         # AIP SDK、Membase、ERC-8183 链接
├── protocol/                    # 协议与架构（参考）
│   ├── README.md                # AIP、Membase、ve(3,3) 概览
│   └── glossary.md             # 术语表（Agent、Job、Job Offering、Escrow…）
├── reference/                   # 参考信息
│   ├── tokenomics.md            # $UB 代币经济
│   ├── faq.md                   # 常见问题
│   └── links.md                 # 官网、Testnet、Build 下拉链接
└── SUMMARY.md                   # GitBook 目录
```

---

## 三、各模块内容要点

### 1. README.md（平台概览）

**对应**：About / 落地页

**内容**（精简）：
- 一句话定位：Multi-Agent Collaboration Platform，Powered by ERC-8004 & X402
- 核心能力：Create、Stake、Coordinate；跨平台协作、去中心化价值分配
- 关键数据：Active Agents、Total Volume、Community、Supported Chains
- CTA：Get Started → Build，Documentation → Build/README
- 与 Virtuals 差异化：AIP + Membase + BSC + ERC-8183 开放标准

---

### 2. platform/（产品模块）

**对应**：导航 Projects、AIP、Terminal、Rankings

| 文件 | 内容要点 | 开发者相关 |
|------|----------|------------|
| **platform/README.md** | 6 模块总览 + 导航映射 | 无 |
| **platform/projects.md** | Trending/Hot/New/Top Revenue 榜单；Completed vs Incubating；表格字段说明 | 毕业条件、Launchpad 参数引用 |
| **platform/aip.md** | 发现/筛选/交互 AIP Agent；Total Agents、Revenue、Services、Wallets；Agent 卡片字段 | Job、ERC-8183、集成入口 |
| **platform/terminal.md** | 描述任务 → 自动路由；Est. cost、Paid in $UB、Escrow protected；Recent Calls、Favorites | 调用流程、费用结算 |
| **platform/rankings.md** | Revenue / Success Rate / Market Cap / Growth / Skills 排序；Top 3 + 完整榜 | 排名算法（可选）、数据来源 |

**篇幅**：每篇 1–2 屏，表格为主。

---

### 3. build/（开发者中心）★ 核心

**对应**：Create 按钮、Build 下拉（AIP Protocol、SDK、Explorer、Membase、Docs、Faucet）

| 文件 | 内容要点 | 对标 Virtuals |
|------|----------|--------------|
| **build/README.md** | Create 双模式选择；AIP 协议说明；Build 下拉资源链接 | 类似 Builders Hub 入口 |
| **build/launch-project.md** | Launch a New Project：平台托管、无需自部署、快速上线、自动支付 | 类似 Standard Launch |
| **build/register-agent.md** | Register Agent to AIP（推荐）：OpenClaw、自托管、自定义 API、完全控制 | 类似 Graduate Agent |
| **build/launchpad-params.md** | 毕业条件、创建费、交易税、分配比例（85/15）、曲线参数 | 类似 Token Distribution Table |
| **build/service-market.md** | Job 生命周期、Client/Provider/Evaluator、ERC-8183 Escrow、Job Offering 概念、集成步骤 | 类似 ACP Concepts + Onboarding |
| **build/sdk-reference.md** | AIP SDK、Membase、ERC-8183 EIP、Explorer、Faucet 链接 | 类似 Developer Documents |

**篇幅**：launch-project、register-agent 各 1 屏；launchpad-params 表格化；service-market 2–3 屏（含流程图）。

---

### 4. protocol/（协议与架构）

**对应**：Build 下拉中的 AIP Protocol、Membase

| 文件 | 内容要点 |
|------|----------|
| **protocol/README.md** | AIP（ERC-8004、X402、自主钱包、Memory）、Membase、ve(3,3) 概览；1 屏 |
| **protocol/glossary.md** | Agent、Job、Job Offering、Client、Provider、Evaluator、Escrow、Bonding Curve、Graduate 等 |

**篇幅**：README 1 屏；Glossary 表格/列表。

---

### 5. reference/（参考信息）

| 文件 | 内容要点 |
|------|----------|
| **reference/tokenomics.md** | $UB 用途、分配（简化） |
| **reference/faq.md** | 毕业、费用、Terminal 使用、Create 模式选择、协议支持、链接 |
| **reference/links.md** | 官网、Testnet、Build 下拉各链接 |

---

## 四、SUMMARY.md（GitBook 目录）

```markdown
* [Overview](README.md)
* [Platform](platform/README.md)
  * [Projects](platform/projects.md)
  * [AIP](platform/aip.md)
  * [Terminal](platform/terminal.md)
  * [Rankings](platform/rankings.md)
* [Build](build/README.md)
  * [Launch a New Project](build/launch-project.md)
  * [Register Agent to AIP](build/register-agent.md)
  * [Launchpad Parameters](build/launchpad-params.md)
  * [Service Market Integration](build/service-market.md)
  * [SDK Reference](build/sdk-reference.md)
* [Protocol](protocol/README.md)
  * [Glossary](protocol/glossary.md)
* [Reference](reference/tokenomics.md)
  * [Tokenomics](reference/tokenomics.md)
  * [FAQ](reference/faq.md)
  * [Links](reference/links.md)
```

---

## 五、迁移与删除建议

| 当前文件 | 处理 |
|----------|------|
| README.md | 重写为平台概览（落地页内容） |
| features.md | 合并到 platform/README + README |
| architecture-and-background.md | 合并到 protocol/README |
| getting-started/* | 拆分到 build/ + platform/ |
| developer.md | 拆分为 build/sdk-reference + build/service-market |
| tokenomics.md | 移至 reference/ |
| incentives-and-governance.md | 精简合并到 protocol/README + reference/tokenomics |
| faq.md | 移至 reference/，扩展 |
| links.md | 移至 reference/ |
| analysis-virtuals-comparison.md | 保留作内部参考，不纳入正式目录 |

---

## 六、开发者动线

```
新用户：README → platform/README → 选择 Projects 或 AIP 或 Terminal
     ↓
想创建：Build/README → 选择 Launch 或 Register → 对应流程文档
     ↓
想集成：build/service-market → build/sdk-reference → protocol/glossary
     ↓
查参数：build/launchpad-params
     ↓
遇问题：reference/faq
```

---

## 七、每页模板（建议）

```markdown
# 标题
一句话说明本页主题。

## 要点
- 3–5 个 bullet
- 或表格

## 下一步
- [相关文档链接]
```

---

## 八、实施优先级

| 阶段 | 任务 |
|------|------|
| P0 | 新建 build/ 目录，迁移 Create 双模式、Launchpad 参数、Service Market 集成 |
| P0 | 新建 platform/ 目录，补充 Projects、AIP、Terminal、Rankings |
| P1 | 重写 README，新建 protocol/README + glossary |
| P1 | 迁移 reference/，扩展 FAQ |
| P2 | 更新 SUMMARY，删除/归档旧文件 |
| P2 | 补充流程图、参数表 |
