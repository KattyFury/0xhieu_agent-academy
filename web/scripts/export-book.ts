// Export Book 1 to Markdown for editing: `npx tsx scripts/export-book.ts <out.md>`.
// Lessons come from book001.ts / book001.vi.ts; the two Get ready spreads live in views/Onboard.tsx (copied below).
import { writeFileSync } from "node:fs";
import { book001, pagesOf, pageCount } from "../src/book001";
import { localDay } from "../src/book001.vi";

const P = pageCount(book001);
const out: string[] = [];
out.push(`# Agent Academy #1: Binance Agentic Wallet (${P} spreads = ${2 * P} pages = ${P} on-chain chapters)`, "",
  `Exported ${new Date().toISOString().slice(0, 10)} from the live source. **Bold** = key term (shown bold on the page). Prompts are English in both languages.`, "");

out.push("---", "", "## Chapters 2–3 (pages 3–6): setup spreads with inputs, see src/views/Onboard.tsx", "");

for (const d of book001.days) {
  const p = d.day - 1;
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
