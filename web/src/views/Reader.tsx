// Book reader (spec v1.2): page 0 = Get ready, page n = lesson n; one open-book spread per page, page turns.
// Every page is one on-chain chapter (bit = page index); its record button sends the cumulative mask.
// QA: every state has a URL, e.g. /book/1/3?qa=copied (qa: nowallet|copied|submitted|confirmed|failed|timeout|unpublished|error|flip).
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Address, Hash } from "viem";
import { ArrowLeft, ArrowRight, Bot, Check, Copy, CreditCard, KeyRound, List, Loader2, LogOut, ShieldCheck, SlidersHorizontal, X, Zap } from "lucide-react";
import { go } from "../App";
import { Nav } from "./Shell";
import { usePageTitles } from "./Library";
import { ResultLines, SetupAccount, SetupAgent, SetupDevMode, SetupGas } from "./Onboard";
import { useLang, useT } from "../i18n";
import { book001Vi, localDay } from "../book001.vi";
import { book001, completionPrompt, dayAt, pageCount, pagesOf, type Day, type IconKey } from "../book001";
import { ACADEMY, BSCSCAN, chapterCount, client, completeCalldata, done as bitDone, progressOf } from "../chain";

const book = book001;
const P = pageCount(book); // pages = chapters (2 Get ready pages + lessons)
const LAST = P - 1;
const WATCH_MS = 10 * 60 * 1000;
const FLIP_MS = 600;
const qa = () => new URLSearchParams(location.search).get("qa") ?? "";

type Rec =
  | { phase: "idle" } | { phase: "copied"; since: number }
  | { phase: "submitted"; hash: Hash; since: number } | { phase: "failed"; hash: Hash } | { phase: "timeout" };

// ---------- chain state ----------
function useChain(wallet: Address | null) {
  const [published, setPublished] = useState<boolean | null>(null);
  const [mask, setMask] = useState(0n);
  const [error, setError] = useState(false);
  const loadBook = useCallback(() => chapterCount(book.id).then((n) => { setPublished(n > 0); setError(false); }).catch(() => setError(true)), []);
  const loadMask = useCallback(() => {
    if (!wallet) return Promise.resolve();
    return progressOf(wallet, book.id).then((p) => { setMask(p.mask); setError(false); }).catch(() => setError(true));
  }, [wallet]);
  useEffect(() => { loadBook(); loadMask(); }, [loadBook, loadMask]);
  useEffect(() => { if (!error) return; const t = setInterval(() => { loadBook(); loadMask(); }, 30000); return () => clearInterval(t); }, [error, loadBook, loadMask]);
  return { published, mask, error, loadMask };
}

// ---------- page contents ----------
/** Lesson copy marks key terms with **…**; they render ink 600 inside grey body text. */
const Rich = ({ text }: { text: string }) => <>{text.split(/\*\*(.+?)\*\*/g).map((t, i) => i % 2 ? <strong key={i}>{t}</strong> : t)}</>;
const ICONS = { bot: Bot, card: CreditCard, shield: ShieldCheck, key: KeyRound, zap: Zap, sliders: SlidersHorizontal, logout: LogOut } as const;
const Icon = ({ k }: { k: IconKey }) => { const C = ICONS[k]; return <span className="bk-icon" aria-hidden><C size={20} /></span>; };

function LearnPage({ d, page, titleRef }: { d: Day; page: number; titleRef?: React.Ref<HTMLHeadingElement> }) {
  const t = useT();
  return (
    <>
      <p className="bk-meta t-label"><span className="bk-kicker">{t("Learn", "Lý thuyết")}</span></p>
      <h1 className="t-page" tabIndex={-1} ref={titleRef} style={{ outline: "none" }}>{d.title}</h1>
      <p className="bk-goal t-content"><strong>{t("Goal:", "Mục tiêu:")}</strong> {d.goal}</p>
      {d.learn.paragraphs.map((p) => <p key={p} className="t-lead"><Rich text={p} /></p>)}
      {d.learn.points && <ul className="bk-points">{d.learn.points.map((p) => <li key={p.text}><Icon k={p.icon} /><p className="t-lead"><Rich text={p.text} /></p></li>)}</ul>}
      {d.learn.flow && <ol className="bk-flow" aria-label="How it works">
        {d.learn.flow.map((s, i, a) => <li key={s} className="t-label"><span className="bk-step-pill">{s}</span>{i < a.length - 1 && <ArrowRight size={14} aria-hidden />}</li>)}
      </ol>}
      <div className="bk-remember">
        <h2 className="t-label">{t("Remember", "Ghi nhớ")}</h2>
        <ul>{d.learn.remember.map((t) => <li key={t} className="t-content"><Check size={18} aria-hidden /><span><Rich text={t} /></span></li>)}</ul>
      </div>
    </>
  );
}

