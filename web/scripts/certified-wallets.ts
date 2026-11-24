// Lists every wallet that earned a certificate (on-chain CertificateIssued events) for the lucky draw.
// Usage: npx tsx scripts/certified-wallets.ts [bookId=1] [out=../docs/certified-wallets.csv]
// The chain is the source of truth: rerun any time, the file is just a snapshot.
import { writeFileSync } from "node:fs";
import { createPublicClient, fallback, http, parseAbiItem } from "viem";
import { bsc } from "viem/chains";
import { ACADEMY } from "../src/chain";

const bookId = BigInt(process.argv[2] ?? "1");
const out = process.argv[3] ?? "../docs/certified-wallets.csv";
const FIRST_BLOCK = 135_278_000n; // just before the contract was deployed (first BookCreated at 135278282)
const STEP = 10_000n; // public RPCs cap the getLogs range

const client = createPublicClient({ chain: bsc, transport: fallback([http("https://bsc-rpc.publicnode.com"), http("https://bsc-dataseed.binance.org")]) });
const event = parseAbiItem("event CertificateIssued(address indexed user, uint256 indexed bookId)");

const head = await client.getBlockNumber();
const rows: { user: string; block: bigint; tx: string; time: string }[] = [];
for (let from = FIRST_BLOCK; from <= head; from += STEP) {
  const logs = await client.getLogs({ address: ACADEMY, event, args: { bookId }, fromBlock: from, toBlock: from + STEP - 1n > head ? head : from + STEP - 1n });
  for (const l of logs) {
    const b = await client.getBlock({ blockNumber: l.blockNumber });
    rows.push({ user: l.args.user!, block: l.blockNumber, tx: l.transactionHash, time: new Date(Number(b.timestamp) * 1000).toISOString() });
  }
}
rows.sort((a, b) => Number(a.block - b.block));
writeFileSync(out, ["wallet,block,time_utc,tx", ...rows.map((r) => `${r.user},${r.block},${r.time},${r.tx}`)].join("\n") + "\n");
console.log(`Book ${bookId}: ${rows.length} certified wallets (head block ${head}) -> ${out}`);
