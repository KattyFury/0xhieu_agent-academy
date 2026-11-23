import type { Address } from "viem";
import { book001, dayAt, pageCount } from "../book001";
import { book001Vi, localDay } from "../book001.vi";
import { useLang, useT } from "../i18n";
import { Cover, Nav } from "./Shell";

/** Chapter titles of book #1 in reading order (chapters 2-3 are the setup spreads). */
export function usePageTitles() {
  const t = useT();
  const { lang } = useLang();
  const setup: Record<number, string> = { 1: t("From zero to signed in", "Từ số 0 đến đăng nhập"), 2: t("Gas and Developer Mode", "Gas và Developer Mode") };
  return [...Array(pageCount(book001)).keys()].map((p) => setup[p] ?? localDay(dayAt(book001, p)!, lang).title);
}

/** Library: a grid of small book cards (room for many books). Progress lives inside each book, not here. */
export default function Library(_: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const remember = (e: React.MouseEvent<HTMLAnchorElement>) => { const r = e.currentTarget.querySelector(".cover")?.getBoundingClientRect(); if (r) sessionStorage.setItem("openFrom", JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height })); };
  const books = [{ id: 1, number: book001.number, cover: lang === "vi" ? book001Vi.title : book001.title, title: "Learn Binance Agentic Wallet",
    text: t("A course to learn and practice using Binance Agentic Wallet.", "Khóa học cho bạn tìm hiểu và tập sử dụng Binance Agentic Wallet.") }];

  return (
    <div className="page">
      <Nav active="library" />
      <main className="frame">
        <div className="page-head"><h1 className="t-page">{t("Library", "Thư viện")}</h1></div>
        <section className="bento">
          {books.map((b) => (
            <a key={b.id} className="tile book-card span-2" href={`/book/${b.id}/0`} onClick={remember} aria-label={b.title}>
              <span className="book-card-cover"><Cover number={b.number} title={b.cover} /></span>
              <span className="t-label kicker">{b.number}</span>
              <span className="t-header">{b.title}</span>
              <span className="t-secondary">{b.text}</span>
              <span className="t-secondary">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</span>
              <span className="btn btn-primary t-button">{t("Open the book", "Mở sách")}</span>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}
