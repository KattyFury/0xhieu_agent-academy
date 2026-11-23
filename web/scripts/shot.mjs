// Usage: node scripts/shot.mjs <url> <out.png> [width] [height]
// Screenshots at an exact viewport (installed Chrome, no browser download) and prints measurements.
import { chromium } from "playwright-core";

const [url, out, w = "1440", h = "900"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: out });

const m = await page.evaluate(() => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const vw = innerWidth, vh = innerHeight;
  const book = document.querySelector(".bk-book");
  const bodies = [...document.querySelectorAll(".bk-body")].map((b) => ({ overflowPx: b.scrollHeight - b.clientHeight }));
  let minFont = 99;
  for (const el of document.querySelectorAll("body *")) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    minFont = Math.min(minFont, parseFloat(getComputedStyle(el).fontSize));
  }
  const lead = document.querySelector(".t-lead");
  return {
    viewport: `${vw}x${vh}`,
    book: box(book),
    bookWidthUsedPct: book ? Math.round((book.getBoundingClientRect().width / vw) * 100) : null,
    bookInsideViewport: book ? (() => { const r = book.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= vw && r.bottom <= vh; })() : null,
    pages: [...document.querySelectorAll(".bk-page")].map(box),
    pageOverflow: bodies,
    documentScroll: { x: document.documentElement.scrollWidth - vw, y: document.documentElement.scrollHeight - vh },
    bodyTextPx: lead ? parseFloat(getComputedStyle(lead).fontSize) : null,
    leadLineChars: lead ? Math.round(lead.getBoundingClientRect().width / (parseFloat(getComputedStyle(lead).fontSize) * 0.5)) : null,
    smallestTextPx: minFont,
  };
});
console.log(JSON.stringify(m, null, 1));
await browser.close();
