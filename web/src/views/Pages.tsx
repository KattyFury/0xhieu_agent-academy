// Book #1, the 12 pages (owner's spec 2026-11-24). Vietnamese text is the owner's approved copy, word for word; English is its translation.
// Odd pages = learn (left), even pages = practice (right). Pages 4 and 6 follow the learner's `track` (picked on page 3).
// Status words (gas button, save) and the X share text are temporary: the owner approves them (spec §9.5).
import { useState, type ReactNode, type Ref } from "react";
import type { Address } from "viem";
import { Bot, Check, CircleCheck, CircleX, Copy, Eye, Keyboard, Link2, Loader2, ShieldCheck, Smartphone, User, Wallet } from "lucide-react";
import { BSCSCAN, isAddr } from "../chain";
import { useT } from "../i18n";
import { Btn, Chat, CodeMatch, Connected, Fig, Flow, Help, Meter, Need, Note, Phone, Preview, Rows, Step, Tick, Toggle, Window } from "./Art";

export type Track = "own" | "pro";

/** What the reader hands to a book's pages. `save(i, sentence)` = save point i (wallet box if needed + the command; copy adds the technical block). `status` = the last save's status line. */
export type Ctx = {
  titleRef?: Ref<HTMLHeadingElement>; track: Track; setTrack: (t: Track) => void;
  wallet: Address | null; setWallet: (a: Address | null) => void;
  save: (i: number, sentence: string) => ReactNode; status: ReactNode;
};
/** A book's content: its save points (cumulative masks, the last = all 12 pages), page names, and pages. */
export type BookContent = { saves: bigint[]; usePageNames: (track: Track) => string[]; page: (p: number, which: "learn" | "practice", c: Ctx) => ReactNode };

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
export function Code({ text, copy, onCopied, command }: { text: string; copy?: string; onCopied?: () => void; command?: boolean }) {
  const t = useT();
  return (
    <div className="bk-code">
      <pre className="t-data">{text}</pre>
      <CopyButton text={copy ?? text} label={command ? t("Copy command", "Chép lệnh") : t("Copy prompt", "Chép prompt")} onCopied={onCopied} />
    </div>
  );
}

export const Ok = ({ text }: { text: string }) => {
  const t = useT();
  return <p className="bk-result t-content"><CircleCheck size={18} aria-hidden /><span><strong>{t("Right result:", "Kết quả đúng:")}</strong> <Rich text={text} /></span></p>;
};
export const List = ({ items }: { items: string[] }) => <ul className="bk-list">{items.map((s) => <li key={s} className="t-lead"><Rich text={s} /></li>)}</ul>;
export const P = ({ text }: { text: string }) => <p className="t-lead"><Rich text={text} /></p>;
export const Steps = ({ start = 0, children }: { start?: number; children: ReactNode }) => <ol className="bk-steps bk-steps-tight" style={start ? { counterReset: `s ${start}` } : undefined}>{children}</ol>;
export const S = ({ text, children }: { text?: string; children?: ReactNode }) => <li>{text && <p className="t-content"><Rich text={text} /></p>}{children}</li>;
export type TitleRef = { titleRef?: Ref<HTMLHeadingElement> };
export const H1 = ({ text, titleRef }: { text: string } & TitleRef) => <h1 className="t-page" tabIndex={-1} ref={titleRef} style={{ outline: "none" }}>{text}</h1>;
export const H2 = ({ text }: { text: string }) => <h2 className="t-page">{text}</h2>;

/** One practice question: copy the prompt, send it to your AI, compare with the drawn reply and the right result. */
export function Ask({ title, q, reply, ok, children }: { title: string; q: string; reply: ReactNode; ok: string; children?: ReactNode }) {
  const t = useT();
  return (
    <Step on="ai" title={title} art={<Chat me={q}>{reply}</Chat>}>
      <p className="t-content">{t("Tap Copy, paste it to your AI, send.", "Bấm Chép, dán cho AI, rồi gửi.")}</p>
      <Code text={q} />
      <Ok text={ok} />
      {children}
    </Step>
  );
}
export const Say = ({ text }: { text: string }) => <p className="t-content">{text}</p>;

/** A progress save: the copy block from the reader + how to read the preview. */
export function SaveStep({ title, intro, me, block }: { title: string; intro: string; me: string; block: ReactNode }) {
  const t = useT();
  return (
    <Step on="ai" title={title} art={<Preview me={me} />}>
      <p className="t-content"><Rich text={intro} /></p>
      {block}
      <p className="t-content"><Rich text={t("Your AI shows a preview first. Check **no token leaves your wallet** and **no approval** is asked. All good? Type “confirm”. Anything else? Don't confirm.", "AI cho xem trước. Kiểm tra **không có token nào bị chuyển đi** và **không xin cấp quyền**. Đúng hết thì gõ “xác nhận”. Thấy khác thì đừng xác nhận.")} /></p>
    </Step>
  );
}

