// POST /api/claim { address } -> the relayer wallet sends free gas straight to `address`.
// No faucet contract: nothing public for bots to call. Rules: Agent ID holders only, once per
// wallet, only if the wallet is nearly empty, at most DAILY_CAP sends per UTC day.
// RELAYER_KEY lives only in a Worker secret (copy in D:\Codes\.secrets\keys.env).
import { createPublicClient, createWalletClient, http, isAddress, parseAbi, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc } from "viem/chains";

interface Env { RELAYER_KEY: string; GAS: KVNamespace; TG_BOT_TOKEN?: string; TG_CHAT_ID?: string }

const AGENT_ID = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F";
const RPC = "https://bsc-dataseed.binance.org";
const SEND_WEI = 250000000000000n; // 0.00025 BNB, enough for every lesson
const ENOUGH_WEI = 200000000000000n; // wallets with 0.0002 BNB or more don't need it
const DAILY_CAP = 20;
const nftAbi = parseAbi(["function balanceOf(address) view returns (uint256)"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const fmt = (wei: bigint) => (Number(wei) / 1e18).toFixed(4);
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

async function telegram(env: Env, text: string) {
  if (!env.TG_BOT_TOKEN || !env.TG_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text: `Agent Academy: ${text}`, disable_web_page_preview: true }),
  }).catch(() => {});
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let address = "";
  try { address = String(((await request.json()) as { address?: string }).address ?? "").trim(); } catch { /* fallthrough */ }
  if (!isAddress(address)) return json({ status: "invalid", error: "That doesn't look like a wallet address." }, 400);
  if (!env.RELAYER_KEY || !env.GAS) return json({ status: "error", error: "Free gas isn't set up yet." }, 503);
  const key = `sent:${address.toLowerCase()}`;

  const pub = createPublicClient({ chain: bsc, transport: http(RPC) });
  const [ids, balance] = await Promise.all([
    pub.readContract({ address: AGENT_ID, abi: nftAbi, functionName: "balanceOf", args: [address] }),
    pub.getBalance({ address }),
  ]);
  if (ids === 0n) return json({ status: "no-agent-id", error: "This wallet has no Agent ID yet. Get one in the Binance app first." }, 400);
  if (await env.GAS.get(key)) return json({ status: "already" });
  if (balance >= ENOUGH_WEI) return json({ status: "enough", balance: fmt(balance) });

  const day = `day:${new Date().toISOString().slice(0, 10)}`;
  const today = Number((await env.GAS.get(day)) ?? "0");
  if (today >= DAILY_CAP) return json({ status: "cap" });

  const account = privateKeyToAccount(env.RELAYER_KEY as Hex);
  const relayer = await pub.getBalance({ address: account.address });
  if (relayer < SEND_WEI * 2n) {
    await telegram(env, `relayer is OUT of BNB (${fmt(relayer)} BNB), learners get nothing. Top up ${account.address}`);
    return json({ status: "out" });
  }

  // Mark first, so a double click can't send twice.
  await env.GAS.put(key, "pending");
  await env.GAS.put(day, String(today + 1), { expirationTtl: 3 * 86400 });
  try {
    const wallet = createWalletClient({ account, chain: bsc, transport: http(RPC) });
    const txHash = await wallet.sendTransaction({ to: address, value: SEND_WEI });
    await env.GAS.put(key, txHash);
    const left = relayer - SEND_WEI;
    await telegram(env, `sent ${fmt(SEND_WEI)} BNB gas to ${short(address)} (${today + 1}/${DAILY_CAP} today). Relayer left ${fmt(left)} BNB (~${String(left / SEND_WEI)} sends). https://bscscan.com/tx/${txHash}`);
    return json({ status: "sent", txHash, amount: fmt(SEND_WEI) });
  } catch {
    await env.GAS.delete(key);
    return json({ status: "error", error: "Couldn't send right now. Try again in a minute." }, 502);
  }
};
