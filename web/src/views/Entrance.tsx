import type { Address } from "viem";
import { ArrowRight, Award, BookOpen, ListChecks, PenLine } from "lucide-react";
import { book001 } from "../book001";
import { book001Vi } from "../book001.vi";
import { useLang, useT } from "../i18n";
import { Cover, Nav } from "./Shell";

/** Landing: what Agent Academy is. Yellow tile = Library, black tile = Certificate (like 0xhieu.xyz's yellow + dark tiles). */
export default function Entrance(_: { wallet: Address | null }) {
  const t = useT();
  const { lang } = useLang();
  const title = lang === "vi" ? book001Vi.title : book001.title;
  const steps = [
    { icon: <BookOpen size={20} />, title: t("Learn", "Học"), text: t("Read a short, simple lesson.", "Đọc một bài lý thuyết ngắn, dễ hiểu.") },
    { icon: <PenLine size={20} />, title: t("Practice", "Thực hành"), text: t("Try it yourself with a small exercise.", "Tự làm một bài thực hành nhỏ.") },
    { icon: <ListChecks size={20} />, title: t("Save progress", "Lưu tiến độ"), text: t("Mark each lesson done so you can see how far you are.", "Đánh dấu bài đã học để biết mình đi tới đâu.") },
    { icon: <Award size={20} />, title: t("Get certificate", "Nhận chứng chỉ"), text: t("Complete the course to get a certificate.", "Hoàn thành khóa học để nhận chứng chỉ.") },
  ];

  return (
    <div className="page">
      <Nav />
      <main className="frame">
        <section className="bento">
          <div className="tile hero span-2">
            <p className="t-label kicker">Agent Academy</p>
            <h1 className="t-hero">{t("Learn by doing.", "Học bằng cách làm.")}</h1>
            <p className="t-content measure">
              {t("Agent Academy is a library of short books about AI agents. Every piece of theory comes with a small hands-on practice.",
                "Agent Academy là thư viện những cuốn sách ngắn về AI agent. Mỗi một lý thuyết sẽ đi đôi với một bài thực hành nhỏ.")}</p>
            <div className="actions">
              <a className="btn btn-primary t-button" href="/library">{t("Start learning", "Bắt đầu học")}</a>
              <a className="btn btn-ghost t-button" href="/library">{t("Browse the library", "Xem thư viện")}</a>
            </div>
          </div>
          <a className="tile tile-accent door" href="/library">
            <span className="door-head"><span className="t-header">{t("Library", "Thư viện")}</span><ArrowRight size={20} aria-hidden /></span>
            <span className="door-cover"><Cover number={book001.number} title={title} /></span>
            <span className="t-secondary">{t("Every book is a course for you to explore.", "Mỗi cuốn sách là một khóa học cho bạn khám phá.")}</span>
          </a>
          <a className="tile tile-dark door" href="/certificate">
            <span className="door-head"><span className="t-header">{t("Certificate", "Chứng chỉ")}</span><ArrowRight size={20} aria-hidden /></span>
            <span className="door-seal" aria-hidden><Award size={48} /></span>
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
    </div>
  );
}