/** Fixes for a save that doesn't go through (error codes from the official skill docs). */
export function SaveHelp() {
  const t = useT();
  return <Help items={[
    [t("The AI says Developer Mode is off or expired (351802)", "AI báo Developer Mode đang tắt hoặc hết hạn (351802)"), t("Binance App → Agentic Wallet → settings icon at the top right → turn on Developer Mode. Then send the command again.", "App Binance → Agentic Wallet → biểu tượng cài đặt góc trên bên phải → bật Developer Mode. Rồi gửi lại câu lệnh.")],
    [t("The AI says “execution reverted”", "AI báo “execution reverted”"), t("Usually these pages are already saved, or the wallet has no Agent ID. Reload this page: if it says “Already saved”, you're done.", "Thường là các trang này đã lưu rồi, hoặc ví chưa có Agent ID. Tải lại trang này: thấy “Đã lưu rồi” là xong.")],
    [t("The AI says there isn't enough BNB for gas", "AI báo không đủ BNB để trả gas"), t("Course 1, page 7: enter your wallet to get free gas (once per Agent ID). Or add a little BNB on BNB Smart Chain.", "Khóa học 1, trang 7: nhập ví để nhận gas miễn phí (một lần cho mỗi Agent ID). Hoặc nạp một ít BNB trên mạng BNB Smart Chain.")],
    [t("The AI says PENDING_CONFIRMATION", "AI báo PENDING_CONFIRMATION"), t("Open the Binance App and approve the transaction there. Then ask your AI again.", "Mở app Binance và duyệt giao dịch ở đó. Rồi hỏi lại AI.")],
    [t("The AI says it was blocked as high risk (351803)", "AI báo bị chặn vì rủi ro cao (351803)"), t("Stop. Don't confirm and don't look for a way around it.", "Dừng lại. Đừng xác nhận và đừng tìm cách khác để làm.")],
    [t("I closed the page and missed my certificate", "Lỡ đóng trang, chưa thấy chứng chỉ"), t("Tap Certificate at the top of the site and paste your wallet address.", "Bấm Chứng chỉ ở thanh trên cùng của trang và dán địa chỉ ví.")],
  ]} />;
}

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
    save: t("Save my learning progress on Agent Academy: finished pages 1 to 12 of course 1.", "Lưu tiến độ học của tôi trên Agent Academy: đã xong trang 1 đến 12 của khóa học 1."),
  };
};

/** Page titles in reading order (12). Pages 4 and 6 depend on the track. */
function usePageNames(track: Track) {
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
    <P text={t("Give the AI a crypto wallet (crypto = digital money such as Bitcoin, BNB, USDT), and you can tell it to manage your crypto for you:", "Nếu đưa cho AI một cái ví crypto (crypto = tiền số, ví dụ Bitcoin, BNB, USDT), bạn có thể ra lệnh để AI quản lý crypto giúp bạn:")} />
    <Fig><Flow items={[[User, t("You give an order", "Bạn ra lệnh")], [Bot, t("The AI does it", "AI làm")], [Wallet, t("in your wallet", "trên ví của bạn")]]} /></Fig>
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
    <P text={t("You set these limits yourself in the Binance App. The AI can see them but can't change them.", "Các giới hạn này do bạn tự đặt trong app Binance. AI chỉ xem được, không sửa được.")} />
    <Fig><Flow items={[[Smartphone, t("You set the limit in the app", "Bạn đặt hạn mức trong app")], [Bot, t("The AI can only read it", "AI chỉ đọc được")], [ShieldCheck, t("It spends only within the limit", "AI chỉ tiêu trong hạn mức")]]} /></Fig>
  </>;
}

