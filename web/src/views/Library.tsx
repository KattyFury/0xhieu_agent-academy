import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import type { Address } from "viem";
import { BOOKS } from "../books";
import { useLang, useT } from "../i18n";
import { Cover, Nav } from "./Shell";

/** Library: a grid of small book cards (room for many books). A book the learner already finished gets a certificate button. */
export default function Library({ wallet }: { wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [certified, setCertified] = useState<Record<number, boolean>>({});
  useEffect(() => {
    if (!wallet) return;
    // Chain code loads only when needed (keeps the library light).
    import("../chain").then((m) => Promise.all(BOOKS.map((b) => m.certificate(wallet, b.chainId).then((c) => [b.id, c.ok] as const))))
      .then((r) => setCertified(Object.fromEntries(r))).catch(() => {});
  }, [wallet]);
  const remember = (e: React.MouseEvent<HTMLAnchorElement>) => { const c = e.currentTarget.closest(".book-card")?.querySelector(".cover"), r = c?.getBoundingClientRect(); if (r) sessionStorage.setItem("openFrom", JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height, html: c!.innerHTML })); };

  return (
    <div className="page">
      <Nav active="library" />
      <main className="frame">
        <div className="page-head"><h1 className="t-page">{t("Library", "Thư viện")}</h1></div>
        <section className="bento">
          {BOOKS.map((b) => (
            <div key={b.id} className="tile book-card span-2">
              <a className="book-card-link" href={`/book/${b.id}/0`} onClick={remember} aria-label={b.title[lang]}>
                <span className="book-card-cover"><Cover number={b.number} title={b.title[lang]} icon={b.icon} /></span>
                <span className="t-label kicker">{b.number}</span>
                <span className="t-header">{b.title[lang]}</span>
                <span className="t-secondary">{b.blurb[lang]}</span>
                <span className="t-secondary">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</span>
              </a>
              <div className="actions book-card-actions">
                <a className="btn btn-primary t-button" href={`/book/${b.id}/0`} onClick={remember}>{t("Open the book", "Mở sách")}</a>
                {certified[b.id] && wallet && <a className="btn btn-ghost btn-round" href={`/certificate/${b.id}/${wallet}`} aria-label={t("Open certificate", "Mở chứng chỉ")} title={t("Open certificate", "Mở chứng chỉ")}><Award size={20} aria-hidden /></a>}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
