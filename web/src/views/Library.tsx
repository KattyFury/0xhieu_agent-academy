import { useEffect, useState } from "react";
import type { Address } from "viem";
import { Check } from "lucide-react";
import { book001, pageCount, pagesOf } from "../book001";
import { book001Vi, localDay } from "../book001.vi";
import { done, progressOf, short, type Progress } from "../chain";
import { useLang, useT } from "../i18n";
import { AddressForm, Cover, Nav } from "./Shell";

/** Page titles in reading order (page 0 = Get ready). */
export function usePageTitles() {
  const t = useT();
  const { lang } = useLang();
  return [t("Get ready: your Agent ID and agent", "Chuẩn bị: Agent ID và agent"), t("Get ready: gas and Developer Mode", "Chuẩn bị: gas và Developer Mode"), ...book001.days.map((d) => localDay(d, lang).title)];
}

/** Library: every book with its contents; each page shows New or Done for the saved wallet address. */
export default function Library({ wallet, setWallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const title = lang === "vi" ? book001Vi.title : book001.title;
  const titles = usePageTitles();
  const P = pageCount(book001);
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => { setP(null); if (wallet) progressOf(wallet, book001.id).then(setP).catch(() => setP(null)); }, [wallet]);
  const isDone = (i: number) => !!p && done(p.mask, i);
  const next = [...Array(P).keys()].find((i) => !isDone(i)) ?? 0;
  const remember = (e: React.MouseEvent<HTMLAnchorElement>) => { const r = e.currentTarget.querySelector(".cover")?.getBoundingClientRect(); if (r) sessionStorage.setItem("openFrom", JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height })); };

  return (
    <div className="page">
      <Nav active="library" />
      <main className="frame">
        <div className="page-head">
          <h1 className="t-page">{t("Library", "Thư viện")}</h1>
          {wallet && <span className="t-secondary">{t("Progress for", "Tiến độ của")} <span className="t-data" translate="no">{short(wallet)}</span> · <button className="link t-label link-btn" onClick={() => setWallet(null)}>{t("change", "đổi")}</button></span>}
        </div>
        <section className="bento">
          <a className="tile shelf-book span-2" href={`/book/1/${next}`} onClick={remember} aria-label={title}>
            <Cover number={book001.number} title={title} />
            <span className="shelf-info">
              <span className="t-label kicker">{book001.number}</span>
              <span className="t-header">Binance Agentic Wallet</span>
              <span className="t-secondary">{t("A course to learn and practice using Binance Agentic Wallet.", "Khóa học cho bạn tìm hiểu và tập sử dụng Binance Agentic Wallet.")}</span>
              <span className="t-secondary">{t("Finish the course to earn the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</span>
              <span className="btn btn-primary t-button">{t("Open the book", "Mở sách")}</span>
            </span>
          </a>
          <div className="tile span-2 contents">
            <h2 className="t-label contents-head">{t("Contents", "Mục lục")}</h2>
            <ol>
              {titles.map((name, i) => (
                <li key={i}>
                  <a className="contents-row" href={`/book/1/${i}`}>
                    <span className="t-data contents-no">{pagesOf(i)}</span>
                    <span className="t-content contents-title">{name}</span>
                    {p && (isDone(i)
                      ? <span className="chip chip-done t-label"><Check size={14} aria-hidden /> {t("Done", "Đã học")}</span>
                      : <span className="chip chip-accent t-label">{t("New", "Mới")}</span>)}
                  </a>
                </li>
              ))}
            </ol>
            {!wallet && <div className="contents-foot"><p className="t-secondary">{t("Paste your wallet address to see which lessons you have done.", "Dán địa chỉ ví để xem bạn đã học bài nào.")}</p><AddressForm wallet={wallet} setWallet={setWallet} /></div>}
          </div>
        </section>
      </main>
    </div>
  );
}
