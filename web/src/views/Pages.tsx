// Book #1, the 12 pages (owner's spec 2026-11-24). Vietnamese text is the owner's approved copy, word for word; English is its translation.
// Odd pages = learn (left), even pages = practice (right). Pages 4 and 6 follow the learner's `track` (picked on page 3).
// Status words (gas button, save) and the X share text are temporary: the owner approves them (spec §9.5).
import { useState, type ReactNode, type Ref } from "react";
import type { Address } from "viem";
import { Check, CircleCheck, CircleX, Copy, Loader2 } from "lucide-react";
import { BSCSCAN, isAddr } from "../chain";
import { useT } from "../i18n";

export type Track = "own" | "pro";

// ---------- shared bits ----------
/** **bold** inside text. */
export const Rich = ({ text }: { text: string }) => <>{text.split(/\*\*(.+?)\*\*/g).map((s, i) => (i % 2 ? <strong key={i}>{s}</strong> : s))}</>;

export function CopyButton({ text, label, primary, onCopied }: { text: string; label: string; primary?: boolean; onCopied?: () => void }) {
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

/** A command for the AI: code frame, [Copy prompt] below. `copy` = what gets copied when it differs from what is shown. */
export function Code({ text, copy, onCopied }: { text: string; copy?: string; onCopied?: () => void }) {
  return (
    <div className="bk-code">
      <pre className="t-data">{text}</pre>
      <CopyButton text={copy ?? text} label="Copy prompt" onCopied={onCopied} />
    </div>
  );
}

const Ok = ({ text }: { text: string }) => {
  const t = useT();
  return <p className="bk-result t-content"><CircleCheck size={18} aria-hidden /><span><strong>{t("Right result:", "Kết quả đúng:")}</strong> <Rich text={text} /></span></p>;
};
const List = ({ items }: { items: string[] }) => <ul className="bk-list">{items.map((s) => <li key={s} className="t-lead"><Rich text={s} /></li>)}</ul>;
const P = ({ text }: { text: string }) => <p className="t-lead"><Rich text={text} /></p>;
const Steps = ({ start = 0, children }: { start?: number; children: ReactNode }) => <ol className="bk-steps bk-steps-tight" style={start ? { counterReset: `s ${start}` } : undefined}>{children}</ol>;
const S = ({ text, children }: { text?: string; children?: ReactNode }) => <li>{text && <p className="t-content"><Rich text={text} /></p>}{children}</li>;
type TitleRef = { titleRef?: Ref<HTMLHeadingElement> };
const H1 = ({ text, titleRef }: { text: string } & TitleRef) => <h1 className="t-page" tabIndex={-1} ref={titleRef} style={{ outline: "none" }}>{text}</h1>;
const H2 = ({ text }: { text: string }) => <h2 className="t-page">{text}</h2>;

// ---------- prompts ----------
const INSTALL = "npx skills add binance/binance-skills-hub/skills/binance-web3/binance-agentic-wallet";
export const usePrompts = () => {
  const t = useT();
  return {
    login: t("Sign in to Binance Agentic Wallet", "Đăng nhập Binance Agentic Wallet"),
    connected: t("Is my wallet connected?", "Ví của tôi đã kết nối chưa?"),
    address: t("What is my wallet address?", "Địa chỉ ví của tôi là gì?"),
    balance: t("What is my BNB balance on BNB Smart Chain?", "Số dư BNB của tôi trên BNB Smart Chain là bao nhiêu?"),
    limit: t("What is my daily limit?", "Hạn mức mỗi ngày của tôi là bao nhiêu?"),
    devLimit: t("What is my Developer Mode daily limit?", "Hạn mức Developer Mode mỗi ngày của tôi là bao nhiêu?"),
    save: t("Save my learning progress on Agent Academy: finished pages 1 to 12 of book 1.", "Lưu tiến độ học của tôi trên Agent Academy: đã xong trang 1 đến 12 của sách 1."),
  };
};

/** Page titles in reading order (12). Pages 4 and 6 depend on the track. */
export function usePageNames(track: Track | null) {
  const t = useT();
  return [
    t("What is Binance Agentic Wallet?", "Binance Agentic Wallet là gì?"),
    t("How does the wallet keep money safe?", "Ví giữ tiền an toàn thế nào?"),
    t("Choose your AI", "Chọn AI của bạn"),
    track === "pro" ? t("Sign in and claim your Agent ID", "Đăng nhập và nhận Agent ID") : t("Install and sign in", "Cài và đăng nhập"),
    t("Wallet address and Agent ID", "Địa chỉ ví và Agent ID"),
    t("Get your wallet address", "Lấy địa chỉ ví"),
    "Gas",
    t("Check your gas", "Kiểm tra gas"),
    t("Wallet rules", "Luật của ví"),
    t("Read your rules", "Đọc luật của bạn"),
    t("What is signing?", "Ký là gì?"),
    t("Turn on Developer Mode and save your progress", "Bật Developer Mode và lưu tiến độ"),
  ];
}

// ---------- pages ----------
export function Page1({ titleRef }: TitleRef) {
  const t = useT();
  return <>
    <H1 text={t("What is Binance Agentic Wallet?", "Binance Agentic Wallet là gì?")} titleRef={titleRef} />
    <P text={t("AI today is a great helper, but what it can do usually stops at:", "AI ngày nay là trợ thủ đắc lực, nhưng việc AI làm được thường dừng ở:")} />
    <List items={[t("Talking", "Nói chuyện"), t("Writing, finding and summing up information", "Viết, tìm và tóm tắt thông tin"), t("Making images or videos", "Tạo ảnh hoặc video")]} />
    <P text={t("Give the AI a crypto wallet, and you can tell it to manage your crypto for you, like:", "Nếu đưa cho AI một cái ví crypto, bạn có thể ra lệnh để AI quản lý crypto giúp bạn, như:")} />
    <List items={[
      t("See your balance and history", "Xem số dư và lịch sử"),
      t("Send – receive", "Gửi – nhận"),
      t("Buy – sell (swap)", "Mua – bán (swap)"),
      t("Set an order that buys or sells by itself when the price hits your level (limit)", "Đặt lệnh tự mua bán khi giá chạm mức bạn chọn (limit)"),
    ]} />
    <P text={t("Binance Agentic Wallet is that wallet, made by Binance.", "Binance Agentic Wallet chính là cái ví đó, do Binance làm ra.")} />
  </>;
}

export function Page2() {
  const t = useT();
  return <>
    <H2 text={t("How does the wallet keep money safe?", "Ví giữ tiền an toàn thế nào?")} />
    <P text={t("AI can make mistakes too. To keep you from losing money, Binance Agentic Wallet has these safeguards:", "AI cũng có thể sơ suất. Để tránh mất tiền, Binance Agentic Wallet có các biện pháp:")} />
    <List items={[
      t("A limit on how much the AI can use each day (daily limit)", "Giới hạn số tiền AI được dùng mỗi ngày (hạn mức)"),
      t("Each kind of task has its own limit", "Mỗi loại việc có hạn mức riêng"),
      t("A limit on which tokens the AI can trade", "Giới hạn loại token AI được giao dịch"),
      t("Unusual transactions are refused, or the wallet asks you again", "Giao dịch bất thường bị từ chối, hoặc ví hỏi lại bạn"),
      t("The AI does not hold the wallet's key", "AI không cầm chìa khoá của ví"),
      t("Sign out and the AI loses access", "Đăng xuất thì AI hết quyền"),
    ]} />
    <P text={t("You set these limits yourself in the Binance app. The AI can see them but can't change them.", "Các giới hạn này do bạn tự đặt trong app Binance. AI chỉ xem được, không sửa được.")} />
  </>;
}

export function Page3({ track, setTrack, titleRef }: { track: Track | null; setTrack: (t: Track) => void } & TitleRef) {
  const t = useT();
  const card = (k: Track, title: string, tag: string | null, sub: string | null, pros: string[], cons: string[], button: string) => (
    <div className={`setup-card pick-card ${track === k ? "on" : ""}`}>
      <span className="flex items-center gap-2 t-header">{title}{tag && <span className="chip chip-accent t-label">{tag}</span>}</span>
      {sub && <span className="t-secondary">{sub}</span>}
      <ul className="pick-list">
        {pros.map((s) => <li key={s} className="t-secondary"><CircleCheck size={16} className="pick-pro" aria-label="+" />{s}</li>)}
        {cons.map((s) => <li key={s} className="t-secondary"><CircleX size={16} className="pick-con" aria-label="−" />{s}</li>)}
      </ul>
      <button className={`btn t-button ${track === k ? "btn-primary" : "btn-ghost"}`} aria-pressed={track === k} onClick={() => setTrack(k)}>
        {track === k && <Check size={16} aria-hidden />} {button}
      </button>
    </div>
  );
  return <>
    <H1 text={t("Choose your AI", "Chọn AI của bạn")} titleRef={titleRef} />
    <P text={t("Binance Agentic Wallet does not share a wallet with MPC Wallet. It is a wallet of its own.", "Binance Agentic Wallet không dùng chung ví với MPC Wallet. Nó là một ví riêng.")} />
    <P text={t("Pick one of two paths. The next pages show only the path you pick.", "Chọn một trong hai đường. Bạn chọn đường nào thì các trang sau chỉ hiện đường đó.")} />
    <div className="setup-cards">
      {card("own", t("Your own AI", "AI của bạn"), t("Recommended", "Nên dùng"), "Claude Code, Codex, Gemini CLI…",
        [t("Use the AI you already know", "Dùng AI bạn đã quen"), t("Can do every step", "Làm được mọi bước")],
        [t("Needs Node.js 18+ and the skill", "Phải cài Node.js 18+ và skill"), t("You type commands in a terminal", "Phải gõ lệnh trong terminal")],
        t("Choose your own AI", "Chọn AI của bạn"))}
      {card("pro", "Binance AI Pro", null, null,
        [t("Ready to use, nothing to install", "Có sẵn, không cần cài"), t("Claim an Agent ID and get 2.5 million free AI tokens. Free tokens are FCFS.", "Nhận Agent ID được tặng 2,5 triệu token AI. Số token tặng theo FCFS.")],
        [t("Only 250K tokens a week by default, then you pay", "Mặc định chỉ 250K token mỗi tuần, hết phải mua"), t("May not be available in your country yet", "Có thể chưa dùng được ở nước bạn")],
        t("Choose Binance AI Pro", "Chọn Binance AI Pro"))}
    </div>
  </>;
}

export function Page4({ track }: { track: Track }) {
  const t = useT();
  const pr = usePrompts();
  if (track === "own") return <>
    <H2 text={t("Install and sign in", "Cài và đăng nhập")} />
    <Steps>
      <S text={t("Install the skill (type it in a terminal, or ask your AI to run it):", "Cài skill (gõ trong terminal, hoặc nhờ AI chạy):")}><Code text={INSTALL} /></S>
      <S text={t("Tell your AI:", "Nói với AI:")}><Code text={pr.login} /></S>
      <S text={t("Your AI gives you a link and a 6-character code. Open the link and sign in with the Binance App. The first time, the app guides you to create the wallet.", "AI đưa bạn một link và mã 6 ký tự. Mở link, đăng nhập bằng Binance App. Lần đầu, app sẽ hướng dẫn bạn tạo ví.")} />
      <S text={t("In the app, compare the 6-character code with the one your AI gave. If they match, confirm. If they don't match, or you didn't just ask for it (unknown IP warning), don't confirm.", "Trong app, so mã 6 ký tự với mã AI vừa đưa. Khớp thì xác nhận. Không khớp, hoặc không phải bạn vừa yêu cầu (cảnh báo IP lạ), thì đừng xác nhận.")} />
      <S text={t("Turn on Secure Auto Sign (lets the AI do small tasks within your limit), tick the 3 boxes, tap Continue.", "Bật Secure Auto Sign (cho AI tự làm việc nhỏ trong hạn mức), tick 3 ô, bấm Continue.")} />
      <S text={t("Ask your AI:", "Hỏi AI:")}><Code text={pr.connected} /></S>
    </Steps>
    <Ok text={t("Your AI says the wallet is connected (CONNECTED).", "AI báo ví đã kết nối (CONNECTED).")} />
  </>;
  return <>
    <H2 text={t("Sign in and claim your Agent ID", "Đăng nhập và nhận Agent ID")} />
    <Steps>
      <S text={t("Open Binance AI in the app (or ai.binance.com), tap Activate.", "Mở Binance AI trong app (hoặc ai.binance.com), bấm Activate.")} />
      <S text={t("Type:", "Gõ:")}><Code text={pr.login} /><p className="t-content">{t("(no wallet yet? create one now)", "(chưa có ví thì tạo luôn)")}</p></S>
      <S text={t("Ask:", "Hỏi:")}><Code text={pr.connected} /></S>
      <S text={t("Claim your Agent ID (app → Wallet → Agent ID banner; name 3–15 characters, lowercase letters and numbers).", "Nhận Agent ID (app → Ví → banner Agent ID; tên 3–15 ký tự, chữ thường và số).")} />
    </Steps>
    <P text={t("By default you can use 250K tokens a week.", "Mặc định bạn dùng được 250K token mỗi tuần.")} />
    <P text={t("**Do it now:** claim your Agent ID to get 2.5 million free AI Pro tokens. These free tokens are FCFS, first come first served, and nobody knows when it ends.", "**Làm ngay:** nhận Agent ID để được tặng 2,5 triệu token AI Pro. Số token tặng này theo FCFS, ai đến trước được trước, chưa biết khi nào kết thúc.")} />
  </>;
}

export function Page5({ titleRef }: TitleRef) {
  const t = useT();
  return <>
    <H1 text={t("Wallet address and Agent ID", "Địa chỉ ví và Agent ID")} titleRef={titleRef} />
    <List items={[
      t("A wallet address is like a mailbox. Anyone who knows it can send to your wallet.", "Địa chỉ ví giống hòm thư. Ai biết địa chỉ thì gửi được vào ví bạn."),
      t("It is a string of letters and numbers that starts with 0x.", "Là một dãy chữ và số, bắt đầu bằng 0x."),
      t("One 0x address is shared across many networks: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon… Solana has its own address.", "Một địa chỉ 0x dùng chung cho nhiều mạng: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon… Solana có địa chỉ riêng."),
      t("Each network is a separate blockchain. Sending on the wrong network can lose your money, so always check the network before you send.", "Mỗi mạng là một blockchain riêng. Gửi nhầm mạng có thể mất tiền, nên luôn kiểm tra mạng trước khi gửi."),
      t("An Agent ID is a short name in place of your address, e.g. you.ai. One name per person, it can't be transferred.", "Agent ID là tên ngắn thay cho địa chỉ, ví dụ you.ai. Mỗi người một tên, không chuyển nhượng được."),
      t("When you finish this book, you record it on the blockchain to get the Agent Academy certificate. That needs an Agent ID.", "Học xong sách này, bạn ghi kết quả lên blockchain để nhận chứng chỉ của Agent Academy. Việc ghi này cần có Agent ID."),
    ]} />
  </>;
}

export function Page6({ track }: { track: Track }) {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Get your wallet address", "Lấy địa chỉ ví")} />
    <Steps>
      {track === "own" && <S text={t("Claim your Agent ID (app → Wallet → Agent ID banner; name 3–15 characters, lowercase letters and numbers).", "Nhận Agent ID (app → Ví → banner Agent ID; tên 3–15 ký tự, chữ thường và số).")} />}
      <S text={t("Ask your AI:", "Hỏi AI:")}><Code text={pr.address} /></S>
      <S text={t("Compare the address your AI gives with the one in the app.", "So địa chỉ AI đưa với địa chỉ trong app.")} />
      <S text={t("Copy the 0x address.", "Chép địa chỉ 0x.")} />
    </Steps>
    <Ok text={t("Your AI gives a table. One 0x address shared by BSC, Ethereum, Base, Arbitrum, Polygon, Robinhood. One separate address for Solana.", "AI đưa một bảng. Một địa chỉ 0x dùng chung cho các mạng BSC, Ethereum, Base, Arbitrum, Polygon, Robinhood. Một địa chỉ riêng cho Solana.")} />
  </>;
}

/** The 0x address box (pages 7 and 12). Checks 0x + 40 hex, saves `wallet`. */
export function WalletInput({ value, onChange, onEnter, err }: { value: string; onChange: (v: string) => void; onEnter?: () => void; err?: string }) {
  const t = useT();
  return <>
    <label className="bk-field">
      <span className="t-label">{t("Your wallet address (0x)", "Địa chỉ ví (địa chỉ 0x của bạn)")}</span>
      <input className="input t-input" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        placeholder="0x…" spellCheck={false} autoComplete="off" />
    </label>
    {err && <p className="t-note" role="alert" style={{ color: "var(--ds-color-red-text)" }}>{err}</p>}
  </>;
}

export function Page7({ wallet, setWallet, titleRef }: { wallet: Address | null; setWallet: (a: Address | null) => void } & TitleRef) {
  const t = useT();
  const [v, setV] = useState(wallet ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<{ status: string; txHash?: string; amount?: string; balance?: string } | null>(null);
  const bad = t("That doesn't look like a wallet address (0x + 40 characters).", "Đây không giống địa chỉ ví (0x + 40 ký tự).");
  const send = async () => {
    const a = v.trim();
    if (!isAddr(a)) return setErr(bad);
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a }) });
      const j = await r.json();
      if (j.error) setErr(j.error); else { setWallet(a as Address); setRes(j); }
    } catch { setErr(t("Couldn't reach the server. Try again in a minute.", "Không kết nối được máy chủ. Thử lại sau một phút.")); }
    setBusy(false);
  };
  const justSave = () => { const a = v.trim(); if (isAddr(a)) { setWallet(a as Address); setRes({ status: "saved" }); setErr(""); } else setErr(bad); };
  // Temporary status words (owner approves).
  const msg: Record<string, ReactNode> = {
    sent: <>{t("Sent ", "Đã gửi ")}<strong>{res?.amount} BNB</strong>. {res?.txHash && <a className="link" href={`${BSCSCAN}/tx/${res.txHash}`} target="_blank" rel="noreferrer">{t("View", "Xem")}</a>}</>,
    already: t("This wallet already got its gas.", "Ví này đã nhận gas rồi."),
    enough: <>{t("Your wallet already has ", "Ví đã có ")}<strong>{res?.balance} BNB</strong>{t(", enough.", ", đủ dùng.")}</>,
    cap: t("Free gas is out for today.", "Hết gas tặng hôm nay."),
    out: t("Free gas is out.", "Hết quỹ gas."),
    limit: t("Too many requests today.", "Quá nhiều yêu cầu hôm nay."),
    saved: t("Saved.", "Đã lưu."),
  };
  const gasOut = res?.status === "cap" || res?.status === "out";
  return <>
    <H1 text="Gas" titleRef={titleRef} />
    <List items={[
      t("Gas is like fuel money. Every write to the blockchain costs gas, paid in BNB.", "Gas giống tiền xăng. Mỗi lần ghi lên blockchain đều tốn gas, trả bằng BNB."),
      t("Gas has 3 levels: low, medium, high.", "Gas có 3 mức: thấp, vừa, cao."),
      t("The real fee is only final when the transaction is done.", "Phí thật chỉ chốt khi giao dịch xong."),
      t("At the end of this book, you record that you finished it on the blockchain to get your certificate. That costs very little gas.", "Cuối sách, bạn ghi kết quả học xong lên blockchain để nhận chứng chỉ. Việc này tốn rất ít gas."),
      t("Agent Academy gives you gas: 0.00025 BNB (under 0.20 USD), once per Agent ID.", "Agent Academy tặng bạn gas: 0,00025 BNB (dưới 0,20 USD), một lần cho mỗi Agent ID."),
    ]} />
    <div className="bk-gas">
      <WalletInput value={v} onChange={(s) => { setV(s); setErr(""); setRes(null); if (isAddr(s.trim())) setWallet(s.trim() as Address); }} onEnter={send} err={err} />
      <div className="actions">
        <button className="btn btn-primary t-button" onClick={send} disabled={busy || gasOut}>{busy && <Loader2 size={16} className="animate-spin" />} {busy ? t("Sending…", "Đang gửi…") : gasOut ? msg[res!.status] : t("Send me gas", "Gửi gas cho tôi")}</button>
        <button className="btn btn-ghost t-button" onClick={justSave}>{t("I have BNB, just save", "Tôi có BNB, chỉ lưu")}</button>
      </div>
      {res && !gasOut && <p className="t-content" role="status" style={{ color: res.status === "limit" ? undefined : "var(--ds-color-green-text)" }}>{msg[res.status] ?? t("Done.", "Xong.")}</p>}
    </div>
  </>;
}

