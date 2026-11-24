import { useEffect, useState } from "react";
import { ArrowRight, Award, Check } from "lucide-react";
import type { Address } from "viem";
import { BOOKS } from "../books";
import { useLang, useT } from "../i18n";
import { Nav, two } from "./Shell";

/** Courses page (Swiss; file name kept): one row per course — big number, title, text, then chips + buttons. A finished book gets a "Certified" chip and a certificate button. */
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

  return (
    <div className="page">
      <Nav active="library" />
      <main className="sw-wrap">
        <h1 className="sw-title">{t("Courses", "Khóa học")}</h1>
        <ul className="sw-lib">
          {BOOKS.map((b, i) => (
            <li key={b.id}>
              <span className="sw-big">{two(i + 1)}</span>
              <h2 className="sw-lib-title">{b.title[lang]}</h2>
              <div className="sw-lib-text">
                <p className="t-content">{b.blurb[lang]}</p>
                <p className="t-content">{t("Complete the course to get the certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</p>
              </div>
              <div className="sw-lib-meta">
                <div className="sw-chips">
                  <span className="sw-chip">{t("12 pages", "12 trang")}</span>
                  {certified[b.id] && <span className="sw-chip sw-chip-on"><Check size={12} aria-hidden /> {t("Certified", "Đã có chứng chỉ")}</span>}
                </div>
                <div className="sw-btns">
                  <a className="btn btn-dark t-button" href={`/course/${b.id}/0`}>{t("Open the course", "Mở khóa học")} <ArrowRight size={16} aria-hidden /></a>
                  {certified[b.id] && wallet && <a className="btn btn-primary btn-sq" href={`/certificate/${b.id}/${wallet}`} aria-label={t("Open certificate", "Mở chứng chỉ")} title={t("Open certificate", "Mở chứng chỉ")}><Award size={20} aria-hidden /></a>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
