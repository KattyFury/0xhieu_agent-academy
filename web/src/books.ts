// Library: every book's id, on-chain id and title. Page text lives in views/Pages.tsx (book 1) and views/Pages2.tsx (book 2).

export type BookMeta = { id: number; chainId: number; number: string; title: { en: string; vi: string }; blurb: { en: string; vi: string } };

/** id = URL id (/book/<id>); chainId = bookId on the AgentAcademy contract (createBook(chainId, 12) done 2026-11-24). blurb = one line on the library card. */
export const BOOKS: BookMeta[] = [
  { id: 1, chainId: 2, number: "#1", title: { en: "Get started with Binance Agentic Wallet", vi: "Bắt đầu với Binance Agentic Wallet" },
    blurb: { en: "A course to learn and practice using Binance Agentic Wallet.", vi: "Khóa học cho bạn tìm hiểu và tập sử dụng Binance Agentic Wallet." } },
  { id: 2, chainId: 3, number: "#2", title: { en: "Explore what Binance Agentic Wallet can do", vi: "Khám phá Binance Agentic Wallet" },
    blurb: { en: "Send, swap, DeFi, limits and a safety check: see what the wallet can do.", vi: "Gửi, đổi token, DeFi, hạn mức và kiểm tra an toàn: xem ví làm được gì." } },
];
export const bookById = (id: number) => BOOKS.find((b) => b.id === id) ?? BOOKS[0];

/** Every book: 12 pages = 6 spreads; spread p holds pages 2p+1 (learn) and 2p+2 (practice). */
export const SPREADS = 6;
/** Printed pages of spread p ("1–2", "3–4", …). */
export const pagesOf = (p: number) => `${2 * p + 1}–${2 * p + 2}`;

/** Save prompt: the sentence the learner sees + a technical block added on copy. */
export function savePrompt(sentence: string, p: { wallet: string; academy: string; bookId: number; mask: bigint; calldata: string }, lang: "en" | "vi") {
  if (lang === "vi") return `${sentence}

Thông tin kỹ thuật (dùng Binance Agentic Wallet skill \`baw\`, KHÔNG thay đổi giá trị nào):
- Mạng: BNB Smart Chain (binanceChainId 56)
- Hợp đồng: ${p.academy}
- Hàm: completeChapters(bookId=${p.bookId}, mask=${p.mask}). Không chuyển token, không xin approve.
- from: ${p.wallet}
- value: 0
- inputData: ${p.calldata}
Bước 1: chạy \`baw wallet settings --json\`. Nếu devMode.enabled không phải true thì dừng lại và hướng dẫn tôi bật Developer Mode.
Bước 2: chạy \`baw contract-call preview --binanceChainId 56 --from ${p.wallet} --to ${p.academy} --value 0 --inputData ${p.calldata} --json\`.
Bước 3: cho tôi xem parsedTx, risks và authorityChanges. Có lỗi hoặc rủi ro thì dừng lại và báo nguyên văn.
Bước 4: CHỈ khi tôi trả lời "xác nhận", chạy \`baw contract-call execute --requestId <requestId> --json\`.
Bước 5: báo txHash cho tôi.`;
  return `${sentence}

Technical details (use the Binance Agentic Wallet skill \`baw\`, do NOT change any value):
- Network: BNB Smart Chain (binanceChainId 56)
- Contract: ${p.academy}
- Function: completeChapters(bookId=${p.bookId}, mask=${p.mask}). Moves no tokens, requests no approval.
- from: ${p.wallet}
- value: 0
- inputData: ${p.calldata}
Step 1: run \`baw wallet settings --json\`. If devMode.enabled is not true, stop and guide me to turn on Developer Mode.
Step 2: run \`baw contract-call preview --binanceChainId 56 --from ${p.wallet} --to ${p.academy} --value 0 --inputData ${p.calldata} --json\`.
Step 3: show me parsedTx, risks and authorityChanges. If there is an error or any risk, stop and report it word for word.
Step 4: ONLY when I reply "confirm", run \`baw contract-call execute --requestId <requestId> --json\`.
Step 5: tell me the txHash.`;
}
