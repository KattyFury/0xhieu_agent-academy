# HANDOFF: Agent Academy (2026-11-23)

Spec: `docs/spec-v1.2.md` (owner; §14 = decisions). Rules: `CLAUDE.md`. Old v1.1 build (private repo `binance_build\binance_academy`) is an archive; this public repo replaces it.

## Core
Agent Academy = a library; each book = a course; each lesson = short theory + a small practice; complete the course = certificate. Site-wide copy (home, library, certificate) must fit ANY course: no wallet/agent/chain words there. Book-specific words only inside that book. Book #1 = Binance Agentic Wallet (the hackathon book).

## Owner decisions (2026-11-23)
- Public repo `KattyFury/0xhieu_agent-academy`, clean history. EN default on every visit; VI via the switch or `?lang=vi` (not remembered). Agent prompts stay English.
- Theme `0xhieu-xyz` (yellow + black, 0xhieu.xyz look). No wallet in the navbar. No footer line.
- One spread (2 printed pages) = one chapter = one on-chain bit. Book #1 = **13 chapters** (26 pages).
- Library and Certificate are card grids for many books; each card = half the page on desktop. Progress/certificate check is per book (book #1: by wallet address, inside its card). Table of contents lives inside the book.
- Keep the free-gas relayer (`/api/claim`).

## Live
- **AgentAcademy `0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753`** (BSC, verified). Owner 0xhieu.ai `0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2`. Test book 900 (1 chapter) exists.
- **Book 1 is NOT created on-chain yet.** Record buttons say "Recording opens when this book is published". `createBook(1, 13)` was blocked by the Claude Code permission classifier on 2026-11-23; owner must say "publish book 1 with 13 chapters" and approve the prompt. Irreversible: chapter count can never change.
- Day-0 test passed (spec §9.4): `completeChapters(900, 1)` tx `0xb7b97532946a1ef87e6cfa8db5c713bb2f096d6c817ac71f6a8c45aa0ae8a3cb`, 78,149 gas, 0.0000057 BNB. Risk engine doesn't block the new contract; Agent ID holder = Agentic Wallet address.
- Site https://academy.0xhieu.xyz — Worker `academy-web` (`web/`, React + Vite + viem). Deploy: `cd web && npm run build && npx wrangler deploy` with `CLOUDFLARE_API_TOKEN` from `~/.claude/secrets.env`. Worker secrets (RELAYER_KEY, TG_*) and KV `GAS` are on the Worker.
- Routes: `/` landing (yellow tile → Library, black → Certificate), `/library`, `/book/1/<spread 0-12>[/practice]`, `/certificate` (cards), `/certificate/1/0x…` (full certificate, share link). Old `#/…` links redirect. `?qa=<state>` for screenshots.

## Book #1 content (owner v2, ELI12, live)
- Order: 1 What is an Agentic Wallet (quiz) · 2 From zero to signed in · 3 Gas and Developer Mode · 4 Addresses · 5 Balances · 6 Networks, history and gas · 7 Rules · 8 Approvals · 9 Pending and locked · 10 Quotes (risk note) · 11 DeFi preview (risk note) · 12 Agent ID · 13 Staying safe.
- Files: `web/src/book001.ts` (EN, `day` = chapter number) + `book001.vi.ts`; chapters 2-3 (inputs) in `web/src/views/Onboard.tsx`. Chapters 1-3 are recorded together on pages 5-6 (mask bits 0-2), since recording needs Developer Mode. Practice pages show "Right result / If not".
- Sources: Binance Agentic Wallet Introduction + Install pages, skill v1.15.0, real read-only `baw` runs. `approvals list --binanceChainId` is in the docs but rejected by `baw` 1.12.0. `wallet chains` on the owner's wallet = 7 networks.
- Fit (2026-11-23): a page never scrolls. `Page` in `Reader.tsx` steps `data-fit1..4` (spacing, then text down to 13px) until it fits; phones show one page = one screen. Measured 0 overflow at 1920/1536/1440/1366/1280 desktop and 412/393/375/360 phones, EN + VI; ds-check 0 issues. If new text overflows even at fit4, shorten the text. Export for editing: `npx tsx web/scripts/export-book.ts <out.md>` (setup chapters 2-3 not included).

## Next
1. Owner: publish book 1 (`createBook(1, 13)`), then a second person with a real Agent ID runs the full flow (spec §9.7).
2. Optional: make 1366 fit with 0 overflow (trim chapters 1, 2, 7, 13 text or prompts).
3. Submission (deadline 2026-12-09 08:00 UTC): ≥30 Agent ID holders recording; README already lists owner powers and the free-gas rules.

## Notes
- Foundry on the PC: `~/bin/forge.exe` (1.5.1). `contracts/lib` is not committed; README has the install command. `ETHERSCAN` key in `<code root>\.secrets\keys.env`.
