import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Nav, two } from "./Shell";
import { bookById } from "../books";
import { useLang, useT } from "../i18n";

type Data = { updatedAt: number; wallets: number; list: { address: string; courses: (boolean | null)[] }[]; courses: { id: number; joined: number; finished: number }[] };

/** /status: how many different Agent ID wallets have saved progress on-chain (from /api/status). */
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
        <div className="st-head">
          <h1 className="sw-heading">{t("Status", "Thống kê")}</h1>
          {d && d.updatedAt > 0 && <p className="t-note">{t("Updated", "Cập nhật")} {new Date(d.updatedAt).toLocaleString(lang === "vi" ? "vi-VN" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>}
        </div>
        {!d && <p className="t-content sw-grey" role="status">{err ? t("Can't check right now. Try again in a minute.", "Chưa kiểm tra được. Thử lại sau một phút.") : t("Checking…", "Đang kiểm tra…")}</p>}
        {d && <>
          <ul className="st-stats">
            <li>
              <span className="sw-big">{d.wallets}</span>
              <h2 className="t-header">{t("Wallets joined", "Ví tham gia")}</h2>
              <p className="t-secondary">{t("Different Agent ID wallets that saved on-chain.", "Số ví Agent ID khác nhau đã lưu on-chain.")}</p>
            </li>
            {d.courses.map((c, i) => (
              <li key={c.id}>
                <span className="sw-big">{c.finished}</span>
                <h2 className="t-header">{t("Certificates, course", "Chứng chỉ khóa")} {i + 1}</h2>
                <p className="t-secondary">{bookById(c.id).title[lang]}</p>
              </li>
            ))}
          </ul>
          <div className="st-list">
            <table className="bk-table">
              <thead><tr><th>#</th><th>{t("Wallet", "Ví")}</th>{d.courses.map((c, i) => <th key={c.id} className="st-col">{t("Course", "Khóa")} {i + 1}</th>)}</tr></thead>
              <tbody>{d.list.map((w, n) => (
                <tr key={w.address}>
                  <td className="st-n">{two(n + 1)}</td>
                  <td translate="no"><a className="st-addr" href={`https://bscscan.com/address/${w.address}`} target="_blank" rel="noreferrer" title={w.address}>
                    <span className="st-full">{w.address}</span><span className="st-short">{w.address.slice(0, 6)}…{w.address.slice(-4)}</span></a></td>
                  {w.courses.map((done, i) => (
                    <td key={i} className="st-col">{done
                      ? <span className="st-mark" role="img" aria-label={t("Certificate", "Chứng chỉ")}><Check size={16} aria-hidden /></span>
                      : done === false ? t("Joined", "Đã vào") : "—"}</td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>}
      </main>
    </div>
  );
}
