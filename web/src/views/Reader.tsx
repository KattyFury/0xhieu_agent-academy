// Book reader: one open-book spread = 2 pages (learn left, practice right). Every book = 12 pages = 6 spreads.
// Save points come from the book (book 1: page 12; book 2: pages 4, 8, 12). When the chain shows all 12 pages after the last save, the book folds shut and the certificate popup opens.
// Next / Space / → turn the page; Shift+Space / ← go back.
// QA: every state has a URL, e.g. /book/1/5?qa=copied (qa: nowallet|copied|timeout|confirmed|unpublished|error|flip|own|pro|cert).
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Address } from "viem";
import { ArrowLeft, ArrowRight, Award, Check, List, Loader2, Lock, X } from "lucide-react";
import { go } from "../App";
import { Nav } from "./Shell";
import { useLang, useT } from "../i18n";
import { SPREADS, bookById, pagesOf, savePrompt } from "../books";
import { ACADEMY, BOOK_PAGES, certificate, chapterCount, completeCalldata, isAddr, progressOf, savedPages } from "../chain";
import { Code, WalletInput, book1, type Ctx, type Track } from "./Pages";
import { book2 } from "./Pages2";
import { CertPopup } from "./CertPopup";

const CONTENT = { 1: book1, 2: book2 } as const;
const P = SPREADS;
const LAST = P - 1;
const PAGES = 2 * P;
const WATCH_MS = 5 * 60 * 1000;
const POLL_MS = 5000;
const FLIP_MS = 600;
const SHUT_MS = 700;
const TRACK_KEY = "academy.track";
const qa = () => new URLSearchParams(location.search).get("qa") ?? "";

type Rec = { phase: "idle" } | { phase: "copied"; since: number } | { phase: "timeout" };

// ---------- chain state ----------
function useChain(wallet: Address | null, chainId: number) {
  const [published, setPublished] = useState<boolean | null>(null);
  const [mask, setMask] = useState(0n);
  const [error, setError] = useState(false);
  const loadBook = useCallback(() => chapterCount(chainId).then((n) => { setPublished(n > 0); setError(false); }).catch(() => setError(true)), [chainId]);
  const loadMask = useCallback(() => {
    if (!wallet) return Promise.resolve();
    return progressOf(wallet, chainId).then((p) => { setMask(p.mask); setError(false); }).catch(() => setError(true));
  }, [wallet, chainId]);
  useEffect(() => { loadBook(); loadMask(); }, [loadBook, loadMask]);
  useEffect(() => { if (!error) return; const t = setInterval(() => { loadBook(); loadMask(); }, 30000); return () => clearInterval(t); }, [error, loadBook, loadMask]);
  return { published, mask, error, loadMask };
}

