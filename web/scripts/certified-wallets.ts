// Lists the wallets that hold a certificate, for the giveaway draw. The owner's own wallet is left out.
// Usage: npx tsx scripts/certified-wallets.ts <bookId 2|3> [out=../docs/certified-wallets.csv]
// Wallets come from the /status counter (public RPCs drop old logs and answer [] with no error);
// each one is then checked on the contract. It stops if the counter has not caught up with the chain.
import { writeFileSync } from "node:fs";
import { certificate, client } from "../src/chain";
import { BOOKS } from "../src/books";

const bookId = Number(process.argv[2]);
const course = BOOKS.findIndex((b) => b.chainId === bookId);
if (course < 0) throw new Error(`bookId must be one of ${BOOKS.map((b) => b.chainId).join(", ")}`);
const out = process.argv[3] ?? "../docs/certified-wallets.csv";
const OWNER = "0xe0a34ac1da06423e1e67345828bd629dfabd4ca2";
const MAX_LAG = 2_000; // blocks (about 15 minutes)

const res = await fetch("https://academy.0xhieu.xyz/api/status");
if (!res.ok) throw new Error(`/api/status answered ${res.status}`);
const data = (await res.json()) as { block: number; list: { address: `0x${string}`; courses: (boolean | null)[] }[] };
const lag = Number(await client.getBlockNumber()) - data.block;
if (lag > MAX_LAG) throw new Error(`The counter is ${lag} blocks behind, so the list may be incomplete. Try again later.`);

const rows: string[] = [];
for (const w of data.list) {
  if (w.address === OWNER || !w.courses[course]) continue;
  const c = await certificate(w.address, bookId);
  if (!c.ok) throw new Error(`${w.address}: the contract shows no certificate`);
  rows.push(`${w.address},${new Date(c.issuedAt * 1000).toISOString()}`);
}
writeFileSync(out, ["wallet,time_utc", ...rows].join("\n") + "\n");
console.log(`Book ${bookId}: ${rows.length} certified wallets (counter at block ${data.block}) -> ${out}`);
