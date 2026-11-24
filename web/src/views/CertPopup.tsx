// Certificate popup (spec §8): shown when the chain says all 12 pages are saved.
// The .ai name is typed by the learner, display only: never looked up, never verified. Empty = short wallet.
import { forwardRef, useState } from "react";
import type { Address } from "viem";
import { Download, X } from "lucide-react";
import { CertArt, useCertPng } from "./CertArt";
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
  const png = useCertPng();
  const setN = (v: string) => { setName(v); if (v.trim()) localStorage.setItem("academy.agentid", v.trim()); else localStorage.removeItem("academy.agentid"); };

  const savePng = () => png(book, shown, wallet, issuedAt);
  const shareX = () => {
    const u = new URL("https://x.com/intent/post");
    u.searchParams.set("text", share(title, lang));
    u.searchParams.set("url", `${location.origin}/certificate/${book.id}/${wallet}`);
    open(u.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <dialog ref={ref} className="dialog sw-dialog cert-dialog" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <div className="sw-dialog-head"><span className="sw-label">{t("Your certificate", "Chứng chỉ của bạn")}</span>
        <button className="sw-x" aria-label={t("Close", "Đóng")} onClick={(e) => (e.currentTarget.closest("dialog") as HTMLDialogElement).close()}><X size={16} /></button></div>
      <div className="dialog-body cert-dialog-body">
        <CertArt book={book} name={shown} wallet={wallet} issuedAt={issuedAt} compact />
        <label className="bk-field">
          <span className="sw-label">{t("Your .ai name (Agent ID)", "Tên .ai (Agent ID) của bạn")}</span>
          <input className="input t-input" value={name} onChange={(e) => setN(e.target.value)} placeholder={t("e.g. you.ai", "ví dụ you.ai")} spellCheck={false} autoCapitalize="none" autoComplete="off" maxLength={40} />
        </label>
        <div className="sw-btns">
          <button className="btn btn-primary t-button" onClick={savePng}><Download size={16} aria-hidden /> {t("Save image", "Lưu ảnh")}</button>
          <button className="btn btn-dark t-button" onClick={shareX}>{t("Share on X", "Chia sẻ lên X")}</button>
        </div>
      </div>
    </dialog>
  );
});
