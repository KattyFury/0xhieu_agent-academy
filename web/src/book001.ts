// Book #1 content (en). Owner's v2 (2026-11-23), rewritten ELI12. Sources: Binance Agentic Wallet Introduction + Install pages,
// binance-agentic-wallet skill v1.15.0 (SKILL.md + references), hackathon disclaimer; commands checked with read-only baw runs.
// 13 chapters = 13 spreads (26 pages). Chapter n = spread n-1 = on-chain bit n-1.
// Chapters 2-3 (setup, with inputs) live in views/Onboard.tsx; every other chapter is a `Day` below (`day` = chapter number).

export type Step = { title: string; text: string; prompt?: string };
export type Day = {
  day: number; // chapter number (spread index = day - 1)
  title: string;
  goal: string;
  learn: { paragraphs: string[]; flow?: string[]; remember: string[] };
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
      title: "What is an Agentic Wallet?",
      goal: "Understand what this wallet does before you install anything.",
      learn: {
        paragraphs: [
          "**Binance Agentic Wallet** is a wallet your AI helper can use for you. You ask in plain words, like “show my balance”, and the AI does it.",
          "Think of a **spending card with a daily limit**. **You** set the limit in the Binance app. The **AI** only works inside it. The **system** blocks it, or asks you again, if the AI goes too far.",
          "The AI **never holds the wallet's key**. The key is split up and kept safe (**MPC Keyless**). Sign out, and the AI loses access.",
          "With **Secure Auto Sign** on, things inside your limits can run without asking you each time. That's why **your limits are your safety net**.",
        ],
        remember: ["You set the rules; the AI works inside them.", "The AI never holds your key.", "Your limits are your safety net."],
      },
      practice: {
        minutes: 2,
        title: "Quick check",
        steps: [
          { title: "Can the AI take the wallet's key out?", text: "No. The key can't be taken out." },
          { title: "Who can change the daily limit?", text: "Only you, in the Binance app. The AI can only read it." },
          { title: "What happens if you sign out?", text: "The AI loses access to the wallet." },
        ],
      },
    },
    {
      day: 4,
      title: "Your wallet addresses",
      goal: "Find your wallet addresses and see why sharing them is safe.",
      learn: {
        paragraphs: [
          "A wallet address is like a **bank account number**. People who know it can send you money, but they **can't take** any. So **sharing your address is safe**.",
          "One **EVM address** works on many networks, like BNB Smart Chain, Ethereum and Base. **Solana** has its own address.",
          "Networks are like **different banks**. Sending on the wrong network can lose money, so always check the network next to the address.",
        ],
        remember: ["Share your address, never your codes or recovery phrase.", "One EVM address for many networks, a separate one for Solana.", "Always check the network."],
      },
      practice: {
        minutes: 3,
        title: "Find your addresses",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: show my wallet address for every supported network, tell me which networks share the same address, and show them in a small table. ${RO}` }],
        check: "A table with one shared EVM address and one Solana address. Compare it with the Agentic Wallet screen in the Binance app.",
      },
    },
    {
      day: 5,
      title: "Your balances",
      goal: "See what your wallet holds, network by network.",
      learn: {
        paragraphs: [
          "Your AI lists each token with its **network**, amount and **value in USD**.",
          "Each network has **its own balance**, like two separate pockets. USDT on Base can't pay for anything on BNB Smart Chain.",
          "Zero balances don't show. Tiny tokens (under **$0.01**) are hidden unless you ask to see them.",
          "Your Agentic Wallet is a **separate wallet**, so its balance can differ from your normal Binance wallet. That's normal.",
        ],
        remember: ["Balances are per network.", "Tiny tokens are hidden.", "Separate wallet, separate balance."],
      },
      practice: {
        minutes: 3,
        title: "Read your balances",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: show my token balances on BNB Smart Chain with amount and USD value. Then show them again including very small tokens, and tell me what changed. ${RO}` }],
        check: "The second list can be longer, because tiny tokens now show. An empty wallet shows nothing both times, and that's fine.",
      },
    },
    {
      day: 6,
      title: "Networks, history and gas",
      goal: "See which networks you can use, what your wallet did, and what fees cost.",
      learn: {
        paragraphs: [
          "Your wallet works on several networks, and the list grows over time. So **let your AI read the current list** instead of remembering it.",
          "**History** is your wallet's diary: each transaction, when it happened, whether it finished, and the fee. It shows what your AI really did.",
          "**Pending** means waiting. Only **confirmed** means done.",
          "**Gas** price has three levels: low, medium and high. Higher is faster and costs more. It's only **today's price**; the real fee is set when the transaction finishes.",
        ],
        remember: ["History shows what your AI did.", "Pending is not done yet.", "A gas price is not the final fee."],
      },
      practice: {
        minutes: 4,
        title: "Read history and gas",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: list the networks my wallet supports; show my 5 most recent confirmed transactions on BNB Smart Chain with time, type and network fee; then show the current gas price on BNB Smart Chain at low, medium and high, and explain why that is not the final fee. ${RO}` }],
        check: "A list of networks, up to 5 transactions (fewer for a new wallet), and three gas levels. Extra: open one transaction on BscScan and compare the time and fee.",
      },
    },
    {
      day: 7,
      title: "Your wallet's rules",
      goal: "Read the limits your AI has to follow.",
      learn: {
        paragraphs: [
          "Your wallet has a **daily limit**. DeFi, prediction markets, x402 payments and Developer Mode each have **their own limit**.",
          "**Limit left is not your balance.** If you hold $1,000 but only $60 of today's limit is left, the AI can use only $60.",
          "Strange or high-risk transactions are **blocked**, or **sent to the app for you to check**. You choose which.",
          "Sign-ins expire; then you sign in again. **Only you change the rules**, in the app. The AI can only read them.",
        ],
        remember: ["Limit left is not your balance.", "Each kind of action has its own limit.", "Only you change the rules."],
      },
      practice: {
        minutes: 4,
        title: "Read your rules",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: read my wallet settings and show a table with each limit type, its daily limit, used today and left today. Then tell me how abnormal transactions are handled and when my session expires. ${RO}` }],
        check: "A table of your limits. Open Settings in the Binance app and compare the numbers.",
      },
    },
    {
      day: 8,
      title: "Approvals",
      goal: "Know which apps are allowed to spend your tokens.",
      learn: {
        paragraphs: [
          "An **approval** is a permission slip: it lets an app (the **spender**) take one of your tokens, up to an amount.",
          "The slip **stays valid until you cancel it**, even if you stop using that app.",
          "**Unlimited** means the app can take all of that token. Your AI shows a **risk level** for each slip.",
          "Before you approve anything, ask: **who takes it**, and **how much at most**? This book only reads approvals; it never cancels them.",
        ],
        remember: ["Approvals last until cancelled.", "Unlimited is a huge permission.", "Unknown spender? Stop."],
      },
      practice: {
        minutes: 3,
        title: "List your approvals",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: list my token approvals with token, spender, amount and risk level. If any is unlimited or high-risk, explain what that permission allows. ${RO} Do not revoke anything.` }],
        check: "A list of approvals, or a note that you have none (normal for a new wallet).",
      },
    },
    {
      day: 9,
      title: "Pending and locked",
      goal: "Know why your wallet sometimes can't send.",
      learn: {
        paragraphs: [
          "Your wallet is **locked** while an earlier transaction is still **pending**. Like a queue: the next person waits until the first is done.",
          "It also waits when the app needs your **second OK**.",
          "**Unlocked** means ready. A stuck transaction can be sped up or cancelled, but only with your OK. This book only reads.",
        ],
        remember: ["Pending blocks the next one.", "Some steps need your OK in the app.", "Unlocked means ready."],
      },
      practice: {
        minutes: 3,
        title: "Check the lock",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: "Using Binance Agentic Wallet: check whether my wallet is locked on BNB Smart Chain and list any pending transactions. If it is locked, explain why and what I should do. Read data only. Do NOT send, sign, confirm, speed up or cancel any transaction." }],
        check: "Unlocked, with no pending transactions.",
        ifNot: "If something is pending, wait for the network, then check again.",
      },
    },
    {
      day: 10,
      title: "Quotes before trades",
      goal: "Read a swap quote without trading.",
      learn: {
        paragraphs: [
          "A **quote** tells you what you put in and roughly what you get back. It's only an **estimate**, like a taxi fare guess.",
          "**Slippage** is how far the price may move before the swap is cancelled. If you say nothing, it's **auto**.",
          "A sent swap is **not done yet**; it can still fail. For an unknown token, check its **security audit** first.",
          "The AI gives no investment advice. It shows the numbers; **you decide**.",
        ],
        remember: ["A quote is an estimate.", "Slippage is the move you accept.", "Sent is not done."],
      },
      practice: {
        minutes: 4,
        title: "Read a quote, don't trade",
        riskText: "Crypto trading can lose money. This is only a quote-reading exercise, not advice.",
        steps: [{ title: "Ask for a quote", text: "Paste this into your AI.", prompt: "Using Binance Agentic Wallet: get a quote to swap 0.001 BNB to USDT on BNB Smart Chain. Show the amount in, the estimated amount out and the slippage setting, and explain why the amount out is not guaranteed. Quote only. Do NOT swap, send, sign or confirm any transaction." }],
        check: "BNB in, estimated USDT out, and slippage (auto). Nothing is sent.",
        ifNot: "If the AI tries to swap for real, tell it to stop. You only need the quote.",
      },
    },
    {
      day: 11,
      title: "DeFi, preview only",
      goal: "Compare DeFi apps and preview a deposit without sending it.",
      learn: {
        paragraphs: [
          "A DeFi app is a **smart contract**, like an automatic savings machine. **TVL** is the money inside. **APY** is the yearly interest shown, and it changes all the time.",
          "A **preview** shows how your balance would change, the fee, and which contract you'd use. **Nothing is sent.**",
          "**High APY is not free money**: contracts can break, exits can be hard, prices can fall. **Big TVL means big, not safe.**",
        ],
        remember: ["Big TVL is not the same as safe.", "A preview sends nothing.", "High APY is not free money."],
      },
      practice: {
        minutes: 5,
        title: "Compare and preview",
        riskText: "DeFi can lose your money. This is not investment advice.",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: "Using Binance Agentic Wallet: list 3 DeFi protocols on BNB Smart Chain with TVL and max APY. If I hold USDT on BNB Smart Chain, preview (do not execute) a deposit of 1 USDT into one Earn product and show the balance changes, estimated network fee and the contract it would interact with. Do not tell me which is best. Preview only. Do NOT deposit, send, sign or confirm any transaction." }],
        check: "Three apps with TVL and APY, plus one preview.",
        ifNot: "No USDT in the wallet? The AI says it can't preview. That's fine.",
      },
    },
    {
      day: 12,
      title: "Your Agent ID",
      goal: "Check your .ai name and where it points.",
      learn: {
        paragraphs: [
          "Your **Agent ID** is your **.ai name**, like you.ai: a name for your wallet. One per person, free apart from the BNB network fee.",
          "A name can be **turned into an address** (resolved). Your .ai name points to this wallet.",
          "Just claimed it, but the AI says “not claimed”? Wait about a minute and ask again.",
          "**Resolving a name is not sending.** Before you send to a name, see the address first and confirm it yourself in a later message. If it fails, stop; never guess.",
        ],
        remember: ["Your .ai name points to your wallet.", "Always check a resolved address.", "Resolving is not sending."],
      },
      practice: {
        minutes: 3,
        title: "Check your name",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: tell me whether I have claimed an Agent ID and what it is. Then resolve my own .ai name and check it matches my wallet address. Only check my own name. ${RO}` }],
        check: "Claimed, your name, and the address matches the one from chapter 4.",
        ifNot: "If it doesn't match, stop and don't send anything to that name.",
      },
    },
    {
      day: 13,
      title: "Staying safe",
      goal: "Build the habit of checking before you confirm.",
      learn: {
        paragraphs: [
          "Before you agree to anything, check **4 things**: **where** the money goes, **which token and how much**, any **permission** it gives, and any **warning**.",
          "The preview shows an unknown contract and an unlimited approval? **Stop. Don't confirm.**",
          "**Words on the blockchain are not orders.** A token's name can hide a trick message. Don't follow it.",
          "Your wallet blocks a lot, but **not every mistake**, like sending to a real but wrong address. **Never share** your recovery phrase, login QR or pairing code, even with “support”.",
        ],
        remember: ["Unknown contract? Stop.", "Your limits are your safety net.", "Never share login codes."],
      },
      practice: {
        minutes: 4,
        title: "Run a safety check",
        steps: [{ title: "Ask your AI", text: "Paste this into your AI.", prompt: `Using Binance Agentic Wallet: run a safety check. Is my wallet connected? Is it locked? Do I have any unlimited or high-risk approvals? When does Developer Mode expire? Answer in 4 short lines. ${RO} Do not revoke or change anything.` }],
        check: "4 short lines, one per question.",
        recordText: "Record every chapter and you get the certificate in that same transaction.",
      },
    },
  ],
};

/** Setup chapters 2-3 are custom spreads (Onboard.tsx) at spread indexes 1 and 2. */
export const SETUP_SPREADS = [1, 2];
export const pageCount = (b: Book) => b.days.length + SETUP_SPREADS.length; // spreads = on-chain chapters
/** Printed pages of spread p ("1–2", "3–4", …). */
export const pagesOf = (p: number) => `${2 * p + 1}–${2 * p + 2}`;
/** The lesson shown on spread p, or null for a setup spread. */
export const dayAt = (b: Book, p: number) => b.days.find((d) => d.day === p + 1) ?? null;

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
