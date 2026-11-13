import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const basePath = process.env.SMOKE_BASE_PATH || "/fvmultimarcas-redesign";
const port = Number(process.env.SMOKE_PORT || 4317);

if (!fs.existsSync(root)) {
  console.error("Missing out/ — run npm run build with NEXT_PUBLIC_BASE_PATH first.");
  process.exit(1);
}

const app = express();
app.use(
  basePath,
  express.static(root, {
    index: ["index.html"],
    extensions: ["html"],
  }),
);
app.use(basePath, (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const rel = req.path.endsWith("/") ? `${req.path}index.html` : req.path;
  const file = path.join(root, rel);
  if (fs.existsSync(file)) return res.sendFile(file);
  next();
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Static preview http://127.0.0.1:${port}${basePath}/`);
});
