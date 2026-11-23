// Book #1 content (en). Owner's v2 (2026-11-23), rewritten ELI12. Sources: Binance Agentic Wallet Introduction + Install pages,
// binance-agentic-wallet skill v1.15.0 (SKILL.md + references), hackathon disclaimer; commands checked with read-only baw runs.
// 10 spreads = 20 pages: 9 lessons + the ending. Saves at pages 6, 12 and 18 (see SAVE_STEPS in chain.ts).
// Spreads 1-2 (setup, with inputs) live in views/Onboard.tsx; every other spread is a `Day` below (`day` = spread index + 1).

/** Icon names for lesson points and steps; mapped to Lucide icons in Reader.tsx. */
export type IconKey = "bot" | "card" | "shield" | "key" | "zap" | "sliders" | "logout" | "flag" | "list" | "award" | "landmark" | "share" | "network" | "alert" | "coins" | "layers" | "eyeOff" | "wallet" | "history" | "hourglass" | "fuel" | "gauge" | "scale" | "user" | "fileCheck" | "clock" | "infinity" | "help" | "lock" | "unlock" | "smartphone" | "receipt" | "activity" | "search" | "piggy" | "percent" | "eye" | "atSign" | "link" | "hand" | "message";
export type Point = { icon: IconKey; text: string };
export type Step = { title: string; text: string; prompt?: string; icon?: IconKey };
export type Day = {
  day: number; // spread index + 1
  title: string;
  goal: string;
  learn: { paragraphs: string[]; points?: Point[]; flow?: string[]; remember: string[] };
  practice: { minutes: number; title?: string; riskText?: string; steps: Step[]; check?: string; ifNot?: string; recordText?: string };
};
export type Book = { id: number; number: string; title: string; days: Day[] };

const RO = "Read data only. Do NOT send, sign or confirm any transaction.";

export const book001: Book = {
  id: 1, // on-chain bookId
  number: "#1",
  title: "Learn Binance Agentic Wallet",
  days: [
    {
      day: 1,
      title: "What is Binance Agentic Wallet?",
      goal: "Know what it does before you install it.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "bot", text: "Your **AI uses this wallet for you**. Just ask, like “show my balance”." },
          { icon: "card", text: "It's like a **card with a daily limit**. **You** set the limit in the Binance app." },
          { icon: "key", text: "The AI **never holds the key**. It's split up and kept safe (**MPC Keyless**)." },
        ],
        remember: [],
      },
      practice: {
        minutes: 2,
        title: "Quick check",
        steps: [
          { icon: "key", title: "Can the AI take your Binance Agentic Wallet's key out?", text: "No. The key can't be taken out." },
          { icon: "sliders", title: "Who can change the daily limit?", text: "Only you, in the Binance app. The AI can only read it." },
          { icon: "logout", title: "What happens if you sign out?", text: "The AI loses access to your Binance Agentic Wallet." },
        ],
      },
    },
    {
      day: 4,
      title: "Your wallet addresses",
      goal: "Find your addresses. Learn why sharing them is safe.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "landmark", text: "An address is like a **bank account number**. People can send to it, but **can't take** from it. So it's **safe to share**." },
          { icon: "network", text: "One **EVM address** works on BNB Smart Chain, Ethereum, Base and more. **Solana** has its own." },
          { icon: "alert", text: "Networks are like **different banks**. Wrong network can lose money. **Always check it.**" },
        ],
        remember: [],
      },
      practice: {
        minutes: 3,
        title: "Find your addresses",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: show my wallet address for every supported network, tell me which networks share the same address, and show them in a small table. ${RO}` }],
        check: "A table with one shared EVM address and one Solana address. Compare it with the Agentic Wallet screen in the Binance app.",
      },
    },
    {
      day: 5,
      title: "Balances, history and gas",
      goal: "See what you hold, what happened, and today's fees.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "coins", text: "Your AI lists each token with its **network** and **USD value**. Each network is **its own pocket**." },
          { icon: "history", text: "**History** is your diary. **Pending** = still waiting. Only **confirmed** is done." },
          { icon: "fuel", text: "**Gas** has 3 levels: low, medium, high. The final fee is set at the end." },
        ],
        remember: [],
      },
      practice: {
        minutes: 4,
        title: "Read balances, history and gas",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: show my token balances on BNB Smart Chain with USD value, my 5 most recent confirmed transactions with time, type and network fee, and the current gas price at low, medium and high. ${RO}` }],
        check: "Balances, up to 5 transactions, and 3 gas levels.",
      },
    },
    {
      day: 6,
      title: "Your wallet's rules",
      goal: "Read the limits your AI must follow.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "gauge", text: "Your wallet has a **daily limit**." },
          { icon: "scale", text: "**Limit left isn't your balance.** $60 left = the AI can use only $60." },
          { icon: "user", text: "**Only you change the rules**, in the app." },
        ],
        remember: [],
      },
      practice: {
        minutes: 4,
        title: "Read your rules",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: read my wallet settings and show a table with each limit type, its daily limit, used today and left today. Then tell me how abnormal transactions are handled and when my session expires. ${RO}` }],
        check: "A table of your limits. Open Settings in the Binance app and compare the numbers.",
      },
    },
    {
      day: 7,
      title: "Approvals and locks",
      goal: "See who can spend your tokens, and why your wallet waits.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "fileCheck", text: "An **approval** is a permission slip: an app can take some of one token until you cancel it." },
          { icon: "infinity", text: "**Unlimited** = the app can take all of that token. Unknown spender? **Stop.**" },
          { icon: "lock", text: "Wallet **locked** = an earlier transaction is still pending. It waits until it's done." },
        ],
        remember: [],
      },
      practice: {
        minutes: 4,
        title: "Check approvals and lock",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: "Using Binance Agentic Wallet: list my token approvals with token, spender, amount and risk level, and check whether my wallet is locked on BNB Smart Chain with any pending transactions. Read data only. Do NOT send, sign, confirm, revoke, speed up or cancel anything." }],
        check: "A list of approvals (none is normal) and Unlocked with nothing pending.",
      },
    },
    {
      day: 8,
      title: "Quotes and DeFi, preview only",
      goal: "Read a price and a DeFi deal without sending anything.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "receipt", text: "A **quote** is a price estimate: what you put in, **about** what you get. **Slippage** is the move you accept." },
          { icon: "eye", text: "A **preview** shows the balance change, the fee and the contract. **Nothing is sent.**" },
          { icon: "alert", text: "**High APY isn't free money.** Big TVL isn't safe." },
        ],
        remember: [],
      },
      practice: {
        minutes: 5,
        title: "Read a quote and a preview",
        riskText: "Trading and DeFi can lose money. Quote and preview only, not advice.",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: "Using Binance Agentic Wallet: get a quote to swap 0.001 BNB to USDT on BNB Smart Chain, then list 3 DeFi protocols with TVL and max APY. Quote and preview only. Do NOT swap, deposit, send, sign or confirm any transaction." }],
        check: "A BNB-to-USDT quote (slippage auto) and 3 DeFi apps. Nothing is sent.",
        ifNot: "If the AI tries to swap for real, tell it to stop.",
      },
    },
    {
      day: 9,
      title: "Staying safe",
      goal: "Learn to check before you confirm.",
      learn: {
        paragraphs: [],
        points: [
          { icon: "list", text: "Before you OK anything, check **4 things**: where it goes, which token and how much, any permission, any warning." },
          { icon: "hand", text: "Unknown contract or unlimited approval? **Stop. Don't confirm.**" },
          { icon: "key", text: "**Never share** your recovery phrase, login QR or pairing code. Not even with “support”." },
        ],
        remember: [],
      },
      practice: {
        minutes: 4,
        title: "Run a safety check",
        steps: [{ icon: "bot", title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: run a safety check. Is my wallet connected? Is it locked? Do I have any unlimited or high-risk approvals? When does Developer Mode expire? Answer in 4 short lines. ${RO} Do not revoke or change anything.` }],
        check: "4 short lines, one per question.",
        recordText: "This save covers every page and issues your certificate.",
      },
    },
  ],
};

