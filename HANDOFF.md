# HANDOFF: Agent Academy (2026-11-24)

Spec: `docs/spec-v1.2.md` (platform; §14 = decisions). Book text: `web/src/views/Pages.tsx` (book 1), `Pages2.tsx` (book 2), owner-approved. Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; finishing = on-chain certificate. Site-wide copy (home, library, certificate) fits ANY course.

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- Books (`web/src/books.ts`: URL id → on-chain `chainId`, titles): **#1 = bookId 2** (createBook tx `0x771f75e7…6a54`), **#2 = bookId 3** (tx `0x713575ed…3a58`); both 12 chapters, 2026-11-24. All 12 bits (`FULL_MASK` 0xFFF in `chain.ts`) = certificate. bookIds 1, 900, 901 are unused (ids >= 900 = tests).
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (wrangler logged in on this PC; new files can 404 for ~1 min after deploy). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`: 0.00025 BNB once per Agent ID, only if the wallet has no BNB, max 20/day, 5 per IP per day; relayer `0x49CBB7477b163F4613f08995E1dE61a502b2A43c`, top-ups by the owner).
- Routes: `/`, `/courses` (page named "Courses"; old `/library` works), `/course/<1|2>/<pair 0-5>[/practice]` (higher numbers clamp to 5; old `/book/…` links still work), `/certificate`, `/certificate/<1|2>/0x…`. Valid-route list in 2 places: `pickView` in `App.tsx` and `VALID_PATH` in `worker/index.ts` (keep in sync).
- Lucky draw list: `cd web && npx tsx scripts/certified-wallets.ts <bookId 2|3> ../docs/certified-wallets.csv`.

## Books (deployed 2026-11-24, Worker version 7d8cc9e9)
- Every course (code still says `book`): 12 pages = 6 pairs, odd page = learn, even = practice. Reader = Swiss magazine: contents list left, ONE page at a time (desktop and phone), pages scroll; no flip/fit/flying cover since 2026-11-24. VI = owner's approved copy; EN = translation. A book = `BookContent` (`saves` masks, page names, pages); `Reader.tsx` is shared.
- Book 1: page 3 picks `track` (`own` default / `pro`, localStorage `academy.track`) for pages 4 and 6. Page 7: one "Enter wallet" button (saves the wallet, asks for gas). One save at page 12 (0xFFF).
- Book 2: no track, no gas page; uses the saved wallet (address box at the save if missing). Saves at pages 4, 8, 12 (0x00F, 0x0FF, 0xFFF; the contract keeps bits already saved). Saves 1-2 show no status (owner's spec).
- Copy prompt = shown sentence + hidden technical block (`savePrompt` in `books.ts`). After the last save is copied the site polls every 5 s for 5 min; full mask = book folds shut + `CertPopup.tsx` (.ai name typed by the learner, display only; Save image = PNG; Share on X = intent + `/certificate/<id>/0x…`).
- Next / Space / → next page (desktop top bar hint: "Page 3 / 12 · Space → next"); Shift+Space / ← back. Phone: sticky bottom bar (Previous / Contents / Next).
- Look: Swiss Editorial (`styles.css` = one file, ends with the Swiss type map). One certificate poster (`CertArt.tsx`) for popup, share page and PNG. No book covers. ds-check: 0 issues on 8 pages (2026-11-24).
- QA URLs: `?qa=own|pro|nowallet|copied|timeout|confirmed|cert|unpublished|error`, `?lang=vi`.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", Agent ID never used to look up others. No fake interactions.

## Next
1. Book 2 EN tested end to end 2026-11-24 with 0xhieu.ai (saves 4/8/12 via the site's prompts, popup opened). Still untested: VI prompts.
2. Top up the relayer when low (`baw wallet send` only sends to addresses in the Binance app address book).
3. Get >= 30 Agent ID holders saving; submit by 2026-12-09 08:00 UTC.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, no unexplained lines, screenshots before claiming done.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