function CopyButton({ text, label, primary, onCopied }: { text: string; label: string; primary?: boolean; onCopied?: () => void }) {
  const t = useT();
  const [state, setState] = useState<"idle" | "ok" | "blocked">("idle");
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setState("ok"); onCopied?.(); setTimeout(() => setState("idle"), 2000); }
    catch { setState("blocked"); }
  };
  return (
    <>
      <button className={`btn t-button ${primary ? "btn-primary" : "btn-ghost"}`} onClick={copy}>
        {state === "ok" ? <Check size={16} /> : <Copy size={16} />} {state === "ok" ? t("Copied", "Đã chép") : label}
      </button>
      {state === "blocked" && <textarea className="input t-data" readOnly value={text} rows={3} onFocus={(e) => e.currentTarget.select()} aria-label="Copy this text with Ctrl+C" />}
    </>
  );
}

function PromptBox({ text }: { text: string }) {
  const t = useT();
  const [full, setFull] = useState(false);
  return (
    <div className={`bk-prompt ${full ? "full" : ""}`}>
      <p className="t-data">{text}</p>
      <div className="bk-prompt-actions">
        <CopyButton text={text} label={t("Copy prompt", "Chép prompt")} />
        <button className="link t-label bk-prompt-toggle" style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }} onClick={() => setFull((v) => !v)}>{full ? t("Show less", "Thu gọn") : t("Show full prompt", "Xem cả prompt")}</button>
      </div>
    </div>
  );
}

function RecordStatus({ done, rec, setHash }: { done: boolean; rec: Rec; setHash: (h: Hash) => void }) {
  const t = useT();
  const [hash, setH] = useState("");
  const [showHash, setShowHash] = useState(false);
  if (done) return <p className="bk-status bk-recorded t-content" role="status"><Check size={18} aria-hidden /> {t("Recorded on-chain", "Đã ghi nhận on-chain")}</p>;
  const hashForm = !showHash ? <button className="link t-label" style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }} onClick={() => setShowHash(true)}>{t("Have a transaction hash?", "Có mã giao dịch?")}</button> : (
    <form className="bk-hash" onSubmit={(e) => { e.preventDefault(); if (/^0x[0-9a-fA-F]{64}$/.test(hash.trim())) setHash(hash.trim() as Hash); }}>
      <input className="input t-input" placeholder={t("Paste the tx hash your agent gave you (optional)", "Dán mã giao dịch agent đưa (không bắt buộc)")} value={hash} onChange={(e) => setH(e.target.value)} spellCheck={false} aria-label="Transaction hash" />
    </form>
  );
  switch (rec.phase) {
    case "copied": return <><p className="bk-status t-secondary" role="status"><Loader2 size={14} className="animate-spin" /> {t("Prompt copied. Paste it into your agent and type ", "Đã chép prompt. Dán vào agent và gõ ")}<b>confirm</b>{t(". Watching the chain…", ". Đang theo dõi chain…")}</p>{hashForm}</>;
    case "submitted": return <p className="bk-status t-secondary" role="status"><Loader2 size={14} className="animate-spin" /> {t("Transaction sent, waiting for it to land.", "Đã gửi giao dịch, đang chờ xác nhận.")} <a className="link" href={`${BSCSCAN}/tx/${rec.hash}`} target="_blank" rel="noreferrer">{t("View", "Xem")}</a></p>;
    case "failed": return <p className="bk-status t-secondary" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{t("That transaction failed on-chain. Copy the record prompt and try again.", "Giao dịch thất bại on-chain. Chép lại prompt ghi nhận và thử lại.")} <a className="link" href={`${BSCSCAN}/tx/${rec.hash}`} target="_blank" rel="noreferrer">{t("See why", "Xem lý do")}</a></p>;
    case "timeout": return <><p className="bk-status t-secondary" role="status">{t("Not seen on-chain yet. Did your agent ask you to type ", "Chưa thấy on-chain. Agent có bảo bạn gõ ")}<b>confirm</b>{t("? Is Developer Mode on?", " không? Developer Mode đã bật chưa?")}</p>{hashForm}</>;
    default: return <p className="bk-status t-secondary"><span className="bk-dot" aria-hidden /> {t("Not recorded yet", "Chưa ghi nhận")}</p>;
  }
}

