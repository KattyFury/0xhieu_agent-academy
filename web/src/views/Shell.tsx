import { useState, type ReactNode } from "react";
import type { Address } from "viem";
import { isAddr } from "../addr";
import { LangSwitch, useT } from "../i18n";

type Tab = "library" | "cert";

/** Swiss header: cat icon + name on the left, text links + EN / VI on the right, one black rule below. Active link = yellow underline bar. */
export function Nav({ active, banner }: { active?: Tab; banner?: ReactNode }) {
  const t = useT();
  const tab = (key: Tab, href: string, label: string) =>
    key === active ? <span className="sw-link on" aria-current="page">{label}</span> : <a className="sw-link" href={href}>{label}</a>;
  return (
    <header className="sw-head">
      <nav className="sw-wrap sw-head-in" aria-label="Main">
        <a className="sw-logo" href="/"><img src="/icon.png" alt="" /><span>Agent Academy</span></a>
        {banner}
        <div className="sw-head-right">
          {tab("library", "/courses", t("Courses", "Khóa học"))}
          {tab("cert", "/certificate", t("Certificate", "Chứng chỉ"))}
          <LangSwitch />
        </div>
      </nav>
    </header>
  );
}

/** Small uppercase tracked label (Swiss). */
export const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => <span className={`sw-label ${className}`}>{children}</span>;

/** 01, 02 … */
export const two = (n: number) => String(n).padStart(2, "0");

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
      <button className="btn btn-dark t-button" type="submit">{t("Show progress", "Xem tiến độ")}</button>
      {err && <p className="t-note sw-err" role="alert">{t("That doesn't look like a wallet address.", "Đây không giống địa chỉ ví.")}</p>}
    </form>
  );
}