export function Page8() {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Check your gas", "Kiểm tra gas")} />
    <P text={t("Ask your AI:", "Hỏi AI:")} />
    <Code text={pr.balance} />
    <Ok text={t("Your AI gives your BNB balance, the BNB price and the value in USD. If you got gas from Agent Academy, the balance is about 0.00025 BNB.", "AI đưa số dư BNB, giá BNB và giá trị tính ra USD. Nếu đã nhận gas từ Agent Academy, số dư khoảng 0,00025 BNB.")} />
  </>;
}

export function Page9({ titleRef }: TitleRef) {
  const t = useT();
  return <>
    <H1 text={t("Wallet rules", "Luật của ví")} titleRef={titleRef} />
    <List items={[
      t("You set the rules. The AI must follow them and can't change them.", "Bạn đặt luật, AI phải theo, không đổi được."),
      t("The daily limit is the most the AI can use from the wallet in one day.", "Hạn mức mỗi ngày là số tiền tối đa AI được dùng từ ví trong một ngày."),
      t("Each kind of task has its own limit.", "Mỗi loại việc có hạn mức riêng."),
      t("Normal transactions start at 50,000 USD a day.", "Giao dịch thông thường ban đầu là 50.000 USD mỗi ngày."),
      t("Example: you lower it to 100 USD, the AI has used 40, so 60 USD is left even if the wallet holds 1,000 USD. A new day resets it.", "Ví dụ: bạn hạ xuống 100 USD, AI đã dùng 40, còn 60 USD dù ví có 1.000 USD. Sang ngày mới thì làm mới."),
      t("Within the limit, the AI just does it. Over the limit, it is refused or you are asked again.", "Trong hạn mức, AI làm luôn. Vượt hạn mức thì bị từ chối hoặc hỏi lại bạn."),
    ]} />
    <P text={t("So the limit is the most the AI can use from your wallet each day.", "Vì vậy hạn mức là số tiền tối đa AI có thể dùng từ ví của bạn mỗi ngày.")} />
  </>;
}

