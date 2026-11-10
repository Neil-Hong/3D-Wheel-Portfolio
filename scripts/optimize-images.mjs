#!/usr/bin/env node
/**
 * Convert PNG/JPEG images to resized WebP files next to the originals.
 *
 *   node scripts/optimize-images.mjs [--delete] [--max-width=2560] [--quality=82] <file|dir>...
 *
 * --delete removes each source file after a successful conversion.
 * Files that are already .webp are skipped.
 */
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { extname, join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, value = "true"] = arg.slice(2).split("=");
      return [key, value];
    }),
);
const inputs = args.filter((arg) => !arg.startsWith("--"));
const maxWidth = Number(flags["max-width"] ?? 2560);
const quality = Number(flags.quality ?? 82);
const deleteSource = flags.delete === "true";
const sourceExtensions = new Set([".png", ".jpg", ".jpeg"]);

if (!inputs.length) {
  console.error("Pass at least one file or directory.");
  process.exit(1);
}

function collect(path) {
  if (statSync(path).isDirectory()) {
    return readdirSync(path).flatMap((name) => collect(join(path, name)));
  }
  return sourceExtensions.has(extname(path).toLowerCase()) ? [path] : [];
}

const files = inputs.flatMap(collect);
let before = 0;
let after = 0;

for (const file of files) {
  const output = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const sourceSize = statSync(file).size;

  await sharp(file)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);

  const outputSize = statSync(output).size;
  before += sourceSize;
  after += outputSize;
  console.log(
    `${file} -> ${output}  ${(sourceSize / 1024).toFixed(0)}K -> ${(outputSize / 1024).toFixed(0)}K`,
  );

  if (deleteSource) {
    unlinkSync(file);
  }
}

console.log(
  `\n${files.length} files: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`,
);
