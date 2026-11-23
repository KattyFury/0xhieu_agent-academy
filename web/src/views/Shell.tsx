import { useState, type ReactNode } from "react";
import type { Address } from "viem";
import { isAddr } from "../chain";
import { LangSwitch, useT } from "../i18n";

type Tab = "library" | "book" | "cert";

/** Web shell copied from 0xhieu.xyz: pill bar, cat icon, text tabs, active tab yellow with black text, VI/EN switch. No wallet in the bar. */
export function Nav({ active, banner }: { active?: Tab; banner?: ReactNode }) {
  const t = useT();
  const tab = (key: Tab, href: string, label: string) => key === active
    ? <span className="bk-tab bk-tab-on t-button" aria-current="page">{label}</span>
    : <a className="bk-tab t-button" href={href}>{label}</a>;
  return (
    <header className="bk-top">
      <nav className="bk-nav" aria-label="Main">
        <a className="bk-brand" href="/"><img className="bk-brand-icon" src="/icon.png" alt="" /><span className="t-header">Agent Academy</span></a>
        {banner}
        <div className="bk-nav-right">
          <div className="bk-tabs">
            {tab("library", "/library", t("Library", "Thư viện"))}
            {active === "book" && tab("book", "/book/1/0", "Book 001")}
            {tab("cert", "/certificate", t("Certificate", "Chứng chỉ"))}
          </div>
          <LangSwitch />
        </div>
      </nav>
    </header>
  );
}

/** Book cover drawn with DS tokens: black leather, yellow title and frame. Ratio 7:10. */
export function Cover({ number, title, muted = false }: { number: string; title: string; muted?: boolean }) {
  return (
    <div className={`cover ${muted ? "cover-muted" : ""}`} role="img" aria-label={`${number}: ${title}`}>
      <span className="cover-spine" aria-hidden />
      <span className="cover-frame" aria-hidden>
        <span className="t-label">{number}</span>
        <span className={muted ? "t-label" : "t-header cover-title"}>{title}</span>
        {!muted && <span className="t-label">Agent Academy</span>}
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
      <input className="input t-input" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} placeholder={t("Your agent wallet address (0x…)", "Địa chỉ ví agent của bạn (0x…)")}
        aria-label={t("Agent wallet address", "Địa chỉ ví agent")} spellCheck={false} autoComplete="off" />
      <button className="btn btn-primary t-button" type="submit">{t("Show progress", "Xem tiến độ")}</button>
      {err && <p className="t-note" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{t("That doesn't look like a wallet address.", "Đây không giống địa chỉ ví.")}</p>}
    </form>
  );
}

