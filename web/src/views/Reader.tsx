// Course reader (Swiss). Every course = 12 pages = 6 pairs (learn + practice); one page at a time everywhere.
// Desktop (≥1024): contents list on the left, the page beside it. Phone: the page + a bottom bar with Contents.
// Save points come from the book (book 1: page 12; book 2: pages 4, 8, 12). When the chain shows all 12 pages after the last save, the certificate popup opens.
// Next / Space / → next; Shift+Space / ← back.
// QA: every state has a URL, e.g. /course/1/5/practice?qa=copied (qa: nowallet|copied|timeout|confirmed|unpublished|error|own|pro|cert).
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Address } from "viem";
import { ArrowLeft, ArrowRight, Award, Check, List, Loader2, Lock, X } from "lucide-react";
import { go } from "../App";
import { Label, Nav, two } from "./Shell";
import { useLang, useT } from "../i18n";
import { SPREADS, bookById, savePrompt } from "../books";
import { ACADEMY, BOOK_PAGES, certificate, chapterCount, completeCalldata, hasAgentId, isAddr, progressOf, savedPages } from "../chain";
import { Code, WalletInput, book1, type Ctx, type Track } from "./Pages";
import { book2 } from "./Pages2";
import { CertPopup } from "./CertPopup";

const CONTENT = { 1: book1, 2: book2 } as const;
const LAST = SPREADS - 1;
const PAGES = 2 * SPREADS;
const WATCH_MS = 5 * 60 * 1000;
const POLL_MS = 5000;
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
  const demo = q && !["nowallet", "unpublished", "error", "own", "pro"].includes(q);
  const wallet = q === "nowallet" ? null : realWallet ?? (demo || q === "own" || q === "pro" ? ("0x0000000000000000000000000000000000000001" as Address) : null);
  const chain = useChain(realWallet, book.chainId);
  const published = q === "unpublished" ? false : q ? true : chain.published;
  const target = Math.max(0, Math.min(LAST, Number.isNaN(day) ? 0 : day));
  const wide = useMedia("(min-width: 1024px)");

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
  // The contract refuses a save with nothing new (NothingNew) or from a wallet without an Agent ID (NoAgentId): check both before showing a save prompt.
  const [agentOk, setAgentOk] = useState<boolean | null>(null);
  useEffect(() => { setAgentOk(null); if (realWallet && !q) hasAgentId(realWallet).then(setAgentOk).catch(() => setAgentOk(null)); }, [realWallet, q]);
  useEffect(() => {
    if (q || rec.phase !== "copied") return;
    const id = setInterval(() => { loadMask(); if (Date.now() - rec.since > WATCH_MS) setRec({ phase: "timeout" }); }, POLL_MS);
    return () => clearInterval(id);
  }, [q, rec, loadMask]);

  // Saved while we watched: open the certificate popup.
  const [issuedAt, setIssuedAt] = useState(0);
  const certRef = useRef<HTMLDialogElement>(null);
  const openCert = useCallback(() => {
    if (wallet && !q) certificate(wallet, book.chainId).then((c) => setIssuedAt(c.issuedAt)).catch(() => {});
    certRef.current?.showModal();
  }, [wallet, q, book.chainId]);
  useEffect(() => { if (done && rec.phase === "copied" && !q) { setRec({ phase: "idle" }); openCert(); } }, [done, rec.phase, q, openCert]);
  useEffect(() => { if (q === "cert") openCert(); }, [q, openCert]);

  const nav = useCallback((p: number, s: "learn" | "practice" = "learn") => {
    const pp = Math.max(0, Math.min(LAST, p));
    go(`/course/${book.id}/${pp}${s === "practice" ? "/practice" : ""}`);
  }, [book.id]);
  // Page by page: 1, 2, 3 …
  const stepPage = (delta: 1 | -1) => {
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
  const pageNo = 2 * target + (side === "practice" ? 2 : 1);
  useEffect(() => { document.title = `${names[pageNo - 1]} · Agent Academy`; }, [pageNo, names]);

  // A save point: the address box first if no wallet yet, then the command (copy adds the technical block). Only the last save is watched.
  const [addr, setAddr] = useState("");
  const [addrErr, setAddrErr] = useState("");
  const saveAddr = () => { const a = addr.trim(); if (isAddr(a)) setWallet(a as Address); else setAddrErr(t("That doesn't look like a wallet address (0x + 40 characters).", "Đây không giống địa chỉ ví (0x + 40 ký tự).")); };
  const walletBox: ReactNode = !wallet && <div className="bk-addr-row"><WalletInput value={addr} onChange={(v) => { setAddr(v); setAddrErr(""); }} onEnter={saveAddr} err={addrErr} />
    <button className="btn btn-dark t-button" onClick={saveAddr}>OK</button></div>;
  const save = (i: number, sentence: string): ReactNode => {
    const mask = content.saves[i], last = i === content.saves.length - 1;
    const already = !q && (chain.mask & mask) === mask;
    if (wallet && already) return <><div className="bk-code"><pre className="t-data">{sentence}</pre></div>{!last && <p className="bk-status bk-recorded t-content" role="status"><Check size={16} aria-hidden /> {t("Already saved. Go on to the next page.", "Đã lưu rồi. Sang trang tiếp theo.")}</p>}</>;
    if (wallet && agentOk === false) return <><div className="bk-code"><pre className="t-data">{sentence}</pre></div>
      <p className="bk-status t-content sw-warn" role="alert"><Lock size={16} aria-hidden /> {t("This wallet has no Agent ID yet, so it can't save. Claim your Agent ID (app → Wallet → Agent ID banner), then come back.", "Ví này chưa có Agent ID nên chưa lưu được. Nhận Agent ID (app → Ví → banner Agent ID) rồi quay lại.")}</p></>;
    return <>{walletBox}{!wallet || published === false
      ? <><div className="bk-code"><pre className="t-data">{sentence}</pre></div>{wallet && <p className="bk-status t-content"><Lock size={16} aria-hidden /> {t("Opens soon.", "Sắp mở.")}</p>}</>
      : <Code text={sentence} copy={savePrompt(sentence, { wallet, academy: ACADEMY, bookId: book.chainId, mask, calldata: completeCalldata(book.chainId, mask) }, lang)}
          onCopied={last ? () => setRec({ phase: "copied", since: Date.now() }) : undefined} />}</>;
  };
  // Temporary status words (owner approves).
  const status: ReactNode = !wallet ? null
    : done ? <div className="bk-record"><p className="bk-status bk-recorded t-content" role="status"><Check size={16} aria-hidden /> {t("Saved.", "Đã lưu.")}</p>
        <button className="btn btn-primary t-button" onClick={openCert}><Award size={16} aria-hidden /> {t("Open certificate", "Mở chứng chỉ")}</button></div>
    : rec.phase === "copied" ? <p className="bk-status t-secondary" role="status"><Loader2 size={14} className="animate-spin" /> {t("Waiting for your save…", "Đang chờ bạn lưu…")}</p>
    : rec.phase === "timeout" ? <div className="bk-record"><p className="bk-status t-secondary" role="status">{t("Not saved yet.", "Chưa thấy lưu.")}</p>
        <button className="btn btn-dark t-button" onClick={() => { setRec({ phase: "copied", since: Date.now() }); loadMask(); }}>{t("Try again", "Thử lại")}</button></div>
    : null;

  const page = (which: "learn" | "practice") => {
    const c: Ctx = { track, setTrack, wallet, setWallet, save, status };
    const no = 2 * target + (which === "learn" ? 1 : 2);
    return (
      <article className={`mz-col mz-${which}`} aria-label={t(`Page ${no}`, `Trang ${no}`)}>
        <Label>{which === "learn" ? t("Learn", "Học") : t("Practice", "Thực hành")} · {two(no)}</Label>
        {content.page(target, which, c)}
      </article>
    );
  };

  const toc = (onPick?: () => void) => (
    <ol className="mz-toc-list">
      {names.map((n, i) => {
        const sp = Math.floor(i / 2), on = i === pageNo - 1;
        return <li key={i}><button className={`mz-toc-row ${on ? "on" : ""}`} aria-current={on ? "page" : undefined}
          onClick={() => { onPick?.(); nav(sp, i % 2 ? "practice" : "learn"); }}><span>{two(i + 1)}</span>{n}</button></li>;
      })}
    </ol>
  );

  return (
    <div className="page mz"
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => { const s = touch.current; touch.current = null; if (!s || wide || getSelection()?.toString()) return;
        const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y; if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) stepPage(dx < 0 ? 1 : -1); }}>
      <Nav active="library" banner={(chain.error || q === "error") && <p className="sw-banner t-label" role="status">{t("Can't reach the chain. Progress may be out of date.", "Không kết nối được chuỗi. Tiến độ có thể chưa mới.")}</p>} />

      <main className="sw-wrap">
        <div className="mz-bar">
          <Label>{t("Course", "Khóa học")} {two(book.id)} — {book.title[lang]}</Label>
          <span className="mz-bar-right">
            <Label>{t(`Page ${pageNo} / ${PAGES}`, `Trang ${pageNo} / ${PAGES}`)}{wide && pageNo < PAGES && <span className="mz-hint">{t(" · Space → next", " · Space → trang sau")}</span>}</Label>
            <a className="sw-x" href="/courses" aria-label={t("Close course", "Đóng khóa học")}><X size={16} aria-hidden /></a>
          </span>
        </div>

        <div className="mz-grid">
          {wide && <nav className="mz-toc" aria-label={t("Contents", "Mục lục")}>{toc()}</nav>}
          {page(side)}
        </div>

        <footer className="mz-pager" aria-label={t("Pages", "Các trang")}>
          <button className="sw-pg" onClick={() => stepPage(-1)} disabled={pageNo === 1}><ArrowLeft size={16} aria-hidden /> <span>{t("Previous", "Trước")}</span></button>
          {wide
            ? <ol className="mz-dots" aria-label={t(`${PAGES} pages`, `${PAGES} trang`)}>{[...Array(PAGES)].map((_, i) => (
                <li key={i}><button aria-label={`${t("Page", "Trang")} ${i + 1}`} aria-current={i === pageNo - 1 ? "step" : undefined} className={`mz-dot ${i === pageNo - 1 ? "on" : ""} ${done ? "done" : ""}`} onClick={() => nav(Math.floor(i / 2), i % 2 ? "practice" : "learn")} /></li>))}</ol>
            : <button className="sw-pg" onClick={() => tocRef.current?.showModal()}><List size={16} aria-hidden /> <span>{t("Contents", "Mục lục")}</span></button>}
          <button className="sw-pg" onClick={() => stepPage(1)} disabled={pageNo === PAGES}><span>{t("Next", "Tiếp")}</span> <ArrowRight size={16} aria-hidden /></button>
        </footer>
      </main>

      <dialog ref={tocRef} className="dialog sw-dialog" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className="sw-dialog-head"><Label>{t("Contents", "Mục lục")}</Label>
          <button className="sw-x" aria-label={t("Close", "Đóng")} onClick={() => tocRef.current?.close()}><X size={16} /></button></div>
        <div className="dialog-body">{toc(() => tocRef.current?.close())}</div>
      </dialog>
      {wallet && <CertPopup ref={certRef} book={book} wallet={wallet} issuedAt={issuedAt} onClose={() => {}} />}
    </div>
  );
}

function useMedia(query: string) {
  const [m, setM] = useState(() => matchMedia(query).matches);
  useEffect(() => { const mq = matchMedia(query); const on = () => setM(mq.matches); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on); }, [query]);
  return m;
}
