#!/usr/bin/env node
// Regenerates VALID_EVAL_FILES in src/components/EvaluationsGallery.tsx
// by scanning public/evaluations/ for files matching eval-NNN.jpg.
// Also bumps ASSET_VERSION to the current timestamp.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const evalDir = resolve(root, "public/evaluations");
const target = resolve(root, "src/components/EvaluationsGallery.tsx");

const files = readdirSync(evalDir)
  .filter((f) => /^eval-\d{3}\.jpg$/i.test(f))
  .sort();

const version = new Date()
  .toISOString()
  .replace(/[-:T]/g, "")
  .slice(0, 12); // YYYYMMDDHHMM

const arrayLiteral =
  "[\n" + files.map((f) => `  "${f}",`).join("\n") + "\n] as const";

let src = readFileSync(target, "utf8");

src = src.replace(
  /const ASSET_VERSION = "[^"]*";/,
  `const ASSET_VERSION = "${version}";`
);
src = src.replace(
  /const VALID_EVAL_FILES = \[[\s\S]*?\] as const;/,
  `const VALID_EVAL_FILES = ${arrayLiteral};`
);

writeFileSync(target, src);
console.log(`Wrote ${files.length} files. ASSET_VERSION=${version}`);
