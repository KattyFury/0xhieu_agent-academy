import { useEffect, useState } from "react";
import { Nav, two } from "./Shell";
import { bookById } from "../books";
import { useLang, useT } from "../i18n";

type Data = { updatedAt: number; wallets: number; courses: { id: number; joined: number; finished: number }[] };

/** /status: how many different Agent ID wallets have saved progress on-chain (totals only, from /api/status). */
export default function Status() {
  const t = useT();
  const { lang } = useLang();
  const [d, setD] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    const load = () => fetch("/api/status")
      .then((r) => (r.ok ? (r.json() as Promise<Data>) : Promise.reject()))
      .then((x) => { setD(x); setErr(false); })
      .catch(() => setErr(true));
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="page">
      <Nav />
      <main className="sw-wrap">
        <h1 className="sw-title">{t("Status", "Thống kê")}</h1>
        {!d && <p className="t-content sw-grey" role="status">{err ? t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.") : t("Checking…", "Đang kiểm tra…")}</p>}
        {d && <>
          <section className="sw-sec">
            <span className="sw-label">{t("Joined", "Đã tham gia")}</span>
            <div className="sw-stack">
              <p className="sw-hero-title">{d.wallets}</p>
              <p className="t-content sw-measure">{t("Different Agent ID wallets that saved progress on-chain.", "Số ví Agent ID khác nhau đã lưu tiến độ on-chain.")}</p>
              {d.updatedAt > 0 && <p className="t-note">{t("Updated", "Cập nhật")} {new Date(d.updatedAt).toLocaleString(lang === "vi" ? "vi-VN" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>}
            </div>
          </section>
          <ul className="sw-lib">{d.courses.map((c, i) => (
            <li key={c.id}>
              <span className="sw-big">{two(i + 1)}</span>
              <h2 className="sw-lib-title">{bookById(c.id).title[lang]}</h2>
              <div className="sw-lib-text"><p className="t-content">{t(`Wallets joined: ${c.joined}`, `Ví tham gia: ${c.joined}`)}</p></div>
              <div className="sw-lib-meta"><p className="t-content">{t(`Certificates: ${c.finished}`, `Chứng chỉ: ${c.finished}`)}</p></div>
            </li>
          ))}</ul>
        </>}
      </main>
    </div>
  );
}
