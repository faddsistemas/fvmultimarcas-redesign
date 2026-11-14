import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base =
  process.env.PREVIEW_BASE ||
  "https://faddsistemas.github.io/fvmultimarcas-redesign/";
const outDir = "/opt/cursor/artifacts";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const contexts = [
  { name: "desktop", viewport: { width: 1280, height: 800 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
];

const consoleErrors = [];

for (const { name, viewport } of contexts) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (
      text.includes("WebSocket") ||
      text.includes("hmr") ||
      text.includes("Failed to load resource") ||
      text.includes("favicon")
    ) {
      return;
    }
    consoleErrors.push(`${name}: ${text}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`${name}: ${err.message}`));

  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const width = name === "desktop" ? "1280" : "390";
  await page.screenshot({
    path: `${outDir}/hero-carousel-${name}-${width}.png`,
    fullPage: false,
  });

  await page.locator('[data-slot="carousel"] article button').first().click();
  await page.waitForSelector('[data-slot="dialog-content"], [data-slot="drawer-content"]', {
    state: "visible",
    timeout: 15000,
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `${outDir}/vehicle-modal-${name}-${width}.png`,
    fullPage: false,
  });

  await context.close();
}

await browser.close();

if (consoleErrors.length) {
  console.error("Console errors:", consoleErrors.join("\n"));
  process.exit(1);
}
console.log("Screenshots saved to", outDir);
