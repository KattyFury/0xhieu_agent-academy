# HANDOFF: Agent Academy (2026-11-24)

Spec: `docs/spec-v1.2.md` (owner; §14 = decisions). Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; all chapters done = on-chain certificate. Site-wide copy (home, library, certificate) fits ANY course. Book #1 = "Learn Binance Agentic Wallet" (the hackathon book).

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- **Book 1 is published: 13 chapters, permanent.** Text and layout can change any time (website deploy only); the chapter count can never change. Test books 900 (1 ch) and 901 (13 ch) exist; ids >= 900 are hidden.
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (wrangler is logged in on this PC; keys file has `CLOUDFLARE_API_2211`). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`: 0.00025 BNB once per Agent ID, max 20/day; relayer `0x49CBB7477b163F4613f08995E1dE61a502b2A43c` held ~0.006 BNB = ~22 people on 2026-11-23; top-ups are done by the owner. `baw wallet send` only sends to addresses in the Binance app address book (Binance safety rule for AI sends), so either the owner adds the relayer there once, or sends BNB from the app/exchange themselves).
- Routes: `/`, `/library`, `/book/1/<spread 0-13>[/practice]` (13 = ending spread), `/certificate`, `/certificate/1/0x…`. `?qa=<state>` for screenshots (e.g. `nowallet`, `unpublished`).

## Book #1 (28 pages = 13 chapters + ending spread)
- Order: 1 What is Binance Agentic Wallet (quiz) · 2 From zero to signed in · 3 Addresses · 4 Gas and Developer Mode (asks for the address, so it comes after 3) · 5 Balances · 6 Networks, history and gas · 7 Rules · 8 Approvals · 9 Pending and locked · 10 Quotes (risk note) · 11 DeFi preview (risk note) · 12 Agent ID · 13 Staying safe · ending spread (book finished + certificate progress, not a chapter).
- Files: `web/src/book001.ts` (EN) + `book001.vi.ts`; chapters 2-3 in `web/src/views/Onboard.tsx`; reader in `web/src/views/Reader.tsx`.
- VI mode: every prompt is Vietnamese too (setup commands, practice prompts, and the save prompt, whose contract values are identical to EN; the learner types "xác nhận"). EN mode unchanged.
- All chapters use the ELI12 look: icon points (`learn.points` + `IconKey`), short goals, practice steps with a bot icon. AI prompts unchanged.
- Chapter 2 is one numbered guide (steps 1-4 left, 5-9 right), each step with its own prompt.
- Recording: one sign per 3 chapters. "Save your progress: chapters 1–N" ends chapters 4, 7, 10, 13 (`SAVE_AT` in Reader.tsx); each save marks every chapter up to N, so a missed save is caught by the next. First save is chapter 4 because it needs Developer Mode. Other chapters show nothing about recording. Certificate is issued by the contract at 13/13.
- No "Learn / Get ready / Practice" labels above titles. Close X (top right) returns to Library; navbar shows Library active while reading.

## Lesson length (2026-11-24, deployed)
- Theory pages: max 3 icon points, no "Remember" list. "If not" lines kept only on chapters 10 and 12 (safety). Still 28 pages, 2 per chapter; owner rejected merging theory + practice and dropping the ending spread.
- Save block ("Save your progress") has a fixed height (button row + 3-line status box) so nothing jumps when the status changes. Keep it that way.

## Layout rules (measured)
- A page never scrolls. `Page` in `Reader.tsx` steps `data-fit1..4` (gaps, bottom padding, text down to 13px); **top padding never changes**, so titles sit at the same spot on every page. Phones: one page = one screen.
- Verified 0 overflow + uniform title position at 1920/1536/1440/1366/1280 and 412/393/375/360, EN + VI, unpublished and published states; ds-check 0 issues. If new text overflows at fit4, shorten the text.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines checked: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", risk notes on trade/DeFi pages, Agent ID never used to look up others. No fake interactions.
- X post drafted (main + reply, with #BinanceWalletHackathon #AgenticWallet).

## Next
1. Top up the relayer (~$10 = ~0.0173 BNB at $579 → ~90 people); 30 learners need ~0.0075 BNB.
2. A second person with a real Agent ID runs the full flow on book 1 (spec §9.7). Also test one save with the Vietnamese prompt (not yet run end to end).
3. Get >= 30 Agent ID holders saving; submit.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, a guide in reading order, no unexplained lines, no question numbering for non-steps, screenshots before claiming done.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
