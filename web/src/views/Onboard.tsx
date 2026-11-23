// Book #1 setup pages (sign-in, gas + Developer Mode; spreads with inputs). Owner's v2, ELI12. Sources: Binance Agentic Wallet Install page,
// skill docs (authentication.md, preflight.md, external-sign.md, agent-id-claim-status.md).
import { useState, type ReactNode } from "react";
import type { Address } from "viem";
import { Bot, Check, Copy, Loader2, Smartphone } from "lucide-react";
import { BSCSCAN, isAddr } from "../chain";
import { useT } from "../i18n";

type Path = "own" | "aipro";
const INSTALL = "npx skills add binance/binance-skills-hub/skills/binance-web3/binance-agentic-wallet";
const CONNECTED = "Using Binance Agentic Wallet: check whether my wallet is connected and tell me in one sentence what that means. Read data only. Do NOT send, sign or confirm any transaction.";
const DEVMODE = "Using Binance Agentic Wallet: read my wallet settings and tell me whether Developer Mode is enabled, when it expires, and what its daily limit is. Read data only. Do NOT send, sign or confirm any transaction.";

export function CopyBtn({ text, label }: { text: string; label?: string }) {
  const t = useT();
  const [ok, setOk] = useState(false);
  return (
    <button className="btn btn-ghost t-button" onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600); }}>
      {ok ? <Check size={16} /> : <Copy size={16} />} {ok ? t("Copied", "Đã chép") : label ?? t("Copy", "Chép")}
    </button>
  );
}

const Goal = ({ children }: { children: ReactNode }) => <p className="bk-goal t-content">{children}</p>;
const Box = ({ text }: { text: string }) => <div className="bk-prompt bk-prompt-row"><p className="t-data">{text}</p><CopyBtn text={text} /></div>;
/** "Right result" / "If not" lines under a practice. */
export function ResultLines({ check, ifNot }: { check?: string; ifNot?: string }) {
  const t = useT();
  if (!check && !ifNot) return null;
  return (
    <div className="bk-check">
      {check && <p className="t-secondary"><strong>{t("Right result:", "Kết quả đúng:")}</strong> {check}</p>}
      {ifNot && <p className="t-secondary"><strong>{t("If not:", "Nếu khác:")}</strong> {ifNot}</p>}
    </div>
  );
}

/** Pages 3-4, left: steps 1-4, each with its own command or prompt (one guide, top to bottom). */
export function SetupAccount({ total: _total }: { total: number }) {
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
      <h1 className="t-page">{t("From zero to signed in", "Từ số 0 đến đăng nhập")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Binance Agentic Wallet and Agent ID ready, your AI signed in.", "Có Binance Agentic Wallet, Agent ID, và AI đã đăng nhập.")}</Goal>
      <ol className="bk-steps bk-steps-tight">
        <li><p className="t-content">{t("Pick your AI.", "Chọn AI.")}</p>
          <div className="setup-cards">
            {card("own", <Bot size={16} />, t("Your own AI", "AI của bạn"), t("Recommended", "Nên dùng"), t("Claude Code, Codex… Node.js 18+.", "Claude Code, Codex… Node.js 18+."))}
            {card("aipro", <Smartphone size={16} />, "Binance AI Pro", null, t("In the app. 250K tokens a week by default.", "Trong app. Mặc định 250K token mỗi tuần."))}
          </div></li>
        <li><p className="t-content">{t("Create an ", "Tạo ")}<strong>MPC Wallet</strong>{t(" (keyless Web3 wallet) in the Binance app.", " (ví Web3 keyless) trong app Binance.")}</p></li>
        {path === "own"
          ? <li><p className="t-content">{t("Install the skill in your terminal:", "Cài skill trong terminal:")}</p><Box text={INSTALL} /></li>
          : <li><p className="t-content">{t("Open the AI tab in the Binance app.", "Mở tab AI trong app Binance.")}</p></li>}
        <li><p className="t-content">{t("Tell your AI (only once):", "Nói với AI (chỉ một lần):")}</p><Box text={t("Create my Binance Agentic Wallet", "Tạo Binance Agentic Wallet cho tôi")} /></li>
      </ol>
    </>
  );
}

