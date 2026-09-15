/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "primitive": {
      "lightCanvas": "#eaf3ef",
      "ink": "#17233a",
      "sageBorder": "#a9c5bd",
      "paper": "#f7fbf9",
      "lightPopover": "#f2f8f5",
      "teal": "#0b665d",
      "sageSurface": "#dceae5",
      "sageMuted": "#e2ece8",
      "slateMuted": "#536a72",
      "coral": "#c54f48",
      "white": "#ffffff",
      "redDanger": "#b63f4d",
      "sageInput": "#8db3aa",
      "tealChart": "#287f8f",
      "violet": "#6f5ca8",
      "amber": "#b77824",
      "sageAccent": "#cfdfda",
      "windowLight": "#505657",
      "navy": "#111326",
      "lavenderText": "#e8eaf4",
      "indigoBorder": "#444967",
      "indigoCard": "#20233d",
      "indigoPopover": "#1d2036",
      "lime": "#e4ff5b",
      "indigoSurface": "#2b2f4a",
      "lavenderMuted": "#aeb2cb",
      "salmon": "#ff8d79",
      "coralDanger": "#e46765",
      "indigoInput": "#4b526d",
      "cyan": "#86d9ee",
      "purple": "#b996ed",
      "gold": "#f5b85c",
      "indigoSidebar": "#181b30",
      "windowDark": "#a7a7a7"
    },
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
    },
    "component": {
      "light": {
        "actionButton": {
          "background": "#0b665d",
          "foreground": "#f7fbf9",
          "border": "#0b665d",
          "hover": "#c54f48",
          "focus": "#0b665d"
        },
        "accordion": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "icon": "#536a72"
        },
        "dialog": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "overlay": "#eaf3ef"
        },
        "separator": {
          "default": "#a9c5bd"
        },
        "toast": {
          "surface": "#f2f8f5",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "success": "#0b665d",
          "error": "#b63f4d"
        },
        "tooltip": {
          "surface": "#f2f8f5",
          "foreground": "#17233a",
          "border": "#a9c5bd"
        },
        "contextMenu": {
          "surface": "#f2f8f5",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "itemHover": "#e2ece8",
          "separator": "#a9c5bd",
          "danger": "#b63f4d"
        },
        "desktopLauncher": {
          "surface": "#eaf3ef",
          "foreground": "#17233a",
          "label": "#17233a",
          "icon": "#dceae5",
          "iconAccent": "#0b665d",
          "selection": "#c54f48"
        },
        "dock": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "active": "#0b665d",
          "hover": "#e2ece8"
        },
        "dockLabel": {
          "foreground": "#17233a",
          "muted": "#536a72",
          "active": "#0b665d"
        },
        "projectCard": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "muted": "#536a72",
          "border": "#a9c5bd",
          "accent": "#c54f48",
          "link": "#0b665d"
        },
        "sectionLabel": {
          "foreground": "#0b665d",
          "background": "#f7fbf9"
        },
        "statusIndicator": {
          "background": "#0b665d",
          "foreground": "#f7fbf9",
          "success": "#0b665d",
          "warning": "#c54f48",
          "danger": "#b63f4d",
          "idle": "#536a72",
          "ring": "#0b665d"
        },
        "stickyNoteSurface": {
          "surface": "#dceae5",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "accent": "#c54f48"
        },
        "genericSurface": {
          "surface": "#eaf3ef",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "muted": "#e2ece8"
        },
        "windowSurface": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "titleBar": "#e2ece8",
          "titleForeground": "#505657"
        },
        "systemBar": {
          "surface": "#e2ece8",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "accent": "#0b665d"
        },
        "settingsControls": {
          "surface": "#f7fbf9",
          "foreground": "#17233a",
          "border": "#8db3aa",
          "active": "#0b665d",
          "control": "#dceae5",
          "controlForeground": "#17233a",
          "muted": "#e2ece8"
        },
        "colorPicker": {
          "surface": "#f2f8f5",
          "foreground": "#17233a",
          "border": "#a9c5bd",
          "swatchBorder": "#8db3aa",
          "active": "#0b665d"
        },
        "terminal": {
          "surface": "#17233a",
          "foreground": "#eaf3ef",
          "prompt": "#0b665d",
          "cursor": "#c54f48",
          "selection": "#dceae5",
          "border": "#a9c5bd"
        },
        "contactCta": {
          "background": "#c54f48",
          "foreground": "#ffffff",
          "border": "#c54f48",
          "hover": "#0b665d",
          "accent": "#0b665d"
        }
      },
      "dark": {
        "actionButton": {
          "background": "#e4ff5b",
          "foreground": "#111326",
          "border": "#e4ff5b",
          "hover": "#ff8d79",
          "focus": "#e4ff5b"
        },
        "accordion": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "icon": "#aeb2cb"
        },
        "dialog": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "overlay": "#111326"
        },
        "separator": {
          "default": "#444967"
        },
        "toast": {
          "surface": "#1d2036",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "success": "#e4ff5b",
          "error": "#e46765"
        },
        "tooltip": {
          "surface": "#1d2036",
          "foreground": "#e8eaf4",
          "border": "#444967"
        },
        "contextMenu": {
          "surface": "#1d2036",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "itemHover": "#2b2f4a",
          "separator": "#444967",
          "danger": "#e46765"
        },
        "desktopLauncher": {
          "surface": "#111326",
          "foreground": "#e8eaf4",
          "label": "#e8eaf4",
          "icon": "#2b2f4a",
          "iconAccent": "#e4ff5b",
          "selection": "#ff8d79"
        },
        "dock": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "active": "#e4ff5b",
          "hover": "#2b2f4a"
        },
        "dockLabel": {
          "foreground": "#e8eaf4",
          "muted": "#aeb2cb",
          "active": "#e4ff5b"
        },
        "projectCard": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "muted": "#aeb2cb",
          "border": "#444967",
          "accent": "#ff8d79",
          "link": "#e4ff5b"
        },
        "sectionLabel": {
          "foreground": "#e4ff5b",
          "background": "#111326"
        },
        "statusIndicator": {
          "background": "#e4ff5b",
          "foreground": "#111326",
          "success": "#e4ff5b",
          "warning": "#ff8d79",
          "danger": "#e46765",
          "idle": "#aeb2cb",
          "ring": "#e4ff5b"
        },
        "stickyNoteSurface": {
          "surface": "#2b2f4a",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "accent": "#ff8d79"
        },
        "genericSurface": {
          "surface": "#111326",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "muted": "#2b2f4a"
        },
        "windowSurface": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "titleBar": "#181b30",
          "titleForeground": "#a7a7a7"
        },
        "systemBar": {
          "surface": "#181b30",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "accent": "#e4ff5b"
        },
        "settingsControls": {
          "surface": "#20233d",
          "foreground": "#e8eaf4",
          "border": "#4b526d",
          "active": "#e4ff5b",
          "control": "#2b2f4a",
          "controlForeground": "#e8eaf4",
          "muted": "#2b2f4a"
        },
        "colorPicker": {
          "surface": "#1d2036",
          "foreground": "#e8eaf4",
          "border": "#444967",
          "swatchBorder": "#4b526d",
          "active": "#e4ff5b"
        },
        "terminal": {
          "surface": "#e8eaf4",
          "foreground": "#111326",
          "prompt": "#e4ff5b",
          "cursor": "#ff8d79",
          "selection": "#2b2f4a",
          "border": "#444967"
        },
        "contactCta": {
          "background": "#ff8d79",
          "foreground": "#111326",
          "border": "#ff8d79",
          "hover": "#e4ff5b",
          "accent": "#e4ff5b"
        }
      }
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
