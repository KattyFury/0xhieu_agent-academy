// Certificate popup (spec §8): shown when the chain says all 12 pages are saved.
// The .ai name is typed by the learner, display only: never looked up, never verified. Empty = short wallet.
import { forwardRef, useState } from "react";
import type { Address } from "viem";
import { Award, Download, X } from "lucide-react";
import type { BookMeta } from "../books";
import { short } from "../chain";
import { useLang, useT } from "../i18n";

/** Share text (owner-approved 2026-11-24). */
const share = (title: string, lang: "en" | "vi") => (lang === "vi" ? `Mình vừa học xong “${title}” trên Agent Academy và nhận chứng chỉ on-chain.` : `I finished “${title}” on Agent Academy and got my on-chain certificate.`);

export const CertPopup = forwardRef<HTMLDialogElement, { book: BookMeta; wallet: Address; issuedAt: number; onClose: () => void }>(function CertPopup({ book, wallet, issuedAt, onClose }, ref) {
  const t = useT();
  const { lang } = useLang();
  const [name, setName] = useState(() => localStorage.getItem("academy.agentid") ?? "");
  const shown = name.trim() || short(wallet);
  const title = book.title[lang];
  const date = new Date((issuedAt || Date.now() / 1000) * 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" });
  const setN = (v: string) => { setName(v); if (v.trim()) localStorage.setItem("academy.agentid", v.trim()); else localStorage.removeItem("academy.agentid"); };

  const savePng = async () => {
    const css = getComputedStyle(document.documentElement);
    const v = (k: string, d: string) => css.getPropertyValue(k).trim() || d;
    const ink = v("--ds-color-ink", "#000"), paper = v("--ds-color-yellow-soft", "#fff8d6"), accent = v("--ds-accent", "#f0b90b"), grey = v("--ds-color-grey", "#555");
    const font = getComputedStyle(document.body).fontFamily;
    const W = 1200, H = 800, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d")!;
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    g.strokeStyle = accent; g.lineWidth = 8; g.strokeRect(32, 32, W - 64, H - 64);
    g.textAlign = "center"; g.fillStyle = ink;
    const line = (txt: string, y: number, size: number, weight = 400, color = ink) => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.fillText(txt, W / 2, y, W - 160); };
    line("Agent Academy", 160, 32, 600);
    line(t("Certificate of completion", "Chứng chỉ hoàn thành"), 240, 22, 400, grey);
    line(title, 340, 48, 700);
    line(shown, 470, 56, 700);
    line(date, 560, 24, 400, grey);
    line(t("Recorded on-chain", "Ghi nhận on-chain"), 690, 18, 400, grey);
    const a = document.createElement("a");
    a.download = "agent-academy-certificate.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };
  const shareX = () => {
    const u = new URL("https://x.com/intent/post");
    u.searchParams.set("text", share(title, lang));
    u.searchParams.set("url", `${location.origin}/certificate/${book.id}/${wallet}`);
    open(u.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <dialog ref={ref} className="dialog cert-dialog" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <button className="btn btn-ghost cert-x" aria-label={t("Close", "Đóng")} onClick={(e) => (e.currentTarget.closest("dialog") as HTMLDialogElement).close()}><X size={20} /></button>
      <div className="cert-paper">
        <span className="cert-seal" aria-hidden><Award size={28} /></span>
        <p className="t-header">Agent Academy</p>
        <p className="t-label cert-kicker">{t("Certificate of completion", "Chứng chỉ hoàn thành")}</p>
        <h2 className="t-page">{title}</h2>
        <p className="t-page cert-name" translate="no">{shown}</p>
        <p className="t-secondary">{date}</p>
      </div>
      <label className="bk-field cert-field">
        <span className="t-label">{t("Your .ai name (Agent ID)", "Tên .ai (Agent ID) của bạn")}</span>
        <input className="input t-input" value={name} onChange={(e) => setN(e.target.value)} placeholder={t("e.g. you.ai", "ví dụ you.ai")} spellCheck={false} autoCapitalize="none" autoComplete="off" maxLength={40} />
      </label>
      <div className="actions cert-buttons">
        <button className="btn btn-primary t-button" onClick={savePng}><Download size={16} aria-hidden /> {t("Save image", "Lưu ảnh")}</button>
        <button className="btn btn-ghost t-button" onClick={shareX}>{t("Share on X", "Chia sẻ lên X")}</button>
      </div>
    </dialog>
  );
});
