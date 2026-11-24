// The certificate itself: one design for the popup, the share page and the saved PNG.
// Double rule (ink outside, accent inside), recipient as the hero, footer = issued date · seal · course number, wallet as proof.
import { Award } from "lucide-react";
import type { BookMeta } from "../books";
import { useLang, useT } from "../i18n";

export const certDate = (issuedAt: number, lang: "en" | "vi") =>
  new Date((issuedAt || Date.now() / 1000) * 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" });

/** Copy shared by the screen and the PNG. */
function useCertText() {
  const t = useT();
  return {
    kicker: t("Certificate of completion", "Chứng chỉ hoàn thành"),
    certifies: t("This certifies that", "Chứng nhận"),
    completed: t("has completed the course", "đã hoàn thành khóa học"),
    issued: t("Issued", "Ngày cấp"),
    course: t("Course", "Khóa học"),
    proof: t("Recorded on-chain", "Ghi nhận on-chain"),
  };
}

export function CertArt({ book, name, wallet, issuedAt }: { book: BookMeta; name: string; wallet: string; issuedAt: number }) {
  const { lang } = useLang();
  const x = useCertText();
  return (
    <div className="cert-art">
      <div className="cert-inner">
        <p className="cert-brand"><img src="/icon.png" alt="" /><span className="t-label">Agent Academy</span></p>
        <p className="t-label cert-kicker">{x.kicker}</p>
        <p className="t-secondary">{x.certifies}</p>
        <p className="t-page cert-name" translate="no">{name}</p>
        <p className="t-secondary">{x.completed}</p>
        <p className="t-header cert-course">{book.title[lang]}</p>
        <div className="cert-foot">
          <span className="cert-foot-col"><span className="t-content">{certDate(issuedAt, lang)}</span><span className="t-label">{x.issued}</span></span>
          <span className="cert-seal" aria-hidden><Award size={28} /></span>
          <span className="cert-foot-col"><span className="t-content">{book.number}</span><span className="t-label">{x.course}</span></span>
        </div>
        <p className="t-note cert-proof" translate="no">{x.proof} · {wallet}</p>
      </div>
    </div>
  );
}

/** Same layout drawn on a 1200x800 canvas, colors from the DS variables. */
export function useCertPng() {
  const x = useCertText();
  const { lang } = useLang();
  return async (book: BookMeta, name: string, wallet: string, issuedAt: number) => {
    const css = getComputedStyle(document.documentElement);
    const v = (k: string, d: string) => css.getPropertyValue(k).trim() || d;
    const ink = v("--ds-color-ink", "#000"), paper = v("--ds-color-yellow-soft", "#fff8d6"), accent = v("--ds-accent", "#f0b90b"), grey = v("--ds-color-grey", "#555");
    const font = getComputedStyle(document.body).fontFamily;
    const W = 1200, H = 800, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d")!;
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    g.strokeStyle = ink; g.lineWidth = 4; g.strokeRect(24, 24, W - 48, H - 48);
    g.strokeStyle = accent; g.lineWidth = 2; g.strokeRect(48, 48, W - 96, H - 96);
    g.textAlign = "center"; g.textBaseline = "alphabetic";
    const text = (s: string, x0: number, y: number, size: number, weight = 400, color = ink, max = W - 240) => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.fillText(s, x0, y, max); };
    const wrap = (s: string, size: number, weight: number, max: number) => {
      g.font = `${weight} ${size}px ${font}`;
      const lines: string[] = []; let cur = "";
      for (const w of s.split(" ")) { const tryL = cur ? `${cur} ${w}` : w; if (g.measureText(tryL).width > max && cur) { lines.push(cur); cur = w; } else cur = tryL; }
      return [...lines, cur];
    };
    // Brand: cat icon + name.
    const icon = await new Promise<HTMLImageElement | null>((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = "/icon.png"; });
    g.font = `600 20px ${font}`;
    const bw = g.measureText("Agent Academy").width, bx = W / 2 - (bw + 40) / 2;
    if (icon) g.drawImage(icon, bx, 108, 32, 32);
    g.textAlign = "left"; text("Agent Academy", bx + 40, 132, 20, 600); g.textAlign = "center";
    text(x.kicker.toUpperCase(), W / 2, 196, 16, 600, grey);
    text(x.certifies, W / 2, 256, 20, 400, grey);
    text(name, W / 2, 330, 64, 700);
    text(x.completed, W / 2, 388, 20, 400, grey);
    const lines = wrap(book.title[lang], 32, 700, W - 320).slice(0, 2);
    lines.forEach((l, i) => text(l, W / 2, 444 + i * 40, 32, 700));
    // Footer: date · seal · course number, with hairlines above the labels.
    const fy = 612;
    for (const [cx, val, lab] of [[300, certDate(issuedAt, lang), x.issued], [900, book.number, x.course]] as const) {
      text(val, cx, fy, 24, 400);
      g.strokeStyle = ink; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - 120, fy + 16); g.lineTo(cx + 120, fy + 16); g.stroke();
      text(lab, cx, fy + 44, 16, 600, grey);
    }
    g.fillStyle = ink; g.beginPath(); g.arc(W / 2, fy - 8, 48, 0, Math.PI * 2); g.fill();
    g.strokeStyle = accent; g.lineWidth = 2; g.beginPath(); g.arc(W / 2, fy - 8, 56, 0, Math.PI * 2); g.stroke();
    g.save(); g.translate(W / 2 - 24, fy - 32); g.scale(2, 2); g.strokeStyle = accent; g.lineWidth = 2; g.lineCap = "round"; g.lineJoin = "round";
    g.stroke(new Path2D("m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526")); g.stroke(new Path2D("M18 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0")); g.restore();
    text(`${x.proof} · ${wallet}`, W / 2, 712, 16, 400, grey);
    const a = document.createElement("a");
    a.download = "agent-academy-certificate.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };
}
