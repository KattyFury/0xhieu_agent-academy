import { useEffect, useState } from "react";
import { Nav } from "./Shell";
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
      <main className="sw-wrap st">
        <h1 className="sw-label">{t("Status", "Thống kê")}</h1>
        {!d && <p className="t-content sw-grey" role="status">{err ? t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.") : t("Checking…", "Đang kiểm tra…")}</p>}
        {d && <>
          <div className="st-total">
            <p className="sw-hero-title">{d.wallets}</p>
            <p className="t-content sw-measure">{t("Different Agent ID wallets that saved progress on-chain.", "Số ví Agent ID khác nhau đã lưu tiến độ on-chain.")}</p>
          </div>
          <table className="bk-table">
            <thead><tr><th>{t("Course", "Khóa học")}</th><th className="bk-num">{t("Wallets", "Số ví")}</th><th className="bk-num">{t("Certificates", "Chứng chỉ")}</th></tr></thead>
            <tbody>{d.courses.map((c) => (
              <tr key={c.id}><td>{bookById(c.id).title[lang]}</td><td className="bk-num">{c.joined}</td><td className="bk-num">{c.finished}</td></tr>
            ))}</tbody>
          </table>
          {d.updatedAt > 0 && <p className="t-note">{t("Updated", "Cập nhật")} {new Date(d.updatedAt).toLocaleString(lang === "vi" ? "vi-VN" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>}
        </>}
      </main>
    </div>
  );
}
