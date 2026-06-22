import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync("src/components/PortfolioHome.tsx", "utf8");
const styles = readFileSync("src/app/globals.css", "utf8");

test("section and project titles share the kinetic letter reveal", () => {
  assert.match(
    component,
    /<h2 className="kinetic-title">\s*<SplitLetters text=\{children\} \/>/,
  );
  assert.match(
    component,
    /<h2 className="kinetic-title">\s*<SplitLetters text="Explore the 3D project wheel" \/>/,
  );
  assert.match(
    component,
    /<h2 className="footer-title kinetic-title">\s*<SplitLetters text="Let's connect" \/>/,
  );
  assert.doesNotMatch(component, /projects-cta-inner reveal-item/);
});

test("experience highlights use the same flow gap as technologies", () => {
  assert.match(styles, /--experience-flow-gap:/);
  assert.match(styles, /\.experience-tech\s*\{[^}]*margin-top: var\(--experience-flow-gap\)/s);
  assert.match(styles, /\.experience-stack-card ul\s*\{[^}]*margin-top: var\(--experience-flow-gap\)/s);
  assert.doesNotMatch(styles, /\.experience-stack-card ul\s*\{[^}]*margin-top: auto/s);
});

test("about details distribute across the full height of the media column", () => {
  assert.match(styles, /\.about-right\s*\{[^}]*display: flex[^}]*flex-direction: column/s);
  assert.match(styles, /\.about-row\s*\{[^}]*flex: 1 1 0/s);
  assert.match(styles, /\.about-tags\s*\{[^}]*flex: 1\.15 1 0/s);
});

test("mobile footer uses flow layout so contact content stays visible", () => {
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.footer-title\s*\{[^}]*position: static/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.footer-links\s*\{[^}]*position: static/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.footer-title\s*\{[^}]*margin-top: clamp\(5rem, 14vh, 8rem\)/s,
  );
  assert.doesNotMatch(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.footer-title\s*\{[^}]*margin-top: auto/s,
  );
});

test("mobile hero video has a horizontal framing adjustment", () => {
  assert.match(
    styles,
    /@media \(max-width: 768px\)[\s\S]*\.hero-video\s*\{[^}]*scaleX\(1\.16\)/s,
  );
});

test("contact links use recognizable social brand icons", () => {
  assert.match(
    component,
    /import \{ FaGithub, FaLinkedin \} from "react-icons\/fa"/,
  );
  assert.match(component, /<FaLinkedin[^>]*aria-hidden="true"/);
  assert.match(component, /<FaGithub[^>]*aria-hidden="true"/);
  assert.doesNotMatch(component, /ExternalLink|GitFork/);
});