// ---------- reader ----------
export default function Reader({ bookId, day, side, wallet: realWallet, setWallet }: { bookId: number; day: number; side: "learn" | "practice"; wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const book = bookById(bookId);
  const content = CONTENT[book.id as 1 | 2];
  const q = qa();
  const { lang } = useLang();
  const t = useT();
  const demo = q && !["nowallet", "unpublished", "error", "flip", "own", "pro"].includes(q);
  const wallet = q === "nowallet" ? null : realWallet ?? (demo || q === "own" || q === "pro" ? ("0x0000000000000000000000000000000000000001" as Address) : null);
  const chain = useChain(realWallet, book.chainId);
  const published = q === "unpublished" ? false : q ? true : chain.published;
  const target = Math.max(0, Math.min(LAST, Number.isNaN(day) ? 0 : day));
  const spreadMode = useMedia("(min-width: 1024px) and (min-height: 700px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");

  // Track (page 3). ?qa=own|pro forces one for screenshots.
  const [trackState, setTrackState] = useState<Track | null>(() => { const v = localStorage.getItem(TRACK_KEY); return v === "own" || v === "pro" ? v : null; });
  const track: Track = q === "own" || q === "pro" ? q : trackState ?? "own"; // nothing picked yet = the recommended path
  const setTrack = (k: Track) => { localStorage.setItem(TRACK_KEY, k); setTrackState(k); };

  // Save state (the chain is the only proof).
  const [recState, setRec] = useState<Rec>({ phase: "idle" });
  const rec: Rec = q === "copied" ? { phase: "copied", since: Date.now() } : q === "timeout" ? { phase: "timeout" } : recState;
  const saved = q === "confirmed" || q === "cert" ? BOOK_PAGES : savedPages(chain.mask);
  const done = saved === BOOK_PAGES;
  const { loadMask } = chain;
  useEffect(() => {
    if (q || rec.phase !== "copied") return;
    const id = setInterval(() => { loadMask(); if (Date.now() - rec.since > WATCH_MS) setRec({ phase: "timeout" }); }, POLL_MS);
    return () => clearInterval(id);
  }, [q, rec, loadMask]);

  // Saved while we watched: fold the book shut, then the certificate popup.
  const [shut, setShut] = useState(false);
  const [issuedAt, setIssuedAt] = useState(0);
  const certRef = useRef<HTMLDialogElement>(null);
  const openCert = useCallback(() => {
    if (wallet && !q) certificate(wallet, book.chainId).then((c) => setIssuedAt(c.issuedAt)).catch(() => {});
    certRef.current?.showModal();
  }, [wallet, q, book.chainId]);
  const finish = useCallback(() => { setShut(true); setTimeout(openCert, reduce ? 0 : SHUT_MS); }, [openCert, reduce]);
  useEffect(() => { if (done && rec.phase === "copied" && !q) { setRec({ phase: "idle" }); finish(); } }, [done, rec.phase, q, finish]);
  useEffect(() => { if (q === "cert") finish(); }, [q, finish]);

  // Page turns: `shown` is what is on the desk; `flip` animates shown -> target.
  const [shown, setShown] = useState(target);
  const [flip, setFlip] = useState<{ from: number; to: number; dir: "fwd" | "back" } | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (q === "flip") return;
    if (flip) { if (target !== flip.to) { setShown(flip.to); setFlip(null); } return; }
    if (target === shown) return;
    if (!spreadMode || reduce) { setShown(target); return; }
    setFlip({ from: shown, to: target, dir: target > shown ? "fwd" : "back" });
  }, [target, shown, flip, spreadMode, reduce, q]);
  const turned = useRef(false);
  const endFlip = () => { if (!flip) return; turned.current = true; setShown(flip.to); setFlip(null); };
  useEffect(() => { if (!flip && turned.current) { turned.current = false; titleRef.current?.focus(); } }, [flip, shown]);
  const qaFlip = q === "flip" ? { from: Math.max(0, target - 1), to: target, dir: "fwd" as const } : null;
  const turning = qaFlip ?? flip;

  const nav = useCallback((p: number, s: "learn" | "practice" = "learn") => {
    const pp = Math.max(0, Math.min(LAST, p));
    go(`/book/${book.id}/${pp}${s === "practice" ? "/practice" : ""}`);
  }, [book.id]);
  // Single-page order: page 1, page 2, page 3 …
  const stepPage = (delta: 1 | -1) => {
    if (spreadMode) return nav(target + delta);
    if (delta === 1) return side === "learn" ? nav(target, "practice") : target < LAST && nav(target + 1);
    return side === "practice" ? nav(target, "learn") : target > 0 && nav(target - 1, "practice");
  };
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as Element | null;
      if (el instanceof Element && el.closest("input, textarea, select, dialog[open]")) return;
      if (e.key === " ") {
        if (el instanceof Element && el.closest("button, a")) return; // Space on a focused button presses that button
        e.preventDefault(); stepPage(e.shiftKey ? -1 : 1);
      } else if (e.key === "ArrowRight") stepPage(1); else if (e.key === "ArrowLeft") stepPage(-1);
      else if (e.key === "Home") nav(0); else if (e.key === "End") nav(LAST);
    };
    addEventListener("keydown", on); return () => removeEventListener("keydown", on);
  });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const tocRef = useRef<HTMLDialogElement>(null);
  const names = content.usePageNames(track);
  // Single-page mode on the practice side: title = the practice page's name.
  const nameIdx = 2 * target + (!spreadMode && side === "practice" ? 1 : 0);
  useEffect(() => { document.title = `${names[nameIdx]} · Agent Academy`; }, [nameIdx, names]);

  // A save point: the address box first if no wallet yet, then the command (copy adds the technical block). Only the last save is watched.
  const [addr, setAddr] = useState("");
  const [addrErr, setAddrErr] = useState("");
  const saveAddr = () => { const a = addr.trim(); if (isAddr(a)) setWallet(a as Address); else setAddrErr(t("That doesn't look like a wallet address (0x + 40 characters).", "Đây không giống địa chỉ ví (0x + 40 ký tự).")); };
  const walletBox: ReactNode = !wallet && <div className="bk-addr-row"><WalletInput value={addr} onChange={(v) => { setAddr(v); setAddrErr(""); }} onEnter={saveAddr} err={addrErr} />
    <button className="btn btn-primary t-button" onClick={saveAddr}>OK</button></div>;
  const save = (i: number, sentence: string): ReactNode => {
    const mask = content.saves[i], last = i === content.saves.length - 1;
    return <>{walletBox}{!wallet || published === false
      ? <><div className="bk-code"><pre className="t-data">{sentence}</pre></div>{wallet && <p className="bk-status t-content"><Lock size={18} aria-hidden /> {t("Opens soon.", "Sắp mở.")}</p>}</>
      : <Code text={sentence} copy={savePrompt(sentence, { wallet, academy: ACADEMY, bookId: book.chainId, mask, calldata: completeCalldata(book.chainId, mask) }, lang)}
          onCopied={last ? () => setRec({ phase: "copied", since: Date.now() }) : undefined} />}</>;
  };
  // Temporary status words (owner approves).
  const status: ReactNode = !wallet ? null
    : done ? <div className="bk-record"><p className="bk-status bk-recorded t-content" role="status"><Check size={18} aria-hidden /> {t("Saved.", "Đã lưu.")}</p>
        <button className="btn btn-primary t-button" onClick={openCert}><Award size={16} aria-hidden /> {t("Open certificate", "Mở chứng chỉ")}</button></div>
    : rec.phase === "copied" ? <p className="bk-status t-secondary" role="status"><Loader2 size={14} className="animate-spin" /> {t("Waiting for your save…", "Đang chờ bạn lưu…")}</p>
    : rec.phase === "timeout" ? <div className="bk-record"><p className="bk-status t-secondary" role="status">{t("Not saved yet.", "Chưa thấy lưu.")}</p>
        <button className="btn btn-ghost t-button" onClick={() => { setRec({ phase: "copied", since: Date.now() }); loadMask(); }}>{t("Try again", "Thử lại")}</button></div>
    : null;

  const page = (p: number, which: "learn" | "practice", interactive: boolean) => {
    const c: Ctx = { titleRef: interactive && p === shown ? titleRef : undefined, track, setTrack, wallet, setWallet, save, status };
    return content.page(p, which, c);
  };

  const bookRef = useRef<HTMLElement>(null);
  const opening = useOpenFromShelf(bookRef, spreadMode && !reduce, book.number, book.title[lang]);
  const close = <a className="bk-close" href="/library" aria-label={t("Close book", "Đóng sách")}><X size={20} aria-hidden /></a>;

  return (
    <div className={`bk-screen ${spreadMode ? "" : "bk-single"} ${opening ? "bk-opening" : ""}`}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => { const s = touch.current; touch.current = null; if (!s || spreadMode || getSelection()?.toString()) return;
        const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) stepPage(dx < 0 ? 1 : -1); }}>
      <Nav active="library" banner={(chain.error || q === "error") && <p className="bk-banner t-label" role="status">{t("Can't reach the chain. Progress may be out of date.", "Không kết nối được chuỗi. Tiến độ có thể chưa mới.")}</p>} />

      <main className="bk-stage">
        {spreadMode ? (
          <article ref={bookRef} className={`bk-book ${shut ? "bk-shut" : ""}`} aria-label={t(`Pages ${pagesOf(shown)} of ${PAGES}`, `Trang ${pagesOf(shown)}/${PAGES}`)} inert={!!turning || shut}>
            {turning ? (
              <>
                <Page side="left" folio={2 * (turning.dir === "fwd" ? turning.from : turning.to) + 1}>{page(turning.dir === "fwd" ? turning.from : turning.to, "learn", false)}</Page>
                <Page side="right" folio={2 * (turning.dir === "fwd" ? turning.to : turning.from) + 2}>{page(turning.dir === "fwd" ? turning.to : turning.from, "practice", false)}</Page>
                <div className={`bk-leaf bk-leaf-${turning.dir}`} onAnimationEnd={endFlip}
                  style={q === "flip" ? { animationPlayState: "paused", animationDelay: `-${FLIP_MS * 0.22}ms` } : { animationDuration: `${FLIP_MS}ms` }}>
                  <Page side={turning.dir === "fwd" ? "right" : "left"} folio={turning.dir === "fwd" ? 2 * turning.from + 2 : 2 * turning.from + 1} extra="bk-face">{page(turning.from, turning.dir === "fwd" ? "practice" : "learn", false)}</Page>
                  <Page side={turning.dir === "fwd" ? "left" : "right"} folio={turning.dir === "fwd" ? 2 * turning.to + 1 : 2 * turning.to + 2} extra="bk-face bk-face-back">{page(turning.to, turning.dir === "fwd" ? "learn" : "practice", false)}</Page>
                </div>
              </>
            ) : (
              <>
                <Page side="left" folio={2 * shown + 1}>{page(shown, "learn", true)}</Page>
                <Page side="right" folio={2 * shown + 2}>{page(shown, "practice", true)}</Page>
              </>
            )}
            {close}
          </article>
        ) : (
          <article key={`${target}-${side}`} className={`bk-book bk-one turn ${shut ? "bk-shut" : ""}`} aria-label={t(`Page ${2 * target + (side === "learn" ? 1 : 2)}`, `Trang ${2 * target + (side === "learn" ? 1 : 2)}`)}>
            <Page side={side === "learn" ? "left" : "right"} folio={side === "learn" ? 2 * target + 1 : 2 * target + 2}>{page(target, side, true)}</Page>
            {close}
          </article>
        )}
      </main>

      <footer className="bk-daybar" aria-label={t("Pages", "Các trang")}>
        <button className="btn btn-ghost t-button" onClick={() => stepPage(-1)} disabled={target === 0 && (spreadMode || side === "learn")} aria-label={t("Previous", "Trước")}>
          <ArrowLeft size={16} /> <span className="bk-hide-sm">{t("Previous", "Trước")}</span>
        </button>
        <div className="bk-days">
          <button className="btn btn-ghost t-button bk-contents" onClick={() => tocRef.current?.showModal()} aria-label={t("Contents", "Mục lục")}><List size={16} /> <span className="bk-hide-sm">{t("Contents", "Mục lục")}</span></button>
          <ol aria-label={t(`${P} spreads`, `${P} cặp trang`)}>
            {[...Array(P)].map((_, p) => (
              <li key={p}><button aria-label={`${t("Pages", "Trang")} ${pagesOf(p)}`} aria-current={p === target ? "step" : undefined}
                className={`bk-dotbtn ${done ? "done" : ""} ${p === target ? "on" : ""}`} onClick={() => nav(p)} /></li>
            ))}
          </ol>
          <span className="t-label">{spreadMode ? t(`Pages ${pagesOf(target)} of ${PAGES}`, `Trang ${pagesOf(target)}/${PAGES}`) : t(`Page ${2 * target + (side === "learn" ? 1 : 2)} of ${PAGES}`, `Trang ${2 * target + (side === "learn" ? 1 : 2)}/${PAGES}`)}</span>
        </div>
        <button className="btn btn-ghost t-button" onClick={() => stepPage(1)} disabled={target === LAST && (spreadMode || side === "practice")} aria-label={t("Next", "Tiếp")}>
          <span className={spreadMode ? "bk-hide-sm" : ""}>{t("Next", "Tiếp")}</span> <ArrowRight size={16} />
        </button>
      </footer>
      <dialog ref={tocRef} className="dialog toc" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className="dialog-head flex items-center justify-between gap-4">
          <h2 className="t-header">{t("Contents", "Mục lục")}</h2>
          <button className="btn btn-ghost" aria-label={t("Close", "Đóng")} onClick={() => tocRef.current?.close()} style={{ padding: 0, width: "var(--ds-control-height)" }}><X size={20} /></button>
        </div>
        <ol className="dialog-body contents">
          {[...Array(P)].map((_, i) => (
            <li key={i}><button className="contents-row link-btn" onClick={() => { tocRef.current?.close(); nav(i); }} aria-current={i === target ? "page" : undefined}>
              <span className="t-data contents-no">{pagesOf(i)}</span>
              <span className="t-content contents-title">{names[2 * i]} · {names[2 * i + 1]}</span>
            </button></li>
          ))}
        </ol>
      </dialog>
      {wallet && <CertPopup ref={certRef} book={book} wallet={wallet} issuedAt={issuedAt} onClose={() => { if (shut) go("/library"); }} />}
    </div>
  );
}

