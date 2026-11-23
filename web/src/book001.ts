// Book 1 content (en). Page 0 = Get ready (Onboard.tsx); page n = lesson n, one two-page spread each. Every page = one on-chain chapter (bit = page index). Facts checked 2026-11-23 against `baw` skill docs and real `baw` runs.
// Budget per spread (must fit 1440×900): Learn = 3 short paragraphs + flow + 3 points; Practice = 1–2 steps + record.

export type Step = { title: string; text: string; prompt?: string };
export type Day = {
  day: number;
  title: string;
  learn: { paragraphs: string[]; flow: string[]; remember: string[] };
  practice: { minutes: number; title?: string; risk?: boolean; steps: Step[]; recordText?: string };
};
export type Book = { id: number; number: string; title: string; days: Day[] };

const RO = "Read data only. Do NOT send, sign or confirm any transaction.";

export const book001: Book = {
  id: 1, // on-chain bookId
  number: "Book 001",
  title: "Learn Binance Agentic Wallet",
  days: [
    {
      day: 1,
      title: "Meet your Agentic Wallet",
      learn: {
        paragraphs: [
          "An **Agentic Wallet** is a separate wallet your AI agent can use for you. Ask in plain words, and it checks balances, gets quotes and prepares transactions.",
          "**You set the limits.** Daily limits, Developer Mode and safety rules live in the Binance app, and the wallet's key never leaves Binance.",
          "Your **Agent ID** is your .ai name, like you.ai. It is the name linked to this wallet.",
        ],
        flow: ["You ask", "Agent prepares", "Preview", "Rules check", "Wallet signs"],
        remember: ["Your agent acts within your wallet's rules.", "Set limits and safety in the Binance app.", "Know what your agent may do before it acts."],
      },
      practice: {
        minutes: 5,
        title: "Prepare your wallet",
        steps: [
          { title: "Turn on Developer Mode", text: "Binance app: Agentic Wallet, Settings. Needed to **record lessons**; lasts 7 days, and each use adds time." },
          { title: "Meet your wallet", text: "Paste this into Claude Code, Codex or Binance AI Pro.", prompt: `Using Binance Agentic Wallet, tell me: is my wallet connected, my BNB Smart Chain address, my Agent ID (.ai name), and is Developer Mode on (until when)? ${RO}` },
        ],
        recordText: "A small on-chain record of your progress, **not a trade**. Type confirm only if the preview matches.",
      },
    },
    {
      day: 2,
      title: "One wallet, many networks",
      learn: {
        paragraphs: [
          "One **EVM address** works on 6 networks: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon and Robinhood Chain. **Solana** has its own address.",
          "Each network keeps **its own balance**. USDT on Base can't pay for anything on BNB Smart Chain, so always check the network first.",
          "**Gas** is the fee the network charges to process a transaction. Low, medium or high: higher is faster and costs more. On BNB Smart Chain it's paid in BNB.",
        ],
        flow: ["Pick network", "Check balance", "Check gas", "Then act"],
        remember: ["One EVM address, plus one for Solana.", "Balances are per network.", "Right network first, then act."],
      },
      practice: {
        minutes: 5,
        title: "Map your wallet",
        steps: [
          { title: "Ask your agent", text: "Paste this, then compare with the Binance app.", prompt: `Using Binance Agentic Wallet: show my EVM and Solana addresses, which networks have a balance (with USD value), my 3 most recent transactions, and the BNB Smart Chain gas price at all 3 levels. Then explain in one line why balances on different networks can't be spent as one. ${RO}` },
        ],
      },
    },
    {
      day: 3,
      title: "How your agent helps you trade",
      learn: {
        paragraphs: [
          "A **quote** is an estimate, not a promise. Example from Nov 23: 0.001 BNB for about 0.56 USDT. The price can move before the swap runs.",
          "**Slippage** is the most the price may move against you before the swap fails. Auto is the default. **Price impact** is the move your own trade causes, bigger in small pools.",
          "A **limit order** waits until the price reaches your level, then trades. It works on BNB Smart Chain and Solana.",
        ],
        flow: ["Get a quote", "Read amounts", "Check slippage", "Decide"],
        remember: ["A quote is an estimate.", "Slippage is the move you accept.", "Limit orders wait for your price."],
      },
      practice: {
        minutes: 5,
        title: "Read a quote, don't trade",
        risk: true,
        steps: [
          { title: "Ask for a quote", text: "Paste this. It only asks for a price.", prompt: `Using Binance Agentic Wallet: get a quote to swap 0.001 BNB to USDT on BNB Smart Chain. Show the amount in, the estimated amount out and the slippage as a percent, and explain why the amount out is not guaranteed. Then list my open limit orders. ${RO} Quote only, no swap.` },
        ],
      },
    },
    {
      day: 4,
      title: "Exploring DeFi",
      learn: {
        paragraphs: [
          "DeFi apps are smart contracts. Earn pays you for a deposit; a Liquidity Pool uses your tokens for trading. **TVL** is the money inside; **APY** is the yearly yield.",
          "Made-up example: App A holds $100M at 5%. App B holds $500K at 3,000%. Neither proves safety, but ask B harder questions: **where does that yield come from?**",
          "**Risks:** contract bugs, hard exits, falling prices and yield that stops. An app's APY is its best pool, and it changes often.",
        ],
        flow: ["List apps", "Read TVL and APY", "Ask why", "You decide"],
        remember: ["High APY is not free money.", "TVL shows size, not safety.", "Depositing is your call."],
      },
      practice: {
        minutes: 5,
        title: "Compare 2 apps",
        risk: true,
        steps: [
          { title: "Ask your agent", text: "Paste this. It only looks things up.", prompt: `Using Binance Agentic Wallet: list 3 DeFi protocols on BNB Smart Chain with TVL and max APY. Compare the highest-APY one with the largest-TVL one: TVL, APY, the token rewards are paid in, and the main risks. Do not tell me which is best. ${RO} Do not deposit.` },
        ],
      },
    },
    {
      day: 5,
      title: "Read the market, don't follow it",
      learn: {
        paragraphs: [
          "**Leaderboard:** who made money. **Signals:** what a strategy says and how it did before. **Tracker:** what big wallets buy.",
          "Nov 23: the week's #1 trader on BNB Smart Chain made about $35,000, **all from one token**. Skill, or one lucky bet?",
          "**Ask:** how many trades? How much from one token? A few wins prove little, a backtest is the past, and a big wallet buying doesn't mean the price will rise.",
        ],
        flow: ["Who won", "How", "How often", "What's missing"],
        remember: ["Data shows the past, not the future.", "Profit from one token is a warning sign.", "Verify before you act."],
      },
      practice: {
        minutes: 5,
        title: "Question a top trader",
        risk: true,
        steps: [
          { title: "Ask your agent", text: "Paste this and read what the data can't tell you.", prompt: `Using Binance Agentic Wallet: show the top 3 traders on the 7-day leaderboard on BNB Smart Chain (profit, win rate, number of trades, top earning tokens). Pick one and tell me how much of their profit came from a single token. Then answer: would you copy this trader based on this data alone? What data is missing? ${RO}` },
        ],
      },
    },
    {
      day: 6,
      title: "The wallet's limits",
      learn: {
        paragraphs: [
          "Example: your daily limit is $100 and your agent has used $40. **$60 is left**, even if you hold $1,000. Your agent can't raise it to $200. **Only you can**, in the Binance app.",
          "DeFi, prediction markets, x402 payments and Developer Mode each have **their own limit**. They reset at **00:00 UTC**.",
          "Your sign-in ends after a set time or a stretch without use. Developer Mode lasts 7 days, and each use extends it. They **expire separately**.",
        ],
        flow: ["You set rules", "Agent reads them", "Agent acts within them"],
        remember: ["Limit left is not your balance.", "Each type has its own limit.", "Only you change the rules."],
      },
      practice: {
        minutes: 5,
        title: "Read your rules",
        steps: [
          { title: "Ask your agent", text: "Paste this, then open Settings in the app and compare.", prompt: `Using Binance Agentic Wallet: read my wallet settings and show a table with each limit type, its daily limit, used today and left today. Then tell me how abnormal transactions are handled, when my session expires, when Developer Mode expires, and which of these settings my agent can change. ${RO}` },
        ],
      },
    },
    {
      day: 7,
      title: "Staying safe",
      learn: {
        paragraphs: [
          "Before any OK, **check 4 things**: where it goes, which token and how much, any approval it grants, and any warning.",
          "Case: the preview shows a contract you don't know and an unlimited token approval. **Stop. Don't confirm** until you know what that contract is.",
          "The wallet can auto-reject transactions it flags as high-risk, or ask you again in the app. It **can't catch a normal-looking order** you gave by mistake. **Never share** your recovery phrase, login QR or pairing code.",
        ],
        flow: ["Destination", "Amount", "Approvals", "Warnings"],
        remember: ["Unknown contract? Stop.", "Unlimited approval is a big permission.", "Never share login codes."],
      },
      practice: {
        minutes: 5,
        title: "Run a safety check",
        steps: [
          { title: "Ask your agent", text: "Paste this. It changes nothing.", prompt: `Using Binance Agentic Wallet: list my token approvals (token, spender, amount, risk level), tell me if a transaction is pending or my wallet is locked waiting for a confirm in the Binance app, and summarize my 5 most recent transactions. Explain how an approval, a pending transaction and a locked wallet differ. ${RO} Do not revoke or change anything.` },
        ],
        recordText: "When every page of the book is recorded, your certificate is issued in that same transaction.",
      },
    },
  ],
};

/** Pages in the book: Get ready + one per lesson. Each page is one chapter on-chain. */
export const pageCount = (b: Book) => b.days.length + 1;

/** Record prompt (spec v1.2 §6). The site fills the values; the learner pastes it into their own agent. */
export function completionPrompt(p: { wallet: string; academy: string; bookId: number; mask: bigint; calldata: string }) {
  return `You have the Binance Agentic Wallet skill (\`baw\`). Record my completed chapters on the Agent Academy contract on BNB Smart Chain. Follow each step exactly and do NOT change any value below:
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
