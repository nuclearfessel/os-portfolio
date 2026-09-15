/**
 * Generates the consumable web theme (src/index.css) and the portable token
 * object (src/generated/tokens.tsx) from tokens.json.
 *
 * tokens.json (DTCG) is the single source of truth. This runs on dev start and
 * on every tokens.json change (see vite.config.ts) and before build/typecheck
 * (see package.json). Do not edit the generated files by hand.
 *
 * - src/index.css        the design system's theme. The preview app imports it,
 *                        and consuming apps import this same file (web).
 * - src/generated/tokens.tsx  hex token object for mobile (Expo) and any other
 *                             platform, so web + mobile share one source.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const tokensPath = join(root, "tokens.json");
const templatePath = join(here, "theme-template.css");
const cssOut = join(root, "src", "index.css");
const tsOutDir = join(root, "src", "generated");
const indexHtmlPath = join(root, "index.html");
const faviconOut = join(root, "public", "favicon.svg");

/** Resolve a DTCG node's $value, following {alias} references. */
function resolveValue(node, tokens) {
  const raw = node?.$value;
  if (typeof raw === "string" && raw.startsWith("{") && raw.endsWith("}")) {
    const path = raw.slice(1, -1).split(".");
    let cur = tokens;
    for (const key of path) cur = cur?.[key];
    return resolveValue(cur, tokens);
  }
  return raw;
}

function hexToHslChannels(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      default:
        hue = (r - g) / d + 4;
    }
    hue /= 6;
  }
  const H = Math.round(hue * 360);
  const S = Math.round(s * 1000) / 10;
  const L = Math.round(l * 1000) / 10;
  return `${H} ${S}% ${L}%`;
}

function toFontStack(value) {
  return Array.isArray(value) ? value.join(", ") : value;
}

