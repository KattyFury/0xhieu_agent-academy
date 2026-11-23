import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "vi";
const KEY = "academy.lang";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  // English by default on every visit (owner). Vietnamese only via the switch or a ?lang=vi link; the choice is not remembered.
  const [lang, setLang] = useState<Lang>(() => (new URLSearchParams(location.search).get("lang") === "vi" ? "vi" : "en"));
  useEffect(() => { localStorage.removeItem(KEY); document.documentElement.lang = lang; }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
/** t("English", "Tiếng Việt") */
export const useT = () => { const { lang } = useLang(); return (en: string, vi: string) => (lang === "vi" ? vi : en); };

/** VI/EN switch copied from 0xhieu.xyz (.language-switch): white pill, black sliding knob. */
export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button className="language-switch" type="button" role="switch" aria-checked={lang === "en"} aria-label="English"
      onClick={() => setLang(lang === "en" ? "vi" : "en")}>
      <span className="language-option--vi" aria-hidden>VI</span><span className="language-option--en" aria-hidden>EN</span>
    </button>
  );
}