/** "Record this page": the learner's own agent sends completeChapters(book, mask | this page). */
function RecordBlock({ page, bits, text, wallet, mask, done, published, allDone, rec, onCopy, setHash }: {
  page: number; bits?: bigint; text?: string; wallet: Address | null; mask: bigint; done: boolean; published: boolean | null; allDone: boolean; rec: Rec; onCopy: () => void; setHash: (h: Hash) => void;
}) {
  const t = useT();
  const next = mask | (bits ?? 1n << BigInt(page));
  const prompt = wallet ? completionPrompt({ wallet, academy: ACADEMY, bookId: book.id, mask: next, calldata: completeCalldata(book.id, next) }) : "";
  return (
    <>
      <h3 className="t-header">{t(`Record pages ${pagesOf(page)}`, `Ghi nhận trang ${pagesOf(page)}`)}</h3>
      {published === false ? <p className="t-content">{t("Recording opens when this book is published on-chain. You can read every page now.", "Việc ghi nhận mở khi sách được phát hành on-chain. Bạn đọc được mọi trang ngay bây giờ.")}</p> : <>
        <p className="t-content">{text ? <Rich text={text} /> : <>{t("Paste the record prompt into your agent and type ", "Dán prompt ghi nhận vào agent và gõ ")}<b>confirm</b>{t(" when it shows the preview.", " khi agent hiện phần xem trước.")}</>}</p>
        <div className="bk-record">
          {!wallet ? <a className="btn btn-primary t-button" href="/book/1/0">{t("Get your wallet ready first", "Chuẩn bị ví trước")}</a>
            : !done && <CopyButton text={prompt} label={t("Copy record prompt", "Chép prompt ghi nhận")} primary onCopied={onCopy} />}
          {wallet && <RecordStatus done={done} rec={rec} setHash={setHash} />}
        </div>
        {wallet && allDone && <div><a className="btn btn-primary t-button" href="/certificate">{t("View certificate", "Xem chứng chỉ")}</a></div>}
      </>}
    </>
  );
}

function PracticePage({ d, record, note }: { d: Day; record?: ReactNode; note?: ReactNode }) {
  const t = useT();
  return (
    <>
      <p className="bk-meta t-label"><span className="bk-kicker">{t("Practice", "Thực hành")}</span></p>
      <h2 className="t-page">{d.practice.title ?? "Try it yourself"}</h2>
      {d.practice.riskText && <p className="bk-risk t-note" role="note"><strong>{t("Risk:", "Cảnh báo rủi ro:")}</strong> {d.practice.riskText}</p>}
      <ol className="bk-steps">
        {d.practice.steps.map((s, i, all) => (
          <li key={s.title} className={s.icon ? "bk-step-icon" : undefined}>
            {s.icon && <Icon k={s.icon} />}
            <h3 className="t-header">{s.title}</h3>
            <p className="t-content"><Rich text={s.text} /></p>
            {s.prompt && <PromptBox text={s.prompt} />}
            {i === all.length - 1 && <ResultLines check={d.practice.check} ifNot={d.practice.ifNot} />}
          </li>
        ))}
        {record && <li>{record}</li>}
      </ol>
      {note}
    </>
  );
}

