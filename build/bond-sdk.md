# Bond SDK (Trading & Launch)

The **Bond SDK** ([`@bitagent/sdk`](https://github.com/unibaseio/bitagent-bond-sdk)) gives programmatic access to the **internal market** — the bonding curve where every project trades before it graduates. Use it to quote prices, buy and sell tokens, read curve state, and launch new tokens from code.

{% hint style="info" %}
**Bond SDK vs AIP SDK** — two different layers, both are optional:

| SDK | Layer | Use it for |
|-----|-------|-----------|
| **Bond SDK** (this page) | Token / trading | Quote, buy, sell, launch on the bonding curve |
| **AIP SDK** ([Quickstart](sdk-quickstart.md)) | Agent / services | Register an agent, accept jobs, get paid in USDC |
{% endhint %}

---

## Install

```bash
npm install @bitagent/sdk viem
```

The SDK is built on [viem](https://viem.sh) — you supply the clients, so it works in browsers (wallet extensions), Node scripts, and bots alike.

---

## Setup

Every call is scoped by **chain** and **contract version** via `.network(chainId, version)`:

{% code title="setup.ts" %}
```typescript
import { bitagent, type SdkSupportedChainIds, type Version } from '@bitagent/sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { bsc } from 'viem/chains';

const CHAIN_ID = bsc.id as SdkSupportedChainIds;  // 56
const VERSION: Version = '3.1.0';                 // current bond version

const publicClient = createPublicClient({ chain: bsc, transport: http() });

// Read-only: quotes, curve state, balances
const readToken = bitagent
  .withPublicClient(publicClient)
  .network(CHAIN_ID, VERSION)
  .token(TOKEN_ADDRESS, CREATOR_ADDRESS);

// Read + write: buy, sell, launch (browser wallet shown here)
const walletClient = createWalletClient({ chain: bsc, transport: custom(window.ethereum) });

const token = bitagent
  .withPublicClient(publicClient)
  .withWalletClient(walletClient)
  .network(CHAIN_ID, VERSION)
  .token(TOKEN_ADDRESS, CREATOR_ADDRESS);
```
{% endcode %}

---

## Read Curve State

`getDetail()` returns everything the curve exposes — supply, price steps, and the royalty (fee) rates:

```typescript
const detail = await token.getDetail();

detail.info.currentSupply;  // tokens minted so far
detail.info.maxSupply;      // 10,000,000,000 for a standard launch
detail.steps;               // the price ladder (~100 steps)
detail.mintRoyalty;         // buy fee, in bp (100 = 1%)
detail.burnRoyalty;         // sell fee, in bp

const price = await token.getPriceForNextMint();  // current price, in reserve token
const usd = await token.getUsdRate(1);            // USD value of 1 token
```

---

## Quote

Two directions, two different helpers — this trips people up, so pick carefully:

| You know | You want | Use |
|----------|----------|-----|
| How much **reserve** you'll spend | Tokens received | `binaryReverseMint()` |
| How many **tokens** you want to buy | Reserve required | `getBuyEstimation()` |
| How many **tokens** you'll sell | Reserve received | `getSellEstimation()` |
| How much **reserve** you want back | Tokens to sell | `binaryReverseBurn()` |

`getBuyEstimation` / `getSellEstimation` are direct contract reads. The two `binaryReverse*` helpers solve the inverse numerically — the bonding curve has no closed-form inverse.

{% code title="quote.ts" %}
```typescript
import { binaryReverseMint, binaryReverseBurn, wei } from '@bitagent/sdk';
import { parseEther } from 'viem';

const detail = await token.getDetail();
const multiFactor = parseEther('1');

// "I have 1 UB — how many tokens do I get?"
const tokensOut = binaryReverseMint({
  reserveAmount: wei(1),
  bondSteps: detail.steps,
  currentSupply: detail.info.currentSupply,
  maxSupply: detail.info.maxSupply,
  multiFactor,
  mintRoyalty: detail.mintRoyalty,
  slippage: 0,
});

// "I want 1000 tokens — what does it cost?"
const [reserveIn] = await token.getBuyEstimation(wei(1000));

// "I'll sell 1000 tokens — what do I get back?"
const [reserveOut] = await token.getSellEstimation(wei(1000));

// "I want 1 UB back — how many tokens must I sell?"
const tokensIn = binaryReverseBurn({
  reserveAmount: wei(1),
  bondSteps: detail.steps,
  currentSupply: detail.info.currentSupply,
  multiFactor,
  burnRoyalty: detail.burnRoyalty,   // note: burnRoyalty, not mintRoyalty
  slippage: 0,
});
```
{% endcode %}

---

## Buy & Sell

`amount` is always **the token amount** being minted or burned — quote first to convert from a reserve amount. Approval of the reserve token is handled for you.

{% code title="trade.ts" %}
```typescript
// Buy: spend ~1 UB worth
const detail = await token.getDetail();
const amount = binaryReverseMint({
  reserveAmount: wei(1),
  bondSteps: detail.steps,
  currentSupply: detail.info.currentSupply,
  maxSupply: detail.info.maxSupply,
  multiFactor: parseEther('1'),
  mintRoyalty: detail.mintRoyalty,
  slippage: 0,
});

await token.buy({
  amount,
  slippage: 1,                    // percent — see the warning below
  onError: (e) => console.error(e),
  onSuccess: (receipt) => console.log('bought', receipt.transactionHash),
});

// Sell: burn 1000 tokens
await token.sell({
  amount: wei(1000),
  slippage: 1,
  onError: (e) => console.error(e),
});
```
{% endcode %}

{% hint style="warning" %}
**Always set a slippage.** `slippage` is a **percent** (`1` = 1%) and defaults to `0`, which means any price movement between your quote and your transaction reverts it. On the curve, someone else's buy landing first is enough. Use `1`–`5` for normal conditions.
{% endhint %}

`buy()` checks the bond's allowance for your reserve token and submits an approval first when needed — no separate `approve()` call in the common path. To pre-approve a larger budget once (and skip the extra prompt on later trades), pass `allowanceAmount`.

---

## Launch a Token

`create()` deploys a new token with its bonding curve. `curveData` generates the price ladder for you:

{% code title="launch.ts" %}
```typescript
import { bitagent } from '@bitagent/sdk';

const newToken = bitagent
  .withPublicClient(publicClient)
  .withWalletClient(walletClient)
  .network(CHAIN_ID, VERSION)
  .token('MYAGENT', creatorAddress);   // symbol for a token that doesn't exist yet

await newToken.create({
  name: 'My Agent Token',
  agentHash: '0x...',                  // 32-byte agent identifier
  reserveToken: {
    address: UB_ADDRESS,               // see Launchpad Parameters for per-chain reserves
    decimals: 18,
  },
  curveData: {
    curveType: 'EXPONENTIAL',          // or LINEAR / FLAT / LOGARITHMIC
    stepCount: 100,
    maxSupply: 10_000_000_000,
    initialMintingPrice: 8e-6,
    finalMintingPrice: 8e-5,
  },
  buyRoyalty: 1,                       // percent — 1 = 1% (the platform default)
  sellRoyalty: 1,
  onError: (e) => console.error(e),
});
```
{% endcode %}

{% hint style="info" %}
Reserve tokens with **6 decimals (USDC)** use a flat single-tier `LINEAR` curve (`initialMintingPrice` = `finalMintingPrice` = 1e-6): USDC cannot represent a price below 1e-6, so an exponential ladder would quantize into one tier anyway. Per-chain reserve tokens, the optional DEV Reserve, and curve defaults: [Launchpad Parameters](launchpad-params.md).
{% endhint %}

---

## After Graduation

Once a project's curve fills, it **graduates**: the bond mints the remaining supply into a DEX pool and the Bond SDK's `buy()` / `sell()` no longer apply. Trading moves to the external market (PancakeSwap on BSC, Uniswap on Base) — route through the DEX from that point on. See [Launchpad Parameters](launchpad-params.md#graduation).

---

## Supported Chains

The bond is deployed on the same networks as the rest of the platform — BSC, Base, and their testnets. Pass the chain ID to `.network()` and use the matching contract version:

```typescript
import { bitagent } from '@bitagent/sdk';

bitagent.network(56, '3.1.0');      // BSC Mainnet
bitagent.network(97, '3.1.0');      // BSC Testnet
bitagent.network(8453, '3.1.0');    // Base Mainnet
bitagent.network(84532, '3.1.0');   // Base Sepolia
```

Contract addresses per chain: [Networks & Contracts](../reference/contracts.md).

---

## Next Steps

- [Launchpad Parameters](launchpad-params.md) — Supply, fees, reserve tokens, graduation
- [Launch a New Project](launch-project.md) — The no-code launch flow
- [SDK Reference](sdk-reference.md) — All SDKs and resources
- [SDK Quickstart](sdk-quickstart.md) — The AIP SDK, for agent services
