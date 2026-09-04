/**
 * Structural checks over the built CSS and the HTML pages.
 *
 * These are the mistakes that are easy to make in a framework built out
 * of custom properties and easy to miss by eye: a component that
 * hardcodes a colour, a class used in a page that the stylesheet never
 * defines, a mask whose data URI got mangled, a relative link that does
 * not resolve.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const fail = [];
const warn = [];
const check = (cond, msg) => { if (!cond) fail.push(msg); };

const css = readFileSync("dist/talwinder.css", "utf8");
const min = readFileSync("dist/talwinder.min.css", "utf8");

/* ---------------------------------------------------------------- CSS -- */

// Balanced braces in both builds.
for (const [name, text] of [["talwinder.css", css], ["talwinder.min.css", min]]) {
  const open = (text.match(/{/g) || []).length;
  const close = (text.match(/}/g) || []).length;
  check(open === close, `${name}: ${open} "{" vs ${close} "}"`);
}

// Every mask survived minification. Data URIs contain braces, colons and
// semicolons, so a careless minifier eats them.
const masksFull = (css.match(/--tw-mask-[\w-]+:/g) || []).length;
const masksMin = (min.match(/--tw-mask-[\w-]+:/g) || []).length;
check(masksFull > 0, "no --tw-mask-* declarations found");
check(masksFull === masksMin, `masks lost in minification: ${masksFull} -> ${masksMin}`);

const svgFull = (css.match(/data:image\/svg\+xml/g) || []).length;
const svgMin = (min.match(/data:image\/svg\+xml/g) || []).length;
check(svgFull === svgMin, `svg data URIs lost in minification: ${svgFull} -> ${svgMin}`);

// Every mask's SVG must still parse as balanced tags after minification.
for (const m of min.matchAll(/(--tw-mask-[\w-]+):url\("([^"]*)"\)/g)) {
  const [, name, uri] = m;
  check(uri.includes("<svg") && uri.includes("</svg>"), `${name}: svg truncated in min build`);
  const opens = (uri.match(/<(?!\/)[a-zA-Z]/g) || []).length;
  const selfClose = (uri.match(/\/>/g) || []).length;
  const closes = (uri.match(/<\//g) || []).length;
  check(opens === selfClose + closes, `${name}: unbalanced svg tags in min build`);
}

/* Components must not hardcode colour. The whole architecture rests on
   them reading tokens instead, so this is the load-bearing rule.
   Allowances: pure white and black for on-colour text, and rgba() used
   for translucent highlights and shadows over an unknown ground. */
const components = readFileSync("src/06-components.css", "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");
const ALLOWED_HEX = new Set(["#fff", "#ffffff", "#000", "#000000"]);
for (const m of components.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
  if (!ALLOWED_HEX.has(m[0].toLowerCase())) {
    fail.push(`06-components.css hardcodes colour ${m[0]} (use a token)`);
  }
}

// Every art style must define the tokens components rely on most.
const styles = readFileSync("src/03-art-styles.css", "utf8");
const REQUIRED = ["--tw-bg", "--tw-surface", "--tw-ink", "--tw-primary",
                  "--tw-on-primary", "--tw-accent", "--tw-on-accent",
                  "--tw-support", "--tw-line", "--tw-orn-ink"];
const styleNames = [...styles.matchAll(/\[data-tw-art="(\w+)"\]\s*{([\s\S]*?)\n}/g)];
check(styleNames.length >= 9, `expected 9 art styles, found ${styleNames.length}`);
for (const [, name, body] of styleNames) {
  for (const tok of REQUIRED) {
    check(new RegExp(`${tok}\\s*:`).test(body), `art style "${name}" does not set ${tok}`);
  }
}

// Every animation should be switched off for reduced motion. Collect the
// keyframe names actually used, then confirm a reduce block exists in the
// same source file.
for (const f of readdirSync("src")) {
  const text = readFileSync(join("src", f), "utf8");
  const usesAnim = /animation:\s*[\w-]+/.test(text);
  const hasGuard = /prefers-reduced-motion:\s*reduce/.test(text);
  if (usesAnim && !hasGuard) {
    fail.push(`${f} declares animations but has no prefers-reduced-motion block`);
  }
}

/* --------------------------------------------------------------- HTML -- */

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) pages.push(p);
  }
})(".");

check(pages.length >= 8, `expected at least 8 html pages, found ${pages.length}`);

// Class names the stylesheet defines.
const defined = new Set([...css.matchAll(/\.(tw-[\w-]+)/g)].map((m) => m[1]));

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const rel = page.replace(/\\/g, "/");

  check(/<html[^>]+lang=/.test(html), `${rel}: <html> has no lang attribute`);
  check(/<title>/.test(html), `${rel}: no <title>`);
  check(/name="viewport"/.test(html), `${rel}: no viewport meta`);
  check(/talwinder(\.min)?\.css/.test(html), `${rel}: does not link the framework`);

  // Prose must not contain em or en dashes.
  const prose = html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  if (/[—–]/.test(prose)) {
    fail.push(`${rel}: contains an em or en dash in visible text`);
  }

  // Every tw- class used must exist in the stylesheet.
  const used = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c.startsWith("tw-")) used.add(c);
  }
  for (const c of used) {
    // Page-local styles may legitimately define their own tw- prefixed
    // rules; only flag ones neither the framework nor the page defines.
    if (!defined.has(c) && !new RegExp(`\\.${c}\\b`).test(html)) {
      fail.push(`${rel}: uses .${c} which is not defined anywhere`);
    }
  }

  // Relative links must resolve on disk. Strip code samples first, since
  // those contain illustrative paths that are not meant to exist.
  const linkable = html
    .replace(/<pre[\s\S]*?<\/pre>/g, "")
    .replace(/<code[\s\S]*?<\/code>/g, "");
  for (const m of linkable.matchAll(/(?:href|src)="([^"#?][^"]*)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    let target = resolve(dirname(page), href.split(/[?#]/)[0]);
    if (href.endsWith("/")) target = join(target, "index.html");
    if (!existsSync(target)) {
      fail.push(`${rel}: link "${href}" does not resolve`);
    } else if (statSync(target).isDirectory() && !existsSync(join(target, "index.html"))) {
      fail.push(`${rel}: link "${href}" is a directory with no index.html`);
    }
  }

  // Decorative ornaments should be hidden from assistive tech.
  for (const m of html.matchAll(/<div[^>]*class="[^"]*tw-(?:pattern|edge)-[^"]*"[^>]*>/g)) {
    if (!/aria-hidden/.test(m[0])) {
      warn.push(`${rel}: decorative ornament without aria-hidden`);
    }
  }
}

/* -------------------------------------------------------------- report -- */

for (const w of warn) console.log(`warn  ${w}`);
for (const f of fail) console.error(`FAIL  ${f}`);

console.log(
  `\n${pages.length} pages, ${defined.size} classes, ${masksFull} masks, ` +
  `${styleNames.length} art styles`
);

if (fail.length) {
  console.error(`\n${fail.length} problem${fail.length === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log(warn.length ? `passed with ${warn.length} warnings` : "all checks passed");