export function Page3({ track, setTrack, titleRef }: { track: Track; setTrack: (t: Track) => void } & TitleRef) {
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
    <P text={t("Binance Agentic Wallet is a new wallet just for the AI. It is separate from the Binance Wallet you may already have (MPC Wallet).", "Binance Agentic Wallet là một ví mới, riêng cho AI. Nó tách biệt với ví Binance Wallet bạn có thể đang dùng (MPC Wallet).")} />
    <P text={t("Pick one of two paths. The next pages show only the path you pick.", "Chọn một trong hai đường. Bạn chọn đường nào thì các trang sau chỉ hiện đường đó.")} />
    <P text={t("**New to this?** Never used Claude Code, Codex or Gemini CLI? Pick **Binance AI Pro**: nothing to install.", "**Mới làm quen?** Chưa từng dùng Claude Code, Codex hay Gemini CLI thì chọn **Binance AI Pro**: không cần cài gì.")} />
    <div className="setup-cards">
      {card("own", t("Your own AI", "AI của bạn"), t("If you code", "Cho người rành máy tính"), "Claude Code, Codex, Gemini CLI…",
        [t("Use the AI you already know", "Dùng AI bạn đã quen"), t("Can do every step", "Làm được mọi bước")],
        [t("Needs Node.js 18+ and the skill", "Phải cài Node.js 18+ và skill"), t("Needs a computer", "Cần có máy tính")],
        t("Choose your own AI", "Chọn AI của bạn"))}
      {card("pro", "Binance AI Pro", t("Easiest", "Dễ nhất"), t("Chat with AI right in the Binance App or website", "Chat với AI ngay trong app hoặc web Binance"),
        [t("Ready to use, nothing to install", "Có sẵn, không cần cài"), t("Claim an Agent ID and get 2.5 million free AI tokens (AI usage credits, not crypto). Free tokens are FCFS.", "Nhận Agent ID được tặng 2,5 triệu token AI (lượt dùng AI, không phải tiền crypto). Số token tặng theo FCFS.")],
        [t("Only 250K AI tokens a week by default, then you pay", "Mặc định chỉ 250K token AI mỗi tuần, hết phải mua"), t("May not be available in your country yet", "Có thể chưa dùng được ở nước bạn")],
        t("Choose Binance AI Pro", "Chọn Binance AI Pro"))}
    </div>
  </>;
}

