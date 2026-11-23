// Usage: node scripts/qa.mjs <baseUrl> <outDir>
// Screenshots every reader state at every viewport and prints measurements (book box, overflow, scroll, font sizes, flip timing).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const [base, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const VIEWPORTS = [[1920, 1080], [1440, 900], [1366, 768], [1024, 768], [393, 852], [360, 640], [320, 568]];
const STATES = [["d1-nowallet", "1?qa=nowallet"], ["d3-copied", "3?qa=copied"], ["d2-recorded", "2?qa=confirmed"], ["d4-locked", "4?qa=locked"],
  ["d5-ended", "5?qa=ended"], ["d1-error", "1?qa=error"], ["d2-midflip", "2?qa=flip"]];

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const measure = (page) => page.evaluate(() => {
  const vw = innerWidth, vh = innerHeight, b = document.querySelector(".bk-book")?.getBoundingClientRect();
  let minFont = 99;
  for (const el of document.querySelectorAll(".bk-screen *")) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    minFont = Math.min(minFont, parseFloat(getComputedStyle(el).fontSize));
  }
  const lead = document.querySelector(".t-lead");
  return {
    book: b ? `${Math.round(b.width)}x${Math.round(b.height)}@${Math.round(b.x)},${Math.round(b.y)}` : "-",
    usedPct: b ? Math.round((b.width / vw) * 100) : 0,
    inside: b ? b.left >= 0 && b.top >= 0 && b.right <= vw + 0.5 && (document.querySelector(".bk-single") ? true : b.bottom <= vh + 0.5) : false,
    overflow: [...document.querySelectorAll(".bk-book > .bk-page .bk-body")].map((x) => x.scrollHeight - x.clientHeight).join("/"),
    scrollX: document.documentElement.scrollWidth - vw, scrollY: document.documentElement.scrollHeight - vh,
    body: lead ? parseFloat(getComputedStyle(lead).fontSize) : 0,
    chars: lead ? Math.round(lead.getBoundingClientRect().width / (parseFloat(getComputedStyle(lead).fontSize) * 0.5)) : 0,
    minFont,
  };
});

console.log("viewport  state        book                  used inside overflow scrollX scrollY body chars minFont");
for (const [w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const [name, path] of STATES) {
    await page.goto(`${base}/#/book/001/${path}`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${w}x${h}-${name}.png` });
    const m = await measure(page);
    console.log(`${`${w}x${h}`.padEnd(9)} ${name.padEnd(12)} ${m.book.padEnd(21)} ${String(m.usedPct).padStart(3)}% ${String(m.inside).padEnd(6)} ${m.overflow.padEnd(8)} ${String(m.scrollX).padStart(7)} ${String(m.scrollY).padStart(7)} ${String(m.body).padStart(4)} ${String(m.chars).padStart(5)} ${m.minFont}`);
  }
  // Every day must fit its spread at desktop sizes.
  if (w >= 1024 && h >= 700) {
    const over = [];
    for (let d = 1; d <= 7; d++) {
      await page.goto(`${base}/#/book/001/${d}?qa=nowallet`, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);
      const o = await page.evaluate(() => [...document.querySelectorAll(".bk-book > .bk-page .bk-body")].map((x) => x.scrollHeight - x.clientHeight));
      if (o.some((v) => v > 0)) over.push(`day${d}:${o.join("/")}`);
    }
    console.log(`${`${w}x${h}`.padEnd(9)} all 7 days overflow: ${over.length ? over.join(" ") : "none"}`);
    // Real page turn: time it and check focus.
    await page.goto(`${base}/#/book/001/1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);
    const flip = await page.evaluate(() => new Promise((res) => {
      const t0 = performance.now(); let seen = false;
      const mo = new MutationObserver(() => {
        const leaf = document.querySelector(".bk-leaf");
        if (leaf) seen = true;
        if (seen && !leaf) { mo.disconnect(); const ms = Math.round(performance.now() - t0);
          setTimeout(() => res({ ms, focus: document.activeElement?.tagName + " " + (document.activeElement?.textContent ?? "").slice(0, 30), url: location.hash }), 50); }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      setTimeout(() => { mo.disconnect(); res({ ms: -1, focus: "TIMEOUT", url: location.hash }); }, 4000);
    }));
    const ms = flip.ms, focus = flip.focus + " url=" + flip.url;
    console.log(`${`${w}x${h}`.padEnd(9)} flip: ${ms}ms, focus ${focus}`);
  }
  await page.close();
}
await browser.close();
