import { useEffect, useState } from "react";
import type { Address } from "viem";
import { Award, Check, ShieldCheck } from "lucide-react";
import { AddressForm, Nav } from "./Shell";
import { usePageTitles } from "./Library";
import { book001, pageCount } from "../book001";
import { book001Vi } from "../book001.vi";
import { ACADEMY, BSCSCAN, certificate, done, progressOf, short, type Progress } from "../chain";
import { useLang, useT } from "../i18n";
import { CopyBtn } from "./Onboard";

/** Certificate: pages recorded + certificate for one wallet address (never by .ai name). /certificate/0x… is the public share link. */
export default function Certificate({ wallet, setWallet, shared }: { wallet: Address | null; setWallet: (a: Address | null) => void; shared: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const titles = usePageTitles();
  const P = pageCount(book001);
  const title = lang === "vi" ? book001Vi.title : book001.title;
  const [p, setP] = useState<Progress | null>(null);
  const [c, setC] = useState<{ ok: boolean; issuedAt: number } | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    setP(null); setC(null); setErr(false);
    if (!wallet) return;
    Promise.all([progressOf(wallet, book001.id), certificate(wallet, book001.id)]).then(([pp, cc]) => { setP(pp); setC(cc); }).catch(() => setErr(true));
  }, [wallet]);
  const doneList = p ? titles.map((name, i) => ({ name, i })).filter(({ i }) => done(p.mask, i)) : [];
  const shareUrl = wallet ? `${location.origin}/certificate/${wallet}` : "";

  return (
    <div className="page">
      <Nav active="cert" />
      <main className="frame">
        <div className="page-head">
          <h1 className="t-page">{t("Certificate", "Chứng chỉ")}</h1>
          {wallet && !shared && <span className="t-secondary"><span className="t-data" translate="no">{short(wallet)}</span> · <button className="link t-label link-btn" onClick={() => setWallet(null)}>{t("change", "đổi")}</button></span>}
        </div>
        {!wallet ? (
          <section className="bento">
            <div className="tile span-2 address-tile">
              <h2 className="t-header">{t("Your progress lives on-chain", "Tiến độ của bạn nằm on-chain")}</h2>
              <p className="t-secondary">{t("Paste the wallet address your agent records with. We only read public data; nothing is sent.", "Dán địa chỉ ví mà agent dùng để ghi nhận. Chúng tôi chỉ đọc dữ liệu công khai, không gửi gì cả.")}</p>
              <AddressForm wallet={wallet} setWallet={setWallet} />
            </div>
          </section>
        ) : (
          <section className="bento">
            <article className="cert-board span-2">
              <div className="cert-paper">
                <span className="cert-seal" aria-hidden><Award size={28} /></span>
                <p className="t-label cert-kicker">{t("Certificate of completion", "Chứng chỉ hoàn thành")}</p>
                <h2 className="t-page">{title}</h2>
                <p className="t-secondary">Agent Academy, {book001.number}</p>
                <p className="t-data cert-wallet" translate="no">{wallet}</p>
                {err && <p className="t-secondary" role="status">{t("Can't reach BNB Chain right now. Try again in a minute.", "Chưa kết nối được BNB Chain. Thử lại sau một phút.")}</p>}
                {!err && !c && <p className="t-secondary" role="status">{t("Checking BNB Chain…", "Đang kiểm tra BNB Chain…")}</p>}
                {c && (c.ok ? <>
                  <p className="bk-recorded t-content cert-status"><ShieldCheck size={18} aria-hidden /> {t("Verified on-chain", "Đã xác minh on-chain")}</p>
                  <p className="t-secondary">{t("Issued", "Cấp ngày")} {new Date(c.issuedAt * 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                </> : <p className="t-content cert-status">{t(`Not issued yet: ${p?.count ?? 0} of ${P} pages recorded.`, `Chưa cấp: đã ghi ${p?.count ?? 0}/${P} trang.`)}</p>)}
                <p className="t-note cert-note">{t("Issued by the contract when every page is recorded from an Agent ID wallet. It does not certify professional skill. Not an NFT.",
                  "Hợp đồng cấp khi mọi trang được ghi nhận từ một ví Agent ID. Không xác nhận kỹ năng chuyên môn. Không phải NFT.")}</p>
                <div className="cert-actions">
                  <CopyBtn text={shareUrl} label={t("Copy share link", "Chép link chia sẻ")} />
                  <a className="btn btn-ghost t-button" href={`${BSCSCAN}/address/${ACADEMY}#readContract`} target="_blank" rel="noreferrer">{t("Verify on BscScan", "Xác minh trên BscScan")}</a>
                </div>
              </div>
            </article>
            <div className="tile span-2 contents">
              <h2 className="t-label contents-head">{t(`Pages done: ${doneList.length} of ${P}`, `Trang đã học: ${doneList.length}/${P}`)}</h2>
              {p && doneList.length === 0 && <p className="t-secondary">{t("No pages recorded yet.", "Chưa ghi nhận trang nào.")} <a className="link" href="/book/1/0">{t("Start Book 001", "Bắt đầu Book 001")}</a></p>}
              <ol>
                {doneList.map(({ name, i }) => (
                  <li key={i}><a className="contents-row" href={`/book/1/${i}`}>
                    <span className="t-data contents-no">{i + 1}</span>
                    <span className="t-content contents-title">{name}</span>
                    <span className="chip chip-done t-label"><Check size={14} aria-hidden /> {t("Done", "Đã học")}</span>
                  </a></li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