export function Page4({ track }: { track: Track }) {
  const t = useT();
  const pr = usePrompts();
  const notYet: [string, string] = [t("The app says signed in, but the AI says not connected", "App báo xong, nhưng AI báo chưa kết nối"), t("Believe the AI. Tell it: “Sign in again”.", "Tin theo AI. Nói với nó: “Đăng nhập lại”.")];
  if (track === "own") return <>
    <H2 text={t("Install and sign in", "Cài và đăng nhập")} />
    <Need items={[
      ["pc", t("A computer", "Một máy tính")],
      ["ai", t("Claude Code, Codex or Gemini CLI, already working on it", "Claude Code, Codex hoặc Gemini CLI đã dùng được trên máy đó")],
      ["phone", t("A phone with the Binance App, signed in", "Điện thoại có app Binance, đã đăng nhập")],
    ]}>
      <p className="t-content">{t("Don't have these AI tools? The normal ChatGPT or Gemini web chat won't work. Go back to page 3 and pick Binance AI Pro.", "Chưa có mấy AI này? Chat ChatGPT hay Gemini trên web không làm được. Quay lại trang 3, chọn Binance AI Pro.")}</p>
    </Need>
    <Steps>
      <Step on="pc" title={t("Teach your AI to use the wallet", "Dạy AI cách dùng ví")} art={<Chat me={t("Install the wallet skill for me", "Cài skill ví giúp tôi")}><p className="art-ok t-content"><Check size={16} aria-hidden /> {t("Installed", "Cài xong")}</p></Chat>}>
        <p className="t-content">{t("A “skill” is a guide pack that shows your AI how to use the wallet. Tap Copy, paste into your AI, press Enter.", "“Skill” là gói hướng dẫn để AI biết dùng ví. Bấm Chép, dán vào khung chat của AI, rồi nhấn Enter.")}</p>
        <Code text={t("Install the Binance wallet skill for me.", "Cài skill ví Binance giúp tôi.")} copy={t(`Install the Binance wallet skill for me by running the command below. If my computer is missing something (like Node.js 18+), guide me one step at a time:\n${INSTALL}`, `Cài skill ví Binance giúp tôi bằng lệnh dưới đây. Máy thiếu gì (ví dụ Node.js 18+) thì hướng dẫn tôi từng bước một:\n${INSTALL}`)} />
        <p className="t-content">{t("The copy also includes the install command. If the AI asks permission to run it, allow it. Wait until it says it's installed (its words may differ from the picture).", "Khi chép sẽ có kèm lệnh cài. AI xin phép chạy lệnh thì đồng ý. Chờ đến khi nó báo cài xong (câu chữ có thể khác hình).")}</p>
      </Step>
      <Step on="pc" title={t("Ask your AI to sign in", "Bảo AI đăng nhập")} art={<Chat me={pr.login}><p className="t-content">{t("Open this link and scan the QR code with the Binance App. Pairing code:", "Mở link này và quét mã QR bằng app Binance. Mã ghép cặp:")}</p><p className="art-status sw-label">654321</p><p className="t-content">{t("Confirm only if the app shows the same code.", "Chỉ xác nhận nếu app hiện đúng mã này.")}</p></Chat>}>
        <Code text={pr.login} />
        <p className="t-content">{t("The AI gives you a link and a 6-character code. Keep the code on screen.", "AI đưa một đường link và mã 6 ký tự. Để mã đó trên màn hình.")}</p>
      </Step>
      <Step on="phone" title={t("Scan the QR code, compare the codes", "Quét mã QR, so hai mã")} art={<CodeMatch code="654321" other="908172" />}>
        <p className="t-content">{t("On your computer, click the AI's link. A web page opens with a QR code (a square pattern). Scan it with the Binance App on your phone. First time? The app helps you create the wallet.", "Trên máy tính, bấm vào link AI đưa. Trang web mở ra có mã QR (ô vuông chấm đen). Dùng app Binance trên điện thoại quét mã đó. Lần đầu thì app sẽ hướng dẫn bạn tạo ví.")}</p>
        <p className="t-content">{t("The app shows a code. It must be exactly the one your AI gave you.", "App hiện một mã. Mã này phải giống hệt mã AI đưa.")}</p>
        <p className="art-stop t-content">{t("Didn't ask to sign in, or see an unknown IP warning? Don't confirm.", "Bạn không hề yêu cầu đăng nhập, hoặc thấy cảnh báo IP lạ? Đừng xác nhận.")}</p>
      </Step>
      <Step on="phone" title={t("Turn on Secure Auto Sign", "Bật Secure Auto Sign")} art={<Phone title="Binance App"><Toggle text="Secure Auto Sign" /><Tick text={t("Box 1", "Ô 1")} /><Tick text={t("Box 2", "Ô 2")} /><Tick text={t("Box 3", "Ô 3")} /><Btn text="Continue" /></Phone>}>
        <p className="t-content">{t("This lets your AI do small tasks by itself, within your limit. Tick the 3 boxes, then tap Continue.", "Bật cái này để AI tự làm việc nhỏ, trong hạn mức của ví. Tick đủ 3 ô, rồi bấm Continue.")}</p>
      </Step>
      <Step on="pc" title={t("Check that it worked", "Kiểm tra đã được chưa")} art={<Chat me={pr.connected}><Connected /></Chat>}>
        <Code text={pr.connected} />
        <p className="t-content">{t("The AI says CONNECTED? You're done with this page.", "AI báo CONNECTED (đã kết nối) là bạn xong trang này.")}</p>
      </Step>
    </Steps>
    <Help items={[
      [t("The install shows an error", "Cài bị báo lỗi"), t("Copy the whole error, send it to your AI and say: “Explain this simply and help me fix it”.", "Chép nguyên dòng lỗi, gửi cho AI và nói: “Giải thích đơn giản và giúp tôi sửa”.")],
      [t("The link or code stopped working", "Link hoặc mã không dùng được nữa"), t("A code lasts about 5 minutes. Tell your AI: “Sign in again”. Use the new link and code.", "Mã chỉ dùng được khoảng 5 phút. Nói với AI: “Đăng nhập lại”. Rồi dùng link và mã mới.")],
      notYet,
    ]} />
    <Note />
  </>;
  return <>
    <H2 text={t("Sign in and claim your Agent ID", "Đăng nhập và nhận Agent ID")} />
    <Need items={[
      ["phone", t("A phone with the Binance App, signed in", "Điện thoại có app Binance, đã đăng nhập")],
      ["ai", t("Binance AI Pro (may not be available in your country yet)", "Binance AI Pro (có thể chưa dùng được ở nước bạn)")],
    ]} />
    <Steps>
      <Step on="any" title={t("Open Binance AI", "Mở Binance AI")} art={<Window label="ai.binance.com"><Btn text="Activate" /></Window>}>
        <p className="t-content">{t("Open Binance AI in the app, or type ai.binance.com in your browser. Tap Activate.", "Mở Binance AI trong app, hoặc gõ ai.binance.com trên trình duyệt. Bấm Activate.")}</p>
      </Step>
      <Step on="any" title={t("Ask it to sign in", "Bảo AI đăng nhập")} art={<Chat me={pr.login}><p className="t-content">{t("Finish confirming in the sign-in card.", "Hoàn tất xác nhận trong thẻ đăng nhập.")}</p><p className="art-ok t-content"><Check size={16} aria-hidden /> {t("Signed in", "Đăng nhập thành công")}</p></Chat>}>
        <Code text={pr.login} />
        <p className="t-content">{t("A sign-in card opens in the chat. Follow it. No wallet yet? Create one now.", "Một thẻ đăng nhập hiện ra ngay trong chat. Làm theo thẻ. Chưa có ví thì tạo luôn.")}</p>
      </Step>
      <Step on="any" title={t("Check that it worked", "Kiểm tra đã được chưa")} art={<Chat me={pr.connected}><Connected /></Chat>}>
        <Code text={pr.connected} />
        <p className="t-content">{t("The AI should say CONNECTED.", "AI phải báo CONNECTED (đã kết nối).")}</p>
      </Step>
      <Step on="phone" title={t("Claim your Agent ID", "Nhận Agent ID")} art={<Phone title="Binance App"><p className="t-content">{t("Wallet → Agent ID banner", "Ví → banner Agent ID")}</p><p className="art-status sw-label">YOU.AI</p></Phone>}>
        <p className="t-content">{t("An Agent ID is a short name for your wallet. In the app: Wallet → Agent ID banner. Use 3–15 lowercase letters or numbers.", "Agent ID là tên ngắn cho ví của bạn. Trong app: Ví → banner Agent ID. Đặt tên 3–15 ký tự, chữ thường hoặc số.")}</p>
      </Step>
    </Steps>
    <Help items={[notYet]} />
    <P text={t("By default you can use 250K AI tokens (AI usage credits) a week.", "Mặc định bạn dùng được 250K token AI (lượt dùng AI) mỗi tuần.")} />
    <P text={t("**Do it now:** claim your Agent ID to get 2.5 million free AI Pro tokens. These free tokens are FCFS, first come first served, and nobody knows when it ends.", "**Làm ngay:** nhận Agent ID để được tặng 2,5 triệu token AI Pro. Số token tặng này theo FCFS, ai đến trước được trước, chưa biết khi nào kết thúc.")} />
    <Note />
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
      t("When you finish this course, you record it on the blockchain to get the Agent Academy certificate. That needs an Agent ID.", "Học xong khóa học này, bạn ghi kết quả lên blockchain để nhận chứng chỉ của Agent Academy. Việc ghi này cần có Agent ID."),
    ]} />
    <Fig>
      <div className="art-win art-body">
        <Rows rows={[[t("Short name (Agent ID)", "Tên ngắn (Agent ID)"), "you.ai"], [t("Wallet address", "Địa chỉ ví"), "0x12ab…9f3c"]]} />
        <p className="t-content">{t("Two ways to point to the same wallet. A real address is 42 characters; the middle is cut here.", "Hai cách gọi cùng một ví. Địa chỉ thật dài 42 ký tự, ở đây cắt bớt phần giữa.")}</p>
      </div>
    </Fig>
  </>;
}

