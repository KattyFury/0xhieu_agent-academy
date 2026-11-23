// Export Book 1 to Markdown for editing: `npx tsx scripts/export-book.ts <out.md>`.
// Lessons come from book001.ts / book001.vi.ts; the two Get ready spreads live in views/Onboard.tsx (copied below).
import { writeFileSync } from "node:fs";
import { book001, pagesOf, SETUP_PAGES, pageCount } from "../src/book001";
import { localDay } from "../src/book001.vi";

const P = pageCount(book001);
const out: string[] = [];
out.push(`# Agent Academy #1: Binance Agentic Wallet (${P} spreads = ${2 * P} pages = ${P} on-chain chapters)`, "",
  `Exported ${new Date().toISOString().slice(0, 10)} from the live source. **Bold** = key term (shown bold on the page). Prompts are English in both languages.`, "");

out.push("---", "", "## Pages 1–2: Get ready (views/Onboard.tsx)", "",
  "### EN", "**Left: Your Agent ID**", "- Goal: Get a Binance account, an Agentic Wallet and your Agent ID.",
  "- This book runs on **Binance Agentic Wallet**: a wallet your AI agent can use, with rules you set in the Binance app.",
  "1. Create a Binance account, then create your Agentic Wallet in the Binance app.",
  "2. Claim your Agent ID: Binance app, **Wallet, then the Agent ID banner** on the home screen. One per user, free apart from the BNB network fee.",
  "3. Your Agent ID is your **.ai name**, like you.ai. Only Agent ID holders can record pages and earn the certificate.",
  "- Note: Never share your recovery phrase or pairing code. Not here, not with anyone.", "",
  "**Right: Your agent** (About 10 minutes)",
  "- Cards: Your own AI (Recommended): Claude Code, Codex, Gemini CLI. Node.js 18+. | Binance AI Pro: In the Binance app. Free credits run out fast.",
  "- Own AI: 1. Paste this in your computer's terminal: `npx skills add binance/binance-skills-hub/skills/binance-web3/binance-agentic-wallet` 2. Tell your AI **“Sign in to Binance Agentic Wallet”**. It shows a 6-character pairing code. Check the same code in the Binance app, then confirm.",
  "- AI Pro: 1. Open the AI tab in the Binance app. 2. Ask **“Is my Agentic Wallet connected?”**",
  "- Record: Recorded with pages 3–4, after Developer Mode. [Next: gas and Developer Mode]", "",
  "### VI", "**Trái: Agent ID của bạn**", "- Mục tiêu: Có tài khoản Binance, Agentic Wallet và Agent ID.",
  "- Sách này học trên **Binance Agentic Wallet**: một ví mà AI agent của bạn dùng được, với quy tắc do bạn đặt trong app Binance.",
  "1. Tạo tài khoản Binance, rồi tạo Agentic Wallet trong app Binance.",
  "2. Nhận Agent ID: app Binance, **Ví, rồi banner Agent ID** ở màn hình chính. Mỗi người một tên, miễn phí ngoài phí mạng BNB.",
  "3. Agent ID là **tên .ai** của bạn, ví dụ you.ai. Chỉ người có Agent ID mới ghi nhận trang và nhận chứng chỉ được.",
  "- Lưu ý: Không bao giờ chia sẻ cụm từ khôi phục hay mã ghép nối. Không ở đây, không với ai.", "",
  "**Phải: Agent của bạn** (Khoảng 10 phút)",
  "- Thẻ: AI của bạn (Nên dùng): Claude Code, Codex, Gemini CLI. Node.js 18+. | Binance AI Pro: Trong app Binance. Credit miễn phí hết nhanh.",
  "- AI của bạn: 1. Dán lệnh này vào terminal trên máy tính: (lệnh như trên) 2. Nói với AI **“Sign in to Binance Agentic Wallet”**. Nó hiện một mã ghép nối 6 ký tự. Kiểm tra đúng mã đó trong app Binance rồi xác nhận.",
  "- AI Pro: 1. Mở tab AI trong app Binance. 2. Hỏi **“Is my Agentic Wallet connected?”**",
  "- Ghi nhận: Ghi nhận cùng trang 3–4, sau Developer Mode. [Tiếp: gas và Developer Mode]", "");