export function Page10() {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Read your rules", "Đọc luật của bạn")} />
    <P text={t("Ask your AI:", "Hỏi AI:")} />
    <Code text={pr.limit} />
    <Ok text={t("Your AI says the general daily trading limit is 50,000 USD, 0 used, 50,000 USD left. Plus the separate limits for DeFi, Prediction, x402 and Developer Mode.", "AI báo hạn mức giao dịch chung mỗi ngày là 50.000 USD, đã dùng 0, còn lại 50.000 USD. Kèm hạn mức riêng của DeFi, Dự đoán, x402 và Developer Mode.")} />
    <P text={t("Any type the AI marks “off” can't be used yet. To turn it on or change a limit: Binance App → Agentic Wallet → settings icon at the top right.", "Loại nào AI ghi \"tắt\" thì chưa dùng được. Muốn bật hoặc đổi hạn mức: Binance App → Agentic Wallet → biểu tượng cài đặt góc trên bên phải.")} />
  </>;
}

export function Page11({ titleRef }: TitleRef) {
  const t = useT();
  return <>
    <H1 text={t("What is signing?", "Ký là gì?")} titleRef={titleRef} />
    <P text={t("In crypto, your wallet is like a safe. Anything that changes the blockchain, like sending money, swapping coins, or writing data to the blockchain, needs the safe owner's permission.", "Trong crypto, ví của bạn giống một két sắt. Bất cứ việc gì làm thay đổi trên blockchain, như chuyển tiền, đổi coin, hay ghi dữ liệu lên blockchain, đều cần chủ két cho phép.")} />
    <P text={t("That permission is called signing. Like signing a receipt before you swipe your card, or tapping “Agree” in a banking app. Without your signature, nobody, not even the AI, can do anything on their own.", "Sự cho phép đó gọi là ký. Giống như bạn cầm bút ký tên vào hóa đơn trước khi quẹt thẻ, hoặc bấm \"Đồng ý\" trên app ngân hàng. Không có chữ ký của bạn, không ai, kể cả AI, tự ý làm được gì.")} />
    <h3 className="t-header">{t("How you and the AI sign:", "Bạn và AI ký như thế nào:")}</h3>
    <Steps>
      <S text={t("You turn on Developer Mode in the app. Like giving the AI a secondary card: it lasts 7 days and has its own limit. You don't hand the AI the key to the safe.", "Bạn bật Developer Mode trong app. Giống như mở cho AI một thẻ phụ: dùng được 7 ngày và có hạn mức riêng. Bạn không đưa chìa của két cho AI.")} />
      <S text={t("The AI fills in what to record on a draft receipt and shows it to you first.", "AI điền sẵn nội dung cần ghi vào một tờ hóa đơn nháp và đưa bạn xem trước.")} />
      <S text={t("You read it, and if it's right you type “confirm”. That is when you sign.", "Bạn đọc, thấy đúng thì gõ \"xác nhận\". Đó là lúc bạn ký.")} />
    </Steps>
    <h3 className="t-header">{t("Before you type “confirm”:", "Trước khi gõ \"xác nhận\":")}</h3>
    <P text={t("Check for any line saying tokens leave your wallet. If you didn't mean to send tokens but see some leaving, don't confirm.", "Xem có dòng nào báo token bị chuyển đi không. Bạn không định chuyển token mà thấy token bị chuyển đi thì đừng xác nhận.")} />
  </>;
}

