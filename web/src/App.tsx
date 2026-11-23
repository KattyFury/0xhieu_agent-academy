import { useEffect, useState } from "react";
import type { Address } from "viem";
import Entrance from "./views/Entrance";
import Library from "./views/Library";
import Reader from "./views/Reader";
import Certificate, { CertificateList } from "./views/Certificate";
import { isAddr } from "./chain";

const KEY = "academy.wallet";

/** Clean URLs: /, /library, /book/1/3, /book/1/3/practice, /certificate, /certificate/0x… */
export const go = (path: string, replace = false) => {
  if (replace) history.replaceState(null, "", path); else history.pushState(null, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
};

function useRoute() {
  const [path, setPath] = useState(() => {
    if (location.hash.startsWith("#/")) { // old hash links (#/library, #/book/001/3) → clean paths
      const p = location.hash.slice(1).split("?")[0].replace(/^\/book\/001/, "/book/1").replace(/^\/join.*/, "/book/1/0");
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

  const [page, a, b, c] = route;
  if (page === "library") return <Library wallet={wallet} setWallet={setWallet} />;
  if (page === "book") return <Reader day={Number(b ?? 0)} side={c === "practice" ? "practice" : "learn"} wallet={wallet} setWallet={setWallet} />;
  if (page === "certificate") {
    const addr = b && isAddr(b) ? b : a && isAddr(a) ? a : null; // /certificate/1/0x… (or old /certificate/0x…)
    return addr ? <Certificate wallet={addr as Address} /> : <CertificateList wallet={wallet} setWallet={setWallet} />;
  }
  return <Entrance wallet={wallet} />;
}
