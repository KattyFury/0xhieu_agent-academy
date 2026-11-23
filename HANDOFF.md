# HANDOFF: Agent Academy (2026-11-23)

Spec: `docs/spec-v1.2.md` (owner; §14 = decisions). Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; all chapters done = on-chain certificate. Site-wide copy (home, library, certificate) fits ANY course. Book #1 = "Learn Binance Agentic Wallet" (the hackathon book).

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- **Book 1 is published: 13 chapters, permanent.** Text and layout can change any time (website deploy only); the chapter count can never change. Test books 900 (1 ch) and 901 (13 ch) exist; ids >= 900 are hidden.
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (wrangler is logged in on this PC; keys file has `CLOUDFLARE_API_2211`). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`).
- Routes: `/`, `/library`, `/book/1/<spread 0-13>[/practice]` (13 = ending spread), `/certificate`, `/certificate/1/0x…`. `?qa=<state>` for screenshots (e.g. `nowallet`, `unpublished`).

## Book #1 (28 pages = 13 chapters + ending spread)
- Order: 1 What is Binance Agentic Wallet (quiz) · 2 From zero to signed in · 3 Gas and Developer Mode · 4 Addresses · 5 Balances · 6 Networks, history and gas · 7 Rules · 8 Approvals · 9 Pending and locked · 10 Quotes (risk note) · 11 DeFi preview (risk note) · 12 Agent ID · 13 Staying safe · ending spread (book finished + certificate progress, not a chapter).
- Files: `web/src/book001.ts` (EN) + `book001.vi.ts`; chapters 2-3 in `web/src/views/Onboard.tsx`; reader in `web/src/views/Reader.tsx`.
- **New lesson look = chapter 1 only** (icon points `learn.points`, icon quiz `step.icon`, text one step smaller). Owner OK'd the look; **chapters 2-13 still use the old paragraphs** and wait for the rewrite.
- Chapter 2 is one numbered guide (steps 1-4 left, 5-9 right), each step with its own prompt.
- Recording: chapters 1-2 show nothing about it (no wallet/gas yet). From chapter 3 each practice page ends with a separate "Mark this chapter done" section (never a numbered practice step); chapter 3 records 1-3 together (mask 0b111). Certificate is issued by the contract at 13/13.
- No "Learn / Get ready / Practice" labels above titles. Close X (top right) returns to Library; navbar shows Library active while reading.

## Layout rules (measured)
- A page never scrolls. `Page` in `Reader.tsx` steps `data-fit1..4` (gaps, bottom padding, text down to 13px); **top padding never changes**, so titles sit at the same spot on every page. Phones: one page = one screen.
- Verified 0 overflow + uniform title position at 1920/1536/1440/1366/1280 and 412/393/375/360, EN + VI, unpublished and published states; ds-check 0 issues. If new text overflows at fit4, shorten the text.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines checked: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", risk notes on trade/DeFi pages, Agent ID never used to look up others. No fake interactions.
- X post drafted (main + reply, with #BinanceWalletHackathon #AgenticWallet).

## Next
1. Rewrite chapters 2-13 in the chapter 1 look (icon points, shorter, EN + VI), then re-run fit + ds-check.
2. A second person with a real Agent ID runs the full flow on book 1 (spec §9.7).
3. Get >= 30 Agent ID holders recording; submit.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, a guide in reading order, no unexplained lines, no question numbering for non-steps, screenshots before claiming done.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
