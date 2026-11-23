// Book 1, pages 1-2 ("Get ready"), written from the official skill docs (authentication.md, preflight.md,
// external-sign.md, agent-id-claim-status.md) and the Day-0 test (record fee measured 2026-11-23).
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

const Meta = ({ left, right }: { left: string; right: string }) => <p className="bk-meta t-label"><span className="bk-kicker">{left}</span><span>{right}</span></p>;
const Goal = ({ children }: { children: ReactNode }) => <p className="bk-goal t-content">{children}</p>;

/** Page 1, left: Binance account, Agentic Wallet, Agent ID. */
export function SetupId({ total }: { total: number }) {
  const t = useT();
  return (
    <>
      <Meta left={t("Get ready", "Chuẩn bị")} right={t(`Page 1 of ${total}`, `Trang 1/${total}`)} />
      <h1 className="t-page">{t("Your Agent ID", "Agent ID của bạn")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Get a Binance account, an Agentic Wallet and your Agent ID.", "Có tài khoản Binance, Agentic Wallet và Agent ID.")}</Goal>
      <p className="t-lead">{t("This book runs on ", "Sách này học trên ")}<strong>Binance Agentic Wallet</strong>{t(": a wallet your AI agent can use, with rules you set in the Binance app.", ": một ví mà AI agent của bạn dùng được, với quy tắc do bạn đặt trong app Binance.")}</p>
      <ol className="bk-steps">
        <li><p className="t-content">{t("Create a Binance account, then create your Agentic Wallet in the Binance app.", "Tạo tài khoản Binance, rồi tạo Agentic Wallet trong app Binance.")}</p></li>
        <li><p className="t-content">{t("Claim your Agent ID: Binance app, ", "Nhận Agent ID: app Binance, ")}<strong>{t("Wallet, then the Agent ID banner", "Ví, rồi banner Agent ID")}</strong>{t(" on the home screen. One per user, free apart from the BNB network fee.", " ở màn hình chính. Mỗi người một tên, miễn phí ngoài phí mạng BNB.")}</p></li>
        <li><p className="t-content">{t("Your Agent ID is your ", "Agent ID là ")}<strong>{t(".ai name", "tên .ai")}</strong>{t(", like you.ai. Only Agent ID holders can record pages and earn the certificate.", " của bạn, ví dụ you.ai. Chỉ người có Agent ID mới ghi nhận trang và nhận chứng chỉ được.")}</p></li>
      </ol>
      <p className="t-note">{t("Never share your recovery phrase or pairing code. Not here, not with anyone.", "Không bao giờ chia sẻ cụm từ khôi phục hay mã ghép nối. Không ở đây, không với ai.")}</p>
    </>
  );
}

/** Page 1, right: pick an AI, install the skill, sign in with the pairing code. */
export function SetupAgent({ record }: { record: ReactNode }) {
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
      <Meta left={t("Get ready", "Chuẩn bị")} right={t("About 10 minutes", "Khoảng 10 phút")} />
      <h2 className="t-page">{t("Your agent", "Agent của bạn")}</h2>
      <div className="setup-cards">
        {card("own", <Bot size={16} />, t("Your own AI", "AI của bạn"), t("Recommended", "Nên dùng"), t("Claude Code, Codex, Gemini CLI. Node.js 18+.", "Claude Code, Codex, Gemini CLI. Node.js 18+."))}
        {card("aipro", <Smartphone size={16} />, "Binance AI Pro", null, t("In the Binance app. Free credits run out fast.", "Trong app Binance. Credit miễn phí hết nhanh."))}
      </div>
      <ol className="bk-steps">
        {path === "own" ? <>
          <li><p className="t-content">{t("Paste this in your computer's terminal:", "Dán lệnh này vào terminal trên máy tính:")}</p>
            <div className="bk-prompt bk-prompt-row"><p className="t-data">{INSTALL}</p><CopyBtn text={INSTALL} /></div></li>
          <li><p className="t-content">{t("Tell your AI ", "Nói với AI ")}<strong>“Sign in to Binance Agentic Wallet”</strong>{t(". It shows a 6-character pairing code. Check the same code in the Binance app, then confirm.", ". Nó hiện một mã ghép nối 6 ký tự. Kiểm tra đúng mã đó trong app Binance rồi xác nhận.")}</p></li>
        </> : <>
          <li><p className="t-content">{t("Open the AI tab in the Binance app.", "Mở tab AI trong app Binance.")}</p></li>
          <li><p className="t-content">{t("Ask ", "Hỏi ")}<strong>“Is my Agentic Wallet connected?”</strong></p></li>
        </>}
      </ol>
      <div className="bk-record-block">{record}</div>
    </>
  );
}

