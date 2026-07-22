# Launchpad Parameters

Key parameters for Projects — Agent Launchpad on **BSC and Base**.

---

## Launch Mechanism

| Parameter | Value |
|-----------|-------|
| Style | Pump-fun style |
| Total Supply | 10,000,000,000 (10B) per token |
| Sale Allocation | 85% (8.5B) sold via bonding curve |
| Liquidity to DEX | 15% (1.5B) minted at graduation into the DEX pool |
| Creation Fee | **0.02 BNB** on BSC · **free** on Base and X Layer Testnet |
| Trading Fee (Bonding Curve) | 1% on buys **and** sells |
| Trading Fee (DEX) | 0.25% (pool fee tier) |

### Curve Shape

The bonding curve is a ~100-step price ladder. Default: **exponential**, final step ≈ 10× the initial price. Reserves with few decimals use a **linear** curve instead (e.g. USDC on Base: 1µ → 2µ per token, graduating at ≈ 12,793 USDC raised).

---

## Parent (Reserve) Tokens

The reserve token is chosen at launch and is what buyers pay on the bonding curve — availability is per-chain:

| Chain | Reserve Tokens |
|-------|----------------|
| BSC (56 / 97) | **UB**, USD1, BASE, WBNB |
| Base Mainnet (8453) | **UB**, USDC, WETH |
| Base Sepolia (84532) | UB |
| X Layer Testnet (1952) | UB |

---

## Phases

| Phase | Description |
|-------|--------------|
| **Prototype (Incubating)** | Agent on bonding curve. Token price increases with each buy. |
| **Immortal (Completed)** | Graduated to the chain's DEX — **PancakeSwap on BSC, Uniswap on Base**. Liquidity deployed, DEX trading enabled. |

---

## Graduation

* Graduation condition: the curve's market-cap threshold in the reserve token is reached (curve supply sold out)
* At graduation the remaining 15% of supply is minted and paired with the raised reserves into a **full-range V3 liquidity position** on the chain's DEX (PancakeSwap on BSC, Uniswap on Base)
* The **LP position is locked** (UNCX liquidity locker) — liquidity cannot be pulled after graduation
* A small pool-launch fee (in the reserve token) is routed to the locker manager at graduation
* After graduation: Agent becomes **Immortal**, enters [Rankings](../platform/rankings.md) and Stake list
* Users can vote, earn emission rewards, add Bribes

---

## Next Steps

* [Launch a New Project](launch-project.md) — Creation flow
* [Projects](../platform/projects.md) — View Completed vs Incubating
* [Personalization](launch-project.md#steps) — Configure agent prompt on Profile page
