// Worker entry for academy.0xhieu.xyz: static site from ./dist plus POST /api/claim.
import { onRequestPost } from "../functions/api/claim";

interface Env { ASSETS: Fetcher; RELAYER_KEY: string; GAS: KVNamespace; TG_BOT_TOKEN?: string; TG_CHAT_ID?: string }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/claim") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
