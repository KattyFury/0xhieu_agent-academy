// Book #1 chapters 2-3 (setup spreads with inputs). Owner's v2, ELI12. Sources: Binance Agentic Wallet Install page,
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

const Meta = ({ left }: { left: string }) => <p className="bk-meta t-label"><span className="bk-kicker">{left}</span></p>;
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

/** Chapter 2, left: from zero to signed in. */
export function SetupAccount({ total }: { total: number }) {
  const t = useT();
  const steps: ReactNode[] = [
    <>{t("In the Binance app, create an ", "Trong app Binance, tạo ")}<strong>MPC Wallet</strong>{t(" first. You need it before Binance Agentic Wallet.", " trước. Cần có ví này trước Binance Agentic Wallet.")}</>,
    <>{t("Install the skill on your computer.", "Cài skill trên máy tính.")}</>,
    <>{t("Tell your AI: ", "Nói với AI: ")}<strong>“Create my Binance Agentic Wallet”</strong>{t(". Only once.", ". Chỉ làm một lần.")}</>,
    <>{t("Tell your AI: ", "Nói với AI: ")}<strong>“Sign in to Binance Agentic Wallet”</strong>{t(". Open its link, or scan its QR with the app.", ". Mở link nó đưa, hoặc quét QR bằng app.")}</>,
    <>{t("In the app, check the ", "Trong app, xem ")}<strong>{t("6-character code", "mã 6 ký tự")}</strong>{t(" matches the AI's. A new-IP warning that isn't you? ", " giống mã của AI. Có cảnh báo IP mới mà không phải bạn? ")}<strong>{t("Don't confirm.", "Đừng xác nhận.")}</strong></>,
    <>{t("Accept ", "Đồng ý ")}<strong>Secure Auto Sign</strong>{t(", tick the 3 safety boxes, tap Continue.", ", tick 3 ô an ninh, bấm Tiếp tục.")}</>,
    <>{t("Claim your ", "Nhận ")}<strong>Agent ID</strong>{t(": app, Wallet, the Agent ID banner. One per person.", ": app, Ví, banner Agent ID. Mỗi người một tên.")}</>,
  ];
  return (
    <>
      <Meta left={t("Get ready", "Chuẩn bị")} />
      <h1 className="t-page">{t("From zero to signed in", "Từ số 0 đến đăng nhập")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Have an account, a Binance Agentic Wallet, an Agent ID, and your AI signed in.", "Có tài khoản, Binance Agentic Wallet, Agent ID và AI đã đăng nhập.")}</Goal>
      <ol className="bk-steps bk-steps-tight">{steps.map((s, i) => <li key={i}><p className="t-content">{s}</p></li>)}</ol>
      <p className="t-note">{t("Your recovery phrase and pairing code go only into the Binance app. Never here, never to anyone.", "Cụm từ khôi phục và mã ghép nối chỉ nhập trong app Binance. Không nhập ở đây, không gửi cho ai.")}</p>
    </>
  );
}

/** Chapter 2, right: pick an AI, install, test the connection. */
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
      <Meta left={t("Practice", "Thực hành")} />
      <h2 className="t-page">{t("Install and sign in", "Cài và đăng nhập")}</h2>
      <div className="setup-cards">
        {card("own", <Bot size={16} />, t("Your own AI", "AI của bạn"), t("Recommended", "Nên dùng"), t("Claude Code, Codex… Node.js 18+.", "Claude Code, Codex… Node.js 18+."))}
        {card("aipro", <Smartphone size={16} />, "Binance AI Pro", null, t("In the app. Uses credits, may cost real money.", "Trong app. Dùng credit, có thể tốn tiền thật."))}
      </div>
      {path === "own"
        ? <><p className="t-content">{t("Paste in your computer's terminal:", "Dán vào terminal trên máy tính:")}</p><Box text={INSTALL} /></>
        : <p className="t-content">{t("Open the AI tab in the Binance app.", "Mở tab AI trong app Binance.")}</p>}
      <p className="t-content">{t("After steps 3–4, ask:", "Sau bước 3–4, hỏi:")}</p>
      <Box text={CONNECTED} />
      <ResultLines check={t("Your AI says the wallet is connected.", "AI báo ví đã kết nối.")} ifNot={t("Ask it to sign in again. Read any error word for word.", "Nhờ AI đăng nhập lại. Có lỗi thì đọc đúng từng chữ.")} />
      <div className="bk-record-block">{record}</div>
    </>
  );
}

/** Chapter 3, left: gas, plus the one-time free gas. */
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
      <Meta left={t("Get ready", "Chuẩn bị")} />
      <h1 className="t-page">{t("Gas and Developer Mode", "Gas và Developer Mode")}</h1>
      <Goal><strong>{t("Goal:", "Mục tiêu:")}</strong> {t("Get a little BNB for fees, and turn on Developer Mode.", "Có một ít BNB trả phí, và bật Developer Mode.")}</Goal>
      <p className="t-lead"><strong>Gas</strong>{t(" is a tiny fee you pay the network each time something is saved on it, paid in ", " là phí nhỏ trả cho mạng mỗi lần lưu gì đó lên mạng, trả bằng ")}<strong>BNB</strong>{t(". Recording a chapter costs very little.", ". Ghi nhận một chương tốn rất ít.")}</p>
      <p className="t-lead">{t("Agent Academy gives ", "Agent Academy tặng ")}<strong>{t("free gas once", "gas miễn phí một lần")}</strong>{t(" (about $0.25 of BNB) to each Agent ID. Ask your AI for your wallet address (starts with 0x, safe to share):", " (khoảng 0,25 USD BNB) cho mỗi Agent ID. Hỏi AI địa chỉ ví (bắt đầu bằng 0x, chia sẻ an toàn):")}</p>
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

/** Chapter 3, right: Developer Mode, check it, then record chapters 1-3. */
export function SetupDevMode({ record }: { record: ReactNode }) {
  const t = useT();
  return (
    <>
      <Meta left={t("Practice", "Thực hành")} />
      <h2 className="t-page">{t("Turn on Developer Mode", "Bật Developer Mode")}</h2>
      <p className="t-content">{t("Recording a chapter means your AI calls the Agent Academy contract. It may only do that when ", "Ghi nhận chương là AI gọi hợp đồng Agent Academy. AI chỉ được làm vậy khi ")}<strong>{t("Developer Mode is on", "Developer Mode đang bật")}</strong>.</p>
      <ol className="bk-steps bk-steps-tight">
        <li><p className="t-content">{t("Binance app: Agentic Wallet, Settings (top right), ", "App Binance: Agentic Wallet, Cài đặt (góc trên phải), ")}<strong>Developer Mode</strong>.</p></li>
        <li><p className="t-content">{t("Read the warning, confirm, approve in the app. It lasts ", "Đọc cảnh báo, xác nhận, duyệt trong app. Có hiệu lực ")}<strong>{t("7 days", "7 ngày")}</strong>{t(" and renews each time you use it.", " và tự gia hạn mỗi lần dùng.")}</p></li>
        <li><p className="t-content">{t("Check it:", "Kiểm tra:")}</p><Box text={DEVMODE} /></li>
      </ol>
      <ResultLines check={t("Developer Mode is on, with an end date.", "Developer Mode đang bật, có ngày hết hạn.")} />
      <div className="bk-record-block">{record}</div>
    </>
  );
}
