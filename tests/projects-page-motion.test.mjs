import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const grid = readFileSync("src/components/ProjectGrid.tsx", "utf8");
const wheel = readFileSync("src/components/ProjectWheel3D.tsx", "utf8");
const styles = readFileSync("src/app/globals.css", "utf8");
const home = readFileSync("src/components/PortfolioHome.tsx", "utf8");

test("projects intro title uses letter markup in the page entrance timeline", () => {
  assert.match(grid, /projects-index-title-letter/);
  assert.match(grid, /const introLetters = section\.querySelectorAll/);
  assert.match(grid, /const entrance = gsap\.timeline/);
  assert.match(grid, /entrance[\s\S]*xPercent: 100[\s\S]*introLetters/);
  assert.match(grid, /introLetters[\s\S]*duration: 0\.78[\s\S]*0\.74/s);
});

test("wheel panels stay centered while mobile uses a shorter arc", () => {
  assert.match(wheel, /const isMobile = size\.width < 768/);
  assert.match(wheel, /isMobile \? MOBILE_PANEL_ARC : PANEL_ARC/);
  assert.match(wheel, /MOBILE_PANEL_ARC = 0\.34/);
  assert.match(wheel, /MOBILE_WHEEL_STEP = 0\.4/);
  assert.match(
    wheel,
    /position=\{\[0, 0, -0\.42\]\}/,
  );
});

test("wheel textures use the sRGB color space before their first render", () => {
  assert.match(wheel, /const texture = sourceTexture\.clone\(\)/);
  assert.match(wheel, /texture\.colorSpace = THREE\.SRGBColorSpace/);
  assert.match(wheel, /texture\.needsUpdate = true/);
  assert.match(wheel, /colorTexture\.dispose\(\)/);
  assert.match(wheel, /map=\{colorTexture\}/);
  assert.doesNotMatch(wheel, /map=\{sourceTexture\}/);
});

test("projects intro scrolls away outside the sticky wheel stage", () => {
  assert.match(
    grid,
    /<div className="projects-index-intro">[\s\S]*<\/div>\s*<section className="projects-wheel-stage relative sticky/s,
  );
  assert.match(
    styles,
    /\.projects-index-intro\s*\{[^}]*position: absolute[^}]*z-index: 10[^}]*background: transparent/s,
  );
  assert.match(styles, /\.projects-wheel-stage\s*\{[^}]*background: #000/s);
});

test("active project overlay follows the selected panel around the wheel", () => {
  assert.match(grid, /const activeOffset = activeIndex - scrollProgress/);
  assert.match(grid, /--project-shift-desktop/);
  assert.match(grid, /Math\.sin\(activeOffset \* 0\.65\) \* 138/);
  assert.match(grid, /--project-shift-mobile/);
  assert.match(grid, /Math\.sin\(activeOffset \* 0\.4\) \* 122/);
  assert.match(styles, /\.project-active-overlay\s*\{[^}]*translateY\(var\(--project-shift-desktop\)\)/s);
});

test("project open control stays fixed while its visual hover animation runs", () => {
  assert.doesNotMatch(grid, /import MagneticButton/);
  assert.doesNotMatch(grid, /<MagneticButton/);
  assert.match(
    grid,
    /const button = root\.querySelector<HTMLElement>\("\.project-open-button"\)/,
  );
  assert.match(grid, /<span className="project-open-button/);
  assert.doesNotMatch(grid, /hover:scale-105/);
});

test("the first panel keeps full geometry without intro offsets", () => {
  assert.match(wheel, /isMobile \? MOBILE_PANEL_ARC : PANEL_ARC/);
  assert.doesNotMatch(grid, /introProgress|setIntroProgress/);
  assert.doesNotMatch(wheel, /introProgress|introFactor/);
  assert.doesNotMatch(grid, /\(1 - introProgress\) \* 16\.5/);
});

test("projects typography has a dedicated mobile scale", () => {
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*\.projects-index-title/s);
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*\.project-active-title/s);
  assert.match(styles, /\.project-active-title\s*\{[^}]*display: flex/s);
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.projects-wheel-section \.project-active-title\s*\{[^}]*margin-inline: auto[\s\S]*flex-wrap: wrap/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.project-open-link\s*\{[^}]*top: 58%/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.projects-index-intro\s*\{[^}]*height: 24dvh/s,
  );
});

test("desktop intro keeps its original scale above but clear of the textured wheel", () => {
  assert.match(styles, /\.projects-index-title\s*\{[^}]*font-size: clamp\(3\.4rem, 8vw, 11rem\)/s);
  assert.match(styles, /\.project-wheel-canvas\s*\{[^}]*z-index: 20/s);
  assert.match(styles, /\.projects-index-heading\s*\{[^}]*z-index: 40/s);
});

test("back navigation marks the home page for a left-side GSAP entrance", () => {
  assert.match(grid, /href="\/\?entry=projects"/);
  assert.match(home, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(home, /gsap\.fromTo\(\s*root,/s);
  assert.match(home, /xPercent: reduceMotion \? 0 : -100/);
  assert.match(home, /onComplete: \(\) => \{\s*window\.history\.replaceState/s);
});
