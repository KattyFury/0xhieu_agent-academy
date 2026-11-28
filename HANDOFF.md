# HANDOFF: Agent Academy (2026-11-28)

Spec: `docs/spec-v1.2.md` (platform; §14 = decisions). Course text: `web/src/views/Pages.tsx` (course 1), `Pages2.tsx` (course 2); reworked for beginners 2026-11-28 (owner asked; owner has not re-read every line). Rules: `CLAUDE.md`. History: `docs/archive/`.

## Core
Agent Academy = a learning platform of short courses about AI agents: read a little, practice a little, finish to get a certificate (UI never says "book" or "library"; code still does: `book1`, `BOOKS`, `bookId`). Each page = short theory or a small practice; finishing = on-chain certificate. Site-wide copy (home, Courses, certificate) fits ANY course.

## Live
- Contract **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`; only power = `createBook`.
- Courses (`web/src/books.ts`: URL id → on-chain `chainId`, titles, blurbs): **#1 = bookId 2** (createBook tx `0x771f75e7…6a54`), **#2 = bookId 3** (tx `0x713575ed…3a58`); both 12 chapters, 2026-11-24. All 12 bits (`FULL_MASK` 0xFFF in `chain.ts`) = certificate. bookIds 1, 900, 901 are unused (ids >= 900 = tests).
- Site https://academy.0xhieu.xyz, Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` (PC: wrangler is not logged in; load `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` from `~/.claude/secrets.env`; the `CF_API_TOKEN` in `keys.env` was rejected as invalid on 2026-11-26; new files can 404 for ~1 min after deploy). Worker secrets RELAYER_KEY, TG_*; KV `GAS` (free-gas relayer `/api/claim`: 0.00025 BNB once per Agent ID, only if the wallet has no BNB, max 20/day, 5 per IP per day; relayer `0x49CBB7477b163F4613f08995E1dE61a502b2A43c`, top-ups by the owner).
- Landing `/` (2026-11-26, owner): headline, one button "Start learning", 4 steps. No course list or certificate section.
- Routes: `/`, `/courses` (page named "Courses"; old `/library` works), `/course/<1|2>/<pair 0-5>[/practice]` (higher numbers clamp to 5; old `/book/…` links still work), `/certificate`, `/certificate/<1|2>/0x…`. Valid-route list in 2 places: `pickView` in `App.tsx` and `VALID_PATH` in `worker/index.ts` (keep in sync).
- `/status` (not in the navbar) + `/api/status`: totals of different wallets that saved on courses 1-2 (the contract requires an Agent ID; owner wallet included) and a list of those wallets (no Agent ID / .ai name). `worker/status.ts`: a Durable Object alarm (`worker/clock.ts`; the free plan's 5 cron triggers are all used; any `/api/status` request restarts it) every 5 min reads new `ChapterCompleted` logs from publicnode into KV `GAS` key `status`; history before block 135,560,000 is a seed in that file (2026-11-26: 6 wallets). If it falls > 295,000 blocks (~1.4 days) behind it stops with an error: rescan and update the seed + KV.
- `/status` layout: fits one screen; 3 number columns (wallets, certificates per course) + wallet table (yellow check = certificate, links to BscScan); only the table scrolls. ds-check 0 issues.
- Counter catch-up: publicnode answers 429 to the Worker during backfill, so it advanced about 10k blocks per run (chunks already read are kept). On 2026-11-26 it was ~132k blocks behind and moving; not yet seen caught up.
- Giveaway list: `cd web && npx tsx scripts/certified-wallets.ts <bookId 2|3>`: wallets from `/api/status`, each checked with `hasCertificate`, owner left out; it stops if the counter is behind. Never trust old `getLogs` from publicnode (returns `[]` with no error).

## Beginner rework (deployed 2026-11-28, Worker version 490842ab)
- Goal (owner): a non-technical person can finish both courses. Owner rejected wall-of-text pages and the word "Terminal".
- `views/Art.tsx` = drawn pictures (no screenshots): `Step` (where: computer / phone / AI chat + "Example picture"), `Need` (get ready), `Help` (Stuck? fold-outs), `Chat`, `Phone`, `Window`, `CodeMatch` (green same / red different), `Flow`, `Meter`, `Rows`, `Preview` (save: send → preview → "confirm" → saved), `Note`. CSS block `/* Drawn lesson pictures */` in `styles.css`.
- `Pages.tsx` shared: `Ask` (prompt + drawn AI reply + Right result), `SaveStep`, `SaveHelp` (351802, execution reverted, no gas, PENDING_CONFIRMATION, 351803, lost certificate → /certificate). Used by both courses.
- Course 1 p3: chips now "Easiest" (AI Pro) / "If you code" (own AI) + "New to this? pick AI Pro". p4 own: install = paste a sentence to Claude Code / Codex / Gemini CLI (web ChatGPT/Gemini can't). "AI tokens" explained as usage credits, not crypto.
- AI replies in pictures come from a real run on 2026-11-28 (Claude Code + skill 1.15 / baw 1.12.0, owner's wallet, read-only): addresses = 11 EVM networks + Solana (old text listing 6 was wrong, fixed); limits 50k/DeFi 5k/Prediction 5k off/x402 20/Dev 1k; quote 0.0001 BNB ≈ 0.0551 USDT; history has fee; approvals none; tx-lock UNLOCKED. Sign-in link opens web3.binance.com "Đăng nhập Ví Agentic" QR page; pairing code is hex (e.g. 955b11). Don't put a real login QR on the site (red line).
- baw is signed in on the PC (session to ~2026-11-30): `"$(npm prefix -g)/baw"`, skill in `~/.agents/skills/binance-agentic-wallet`.

## Courses (deployed 2026-11-24, Worker version cadd613f)
- Every course (code still says `book`): 12 pages = 6 pairs, odd page = learn, even = practice. Reader = Swiss magazine: contents list left, ONE page at a time (desktop and phone), pages scroll; no flip/fit/flying cover since 2026-11-24. VI = owner's approved copy; EN = translation. A book = `BookContent` (`saves` masks, page names, pages); `Reader.tsx` is shared.
- Course 1: page 3 picks `track` (`own` default / `pro`, localStorage `academy.track`) for pages 4 and 6. Page 7: one "Enter wallet" button (saves the wallet, asks for gas). One save at page 12 (0xFFF).
- Course 2: no track, no gas page; uses the saved wallet (address box at the save if missing). Saves at pages 4, 8, 12 (0x00F, 0x0FF, 0xFFF; the contract keeps bits already saved). Saves 1-2 show no "waiting" status after copy (owner's spec); once on-chain they show "Already saved".
- Save points check the chain first: pages already saved = "Already saved" (no prompt; the contract reverts NothingNew), wallet without Agent ID = warning (contract reverts NoAgentId). The prompt also tells the AI to explain "execution reverted" in plain words.
- Copy prompt = shown sentence + hidden technical block (`savePrompt` in `books.ts`). After the last save is copied the site polls every 5 s for 5 min; full mask = `CertPopup.tsx` opens (.ai name typed by the learner, display only; Save image = PNG; Share on X = intent + `/certificate/<id>/0x…`).
- Next / Space / → next page (desktop top bar hint: "Page 3 / 12 · Space → next"); Shift+Space / ← back. Phone: sticky bottom bar (Previous / Contents / Next).
- Look: Swiss Editorial (`styles.css` = one file, ends with the Swiss type map). One certificate poster (`CertArt.tsx`) for popup, share page and PNG. No book covers. ds-check: 0 issues on 8 pages (2026-11-24).
- QA URLs: `?qa=own|pro|nowallet|copied|timeout|confirmed|cert|unpublished|error`, `?lang=vi`.

## Hackathon (deadline 2026-12-09 08:00 UTC)
- Need >= 30 real Agent ID addresses calling the contract. Red lines: no Binance/BNB in project/domain, no web login/QR, prompts always wait for "confirm", Agent ID never used to look up others. No fake interactions.
- Only calls after 2026-11-18 08:00 UTC count. No pre-registration; one project per team; one prize per project.
- Submission form: project name, website, contract address, how Agent ID is used (contract reverts `NoAgentId` without one), reward wallet. Also state: owner's only power = `createBook`; free gas = 0.00025 BNB once per Agent ID, only to wallets with no BNB (daily/IP caps above).
- Open: owner power is in README only, not on the site.

## Certificate page fix (2026-11-28, deployed, Worker version 03d731b6)
Share page: name = any text up to 40 chars (same as popup; before, non-`.ai` input was silently ignored); added Download (PNG). Checked in local preview on desktop; phone not checked. On the PC, `wrangler deploy` now works with wrangler's own login (`~/.claude/secrets.env` does not exist there).

## Next
- Beginner rework open items: phone-app screens are still guesses ("Box 1/2/3" on Secure Auto Sign, Developer Mode toggle, Agent ID banner, code compare); owner to send phone screenshots (mask the address). The install sentence on course 1 p4 is untested. Owner should skim the new VI copy. Not looked at by eye: EN pages and phone layout of new pages (overflow checked: none). Best test: a non-technical person does course 1 unaided.
0. Check the `/status` counter caught up: `/api/status` `block` within ~2,000 of the chain head. Then run the giveaway script once (only its "counter behind" stop has been tested, not a full export).
1. Tested 2026-11-24 with 0xhieu.ai: course 2 EN saves end to end; all practice prompts (EN + VI) match "Right result"; all 8 save prompts (EN + VI) carry the right mask/calldata. Untested: a real save from a fresh wallet in VI, and whether Binance AI Pro follows the save prompt (it contains `baw` commands).
2. Open owner question: labels say LEARN/PRACTICE by page position, so course 1 page 2 says PRACTICE but is theory. Neutral "PAGE 02"?
3. Top up the relayer when low (`baw wallet send` only sends to addresses in the Binance app address book).
4. Get >= 30 Agent ID holders saving; submit by 2026-12-09 08:00 UTC.

## Gotchas
- Another Claude session once edited this repo at the same time: commit files by name, check `git status` first.
- Owner wants: short ELI12 copy, no unexplained lines, screenshots before claiming done. Deploy after verified changes without asking.
- Design = DS Swiss style (`D:\Codes\0xhieu\design`, README "Swiss Editorial"). Run `node D:/Codes/0xhieu/design/ds-check.mjs <url> --product 0xhieu-xyz` after UI changes (0 issues). Copy `design/web.css` into `web/src/ds/web.css` when the DS changes.
- Foundry: `~/bin/forge.exe`; `contracts/lib` not committed (README has the install command). `ETHERSCAN` key in `D:\Codes\.secrets\keys.env`.