export function Page6({ track }: { track: Track }) {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Get your wallet address", "Lấy địa chỉ ví")} />
    <Steps>
      {track === "own" && <Step on="phone" title={t("Claim your Agent ID", "Nhận Agent ID")} art={<Phone title="Binance App"><p className="t-content">{t("Wallet → Agent ID banner", "Ví → banner Agent ID")}</p><p className="art-status sw-label">YOU.AI</p></Phone>}>
        <p className="t-content">{t("In the app: Wallet → Agent ID banner. Use 3–15 lowercase letters or numbers. Saving your progress later needs it.", "Trong app: Ví → banner Agent ID. Đặt tên 3–15 ký tự, chữ thường hoặc số. Lúc lưu tiến độ sẽ cần nó.")}</p>
      </Step>}
      <Ask title={t("Ask for your wallet address", "Hỏi địa chỉ ví")} q={pr.address}
        reply={<><Say text={t("Your Agentic Wallet addresses:", "Địa chỉ ví Agentic Wallet của bạn:")} /><Rows rows={[[t("BSC, Ethereum, Base, Arbitrum, Polygon… (11 networks)", "BSC, Ethereum, Base, Arbitrum, Polygon… (11 mạng)"), "0x12aB…9f3C"], ["Solana", "7xKp…3mQe"]]} /><Say text={t("Send only on the matching network, or the money may be lost.", "Chỉ gửi đúng mạng, nếu không có thể mất tiền.")} /></>}
        ok={t("Your AI lists your addresses by network. One 0x address shared by many networks (BSC, Ethereum, Base, Arbitrum, Polygon…). One separate address for Solana.", "AI liệt kê địa chỉ theo từng mạng. Một địa chỉ 0x dùng chung cho nhiều mạng (BSC, Ethereum, Base, Arbitrum, Polygon…). Một địa chỉ riêng cho Solana.")} />
      <Step on="any" title={t("Copy the 0x address", "Chép địa chỉ 0x")}>
        <p className="t-content">{t("Copy the address that starts with 0x (the BSC row). Next page asks for it. If you can, check it matches the address shown in the app.", "Chép địa chỉ bắt đầu bằng 0x (dòng BSC). Trang sau sẽ cần nó. Nếu được, so xem có giống địa chỉ trong app không.")}</p>
      </Step>
    </Steps>
    <Note />
  </>;
}

