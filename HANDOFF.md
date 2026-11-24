# HANDOFF: Agent Academy (2026-11-24)

Spec: `docs/spec-v1.2.md` (owner; §14 = decisions). Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; all chapters done = on-chain certificate. Site-wide copy (home, library, certificate) fits ANY course. Book #1 = "Learn Binance Agentic Wallet" (the hackathon book).

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- **Book 1 is published: 13 chapters, permanent.** Text and layout can change any time (website deploy only); the chapter count can never change. Test books 900 (1 ch) and 901 (13 ch) exist; ids >= 900 are hidden.
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (wrangler is logged in on this PC; keys file has `CLOUDFLARE_API_2211`). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`: 0.00025 BNB once per Agent ID, max 20/day; relayer `0x49CBB7477b163F4613f08995E1dE61a502b2A43c` held ~0.006 BNB = ~22 people on 2026-11-23; top-ups are done by the owner. `baw wallet send` only sends to addresses in the Binance app address book (Binance safety rule for AI sends), so either the owner adds the relayer there once, or sends BNB from the app/exchange themselves).
- Routes: `/`, `/library`, `/book/1/<spread 0-9>[/practice]` (9 = ending; 10-13 are old links, clamped to 9), `/certificate`, `/certificate/1/0x…`. Anything else = 404 page. Valid-route list lives in 2 places: `pickView` in `App.tsx` and `VALID_PATH` in `worker/index.ts` (keep in sync).
- `wrangler.toml` has `run_worker_first = true`: the Worker adds CSP/security headers to every response and returns real 404s. `/api/claim` also limits 5 sends per IP per UTC day (KV `ip:` keys). Share card = `web/public/og.png` (1200x630). `?qa=<state>` for screenshots (e.g. `nowallet`, `unpublished`).

## Book #1 (20 pages, deployed 2026-11-24, Worker version 4fff69b4)
- No "chapter" in the UI: learners see pages only. 10 spreads = 20 pages: 1-2 What is · 3-4 Sign in (Agent ID card: FCFS, 2.5M free tokens for Binance AI Pro vs 250K/week default; owner's facts, end date unknown) · 5-6 Gas and Developer Mode · 7-8 Addresses · 9-10 Balances, history, gas · 11-12 Rules · 13-14 Approvals and locks · 15-16 Quotes and DeFi (risk note) · 17-18 Staying safe · 19-20 You finished + certificate.
- Saves at pages 6, 12, 18 ("Save your progress: pages 1-N"). The contract still has 13 units: `SAVE_STEPS` in `chain.ts` maps a save to bits (15 / 255 / 8191); the last one sets all 13 = certificate. `savedPages(mask)` gives the pages shown. Book 1 on-chain is unchanged.
- Files: `web/src/book001.ts` (EN) + `book001.vi.ts`; setup pages in `web/src/views/Onboard.tsx`; reader `Reader.tsx`.
- Certificate page: optional Agent ID name typed by the learner, shown on that device only (not in the share link); lookup stays by address. No on-chain way found to read the .ai name from an address (spec §10 open question).
- Theory pages: max 3 icon points, no Remember list. Save block has a fixed height (no jumping).

## Layout rules (measured)
- A page never scrolls. `Page` in `Reader.tsx` steps `data-fit1..4` (gaps, bottom padding, text down to 13px); **top padding never changes**, so titles sit at the same spot on every page. Phones: one page = one screen.
- Verified 0 overflow + uniform title position at 1920/1536/1440/1366/1280 and 412/393/375/360, EN + VI, unpublished and published states; ds-check 0 issues. If new text overflows at fit4, shorten the text.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines checked: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", risk notes on trade/DeFi pages, Agent ID never used to look up others. No fake interactions.
- X post drafted (main + reply, with #BinanceWalletHackathon #AgenticWallet).

## Next
1. Top up the relayer: it held 0.0060 BNB on 2026-11-24 (~24 people). `baw wallet send` of 0.00891 BNB (~$5) failed twice with 351703 (recipient not in the Binance address book). The owner must add `0x49CB...2A43c` (BSC) in Binance App > Wallet > Settings > Address Book, then re-send (check the BNB price first; 30 learners need ~0.0075 BNB).
2. Test one real save with the new masks (page 6 = 15, page 12 = 255, page 18 = 8191) from a wallet with no saves yet; also the Vietnamese save prompt. A second person with a real Agent ID should run the full flow (spec §9.7). The owner's wallet already has units 1-10 (shows as 12 pages).
3. Get >= 30 Agent ID holders saving; submit by 2026-12-09 08:00 UTC.
4. Open: reading the .ai name from an address has no on-chain path found; the certificate name box is typed by the learner, local only.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, a guide in reading order, no unexplained lines, no question numbering for non-steps, screenshots before claiming done.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
