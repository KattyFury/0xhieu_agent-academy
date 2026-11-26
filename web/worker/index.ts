// Worker entry for academy.0xhieu.xyz: static site from ./dist plus POST /api/claim.
import { onRequestPost } from "../functions/api/claim";
import { statusJson } from "./status";
export { StatusClock } from "./clock";

interface Env { ASSETS: Fetcher; RELAYER_KEY: string; GAS: KVNamespace; TG_BOT_TOKEN?: string; TG_CHAT_ID?: string; CLOCK: DurableObjectNamespace }

/** Real pages (the SPA's routes). Keep in sync with pickView in src/App.tsx. Anything else that would serve the HTML shell gets a 404. */
const VALID_PATH = /^\/(?:(?:courses|library|status|certificate|(?:course|book)\/[12](?:\/(?:\d|1[0-3])(?:\/practice)?)?|certificate\/(?:[12]\/)?0x[0-9a-fA-F]{40})\/?)?$/;

const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://bsc-dataseed.binance.org https://bsc-rpc.publicnode.com https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

function secure(res: Response, status = res.status): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(res.body, { status, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/claim") {
      if (request.method !== "POST") return secure(new Response("Method Not Allowed", { status: 405 }));
      return secure(await onRequestPost({ request, env }));
    }
    if (url.pathname === "/api/status") {
      await env.CLOCK.get(env.CLOCK.idFromName("status")).fetch("https://clock/"); // starts the timer if it is not running
      return secure(Response.json(await statusJson(env.GAS), { headers: { "cache-control": "public, max-age=60" } }));
    }
    const res = await env.ASSETS.fetch(request);
    // The asset layer falls back to index.html for unknown paths with status 200; make those a real 404 (the page shows "Page not found").
    const isShell = (res.headers.get("content-type") ?? "").includes("text/html");
    return secure(res, isShell && res.status === 200 && !VALID_PATH.test(url.pathname) ? 404 : res.status);
  },
};
