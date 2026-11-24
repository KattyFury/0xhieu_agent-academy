import { Suspense, lazy, useEffect, useState } from "react";
import type { Address } from "viem";
import Entrance from "./views/Entrance";
import Library from "./views/Library";
import NotFound from "./views/NotFound";
import { isAddr } from "./addr";
import { useT } from "./i18n";

// Reader and certificate pull in the chain code (viem), so they load only when opened.
const Reader = lazy(() => import("./views/Reader"));
const Certificate = lazy(() => import("./views/Certificate"));
const CertificateList = lazy(() => import("./views/Certificate").then((m) => ({ default: m.CertificateList })));

const KEY = "academy.wallet";

/** Clean URLs: /, /library, /course/1/3, /course/1/3/practice, /certificate, /certificate/0x… (/book/… = old links, same view) */
export const go = (path: string, replace = false) => {
  if (replace) history.replaceState(null, "", path); else history.pushState(null, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
};

function useRoute() {
  const [path, setPath] = useState(() => {
    if (location.hash.startsWith("#/")) { // old hash links (#/library, #/book/001/3) → clean paths
      const p = location.hash.slice(1).split("?")[0].replace(/^\/book\/001/, "/course/1").replace(/^\/join.*/, "/course/1/0");
      history.replaceState(null, "", p + location.search);
    }
    return location.pathname;
  });
  useEffect(() => {
    const on = () => { setPath(location.pathname); window.scrollTo(0, 0); };
    // Same-origin <a href="/…"> clicks navigate without a reload.
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      e.preventDefault();
      if (href !== location.pathname + location.search) go(href);
    };
    addEventListener("popstate", on);
    document.addEventListener("click", click);
    return () => { removeEventListener("popstate", on); document.removeEventListener("click", click); };
  }, []);
  return path.split("/").filter(Boolean);
}

export default function App() {
  const route = useRoute();
  const [wallet, setWalletState] = useState<Address | null>(() => {
    const v = localStorage.getItem(KEY) ?? "";
    return isAddr(v) ? (v as Address) : null;
  });
  const setWallet = (a: Address | null) => {
    if (a) localStorage.setItem(KEY, a); else localStorage.removeItem(KEY);
    setWalletState(a);
  };

  const t = useT();
  const [, a, b, c] = route;
  const view = pickView(route);
  useEffect(() => {
    if (view === "library") document.title = `${t("Library", "Thư viện")} · Agent Academy`;
    else if (view === "certificate") document.title = `${t("Certificate", "Chứng chỉ")} · Agent Academy`;
    else if (view === "home") document.title = "Agent Academy";
  }, [view, t]); // the reader sets its own title per page; NotFound sets its own

  return (
    <Suspense fallback={<div className="page" aria-busy="true" />}>
      {view === "library" ? <Library wallet={wallet} setWallet={setWallet} />
        : view === "book" ? <Reader key={a} bookId={Number(a)} day={Number(b ?? 0)} side={c === "practice" ? "practice" : "learn"} wallet={wallet} setWallet={setWallet} />
        : view === "certificate" ? (() => {
          const addr = b && isAddr(b) ? b : a && isAddr(a) ? a : null; // /certificate/<book>/0x… (or old /certificate/0x… = book 1)
          return addr ? <Certificate key={`${a}-${addr}`} wallet={addr as Address} bookId={b ? Number(a) : 1} /> : <CertificateList wallet={wallet} setWallet={setWallet} />;
        })()
        : view === "home" ? <Entrance wallet={wallet} />
        : <NotFound />}
    </Suspense>
  );
}

/** Which view a URL shows. Keep in sync with VALID_PATH in worker/index.ts (the Worker answers 404 for the rest). */
function pickView([page, a, b, c, d]: string[]): "home" | "library" | "book" | "certificate" | "404" {
  if (!page) return "home";
  if (page === "library") return a === undefined ? "library" : "404";
  if (page === "course" || page === "book") {
    // /course/<1|2>, /course/<id>/<0-13>, /course/<id>/<0-13>/practice (/book/… and 6-13 are old links: the reader clamps them to the last pair)
    return (a === "1" || a === "2") && (b === undefined || /^(\d|1[0-3])$/.test(b)) && (c === undefined || c === "practice") && d === undefined ? "book" : "404";
  }
  if (page === "certificate") {
    if (a === undefined) return "certificate";
    if (a === "1" || a === "2") return b !== undefined && isAddr(b) && c === undefined ? "certificate" : "404";
    return isAddr(a) && b === undefined ? "certificate" : "404";
  }
  return "404";
}
