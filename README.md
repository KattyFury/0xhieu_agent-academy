# Agent Academy

Learn Binance Agentic Wallet. Earn Certificates.

A library of short books that teach people to use AI agents by doing. Each page has a goal, an explanation, steps and a hands-on practice task the learner runs with their own agent. Progress is recorded on BNB Smart Chain by the learner's own agent; when every chapter of a book is recorded, the contract issues an on-chain certificate.

Independent community project. Not affiliated with, endorsed by, or operated by Binance.

## Contract

`AgentAcademy` on BNB Smart Chain (chain id 56): [`0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`](https://bscscan.com/address/0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753#code) (verified).

- Only Agent ID holders can write: every write checks `agentId.balanceOf(msg.sender) > 0` on the Agent ID contract `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`, otherwise it reverts `NoAgentId`.
- `completeChapters(bookId, mask)`: records the caller's completed chapters. `mask` is cumulative progress (bit i = chapter i+1); at least one bit must be new (`NothingNew`), and only bits below the book's chapter count are allowed (`InvalidMask`). When all chapters are recorded, `certificateAt` is set and `CertificateIssued` is emitted. No NFT is minted.
- Views: `progressOf(address, bookId) → (mask, count, certified)`, `hasCertificate(address, bookId) → (certified, issuedAt)`, `books(bookId) → chapterCount`.
- No proxy, not payable, holds no funds, asks for no approvals, no pause. The only external call is the view `balanceOf`.

### Owner powers

The owner (`0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`) can only call `createBook(bookId, chapterCount)`: once per book id, 1 to 256 chapters, and the chapter count can never change. The owner cannot mint, pause, withdraw, or edit anyone's progress.

Book ids at or above 900 are test books and are hidden by the website.

## Recording flow

The website never sends transactions and never connects to a wallet. It builds the calldata with viem and shows a prompt; the learner pastes it into their own agent (Binance Agentic Wallet skill), which runs `baw contract-call preview`, shows the preview, and only executes after the learner confirms. The website reads progress publicly with `progressOf` from a pasted wallet address. No API key, seed phrase, chat history or agent access is ever requested.

## Free gas (sponsored by Agent Academy)

To record chapters, a learner's Agentic Wallet needs a little BNB for gas. The site offers a one-time top-up of **0.00025 BNB (about $0.15)** per wallet through `POST /api/claim` (`web/functions/api/claim.ts`):

- Only Agent ID holders: the server checks `balanceOf(address) > 0` on the Agent ID contract before sending.
- Once per address (stored in Cloudflare KV), and only if the wallet holds less than 0.0002 BNB.
- At most 20 top-ups per UTC day.
- Sent from a dedicated relayer wallet `0x49CBB7477b163F4613f08995E1dE61a502b2A43c` that only holds the BNB for this; its key is a Worker secret, never in this repo.

## Develop

```bash
cd contracts
forge install --no-git OpenZeppelin/openzeppelin-contracts@v5.4.0 foundry-rs/forge-std
forge test                                   # unit tests
BSC_RPC=https://bsc-dataseed.binance.org forge test --match-contract Fork   # against the real Agent ID contract
```

Verify: `forge verify-contract 0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753 src/AgentAcademy.sol:AgentAcademy --chain 56 --constructor-args $(cast abi-encode "c(address,address)" 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F 0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2)`.

Deployed by the owner's Agentic Wallet through the public CREATE2 factory `0x4e59b44847b379578588920cA78FbF26c0B4956C` (salt `keccak256("agent-academy-v1.2")`).