/** Page 12. `save` = the copy-and-watch block for step 1 of part 2 (built by the reader: it knows the wallet and the chain). */
export function Page12({ save, status, wallet }: { save: ReactNode; status: ReactNode; wallet?: ReactNode }) {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Turn on Developer Mode and save your progress", "Bật Developer Mode và lưu tiến độ")} />
    <h3 className="t-header">{t("Part 1: Turn on Developer Mode", "Phần 1: Bật Developer Mode")}</h3>
    <Steps>
      <S text={t("Turn on Developer Mode in the app: Agentic Wallet → settings icon at the top right → Developer Mode.", "Bật Developer Mode trong app: Agentic Wallet → biểu tượng cài đặt góc trên bên phải → Developer Mode.")} />
      <S text={t("Ask your AI:", "Hỏi AI:")}><Code text={pr.devLimit} /></S>
    </Steps>
    <Ok text={t("Your AI says the limit is 1,000 USD, 0 used, 1,000 USD left. Developer Mode is on, with an end date. Each successful use extends it.", "AI báo hạn mức 1.000 USD, đã dùng 0, còn lại 1.000 USD. Developer Mode đang bật, kèm ngày hết hạn. Mỗi lần dùng thành công sẽ kéo dài thời hạn.")} />
    <h3 className="t-header">{t("Part 2: Save your progress", "Phần 2: Lưu tiến độ")}</h3>
    {wallet}
    <Steps>
      <S text={t("Send your AI this command:", "Gửi AI lệnh này:")}>{save}</S>
      <S text={t("Your AI shows you a preview. Check whether any token leaves your wallet.", "AI cho bạn xem trước. Đọc xem có token nào bị chuyển đi không.")} />
      <S text={t("If it's right, type “confirm”.", "Thấy đúng thì gõ \"xác nhận\".")} />
    </Steps>
    <Ok text={t("Your AI says it's saved. The book closes and shows your certificate.", "AI báo đã lưu xong. Sách tự đóng và hiện chứng chỉ.")} />
    {status}
  </>;
}