/** Setup spreads (Onboard.tsx) at spread indexes 1 and 2. */
export const SETUP_SPREADS = [1, 2];
export const pageCount = (b: Book) => b.days.length + SETUP_SPREADS.length; // lesson spreads (the ending is one more)
/** Printed pages of spread p ("1–2", "3–4", …). */
export const pagesOf = (p: number) => `${2 * p + 1}–${2 * p + 2}`;
/** The lesson shown on spread p, or null for a setup spread. */
export const dayAt = (b: Book, p: number) => b.days.find((d) => d.day === p + 1) ?? null;

/** Record prompt (spec v1.2 §6). The site fills the values; the learner pastes it into their own agent. */
export function completionPrompt(p: { wallet: string; academy: string; bookId: number; mask: bigint; calldata: string }, lang: "en" | "vi" = "en") {
  if (lang === "vi") return `Bạn đang có Binance Agentic Wallet skill (\`baw\`). Hãy ghi tiến độ học của tôi lên hợp đồng Agent Academy trên BNB Smart Chain. Làm đúng từng bước và KHÔNG thay đổi bất kỳ giá trị nào bên dưới:
- binanceChainId: 56
- from: ${p.wallet}
- to: ${p.academy}
- value: 0
- inputData: ${p.calldata}
- Giao dịch này gọi completeChapters(bookId=${p.bookId}, mask=${p.mask}). Nó không chuyển token và không xin approve.
Bước 1: chạy \`baw wallet settings --json\`. Nếu devMode.enabled không phải true thì dừng lại và hướng dẫn tôi bật Developer Mode trong app Binance.
Bước 2: chạy \`baw contract-call preview --binanceChainId 56 --from ${p.wallet} --to ${p.academy} --value 0 --inputData ${p.calldata} --json\`.
Bước 3: cho tôi xem parsedTx, risks và authorityChanges. Nếu preview báo lỗi hoặc có rủi ro, dừng lại và báo nguyên văn lỗi.
Bước 4: CHỈ khi tôi trả lời "xác nhận", chạy \`baw contract-call execute --requestId <requestId> --json\`. Nếu cần xác nhận trong app Binance, nhắc tôi.
Bước 5: báo txHash cho tôi.`;
  return `You have the Binance Agentic Wallet skill (\`baw\`). Record my completed pages on the Agent Academy contract on BNB Smart Chain. Follow each step exactly and do NOT change any value below:
- binanceChainId: 56
- from: ${p.wallet}
- to: ${p.academy}
- value: 0
- inputData: ${p.calldata}
- This transaction calls completeChapters(bookId=${p.bookId}, mask=${p.mask}). It moves no tokens and requests no approval.
Step 1: run \`baw wallet settings --json\`. If devMode.enabled is not true, stop and guide me to turn on Developer Mode in the Binance app.
Step 2: run \`baw contract-call preview --binanceChainId 56 --from ${p.wallet} --to ${p.academy} --value 0 --inputData ${p.calldata} --json\`.
Step 3: show me parsedTx, risks and authorityChanges. If the preview returns an error or any risk, stop and report the error word for word.
Step 4: ONLY when I reply "confirm", run \`baw contract-call execute --requestId <requestId> --json\`. If approval in the Binance app is needed, remind me.
Step 5: tell me the txHash.`;
}
