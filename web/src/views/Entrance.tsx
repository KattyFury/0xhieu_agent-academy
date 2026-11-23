import type { Address } from "viem";
import { ArrowRight, Award, BookOpen, Link2, Terminal } from "lucide-react";
import { book001, pageCount } from "../book001";
import { book001Vi } from "../book001.vi";
import { useLang, useT } from "../i18n";
import { Cover, Footer, Nav } from "./Shell";

/** Landing: what Agent Academy is. Yellow tile = Library, black tile = Certificate (like 0xhieu.xyz's yellow + dark tiles). */
export default function Entrance(_: { wallet: Address | null }) {
  const t = useT();
  const { lang } = useLang();
  const title = lang === "vi" ? book001Vi.title : book001.title;
  const steps = [
    { icon: <BookOpen size={20} />, title: t("Read", "Đọc"), text: t("Each page teaches one idea in plain words.", "Mỗi trang dạy một ý, lời đơn giản.") },
    { icon: <Terminal size={20} />, title: t("Practice", "Thực hành"), text: t("Paste a read-only prompt into your own agent and see real wallet data.", "Dán prompt chỉ-đọc vào agent của bạn và xem dữ liệu ví thật.") },
    { icon: <Link2 size={20} />, title: t("Record", "Ghi nhận"), text: t("Your agent records the page on BNB Chain after you confirm. You only pay a tiny gas fee.", "Agent ghi trang lên BNB Chain sau khi bạn xác nhận. Bạn chỉ trả phí gas rất nhỏ.") },
    { icon: <Award size={20} />, title: t("Earn", "Nhận"), text: t("Record every page of a book and the contract issues your certificate.", "Ghi đủ mọi trang của sách, hợp đồng cấp chứng chỉ cho bạn.") },
  ];

  return (
    <div className="page">
      <Nav />
      <main className="frame">
        <section className="bento">
          <div className="tile hero span-2">
            <p className="t-label kicker">Agent Academy</p>
            <h1 className="t-hero">{t("Learn by doing.", "Học bằng cách làm.")}</h1>
            <p className="t-content measure"><strong>Learn Binance Agentic Wallet. Earn Certificates.</strong>{" "}
              {t("Agent Academy is a library of short books about AI agents. Every page has a hands-on task you run with your own agent, and your progress lives on BNB Chain.",
                "Agent Academy là thư viện những cuốn sách ngắn về AI agent. Mỗi trang có một việc thực hành bạn làm cùng agent của mình, và tiến độ được lưu trên BNB Chain.")}</p>
            <div className="actions">
              <a className="btn btn-primary t-button" href="/book/1/0">{t("Start Book 001", "Bắt đầu Book 001")}</a>
              <a className="btn btn-ghost t-button" href="/library">{t("Browse the library", "Xem thư viện")}</a>
            </div>
          </div>
          <a className="tile tile-accent door" href="/library">
            <span className="door-head"><span className="t-header">{t("Library", "Thư viện")}</span><ArrowRight size={20} aria-hidden /></span>
            <span className="door-cover"><Cover number={book001.number} title={title} /></span>
            <span className="t-secondary">{t(`1 book, ${pageCount(book001)} pages. See new pages and the ones you have done.`, `1 cuốn, ${pageCount(book001)} trang. Xem trang mới và trang bạn đã học.`)}</span>
          </a>
          <a className="tile tile-dark door" href="/certificate">
            <span className="door-head"><span className="t-header">{t("Certificate", "Chứng chỉ")}</span><ArrowRight size={20} aria-hidden /></span>
            <span className="t-display">{t("On-chain", "On-chain")}</span>
            <span className="t-secondary">{t("See the pages you have recorded and your certificate, from your wallet address.", "Xem các trang bạn đã ghi nhận và chứng chỉ, theo địa chỉ ví.")}</span>
          </a>
        </section>

        <h2 className="t-header section-title">{t("How it works", "Cách hoạt động")}</h2>
        <section className="bento">
          {steps.map((s, i) => (
            <div key={i} className="tile step-tile">
              <span className="icon-box" aria-hidden>{s.icon}</span>
              <p className="t-label step-no">{t("Step", "Bước")} {i + 1}</p>
              <h3 className="t-header">{s.title}</h3>
              <p className="t-secondary">{s.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
