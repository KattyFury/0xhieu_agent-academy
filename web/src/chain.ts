import { createPublicClient, encodeFunctionData, fallback, http, isAddress, parseAbi, type Address } from "viem";
import { bsc } from "viem/chains";

export const AGENT_ID = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F" as const;
export const ACADEMY = "0x66Ae47EAE1aacFd70148808AE63a5B4A5e882753" as const;
export const BSCSCAN = "https://bscscan.com";

export const academyAbi = parseAbi([
  "function completeChapters(uint256 bookId, uint256 mask)",
  "function progressOf(address learner, uint256 bookId) view returns (uint256 mask, uint16 count, bool certified)",
  "function hasCertificate(address learner, uint256 bookId) view returns (bool certified, uint40 issuedAt)",
  "function books(uint256 bookId) view returns (uint16 chapterCount)",
]);

export const client = createPublicClient({
  chain: bsc,
  transport: fallback([http("https://bsc-dataseed.binance.org"), http("https://bsc-rpc.publicnode.com")]),
});

export const isAddr = (s: string): s is Address => isAddress(s.trim());

export type Progress = { mask: bigint; count: number; certified: boolean };

export async function progressOf(addr: Address, bookId: number): Promise<Progress> {
  const [mask, count, certified] = await client.readContract({
    address: ACADEMY, abi: academyAbi, functionName: "progressOf", args: [addr, BigInt(bookId)],
  });
  return { mask, count: Number(count), certified };
}

/** 0 = the book is not published on-chain yet (recording not open). */
export async function chapterCount(bookId: number): Promise<number> {
  return Number(await client.readContract({ address: ACADEMY, abi: academyAbi, functionName: "books", args: [BigInt(bookId)] }));
}

export async function certificate(addr: Address, bookId: number): Promise<{ ok: boolean; issuedAt: number }> {
  const [ok, issuedAt] = await client.readContract({
    address: ACADEMY, abi: academyAbi, functionName: "hasCertificate", args: [addr, BigInt(bookId)],
  });
  return { ok, issuedAt: Number(issuedAt) };
}

export const done = (mask: bigint, chapter: number) => (mask >> BigInt(chapter)) & 1n ? true : false;

/** Cumulative mask: everything already recorded plus this chapter. */
export const completeCalldata = (bookId: number, mask: bigint) =>
  encodeFunctionData({ abi: academyAbi, functionName: "completeChapters", args: [BigInt(bookId), mask] });

export const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