function normalizeHex(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${h}`;
}

/** Pick black or white text for best contrast on the given background hex. */
function contrastColor(hex) {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/** First alphanumeric character of the design system's title, uppercased. */
function faviconLetter() {
  let title = "";
  try {
    const html = readFileSync(indexHtmlPath, "utf8");
    title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
  } catch {
    title = "";
  }
  const match = title.match(/[A-Za-z0-9]/);
  return (match?.[0] ?? "D").toUpperCase();
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildFavicon(tokens) {
  const primary = normalizeHex(resolveValue(tokens.color.light.primary, tokens));
  const letter = escapeXml(faviconLetter());
  const fg = contrastColor(primary);
  return `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="36" fill="${primary}"/>
  <text x="90" y="92" fill="${fg}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="104" font-weight="700" text-anchor="middle" dominant-baseline="central">${letter}</text>
</svg>
`;
}

function tokenEntries(scope, tokens) {
  const out = {};
  const walk = (target, source) => {
    for (const [name, node] of Object.entries(source ?? {})) {
      if (name.startsWith("$")) continue;
      if (node && typeof node === "object" && "$value" in node) {
        target[name] = resolveValue(node, tokens);
      } else if (node && typeof node === "object") {
        target[name] = {};
        walk(target[name], node);
      }
    }
  };
  walk(out, tokens.color[scope]);
  return out;
}

function colorEntries(scope, tokens) {
  return tokenEntries(scope, tokens);
}

function kebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function dimensionAliasCssValue(raw, dimension) {
  if (typeof raw !== "string") return raw;
  const match = raw.match(
    new RegExp(`^\\{${dimension}\\.(primitive|semantic|component)\\.([^}]+)\\}$`),
  );
  if (!match) return raw;
  const [, layer, path] = match;
  const suffix = path
    .split(".")
    .map(kebabCase)
    .join("-");
  return `var(--os-${dimension}-${layer}-${suffix})`;
}

function dimensionCssEntries(dimension, tokens) {
  const source = tokens[dimension];
  const lines = [
    `  --os-${dimension}-base: ${resolveValue(source.base, tokens)};`,
  ];
  for (const layer of ["primitive", "semantic", "component"]) {
    const walk = (node, path) => {
      for (const [name, child] of Object.entries(node ?? {})) {
        if (name.startsWith("$")) continue;
        const nextPath = [...path, name];
        if (child && typeof child === "object" && "$value" in child) {
          const suffix = nextPath.map(kebabCase).join("-");
          lines.push(
            `  --os-${dimension}-${layer}-${suffix}: ${dimensionAliasCssValue(child.$value, dimension)};`,
          );
        } else if (child && typeof child === "object") {
          walk(child, nextPath);
        }
      }
    };
    walk(source[layer], []);
  }
  return lines.join("\n");
}

function dimensionEntries(layer, dimension, tokens) {
  const out = {};
  const walk = (target, source) => {
    for (const [name, node] of Object.entries(source ?? {})) {
      if (name.startsWith("$")) continue;
      if (node && typeof node === "object" && "$value" in node) {
        target[name] = resolveValue(node, tokens);
      } else if (node && typeof node === "object") {
        target[name] = {};
        walk(target[name], node);
      }
    }
  };
  walk(out, tokens[dimension][layer]);
  return out;
}

function structuredDimensionEntries(dimension, tokens) {
  return {
    base: resolveValue(tokens[dimension].base, tokens),
    primitive: dimensionEntries("primitive", dimension, tokens),
    semantic: dimensionEntries("semantic", dimension, tokens),
    component: dimensionEntries("component", dimension, tokens),
  };
}

function componentCssEntries(scope, tokens) {
  const lines = [];
  const walk = (node, path) => {
    for (const [name, child] of Object.entries(node ?? {})) {
      if (name.startsWith("$")) continue;
      const nextPath = [...path, name];
      if (child && typeof child === "object" && "$value" in child) {
        const raw = child.$value;
        const match = typeof raw === "string"
          ? raw.match(/^\{color\.(light|dark)\.([^}]+)\}$/)
          : null;
        if (!match || match[1] !== scope) {
          throw new Error(
            `Component color ${scope}.${nextPath.join(".")} must alias a semantic ${scope} color`,
          );
        }
        const semanticName = match[2]
          .split(".")
          .map(kebabCase)
          .join("-");
        lines.push(`  --component-${nextPath.map(kebabCase).join("-")}: var(--${semanticName});`);
      } else {
        walk(child, nextPath);
      }
    }
  };
  walk(tokens.color.component[scope], []);
  return lines.join("\n");
}

function buildCss(tokens) {
  let css = readFileSync(templatePath, "utf8");
  const replacements = {};

  // Light/dark semantic color channels (HSL)
  for (const scope of ["light", "dark"]) {
    for (const [name, hex] of Object.entries(colorEntries(scope, tokens))) {
      if (typeof hex !== "string") continue;
      replacements[`__DS_${scope.toUpperCase()}_${name.toUpperCase()}__`] =
        hexToHslChannels(hex);
    }
  }

  replacements.__DS_COMPONENT_LIGHT_CSS__ = componentCssEntries("light", tokens);
  replacements.__DS_COMPONENT_DARK_CSS__ = componentCssEntries("dark", tokens);

  // Fixed palette — two forms per token:
  //   __DS_FIXED_<NAME>_HEX__  → raw hex  (for direct background/preview use)
  //   __DS_FIXED_<NAME>_HSL__  → H S% L%  (for semantic channel re-assignments)
  for (const [name, hex] of Object.entries(fixedColorEntries(tokens))) {
    const key = name.toUpperCase();
    replacements[`__DS_FIXED_${key}_HEX__`] = normalizeHex(hex);
    replacements[`__DS_FIXED_${key}_HSL__`] = hexToHslChannels(hex);
  }

  replacements.__DS_FONT_SANS__ = toFontStack(
    resolveValue(tokens.typography.fontFamily.sans, tokens),
  );
  replacements.__DS_FONT_SERIF__ = toFontStack(
    resolveValue(tokens.typography.fontFamily.serif, tokens),
  );
  replacements.__DS_FONT_MONO__ = toFontStack(
    resolveValue(tokens.typography.fontFamily.mono, tokens),
  );
  replacements.__DS_DESKTOP_INTRO_PRIMARY_WEIGHT__ = resolveValue(
    tokens.typography.desktopIntro.primaryWeight,
    tokens,
  );
  replacements.__DS_DESKTOP_INTRO_BODY_SIZE__ = resolveValue(
    tokens.typography.desktopIntro.bodySize,
    tokens,
  );
  replacements.__DS_DESKTOP_INTRO_BODY_WEIGHT__ = resolveValue(
    tokens.typography.desktopIntro.bodyWeight,
    tokens,
  );
  replacements.__DS_DESKTOP_INTRO_BODY_LINE_HEIGHT__ = resolveValue(
    tokens.typography.desktopIntro.bodyLineHeight,
    tokens,
  );
  replacements.__DS_DESKTOP_INTRO_CONTRAST_TARGET__ = resolveValue(
    tokens.accessibility.contrast.desktopIntroTarget,
    tokens,
  );
  replacements.__DS_RADIUS__ = resolveValue(tokens.radius.base, tokens);
  replacements.__DS_SPACING__ = resolveValue(tokens.spacing.base, tokens);
  replacements.__DS_DIMENSION_CSS__ = [
    dimensionCssEntries("spacing", tokens),
    dimensionCssEntries("radius", tokens),
  ].join("\n");

  for (const [token, value] of Object.entries(replacements)) {
    css = css.split(token).join(value);
  }

  const leftover = css.match(/__DS_[A-Z0-9_]+__/g);
  if (leftover) {
    throw new Error(
      `tokens.json is missing values for: ${[...new Set(leftover)].join(", ")}`,
    );
  }
  return css;
}

function fixedColorEntries(tokens) {
  return tokenEntries("fixed", tokens);
}

function buildTs(tokens) {
  const portable = {
    color: {
      primitive: colorEntries("primitive", tokens),
      light: colorEntries("light", tokens),
      dark: colorEntries("dark", tokens),
      fixed: fixedColorEntries(tokens),
      component: {
        light: colorEntries("component", tokens).light,
        dark: colorEntries("component", tokens).dark,
      },
    },
    fontFamily: {
      sans: resolveValue(tokens.typography.fontFamily.sans, tokens),
      serif: resolveValue(tokens.typography.fontFamily.serif, tokens),
      mono: resolveValue(tokens.typography.fontFamily.mono, tokens),
    },
    typography: {
      desktopIntro: {
        primaryWeight: resolveValue(tokens.typography.desktopIntro.primaryWeight, tokens),
        bodySize: resolveValue(tokens.typography.desktopIntro.bodySize, tokens),
        bodyWeight: resolveValue(tokens.typography.desktopIntro.bodyWeight, tokens),
        bodyLineHeight: resolveValue(tokens.typography.desktopIntro.bodyLineHeight, tokens),
      },
    },
    accessibility: {
      contrast: {
        desktopIntroTarget: resolveValue(tokens.accessibility.contrast.desktopIntroTarget, tokens),
      },
    },
    radius: resolveValue(tokens.radius.base, tokens),
    spacing: resolveValue(tokens.spacing.base, tokens),
    radiusTokens: structuredDimensionEntries("radius", tokens),
    spacingTokens: structuredDimensionEntries("spacing", tokens),
  };
  return `/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = ${JSON.stringify(portable, null, 2)} as const;

export const radiusTokens = tokens.radiusTokens;
export const spacingTokens = tokens.spacingTokens;

export type Tokens = typeof tokens;
export default tokens;
`;
}

export function buildTokens() {
  const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));
  writeFileSync(cssOut, buildCss(tokens));
  mkdirSync(tsOutDir, { recursive: true });
  writeFileSync(join(tsOutDir, "tokens.tsx"), buildTs(tokens));
  mkdirSync(dirname(faviconOut), { recursive: true });
  writeFileSync(faviconOut, buildFavicon(tokens));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildTokens();
  process.stdout.write(
    "Generated src/index.css, src/generated/tokens.tsx, and public/favicon.svg\n",
  );
}