/** The 0x address box (pages 7 and 12). Checks 0x + 40 hex, saves `wallet`. */
export function WalletInput({ value, onChange, onEnter, err }: { value: string; onChange: (v: string) => void; onEnter?: () => void; err?: string }) {
  const t = useT();
  return <>
    <label className="bk-field">
      <span className="t-label">{t("Your wallet address (0x)", "Địa chỉ ví (0x)")}</span>
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
  // One button: save the wallet, then the server sends a little gas only if the wallet has none (Agent ID wallets, once each).
  const submit = async () => {
    const a = v.trim();
    if (!isAddr(a)) return setErr(bad);
    setWallet(a as Address);
    setBusy(true); setErr(""); setRes(null);
    try {
      const r = await fetch("/api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a }) });
      setRes(await r.json());
    } catch { setRes({ status: "error" }); }
    setBusy(false);
  };
  // Temporary status words (owner approves).
  const msg: Record<string, ReactNode> = {
    sent: <>{t("Wallet saved. Sent you ", "Đã lưu ví và gửi bạn ")}<strong>{res?.amount} BNB</strong>{t(" for gas. ", " làm gas. ")}{res?.txHash && <a className="link" href={`${BSCSCAN}/tx/${res.txHash}`} target="_blank" rel="noreferrer">{t("View", "Xem")}</a>}</>,
    enough: <>{t("Wallet saved. It already has ", "Đã lưu ví. Ví đã có ")}<strong>{res?.balance} BNB</strong>{t(" for gas, so no gas is sent.", " làm gas nên không được tặng thêm.")}</>,
    already: t("Wallet saved. This wallet already got its gas.", "Đã lưu ví. Ví này đã nhận gas rồi."),
    "no-agent-id": t("Wallet saved. This wallet has no Agent ID yet, so no gas is sent. Claim your Agent ID in the app first.", "Đã lưu ví. Ví này chưa có Agent ID nên chưa được tặng gas. Nhận Agent ID trong app trước."),
    cap: t("Wallet saved. Free gas is out for today.", "Đã lưu ví. Hết gas tặng hôm nay."),
    out: t("Wallet saved. Free gas is out.", "Đã lưu ví. Hết quỹ gas."),
    limit: t("Wallet saved. Too many requests today.", "Đã lưu ví. Quá nhiều yêu cầu hôm nay."),
    error: t("Wallet saved. Couldn't send gas right now. Try again in a minute.", "Đã lưu ví. Chưa gửi được gas, thử lại sau một phút."),
  };
  const good = res?.status === "sent" || res?.status === "enough" || res?.status === "already";
  return <>
    <H1 text="Gas" titleRef={titleRef} />
    <List items={[
      t("Gas is like fuel money. Every write to the blockchain costs gas, paid in BNB.", "Gas giống tiền xăng. Mỗi lần ghi lên blockchain đều tốn gas, trả bằng BNB."),
      t("Gas has 3 levels: low, medium, high.", "Gas có 3 mức: thấp, vừa, cao."),
      t("The real fee is only final when the transaction is done.", "Phí thật chỉ chốt khi giao dịch xong."),
      t("At the end of this course, you record that you finished it on the blockchain to get your certificate. That costs very little gas.", "Cuối khóa học, bạn ghi kết quả học xong lên blockchain để nhận chứng chỉ. Việc này tốn rất ít gas."),
      t("No BNB for gas yet? Agent Academy gives you 0.00025 BNB (under 0.20 USD), once per Agent ID. Wallets that already have BNB don't get it.", "Chưa có BNB làm gas? Agent Academy tặng bạn 0,00025 BNB (dưới 0,20 USD), một lần cho mỗi Agent ID. Ví đã có BNB thì không được tặng."),
    ]} />
    <div className="bk-gas">
      <p className="t-content"><Rich text={t("**Do it now:** paste the 0x address you copied on page 6, then tap Enter wallet.", "**Làm ngay:** dán địa chỉ 0x đã chép ở trang 6 vào ô dưới, rồi bấm Nhập ví.")} /></p>
      <WalletInput value={v} onChange={(s) => { setV(s); setErr(""); setRes(null); if (isAddr(s.trim())) setWallet(s.trim() as Address); }} onEnter={submit} err={err} />
      <div className="actions">
        <button className="btn btn-primary t-button" onClick={submit} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} {t("Enter wallet", "Nhập ví")}</button>
      </div>
      {res && <p className="t-content" role="status" style={good ? { color: "var(--ds-color-green-text)" } : undefined}>{msg[res.status] ?? msg.error}</p>}
    </div>
  </>;
}

