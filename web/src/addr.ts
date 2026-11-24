import type { Address } from "viem";

/** Light 0x-address check (no viem), so the landing page does not load the chain code. Chain code re-checks with viem. */
export const isAddr = (s: string): s is Address => /^0x[0-9a-fA-F]{40}$/.test(s.trim());
