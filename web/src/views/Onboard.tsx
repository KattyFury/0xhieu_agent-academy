import { useState, type ReactNode } from "react";
import type { Address } from "viem";
import { Bot, Check, Copy, Loader2, Smartphone } from "lucide-react";
import { BSCSCAN, isAddr } from "../chain";
import { useT } from "../i18n";

type Path = "own" | "aipro";
const INSTALL = "npx skills add binance/binance-skills-hub/skills/binance-web3/binance-agentic-wallet";

export function CopyBtn({ text, label }: { text: string; label?: string }) {
  const t = useT();
  const [ok, setOk] = useState(false);
  return (
    <button className="btn btn-ghost t-button" onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600); }}>
      {ok ? <Check size={16} /> : <Copy size={16} />} {ok ? t("Copied", "Đã chép") : label ?? t("Copy", "Chép")}
    </button>
  );
}

/** Book 001, "Get ready" spread, left page: Agent ID + an AI that uses the wallet. */
export function SetupAgent() {
  const t = useT();
  const [path, setPath] = useState<Path>("own");
  const card = (p: Path, icon: ReactNode, title: string, tag: string | null, line: string) => (
    <button onClick={() => setPath(p)} className={`setup-card ${path === p ? "on" : ""}`} aria-pressed={path === p}>
      <span className="flex items-center gap-2 t-label">{icon}{title}{tag && <span className="chip chip-accent t-label">{tag}</span>}</span>
      <span className="t-secondary">{line}</span>
    </button>
  );
  return (
    <>
      <p className="bk-meta t-label"><span className="bk-kicker">{t("Get ready", "Chuẩn bị")}</span><span>{t("Step 1 of 2", "Bước 1/2")}</span></p>
      <h1 className="t-page">{t("Your agent", "Agent của bạn")}</h1>
      <p className="t-lead">{t("This book runs on ", "Sách này học trên ")}<strong>Binance Agentic Wallet</strong>{t(". Pick the AI that uses it for you:", ". Chọn AI dùng ví thay bạn:")}</p>
      <div className="setup-cards">
        {card("own", <Bot size={16} />, t("Your own AI", "AI của bạn"), t("Recommended", "Nên dùng"), t("Claude Code, Codex or Gemini CLI on your computer.", "Claude Code, Codex hoặc Gemini CLI trên máy tính."))}
        {card("aipro", <Smartphone size={16} />, "Binance AI Pro", null, t("Built into the Binance app. Free credits run out fast.", "Có sẵn trong app Binance. Credit miễn phí hết nhanh."))}
      </div>
      <ol className="bk-steps">
        <li><p className="t-content">{t("Get an Agent ID in the Binance app: Wallet, then the Agent ID banner.", "Lấy Agent ID trong app Binance: Ví, rồi banner Agent ID.")}</p></li>
        {path === "own" ? <>
          <li><p className="t-content">{t("Paste this in your computer's terminal:", "Dán lệnh này vào terminal trên máy tính:")}</p>
            <div className="bk-prompt bk-prompt-row"><p className="t-data">{INSTALL}</p><CopyBtn text={INSTALL} /></div></li>
          <li><p className="t-content">{t("Tell your AI ", "Nói với AI ")}<strong>“Sign in to Binance Agentic Wallet”</strong>{t(" and scan its QR code with the Binance app.", " và quét mã QR bằng app Binance.")}</p></li>
        </> : <>
          <li><p className="t-content">{t("Open the AI tab in the Binance app.", "Mở tab AI trong app Binance.")}</p></li>
          <li><p className="t-content">{t("Ask ", "Hỏi ")}<strong>“Is my Agentic Wallet connected?”</strong></p></li>
        </>}
      </ol>
    </>
  );
}

