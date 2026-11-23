# Agent Academy: project rules

Read `HANDOFF.md` first. Spec: `docs/spec-v1.2.md` (owner's, Vietnamese; §14 = decisions). Public repo: write nothing private here (no keys, no personal notes).

- Never invent facts. Book content comes from the official skill docs (`SKILL.md` + `references/` of binance-skills-hub `binance-agentic-wallet`); anything marked [CHƯA KIỂM CHỨNG] is tested or asked, not assumed.
- Red lines (spec §3) are hard rules: no login QR/pairing code on the site, prompts never skip confirmation, no profit promises, risk notes on trade/DeFi pages, progress lookup by address only (never by `.ai` name), no "Binance"/"BNB" in project/domain/token names.
- The website never sends transactions or connects a wallet; it builds calldata with viem and shows a prompt for the learner's own agent.
- Design: nguyen0xhieu design system, theme `0xhieu-xyz` (yellow + black, same look as 0xhieu.xyz). EN default, VI optional.
- Contract is immutable: `createBook(1, chapterCount)` only after content is frozen and the owner says so. Any on-chain write needs the owner's explicit OK.
