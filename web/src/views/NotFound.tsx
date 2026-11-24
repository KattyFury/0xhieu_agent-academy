import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useT } from "../i18n";
import { Nav } from "./Shell";

/** Any URL that is not a real page. The Worker also answers these with HTTP 404. */
export default function NotFound() {
  const t = useT();
  useEffect(() => { document.title = `${t("Page not found", "Không tìm thấy trang")} · Agent Academy`; }, [t]);
  return (
    <div className="page">
      <Nav />
      <main className="sw-wrap">
        <section className="sw-hero">
          <h1 className="sw-hero-title">404</h1>
          <div className="sw-hero-side">
            <span className="sw-label">{t("Page not found", "Không tìm thấy trang")}</span>
            <p className="t-content">{t("This link doesn't lead anywhere. Check the address, or start from the library.", "Liên kết này không dẫn đến trang nào. Kiểm tra lại địa chỉ, hoặc bắt đầu từ thư viện.")}</p>
            <a className="btn btn-primary t-button" href="/library">{t("Go to the library", "Đến thư viện")} <ArrowRight size={16} aria-hidden /></a>
          </div>
        </section>
      </main>
    </div>
  );
}
