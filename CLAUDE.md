# Agent Academy: project rules

Read `HANDOFF.md` first. Spec: `docs/spec-v1.2.md` (owner's, Vietnamese; §14 = decisions). Public repo: write nothing private here (no keys, no personal notes).

- Never invent facts. Book content comes from the official skill docs (`SKILL.md` + `references/` of binance-skills-hub `binance-agentic-wallet`); anything marked [CHƯA KIỂM CHỨNG] is tested or asked, not assumed.
- Red lines (spec §3) are hard rules: no login QR/pairing code on the site, prompts never skip confirmation, no profit promises, risk notes on trade/DeFi pages, progress lookup by address only (never by `.ai` name), no "Binance"/"BNB" in project/domain/token names.
- The website never sends transactions or connects a wallet; it builds calldata with viem and shows a prompt for the learner's own agent.
- Design: nguyen0xhieu design system, **Swiss Editorial style** (`data-ds-style="swiss"`, owner 2026-11-24; DS README "Swiss Editorial"), product `0xhieu-xyz` (yellow + black). Text uses only `--ds-type-swiss-*` / DS styles; `node D:/Codes/0xhieu/design/ds-check.mjs <url> --product 0xhieu-xyz` must show 0 issues. EN default, VI optional.
- Words: a learning platform of **courses** (not "books", not "library"); each course = 12 pages, one page at a time.
- Contract is immutable: `createBook(1, chapterCount)` only after content is frozen and the owner says so. Any on-chain write needs the owner's explicit OK.
- Core: Agent Academy = a learning platform of short courses about AI agents: read a little, practice a little, finish to get a certificate (owner 2026-11-24). Each book = a course; each lesson = short theory + a small practice. Site-wide copy (home, Courses, certificate, steps) must fit ANY course: "AI agents" (the platform topic) is OK, but no wallet/chain words there, plain ELI12 (e.g. "Complete the course to get a certificate"). Book-specific words only inside that book.
