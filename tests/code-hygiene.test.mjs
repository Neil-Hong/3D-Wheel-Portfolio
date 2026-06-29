import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const styles = readFileSync("src/app/globals.css", "utf8");
const wheel = readFileSync("src/components/ProjectWheel3D.tsx", "utf8");
const home = readFileSync("src/components/PortfolioHome.tsx", "utf8");
const detail = readFileSync(
  "src/app/project/[slug]/ProjectDetailClient.tsx",
  "utf8",
);
const projectData = readFileSync("src/data/projects.ts", "utf8");
const types = readFileSync("src/types/index.ts", "utf8");
const nextConfig = readFileSync("next.config.ts", "utf8");

const retiredFiles = [
  "src/components/AnimatedTypography.tsx",
  "src/components/ImageReveal.tsx",
  "src/components/MagneticButton.tsx",
  "src/components/Navigation.tsx",
  "src/components/PageTransition.tsx",
  "src/components/ParallaxLayer.tsx",
  "src/components/Preloader.tsx",
  "src/components/ProjectCard.tsx",
  "src/components/ProjectIndicators.tsx",
  "src/components/ScrollProgress.tsx",
  "src/hooks/useAnimationFrame.ts",
  "src/hooks/useMagnetic.ts",
  "src/hooks/useMediaQuery.ts",
  "src/hooks/useParallax.ts",
  "src/hooks/useScrollProgress.ts",
  "src/hooks/useSmoothScroll.ts",
  "src/lib/utils.ts",
  "src/utils/gsap.ts",
  "src/utils/placeholders.ts",
];

test("retired component islands are removed", () => {
  for (const file of retiredFiles) {
    assert.equal(existsSync(file), false, `${file} should be removed`);
  }
});

test("packages used only by retired code are removed", () => {
  const packages = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const dependency of [
    "@studio-freight/lenis",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tw-animate-css",
    "ffmpeg-static",
  ]) {
    assert.equal(packages[dependency], undefined, `${dependency} should be removed`);
  }
});

test("global styles do not ship unused theme scaffolding", () => {
  assert.doesNotMatch(styles, /tw-animate-css/);
  assert.doesNotMatch(styles, /@custom-variant dark/);
  assert.doesNotMatch(styles, /--color-sidebar/);
  assert.doesNotMatch(styles, /\.frame-section/);
});

test("fonts remain visible while local font files load", () => {
  assert.doesNotMatch(styles, /font-display:\s*block/);
  assert.match(styles, /font-display:\s*swap/);
});

test("the wheel renders only on demand and releases generated geometry", () => {
  assert.match(wheel, /frameloop="demand"/);
  assert.doesNotMatch(wheel, /preserveDrawingBuffer/);
  assert.match(wheel, /geometry\?\.dispose\(\)/);
});

test("active project data does not retain unused legacy fields", () => {
  assert.doesNotMatch(projectData, /export const navigation/);
  assert.doesNotMatch(projectData, /^\s*color:/m);
  assert.doesNotMatch(types, /ProjectIndicator/);
  assert.doesNotMatch(types, /awards\?:/);
  assert.doesNotMatch(types, /^\s*color:/m);
});

test("detail media uses responsive Next images", () => {
  assert.match(detail, /import Image from "next\/image"/);
  assert.doesNotMatch(detail, /backgroundImage:/);
  assert.match(detail, /sizes="100vw"/);
  assert.match(detail, /sizes=\{\s*project\.detailTheme\.galleryLayout/);
  assert.match(detail, /loading="eager"/);
  assert.match(nextConfig, /qualities:\s*\[75, 90\]/);
});

test("letter splitting reuses one word list per render", () => {
  assert.match(home, /function SplitLetters[\s\S]*const words = text\.split\(" "\)/);
  assert.doesNotMatch(home, /wordIndex < text\.split\(" "\)\.length/);
});
