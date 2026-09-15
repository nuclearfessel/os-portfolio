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
      "sidebarRing": "#0b665d",
      "windowTitleForeground": "#505657"
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
      "sidebarRing": "#e4ff5b",
      "windowTitleForeground": "#a7a7a7"
    },
    "fixed": {
      "wallpaperLightDefault": "#e8f0ec",
      "wallpaperDarkDefault": "#111326",
      "lowContrastBg": "#282a38",
      "lowContrastSurface": "#31334a",
      "lowContrastSurface2": "#3a3c52",
      "lowContrastText": "#c4c8da",
      "lowContrastTextMuted": "#8e92a8",
      "lowContrastAccent": "#8fa8c8",
      "highContrastBg": "#000000",
      "highContrastSurface": "#0d0d0d",
      "highContrastSurface2": "#1a1a1a",
      "highContrastText": "#ffffff",
      "highContrastTextMuted": "#e0e0e0",
      "highContrastAccent": "#ffff00",
      "highContrastAccentAlt": "#00ffff",
      "highContrastBorder": "#ffffff",
      "highContrastFocus": "#ffff00",
      "stickyLemonLowBackground": "#3b3826",
      "stickyLemonLowAccent": "#d8c76f",
      "stickyLemonHighAccent": "#ffff00",
      "stickyOrangeLowBackground": "#3d3124",
      "stickyOrangeLowAccent": "#d7aa72",
      "stickyOrangeHighAccent": "#ff9d00",
      "stickyRedLowBackground": "#3d292b",
      "stickyRedLowAccent": "#d99a9e",
      "stickyRedHighAccent": "#ff3b30",
      "stickyCreamLowBackground": "#3a352d",
      "stickyCreamLowAccent": "#d8c9ae",
      "stickyCreamHighAccent": "#fff0d2",
      "stickyTealLowBackground": "#263936",
      "stickyTealLowAccent": "#8fbeb5",
      "stickyTealHighAccent": "#00ffd5",
      "stickyBlueLowBackground": "#283344",
      "stickyBlueLowAccent": "#94acd1",
      "stickyBlueHighAccent": "#66b3ff",
      "stickyPurpleLowBackground": "#322e42",
      "stickyPurpleLowAccent": "#aaa0cc",
      "stickyPurpleHighAccent": "#c4a7ff",
      "stickyBerryLowBackground": "#3b2a35",
      "stickyBerryLowAccent": "#c39aaf",
      "stickyBerryHighAccent": "#ff78b4",
      "stickyForestLowBackground": "#29372f",
      "stickyForestLowAccent": "#9ab8a4",
      "stickyForestHighAccent": "#7dffa5",
      "stickyCharcoalLowBackground": "#30333b",
      "stickyCharcoalLowAccent": "#afb4c2",
      "stickyCharcoalHighAccent": "#d5dcf0"
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
  "typography": {
    "desktopIntro": {
      "primaryWeight": 800,
      "bodySize": "1.125rem",
      "bodyWeight": 400,
      "bodyLineHeight": 1.25
    }
  },
  "accessibility": {
    "contrast": {
      "desktopIntroTarget": 7
    }
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
