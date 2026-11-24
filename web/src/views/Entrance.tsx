import type { Address } from "viem";
import { ArrowRight } from "lucide-react";
import { BOOKS } from "../books";
import { useLang, useT } from "../i18n";
import { Label, Nav, two } from "./Shell";

/** Landing (Swiss): giant headline + side text, 4 numbered steps between rules, library rows, certificate line. */
export default function Entrance(_: { wallet: Address | null }) {
  const t = useT();
  const { lang } = useLang();
  const steps = [
    [t("Learn", "Học"), t("Read a short, simple lesson.", "Đọc một bài lý thuyết ngắn, dễ hiểu.")],
    [t("Practice", "Thực hành"), t("Try it yourself with a small exercise.", "Tự làm một bài thực hành nhỏ.")],
    [t("Save progress", "Lưu tiến độ"), t("Save your progress when you finish the course.", "Lưu tiến độ khi học xong khóa.")],
    [t("Get certificate", "Nhận chứng chỉ"), t("Complete the course to get a certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")],
  ];

  return (
    <div className="page">
      <Nav />
      <main className="sw-wrap">
        <section className="sw-hero">
          <h1 className="sw-hero-title">{t("Learn by doing.", "Học bằng cách làm.")}</h1>
          <div className="sw-hero-side">
            <Label>{t("A learning platform", "Nền tảng học tập")}</Label>
            <p className="t-content">{t("Short courses about AI agents. Read a little, practice a little, finish to get a certificate.",
              "Những khóa học ngắn về AI agent. Đọc một chút, thực hành một chút, học xong nhận chứng chỉ.")}</p>
            <a className="btn btn-primary t-button" href="/courses">{t("Start learning", "Bắt đầu học")} <ArrowRight size={16} aria-hidden /></a>
          </div>
        </section>

        <ol className="sw-steps">
          {steps.map(([h, p], i) => (
            <li key={h}><span className="sw-num">{two(i + 1)}</span><h3 className="t-header">{h}</h3><p className="t-secondary">{p}</p></li>
          ))}
        </ol>

        <section className="sw-sec">
          <Label>{t(`Courses — ${BOOKS.length}`, `Khóa học — ${BOOKS.length}`)}</Label>
          <ul className="sw-rows">
            {BOOKS.map((b, i) => (
              <li key={b.id}><a className="sw-row" href={`/course/${b.id}/0`}>
                <span className="sw-num">{two(i + 1)}</span>
                <span className="sw-row-title">{b.title[lang]}</span>
                <span className="t-secondary sw-row-text">{b.blurb[lang]}</span>
                <span className="sw-sq" aria-hidden><ArrowRight size={20} /></span>
              </a></li>
            ))}
          </ul>
        </section>

        <section className="sw-sec">
          <Label>{t("Certificate", "Chứng chỉ")}</Label>
          <a className="sw-statement" href="/certificate">{t("Complete the course to get a certificate.", "Hoàn thành khóa học để nhận chứng chỉ.")}</a>
        </section>
      </main>
    </div>
  );
}
