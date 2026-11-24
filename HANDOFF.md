# HANDOFF: Agent Academy (2026-11-24)

Spec: `docs/spec-v1.2.md` (platform; §14 = decisions). Book 1 text: `web/src/views/Pages.tsx` (owner-approved). Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; finishing = on-chain certificate. Site-wide copy (home, library, certificate) fits ANY course.

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- **Book 1 = on-chain bookId 2, 12 chapters** (createBook tx `0x771f75e7…6a54`, 2026-11-24). Config in `web/src/chain.ts`: `BOOK_ID = 2`, `FULL_MASK = 0xFFF`. The site URL stays `/book/1`. bookIds 1, 900, 901 are unused (ids >= 900 = tests).
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (wrangler logged in on this PC). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`: 0.00025 BNB once per Agent ID, max 20/day, 5 per IP per day; relayer `0x49CBB7477b163F4613f08995E1dE61a502b2A43c`, top-ups by the owner).
- Routes: `/`, `/library`, `/book/1/<spread 0-5>[/practice]` (higher numbers clamp to 5), `/certificate`, `/certificate/1/0x…`. Valid-route list in 2 places: `pickView` in `App.tsx` and `VALID_PATH` in `worker/index.ts` (keep in sync).
- Lucky draw list: `cd web && npx tsx scripts/certified-wallets.ts 2 ../docs/certified-wallets.csv` (bookId 2).

## Book 1 (12 pages, deployed 2026-11-24, Worker version af7208cc)
- 6 spreads: odd page = learn, even = practice. Text: `web/src/views/Pages.tsx` (VI = owner's approved copy; EN = translation). Pages 4 and 6 follow `track` (`own` default / `pro`, localStorage `academy.track`).
- Page 7: wallet box + free gas. Page 12: one save. Copy prompt = shown sentence + hidden technical block (`savePrompt` in `book001.ts`). The site polls every 5 s for 5 min; when the mask is full the book folds shut and `CertPopup.tsx` opens (.ai name typed by the learner, display only; Save image = PNG; Share on X = intent + public certificate link).
- Next / Space / → turn the page; Shift+Space / ← go back. A page never scrolls (`data-fit1..4` in `Reader.tsx`); measured 0 overflow at 1440x900 and 393x852, EN + VI.
- QA URLs: `?qa=own|pro|nowallet|copied|timeout|confirmed|cert|unpublished|error|flip`, `?lang=vi`.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", Agent ID never used to look up others. No fake interactions.

## Next
1. Test one real save end to end (page 12 prompt, VI and EN) from a wallet with an Agent ID; confirm the popup opens.
2. Top up the relayer when low (`baw wallet send` only sends to addresses in the Binance app address book).
3. Get >= 30 Agent ID holders saving; submit by 2026-12-09 08:00 UTC.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, no unexplained lines, screenshots before claiming done.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
