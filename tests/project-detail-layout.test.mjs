import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const data = readFileSync("src/data/projects.ts", "utf8");
const types = readFileSync("src/types/index.ts", "utf8");
const detail = readFileSync(
  "src/app/project/[slug]/ProjectDetailClient.tsx",
  "utf8",
);
const styles = readFileSync("src/app/globals.css", "utf8");

test("projects expose a typed detail theme and gallery layout", () => {
  assert.match(types, /export type ProjectGalleryLayout = "centered" \| "alternating"/);
  assert.match(types, /export interface ProjectDetailTheme/);
  assert.match(types, /detailTheme: ProjectDetailTheme/);
});

test("detail themes follow the supplied project order", () => {
  assert.match(
    data,
    /neutralAlternatingDetailTheme[\s\S]*background: "#E5E6DB"[\s\S]*foreground: "#141314"[\s\S]*galleryLayout: "alternating"/,
  );
  assert.match(data, /slug: "leekcup-draw"[\s\S]*detailTheme: neutralAlternatingDetailTheme/);
  assert.match(data, /slug: "ipomoea-galaxy"[\s\S]*detailTheme: neutralAlternatingDetailTheme/);
  assert.match(data, /slug: "talithakum-ndis"[\s\S]*background: "#F9FBFF"[\s\S]*foreground: "#0019FF"/);
  assert.match(data, /slug: "web3-projects"[\s\S]*background: "#EBDACB"[\s\S]*foreground: "#225A32"/);
  assert.match(data, /slug: "past-porfolios"[\s\S]*background: "#FBF9FF"[\s\S]*foreground: "#5F2FFE"/);
});

test("detail page consumes theme variables instead of fixed colors", () => {
  assert.match(detail, /--detail-background/);
  assert.match(detail, /--detail-foreground/);
  assert.match(detail, /project\.detailTheme\.background/);
  assert.match(detail, /project\.detailTheme\.foreground/);
  assert.doesNotMatch(detail, /DETAIL_BACKGROUND|DETAIL_ACCENT/);
  assert.match(styles, /\.project-detail-page\s*\{[^}]*background: var\(--detail-background\)[^}]*color: var\(--detail-foreground\)/s);
});

test("gallery centers normal images and alternates the second and third projects", () => {
  assert.match(detail, /project-detail-gallery--\$\{project\.detailTheme\.galleryLayout\}/);
  assert.match(detail, /data-alignment=\{alignment\}/);
  assert.match(styles, /\.project-detail-gallery-item\s*\{[^}]*margin-inline: auto/s);
  assert.match(styles, /\[data-alignment="right"\][^}]*margin-left: auto[^}]*margin-right: 0/s);
  assert.match(styles, /\[data-alignment="left"\][^}]*margin-right: auto[^}]*margin-left: 0/s);
});

test("detail header is inset and inherits each project theme", () => {
  assert.match(detail, /className="project-detail-header fixed/);
  assert.match(styles, /\.project-detail-header\s*\{[^}]*padding-top: clamp\([^}]*padding-inline: clamp\([^}]*color: var\(--detail-foreground\)/s);
});

test("alternating galleries and the detail header adapt on mobile", () => {
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.project-detail-gallery--alternating \.project-detail-gallery-item\s*\{[^}]*width: 100%[^}]*margin-inline: auto/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.project-detail-header\s*\{[^}]*padding-top: max\([^}]*padding-inline: 1\.15rem/s,
  );
});
