// The certificate (Swiss poster): one design for the popup, the share page and the saved PNG.
// Left: "Certified." + recipient + course. Right: yellow seal block, then a grid of rules: issued · course · on-chain proof.
import { Award } from "lucide-react";
import type { BookMeta } from "../books";
import { useLang, useT } from "../i18n";

export const certDate = (issuedAt: number, lang: "en" | "vi") =>
  new Date((issuedAt || Date.now() / 1000) * 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" });

/** Copy shared by the screen and the PNG. */
function useCertText() {
  const t = useT();
  return {
    kicker: t("Agent Academy — Certificate of completion", "Agent Academy — Chứng chỉ hoàn thành"),
    big: t("Certified.", "Hoàn thành."),
    certifies: t("This certifies that", "Chứng nhận"),
    completed: t("has completed the course", "đã hoàn thành khóa học"),
    issued: t("Issued", "Ngày cấp"),
    course: t("Course", "Khóa học"),
    proof: t("Recorded on-chain", "Ghi nhận on-chain"),
  };
}

export function CertArt({ book, name, wallet, issuedAt, compact = false }: { book: BookMeta; name: string; wallet: string; issuedAt: number; compact?: boolean }) {
  const { lang } = useLang();
  const x = useCertText();
  return (
    <div className={`cert ${compact ? "cert-compact" : ""}`}>
      <div className="cert-l">
        <span className="sw-label">{x.kicker}</span>
        <span className="cert-big">{x.big}</span>
        <span className="sw-label">{x.certifies}</span>
        <span className="cert-name" translate="no">{name}</span>
        <span className="sw-label">{x.completed}</span>
        <span className="cert-course">{book.title[lang]}</span>
      </div>
      <div className="cert-r">
        <div className="cert-seal" aria-hidden><Award strokeWidth={1.5} /></div>
        <dl className="cert-dl">
          <div><dt className="sw-label">{x.issued}</dt><dd>{certDate(issuedAt, lang)}</dd></div>
          <div><dt className="sw-label">{x.course}</dt><dd>{book.number}</dd></div>
          <div className="cert-wide"><dt className="sw-label">{x.proof}</dt><dd className="cert-mono" translate="no">{wallet}</dd></div>
        </dl>
      </div>
    </div>
  );
}

/** Same poster drawn on a 1200x800 canvas, colors from the DS variables. */
export function useCertPng() {
  const x = useCertText();
  const { lang } = useLang();
  return (book: BookMeta, name: string, wallet: string, issuedAt: number) => {
    const css = getComputedStyle(document.documentElement);
    const v = (k: string, d: string) => css.getPropertyValue(k).trim() || d;
    const ink = "#000000", paper = "#FFFFFF", accent = v("--ds-accent", "#F5B301"), grey = v("--ds-color-grey", "#525252");
    const font = getComputedStyle(document.body).fontFamily;
    const W = 1200, H = 800, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d")!;
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    const L = 48, T = 48, R = W - 48, B = H - 48, SPLIT = 744; // outer box, left/right split
    const line = (x1: number, y1: number, x2: number, y2: number) => { g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); };
    const text = (s: string, x0: number, y: number, size: number, weight: number, color = ink, track = 0, max = SPLIT - L - 96) => {
      g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.letterSpacing = `${track}px`; g.fillText(s, x0, y, max); g.letterSpacing = "0px";
    };
    const wrap = (s: string, size: number, weight: number, max: number) => {
      g.font = `${weight} ${size}px ${font}`;
      const out: string[] = []; let cur = "";
      for (const w of s.split(" ")) { const tryL = cur ? `${cur} ${w}` : w; if (g.measureText(tryL).width > max && cur) { out.push(cur); cur = w; } else cur = tryL; }
      return [...out, cur];
    };
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.strokeStyle = ink; g.lineWidth = 2; g.strokeRect(L, T, R - L, B - T);
    line(SPLIT, T, SPLIT, B);
    // Left column
    const lx = L + 48;
    text(x.kicker.toUpperCase(), lx, T + 72, 14, 600, grey, 2);
    text(x.big, lx, T + 176, 96, 800, ink, -4);
    text(x.certifies.toUpperCase(), lx, T + 248, 14, 600, grey, 2);
    text(name, lx, T + 330, 64, 800, ink, -2);
    text(x.completed.toUpperCase(), lx, T + 392, 14, 600, grey, 2);
    wrap(book.title[lang], 32, 700, SPLIT - lx - 48).slice(0, 3).forEach((l, i) => text(l, lx, T + 448 + i * 40, 32, 700, ink, -0.5));
    // Right column: yellow seal block, then rule grid
    const sealB = T + 400;
    g.fillStyle = accent; g.fillRect(SPLIT + 1, T + 1, R - SPLIT - 2, sealB - T - 1);
    g.save(); g.translate((SPLIT + R) / 2 - 72, (T + sealB) / 2 - 72); g.scale(6, 6); g.strokeStyle = ink; g.lineWidth = 1.5; g.lineCap = "round"; g.lineJoin = "round";
    g.stroke(new Path2D("m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526")); g.stroke(new Path2D("M18 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0")); g.restore();
    line(SPLIT, sealB, R, sealB);
    const mid = (SPLIT + R) / 2, rowB = sealB + 112;
    line(mid, sealB, mid, rowB); line(SPLIT, rowB, R, rowB);
    text(x.issued.toUpperCase(), SPLIT + 24, sealB + 40, 14, 600, grey, 2, 180);
    text(certDate(issuedAt, lang), SPLIT + 24, sealB + 80, 24, 700, ink, 0, 180);
    text(x.course.toUpperCase(), mid + 24, sealB + 40, 14, 600, grey, 2, 180);
    text(book.number, mid + 24, sealB + 80, 24, 700, ink, 0, 180);
    text(x.proof.toUpperCase(), SPLIT + 24, rowB + 40, 14, 600, grey, 2, R - SPLIT - 48);
    g.font = `400 16px ui-monospace, Menlo, Consolas, monospace`; g.fillStyle = ink;
    g.fillText(wallet.slice(0, 22), SPLIT + 24, rowB + 76); g.fillText(wallet.slice(22), SPLIT + 24, rowB + 100);
    const a = document.createElement("a");
    a.download = "agent-academy-certificate.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };
}