/** Page 2, left: free gas for recording. */
export function SetupGas({ wallet, setWallet, total }: { wallet: Address | null; setWallet: (a: Address | null) => void; total: number }) {
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
    sent: <>{t("Sent ", "Đã gửi ")}<strong>{res?.amount} BNB</strong>{t(" to your wallet. ", " vào ví của bạn. ")}{res?.txHash && <a className="link" href={`${BSCSCAN}/tx/${res.txHash}`} target="_blank" rel="noreferrer">{t("See it on BscScan", "Xem trên BscScan")}</a>}</>,
    already: <>{t("This wallet already got its free gas.", "Ví này đã nhận gas miễn phí rồi.")}</>,
    enough: <>{t("Your wallet already has ", "Ví của bạn đã có ")}<strong>{res?.balance} BNB</strong>{t(", enough for every page.", ", đủ cho mọi trang.")}</>,
    cap: <>{t("Today's free gas is gone. Come back after 00:00 UTC.", "Gas miễn phí hôm nay đã hết. Quay lại sau 00:00 UTC.")}</>,
    out: <>{t("Free gas is out for now.", "Gas miễn phí tạm hết.")}</>,
  };
  return (
    <>
      <Meta left={t("Get ready", "Chuẩn bị")} right={t(`Page 2 of ${total}`, `Trang 2/${total}`)} />
      <h1 className="t-page">{t("Gas", "Gas")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Have a little BNB so your agent can record pages.", "Có một ít BNB để agent ghi nhận trang.")}</Goal>
      <p className="t-lead">{t("Each record is a small transaction on BNB Smart Chain, paid in BNB. On Nov 23 one record cost about ", "Mỗi lần ghi nhận là một giao dịch nhỏ trên BNB Smart Chain, trả bằng BNB. Ngày 23/11 một lần ghi tốn khoảng ")}<strong>0.000006 BNB</strong>.</p>
      {res ? <p className="t-content" role="status" style={{ color: res.status === "cap" || res.status === "out" ? undefined : "var(--ds-color-green-text)" }}>{msg[res.status] ?? t("Done.", "Xong.")}</p> : <>
        <p className="t-secondary">{t("Agent ID holders can get free gas once. Ask your AI “What's my wallet address?” (starts with 0x, safe to share) and paste it here.", "Người có Agent ID được nhận gas miễn phí một lần. Hỏi AI “What's my wallet address?” (bắt đầu bằng 0x, chia sẻ an toàn) rồi dán vào đây.")}</p>
        <input className="input t-input" aria-label={t("Wallet address", "Địa chỉ ví")} value={v} onChange={(e) => { setV(e.target.value); setErr(""); }} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="0x…" spellCheck={false} autoComplete="off" />
        {err && <p className="t-note" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{err}</p>}
        <div className="actions">
          <button className="btn btn-primary t-button" onClick={send} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} {t("Send me gas", "Gửi gas cho tôi")}</button>
          <button className="btn btn-ghost t-button" onClick={() => { if (isAddr(v.trim())) setWallet(v.trim() as Address); }}>{t("I have BNB, just save", "Tôi có BNB, chỉ lưu")}</button>
        </div>
      </>}
    </>
  );
}

/** Page 2, right: Developer Mode (needed to record), then record pages 1 and 2. */
export function SetupDevMode({ record }: { record: ReactNode }) {
  const t = useT();
  return (
    <>
      <Meta left={t("Get ready", "Chuẩn bị")} right={t("About 3 minutes", "Khoảng 3 phút")} />
      <h2 className="t-page">Developer Mode</h2>
      <p className="t-content">{t("Recording a page calls the Agent Academy contract. Your agent can only call a contract when ", "Ghi nhận trang là gọi hợp đồng Agent Academy. Agent chỉ gọi được hợp đồng khi ")}<strong>{t("Developer Mode is on", "Developer Mode đang bật")}</strong>.</p>
      <ol className="bk-steps">
        <li><p className="t-content">{t("Binance app: Agentic Wallet page, Settings (top right), ", "App Binance: trang Agentic Wallet, Cài đặt (góc trên phải), ")}<strong>Developer Mode</strong>.</p></li>
        <li><p className="t-content">{t("Read the risk warning, confirm, then approve the request in the app.", "Đọc cảnh báo rủi ro, xác nhận, rồi duyệt yêu cầu trong app.")}</p></li>
        <li><p className="t-content">{t("It lasts ", "Có hiệu lực ")}<strong>{t("7 days", "7 ngày")}</strong>{t("; each successful use extends it. The app refuses if your total balance is over the Developer Mode cap.", "; mỗi lần dùng thành công được gia hạn. App từ chối nếu tổng số dư vượt giới hạn của Developer Mode.")}</p></li>
      </ol>
      <div className="bk-record-block">{record}</div>
    </>
  );
}
