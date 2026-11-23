// Book 1 content (en), written from the official binance-agentic-wallet skill docs (v1.15.0) and checked with real read-only baw runs on 2026-11-23. Pages 0-1 = Get ready (Onboard.tsx); page n = lesson n-1, one two-page spread each. Every page = one on-chain chapter (bit = page index).
// Budget per spread (must fit 1440×900): Learn = 3 short paragraphs + flow + 3 points; Practice = 1–2 steps + record.

export type Step = { title: string; text: string; prompt?: string };
export type Day = {
  day: number; // lesson number (page index = day + 1; pages 0-1 are Get ready)
  title: string;
  goal: string;
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
      title: "Your wallet and its addresses",
      goal: "Check that your agent is connected and find your wallet addresses.",
      learn: {
        paragraphs: [
          "Your agent talks to the wallet through a tool called **baw**. Before anything else it can check the **status**: connected or not.",
          "One **EVM address** is shared by BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon and Robinhood Chain. **Solana** has its own, different address.",
          "Your address is public, like a bank account number. It is **safe to share**. Your recovery phrase and login codes are not.",
        ],
        flow: ["Check status", "Read addresses", "Compare networks"],
        remember: ["One EVM address, plus one for Solana.", "An address is safe to share.", "Codes and phrases never are."],
      },
      practice: {
        minutes: 3,
        title: "Find your addresses",
        steps: [
          { title: "Ask your agent", text: "Paste this into your agent, then compare with the Binance app.", prompt: `Using Binance Agentic Wallet: check if my wallet is connected, then show my wallet address for every network and tell me which networks share the same address. ${RO}` },
        ],
      },
    },
    {
      day: 2,
      title: "Your balances",
      goal: "Read what your wallet holds, network by network.",
      learn: {
        paragraphs: [
          "Your agent lists each token with its **network**, amount, price and **USD value**. Each network keeps **its own balance**.",
          "Tokens with a zero balance are never shown. Tokens worth less than **$0.01**, or with no price yet, are hidden unless you ask for them.",
          "USDT on Base cannot pay for anything on BNB Smart Chain. That is why you **check the network** before you act.",
        ],
        flow: ["Pick a network", "Read balances", "Check USD value"],
        remember: ["Balances are per network.", "Tiny tokens are hidden by default.", "Right network first, then act."],
      },
      practice: {
        minutes: 3,
        title: "Read your balances",
        steps: [
          { title: "Ask your agent", text: "Paste this. It only reads.", prompt: `Using Binance Agentic Wallet: show my token balances on BNB Smart Chain with amount and USD value, and explain why some very small tokens might not be listed. ${RO}` },
        ],
      },
    },
    {
      day: 3,
      title: "Networks and history",
      goal: "See which networks your wallet uses and what it did before.",
      learn: {
        paragraphs: [
          "Your wallet supports **7 networks** today: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon, Robinhood Chain and Solana. Your agent can list them.",
          "The **history** shows each transaction with its network, time, status and **network fee**. By default it covers the last 3 months.",
          "A transaction is **pending** until the network confirms it, then **confirmed**. History is how you check what your agent really did.",
        ],
        flow: ["List networks", "Read history", "Check fees"],
        remember: ["History shows what your agent did.", "Pending is not done yet.", "Every transaction pays a network fee."],
      },
      practice: {
        minutes: 3,
        title: "Check your history",
        steps: [
          { title: "Ask your agent", text: "Paste this, then open one transaction on BscScan.", prompt: `Using Binance Agentic Wallet: list the networks my wallet supports, then show my 5 most recent confirmed transactions on BNB Smart Chain with time, type and network fee. ${RO}` },
        ],
      },
    },
    {
      day: 4,
      title: "Gas, the network fee",
      goal: "Understand gas before your agent ever sends anything.",
      learn: {
        paragraphs: [
          "**Gas** is the fee a network charges to process a transaction. On BNB Smart Chain it is paid in **BNB**.",
          "Your agent can show three levels: **low, medium and high**. Higher is faster and costs more. Medium is the default. Example from Nov 23: about 0.09, 0.11 and 0.31 gwei.",
          "A gas price is a **snapshot**, not the final fee. The real fee is set when a transaction is built and confirmed.",
        ],
        flow: ["Read levels", "Compare wait times", "Expect change"],
        remember: ["Gas is paid in BNB on BNB Smart Chain.", "Medium is the default level.", "A gas price is not the final fee."],
      },
      practice: {
        minutes: 3,
        title: "Read the gas price",
        steps: [
          { title: "Ask your agent", text: "Paste this. It only reads.", prompt: `Using Binance Agentic Wallet: show the current gas price on BNB Smart Chain at all 3 levels with their wait times, and explain why this is not the final fee of a transaction. ${RO}` },
        ],
      },
    },
    {
      day: 5,
      title: "Your wallet's rules",
      goal: "Read the limits and safety rules your agent must follow.",
      learn: {
        paragraphs: [
          "Your wallet has a **daily limit**, plus separate limits for DeFi, prediction markets, x402 payments and Developer Mode. **Limit left is not your balance.**",
          "**Abnormal transactions** (high-risk, or abnormal price impact) are rejected automatically or sent to the Binance app for a second OK.",
          "Your sign-in ends after a set time or a stretch without use. Your agent **reads** the rules; **only you change them**, in the app.",
        ],
        flow: ["You set rules", "Agent reads them", "Agent acts within them"],
        remember: ["Limit left is not your balance.", "Each type has its own limit.", "Only you change the rules."],
      },
      practice: {
        minutes: 4,
        title: "Read your rules",
        steps: [
          { title: "Ask your agent", text: "Paste this, then open Settings in the Binance app and compare.", prompt: `Using Binance Agentic Wallet: read my wallet settings and show a table with each limit type, its daily limit, used today and left today. Then tell me how abnormal transactions are handled and when my session and Developer Mode expire. ${RO}` },
        ],
      },
    },
    {
      day: 6,
      title: "Approvals",
      goal: "Know which apps may spend your tokens.",
      learn: {
        paragraphs: [
          "An **approval** lets an app (the **spender**) move one of your tokens, up to an amount. It stays active until it is revoked.",
          "An **unlimited** approval lets the spender move all of that token. Your agent shows each approval's **risk level**, for example when the spender contract is unverified.",
          "This book only **reads** approvals. Before you ever approve something, check who the spender is and how much it may take.",
        ],
        flow: ["List approvals", "Check spender", "Check amount and risk"],
        remember: ["Approvals stay until revoked.", "Unlimited is a big permission.", "Unknown spender? Stop."],
      },
      practice: {
        minutes: 3,
        title: "List your approvals",
        steps: [
          { title: "Ask your agent", text: "Paste this. It changes nothing.", prompt: `Using Binance Agentic Wallet: list my token approvals with token, spender, amount and risk level. If any is unlimited or high-risk, explain what that permission allows. ${RO} Do not revoke anything.` },
        ],
      },
    },
    {
      day: 7,
      title: "Pending and locked",
      goal: "Know why your wallet sometimes cannot send.",
      learn: {
        paragraphs: [
          "Your wallet is **locked** for new transactions on a network while an earlier one is still **pending** there.",
          "It is also locked when a risk check needs your **second confirmation** in the Binance app. That request waits about 5 minutes.",
          "When it is **unlocked**, your agent can work normally. Your agent can check this before it starts.",
        ],
        flow: ["Check lock", "Find the reason", "Wait or confirm in the app"],
        remember: ["Pending locks new transactions.", "Some checks need your OK in the app.", "Unlocked means ready."],
      },
      practice: {
        minutes: 3,
        title: "Check the lock",
        steps: [
          { title: "Ask your agent", text: "Paste this. It only reads.", prompt: `Using Binance Agentic Wallet: check whether my wallet is locked on BNB Smart Chain and list any pending transactions. If it is locked, explain why and what I should do. ${RO}` },
        ],
      },
    },
    {
      day: 8,
      title: "Quotes before trades",
      goal: "Read a swap quote without trading.",
      learn: {
        paragraphs: [
          "A **quote** shows what you put in and roughly what you get back. It is an **estimate**, not a promise. Example from Nov 23: 0.001 BNB for about 0.56 USDT.",
          "**Slippage** is the most the price may move against you before the swap fails. The default is auto.",
          "A submitted swap is **not yet done**: it can still fail on-chain. Only a confirmed transaction counts.",
        ],
        flow: ["Get a quote", "Read amounts", "Check slippage", "Decide"],
        remember: ["A quote is an estimate.", "Slippage is the move you accept.", "Submitted is not executed."],
      },
      practice: {
        minutes: 4,
        title: "Read a quote, don't trade",
        risk: true,
        steps: [
          { title: "Ask for a quote", text: "Paste this. It only asks for a price.", prompt: `Using Binance Agentic Wallet: get a quote to swap 0.001 BNB to USDT on BNB Smart Chain. Show the amount in, the estimated amount out and the slippage as a percent, and explain why the amount out is not guaranteed. ${RO} Quote only, no swap.` },
        ],
      },
    },
    {
      day: 9,
      title: "DeFi, preview only",
      goal: "Compare DeFi apps and preview a deposit without sending it.",
      learn: {
        paragraphs: [
          "DeFi apps are smart contracts. **TVL** is the money inside; **APY** is the yearly yield shown (for an app, its best pool). It changes often.",
          "A **preview** shows a deposit's balance changes, estimated network fee and contract. **Nothing is sent.**",
          "**High APY is not free money.** Risks: contract bugs, hard exits, falling prices, yield that stops.",
        ],
        flow: ["List apps", "Read TVL and APY", "Preview", "You decide"],
        remember: ["TVL shows size, not safety.", "A preview sends nothing.", "High APY is not free money."],
      },
      practice: {
        minutes: 5,
        title: "Compare and preview",
        risk: true,
        steps: [
          { title: "Ask your agent", text: "Paste this. It looks things up and previews only.", prompt: `Using Binance Agentic Wallet: list 3 DeFi protocols on BNB Smart Chain with TVL and max APY. If I hold USDT on BNB Smart Chain, preview (do not execute) a deposit of 1 USDT into one Earn product and show the balance changes, estimated network fee and the contract it would interact with. Do not tell me which is best. ${RO} Preview only.` },
        ],
      },
    },
    {
      day: 10,
      title: "Your Agent ID",
      goal: "Check your .ai name and where it points.",
      learn: {
        paragraphs: [
          "Your **Agent ID** is a **.ai name**, like you.ai, claimed in the Binance app. One per user, free apart from the BNB network fee.",
          "A name **resolves** to an address. Your .ai name points to your own wallet. Resolve results also say if the address is a normal wallet or a contract.",
          "Only Agent ID holders can record pages in this book. **Check every resolved address** before you ever send anything to a name.",
        ],
        flow: ["Check Agent ID", "Resolve your name", "Match your address"],
        remember: ["Your .ai name points to your wallet.", "Always check a resolved address.", "Resolve is not send."],
      },
      practice: {
        minutes: 3,
        title: "Check your name",
        steps: [
          { title: "Ask your agent", text: "Paste this. It checks only your own name.", prompt: `Using Binance Agentic Wallet: tell me whether I have claimed an Agent ID and what it is. Then resolve my own .ai name on BNB Smart Chain and check it matches my wallet address. ${RO} Do not send anything.` },
        ],
      },
    },
    {
      day: 11,
      title: "Staying safe",
      goal: "Check four things before you ever confirm.",
      learn: {
        paragraphs: [
          "Before any OK, **check 4 things**: where it goes, which token and how much, any approval it grants, and any warning in the preview.",
          "Case: the preview shows a contract you don't know and an unlimited approval. **Stop. Don't confirm** until you know what that contract is.",
          "Your wallet can reject or re-check high-risk transactions, but it **can't catch a normal-looking mistake**. **Never share** your recovery phrase, login QR or pairing code.",
        ],
        flow: ["Destination", "Amount", "Approvals", "Warnings"],
        remember: ["Unknown contract? Stop.", "Your limits are the safety net.", "Never share login codes."],
      },
      practice: {
        minutes: 4,
        title: "Run a safety check",
        steps: [
          { title: "Ask your agent", text: "Paste this. It changes nothing.", prompt: `Using Binance Agentic Wallet: run a safety check. Is my wallet connected? Is it locked? Do I have any unlimited or high-risk approvals? When does Developer Mode expire? Answer in 4 short lines. ${RO} Do not revoke or change anything.` },
        ],
        recordText: "When every page of the book is recorded, your certificate is issued in that same transaction.",
      },
    },
  ],
};

/** Pages in the book: 2 Get ready pages + one per lesson. Each page is one chapter on-chain. */
export const SETUP_PAGES = 2;
export const pageCount = (b: Book) => b.days.length + SETUP_PAGES;

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
