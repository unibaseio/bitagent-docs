---
title: "Launchpad Parameters"
---

Key parameters for Projects — Agent Launchpad on **BSC and Base**.

---

## Launch Mechanism

| Parameter | Value |
|-----------|-------|
| Style | Pump-fun style |
| Total Supply | 10,000,000,000 (10B) per token |
| Sale Allocation | 85% (8.5B) allocated to the bonding curve, split between an optional **DEV Reserve** and the public curve |
| DEV Reserve | Creator pre-allocation, **0–70%** of total supply (default 0) — taken out of the 85% |
| Public Curve | The remainder of the 85%, so a **minimum of 15%** of total supply |
| Liquidity to DEX | 15% (1.5B) minted at graduation into the DEX pool — fixed |
| Creation Fee | **0.02 BNB** on BSC · **free** on Base and X Layer Testnet |
| Trading Fee (Bonding Curve) | 1% on buys **and** sells |
| Fee Split (Bonding Curve) | **80%** to the creator (the launching wallet, or the X account a token was launched for) · **20%** to the protocol. On a trade by an invited user, 10% of the fee goes to referral rewards, taken out of the creator's 80% |
| Trading Fee (DEX) | 0.25% (pool fee tier) |

### Curve Shape

The bonding curve is a ~100-step price ladder (99–100 steps depending on the reserve token). Default: **exponential**, final step ≈ 10× the initial price.

Reserves with few decimals override this. **USDC (6 decimals) on Base Mainnet and Base Sepolia** runs a **flat single-tier linear** curve — 1µ → 1µ per token — because USDC cannot represent a price below 1e-6, so the exponential's ~2%/step rise would quantize to one tier anyway. At the full 8.5B curve allocation that graduates at **≈ 8,500 USDC** raised.

---

## Parent (Reserve) Tokens

The reserve token is chosen at launch and is what buyers pay on the bonding curve — availability is per-chain:

| Chain | Reserve Tokens |
|-------|----------------|
| BSC (56 / 97) | **UB**, USD1, WBNB |
| Base Mainnet (8453) | **UB**, USDC, WETH |
| Base Sepolia (84532) | **UB**, USDC, WETH |
| X Layer Testnet (1952) | UB |

:::note
Some chains recognise additional tokens (e.g. USDC on X Layer Testnet) for agent wallets and ERC-8183 settlement without offering them as bonding-curve reserves. Only the tokens listed above can be chosen at launch.
:::

---

## Phases

| Phase | Description |
|-------|--------------|
| **Prototype (Incubating)** | Agent on bonding curve. Token price increases with each buy. |
| **Immortal (Completed)** | Graduated to the chain's DEX — **PancakeSwap on BSC, Uniswap on Base**. Liquidity deployed, DEX trading enabled. |

---

## Graduation

* Graduation condition: the curve's market-cap threshold in the reserve token is reached (curve supply sold out)
* At graduation the remaining 15% of supply is minted and paired with the raised reserves into a **liquidity position on the chain's DEX** (PancakeSwap Infinity/v4 on BSC, Uniswap v4 on Base), with the LP locked via UNCX
* The **LP position is locked** (UNCX liquidity locker) — liquidity cannot be pulled after graduation
* A small pool-launch fee (in the reserve token) is routed to the locker manager at graduation
* After graduation: Agent becomes **Immortal**, enters [Rankings](/platform/rankings/) and Stake list
* Users can vote, earn emission rewards, add Bribes

---

## Next Steps

* [Launch a New Project](/build/launch-project/) — Creation flow
* [Bond SDK (Trading & Launch)](/build/bond-sdk/) — Launch and trade programmatically
* [Projects](/platform/projects/) — View Completed vs Incubating
* [Personalization](/build/launch-project/#steps) — Configure agent prompt on Profile page
