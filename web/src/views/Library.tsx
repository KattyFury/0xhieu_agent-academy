import { useEffect, useState } from "react";
import type { Address } from "viem";
import { book001 } from "../book001";
import { book001Vi } from "../book001.vi";
import { useLang, useT } from "../i18n";
import { Cover, Nav } from "./Shell";

/** Library: a grid of small book cards (room for many books). A learner who already saved book 1 gets a certificate button. */
export default function Library({ wallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [certified, setCertified] = useState(false);
  useEffect(() => {
    if (!wallet) return;
    // Chain code loads only when needed (keeps the library light).
    import("../chain").then((m) => m.certificate(wallet, m.BOOK_ID)).then((c) => setCertified(c.ok)).catch(() => {});
  }, [wallet]);
  const remember = (e: React.MouseEvent<HTMLAnchorElement>) => { const r = e.currentTarget.querySelector(".cover")?.getBoundingClientRect(); if (r) sessionStorage.setItem("openFrom", JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height })); };
  const books = [{ id: 1, number: book001.number, cover: lang === "vi" ? book001Vi.title : book001.title, title: lang === "vi" ? book001Vi.title : book001.title,
    text: t("A course to learn and practice using Binance Agentic Wallet.", "Khóa học cho bạn tìm hiểu và tập sử dụng Binance Agentic Wallet.") }];

  return (
    <div className="page">
      <Nav active="library" />
      <main className="frame">
        <div className="page-head"><h1 className="t-page">{t("Library", "Thư viện")}</h1></div>
        <section className="bento">
          {books.map((b) => (
            <div key={b.id} className="tile book-card span-2">
              <a className="book-card-link" href={`/book/${b.id}/0`} onClick={remember} aria-label={b.title}>
                <span className="book-card-cover"><Cover number={b.number} title={b.cover} /></span>
                <span className="t-label kicker">{b.number}</span>
                <span className="t-header">{b.title}</span>
                <span className="t-secondary">{b.text}</span>
                <span className="t-secondary">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</span>
                <span className="btn btn-primary t-button">{t("Open the book", "Mở sách")}</span>
              </a>
              {certified && wallet && <a className="btn btn-ghost t-button" href={`/certificate/1/${wallet}`}>{t("Open certificate", "Mở chứng chỉ")}</a>}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