export function Page8() {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Check your gas", "Kiểm tra gas")} />
    <Steps>
      <Ask title={t("Ask for your BNB balance", "Hỏi số dư BNB")} q={pr.balance}
        reply={<Say text={t("Your BNB on BNB Smart Chain: 0.00025 BNB, about 0.14 USD (BNB price about 550 USD).", "BNB của bạn trên BNB Smart Chain: 0,00025 BNB, khoảng 0,14 USD (giá BNB khoảng 550 USD).")} />}
        ok={t("Your AI gives your BNB balance, the BNB price and the value in USD. If you got gas from Agent Academy, the balance is about 0.00025 BNB.", "AI đưa số dư BNB, giá BNB và giá trị tính ra USD. Nếu đã nhận gas từ Agent Academy, số dư khoảng 0,00025 BNB.")} />
    </Steps>
    <Help items={[[t("The balance is 0", "Số dư bằng 0"), t("Go back to page 7 and tap Enter wallet. Wait a minute, then ask again. Still 0? Add a little BNB on BNB Smart Chain.", "Quay lại trang 7, bấm Nhập ví. Chờ một phút rồi hỏi lại. Vẫn 0 thì nạp một ít BNB trên mạng BNB Smart Chain.")]]} />
    <Note />
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
      t("Within the limit, the AI just does it. Over the limit, it is refused or you are asked again.", "Trong hạn mức, AI làm luôn. Vượt hạn mức thì bị từ chối hoặc hỏi lại bạn."),
    ]} />
    <P text={t("Example: you lower it to 100 USD, the AI has used 40, so 60 USD is left even if the wallet holds 1,000 USD. A new day resets it.", "Ví dụ: bạn hạ xuống 100 USD, AI đã dùng 40, còn 60 USD dù ví có 1.000 USD. Sang ngày mới thì làm mới.")} />
    <Fig><Meter limit={100} used={40} /></Fig>
    <P text={t("So the limit is the most the AI can use from your wallet each day.", "Vì vậy hạn mức là số tiền tối đa AI có thể dùng từ ví của bạn mỗi ngày.")} />
  </>;
}

export function Page10() {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Read your rules", "Đọc luật của bạn")} />
    <Steps>
      <Ask title={t("Ask for your daily limit", "Hỏi hạn mức mỗi ngày")} q={pr.limit}
        reply={<><Say text={t("Your daily limits (used today: 0):", "Hạn mức mỗi ngày của bạn (hôm nay đã dùng 0):")} /><Rows rows={[[t("General trading", "Giao dịch chung"), t("50,000 USD", "50.000 USD")], ["DeFi", t("5,000 USD", "5.000 USD")], [t("Prediction (off)", "Dự đoán (đang tắt)"), t("5,000 USD", "5.000 USD")], ["x402", "20 USD"], ["Developer Mode", t("1,000 USD", "1.000 USD")]]} /></>}
        ok={t("Your AI says the general daily trading limit is 50,000 USD, 0 used, 50,000 USD left. Plus the separate limits for DeFi, Prediction, x402 and Developer Mode.", "AI báo hạn mức giao dịch chung mỗi ngày là 50.000 USD, đã dùng 0, còn lại 50.000 USD. Kèm hạn mức riêng của DeFi, Dự đoán, x402 và Developer Mode.")} />
    </Steps>
    <P text={t("Any type the AI marks “off” can't be used yet. To turn it on or change a limit: Binance App → Agentic Wallet → settings icon at the top right.", "Loại nào AI ghi \"tắt\" thì chưa dùng được. Muốn bật hoặc đổi hạn mức: Binance App → Agentic Wallet → biểu tượng cài đặt góc trên bên phải.")} />
    <Note />
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
    <Fig><Flow items={[[Bot, t("AI writes a draft", "AI soạn nháp")], [Eye, t("You read it", "Bạn đọc")], [Keyboard, t("You type “confirm”", "Bạn gõ “xác nhận”")], [Link2, t("Written on the blockchain", "Ghi lên blockchain")]]} /></Fig>
    <h3 className="t-header">{t("Before you type “confirm”:", "Trước khi gõ \"xác nhận\":")}</h3>
    <P text={t("Check for any line saying tokens leave your wallet. If you didn't mean to send tokens but see some leaving, don't confirm.", "Xem có dòng nào báo token bị chuyển đi không. Bạn không định chuyển token mà thấy token bị chuyển đi thì đừng xác nhận.")} />
  </>;
}