function Page({ side: s, folio, children, extra = "" }: { side: "left" | "right"; folio: number; children: ReactNode; extra?: string }) {
  const body = useRef<HTMLDivElement>(null);
  // No scrollbar: step down spacing, then text size (data-fit1..6 in styles.css) until the page fits.
  const fit = () => {
    const b = body.current, sec = b?.parentElement; if (!b || !sec) return;
    for (let l = 0; l <= 6; l++) {
      for (let i = 1; i <= 6; i++) sec.toggleAttribute(`data-fit${i}`, i <= l);
      if (b.scrollHeight <= b.clientHeight) break;
    }
  };
  useLayoutEffect(fit);
  useEffect(() => { addEventListener("resize", fit); return () => removeEventListener("resize", fit); });
  return (
    <section className={`bk-page bk-${s} ${extra}`}>
      <div className="bk-body" ref={body}>{children}</div>
      <span className="bk-folio t-label">{folio}</span>
    </section>
  );
}

function useMedia(query: string) {
  const [m, setM] = useState(() => matchMedia(query).matches);
  useEffect(() => { const mq = matchMedia(query); const on = () => setM(mq.matches); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on); }, [query]);
  return m;
}

/** Library → Book: the cover flies from its shelf spot to the closed-book spot, then opens around its spine. */
function useOpenFromShelf(bookRef: React.RefObject<HTMLElement | null>, enabled: boolean, number: string, title: string) {
  const [opening, setOpening] = useState(false);
  const from = useMemo(() => { const v = sessionStorage.getItem("openFrom"); sessionStorage.removeItem("openFrom"); return v ? JSON.parse(v) as DOMRectInit : null; }, []);
  useLayoutEffect(() => {
    const el = bookRef.current;
    if (!from || !enabled || !el) return;
    const b = el.getBoundingClientRect();
    const h = b.height, w = h * 0.7, x = b.left + (b.width - w) / 2, y = b.top;
    const cover = document.createElement("div");
    cover.className = "cover bk-flycover";
    cover.innerHTML = '<span class="cover-spine"></span><span class="cover-frame"><span class="t-label"></span><span class="t-header cover-title"></span><span class="t-label">Agent Academy</span></span>';
    cover.querySelectorAll<HTMLElement>(".t-label")[0].textContent = number;
    cover.querySelector<HTMLElement>(".cover-title")!.textContent = title;
    Object.assign(cover.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    document.body.appendChild(cover);
    const sx = (from.width ?? 0) / w, sy = (from.height ?? 0) / h;
    el.animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }], { duration: 950, easing: "ease-out" });
    cover.animate([
      { transform: `translate(${(from.x ?? 0) - x}px, ${(from.y ?? 0) - y}px) scale(${sx}, ${sy})` },
      { transform: "none", offset: 0.47 },
      { transform: "perspective(2000px) rotateY(0deg)", offset: 0.5 },
      { transform: "perspective(2000px) rotateY(-180deg)" },
    ], { duration: 950, easing: "cubic-bezier(.3,.7,.3,1)" }).finished.finally(() => { cover.remove(); setOpening(false); });
    setOpening(true);
  }, [from, enabled, bookRef, number, title]);
  return opening;
}
