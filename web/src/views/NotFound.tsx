import { useEffect } from "react";
import { useT } from "../i18n";
import { Nav } from "./Shell";

/** Any URL that is not a real page. The Worker also answers these with HTTP 404. */
export default function NotFound() {
  const t = useT();
  useEffect(() => { document.title = `${t("Page not found", "Không tìm thấy trang")} · Agent Academy`; }, [t]);
  return (
    <div className="page">
      <Nav />
      <main className="frame">
        <section className="bento">
          <div className="tile hero span-2">
            <h1 className="t-hero">{t("Page not found", "Không tìm thấy trang")}</h1>
            <p className="t-content measure">{t("This link doesn't lead anywhere. Check the address, or start from the library.", "Liên kết này không dẫn đến trang nào. Kiểm tra lại địa chỉ, hoặc bắt đầu từ thư viện.")}</p>
            <div className="actions"><a className="btn btn-primary t-button" href="/library">{t("Go to the library", "Đến thư viện")}</a></div>
          </div>
        </section>
      </main>
    </div>
  );
}
