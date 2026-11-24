import { useEffect, useState } from "react";
import type { Address } from "viem";
import { Award, ShieldCheck } from "lucide-react";
import { AddressForm, Nav } from "./Shell";
import { book001 } from "../book001";
import { book001Vi } from "../book001.vi";
import { ACADEMY, BOOK_ID, BOOK_PAGES, BSCSCAN, certificate, progressOf, savedPages, short, type Progress } from "../chain";
import { useLang, useT } from "../i18n";
import { CopyButton } from "./Pages";

function useBook1(wallet: Address | null) {
  const [p, setP] = useState<Progress | null>(null);
  const [c, setC] = useState<{ ok: boolean; issuedAt: number } | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    setP(null); setC(null); setErr(false);
    if (!wallet) return;
    Promise.all([progressOf(wallet, BOOK_ID), certificate(wallet, BOOK_ID)]).then(([pp, cc]) => { setP(pp); setC(cc); }).catch(() => setErr(true));
  }, [wallet]);
  return { p, c, err };
}

/** /certificate: one small card per book. How a book checks progress is that book's own business (book #1: its wallet address). */
export function CertificateList({ wallet, setWallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const { p, c, err } = useBook1(wallet);
  return (
    <div className="page">
      <Nav active="cert" />
      <main className="frame">
        <div className="page-head"><h1 className="t-page">{t("Certificate", "Chứng chỉ")}</h1></div>
        <section className="bento">
          <div className="tile cert-card span-2">
            <span className="cert-seal" aria-hidden><Award size={28} /></span>
            <span className="t-label kicker">{book001.number}</span>
            <span className="t-header">{lang === "vi" ? book001Vi.title : book001.title}</span>
            {!wallet ? <>
              <span className="t-secondary">{t("This course is checked with the wallet you studied with.", "Khóa học này kiểm tra bằng ví bạn dùng để học.")}</span>
              <AddressForm wallet={wallet} setWallet={setWallet} />
            </> : <>
              <span className="t-data" translate="no">{short(wallet)}</span>
              {err && <span className="t-secondary">{t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.")}</span>}
              {!err && !c && <span className="t-secondary">{t("Checking…", "Đang kiểm tra…")}</span>}
              {c && (c.ok
                ? <span className="bk-recorded t-content cert-status"><ShieldCheck size={18} aria-hidden /> {t("Certificate issued", "Đã cấp chứng chỉ")}</span>
                : <span className="t-secondary">{t(`${p ? savedPages(p.mask) : 0} of ${BOOK_PAGES} pages done.`, `Đã học ${p ? savedPages(p.mask) : 0}/${BOOK_PAGES} trang.`)}</span>)}
              <a className="btn btn-primary t-button" href={`/certificate/1/${wallet}`}>{t("View certificate", "Xem chứng chỉ")}</a>
              <button className="link t-label link-btn" onClick={() => setWallet(null)}>{t("Use another wallet", "Dùng ví khác")}</button>
            </>}
          </div>
        </section>
      </main>
    </div>
  );
}

/** /certificate/1/0x…: the full certificate of book #1 for one wallet (public share link). */
export default function Certificate({ wallet }: { wallet: Address }) {
  const t = useT();
  const { lang } = useLang();
  const title = lang === "vi" ? book001Vi.title : book001.title;
  const { p, c, err } = useBook1(wallet);
  // Optional: the learner types their own Agent ID. Shown on this device only (never in the share link), so it can't label anyone else's certificate; the address is the proof.
  const [name, setName] = useState(() => localStorage.getItem("academy.agentid") ?? "");
  const [edit, setEdit] = useState("");
  const valid = /^[a-z0-9-]{1,63}\.ai$/i.test(name);
  const saveName = () => { const v = edit.trim().toLowerCase(); if (/^[a-z0-9-]{1,63}\.ai$/.test(v)) { localStorage.setItem("academy.agentid", v); setName(v); setEdit(""); } };

  return (
    <div className="page">
      <Nav active="cert" />
      <main className="frame">
        <div className="page-head"><h1 className="t-page">{t("Certificate", "Chứng chỉ")}</h1></div>
        <section className="bento">
          <article className="cert-board cert-full">
            <div className="cert-paper">
              <span className="cert-seal" aria-hidden><Award size={28} /></span>
              <p className="t-label cert-kicker">{t("Certificate of completion", "Chứng chỉ hoàn thành")}</p>
              <h2 className="t-page">{title}</h2>
              <p className="t-secondary">Agent Academy, {book001.number}</p>
              {valid && <p className="t-header" translate="no">{name}</p>}
              <p className="t-data cert-wallet" translate="no">{wallet}</p>
              {err && <p className="t-secondary" role="status">{t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.")}</p>}
              {!err && !c && <p className="t-secondary" role="status">{t("Checking…", "Đang kiểm tra…")}</p>}
              {c && (c.ok ? <>
                <p className="bk-recorded t-content cert-status"><ShieldCheck size={18} aria-hidden /> {t("Verified on-chain", "Đã xác minh on-chain")}</p>
                <p className="t-secondary">{t("Issued", "Cấp ngày")} {new Date(c.issuedAt * 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </> : <p className="t-content cert-status">{t(`Not issued yet: ${p ? savedPages(p.mask) : 0} of ${BOOK_PAGES} pages done.`, `Chưa cấp: đã học ${p ? savedPages(p.mask) : 0}/${BOOK_PAGES} trang.`)}</p>)}
              {c && !c.ok && <p className="t-note cert-note">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</p>}
              {!valid && <form className="cert-actions" onSubmit={(e) => { e.preventDefault(); saveName(); }}>
                <input className="input t-input" aria-label={t("Your Agent ID", "Agent ID của bạn")} placeholder={t("Agent ID, e.g. you.ai", "Agent ID, ví dụ ban.ai")} value={edit} onChange={(e) => setEdit(e.target.value)} spellCheck={false} autoCapitalize="none" />
                <button className="btn btn-ghost t-button" type="submit">{t("Add my name", "Thêm tên")}</button>
              </form>}
              {valid && <button className="link t-label link-btn" onClick={() => { localStorage.removeItem("academy.agentid"); setName(""); }}>{t("Remove name", "Xoá tên")}</button>}
              <p className="t-note cert-note">{valid || edit ? t("The name shows on this device only. The wallet address is the proof.", "Tên chỉ hiện trên máy này. Địa chỉ ví mới là bằng chứng.") : ""}</p>
              <div className="cert-actions">
                <CopyButton text={`${location.origin}/certificate/1/${wallet}`} label={t("Copy share link", "Chép link chia sẻ")} />
                <a className="btn btn-ghost t-button" href={`${BSCSCAN}/address/${ACADEMY}#readContract`} target="_blank" rel="noreferrer">{t("Verify on BscScan", "Xác minh trên BscScan")}</a>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
