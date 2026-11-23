# HANDOFF: Agent Academy v1.2 (2026-11-23)

Spec: `docs/spec-v1.2.md` (owner). Previous build (v1.1, 7-day course contract, React site at academy.0xhieu.xyz) lives in the private repo `binance_build\binance_academy`; this public repo replaces it.

## Decisions (owner, 2026-11-23)
- Public repo `KattyFury/0xhieu_agent-academy`, clean history.
- Every page of a book = one chapter bit; chapterCount = page count, fixed only after content is written (Book 1 maybe ~16).
- English default, Vietnamese optional (VI/EN switch). Agent prompts stay English.
- Keep the free-gas relayer (`/api/claim`, stores only claimed addresses).
- Layout: keep the open-book look; add table of contents + prev/next.

## Live
- **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`. Deploy tx `0x67cea32f37869d7ec35c1015b44f9ae7548fb62aa2ce65cb32b8cf80ad68d5c9`.
- Book 900 (test, 1 chapter) created: tx `0xa9487862f6157bde380883a80a55ed73edaabbc5a9877d8092dd576d546379cc`.

## Day-0 test (spec §9.4): PASSED 2026-11-23
- `balanceOf(0xhieu.ai)` = 1. §6 prompt flow run by the owner's agent: settings (Developer Mode on) → preview (no 351803, no risks, no balance/approval changes) → owner confirmed → execute.
- `completeChapters(900, 1)` tx `0xb7b97532946a1ef87e6cfa8db5c713bb2f096d6c817ac71f6a8c45aa0ae8a3cb`: status 1, 78,149 gas, fee 0.0000057 BNB. `progressOf` = (1, 1, true).
- §12 answers: risk engine does not block a new contract; Agent ID holder = Agentic Wallet address; the wallet needs BNB for gas (~0.000006 BNB per record at 0.05 gwei).

## Site (live, deployed from this repo 2026-11-23)
- https://academy.0xhieu.xyz — Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` with `CLOUDFLARE_API_TOKEN` from `~/.claude/secrets.env`. SPA fallback in `wrangler.toml`; Worker secrets (RELAYER_KEY, TG_*) and KV `GAS` already on the Worker.
- Routes: `/` landing (yellow tile → Library, black tile → Certificate), `/library` (contents, New/Done per page from a pasted address), `/book/1/<page>` (page 0 = Get ready), `/certificate[/0x…]`. Old `#/…` links redirect. `?lang=vi`, `?qa=<state>` for screenshots.
- Owner said: no wallet address in the navbar.

## Book 1 content (2026-11-23, spec §9.6 done, waiting owner review)
- **13 pages = 13 chapters** (bits 0..12): pages 1-2 Get ready (`views/Onboard.tsx`: Agent ID + agent/sign-in; gas + Developer Mode), pages 3-13 = 11 lessons (`book001.ts` / `book001.vi.ts`): addresses, balances, networks+history, gas, rules (settings), approvals (no revoke), pending/locked, quotes (preview, risk note), DeFi (protocol-list + defi preview, risk note), Agent ID (agent-id + resolve own name), staying safe.
- Written from the official skill docs v1.15.0 (`SKILL.md`, references) and checked with real read-only `baw` runs on 0xhieu.ai (status, address, balance, chains, tx-history, gas-price, settings, approvals list, tx-lock, agent-id, resolve-domain, market-order quote, defi protocol-list, defi preview DEPOSIT 1 USDT on Venus: fee ~0.0001 BNB, nothing broadcast).
- Docs vs CLI: `approvals list --binanceChainId` is in the docs but rejected by `baw` 1.12.0; the lesson prompt doesn't use it.
- Page 1 can't be recorded before Developer Mode (page 2), so page 2's prompt records bits 0+1 together.
- Dropped from v1.1: leaderboard/market page (not in spec §2 command list).
- Fit: all 13 spreads 0 overflow at 1440 and 1366, EN + VI; phones no sideways scroll; ds-check 0 issues.

## Next (spec §9)
7. Owner reads the 13 pages (EN + VI) and approves; then a second person with a real Agent ID runs the full flow.
8. Freeze content → `createBook(1, chapterCount)`.
9. README final + deploy.

## Notes
- Foundry is installed on the PC at `~/bin/forge.exe` (official Windows build 1.5.1). `contracts/lib` is not committed; README has the install command.
- `ETHERSCAN` key in `<code root>\.secrets\keys.env` verifies on BscScan.
