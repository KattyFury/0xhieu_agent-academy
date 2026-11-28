import { useEffect, useState } from "react";
import type { Address } from "viem";
import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import { AddressForm, Nav, two } from "./Shell";
import { BOOKS, bookById, type BookMeta } from "../books";
import { ACADEMY, BOOK_PAGES, BSCSCAN, certificate, progressOf, savedPages, short, type Progress } from "../chain";
import { useLang, useT } from "../i18n";
import { CopyButton } from "./Pages";
import { CertArt, useCertPng } from "./CertArt";

function useBook(wallet: Address | null, chainId: number) {
  const [p, setP] = useState<Progress | null>(null);
  const [c, setC] = useState<{ ok: boolean; issuedAt: number } | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    setP(null); setC(null); setErr(false);
    if (!wallet) return;
    Promise.all([progressOf(wallet, chainId), certificate(wallet, chainId)]).then(([pp, cc]) => { setP(pp); setC(cc); }).catch(() => setErr(true));
  }, [wallet, chainId]);
  return { p, c, err };
}

/** /certificate: one row per book (Swiss). How a book checks progress is that book's own business (book #1: its wallet address). */
export function CertificateList({ wallet, setWallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  return (
    <div className="page">
      <Nav active="cert" />
      <main className="sw-wrap">
        <h1 className="sw-title">{t("Certificate", "Chứng chỉ")}</h1>
        {!wallet && <div className="sw-sec"><span className="sw-label">{t("Check your progress", "Xem tiến độ")}</span>
          <div className="sw-stack"><p className="t-content sw-measure">{t("This course is checked with the wallet you studied with.", "Khóa học này kiểm tra bằng ví bạn dùng để học.")}</p><AddressForm wallet={wallet} setWallet={setWallet} /></div></div>}
        <ul className="sw-lib">{BOOKS.map((b, i) => <CertRow key={b.id} book={b} i={i} wallet={wallet} setWallet={setWallet} />)}</ul>
      </main>
    </div>
  );
}

function CertRow({ book, i, wallet, setWallet }: { book: BookMeta; i: number; wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const { p, c, err } = useBook(wallet, book.chainId);
  return (
    <li>
      <span className="sw-big">{two(i + 1)}</span>
      <h2 className="sw-lib-title">{book.title[lang]}</h2>
      <div className="sw-lib-text">
        {!wallet ? <p className="t-content sw-grey">{t("12 pages", "12 trang")}</p> : <>
          <p className="t-data" translate="no">{short(wallet)}</p>
          {err && <p className="t-content sw-grey">{t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.")}</p>}
          {!err && !c && <p className="t-content sw-grey">{t("Checking…", "Đang kiểm tra…")}</p>}
          {c && !c.ok && <p className="t-content">{t(`${p ? savedPages(p.mask) : 0} of ${BOOK_PAGES} pages done.`, `Đã học ${p ? savedPages(p.mask) : 0}/${BOOK_PAGES} trang.`)}</p>}
        </>}
      </div>
      <div className="sw-lib-meta">
        {c?.ok && <span className="sw-chip sw-chip-on"><ShieldCheck size={12} aria-hidden /> {t("Certificate issued", "Đã cấp chứng chỉ")}</span>}
        {wallet && <div className="sw-btns">
          <a className="btn btn-primary t-button" href={`/certificate/${book.id}/${wallet}`}>{t("View certificate", "Xem chứng chỉ")} <ArrowRight size={16} aria-hidden /></a>
        </div>}
        {wallet && <button className="sw-textlink" onClick={() => setWallet(null)}>{t("Use another wallet", "Dùng ví khác")}</button>}
      </div>
    </li>
  );
}

/** /certificate/<book>/0x…: the full certificate of one book for one wallet (public share link). */
export default function Certificate({ wallet, bookId }: { wallet: Address; bookId: number }) {
  const t = useT();
  const { lang } = useLang();
  const book = bookById(bookId);
  const title = book.title[lang];
  const { p, c, err } = useBook(wallet, book.chainId);
  // Optional name, same rule as the popup: any text, never verified. Shown on this device only (never in the share link); the address is the proof.
  const [name, setName] = useState(() => localStorage.getItem("academy.agentid") ?? "");
  const [edit, setEdit] = useState("");
  const shown = name.trim() || short(wallet);
  const png = useCertPng();
  const saveName = () => { const v = edit.trim(); if (v) { localStorage.setItem("academy.agentid", v); setName(v); setEdit(""); } };

  return (
    <div className="page">
      <Nav active="cert" />
      <main className="sw-wrap">
        {c?.ok ? <div className="cert-page"><CertArt book={book} name={shown} wallet={wallet} issuedAt={c.issuedAt} /></div> : (
          <section className="sw-sec">
            <span className="sw-label">{t("Certificate", "Chứng chỉ")} · {book.number}</span>
            <div className="sw-stack">
              <h1 className="sw-heading">{title}</h1>
              <div className="bk-field"><span className="t-label">{t("Wallet", "Ví")}</span><p className="t-data sw-break" translate="no">{wallet}</p></div>
              {err && <p className="t-content sw-grey" role="status">{t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.")}</p>}
              {!err && !c && <p className="t-content sw-grey" role="status">{t("Checking…", "Đang kiểm tra…")}</p>}
              {c && <p className="t-content">{t(`Not issued yet: ${p ? savedPages(p.mask) : 0} of ${BOOK_PAGES} pages done.`, `Chưa cấp: đã học ${p ? savedPages(p.mask) : 0}/${BOOK_PAGES} trang.`)}</p>}
              {c && <p className="t-content sw-grey">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</p>}
              {c && <a className="btn btn-dark t-button" href={`/course/${book.id}/0`}>{t("Open the course", "Mở khóa học")} <ArrowRight size={16} aria-hidden /></a>}
            </div>
          </section>
        )}
        {c?.ok && <div className="cert-tools">
          <p className="bk-recorded t-content bk-status"><ShieldCheck size={16} aria-hidden /> {t("Verified on-chain", "Đã xác minh on-chain")}</p>
          {!name && <form className="address-form" onSubmit={(e) => { e.preventDefault(); saveName(); }}>
            <input className="input t-input" aria-label={t("Your name or Agent ID", "Tên hoặc Agent ID của bạn")} placeholder={t("Your name, e.g. you.ai", "Tên của bạn, ví dụ ban.ai")} value={edit} onChange={(e) => setEdit(e.target.value)} maxLength={40} spellCheck={false} autoCapitalize="none" />
            <button className="btn btn-dark t-button" type="submit">{t("Add my name", "Thêm tên")}</button>
          </form>}
          {name && <button className="sw-textlink" onClick={() => { localStorage.removeItem("academy.agentid"); setName(""); }}>{t("Remove name", "Xoá tên")}</button>}
          {(name || edit) && <p className="t-note">{t("The name shows on this device only. The wallet address is the proof.", "Tên chỉ hiện trên máy này. Địa chỉ ví mới là bằng chứng.")}</p>}
          <div className="sw-btns">
            <button className="btn btn-primary t-button" onClick={() => png(book, shown, wallet, c.issuedAt)}><Download size={16} aria-hidden /> {t("Download", "Tải ảnh")}</button>
            <CopyButton text={`${location.origin}/certificate/${book.id}/${wallet}`} label={t("Copy share link", "Chép link chia sẻ")} />
            <a className="btn btn-dark t-button" href={`${BSCSCAN}/address/${ACADEMY}#readContract`} target="_blank" rel="noreferrer"><ShieldCheck size={16} aria-hidden /> {t("Verify on BscScan", "Xác minh trên BscScan")}</a>
          </div>
        </div>}
      </main>
    </div>
  );
}