/** Right page: link the wallet address and get free gas for recording lessons. */
export function SetupGas({ wallet, setWallet, onReady }: { wallet: Address | null; setWallet: (a: Address | null) => void; onReady: () => void }) {
  const t = useT();
  const [v, setV] = useState(wallet ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<{ status: string; txHash?: string; amount?: string; balance?: string } | null>(null);
  const send = async () => {
    const a = v.trim();
    if (!isAddr(a)) return setErr(t("That doesn't look like a wallet address.", "Đây không giống địa chỉ ví."));
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a }) });
      const j = await r.json();
      if (j.error) setErr(j.error);
      else { setWallet(a as Address); setRes(j); }
    } catch { setErr(t("Couldn't reach the server. Try again in a minute.", "Không kết nối được máy chủ. Thử lại sau một phút.")); }
    setBusy(false);
  };
  const msg: Record<string, ReactNode> = {
    sent: <>{t("Sent ", "Đã gửi ")}<strong>{res?.amount} BNB</strong>{t(" to your wallet. You're ready. ", " vào ví của bạn. Bạn đã sẵn sàng. ")}{res?.txHash && <a className="link" href={`${BSCSCAN}/tx/${res.txHash}`} target="_blank" rel="noreferrer">{t("See it on BscScan", "Xem trên BscScan")}</a>}</>,
    already: <>{t("This wallet already got its free gas. You're ready.", "Ví này đã nhận gas miễn phí rồi. Bạn đã sẵn sàng.")}</>,
    enough: <>{t("Your wallet already has ", "Ví của bạn đã có ")}<strong>{res?.balance} BNB</strong>{t(", enough for every lesson. You're ready.", ", đủ cho mọi bài học. Bạn đã sẵn sàng.")}</>,
    cap: <>{t("Today's free gas is gone. Come back after 00:00 UTC. You can still read the lessons now.", "Gas miễn phí hôm nay đã hết. Quay lại sau 00:00 UTC. Bạn vẫn đọc bài được ngay.")}</>,
    out: <>{t("Free gas is out for now. You can still read the lessons now.", "Gas miễn phí tạm hết. Bạn vẫn đọc bài được ngay.")}</>,
  };
  return (
    <>
      <p className="bk-meta t-label"><span className="bk-kicker">{t("Get ready", "Chuẩn bị")}</span><span>{t("Step 2 of 2", "Bước 2/2")}</span></p>
      <h2 className="t-page">{t("Free gas", "Gas miễn phí")}</h2>
      <p className="t-note">{t("Never share your recovery phrase or login codes. Not here, not with anyone.", "Không bao giờ chia sẻ cụm từ khôi phục hay mã đăng nhập. Không ở đây, không với ai.")}</p>
      {res ? <>
        <p className="t-content" role="status" style={{ color: res.status === "cap" || res.status === "out" ? undefined : "var(--ds-color-green-text)" }}>{msg[res.status] ?? t("Done.", "Xong.")}</p>
        <div><button className="btn btn-primary t-button" onClick={onReady}>{t("Start lesson 1", "Bắt đầu bài 1")}</button></div>
      </> : <>
        <p className="t-lead"><strong>{t("Give us your wallet address and we'll send you some gas.", "Đưa địa chỉ ví, chúng tôi gửi bạn một ít gas.")}</strong>{t(" Gas is the tiny fee for saving each lesson.", " Gas là khoản phí nhỏ để lưu mỗi bài học.")}</p>
        <p className="t-secondary">{t("Ask your AI “What's my wallet address?”. It starts with 0x and is safe to share.", "Hỏi AI “What's my wallet address?”. Địa chỉ bắt đầu bằng 0x và chia sẻ được an toàn.")}</p>
        <input className="input t-input" aria-label={t("Wallet address", "Địa chỉ ví")} value={v} onChange={(e) => { setV(e.target.value); setErr(""); }} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="0x…" spellCheck={false} autoComplete="off" />
        {err && <p className="t-note" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{err}</p>}
        <div className="actions">
          <button className="btn btn-primary t-button" onClick={send} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} {t("Send me gas", "Gửi gas cho tôi")}</button>
          <button className="btn btn-ghost t-button" onClick={() => { if (isAddr(v.trim())) setWallet(v.trim() as Address); onReady(); }}>{t("Skip, I have BNB", "Bỏ qua, tôi có BNB")}</button>
        </div>
      </>}
    </>
  );
}
