/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#eaf3ef",
      "foreground": "#17233a",
      "border": "#a9c5bd",
      "card": "#f7fbf9",
      "cardForeground": "#17233a",
      "popover": "#f2f8f5",
      "popoverForeground": "#17233a",
      "primary": "#0b665d",
      "primaryForeground": "#f7fbf9",
      "secondary": "#dceae5",
      "secondaryForeground": "#17233a",
      "muted": "#e2ece8",
      "mutedForeground": "#536a72",
      "accent": "#c54f48",
      "accentForeground": "#ffffff",
      "destructive": "#b63f4d",
      "destructiveForeground": "#ffffff",
      "input": "#8db3aa",
      "ring": "#0b665d",
      "chart1": "#0b665d",
      "chart2": "#c54f48",
      "chart3": "#287f8f",
      "chart4": "#6f5ca8",
      "chart5": "#b77824",
      "sidebar": "#e2ece8",
      "sidebarForeground": "#17233a",
      "sidebarBorder": "#a9c5bd",
      "sidebarPrimary": "#0b665d",
      "sidebarPrimaryForeground": "#f7fbf9",
      "sidebarAccent": "#cfdfda",
      "sidebarAccentForeground": "#17233a",
      "sidebarRing": "#0b665d"
    },
    "dark": {
      "background": "#111326",
      "foreground": "#e8eaf4",
      "border": "#444967",
      "card": "#20233d",
      "cardForeground": "#e8eaf4",
      "popover": "#1d2036",
      "popoverForeground": "#e8eaf4",
      "primary": "#e4ff5b",
      "primaryForeground": "#111326",
      "secondary": "#2b2f4a",
      "secondaryForeground": "#e8eaf4",
      "muted": "#2b2f4a",
      "mutedForeground": "#aeb2cb",
      "accent": "#ff8d79",
      "accentForeground": "#111326",
      "destructive": "#e46765",
      "destructiveForeground": "#111326",
      "input": "#4b526d",
      "ring": "#e4ff5b",
      "chart1": "#e4ff5b",
      "chart2": "#ff8d79",
      "chart3": "#86d9ee",
      "chart4": "#b996ed",
      "chart5": "#f5b85c",
      "sidebar": "#181b30",
      "sidebarForeground": "#e8eaf4",
      "sidebarBorder": "#444967",
      "sidebarPrimary": "#e4ff5b",
      "sidebarPrimaryForeground": "#111326",
      "sidebarAccent": "#2b2f4a",
      "sidebarAccentForeground": "#e8eaf4",
      "sidebarRing": "#e4ff5b"
    }
  },
  "fontFamily": {
    "sans": [
      "Space Grotesk",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "DM Mono",
      "monospace"
    ]
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