// ---------- reader ----------
export default function Reader({ day, side, wallet: realWallet, setWallet }: { day: number; side: "learn" | "practice"; wallet: Address | null; setWallet: (a: Address | null) => void }) {
  const q = qa();
  const { lang } = useLang();
  const t = useT();
  const wallet = q === "nowallet" ? null : realWallet ?? (q && q !== "unpublished" && q !== "error" && q !== "flip" ? ("0x0000000000000000000000000000000000000001" as Address) : null);
  const chain = useChain(realWallet);
  const published = q === "unpublished" ? false : q ? true : chain.published;
  const mask = chain.mask;
  const target = Math.max(0, Math.min(LAST, Number.isNaN(day) ? 0 : day));
  const spreadMode = useMedia("(min-width: 1024px) and (min-height: 700px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");

  // Recording state per page (the chain is the only proof of completion).
  const [recs, setRecs] = useState<Record<number, Rec>>({});
  const rec: Rec = (q === "copied" && { phase: "copied", since: Date.now() }) || (q === "submitted" && { phase: "submitted", hash: ("0x" + "a".repeat(64)) as Hash, since: Date.now() })
    || (q === "failed" && { phase: "failed", hash: ("0x" + "b".repeat(64)) as Hash }) || (q === "timeout" && { phase: "timeout" }) || recs[target] || { phase: "idle" };
  const setRec = (p: number, r: Rec) => setRecs((m) => ({ ...m, [p]: r }));
  const isDone = (p: number) => q === "confirmed" || bitDone(mask, p);
  const count = [...Array(P)].filter((_, i) => isDone(i)).length;
  const watching = !q && (rec.phase === "copied" || rec.phase === "submitted");
  const { loadMask } = chain;
  useEffect(() => {
    if (!watching) return;
    const t = setInterval(async () => {
      await loadMask();
      if (rec.phase === "submitted") {
        try { const r = await client.getTransactionReceipt({ hash: rec.hash }); if (r.status === "reverted") setRec(target, { phase: "failed", hash: rec.hash }); } catch { /* not mined yet */ }
      }
      if (Date.now() - rec.since > WATCH_MS) setRec(target, { phase: "timeout" });
    }, 8000);
    return () => clearInterval(t);
  }, [watching, rec, target, loadMask]);

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
  }, []);
  // Single-page order: page0 left, page0 right, page1 left …
  const stepPage = (delta: 1 | -1) => {
    if (spreadMode) return nav(target + delta);
    if (delta === 1) return side === "learn" ? nav(target, "practice") : nav(target + 1);
    return side === "practice" ? nav(target, "learn") : nav(target - 1, "practice");
  };
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as Element | null; if (el instanceof Element && el.closest("input, textarea")) return;
      if (e.key === "ArrowRight") stepPage(1); else if (e.key === "ArrowLeft") stepPage(-1);
      else if (e.key === "Home") nav(0); else if (e.key === "End") nav(LAST);
    };
    addEventListener("keydown", on); return () => removeEventListener("keydown", on);
  });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const tocRef = useRef<HTMLDialogElement>(null);
  const titles = usePageTitles();

  // Book not on-chain yet: no record step at all (no placeholder text).
  const record = (p: number, text?: string, bits?: bigint) => published === false ? null : (
    <RecordBlock page={p} bits={bits} text={text} wallet={wallet} mask={mask} done={isDone(p)} published={published} allDone={count === P}
      rec={p === target ? rec : { phase: "idle" }} onCopy={() => setRec(p, { phase: "copied", since: Date.now() })} setHash={(h) => setRec(p, { phase: "submitted", hash: h, since: Date.now() })} />
  );
  // Chapters 1-2 can't be recorded before Developer Mode (chapter 3), so chapters 1-3 are recorded together on pages 5–6.
  const deferred = (p: number) => isDone(p) ? record(p) : null;
  const page = (p: number, which: "learn" | "practice", interactive: boolean) => {
    if (p === 1) return which === "learn" ? <SetupAccount total={P} /> : <SetupAgent record={deferred(1)} />;
    if (p === 2) return which === "learn" ? <SetupGas wallet={realWallet} setWallet={setWallet} total={P} /> : <SetupDevMode record={record(2, undefined, 0b111n)} />;
    const dd = localDay(dayAt(book, p)!, lang);
    if (p === 0) return which === "learn" ? <LearnPage d={dd} page={p} titleRef={interactive && p === shown ? titleRef : undefined} /> : <PracticePage d={dd} note={deferred(0)} />;
    return which === "learn" ? <LearnPage d={dd} page={p} titleRef={interactive && p === shown ? titleRef : undefined} /> : <PracticePage d={dd} record={record(p, dd.practice.recordText)} />;
  };

  const bookRef = useRef<HTMLElement>(null);
  const opening = useOpenFromShelf(bookRef, spreadMode && !reduce, lang === "vi" ? book001Vi.title : book.title);

  return (
    <div className={`bk-screen ${spreadMode ? "" : "bk-single"} ${opening ? "bk-opening" : ""}`}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => { const t = touch.current; touch.current = null; if (!t || spreadMode || getSelection()?.toString()) return;
        const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) stepPage(dx < 0 ? 1 : -1); }}>
      <Nav active="library" banner={(chain.error || q === "error") && <p className="bk-banner t-label" role="status">{t("Can't reach the chain. Progress may be out of date.", "Không kết nối được chuỗi. Tiến độ có thể chưa mới.")}</p>} />

      <main className="bk-stage">
        {spreadMode ? (
          <article ref={bookRef} className="bk-book" aria-label={t(`Pages ${pagesOf(shown)} of ${2 * P}`, `Trang ${pagesOf(shown)}/${2 * P}`)} inert={!!turning}>
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

            <a className="bk-close" href="/library" aria-label={t("Close book", "Đóng sách")}><X size={20} aria-hidden /></a>
          </article>
        ) : (
          <article key={`${target}-${side}`} className="bk-book bk-one turn" aria-label={t(`Page ${2 * target + (side === "learn" ? 1 : 2)}`, `Trang ${2 * target + (side === "learn" ? 1 : 2)}`)}>
            <Page side={side === "learn" ? "left" : "right"} folio={side === "learn" ? 2 * target + 1 : 2 * target + 2}>{page(target, side, true)}</Page>

            <a className="bk-close" href="/library" aria-label={t("Close book", "Đóng sách")}><X size={20} aria-hidden /></a>
          </article>
        )}
      </main>

      <footer className="bk-daybar" aria-label={t("Pages", "Các trang")}>
        <button className="btn btn-ghost t-button" onClick={() => stepPage(-1)} disabled={target === 0 && (spreadMode || side === "learn")} aria-label={t("Previous", "Trước")}>
          <ArrowLeft size={16} /> <span className="bk-hide-sm">{t("Previous", "Trước")}</span>
        </button>
        <div className="bk-days">
          <button className="btn btn-ghost t-button bk-contents" onClick={() => tocRef.current?.showModal()} aria-label={t("Contents", "Mục lục")}><List size={16} /> <span className="bk-hide-sm">{t("Contents", "Mục lục")}</span></button>
          <ol aria-label={t(`${P} pages`, `${P} trang`)}>
            {[...Array(P)].map((_, p) => (
              <li key={p}><button aria-label={`${t("Pages", "Trang")} ${pagesOf(p)}${isDone(p) ? t(", recorded", ", đã ghi nhận") : ""}`} aria-current={p === target ? "step" : undefined}
                className={`bk-dotbtn ${isDone(p) ? "done" : ""} ${p === target ? "on" : ""}`} onClick={() => nav(p)} /></li>
            ))}
          </ol>
          <span className="t-label">{spreadMode ? t(`Pages ${pagesOf(target)} of ${2 * P}`, `Trang ${pagesOf(target)}/${2 * P}`) : t(`Page ${2 * target + (side === "learn" ? 1 : 2)} of ${2 * P}`, `Trang ${2 * target + (side === "learn" ? 1 : 2)}/${2 * P}`)}</span>
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
          {titles.map((name, i) => (
            <li key={i}><button className="contents-row link-btn" onClick={() => { tocRef.current?.close(); nav(i); }} aria-current={i === target ? "page" : undefined}>
              <span className="t-data contents-no">{pagesOf(i)}</span>
              <span className="t-content contents-title">{name}</span>
              {isDone(i) && <span className="chip chip-done t-label"><Check size={14} aria-hidden /> {t("Done", "Đã học")}</span>}
            </button></li>
          ))}
        </ol>
      </dialog>
    </div>
  );
}

