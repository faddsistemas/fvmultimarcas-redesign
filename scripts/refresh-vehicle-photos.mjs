#!/usr/bin/env node
/**
 * Fetches gallery images from each listing on fvmultimarcas.com.br
 * (-scaled.webp from wp-content/uploads) and writes optimized WebP to public/vehicles/.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataPath = path.join(root, "data/vehicles.json");

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 84;

const VEHICLE_IMAGE_RE =
  /https:\/\/fvmultimarcas\.com\.br\/wp-content\/uploads\/[^"'\s]+\.(?:webp|jpe?g|png)/gi;

function galleryUrls(html) {
  const seen = new Set();
  const urls = [];
  for (const match of html.matchAll(VEHICLE_IMAGE_RE)) {
    const url = match[0].replace(/['"]+$/, "");
    const lower = url.toLowerCase();
    if (lower.includes("logo") || lower.includes("design-sem-nome")) continue;
    if (!lower.includes("whatsapp") && !lower.includes("scaled.")) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "FV-redesign-photo-refresh/1.0 (+https://faddsistemas.github.io/fvmultimarcas-redesign/)" },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "FV-redesign-photo-refresh/1.0" },
  });
  if (!res.ok) throw new Error(`download ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function optimizeToWebp(buffer) {
  const image = sharp(buffer).rotate();
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : image;
  const { data, info } = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function main() {
  const vehicles = JSON.parse(await fs.readFile(dataPath, "utf8"));
  const report = [];

  for (const vehicle of vehicles) {
    const html = await fetchText(vehicle.sourceUrl);
    const urls = galleryUrls(html);
    if (urls.length === 0) {
      report.push({ slug: vehicle.slug, error: "no gallery URLs" });
      continue;
    }

    const outDir = path.join(root, "public/vehicles", vehicle.slug);
    await fs.mkdir(outDir, { recursive: true });

    const photos = [];
    const limit = Math.min(urls.length, vehicle.photos?.length || 5, 5);

    for (let i = 0; i < limit; i++) {
      const srcUrl = urls[i];
      const outFile = `${i + 1}.webp`;
      const outPath = path.join(outDir, outFile);
      const beforeStat = await fs.stat(outPath).catch(() => null);

      const raw = await fetchBuffer(srcUrl);
      const { data, width, height } = await optimizeToWebp(raw);
      await fs.writeFile(outPath, data);

      const prev = vehicle.photos[i];
      report.push({
        slug: vehicle.slug,
        file: outFile,
        sourceUrl: srcUrl,
        beforeBytes: beforeStat?.size ?? null,
        afterBytes: data.length,
        width,
        height,
        prevWidth: prev?.width,
        prevHeight: prev?.height,
      });

      photos.push({
        src: `/vehicles/${vehicle.slug}/${outFile}`,
        width,
        height,
        alt: prev?.alt ?? `${vehicle.title} foto ${i + 1}`,
      });
    }

    vehicle.photos = photos;
    await new Promise((r) => setTimeout(r, 400));
  }

  await fs.writeFile(dataPath, `${JSON.stringify(vehicles, null, 2)}\n`);
  await fs.writeFile(
    path.join(root, "data/photo-refresh-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(`Updated ${vehicles.length} vehicles, ${report.length} photos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});