out.push("---", "", "## Pages 3–4: Get ready (views/Onboard.tsx)", "",
  "### EN", "**Left: Gas**", "- Goal: Have a little BNB so your agent can record pages.",
  "- Each record is a small transaction on BNB Smart Chain, paid in BNB. On Nov 23 one record cost about **0.000006 BNB**.",
  "- Agent ID holders can get free gas once. Ask your AI “What's my wallet address?” (starts with 0x, safe to share) and paste it here.",
  "- [address input] [Send me gas] [I have BNB, just save]", "",
  "**Right: Developer Mode** (About 3 minutes)",
  "- Recording a page calls the Agent Academy contract. Your agent can only call a contract when **Developer Mode is on**.",
  "1. Binance app: Agentic Wallet page, Settings (top right), **Developer Mode**.",
  "2. Read the risk warning, confirm, then approve the request in the app.",
  "3. It lasts **7 days**; each successful use extends it. The app refuses if your total balance is over the Developer Mode cap.",
  "- Record pages 3–4 (records pages 1–2 too): Paste the record prompt into your agent and type **confirm** when it shows the preview.", "",
  "### VI", "**Trái: Gas**", "- Mục tiêu: Có một ít BNB để agent ghi nhận trang.",
  "- Mỗi lần ghi nhận là một giao dịch nhỏ trên BNB Smart Chain, trả bằng BNB. Ngày 23/11 một lần ghi tốn khoảng **0.000006 BNB**.",
  "- Người có Agent ID được nhận gas miễn phí một lần. Hỏi AI “What's my wallet address?” (bắt đầu bằng 0x, chia sẻ an toàn) rồi dán vào đây.",
  "- [ô địa chỉ] [Gửi gas cho tôi] [Tôi có BNB, chỉ lưu]", "",
  "**Phải: Developer Mode** (Khoảng 3 phút)",
  "- Ghi nhận trang là gọi hợp đồng Agent Academy. Agent chỉ gọi được hợp đồng khi **Developer Mode đang bật**.",
  "1. App Binance: trang Agentic Wallet, Cài đặt (góc trên phải), **Developer Mode**.",
  "2. Đọc cảnh báo rủi ro, xác nhận, rồi duyệt yêu cầu trong app.",
  "3. Có hiệu lực **7 ngày**; mỗi lần dùng thành công được gia hạn. App từ chối nếu tổng số dư vượt giới hạn của Developer Mode.",
  "- Ghi nhận trang 3–4 (kèm trang 1–2): Dán prompt ghi nhận vào agent và gõ **confirm** khi agent hiện phần xem trước.", "");

for (const d of book001.days) {
  const p = d.day - 1 + SETUP_PAGES;
  out.push("---", "", `## Pages ${pagesOf(p)}: ${d.title}`, "");
  for (const lang of ["en", "vi"] as const) {
    const x = localDay(d, lang);
    const L = lang === "en";
    out.push(`### ${lang.toUpperCase()}`, `**${L ? "Left" : "Trái"}: ${x.title}**`, `- ${L ? "Goal" : "Mục tiêu"}: ${x.goal}`);
    x.learn.paragraphs.forEach((t) => out.push(`- ${t}`));
    out.push(`- ${L ? "Steps" : "Các bước"}: ${x.learn.flow.join(" → ")}`, `- ${L ? "Remember" : "Ghi nhớ"}:`);
    x.learn.remember.forEach((t) => out.push(`  - ${t}`));
    out.push("", `**${L ? "Right" : "Phải"}: ${x.practice.title}** (${L ? `About ${x.practice.minutes} minutes` : `Khoảng ${x.practice.minutes} phút`})${x.practice.risk ? (L ? " · risk note shown" : " · có cảnh báo rủi ro") : ""}`);
    x.practice.steps.forEach((s, i) => { out.push(`${i + 1}. **${s.title}**: ${s.text}`); if (s.prompt && L) out.push("", "```", s.prompt, "```"); });
    out.push(`- ${L ? `Record pages ${pagesOf(p)}` : `Ghi nhận trang ${pagesOf(p)}`}: ${x.practice.recordText ?? (L ? "Paste the record prompt into your agent and type **confirm** when it shows the preview." : "Dán prompt ghi nhận vào agent và gõ **confirm** khi agent hiện phần xem trước.")}`, "");
  }
}
writeFileSync(process.argv[2], out.join("\n"));
console.log("wrote", process.argv[2]);
