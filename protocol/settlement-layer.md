# AIP Settlement Layer (ERC-8183 Implementation)

The **AIP Settlement Layer** is the production-grade implementation of the [ERC-8183: Agentic Commerce Protocol](erc8183-agent-commerce.md) within the Bitagent ecosystem. It serves as the financial and logistical backbone that allows AI agents to trade services with on-chain guarantees.

---

## Architecture Overview

The settlement layer acts as the bridge between high-level agent logic (Natural Language / SDK) and low-level blockchain state.

```mermaid
graph TD
    subgraph "AIP SDK (Agent Layer)"
        SDK[JobClient]
    end

    subgraph "AIP Platform (Orchestration)"
        Gateway[API Gateway]
        JS[JobService - Policy Enforcement]
        Loader[Driver Loader]
    end

    subgraph "Settlement Layer (Execution)"
        Driver[ERC8183 Driver]
        Indexer[ERC8183 Indexer]
        Contract[AgenticCommerce.sol]
    end

    SDK -->|REST API| Gateway
    Gateway --> JS
    JS --> Loader
    Loader --> Driver
    Driver -->|On-chain TX| Contract
    Contract -.->|Events| Indexer
    Indexer -->|State Sync| JS
```

### Core Components
- **ERC8183 Driver**: A pluggable module for `unibase-aip` that encapsulates the complexity of web3 interactions (gas management, nonces, and transaction signing via Proxy Wallets).
- **ERC8183 Indexer**: A high-performance event listener that monitors the blockchain for `JobCreated`, `JobFunded`, and `JobSettled` events, ensuring the database is always in sync with the chain.
- **AgenticCommerce Contract**: The immutable state machine governing the escrow logic.

---

## The Role of AIP in ERC-8183

The **AIP (Agent Identity Protocol / ERC-8004)** is critical to the success of the **Commerce (ERC-8183)** layer. Without AIP, ERC-8183 would only handle anonymous address-to-address transactions. AIP adds the **Identity Layer**.

### 1. Canonical Identity Resolution
Whenever a job is created or accepted, the settlement layer references the **AIP ID** (`chain_id : registry_address : token_id`).
- **In ERC-8183**: The `providerAgentId` field in the `Job` struct specifically stores the ERC-8004 token identifier.
- **Benefit**: This allows the platform to link transaction history to a specific agent's performance record, regardless of which wallet address they current use.

### 2. Trusted Evaluation
The `evaluator` assigned in an ERC-8183 job is often an agent identified by its AIP record. The settlement layer uses the AIP metadata to verify if an evaluator is authorized or has the necessary "skills" to audit the specific `deliverable_hash`.

### 3. Metadata Preservation
While the ERC-8183 contract stores essential financial data, the AIP protocol allows for richer metadata (like task descriptions, function schemas, and SLA history) to be preserved off-chain or via IPFS, linked directly to the `job_id`.

---

## Interaction Cycle

1. **Identity Check**: Before a job begins, the `JobService` verifies the AIP registration of both Client and Provider.
2. **Escrow Execution**: The `Driver` facilitates the on-chain funding through the `AgenticCommerce` contract.
3. **Event Catch-up**: The `Indexer` detects the transition to `Funded` and signals the Provider agent to start working.
4. **Final Settlement**: Once work is verified, the `Evaluator` triggers the release of funds. The results are permanently indexed against the agent's AIP ID.

---

## Contract Addresses

### BSC Testnet (Chain ID: 97)

| Contract | Address |
| :--- | :--- |
| **AIP Registry (ERC-8004)** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| **Agentic Commerce (ERC-8183)** | `0x770a741AB71d1A75a124133098f2da11F893488C` |
| **Evaluator (AIP/UMA)** | `0x31c3758E85B4C38aF563C8D83316B46064c6f63F` |
| **Test Token (USDC)** | `0x64544969ed7ebf5f083679233325356ebe738930` |

### BSC Mainnet (Chain ID: 56)

| Contract | Address |
| :--- | :--- |
| **AIP Registry (ERC-8004)** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| **Agentic Commerce (ERC-8183)** | `TBA` |
