// Join counter behind /status. A 5-minute timer (clock.ts) reads new ChapterCompleted events and keeps the totals in KV.
// Public free RPCs drop old logs and answer [] with no error, so history is seeded here and the timer only reads recent blocks.
import { createPublicClient, http, parseAbiItem } from "viem";
import { bsc } from "viem/chains";
import { ACADEMY } from "../src/chain";
import { BOOKS } from "../src/books";

/** next = first unread block; wallets: address → { on-chain bookId: finished }. */
type State = { next: number; updatedAt: number; wallets: Record<string, Record<string, boolean>> };

const KEY = "status";
const STEP = 10_000; // publicnode's max log range
const MAX_CHUNKS = 20; // per run (Workers cap subrequests)
const LAG = 40; // stay behind the head: a lagging RPC node would answer [] for blocks it doesn't have yet
const MAX_BACKLOG = 295_000; // older than this the RPC may have dropped the logs: stop instead of undercounting
const event = parseAbiItem("event ChapterCompleted(address indexed user, uint256 indexed bookId, uint256 newBits, uint16 count)");

// Everything before SEED_NEXT, scanned 2026-11-26 and checked against progressOf. Test bookIds are left out.
const SEED_NEXT = 135_560_000;
const both = { "2": true, "3": true };
const SEED: State = {
  next: SEED_NEXT, updatedAt: 0,
  wallets: {
    "0xe0a34ac1da06423e1e67345828bd629dfabd4ca2": both,
    "0x9b965f7221ec976bf50c48733a1d7a5b90f94867": both,
    "0x72c9bcd191cb1c5602ee728953e1f7347c0d92d1": { "2": true },
    "0x039e6ff2a0ffd5ff6b3382ea9fcf2f4be4e3a3a6": { "2": true },
    "0xbd8af75d63f80f5d59d4cf7d7259eff5b0b45b42": { "2": true },
    "0x073a46ab2089d52a1c6eefa0f23c117d9b2287b3": both,
  },
};

const load = async (kv: KVNamespace): Promise<State> => (await kv.get<State>(KEY, "json")) ?? structuredClone(SEED);

export async function refreshStatus(kv: KVNamespace) {
  const client = createPublicClient({ chain: bsc, transport: http("https://bsc-rpc.publicnode.com") });
  const state = await load(kv);
  const head = Number(await client.getBlockNumber()) - LAG;
  if (head - state.next > MAX_BACKLOG) throw new Error(`status: ${head - state.next} blocks behind, rescan and update the seed`);
  const live = new Set(BOOKS.map((b) => String(b.chainId)));
  let read = false;
  try {
    for (let i = 0; i < MAX_CHUNKS && state.next <= head; i++) {
      const to = Math.min(state.next + STEP - 1, head);
      const logs = await client.getLogs({ address: ACADEMY, event, fromBlock: BigInt(state.next), toBlock: BigInt(to), strict: true });
      for (const { args } of logs) {
        const book = String(args.bookId);
        if (!live.has(book)) continue;
        const user = args.user.toLowerCase();
        state.wallets[user] = { ...state.wallets[user], [book]: state.wallets[user]?.[book] || args.count === 12 }; // all 12 pages = certificate
      }
      state.next = to + 1;
      state.updatedAt = Date.now();
      read = true;
    }
  } finally {
    if (read) await kv.put(KEY, JSON.stringify(state)); // keep the chunks already read
  }
}

/** Totals plus each wallet (public on-chain data, oldest first). Per course: true = certificate, false = joined, null = not joined. */
export async function statusJson(kv: KVNamespace) {
  const state = await load(kv);
  const all = Object.values(state.wallets);
  return {
    updatedAt: state.updatedAt,
    block: state.next - 1, // last block counted
    wallets: all.length,
    list: Object.entries(state.wallets).map(([address, w]) => ({ address, courses: BOOKS.map((b) => w[String(b.chainId)] ?? null) })),
    courses: BOOKS.map((b) => {
      const rows = all.filter((w) => String(b.chainId) in w);
      return { id: b.id, joined: rows.length, finished: rows.filter((w) => w[String(b.chainId)]).length };
    }),
  };
}
