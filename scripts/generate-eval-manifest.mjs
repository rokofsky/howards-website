#!/usr/bin/env node
// Regenerates VALID_EVAL_FILES in src/components/EvaluationsGallery.tsx
// by scanning public/evaluations/ for files matching eval-NNN.jpg.
// Also bumps ASSET_VERSION to the current timestamp.
// Includes a build-time guardrail that verifies the regenerated list matches
// the actual filesystem; mismatches are logged as errors.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const evalDir = resolve(root, "public/evaluations");
const target = resolve(root, "src/components/EvaluationsGallery.tsx");

const allFiles = readdirSync(evalDir);
const files = allFiles
  .filter((f) => /^eval-\d{3}\.jpg$/i.test(f))
  .sort();

// Guardrail: warn about any unexpected files in the folder
const unexpected = allFiles.filter(
  (f) => !/^eval-\d{3}\.jpg$/i.test(f) && !f.startsWith(".")
);
if (unexpected.length > 0) {
  console.error(
    `[eval-manifest] WARNING: ${unexpected.length} unexpected file(s) in public/evaluations/ (ignored):`,
    unexpected
  );
}

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

// Build-time guardrail: re-read the written file and verify the embedded list
// matches the actual filesystem 1:1.
const written = readFileSync(target, "utf8");
const match = written.match(/const VALID_EVAL_FILES = \[([\s\S]*?)\] as const;/);
const embedded = match
  ? Array.from(match[1].matchAll(/"([^"]+)"/g)).map((m) => m[1])
  : [];

const fsSet = new Set(files);
const embSet = new Set(embedded);
const missingFromManifest = files.filter((f) => !embSet.has(f));
const ghostInManifest = embedded.filter((f) => !fsSet.has(f));

if (missingFromManifest.length || ghostInManifest.length) {
  console.error(
    "[eval-manifest] ERROR: VALID_EVAL_FILES does not match public/evaluations/."
  );
  if (missingFromManifest.length)
    console.error("  Missing from manifest:", missingFromManifest);
  if (ghostInManifest.length)
    console.error("  Ghost entries in manifest:", ghostInManifest);
  process.exit(1);
}

console.log(
  `[eval-manifest] OK — wrote ${files.length} files. ASSET_VERSION=${version}`
);