function Page({ side: s, folio, children, extra = "" }: { side: "left" | "right"; folio: number; children: ReactNode; extra?: string }) {
  const t = useT();
  const body = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const check = () => { const b = body.current; if (b) setMore(b.scrollHeight - b.clientHeight - b.scrollTop > 8); };
  // No scrollbar: step down spacing, then text size (data-fit1..4 in styles.css) until the page fits.
  const fit = () => {
    const b = body.current, sec = b?.parentElement; if (!b || !sec) return;
    for (let l = 0; l <= 4; l++) {
      for (let i = 1; i <= 4; i++) sec.toggleAttribute(`data-fit${i}`, i <= l);
      if (b.scrollHeight <= b.clientHeight) break;
    }
    check();
  };
  useLayoutEffect(fit);
  useEffect(() => { addEventListener("resize", fit); return () => removeEventListener("resize", fit); });
  return (
    <section className={`bk-page bk-${s} ${extra}`}>
      <div className="bk-body" ref={body} onScroll={check}>{children}
        {more && <p className="bk-more t-label" aria-hidden>{t("More below", "Còn tiếp bên dưới")}</p>}
      </div>
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
function useOpenFromShelf(bookRef: React.RefObject<HTMLElement | null>, enabled: boolean, title: string) {
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
    cover.querySelectorAll<HTMLElement>(".t-label")[0].textContent = book.number;
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
  }, [from, enabled, bookRef, title]);
  return opening;
}
