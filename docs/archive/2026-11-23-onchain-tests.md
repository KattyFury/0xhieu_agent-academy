# On-chain tests (2026-11-23, archived from HANDOFF)

- Day-0 test (spec §9.4): `completeChapters(900, 1)` tx `0xb7b97532946a1ef87e6cfa8db5c713bb2f096d6c817ac71f6a8c45aa0ae8a3cb`, 78,149 gas, 0.0000057 BNB. Risk engine doesn't block the contract; Agent ID holder = Agentic Wallet address.
- Rehearsal before publishing: `createBook(901, 13)` tx `0xffb9a6a7282994f0201fb1d3810d0aa4fee5f6aaa39d3c4de46c4857e185183d` (47,805 gas). The site's own record prompt, followed step by step by 0xhieu.ai: `completeChapters(901, 7)` tx `0xeff075a6673c530dc520f239154232ac948a6de1321dbaf2bf5e456f75a31514` (54,767 gas). `progressOf` = mask 7, count 3, certified false.
- Publish: `createBook(1, 13)` tx `0xa2972462c4b82bf08349d5f8074bd1554081bf43bda523f320eeb00c1dc03251` (block 135278421, 47,793 gas).