/** Pages 3-4, right: steps 5-9, sign in, Agent ID, check. */
export function SetupAgent({ record }: { record: ReactNode }) {
  const t = useT();
  return (
    <>
      <h2 className="t-page">{t("Sign in and claim your Agent ID", "Đăng nhập và nhận Agent ID")}</h2>
      <ol className="bk-steps bk-steps-tight" style={{ counterReset: "s 4" }}>
        <li><p className="t-content">{t("Tell your AI:", "Nói với AI:")}</p><Box text={t("Sign in to Binance Agentic Wallet", "Đăng nhập Binance Agentic Wallet")} /><p className="t-content">{t("Open its link, or scan its QR with the app.", "Mở link nó đưa, hoặc quét QR bằng app.")}</p></li>
        <li><p className="t-content">{t("Check the ", "Xem ")}<strong>{t("6-character code", "mã 6 ký tự")}</strong>{t(" matches the AI's. New-IP warning that isn't you? ", " giống mã của AI. Cảnh báo IP mới không phải bạn? ")}<strong>{t("Don't confirm.", "Đừng xác nhận.")}</strong></p></li>
        <li><p className="t-content">{t("Accept ", "Đồng ý ")}<strong>Secure Auto Sign</strong>{t(", tick the 3 boxes, tap Continue.", ", tick 3 ô, bấm Tiếp tục.")}</p></li>
        <li><p className="t-content">{t("Claim your ", "Nhận ")}<strong>Agent ID</strong>{t(": app, Wallet, the Agent ID banner. One per person.", ": app, Ví, banner Agent ID. Mỗi người một tên.")}</p>
          <p className="bk-goal t-content"><strong>{t("Do it now: first come, first served.", "Làm ngay: ai đến trước được trước.")}</strong> {t("Claim your Agent ID and get ", "Nhận Agent ID để có ")}<strong>{t("2.5M free tokens", "2.5M token miễn phí")}</strong>{t(" for Binance AI Pro. The default is only 250K a week. We don't know when this ends.", " dùng Binance AI Pro. Mặc định chỉ 250K mỗi tuần. Chưa biết khi nào kết thúc.")}</p></li>
        <li><p className="t-content">{t("Check it. Ask your AI:", "Kiểm tra. Hỏi AI:")}</p><Box text={t(CONNECTED, "Dùng Binance Agentic Wallet: kiểm tra ví của tôi đã kết nối chưa và giải thích trong một câu điều đó nghĩa là gì. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào.")} />
          <ResultLines check={t("The wallet is connected.", "Ví đã kết nối.")} ifNot={t("Sign in again. Read any error word for word.", "Đăng nhập lại. Có lỗi thì đọc đúng từng chữ.")} /></li>
      </ol>
      <p className="t-note">{t("Never share your recovery phrase or pairing code.", "Không bao giờ chia sẻ cụm từ khôi phục hay mã ghép nối.")}</p>
      {record}
    </>
  );
}

/** Pages 5-6, left: gas, plus the one-time free gas. */
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
    enough: <>{t("Your wallet already has ", "Ví của bạn đã có ")}<strong>{res?.balance} BNB</strong>{t(", enough.", ", đủ dùng.")}</>,
    cap: <>{t("Today's free gas is gone. Come back after 00:00 UTC.", "Gas miễn phí hôm nay đã hết. Quay lại sau 00:00 UTC.")}</>,
    out: <>{t("Free gas is out for now.", "Gas miễn phí tạm hết.")}</>,
  };
  return (
    <>
      <h1 className="t-page">{t("Gas and Developer Mode", "Gas và Developer Mode")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Get a little BNB for fees, and turn on Developer Mode.", "Có một ít BNB trả phí, và bật Developer Mode.")}</Goal>
      <p className="t-lead"><strong>Gas</strong>{t(" is a tiny fee, paid in ", " là phí rất nhỏ, trả bằng ")}<strong>BNB</strong>{t(", each time you save something on the network. Saving your progress costs very little.", ", mỗi lần bạn lưu gì đó lên mạng. Lưu tiến độ tốn rất ít.")}</p>
      <p className="t-lead">{t("Agent Academy gives ", "Agent Academy tặng ")}<strong>{t("free gas once", "gas miễn phí một lần")}</strong>{t(" (0.00025 BNB, about $0.15) to each Agent ID. Ask your AI for your wallet address and paste it below. It starts with 0x and is safe to share.", " (0,00025 BNB, khoảng 0,15 USD) cho mỗi Agent ID. Hỏi AI địa chỉ ví rồi dán vào ô bên dưới. Địa chỉ bắt đầu bằng 0x và chia sẻ được an toàn.")}</p>
      {res ? <p className="t-content" role="status" style={{ color: res.status === "cap" || res.status === "out" ? undefined : "var(--ds-color-green-text)" }}>{msg[res.status] ?? t("Done.", "Xong.")}</p> : <>
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

/** Pages 5-6, right: Developer Mode, check it, then save pages 1-6. */
export function SetupDevMode({ record }: { record: ReactNode }) {
  const t = useT();
  return (
    <>
      <h2 className="t-page">{t("Turn on Developer Mode", "Bật Developer Mode")}</h2>
      <p className="t-content">{t("To save your progress, your AI needs ", "Để lưu tiến độ, AI cần ")}<strong>{t("Developer Mode on", "bật Developer Mode")}</strong>.</p>
      <ol className="bk-steps bk-steps-tight">
        <li><p className="t-content">{t("In the Binance app: Agentic Wallet → Settings (top right) → ", "Trong app Binance: Agentic Wallet → Cài đặt (góc trên phải) → ")}<strong>Developer Mode</strong>.</p></li>
        <li><p className="t-content">{t("Read the warning, confirm, approve in the app. It lasts ", "Đọc cảnh báo, xác nhận, duyệt trong app. Có hiệu lực ")}<strong>{t("7 days", "7 ngày")}</strong>{t(" and renews each time you use it.", " và tự gia hạn mỗi lần dùng.")}</p></li>
        <li><p className="t-content">{t("Check it:", "Kiểm tra:")}</p><Box text={t(DEVMODE, "Dùng Binance Agentic Wallet: đọc cài đặt ví của tôi và cho biết Developer Mode có đang bật không, khi nào hết hạn và hạn mức mỗi ngày là bao nhiêu. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào.")} /></li>
      </ol>
      <ResultLines check={t("Developer Mode is on, with an end date.", "Developer Mode đang bật, có ngày hết hạn.")} />
      {record}
    </>
  );
}
