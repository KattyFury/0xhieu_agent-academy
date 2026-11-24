import { useState, type ReactNode } from "react";
import type { Address } from "viem";
import { isAddr } from "../addr";
import { LangSwitch, useT } from "../i18n";
import { Award, BookOpen, type LucideIcon } from "lucide-react";

type Tab = "library" | "cert";

/** Web shell copied from 0xhieu.xyz: pill bar, cat icon, text tabs, active tab yellow with black text, VI/EN switch. No wallet in the bar. */
export function Nav({ active, banner }: { active?: Tab; banner?: ReactNode }) {
  const t = useT();
  // Phones show the icon only; the label stays for screen readers.
  const tab = (key: Tab, href: string, label: string, Icon: LucideIcon) => {
    const inner = <><Icon size={20} aria-hidden /><span className="bk-tab-label">{label}</span></>;
    return key === active
      ? <span className="bk-tab bk-tab-on t-button" aria-current="page">{inner}</span>
      : <a className="bk-tab t-button" href={href}>{inner}</a>;
  };
  return (
    <header className="bk-top">
      <nav className="bk-nav" aria-label="Main">
        <a className="bk-brand" href="/"><img className="bk-brand-icon" src="/icon.png" alt="" /><span className="t-header">Agent Academy</span></a>
        {banner}
        <div className="bk-nav-right">
          <div className="bk-tabs">
            {tab("library", "/library", t("Library", "Thư viện"), BookOpen)}
            {tab("cert", "/certificate", t("Certificate", "Chứng chỉ"), Award)}
          </div>
          <LangSwitch />
        </div>
      </nav>
    </header>
  );
}

/** Book cover drawn with DS tokens: black leather, banded spine, yellow frame; number on top, the book's icon, title, cat mark at the foot. Ratio 7:10. */
export function Cover({ number, title, icon: Icon }: { number: string; title: string; icon?: LucideIcon }) {
  return (
    <div className="cover" role="img" aria-label={`${number}: ${title}`}>
      <span className="cover-spine" aria-hidden />
      <span className="cover-frame" aria-hidden>
        <span className="t-label cover-num">{number}</span>
        {Icon && <span className="cover-mark"><Icon size={24} /></span>}
        <span className="t-header cover-title">{title}</span>
        <img className="cover-logo" src="/icon.png" alt="" />
      </span>
    </div>
  );
}

/** Progress is looked up by wallet address only (spec red line: never by .ai name). Saved in this browser. */
export function AddressForm({ wallet, setWallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const [v, setV] = useState(wallet ?? "");
  const [err, setErr] = useState(false);
  const save = () => { if (isAddr(v.trim())) { setWallet(v.trim() as Address); setErr(false); } else setErr(true); };
  return (
    <form className="address-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <input className="input t-input" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} placeholder={t("Your wallet address (0x…)", "Địa chỉ ví của bạn (0x…)")}
        aria-label={t("Wallet address", "Địa chỉ ví")} spellCheck={false} autoComplete="off" />
      <button className="btn btn-primary t-button" type="submit">{t("Show progress", "Xem tiến độ")}</button>
      {err && <p className="t-note" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{t("That doesn't look like a wallet address.", "Đây không giống địa chỉ ví.")}</p>}
    </form>
  );
}