/** Page 12. `save` = the copy-and-watch block for step 1 of part 2 (built by the reader: it knows the wallet and the chain). */
export function Page12({ save, status }: Pick<Ctx, "save" | "status">) {
  const t = useT();
  const pr = usePrompts();
  return <>
    <H2 text={t("Turn on Developer Mode and save your progress", "Bật Developer Mode và lưu tiến độ")} />
    <P text={t("Last page. Turn on the AI's “secondary card”, then sign once to save your progress and get the certificate.", "Trang cuối. Bật “thẻ phụ” cho AI, rồi ký một lần để lưu tiến độ và nhận chứng chỉ.")} />
    <h3 className="t-header">{t("Part 1: Turn on Developer Mode", "Phần 1: Bật Developer Mode")}</h3>
    <Steps>
      <Step on="phone" title={t("Turn on Developer Mode", "Bật Developer Mode")} art={<Phone title="Agentic Wallet"><p className="t-content">{t("Settings (top right)", "Cài đặt (góc trên bên phải)")}</p><Toggle text="Developer Mode" /></Phone>}>
        <p className="t-content">{t("In the app: Agentic Wallet → settings icon at the top right → Developer Mode. It lets the AI sign things like saving your progress, lasts 7 days and has its own limit.", "Trong app: Agentic Wallet → biểu tượng cài đặt góc trên bên phải → Developer Mode. Nó cho AI ký những việc như lưu tiến độ, dùng được 7 ngày và có hạn mức riêng.")}</p>
      </Step>
      <Ask title={t("Check it's on", "Kiểm tra đã bật")} q={pr.devLimit}
        reply={<Say text={t("Developer Mode is on until Dec 4. Daily limit 1,000 USD, 0 used today. Each successful use extends it.", "Developer Mode đang bật đến 04/12. Hạn mức 1.000 USD mỗi ngày, hôm nay đã dùng 0. Mỗi lần dùng thành công sẽ được gia hạn.")} />}
        ok={t("Your AI says the limit is 1,000 USD, 0 used, 1,000 USD left. Developer Mode is on, with an end date. Each successful use extends it.", "AI báo hạn mức 1.000 USD, đã dùng 0, còn lại 1.000 USD. Developer Mode đang bật, kèm ngày hết hạn. Mỗi lần dùng thành công sẽ kéo dài thời hạn.")} />
    </Steps>
    <h3 className="t-header">{t("Part 2: Save your progress", "Phần 2: Lưu tiến độ")}</h3>
    <Steps start={2}>
      <SaveStep title={t("Save and get your certificate", "Lưu và nhận chứng chỉ")} me={pr.save} block={save(0, pr.save)}
        intro={t("Tap Copy below, paste it to your AI, send. The copy includes the technical details the AI needs.", "Bấm Chép bên dưới, dán cho AI, rồi gửi. Khi chép sẽ có kèm thông tin kỹ thuật AI cần.")} />
    </Steps>
    <Ok text={t("Your AI says it's saved. Your certificate opens.", "AI báo đã lưu xong. Chứng chỉ hiện ra.")} />
    {status}
    <SaveHelp />
    <Note />
  </>;
}

export const book1: BookContent = {
  saves: [0xfffn], // one save, page 12
  usePageNames,
  page: (p, which, c) => {
    switch (`${p}${which[0]}`) {
      case "0l": return <Page1 titleRef={c.titleRef} />;
      case "0p": return <Page2 />;
      case "1l": return <Page3 track={c.track} setTrack={c.setTrack} titleRef={c.titleRef} />;
      case "1p": return <Page4 track={c.track} />;
      case "2l": return <Page5 titleRef={c.titleRef} />;
      case "2p": return <Page6 track={c.track} />;
      case "3l": return <Page7 wallet={c.wallet} setWallet={c.setWallet} titleRef={c.titleRef} />;
      case "3p": return <Page8 />;
      case "4l": return <Page9 titleRef={c.titleRef} />;
      case "4p": return <Page10 />;
      case "5l": return <Page11 titleRef={c.titleRef} />;
      default: return <Page12 save={c.save} status={c.status} />;
    }
  },
};
