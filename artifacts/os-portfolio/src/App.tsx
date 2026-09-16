import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ColorPicker } from '@/components/color-picker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Sparkle as Apple, ArrowLeft, ArrowUpRight, BatteryMedium, ChevronRight,
  Check, CircleUser, Keyboard as Command, GitGraph as FolderGit2, Mail, Maximize2, Menu, Minus,
  BookOpen, Layers, Moon, Plus, Settings, Sun, SquareTerminal, Wifi, Eye, X,
} from '@keyline-icons/react';
import {
  Book as BookFill,
  CircleUser as CircleUserFill,
  Keyboard as KeyboardFill,
  TerminalCursor as TerminalCursorFill,
} from '@keyline-icons/react/fill';
import { RiMailSendFill } from 'react-icons/ri';
import { BsGearWideConnected, BsStickyFill, BsTrash3Fill } from 'react-icons/bs';
import { ErrorBoundary } from '@/components/error-boundary';
import { RELEASE_CHANNEL, RELEASE_COMMIT, RELEASE_DATE, RELEASE_VERSION } from '@/release';
import { tokens } from '@workspace/os-portfolio-ds/tokens';
import { Toaster } from '@workspace/os-portfolio-ds/components/ui/toaster';
import { TooltipProvider } from '@workspace/os-portfolio-ds/components/ui/tooltip';
import { Separator } from '@workspace/os-portfolio-ds/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/os-portfolio-ds/components/ui/accordion';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@workspace/os-portfolio-ds/components/ui/dialog';
import {
  ActionButton,
  ContextMenuSurface,
  DesktopLauncher,
  DockItem,
  DockItemLabel,
  ProjectCard,
  SectionLabel,
  StatusIndicator,
  StickyNoteSurface,
  Surface,
  WindowSurface,
} from '@workspace/os-portfolio-ds/components/ui/os-portfolio';
import {
  AnnotatedFrame,
  AbstractWindow,
  PositionGrid,
  PositionCell,
} from '@workspace/os-portfolio-ds/components/ui/gvc-illustration';
import '@workspace/os-portfolio-ds/components/ui/gvc-illustration.css';

const queryClient = new QueryClient();

type WindowId = 'about' | 'work' | 'contact' | 'terminal' | 'settings' | 'guide';
type WindowState = Record<WindowId, boolean>;
type IconSize = 'large' | 'small';
type Theme = 'dark' | 'light';
type DesktopLauncherId = Exclude<WindowId, 'settings' | 'guide'> | 'stickies-app';
type FolderPositions = Partial<Record<DesktopLauncherId, { left: number; top: number }>>;
type StickyItemId = 'sticky' | `sticky-${number}`;
type DesktopLauncherDragId = `desktop-${DesktopLauncherId}`;
type DesktopItemId = WindowId | StickyItemId | DesktopLauncherDragId;
const isWindowId = (id: DesktopItemId): id is WindowId => ['about', 'work', 'contact', 'terminal', 'settings', 'guide'].includes(id);
type ItemPositions = Partial<Record<DesktopItemId, { left: number; top: number }>>;
type ItemSizes = Partial<Record<DesktopItemId, { width: number; height: number }>>;
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
type DockPosition = 'top' | 'right' | 'bottom' | 'left';
type IntroTextKey = 'primary' | 'accent' | 'body';
type IntroCustomization = {
  text: Record<IntroTextKey, string>;
  colors: Record<Theme, Record<IntroTextKey, string>>;
  automaticContrast: boolean;
};
type Position = { left: number; top: number };
type Size = { width: number; height: number };
type WorkspaceBounds = { left: number; top: number; right: number; bottom: number };

// Wallpaper types
type WallpaperMode = 'picture' | 'color';
type WallpaperConfig = {
  mode: WallpaperMode;
  color: string; // hex string, used when mode === 'color'
};

// Accessibility types
type AnimationSpeed = 'less' | 'default' | 'more';
type ContrastTheme = 'none' | 'low' | 'high';

type AccessibilityPrefs = {
  alwaysShowScrollbars: boolean;
  windowTransparency: boolean;
  transparencyLevel: number;
  stickyTransparencyLevel: number;
  blurEffects: boolean;
  blurLevel: number;
  uiAnimations: boolean;
  animationSpeed: AnimationSpeed;
  contrastTheme: ContrastTheme;
};

const DEFAULT_ACCESSIBILITY_PREFS: AccessibilityPrefs = {
  alwaysShowScrollbars: false,
  windowTransparency: true,
  transparencyLevel: 20,
  stickyTransparencyLevel: 20,
  blurEffects: true,
  blurLevel: 12,
  uiAnimations: true,
  animationSpeed: 'default',
  contrastTheme: 'none',
};

const DEFAULT_WALLPAPER_LIGHT: WallpaperConfig = { mode: 'picture', color: '#e8f0ec' };
const DEFAULT_WALLPAPER_DARK: WallpaperConfig = { mode: 'picture', color: '#111326' };

const DEFAULT_STICKY_SIZE: Size = { width: 214, height: 160 };
const MIN_STICKY_SIZE: Size = { width: 140, height: 100 };
type WorkspaceMode = 'desktop' | 'tablet-landscape' | 'managed';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type ViewportProfile = {
  deviceMode: DeviceMode;
  orientation: 'portrait' | 'landscape';
  workspaceMode: WorkspaceMode;
};

const STICKY_CONTROL_OVERFLOW = 24;
const STICKY_VIEWPORT_GAP = 2;
const DOCK_SAFE_INSET = 70;
const MAXIMIZED_WINDOW_GAP = 12;
const MAXIMIZED_WINDOW_DOCK_INSET = 97;
const MAXIMIZED_WINDOW_DOCK_INSET_WITH_SYSTEM_BAR = 87;

function hexToHslChannels(hex: string) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const lightness = (maximum + minimum) / 2;
  const delta = maximum - minimum;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }

  if (hue < 0) hue += 360;
  return `${Math.round(hue)} ${Math.round(saturation * 1000) / 10}% ${Math.round(lightness * 1000) / 10}%`;
}

function readViewportProfile(): ViewportProfile {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const viewportOrientation: ViewportProfile['orientation'] = height >= width ? 'portrait' : 'landscape';
  const deviceMode: DeviceMode = width <= 760 || (Math.min(width, height) <= 600 && Math.max(width, height) <= 950)
    ? 'mobile'
    : width <= 1180
      ? 'tablet'
      : 'desktop';
  const orientation: ViewportProfile['orientation'] = deviceMode === 'mobile' ? 'portrait' : viewportOrientation;
  const workspaceMode: WorkspaceMode = deviceMode === 'desktop'
    ? 'desktop'
    : deviceMode === 'tablet' && orientation === 'landscape'
      ? 'tablet-landscape'
      : 'managed';
  return { deviceMode, orientation, workspaceMode };
}

function stickyFootprintRadii(size: Size, rotation: number) {
  const radians = rotation * Math.PI / 180;
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));
  const halfWidth = size.width / 2 + STICKY_CONTROL_OVERFLOW;
  const halfHeight = size.height / 2 + STICKY_CONTROL_OVERFLOW;
  return {
    x: cosine * halfWidth + sine * halfHeight,
    y: sine * halfWidth + cosine * halfHeight,
  };
}

function stickyPositionBounds(size: Size, rotation: number, workspace: WorkspaceBounds) {
  const radius = stickyFootprintRadii(size, rotation);
  const minLeft = workspace.left + radius.x - size.width / 2;
  const maxLeft = workspace.right - radius.x - size.width / 2;
  const minTop = workspace.top + radius.y - size.height / 2;
  const maxTop = workspace.bottom - radius.y - size.height / 2;
  const centeredLeft = (workspace.left + workspace.right - size.width) / 2;
  const centeredTop = (workspace.top + workspace.bottom - size.height) / 2;
  return {
    minLeft: minLeft <= maxLeft ? minLeft : centeredLeft,
    maxLeft: minLeft <= maxLeft ? maxLeft : centeredLeft,
    minTop: minTop <= maxTop ? minTop : centeredTop,
    maxTop: minTop <= maxTop ? maxTop : centeredTop,
  };
}

function constrainStickyPosition(position: Position, size: Size, rotation: number, workspace: WorkspaceBounds): Position {
  const bounds = stickyPositionBounds(size, rotation, workspace);
  return {
    left: Math.max(bounds.minLeft, Math.min(bounds.maxLeft, position.left)),
    top: Math.max(bounds.minTop, Math.min(bounds.maxTop, position.top)),
  };
}

function stickySizeFits(size: Size, rotation: number, workspace: WorkspaceBounds) {
  const radius = stickyFootprintRadii(size, rotation);
  return radius.x * 2 <= workspace.right - workspace.left && radius.y * 2 <= workspace.bottom - workspace.top;
}

function fitStickySize(size: Size, rotation: number, workspace: WorkspaceBounds): Size {
  if (stickySizeFits(size, rotation, workspace)) return size;
  const minimum = { width: Math.min(140, size.width), height: Math.min(100, size.height) };
  if (!stickySizeFits(minimum, rotation, workspace)) return minimum;
  let low = 0;
  let high = 1;
  for (let index = 0; index < 18; index += 1) {
    const amount = (low + high) / 2;
    const candidate = {
      width: minimum.width + (size.width - minimum.width) * amount,
      height: minimum.height + (size.height - minimum.height) * amount,
    };
    if (stickySizeFits(candidate, rotation, workspace)) low = amount;
    else high = amount;
  }
  return {
    width: minimum.width + (size.width - minimum.width) * low,
    height: minimum.height + (size.height - minimum.height) * low,
  };
}

const stickyPalette = [
  { id: 'lemon', label: 'Lemon', background: '#ffd84d', foreground: 'dark', handle: '#8f6900', lowBackground: tokens.color.fixed.stickyLemonLowBackground, lowAccent: tokens.color.fixed.stickyLemonLowAccent, highAccent: tokens.color.fixed.stickyLemonHighAccent },
  { id: 'orange', label: 'Orange', background: '#ffb84d', foreground: 'dark', handle: '#9f5700', lowBackground: tokens.color.fixed.stickyOrangeLowBackground, lowAccent: tokens.color.fixed.stickyOrangeLowAccent, highAccent: tokens.color.fixed.stickyOrangeHighAccent },
  { id: 'red', label: 'Red', background: '#c9363e', foreground: 'light', handle: '#ffb3b6', lowBackground: tokens.color.fixed.stickyRedLowBackground, lowAccent: tokens.color.fixed.stickyRedLowAccent, highAccent: tokens.color.fixed.stickyRedHighAccent },
  { id: 'cream', label: 'Cream', background: '#fff0d2', foreground: 'dark', handle: '#a88655', lowBackground: tokens.color.fixed.stickyCreamLowBackground, lowAccent: tokens.color.fixed.stickyCreamLowAccent, highAccent: tokens.color.fixed.stickyCreamHighAccent },
  { id: 'teal', label: 'Teal', background: '#006456', foreground: 'light', handle: '#76dccb', lowBackground: tokens.color.fixed.stickyTealLowBackground, lowAccent: tokens.color.fixed.stickyTealLowAccent, highAccent: tokens.color.fixed.stickyTealHighAccent },
  { id: 'blue', label: 'Blue', background: '#0d56b3', foreground: 'light', handle: '#8ac4ff', lowBackground: tokens.color.fixed.stickyBlueLowBackground, lowAccent: tokens.color.fixed.stickyBlueLowAccent, highAccent: tokens.color.fixed.stickyBlueHighAccent },
  { id: 'purple', label: 'Purple', background: '#6648b8', foreground: 'light', handle: '#c8b3ff', lowBackground: tokens.color.fixed.stickyPurpleLowBackground, lowAccent: tokens.color.fixed.stickyPurpleLowAccent, highAccent: tokens.color.fixed.stickyPurpleHighAccent },
  { id: 'berry', label: 'Berry', background: '#a93570', foreground: 'light', handle: '#ffb2d5', lowBackground: tokens.color.fixed.stickyBerryLowBackground, lowAccent: tokens.color.fixed.stickyBerryLowAccent, highAccent: tokens.color.fixed.stickyBerryHighAccent },
  { id: 'forest', label: 'Forest', background: '#1e603d', foreground: 'light', handle: '#91d6aa', lowBackground: tokens.color.fixed.stickyForestLowBackground, lowAccent: tokens.color.fixed.stickyForestLowAccent, highAccent: tokens.color.fixed.stickyForestHighAccent },
  { id: 'charcoal', label: 'Charcoal', background: '#343b4f', foreground: 'light', handle: '#b8c2dd', lowBackground: tokens.color.fixed.stickyCharcoalLowBackground, lowAccent: tokens.color.fixed.stickyCharcoalLowAccent, highAccent: tokens.color.fixed.stickyCharcoalHighAccent },
] as const;
type StickyColorId = typeof stickyPalette[number]['id'];
type StickyData = {
  id: StickyItemId;
  color: StickyColorId;
  text: string;
  rotation: number;
  author: 'john' | 'user';
  createdAt: string;
};

const defaultSticky: StickyData = {
  id: 'sticky',
  color: 'purple',
  text: "The best interfaces don\u2019t ask for attention. They earn trust, one tiny response at a time.",
  rotation: -9,
  author: 'john',
  createdAt: '09:42',
};

const defaultSecondSticky: StickyData = {
  id: 'sticky-1',
  color: 'lemon',
  text: '',
  rotation: 7,
  author: 'user',
  createdAt: 'saved',
};

const formatStickyTime = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
const createUserSticky = (id: StickyItemId, color: StickyColorId = defaultSticky.color, rotation = defaultSticky.rotation): StickyData => ({
  id,
  color,
  text: '',
  rotation,
  author: 'user',
  createdAt: formatStickyTime(),
});

type SavedDesktopState = {
  folderPositions: FolderPositions;
  itemPositions: ItemPositions;
  itemSizes: ItemSizes;
  iconSize: IconSize;
  snapToGrid: boolean;
  theme: Theme;
  showDesktopIcons: boolean;
  stickies: StickyData[];
  dockPosition: DockPosition;
  systemBarPosition: DockPosition;
  windowStack?: WindowId[];
  windows?: WindowState;
  activeWindow?: WindowId;
  maximizedWindows?: Partial<Record<WindowId, boolean>>;
  stickyVisible?: boolean;
  stickyOnTop?: boolean;
  activeStickyId?: StickyItemId;
  wallpaperLight?: WallpaperConfig;
  wallpaperDark?: WallpaperConfig;
  accessibility?: AccessibilityPrefs;
  introCustomization?: IntroCustomization;
};

const DESKTOP_STORAGE_KEY = 'os-portfolio.desktop.v4';
const DESKTOP_DEFAULT_STORAGE_KEY = 'os-portfolio.desktop.default.v1';
const LEGACY_DESKTOP_STORAGE_KEY = 'portfolio-os.desktop.v4';
const LEGACY_DESKTOP_DEFAULT_STORAGE_KEY = 'portfolio-os.desktop.default.v1';
const DESKTOP_GRID_SIZE = 8;
const DEFAULT_INTRO_CUSTOMIZATION: IntroCustomization = {
  text: {
    primary: 'Thoughtful interfaces.',
    accent: 'Fast systems.',
    body: 'John Doe is a product-minded designer making things feel clear, capable, and a little more human.',
  },
  colors: {
    light: { primary: '#17213b', accent: '#0b665d', body: '#586878' },
    dark: { primary: '#f0f0e0', accent: '#e4ff5b', body: '#aeb2cb' },
  },
  automaticContrast: true,
};

function snapWithinDesktopGrid(value: number, min: number, max: number) {
  const firstGridLine = Math.ceil(min / DESKTOP_GRID_SIZE) * DESKTOP_GRID_SIZE;
  const lastGridLine = Math.floor(max / DESKTOP_GRID_SIZE) * DESKTOP_GRID_SIZE;
  if (firstGridLine > lastGridLine) return Math.max(min, Math.min(max, value));
  return Math.max(firstGridLine, Math.min(lastGridLine, Math.round(value / DESKTOP_GRID_SIZE) * DESKTOP_GRID_SIZE));
}
let storageUnavailableDuringLoad = false;
const defaultDesktopState: SavedDesktopState = {
  folderPositions: {},
  itemPositions: {},
  itemSizes: {},
  iconSize: 'large',
  snapToGrid: false,
  theme: 'light',
  showDesktopIcons: true,
  stickies: [defaultSticky, defaultSecondSticky],
  dockPosition: 'bottom',
  systemBarPosition: 'top',
  windowStack: ['work', 'about', 'contact', 'terminal', 'settings', 'guide'],
  windows: { about: true, work: true, contact: false, terminal: false, settings: false, guide: false },
  activeWindow: 'about',
  maximizedWindows: {},
  stickyVisible: true,
  stickyOnTop: false,
  activeStickyId: 'sticky',
  wallpaperLight: DEFAULT_WALLPAPER_LIGHT,
  wallpaperDark: DEFAULT_WALLPAPER_DARK,
  accessibility: DEFAULT_ACCESSIBILITY_PREFS,
  introCustomization: DEFAULT_INTRO_CUSTOMIZATION,
};

function normalizeIntroText(value: string) {
  return value.replace(/\b(?:Fes Naqvi|Joe Doe)\b/gi, 'John Doe');
}

function parseWallpaperConfig(raw: unknown): WallpaperConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const config = raw as Record<string, unknown>;
  const mode = config.mode === 'picture' || config.mode === 'color' ? config.mode : undefined;
  if (!mode) return undefined;
  const color = typeof config.color === 'string' && /^#[0-9a-f]{6}$/i.test(config.color) ? config.color : '#111326';
  return { mode, color };
}

function parseIntroCustomization(raw: unknown): IntroCustomization {
  if (!raw || typeof raw !== 'object') return DEFAULT_INTRO_CUSTOMIZATION;
  const value = raw as Partial<IntroCustomization>;
    const parseText = (key: IntroTextKey) => {
    const candidate = value.text?.[key];
      return typeof candidate === 'string' && candidate.trim()
        ? normalizeIntroText(candidate).slice(0, key === 'body' ? 240 : 80)
        : DEFAULT_INTRO_CUSTOMIZATION.text[key];
  };
  const parseColor = (theme: Theme, key: IntroTextKey) => {
    const candidate = value.colors?.[theme]?.[key];
    return typeof candidate === 'string' && /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : DEFAULT_INTRO_CUSTOMIZATION.colors[theme][key];
  };
  return {
    text: { primary: parseText('primary'), accent: parseText('accent'), body: parseText('body') },
    colors: {
      light: { primary: parseColor('light', 'primary'), accent: parseColor('light', 'accent'), body: parseColor('light', 'body') },
      dark: { primary: parseColor('dark', 'primary'), accent: parseColor('dark', 'accent'), body: parseColor('dark', 'body') },
    },
    automaticContrast: typeof value.automaticContrast === 'boolean'
      ? value.automaticContrast
      : DEFAULT_INTRO_CUSTOMIZATION.automaticContrast,
  };
}

function parseAccessibilityPrefs(raw: unknown): AccessibilityPrefs {
  if (!raw || typeof raw !== 'object') return DEFAULT_ACCESSIBILITY_PREFS;
  const a = raw as Record<string, unknown>;
  return {
    alwaysShowScrollbars: typeof a.alwaysShowScrollbars === 'boolean' ? a.alwaysShowScrollbars : DEFAULT_ACCESSIBILITY_PREFS.alwaysShowScrollbars,
    windowTransparency: typeof a.windowTransparency === 'boolean' ? a.windowTransparency : DEFAULT_ACCESSIBILITY_PREFS.windowTransparency,
    transparencyLevel: typeof a.transparencyLevel === 'number' && Number.isFinite(a.transparencyLevel)
      ? Math.max(0, Math.min(70, Math.round(a.transparencyLevel)))
      : DEFAULT_ACCESSIBILITY_PREFS.transparencyLevel,
    stickyTransparencyLevel: typeof a.stickyTransparencyLevel === 'number' && Number.isFinite(a.stickyTransparencyLevel)
      ? Math.max(0, Math.min(70, Math.round(a.stickyTransparencyLevel)))
      : DEFAULT_ACCESSIBILITY_PREFS.stickyTransparencyLevel,
    blurEffects: typeof a.blurEffects === 'boolean' ? a.blurEffects : DEFAULT_ACCESSIBILITY_PREFS.blurEffects,
    blurLevel: typeof a.blurLevel === 'number' && Number.isFinite(a.blurLevel)
      ? Math.max(0, Math.min(24, Math.round(a.blurLevel / 2) * 2))
      : DEFAULT_ACCESSIBILITY_PREFS.blurLevel,
    uiAnimations: typeof a.uiAnimations === 'boolean' ? a.uiAnimations : DEFAULT_ACCESSIBILITY_PREFS.uiAnimations,
    animationSpeed: (['less', 'default', 'more'] as AnimationSpeed[]).includes(a.animationSpeed as AnimationSpeed)
      ? a.animationSpeed as AnimationSpeed
      : DEFAULT_ACCESSIBILITY_PREFS.animationSpeed,
    contrastTheme: (['none', 'low', 'high'] as ContrastTheme[]).includes(a.contrastTheme as ContrastTheme)
      ? a.contrastTheme as ContrastTheme
      : DEFAULT_ACCESSIBILITY_PREFS.contrastTheme,
  };
}

function loadDesktopState(storageKey = DESKTOP_STORAGE_KEY): SavedDesktopState {
  const legacyStorageKey = storageKey === DESKTOP_STORAGE_KEY
    ? LEGACY_DESKTOP_STORAGE_KEY
    : storageKey === DESKTOP_DEFAULT_STORAGE_KEY
      ? LEGACY_DESKTOP_DEFAULT_STORAGE_KEY
      : undefined;
  let savedState: string | null = null;
  let migratedFromLegacy = false;
  try {
    savedState = window.localStorage.getItem(storageKey);
    if (savedState === null && legacyStorageKey) {
      savedState = window.localStorage.getItem(legacyStorageKey);
      migratedFromLegacy = savedState !== null;
    }
  } catch {
    storageUnavailableDuringLoad = true;
    return defaultDesktopState;
  }
  if (savedState === null) savedState = '{}';
  try {
    const parsed = JSON.parse(savedState) as Partial<SavedDesktopState> & { stickyColor?: StickyColorId };
    const folderPositions = Object.fromEntries(
      Object.entries(parsed.folderPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const position = entry[1];
        return Boolean(position) && Number.isFinite(position.left) && Number.isFinite(position.top);
      }),
    ) as FolderPositions;
    const itemPositions = Object.fromEntries(
      Object.entries(parsed.itemPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const [id, position] = entry;
        if (position === undefined || !Number.isFinite(position.left) || !Number.isFinite(position.top)) return false;
        const savedSize = parsed.itemSizes?.[id as DesktopItemId];
        if (
          id.startsWith('sticky')
          && savedSize
          && (
            !Number.isFinite(savedSize.width)
            || !Number.isFinite(savedSize.height)
            || savedSize.width < MIN_STICKY_SIZE.width
            || savedSize.height < MIN_STICKY_SIZE.height
          )
        ) return false;
        return true;
      }).map(([id, position]) => [
        id,
        {
          ...position,
          top: ['about', 'work', 'contact', 'terminal', 'settings', 'guide'].includes(id) ? Math.max(0, position.top) : position.top,
        },
      ]),
    ) as ItemPositions;
    const itemSizes = Object.fromEntries(
      Object.entries(parsed.itemSizes ?? {}).filter((entry): entry is [string, { width: number; height: number }] => {
        const [id, size] = entry;
        if (size === undefined || !Number.isFinite(size.width) || !Number.isFinite(size.height)) return false;
        if (id.startsWith('sticky')) return size.width >= MIN_STICKY_SIZE.width && size.height >= MIN_STICKY_SIZE.height;
        return size.width > 0 && size.height > 0;
      }),
    ) as ItemSizes;
    const legacyStickyColor = parsed.stickyColor as string | undefined;
    const migratedLegacyStickyColor = legacyStickyColor === 'coral' ? 'red' : legacyStickyColor;
    const stickies = Array.isArray(parsed.stickies)
      ? parsed.stickies.flatMap((sticky) => {
        if (!sticky) return [];
        const savedColor = (sticky as unknown as { color: string }).color;
        const migratedColor = savedColor === 'coral' ? 'red' : savedColor;
        return (sticky.id === 'sticky' || /^sticky-\d+$/.test(sticky.id))
          && stickyPalette.some((color) => color.id === migratedColor)
          && typeof sticky.text === 'string'
            ? [{
              ...sticky,
              color: migratedColor as StickyColorId,
              rotation: Number.isFinite(sticky.rotation) ? sticky.rotation : 3,
              author: sticky.author === 'user' ? 'user' as const : sticky.id === 'sticky' ? 'john' as const : 'user' as const,
              createdAt: typeof sticky.createdAt === 'string' && sticky.createdAt ? sticky.createdAt : sticky.id === 'sticky' ? '09:42' : 'saved',
            }]
            : [];
      })
      : [{
        ...defaultSticky,
        color: stickyPalette.some((color) => color.id === migratedLegacyStickyColor)
          ? migratedLegacyStickyColor as StickyColorId
          : defaultSticky.color,
      }];
    const allWindowIds: WindowId[] = ['about', 'work', 'contact', 'terminal', 'settings', 'guide'];
    const savedWindowStack = Array.isArray(parsed.windowStack)
      ? parsed.windowStack.filter((id, index, ids): id is WindowId => (
        allWindowIds.includes(id as WindowId)
        && ids.indexOf(id) === index
      ))
      : [];
    const windowStack = [
      ...savedWindowStack,
      ...allWindowIds.filter((id) => !savedWindowStack.includes(id)),
    ];
    const windows = Object.fromEntries(allWindowIds.map((id) => [
      id,
      typeof parsed.windows?.[id] === 'boolean'
        ? parsed.windows[id]
        : defaultDesktopState.windows?.[id] ?? false,
    ])) as WindowState;
    const activeWindow = allWindowIds.includes(parsed.activeWindow as WindowId)
      ? parsed.activeWindow as WindowId
      : defaultDesktopState.activeWindow ?? 'about';
    const maximizedWindows = Object.fromEntries(
      Object.entries(parsed.maximizedWindows ?? {}).filter(
        (entry): entry is [WindowId, boolean] => (
          allWindowIds.includes(entry[0] as WindowId)
          && typeof entry[1] === 'boolean'
        ),
      ),
    );
    const activeStickyId = (
      typeof parsed.activeStickyId === 'string'
      && stickies.some((sticky) => sticky.id === parsed.activeStickyId)
    )
      ? parsed.activeStickyId as StickyItemId
      : stickies[0]?.id ?? 'sticky';

    const normalizedState: SavedDesktopState = {
      folderPositions,
      itemPositions,
      itemSizes,
      iconSize: parsed.iconSize === 'small' ? 'small' : defaultDesktopState.iconSize,
      snapToGrid: typeof parsed.snapToGrid === 'boolean' ? parsed.snapToGrid : defaultDesktopState.snapToGrid,
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : defaultDesktopState.theme,
      showDesktopIcons: typeof parsed.showDesktopIcons === 'boolean' ? parsed.showDesktopIcons : defaultDesktopState.showDesktopIcons,
      stickies: Array.isArray(parsed.stickies) ? stickies : defaultDesktopState.stickies,
      dockPosition: ['bottom', 'top', 'left', 'right'].includes(parsed.dockPosition as string) ? (parsed.dockPosition as DockPosition) : defaultDesktopState.dockPosition,
      systemBarPosition: ['bottom', 'top', 'left', 'right'].includes(parsed.systemBarPosition as string) ? (parsed.systemBarPosition as DockPosition) : defaultDesktopState.systemBarPosition,
      windowStack,
      windows,
      activeWindow,
      maximizedWindows,
      stickyVisible: typeof parsed.stickyVisible === 'boolean' ? parsed.stickyVisible : defaultDesktopState.stickyVisible,
      stickyOnTop: typeof parsed.stickyOnTop === 'boolean' ? parsed.stickyOnTop : defaultDesktopState.stickyOnTop,
      activeStickyId,
      wallpaperLight: parseWallpaperConfig(parsed.wallpaperLight) ?? DEFAULT_WALLPAPER_LIGHT,
      wallpaperDark: parseWallpaperConfig(parsed.wallpaperDark) ?? DEFAULT_WALLPAPER_DARK,
      accessibility: parseAccessibilityPrefs(parsed.accessibility),
      introCustomization: parseIntroCustomization(parsed.introCustomization),
    };
    if (migratedFromLegacy && legacyStorageKey) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(normalizedState));
        window.localStorage.removeItem(legacyStorageKey);
      } catch {
        // Keep the legacy snapshot when migration cannot be committed.
      }
    }
    return normalizedState;
  } catch {
    return defaultDesktopState;
  }
}

type CaseStudyMetric = { value: string; label: string };
type CaseStudySection = { label: string; heading: string; body: string };
type CaseStudy = {
  id: string;
  name: string;
  desc: string;
  tag: string;
  color: string;
  category: string;
  role: string;
  summary: string;
  metrics: CaseStudyMetric[];
  preview: {
    label: string;
    content: string;
    stats: CaseStudyMetric[];
    bars: number[];
  };
  challenge: CaseStudySection;
  approach: CaseStudySection;
  outcome: CaseStudySection;
};

const projects: CaseStudy[] = [
  {
    id: '01',
    name: 'Northstar Commerce System',
    desc: 'A flexible foundation that helped a growing commerce team ship consistent storefront and account experiences.',
    tag: '2024 — 2025',
    color: '#e4ff5b',
    category: 'case study / design systems / 2025',
    role: 'Systems design · Product strategy',
    summary: 'A shared language for a commerce platform moving from one storefront to many.',
    metrics: [
      { value: '42%', label: 'faster feature delivery' },
      { value: '3.4×', label: 'more component reuse' },
      { value: '91%', label: 'documentation confidence' },
    ],
    preview: {
      label: 'NORTHSTAR',
      content: 'System health',
      stats: [{ value: '96', label: 'ready' }, { value: '18', label: 'in review' }, { value: '04', label: 'planned' }],
      bars: [42, 58, 51, 76, 68, 91],
    },
    challenge: { label: '01 / challenge', heading: 'Every team was inventing its own basics.', body: 'Commerce teams shipped similar patterns with different spacing, states, and accessibility decisions. The growing surface area made consistency expensive to maintain.' },
    approach: { label: '02 / approach', heading: 'Start with the decisions that repeat.', body: 'I mapped the highest-frequency journeys, built a token architecture around them, and paired each component with contribution guidance that met teams where they worked.' },
    outcome: { label: '03 / outcome', heading: 'A system teams could extend.', body: 'Northstar gave product teams a dependable starting point without flattening their product voice. Adoption grew through practical examples, not mandates.' },
  },
  {
    id: '02',
    name: 'Signal Operations Platform',
    desc: 'A focused operations language for teams coordinating alerts, handoffs, and high-stakes daily work.',
    tag: '2023 — 2024',
    color: '#e4ff5b',
    category: 'case study / product systems / 2024',
    role: 'Product design · Systems strategy',
    summary: 'A calm, coherent operating layer for teams who need to act on signals quickly.',
    metrics: [
      { value: '28%', label: 'fewer workflow steps' },
      { value: '2.7×', label: 'faster triage' },
      { value: '36%', label: 'less duplicate work' },
    ],
    preview: {
      label: 'SIGNAL',
      content: 'Queue overview',
      stats: [{ value: '24', label: 'active' }, { value: '07', label: 'escalated' }, { value: '82%', label: 'resolved' }],
      bars: [52, 70, 46, 82, 61, 88],
    },
    challenge: { label: '01 / challenge', heading: 'Urgent work looked like everything else.', body: 'Operators had to scan noisy queues and reconcile status across tools before they could decide what needed attention. The system rewarded checking, not acting.' },
    approach: { label: '02 / approach', heading: 'Make priority visible at a glance.', body: 'I created a shared vocabulary for severity, ownership, and resolution, then used it to shape responsive queue, detail, and handoff patterns.' },
    outcome: { label: '03 / outcome', heading: 'Less scanning, more confident action.', body: 'Teams could see what changed, who owned it, and what to do next from a consistent set of surfaces. The product became easier to learn and easier to trust.' },
  },
  {
    id: '03',
    name: 'Mosaic Health Toolkit',
    desc: 'An accessible toolkit for designing clear, reassuring health journeys across devices and contexts.',
    tag: '2022 — 2023',
    color: '#e4ff5b',
    category: 'case study / design systems / 2023',
    role: 'Design systems · Accessibility',
    summary: 'A humane, accessible toolkit for turning complicated health information into clear next steps.',
    metrics: [
      { value: '68%', label: 'faster prototyping' },
      { value: '100%', label: 'core AA coverage' },
      { value: '14', label: 'teams onboarded' },
    ],
    preview: {
      label: 'MOSAIC',
      content: 'Journey coverage',
      stats: [{ value: '14', label: 'teams' }, { value: '38', label: 'patterns' }, { value: 'AA', label: 'baseline' }],
      bars: [35, 62, 57, 73, 84, 96],
    },
    challenge: { label: '01 / challenge', heading: 'Clarity had to work for everyone.', body: 'Health journeys combined dense information, emotional moments, and a wide range of devices and abilities. Teams needed confidence that a reusable pattern would remain understandable.' },
    approach: { label: '02 / approach', heading: 'Build accessibility into the grammar.', body: 'I partnered with content, research, and engineering to define plain-language structures, resilient states, and tokens that made inclusive choices the default.' },
    outcome: { label: '03 / outcome', heading: 'A toolkit that reduced uncertainty.', body: 'Mosaic helped teams move from concept to tested interface faster while giving people clearer choices and more confidence at each step.' },
  },
  {
    id: '04',
    name: 'Fieldnote Collaboration Kit',
    desc: 'A lightweight collaboration system that helped distributed teams turn observations into shared decisions.',
    tag: '2021 — 2022',
    color: '#e4ff5b',
    category: 'case study / collaboration systems / 2022',
    role: 'Interaction design · Facilitation',
    summary: 'A flexible kit for capturing context, making sense of it together, and moving work forward.',
    metrics: [
      { value: '3.1×', label: 'more notes resolved' },
      { value: '44%', label: 'shorter review cycles' },
      { value: '87%', label: 'weekly team adoption' },
    ],
    preview: {
      label: 'FIELDNOTE',
      content: 'Team workspace',
      stats: [{ value: '32', label: 'notes' }, { value: '11', label: 'threads' }, { value: '08', label: 'owners' }],
      bars: [47, 64, 73, 57, 79, 87],
    },
    challenge: { label: '01 / challenge', heading: 'Good observations disappeared in the gap.', body: 'Distributed teams collected useful notes in many places, but lacked a shared moment to connect evidence to decisions. Important context was hard to find later.' },
    approach: { label: '02 / approach', heading: 'Keep the path from note to next step short.', body: 'I designed a modular workspace with clear ownership, lightweight tagging, and review rituals that supported both solo capture and group sensemaking.' },
    outcome: { label: '03 / outcome', heading: 'Shared context became a habit.', body: 'Fieldnote gave teams a durable record of why decisions were made and made collaboration feel like part of the work instead of another process around it.' },
  },
];

const initialWindows: WindowState = {
  about: true,
  work: true,
  contact: false,
  terminal: false,
  settings: false,
  guide: false,
};

function WindowFrame({
  id,
  title,
  active,
  maximized,
  dragging,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onHeaderDoubleClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  style,
}: {
  id: WindowId;
  title: string;
  active: boolean;
  maximized: boolean;
  dragging: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onHeaderDoubleClick: (event: ReactMouseEvent<HTMLElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection) => void;
  onResizeMove: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onResizeEnd: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <WindowSurface
      className={`window portfolio-scrollbar-window ${id} ${active ? 'is-active' : ''} ${maximized ? 'is-maximized' : ''} ${dragging ? 'is-dragging' : ''}`}
      onMouseDown={onFocus}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      data-draggable-item
      style={style}
      data-testid={`window-${id}`}
      aria-label={`${title} window`}
    >
      <header className="window-header" onDoubleClick={onHeaderDoubleClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className="window-header-spacer" aria-hidden="true" />
        <div className="window-title"><strong>~/john/</strong>{title.toLowerCase()}</div>
        <div className="traffic-lights" onPointerDown={(event) => event.stopPropagation()}>
          <button className="minimize" onClick={onMinimize} aria-label={`Minimize ${title}`} data-testid={`button-minimize-${id}`}><Minus size={10} strokeWidth={2.6} /><span className="window-control-tooltip">Minimize</span></button>
          <button className="maximize" onClick={onMaximize} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`} data-testid={`button-maximize-${id}`}><Maximize2 size={9} strokeWidth={2.4} /><span className="window-control-tooltip">{maximized ? 'Restore' : 'Maximize'}</span></button>
          <button className="close" onClick={onClose} aria-label={`Close ${title}`} data-testid={`button-close-${id}`}><X size={9} strokeWidth={2.6} /><span className="window-control-tooltip">Close</span></button>
        </div>
      </header>
      {children}
      {!maximized && (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeDirection[]).map((direction) => (
        <span
          key={direction}
          className={`window-resize-handle window-resize-${direction}`}
          onPointerDown={(event) => { event.stopPropagation(); onResizeStart(event, direction); }}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
          onPointerCancel={onResizeEnd}
          role="separator"
          aria-label={`Resize ${title} window from ${direction}`}
        />
      ))}
    </WindowSurface>
  );
}


function AboutWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  return (
    <WindowFrame {...props} id="about" title="About">
      <div className="window-body">
        <SectionLabel className="section-kicker">readme.md</SectionLabel>
        <h2>Interfaces with a pulse.</h2>
        <div className="about-grid">
          <div className="about-bio" data-testid="about-bio">
            <p>I'm John Doe, a product-minded designer based in Seattle. I build the connective tissue between a good idea and a product people want to keep using.</p>
            <p>My favorite work lives where interaction design, resilient systems, and a sharp point of view overlap. I care about the small delays, the useful defaults, and the moment software gets out of your way.</p>
            <div className="signature">john_doe<span className="blink">_</span></div>
          </div>
          <div className="fact-list" data-testid="about-facts">
            <div className="fact"><label>currently</label><span>Independent / open to select teams</span></div>
            <div className="fact"><label>timezone</label><span>PT · UTC−08:00</span></div>
            <div className="fact"><label>outside the screen</label><span>Star gazing, family time and time on the water</span></div>
          </div>
          <Separator className="about-separator" data-testid="about-separator" />
        </div>
      </div>
    </WindowFrame>
  );
}

function WorkWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  const [caseStudyId, setCaseStudyId] = useState<string | null>(null);
  const activeStudy = projects.find((project) => project.id === caseStudyId);

  return (
    <WindowFrame {...props} id="work" title="Work">
      {activeStudy ? (
        <div className="window-body case-study" data-testid={`case-study-${activeStudy.id}`}>
          <div className="case-study-topbar">
            <button className="case-study-back" onClick={() => setCaseStudyId(null)} data-testid="button-back-to-work"><ArrowLeft size={15} />all projects</button>
            <SectionLabel className="section-kicker">{activeStudy.category}</SectionLabel>
          </div>
          <div className="case-study-hero">
            <div>
              <h2>{activeStudy.name}</h2>
              <p>{activeStudy.summary}</p>
            </div>
            <span className="case-study-role">{activeStudy.role}</span>
          </div>
          <Surface className="case-study-metrics" aria-label="Project outcomes">
            {activeStudy.metrics.map((metric) => (
              <div key={`${activeStudy.id}-${metric.label}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>
            ))}
          </Surface>
          <div className="case-study-preview" aria-label={`${activeStudy.name} interface preview`}>
            <div className="case-study-preview-sidebar"><span className="case-study-preview-logo">{activeStudy.preview.label}</span><i /><i /><i /><i /></div>
            <div className="case-study-preview-dashboard">
              <div className="case-study-preview-header"><span>{activeStudy.preview.content}</span><b>{activeStudy.tag}</b></div>
              <div className="case-study-preview-stat-row">
                {activeStudy.preview.stats.map((stat) => <span key={`${activeStudy.id}-${stat.label}`}><b>{stat.value}</b> {stat.label}</span>)}
              </div>
              <div className="case-study-preview-chart">
                {activeStudy.preview.bars.map((height, index) => <span key={`${activeStudy.id}-bar-${index}`} style={{ height: `${height}%` }} />)}
              </div>
            </div>
          </div>
          <div className="case-study-sections">
            {[activeStudy.challenge, activeStudy.approach, activeStudy.outcome].map((section) => (
              <section key={`${activeStudy.id}-${section.label}`}><span>{section.label}</span><h3>{section.heading}</h3><p>{section.body}</p></section>
            ))}
          </div>
        </div>
      ) : (
        <div className="window-body">
          <SectionLabel className="section-kicker">projects / selected</SectionLabel>
          <h2>Things I've shipped.</h2>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard
                className="project-card"
                key={project.id}
                data-testid={`card-project-${project.id}`}
                index={project.id}
                title={project.name}
                description={project.desc}
                tag={project.tag}
                accent={project.color}
                 action={<ActionButton className="project-link" data-testid={`button-open-project-${project.id}`} onClick={() => setCaseStudyId(project.id)}>view case study <ArrowUpRight size={13} /></ActionButton>}
              />
            ))}
          </div>
          <p style={{ marginTop: 18, fontFamily: 'var(--app-font-mono)', fontSize: 10 }}>04 case studies · 4 shipped systems · 0 design handoffs left behind</p>
        </div>
      )}
    </WindowFrame>
  );
}

function ContactWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  return (
    <WindowFrame {...props} id="contact" title="Start a conversation">
      <div className="window-body contact-copy">
        <SectionLabel className="section-kicker">contact.txt</SectionLabel>
        <h2>Have a hard problem?</h2>
        <p>Tell me what you're making, where it's stuck, and what "better" would feel like. I'll get back to you with a considered reply, usually within a couple of days.</p>
        <a className="contact-button" href="mailto:hello@johndoe.design" data-testid="link-email-john">email John <Mail size={16} /></a>
        <p style={{ fontFamily: 'var(--app-font-mono)', fontSize: 10, marginTop: 18 }}>hello@johndoe.design</p>
      </div>
    </WindowFrame>
  );
}

type SettingsSection = 'personalization' | 'accessibility' | 'about';
type GuideSection = 'overview' | 'windows' | 'stickies' | 'dock' | 'systembar' | 'terminal-guide' | 'customize' | 'technical' | 'shortcuts';

// Settings toggle row component
function SettingsToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
  'data-testid': testId,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  'data-testid'?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`settings-toggle-row${disabled ? ' settings-toggle-disabled' : ''}`}
      data-testid={testId}
    >
      <div className="settings-toggle-label-group">
        <span className="settings-label">{label}</span>
        {description && <span className="settings-description">{description}</span>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`settings-toggle-switch${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
        data-testid={testId ? `${testId}-switch` : undefined}
        aria-label={label}
      >
        <span className="settings-toggle-knob" />
      </button>
    </label>
  );
}

function EffectSlider({
  id,
  label,
  value,
  onChange,
  testId,
  disabled = false,
  max = 70,
  step = 5,
  unit = '%',
  guidanceStart = 'None',
  guidanceEnd = 'Almost full',
  ariaValueText = `${value}${unit}`,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  testId: string;
  disabled?: boolean;
  max?: number;
  step?: number;
  unit?: string;
  guidanceStart?: string;
  guidanceEnd?: string;
  ariaValueText?: string;
}) {
  const progress = (value / max) * 100;

  return (
    <div
      className={`settings-transparency-group${disabled ? ' is-disabled' : ''}`}
      data-testid={testId}
      data-disabled={disabled ? '' : undefined}
    >
      <div className="settings-transparency-heading">
        <span className="settings-label" id={`${id}-label`}>{label}</span>
        <output
          className="settings-transparency-value"
          htmlFor={id}
          aria-live="polite"
          data-testid={`${testId}-value`}
        >
          {value}{unit}
        </output>
      </div>
      <div
        className="settings-transparency-control"
        style={{
          '--slider-progress': `${progress}%`,
          '--slider-thumb-left': `calc(${progress}% - ${(progress / 100) * 14}px)`,
        } as React.CSSProperties}
        data-testid={`${testId}-track`}
      >
        <input
          id={id}
          className="settings-transparency-slider"
          type="range"
          min="0"
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          aria-labelledby={`${id}-label`}
          aria-valuetext={ariaValueText}
          data-testid={`${testId}-slider`}
        />
      </div>
      <div className="settings-transparency-scale" aria-hidden="true">
        <span>{guidanceStart}</span>
        <span>{guidanceEnd}</span>
      </div>
    </div>
  );
}

// Settings Window
function SettingsAccordionSection({
  value,
  label,
  description,
  children,
}: {
  value: string;
  label: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={value} className="settings-section" data-testid={`settings-section-${value}`}>
      <AccordionTrigger className="settings-section-trigger" data-testid={`settings-section-trigger-${value}`}>
        <span className="settings-section-header">
          <span className="settings-label">{label}</span>
          <span className="settings-description">{description}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="settings-section-content">{children}</AccordionContent>
    </AccordionItem>
  );
}

function SettingsWindow({
  theme,
  onSetTheme,
  wallpaperLight,
  wallpaperDark,
  onSetWallpaperLight,
  onSetWallpaperDark,
  accessibility,
  onSetAccessibility,
  introCustomization,
  onSetIntroCustomization,
  onOpenWindow,
  openWindows,
  windowStack,
  stickiesCount,
  deviceMode,
  workspaceMode,
  dockPosition,
  ...props
}: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'> & {
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  wallpaperLight: WallpaperConfig;
  wallpaperDark: WallpaperConfig;
  onSetWallpaperLight: (config: WallpaperConfig) => void;
  onSetWallpaperDark: (config: WallpaperConfig) => void;
  accessibility: AccessibilityPrefs;
  onSetAccessibility: (prefs: AccessibilityPrefs) => void;
  introCustomization: IntroCustomization;
  onSetIntroCustomization: (value: IntroCustomization) => void;
  onOpenWindow: (id: WindowId) => void;
  openWindows: WindowState;
  windowStack: WindowId[];
  stickiesCount: number;
  deviceMode: DeviceMode;
  workspaceMode: WorkspaceMode;
  dockPosition: DockPosition;
}) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personalization');
  const [textColorTarget, setTextColorTarget] = useState<IntroTextKey | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const settingsContentRef = useRef<HTMLDivElement>(null);

  const currentWallpaper = theme === 'light' ? wallpaperLight : wallpaperDark;
  const setWallpaperMode = (mode: WallpaperMode) => {
    onSetWallpaperLight({ ...wallpaperLight, mode });
    onSetWallpaperDark({ ...wallpaperDark, mode });
  };
  const setCurrentWallpaperColor = (color: string) => {
    if (theme === 'light') onSetWallpaperLight({ ...wallpaperLight, color });
    else onSetWallpaperDark({ ...wallpaperDark, color });
  };

  const wallpaperPictureSrc = theme === 'light' ? './wallpaper-light.jpg' : './wallpaper-dark.jpg';

  // Wallpaper controls disabled when contrast theme is active
  const wallpaperDisabled = accessibility.contrastTheme !== 'none';
  const regularThemeDisabled = accessibility.contrastTheme !== 'none';

  const updateAccessibility = (patch: Partial<AccessibilityPrefs>) => {
    onSetAccessibility({ ...accessibility, ...patch });
  };

  const handleContrastThemeChange = (ct: ContrastTheme) => {
    updateAccessibility({ contrastTheme: ct });
  };
  const selectSettingsSection = (section: SettingsSection) => {
    setActiveSection(section);
    if (settingsContentRef.current) settingsContentRef.current.scrollTop = 0;
  };
  const introLabels: Record<IntroTextKey, string> = {
    primary: 'Primary headline',
    accent: 'Accent headline',
    body: 'Body paragraph',
  };
  const updateIntroText = (key: IntroTextKey, value: string) => {
    onSetIntroCustomization({ ...introCustomization, text: { ...introCustomization.text, [key]: value } });
  };
  const updateIntroColor = (key: IntroTextKey, color: string) => {
    onSetIntroCustomization({
      ...introCustomization,
      colors: {
        ...introCustomization.colors,
        [theme]: { ...introCustomization.colors[theme], [key]: color },
      },
    });
  };
  useEffect(() => {
    const handleResize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const browserName = /Firefox/i.test(navigator.userAgent)
    ? 'Firefox'
    : /Edg/i.test(navigator.userAgent)
      ? 'Edge'
      : /Chrome/i.test(navigator.userAgent)
        ? 'Chrome'
        : /Safari/i.test(navigator.userAgent)
          ? 'Safari'
          : 'Browser';
  const openWindowLabels = windowStack
    .filter((id) => openWindows[id])
    .map((id) => ({ about: 'About', work: 'Work', contact: 'Contact', terminal: 'Terminal', settings: 'Settings', guide: 'Guide' })[id]);
  const systemModeLabel = workspaceMode === 'desktop'
    ? 'Desktop workspace'
    : workspaceMode === 'tablet-landscape'
      ? 'Tablet landscape'
      : 'Managed layout';

  return (
    <WindowFrame {...props} id="settings" title="Settings">
      <div className="window-body settings-body">
        <div className="settings-layout">
          {/* Sidebar */}
          <nav className="settings-nav" aria-label="Settings sections">
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'personalization' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'personalization' ? 'page' : undefined}
              onClick={() => selectSettingsSection('personalization')}
              data-testid="settings-nav-personalization"
            >
              <span className="settings-nav-icon" aria-hidden="true">
                <Sun size={14} strokeWidth={1.8} />
              </span>
              Personalization
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'accessibility' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'accessibility' ? 'page' : undefined}
              onClick={() => selectSettingsSection('accessibility')}
              data-testid="settings-nav-accessibility"
            >
              <span className="settings-nav-icon" aria-hidden="true">
                <Eye size={14} strokeWidth={1.8} />
              </span>
              Accessibility
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'about' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'about' ? 'page' : undefined}
              onClick={() => selectSettingsSection('about')}
              data-testid="settings-nav-about"
            >
              <span className="settings-nav-icon" aria-hidden="true">
                <CircleUser size={14} strokeWidth={1.8} />
              </span>
              About
            </button>
          </nav>

          {/* Content */}
          <div ref={settingsContentRef} className="settings-content">
            {activeSection === 'personalization' && (
              <>
                <SectionLabel className="section-kicker">personalization</SectionLabel>
                <h2 className="settings-heading">Appearance</h2>

                <Accordion
                  type="multiple"
                  className="settings-accordion"
                >
                  {/* Theme row */}
                  <SettingsAccordionSection
                    value="theme"
                    label="Theme"
                    description={regularThemeDisabled
                      ? 'Light and dark themes are disabled while a contrast theme is active.'
                      : 'Controls the overall color scheme of the desktop.'}
                  >
                  <div className="settings-theme-row">
                    <button
                      type="button"
                      className={`settings-theme-option ${theme === 'light' ? 'is-selected' : ''}`}
                      aria-pressed={theme === 'light'}
                      disabled={regularThemeDisabled}
                      onClick={() => onSetTheme('light')}
                      data-testid="settings-theme-light"
                    >
                      <div className="settings-theme-preview settings-theme-preview-light" aria-hidden="true">
                        <div className="settings-theme-preview-bar" />
                        <div className="settings-theme-preview-content" />
                      </div>
                      <span className="settings-theme-label">
                        {theme === 'light' && <Check size={11} strokeWidth={2.5} />}
                        Light
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`settings-theme-option ${theme === 'dark' ? 'is-selected' : ''}`}
                      aria-pressed={theme === 'dark'}
                      disabled={regularThemeDisabled}
                      onClick={() => onSetTheme('dark')}
                      data-testid="settings-theme-dark"
                    >
                      <div className="settings-theme-preview settings-theme-preview-dark" aria-hidden="true">
                        <div className="settings-theme-preview-bar" />
                        <div className="settings-theme-preview-content" />
                      </div>
                      <span className="settings-theme-label">
                        {theme === 'dark' && <Check size={11} strokeWidth={2.5} />}
                        Dark
                      </span>
                    </button>
                  </div>
                  </SettingsAccordionSection>

                  {/* Wallpaper row */}
                  <SettingsAccordionSection
                    value="wallpaper"
                    label="Desktop wallpaper"
                    description={wallpaperDisabled
                      ? 'Wallpaper is disabled while a contrast theme is active.'
                      : 'Your wallpaper choice stays selected when switching themes.'}
                  >
                  {wallpaperDisabled ? (
                    <div className="settings-wallpaper-disabled-notice" aria-live="polite">
                      Wallpaper controls are hidden while Low or High contrast is active. Return to Standard contrast to change wallpaper.
                    </div>
                  ) : (
                    <>
                      {/* Mode toggle: picture vs color */}
                      <div className="settings-wallpaper-mode-row">
                        <button
                          type="button"
                          className={`settings-mode-chip ${currentWallpaper.mode === 'picture' ? 'is-selected' : ''}`}
                          aria-pressed={currentWallpaper.mode === 'picture'}
                          onClick={() => setWallpaperMode('picture')}
                          data-testid={`settings-wallpaper-mode-picture-${theme}`}
                        >
                          Picture
                        </button>
                        <button
                          type="button"
                          className={`settings-mode-chip ${currentWallpaper.mode === 'color' ? 'is-selected' : ''}`}
                          aria-pressed={currentWallpaper.mode === 'color'}
                          onClick={() => setWallpaperMode('color')}
                          data-testid={`settings-wallpaper-mode-color-${theme}`}
                        >
                          Solid color
                        </button>
                      </div>

                      {currentWallpaper.mode === 'picture' ? (
                        <div className="settings-wallpaper-picture-row">
                          <div
                            className="settings-wallpaper-thumb settings-wallpaper-thumb-selected"
                            aria-label={`Default ${theme} wallpaper, selected`}
                            data-testid={`settings-wallpaper-picture-${theme}`}
                            style={{ backgroundImage: `url(${wallpaperPictureSrc})` }}
                          >
                            <span className="settings-wallpaper-check" aria-hidden="true">
                              <Check size={14} strokeWidth={2.5} />
                            </span>
                          </div>
                          <div className="settings-wallpaper-picture-label">
                            <span className="settings-label">Default {theme} wallpaper</span>
                            <span className="settings-description">The provided default for {theme} mode.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="settings-wallpaper-color-row">
                          <div className="settings-color-presets" aria-label="Default solid colors">
                            {([
                              { themeId: 'light', label: 'Light default', color: DEFAULT_WALLPAPER_LIGHT.color },
                              { themeId: 'dark', label: 'Dark default', color: DEFAULT_WALLPAPER_DARK.color },
                            ] as const).map((preset) => (
                              <button
                                key={preset.themeId}
                                type="button"
                                className={`settings-color-preset${currentWallpaper.color.toLowerCase() === preset.color ? ' is-selected' : ''}`}
                                aria-pressed={currentWallpaper.color.toLowerCase() === preset.color}
                                aria-label={`${preset.label}, ${preset.color}`}
                                onClick={() => setCurrentWallpaperColor(preset.color)}
                                data-testid={`settings-color-preset-${preset.themeId}`}
                              >
                                <span className="settings-color-preset-swatch" style={{ backgroundColor: preset.color }} aria-hidden="true">
                                  {currentWallpaper.color.toLowerCase() === preset.color && <Check size={14} strokeWidth={2.5} />}
                                </span>
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                          <ColorPicker
                            id={`wallpaper-color-${theme}`}
                            value={currentWallpaper.color}
                            onChange={setCurrentWallpaperColor}
                            theme={theme}
                          />
                        </div>
                      )}
                    </>
                  )}
                  </SettingsAccordionSection>

                  <SettingsAccordionSection
                    value="desktop-text"
                    label="Desktop text personalization"
                    description={<>Edit the three desktop text elements and set separate colors for the {theme} theme.</>}
                  >
                  <SettingsToggle
                    id="automatic-text-contrast"
                    label="Automatic text contrast"
                    description="Automatically use light or dark desktop text based on the wallpaper behind each element."
                    checked={introCustomization.automaticContrast}
                    onChange={(automaticContrast) => onSetIntroCustomization({ ...introCustomization, automaticContrast })}
                    data-testid="settings-automatic-text-contrast"
                  />
                  <div className="settings-intro-editor">
                    {(['primary', 'accent', 'body'] as const).map((key) => (
                      <label className="settings-intro-field" key={key}>
                        <span>{introLabels[key]}</span>
                        <span className="settings-intro-input-row">
                          {key === 'body' ? (
                            <textarea
                              value={introCustomization.text[key]}
                              maxLength={240}
                              rows={3}
                              onChange={(event) => updateIntroText(key, event.currentTarget.value)}
                              data-testid={`settings-intro-${key}-text`}
                            />
                          ) : (
                            <input
                              value={introCustomization.text[key]}
                              maxLength={80}
                              onChange={(event) => updateIntroText(key, event.currentTarget.value)}
                              data-testid={`settings-intro-${key}-text`}
                            />
                          )}
                          <button
                            type="button"
                            className="settings-intro-color-button"
                            aria-label={`Choose ${introLabels[key].toLowerCase()} color for ${theme} theme`}
                            onClick={() => setTextColorTarget(key)}
                            data-testid={`settings-intro-${key}-color`}
                          >
                            <span style={{ backgroundColor: introCustomization.colors[theme][key] }} aria-hidden="true" />
                            {introCustomization.colors[theme][key].toUpperCase()}
                          </button>
                        </span>
                      </label>
                    ))}
                  </div>
                  </SettingsAccordionSection>

                  <SettingsAccordionSection
                    value="surface-effects"
                    label="Surface effects"
                    description="Fine-tune transparency and blur. Their global switches remain in Accessibility."
                  >
                  {accessibility.contrastTheme === 'none' && accessibility.windowTransparency ? (
                    <div className="settings-transparency-grid" data-testid="settings-transparency-grid">
                      {accessibility.windowTransparency && (
                        <>
                          <EffectSlider
                            id="personalization-window-transparency"
                            label="Window & dock transparency"
                            value={accessibility.transparencyLevel}
                            onChange={(value) => updateAccessibility({ transparencyLevel: value })}
                            testId="settings-personalization-window-transparency"
                            ariaValueText={`${accessibility.transparencyLevel}% transparent`}
                          />
                          <EffectSlider
                            id="personalization-sticky-transparency"
                            label="Sticky transparency"
                            value={accessibility.stickyTransparencyLevel}
                            onChange={(value) => updateAccessibility({ stickyTransparencyLevel: value })}
                            testId="settings-personalization-sticky-transparency"
                            ariaValueText={`${accessibility.stickyTransparencyLevel}% transparent`}
                          />
                        </>
                      )}
                      {accessibility.windowTransparency && accessibility.blurEffects && (
                        <EffectSlider
                          id="personalization-blur"
                          label="Blur"
                          value={accessibility.blurLevel}
                          onChange={(value) => updateAccessibility({ blurLevel: value })}
                          testId="settings-personalization-blur"
                          disabled={accessibility.transparencyLevel === 0}
                          max={24}
                          step={2}
                          unit="px"
                          guidanceStart="Sharp"
                          guidanceEnd="More blurred"
                          ariaValueText={`${accessibility.blurLevel} pixels of blur`}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="settings-wallpaper-disabled-notice" data-testid="settings-transparency-disabled-notice">
                      Turn on Transparency effects or Blur effects in Accessibility to adjust these levels.
                    </div>
                  )}
                  </SettingsAccordionSection>
                </Accordion>
              </>
            )}

            {activeSection === 'accessibility' && (
              <>
                <SectionLabel className="section-kicker">accessibility</SectionLabel>
                <h2 className="settings-heading">Accessibility</h2>

                <Accordion
                  type="multiple"
                  className="settings-accordion"
                >
                  {/* Display section */}
                  <SettingsAccordionSection
                    value="display"
                    label="Display"
                    description="Adjust how elements appear on screen."
                  >
                  <SettingsToggle
                    id="a11y-scrollbars"
                    label="Always show scrollbars"
                    description="Keeps scrollbar tracks and thumbs permanently visible instead of hiding when idle."
                    checked={accessibility.alwaysShowScrollbars}
                    onChange={(v) => updateAccessibility({ alwaysShowScrollbars: v })}
                    data-testid="settings-a11y-scrollbars"
                  />

                  <SettingsToggle
                    id="a11y-transparency"
                    label="Transparency effects"
                    description={accessibility.contrastTheme === 'none'
                      ? 'Enables transparency across windows, the dock, menus, and stickies. Turn off for opaque solid surfaces.'
                      : 'Disabled while a contrast theme is active. Your saved Standard preference will be restored.'}
                    checked={accessibility.contrastTheme === 'none' && accessibility.windowTransparency}
                    onChange={(v) => updateAccessibility({ windowTransparency: v })}
                    disabled={accessibility.contrastTheme !== 'none'}
                    data-testid="settings-a11y-transparency"
                  />

                  <SettingsToggle
                    id="a11y-blur"
                    label="Blur effects"
                    description={accessibility.contrastTheme !== 'none'
                      ? 'Disabled while a contrast theme is active. Your saved Standard preference will be restored.'
                      : !accessibility.windowTransparency
                        ? 'Requires Transparency effects. Your saved Blur preference will be restored when Transparency is turned on.'
                        : 'Enables backdrop blur across windows, the dock, menus, and stickies.'}
                    checked={accessibility.contrastTheme === 'none' && accessibility.windowTransparency && accessibility.blurEffects}
                    onChange={(v) => updateAccessibility({ blurEffects: v })}
                    disabled={accessibility.contrastTheme !== 'none' || !accessibility.windowTransparency}
                    data-testid="settings-a11y-blur"
                  />
                  </SettingsAccordionSection>

                  {/* Motion section */}
                  <SettingsAccordionSection
                    value="motion"
                    label="Motion"
                    description="Control animations and transitions across the UI."
                  >
                  <SettingsToggle
                    id="a11y-animations"
                    label="UI animations"
                    description={accessibility.contrastTheme === 'none'
                      ? 'Enables transitions, keyframe animations, and motion effects. Turn off to remove all motion.'
                      : 'Disabled while a contrast theme is active. Your saved Standard preference will be restored.'}
                    checked={accessibility.contrastTheme === 'none' && accessibility.uiAnimations}
                    onChange={(v) => updateAccessibility({ uiAnimations: v })}
                    disabled={accessibility.contrastTheme !== 'none'}
                    data-testid="settings-a11y-animations"
                  />

                  {accessibility.contrastTheme === 'none' && accessibility.uiAnimations && (
                    <div className="settings-speed-group" data-testid="settings-a11y-speed-group">
                      <span className="settings-label">Animation speed</span>
                      <span className="settings-description">
                        <strong>Less</strong> — slower, reduced intensity (easier on motion sensitivity).{' '}
                        <strong>Default</strong> — standard timing.{' '}
                        <strong>More</strong> — faster, snappier motion.
                      </span>
                      <div className="settings-speed-chips" role="radiogroup" aria-label="Animation speed">
                        {([
                          { value: 'less' as AnimationSpeed, label: 'Less', description: 'Slower, reduced intensity' },
                          { value: 'default' as AnimationSpeed, label: 'Default', description: 'Standard timing' },
                          { value: 'more' as AnimationSpeed, label: 'More', description: 'Faster, snappier motion' },
                        ]).map(({ value, label, description }) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={accessibility.animationSpeed === value}
                            className={`settings-speed-chip${accessibility.animationSpeed === value ? ' is-selected' : ''}`}
                            onClick={() => updateAccessibility({ animationSpeed: value })}
                            data-testid={`settings-a11y-speed-${value}`}
                            title={description}
                          >
                            {accessibility.animationSpeed === value && <Check size={10} strokeWidth={2.5} aria-hidden="true" />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  </SettingsAccordionSection>

                  {/* Contrast section */}
                  <SettingsAccordionSection
                    value="contrast"
                    label="Contrast theme"
                    description={(
                      <>
                      Applies a fixed system palette. <strong>Low contrast</strong> softens visual harshness for sensitivity to bright contrast. <strong>High contrast</strong> maximises black/white separation and sharpens focus indicators.
                      {accessibility.contrastTheme !== 'none' && ' Wallpaper, motion, transparency, and blur controls are disabled while a contrast theme is active.'}
                      </>
                    )}
                  >
                  <div className="settings-contrast-options" role="radiogroup" aria-label="Contrast theme">
                    {([
                      {
                        value: 'none' as ContrastTheme,
                        label: 'Standard',
                        description: 'Default appearance',
                        testId: 'settings-a11y-contrast-none',
                        previewClass: 'settings-contrast-preview-none',
                      },
                      {
                        value: 'low' as ContrastTheme,
                        label: 'Low contrast',
                        description: 'Reduced visual harshness',
                        testId: 'settings-a11y-contrast-low',
                        previewClass: 'settings-contrast-preview-low',
                      },
                      {
                        value: 'high' as ContrastTheme,
                        label: 'High contrast',
                        description: 'Maximum black/white separation',
                        testId: 'settings-a11y-contrast-high',
                        previewClass: 'settings-contrast-preview-high',
                      },
                    ]).map(({ value, label, description, testId, previewClass }) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={accessibility.contrastTheme === value}
                        className={`settings-contrast-option${accessibility.contrastTheme === value ? ' is-selected' : ''}`}
                        onClick={() => handleContrastThemeChange(value)}
                        data-testid={testId}
                      >
                        <div className={`settings-contrast-preview ${previewClass}`} aria-hidden="true">
                          <div className="settings-contrast-preview-bar" />
                          <div className="settings-contrast-preview-content" />
                          <div className="settings-contrast-preview-text" />
                        </div>
                        <span className="settings-contrast-label">
                          {accessibility.contrastTheme === value && <Check size={10} strokeWidth={2.5} aria-hidden="true" />}
                          {label}
                        </span>
                        <span className="settings-contrast-desc">{description}</span>
                      </button>
                    ))}
                  </div>
                  </SettingsAccordionSection>
                </Accordion>
              </>
            )}

            {activeSection === 'about' && (
              <div className="settings-about" data-testid="settings-about">
                <SectionLabel className="section-kicker">about / os portfolio</SectionLabel>
                <section className="settings-about-hero" aria-labelledby="settings-about-title">
                  <div className="settings-about-mark" aria-hidden="true">
                    <CircleUserFill size={34} />
                  </div>
                  <div className="settings-about-hero-copy">
                    <h2 id="settings-about-title" className="settings-heading">OS Portfolio</h2>
                    <p>A thoughtful browser-based desktop for exploring John Doe’s work, systems, and process.</p>
                  </div>
                  <div className="settings-about-version" data-testid="settings-about-version">
                    <strong>{RELEASE_VERSION}</strong>
                    <span>{RELEASE_CHANNEL}</span>
                  </div>
                </section>

                <div className="settings-about-grid">
                  <section className="settings-about-panel" aria-labelledby="settings-about-system">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">01 / system</span>
                      <h3 id="settings-about-system">Your environment</h3>
                    </div>
                    <dl className="settings-about-details">
                      <div><dt>Browser</dt><dd>{browserName}</dd></div>
                      <div><dt>Viewport</dt><dd>{viewportSize.width} × {viewportSize.height}</dd></div>
                      <div><dt>Workspace</dt><dd>{systemModeLabel}</dd></div>
                      <div><dt>Device</dt><dd>{deviceMode[0].toUpperCase() + deviceMode.slice(1)}</dd></div>
                    </dl>
                  </section>

                  <section className="settings-about-panel" aria-labelledby="settings-about-release">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">02 / release</span>
                      <h3 id="settings-about-release">This release</h3>
                    </div>
                    <dl className="settings-about-details">
                      <div><dt>Version</dt><dd>{RELEASE_VERSION}</dd></div>
                      <div><dt>Published</dt><dd>{RELEASE_DATE}</dd></div>
                      <div><dt>Commit</dt><dd>{RELEASE_COMMIT === 'local' ? 'Local build' : RELEASE_COMMIT.slice(0, 7)}</dd></div>
                      <div><dt>Status</dt><dd><span className="settings-about-status"><span aria-hidden="true" />{RELEASE_CHANNEL}</span></dd></div>
                    </dl>
                  </section>

                  <section className="settings-about-panel" aria-labelledby="settings-about-workspace">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">03 / workspace</span>
                      <h3 id="settings-about-workspace">Your current desktop</h3>
                    </div>
                    <dl className="settings-about-details">
                      <div><dt>Open windows</dt><dd>{openWindowLabels.length} · {openWindowLabels.join(', ') || 'None'}</dd></div>
                      <div><dt>Sticky notes</dt><dd>{stickiesCount}</dd></div>
                      <div><dt>Dock position</dt><dd>{dockPosition}</dd></div>
                      <div><dt>Theme</dt><dd>{theme === 'light' ? 'Light' : 'Dark'}</dd></div>
                    </dl>
                  </section>

                  <section className="settings-about-panel settings-about-panel-wide" aria-labelledby="settings-about-capabilities">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">04 / capabilities</span>
                      <h3 id="settings-about-capabilities">What this desktop can do</h3>
                    </div>
                    <ul className="settings-about-list">
                      <li>Arrange, resize, and layer desktop windows</li>
                      <li>Save themes, wallpapers, Dock preferences, and layout</li>
                      <li>Keep sticky notes available across sessions</li>
                      <li>Adapt the workspace for desktop, tablet, and mobile screens</li>
                      <li>Support keyboard shortcuts and accessibility preferences</li>
                    </ul>
                  </section>

                  <section className="settings-about-panel settings-about-panel-wide settings-about-boundary" aria-labelledby="settings-about-boundary">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">05 / browser OS</span>
                      <h3 id="settings-about-boundary">Inside the browser</h3>
                    </div>
                    <p>
                      OS Portfolio is an interactive desktop experience, not a native operating system. Windows and the Terminal are simulated in the browser, and workspace preferences are saved in this browser’s local storage.
                    </p>
                    <p>
                      It does not run native commands, access arbitrary files, or send your workspace preferences to a server.
                    </p>
                  </section>

                  <section className="settings-about-panel settings-about-panel-wide" aria-labelledby="settings-about-links">
                    <div className="settings-about-panel-heading">
                      <span className="section-kicker">06 / credits & links</span>
                      <h3 id="settings-about-links">Keep exploring</h3>
                    </div>
                    <div className="settings-about-actions">
                      <button type="button" className="settings-about-link" onClick={() => onOpenWindow('guide')} data-testid="settings-about-open-guide">
                        Open User Guide <ArrowUpRight size={13} />
                      </button>
                      <a
                        className="settings-about-link"
                        href="/os-portfolio-ds/"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="settings-about-open-design-system"
                      >
                        Explore Design System <ArrowUpRight size={13} />
                      </a>
                    </div>
                    <p className="settings-about-credit">Designed and built by John Doe. OS Portfolio and OS Portfolio DS share the same tokens, components, and accessibility contracts.</p>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={textColorTarget !== null} onOpenChange={(open) => { if (!open) setTextColorTarget(null); }}>
        <DialogContent
          className={`text-color-dialog theme-${theme}`}
          overlayClassName="text-color-dialog-overlay"
          data-testid="text-color-dialog"
        >
          <DialogHeader>
            <DialogTitle>{textColorTarget ? `${introLabels[textColorTarget]} color` : 'Text color'}</DialogTitle>
            <DialogDescription>Editing the {theme}-theme color. The other theme keeps its own value.</DialogDescription>
          </DialogHeader>
          {textColorTarget && (
            <ColorPicker
              id={`intro-${textColorTarget}-${theme}`}
              value={introCustomization.colors[theme][textColorTarget]}
              onChange={(color) => updateIntroColor(textColorTarget, color)}
              theme={theme}
            />
          )}
        </DialogContent>
      </Dialog>
    </WindowFrame>
  );
}

function GuideWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  const [activeSection, setActiveSection] = useState<GuideSection>('overview');
  const guideContentRef = useRef<HTMLDivElement>(null);

  const selectGuideSection = (section: GuideSection) => {
    setActiveSection(section);
    if (guideContentRef.current) guideContentRef.current.scrollTop = 0;
  };

  return (
    <WindowFrame {...props} id="guide" title="User Guide">
      <div className="window-body guide-body">
        <div className="settings-layout guide-layout">
          <nav className="settings-nav guide-nav" aria-label="User guide sections">
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'overview' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'overview' ? 'page' : undefined}
              onClick={() => selectGuideSection('overview')}
              data-testid="guide-nav-overview"
            >
              <span className="settings-nav-icon" aria-hidden="true"><BookOpen size={14} strokeWidth={1.8} /></span>
              Overview
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'windows' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'windows' ? 'page' : undefined}
              onClick={() => selectGuideSection('windows')}
              data-testid="guide-nav-windows"
            >
              <span className="settings-nav-icon" aria-hidden="true"><SquareTerminal size={14} strokeWidth={1.8} /></span>
              Windows
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'stickies' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'stickies' ? 'page' : undefined}
              onClick={() => selectGuideSection('stickies')}
              data-testid="guide-nav-stickies"
            >
              <span className="settings-nav-icon" aria-hidden="true"><BsStickyFill size={13} /></span>
              Stickies
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'dock' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'dock' ? 'page' : undefined}
              onClick={() => selectGuideSection('dock')}
              data-testid="guide-nav-dock"
            >
              <span className="settings-nav-icon" aria-hidden="true"><Menu size={14} strokeWidth={1.8} /></span>
              Dock
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'systembar' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'systembar' ? 'page' : undefined}
              onClick={() => selectGuideSection('systembar')}
              data-testid="guide-nav-systembar"
            >
              <span className="settings-nav-icon" aria-hidden="true"><Minus size={14} strokeWidth={1.8} /></span>
              System bar
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'terminal-guide' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'terminal-guide' ? 'page' : undefined}
              onClick={() => selectGuideSection('terminal-guide')}
              data-testid="guide-nav-terminal"
            >
              <span className="settings-nav-icon" aria-hidden="true"><TerminalCursorFill size={14} /></span>
              Terminal
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'customize' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'customize' ? 'page' : undefined}
              onClick={() => selectGuideSection('customize')}
              data-testid="guide-nav-customize"
            >
              <span className="settings-nav-icon" aria-hidden="true"><Settings size={14} strokeWidth={1.8} /></span>
              Customize
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'technical' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'technical' ? 'page' : undefined}
              onClick={() => selectGuideSection('technical')}
              data-testid="guide-nav-technical"
            >
              <span className="settings-nav-icon" aria-hidden="true"><Layers size={14} strokeWidth={1.8} /></span>
              Tech notes
            </button>
            <button
              type="button"
              className={`settings-nav-item${activeSection === 'shortcuts' ? ' settings-nav-item-active' : ''}`}
              aria-current={activeSection === 'shortcuts' ? 'page' : undefined}
              onClick={() => selectGuideSection('shortcuts')}
              data-testid="guide-nav-shortcuts"
            >
              <span className="settings-nav-icon" aria-hidden="true"><Command size={14} strokeWidth={1.8} /></span>
              Shortcuts
            </button>
          </nav>

          <div ref={guideContentRef} className="settings-content guide-content">
            {activeSection === 'overview' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / start here</SectionLabel>
                    <h2 className="settings-heading">A calmer way to work</h2>
                    <p className="guide-intro">
                      This desktop is a small, flexible workspace. Open the tools you need, arrange them around your work,
                      and save the setup that feels right.
                    </p>
                  </div>
                </div>

                {/* Visual: desktop overview diagram */}
                <AnnotatedFrame
                  className="guide-visual-desktop-overview"
                  cropClassName="gvc-overview-crop"
                  markers={[
                    { label: 'A', description: 'System bar — time, status, and location' },
                    { label: 'B', description: 'Windows — each app opens here' },
                    { label: 'C', description: 'Stickies — quick notes on the desktop' },
                    { label: 'D', description: 'Dock — open and switch apps' },
                  ]}
                >
                    {/* System bar */}
                    <div className="gvc-overview-sysbar">
                      <span className="gvc-sysbar-logo" />
                      <span className="gvc-overview-sysbar-title">workspace</span>
                      <span style={{ flex: 1 }} />
                      <span className="gvc-sysbar-clock">10:42 am</span>
                      <span className="gvc-dot-badge">A</span>
                    </div>
                    {/* Desktop area */}
                    <div className="gvc-overview-desktop">
                      <div className="gvc-overview-window gvc-overview-window-about">
                        <div className="gvc-overview-window-bar">
                          <span>~/about</span>
                          <span className="gvc-overview-window-controls" aria-hidden="true"><i /><i /><i /></span>
                        </div>
                        <div className="gvc-overview-window-body">
                          <div className="gvc-content-line" style={{ width: '52%' }} />
                          <div className="gvc-content-line" style={{ width: '88%' }} />
                          <div className="gvc-content-line" style={{ width: '70%' }} />
                        </div>
                      </div>
                      <div className="gvc-overview-window gvc-overview-window-work">
                        <div className="gvc-overview-window-bar">
                          <span>~/work</span>
                          <span className="gvc-overview-window-controls" aria-hidden="true"><i /><i /><i /></span>
                        </div>
                        <div className="gvc-overview-window-body">
                          <div className="gvc-content-line" style={{ width: '46%' }} />
                          <div className="gvc-content-line" style={{ width: '82%' }} />
                          <div className="gvc-content-line" style={{ width: '62%' }} />
                        </div>
                        <span className="gvc-dot-badge">B</span>
                      </div>
                      <div className="gvc-overview-side">
                        <div className="gvc-overview-icon">
                          <div className="gvc-overview-icon-tile" />
                          <span>about</span>
                        </div>
                        <div className="gvc-overview-sticky">
                          <div className="gvc-overview-sticky-tape" />
                          <div className="gvc-overview-sticky-line" />
                          <div className="gvc-overview-sticky-line gvc-overview-sticky-line-short" />
                          <span className="gvc-dot-badge">C</span>
                        </div>
                      </div>
                    </div>
                    {/* Dock */}
                    <div className="gvc-overview-dock">
                      {[0,1,2,3,4,5,6].map(i => (
                        <div key={i} className="gvc-overview-dock-item" style={{ background: ['#d64f8c','#7478b8','#e7ded5','#303747','#ebca75','#56cbd3','#c9f27b'][i] }} />
                      ))}
                      <span className="gvc-dot-badge">D</span>
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Get started</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Choose an app</h3><p>Select an icon in the Dock or on the desktop. The app opens in a window, or comes forward if it is already open.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Move things around</h3><p>Drag a window by its top bar. Drag an edge or corner when you want more or less room.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Try the desktop tools</h3><p>Open Settings to change the desktop. Use Stickies for short notes, or open Terminal to explore the built-in commands.</p></div>
                  </div>
                </div>
                <div className="guide-section-label">Know your way around</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Dock</span>
                    <div><h3>Your main app bar</h3><p>The Dock shows the apps you can open. A mark below an icon means that app is open. Select an open app to bring it forward or hide it.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Windows</span>
                    <div><h3>Apps share the desktop</h3><p>You can keep several windows open. Select any window to place it in front without closing the others.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Desktop</span>
                    <div><h3>A place for shortcuts and notes</h3><p>Desktop icons open apps just like the Dock. Stickies stay where you place them on larger screens.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">04 / Saving</span>
                    <div><h3>Your changes stay in this browser</h3><p>Window positions, Stickies, and Settings are saved automatically. Use Save state as default when you want a setup you can return to later.</p></div>
                  </Surface>
                </div>
                <div className="guide-section-label">Desktop icons and the Dock</div>
                <div className="guide-visual-full guide-visual-launcher-states" aria-hidden="true">
                  <div className="gvc-launcher-state-group">
                    <span className="gvc-launcher-group-title">Desktop icon</span>
                    <div className="gvc-launcher-state-row">
                      <div className="gvc-launcher-state">
                        <span className="gvc-launcher-desktop-icon"><CircleUserFill size={25} /></span>
                        <span className="gvc-launcher-desktop-label">about</span>
                        <span className="gvc-launcher-state-name">Closed</span>
                      </div>
                      <div className="gvc-launcher-state">
                        <span className="gvc-launcher-desktop-icon is-open"><CircleUserFill size={25} /></span>
                        <span className="gvc-launcher-desktop-label is-open">about</span>
                        <span className="gvc-launcher-state-name">Open</span>
                      </div>
                    </div>
                  </div>
                  <div className="gvc-launcher-link">
                    <span>same app</span>
                    <span aria-hidden="true">↔</span>
                    <span>shared state</span>
                  </div>
                  <div className="gvc-launcher-state-group">
                    <span className="gvc-launcher-group-title">Dock item</span>
                    <div className="gvc-launcher-state-row">
                      <div className="gvc-launcher-state">
                        <span className="gvc-launcher-dock-icon"><CircleUserFill size={20} /></span>
                        <span className="gvc-launcher-state-name">Closed</span>
                      </div>
                      <div className="gvc-launcher-state">
                        <span className="gvc-launcher-dock-icon is-open"><CircleUserFill size={20} /></span>
                        <span className="gvc-launcher-state-name">Open</span>
                      </div>
                      <div className="gvc-launcher-state">
                        <span className="gvc-launcher-dock-icon is-open is-focused"><CircleUserFill size={20} /></span>
                        <span className="gvc-launcher-state-name">Focused</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Recognize closed, open, and focused apps</h3><p>A desktop icon has closed and open states; an open icon uses a brighter tile and highlighted label. In the Dock, a full-tile ring means the app is open. The directional edge pill identifies the one open app currently focused in front.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Use either launcher for the same app</h3><p>About, Work, Contact, Terminal, and Stickies appear both on the desktop and in the Dock. Opening an app from either place updates both controls because they share the same app state. A desktop icon always opens or focuses its app; it does not hide an open app.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Find Dock-only controls</h3><p>Shortcuts, Settings, and Guide appear only in the Dock. The Dock also has app-specific controls: selecting the focused Terminal minimizes it, while selecting focused Stickies hides the notes. Other app items open or bring their window forward.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div><h3>Open and arrange desktop icons</h3><p>Double-click a desktop icon with a mouse or trackpad; tap once on a touch device. Hover or keyboard focus shows whether the action will open or focus the app. Drag icons to arrange them. Their positions are saved separately from the Dock, so moving an icon never moves or reorders its Dock item.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">05</span>
                    <div><h3>Change icon display without changing the Dock</h3><p>Use the Desktop context menu to choose large or small icons, clean up positions, snap moves to the grid, auto arrange, or hide every desktop icon. The matching Dock items remain available and keep their open and focused states.</p></div>
                  </div>
                </div>
                <div className="guide-section-label">Desktop context menu</div>
                <div className="guide-visual-row guide-visual-desktop-menu-row">
                  <div className="guide-visual-crop guide-visual-desktop-menu" aria-hidden="true">
                    <div className="gvc-menu gvc-menu-desktop">
                      <div className="gvc-menu-title">Desktop options</div>
                      <div className="gvc-menu-sep" />
                      <div className="gvc-menu-item gvc-menu-item-submenu">View <span aria-hidden="true">›</span></div>
                      <div className="gvc-menu-item">Cleanup icons</div>
                      <div className="gvc-menu-item gvc-menu-item-checked"><span className="gvc-menu-check">&#10003;</span>Snap to grid</div>
                      <div className="gvc-menu-item">Auto arrange icons</div>
                      <div className="gvc-menu-sep" />
                      <div className="gvc-menu-item gvc-menu-item-checked"><span className="gvc-menu-check">&#10003;</span>Show desktop icons</div>
                      <div className="gvc-menu-item">Save state as default</div>
                      <div className="gvc-menu-sep" />
                      <div className="gvc-menu-item gvc-menu-item-danger">Reset desktop…</div>
                    </div>
                  </div>
                  <div className="guide-visual-caption">
                    <span className="guide-card-index">right-click</span>
                    <h3>The Desktop context menu</h3>
                    <p>Right-click an open area of the desktop to manage icons or the whole workspace. Checkmarks show options that stay on until you change them.</p>
                  </div>
                </div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Change how icons appear</h3><p>Open View to choose large or small icons. Show desktop icons hides or restores every desktop shortcut without removing the apps from the Dock.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Organize desktop icons</h3><p>Cleanup icons straightens the current arrangement once. Snap to grid keeps future moves aligned. Auto arrange icons places them in order for you.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Save or reset the workspace</h3><p>Save state as default records the current workspace as the setup used by Reset desktop. Reset desktop asks for confirmation before restoring that saved baseline.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div><h3>Use the menu from the keyboard</h3><p>After the menu opens, use the arrow keys to move, Enter or Space to choose an item, and Escape to close it.</p></div>
                  </div>
                </div>
                <div className="guide-callout">
                  <span className="guide-callout-label">quick start</span>
                  <p>Press <kbd>8</kbd> on a desktop keyboard to bring this guide forward. Open <strong>Windows</strong> next to learn each window control.</p>
                </div>
              </>
            )}

            {activeSection === 'windows' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / windows</SectionLabel>
                    <h2 className="settings-heading">Work with windows</h2>
                    <p className="guide-intro">Each app opens in a window. You can move, resize, hide, maximize, and close windows without leaving the page.</p>
                  </div>
                </div>

                {/* Visual: window anatomy — legend below crop */}
                <AnnotatedFrame
                  className="guide-visual-window-demo"
                  markers={[
                    { label: 'A', description: 'Title bar — drag here to move the window' },
                    { label: 'B', description: 'Minimize / Maximize / Close — left to right' },
                    { label: 'C', description: 'Corner handle — drag to resize' },
                  ]}
                >
                    <AbstractWindow title="~/about" showResizeHandle style={{ minWidth: 240, width: '70%', maxWidth: 360 }}>
                      <span className="gvc-dot-badge" style={{ position: 'absolute', left: '46%', top: 8, transform: 'translateX(-50%)' }}>A</span>
                      <span className="gvc-dot-badge" style={{ position: 'absolute', right: 2, top: 8 }}>B</span>
                      <div className="gvc-content-line" style={{ width: '55%', height: 3, marginBottom: 6 }} />
                      <div className="gvc-content-line" style={{ width: '85%' }} />
                      <div className="gvc-content-line" style={{ width: '70%' }} />
                      <div className="gvc-content-line" style={{ width: '80%' }} />
                      <div className="gvc-content-line" style={{ width: '40%' }} />
                      <span className="gvc-dot-badge" style={{ position: 'absolute', bottom: 2, right: 2 }}>C</span>
                    </AbstractWindow>
                </AnnotatedFrame>

                <div className="guide-section-label">Window controls</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Bring a window forward</h3><p>Select any part of a window, or select its Dock icon. It moves in front of the other open windows.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Move a window</h3><p>Drag the top bar and release it where you want the window to stay.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Change its size</h3><p>Drag an edge or corner. The window remembers its size and position when you close and reopen it.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div><h3>Fill the desktop</h3><p>Select the maximize button, or double-click the top bar. Repeat the action to return to the previous size.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">05</span>
                    <div><h3>Hide or close a window</h3><p>Minimize hides the window but keeps the app open. Close removes the window. You can open it again from the Dock.</p></div>
                  </div>
                </div>
                <div className="guide-section-label">Useful details</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Dock</span>
                    <div><h3>Know which app is active</h3><p>The active app has a stronger mark on its Dock icon. Other open apps keep a smaller open mark.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Memory</span>
                    <div><h3>Windows remember their place</h3><p>The desktop saves window size, position, open state, and front-to-back order in this browser.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Small screens</span>
                    <div><h3>Phones and tablets arrange windows for you</h3><p>On smaller screens, windows use a simpler layout that is easier to read and touch. Your desktop arrangement returns on a larger screen.</p></div>
                  </Surface>
                </div>
              </>
            )}

            {activeSection === 'stickies' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / stickies</SectionLabel>
                    <h2 className="settings-heading">Sticky notes</h2>
                    <p className="guide-intro">Stickies are free-floating notes on the desktop. Pin a thought, leave a reminder, or keep a short list. They stay where you put them.</p>
                  </div>
                </div>

                {/* Visual: sticky note anatomy */}
                <AnnotatedFrame
                  className="guide-visual-sticky-demo"
                  cropClassName="gvc-sticky-crop"
                  markers={[
                    { label: 'A', description: 'Tape strip — drag to move the note' },
                    { label: 'B', description: 'Plus / trash icons — add or delete a note' },
                    { label: 'C', description: 'Rotation handles — drag handles at the corners to rotate the note (desktop only)' },
                    { label: 'D', description: 'Resize corner — drag to change the note size' },
                  ]}
                >
                    <div className="gvc-sticky-wrap">
                      <div className="gvc-sticky-tape">
                        <span className="gvc-dot-badge gvc-dot-inline">A</span>
                      </div>
                      <div className="gvc-sticky-body">
                        <div className="gvc-sticky-header">
                          <span className="gvc-sticky-label">title</span>
                          <div className="gvc-sticky-actions">
                            <span className="gvc-dot-badge gvc-sticky-actions-marker">B</span>
                            <div className="gvc-sticky-btn"><Plus size={12} strokeWidth={2.2} /></div>
                            <div className="gvc-sticky-btn"><BsTrash3Fill size={10} /></div>
                          </div>
                        </div>
                        <div className="gvc-sticky-text-lines">
                          <div className="gvc-text-line" style={{ width: '88%' }} />
                          <div className="gvc-text-line" style={{ width: '72%' }} />
                          <div className="gvc-text-line" style={{ width: '60%' }} />
                        </div>
                        {/* Rotation handles shown at corners */}
                        <div className="gvc-sticky-rot-handles" aria-hidden="true">
                          <span className="gvc-rot-handle gvc-rot-tl">
                            <span className="gvc-dot-badge">C</span>
                          </span>
                          <span className="gvc-rot-handle gvc-rot-tr">
                            <span className="gvc-dot-badge">C</span>
                          </span>
                          <span className="gvc-rot-handle gvc-rot-bl">
                            <span className="gvc-dot-badge">C</span>
                          </span>
                        </div>
                        <div className="gvc-sticky-footer">
                          <span className="gvc-sticky-footertext">10:42</span>
                        </div>
                        <div className="gvc-sticky-resize">
                          <span className="gvc-dot-badge gvc-dot-inline">D</span>
                        </div>
                      </div>
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Using stickies</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div>
                      <h3>Open Stickies</h3>
                      <p>Select the Stickies icon in the Dock, on the desktop, or press <kbd>5</kbd>. The most recent note comes forward. If Stickies are hidden, they reappear.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div>
                      <h3>Write a note</h3>
                      <p>Select inside the note and start typing. The text saves automatically as you write. There is no submit button.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div>
                      <h3>Move a note</h3>
                      <p>Drag the tape strip at the top of the note. Release it where you want the note to stay.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div>
                      <h3>Resize a note</h3>
                      <p>Drag the triangle handle at the bottom-right corner to make the note larger or smaller.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">05</span>
                    <div>
                      <h3>Rotate a note</h3>
                      <p>Select or focus a sticky to reveal rotation handles at the top-left, top-right, and bottom-left corners. Drag any handle to spin the note freely. Hold <kbd>Shift</kbd> while dragging to snap to 15-degree steps.</p>
                      <p>By keyboard: focus the top-right rotation handle, then press <kbd>Left</kbd> or <kbd>Down</kbd> to rotate minus one degree, <kbd>Right</kbd> or <kbd>Up</kbd> for plus one degree. Hold <kbd>Shift</kbd> for 15-degree steps. Press <kbd>Home</kbd> or <kbd>0</kbd> to reset upright. Right-click the note and choose Reset rotation to snap it back with a pointer.</p>
                      <p>Rotation controls appear only on desktop and with a fine pointer. On small screens, managed layouts keep notes upright.</p>
                    </div>
                  </div>
                </div>

                {/* Visual: color palette */}
                <div className="guide-section-label">Change the color</div>
                <div className="guide-visual-full guide-visual-sticky-colors" aria-hidden="true">
                  {[
                    { bg: '#ffd84d', border: '#c9a32a' },
                    { bg: '#ffb84d', border: '#c97a1e' },
                    { bg: '#c9363e', border: '#8f222a' },
                    { bg: '#fff0d2', border: '#c4a97a' },
                    { bg: '#006456', border: '#004338' },
                    { bg: '#0d56b3', border: '#083a7c' },
                    { bg: '#6648b8', border: '#3e2d84' },
                    { bg: '#a93570', border: '#76244f' },
                    { bg: '#1e603d', border: '#123d26' },
                    { bg: '#343b4f', border: '#1f2333' },
                  ].map((c, i) => (
                    <div key={i} className="gvc-color-swatch" style={{ background: c.bg, borderColor: c.border }} />
                  ))}
                </div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">right-click</span>
                    <div>
                      <h3>Choose a color</h3>
                      <p>Right-click or long-press the note to open its menu. Select any color from the grid. The note updates instantly.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">10 colors</span>
                    <div>
                      <h3>All ten colors adapt to contrast settings</h3>
                      <p>In Low or High Contrast mode, each color gets a matching muted or dark version. The palette stays recognizable.</p>
                    </div>
                  </Surface>
                </div>

                <div className="guide-section-label">Sticky context menu</div>
                <div className="guide-visual-row guide-visual-sticky-menu-row">
                  <div className="guide-visual-crop guide-visual-sticky-menu" aria-hidden="true">
                    <div className="gvc-menu gvc-menu-sticky">
                      <div className="gvc-menu-title">Sticky color</div>
                      <div className="gvc-menu-sticky-colors">
                        {['#ffd84d', '#ffb84d', '#c9363e', '#fff0d2', '#006456', '#0d56b3', '#6648b8', '#a93570', '#1e603d', '#343b4f'].map((color, index) => (
                          <span
                            key={color}
                            className={`gvc-menu-sticky-color${index === 6 ? ' is-selected' : ''}`}
                            style={{ background: color }}
                          >
                            {index === 6 && <Check size={10} strokeWidth={2.4} />}
                          </span>
                        ))}
                      </div>
                      <div className="gvc-menu-sticky-name">Violet</div>
                      <div className="gvc-menu-sep" />
                      <div className="gvc-menu-item gvc-menu-item-plain">Reset rotation</div>
                      <div className="gvc-menu-sep" />
                      <div className="gvc-menu-item gvc-menu-item-plain gvc-menu-item-danger">Delete this sticky…</div>
                    </div>
                  </div>
                  <div className="guide-visual-caption">
                    <span className="guide-card-index">right-click / long-press</span>
                    <h3>The Sticky context menu</h3>
                    <p>Open a note’s menu to change its color, reset its rotation, or delete an additional note. The original default note keeps the first two actions but does not show Delete this sticky….</p>
                  </div>
                </div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Choose one of ten colors</h3><p>Select a swatch from the color grid. A checkmark and color name show the current choice, and the note updates immediately.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Return the note upright</h3><p>Choose Reset rotation to set the note back to zero degrees without changing its text, color, size, or position.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Delete an additional note</h3><p>Choose Delete this sticky… to open a confirmation dialog. This action appears only for notes you added; the original default note cannot be deleted from this menu.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div><h3>Use the menu from the keyboard</h3><p>Use the Up and Down arrows to move through choices, Home or End to jump to the first or last item, Enter or Space to choose, and Escape to close the menu.</p></div>
                  </div>
                </div>

                <div className="guide-section-label">Add and remove notes</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">add</span>
                    <div>
                      <h3>Add a new note</h3>
                      <p>Select the plus icon in the top-right corner of any note. A fresh note appears on the desktop next to the current one.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">delete</span>
                    <div>
                      <h3>Remove a note</h3>
                        <p>Select the trash icon that appears next to the plus, or right-click and choose Delete this sticky…. A confirmation appears before the note is removed.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">stacking</span>
                    <div>
                      <h3>Notes stay below windows</h3>
                      <p>Stickies always appear above the desktop background and desktop icons, but below every open app window. Select a note to bring it forward among other notes.</p>
                    </div>
                  </Surface>
                </div>

                <div className="guide-callout">
                  <span className="guide-callout-label">small screens</span>
                  <p>On phones and small tablets, stickies are hidden automatically. They reappear when you return to a larger screen, right where you left them.</p>
                </div>
              </>
            )}

            {activeSection === 'dock' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / dock</SectionLabel>
                    <h2 className="settings-heading">The Dock</h2>
                    <p className="guide-intro">The Dock is your main app launcher. Select an icon to open or focus an app. A small mark below an icon means that app is already open.</p>
                  </div>
                </div>

                {/* Visual: dock anatomy */}
                <AnnotatedFrame
                  className="guide-visual-dock-demo"
                  cropClassName="gvc-dock-crop"
                  markers={[
                    { label: 'A', description: 'Active app — highlighted with a ring; its window is in front' },
                    { label: 'B', description: 'Open mark — app is running but not in front' },
                  ]}
                >
                    <div className="gvc-dock-bar">
                      {[
                        { cls: 'gvc-dock-about',    active: false, open: false },
                        { cls: 'gvc-dock-work',     active: true,  open: false },
                        { cls: 'gvc-dock-contact',  active: false, open: false },
                        { cls: 'gvc-dock-terminal', active: false, open: true },
                        { cls: 'gvc-dock-stickies', active: false, open: false },
                        { cls: 'gvc-dock-settings', active: false, open: false },
                        { cls: 'gvc-dock-guide',    active: false, open: false },
                      ].map((item, i) => (
                        <div key={i} className={`gvc-dock-item ${item.cls}${item.active ? ' gvc-dock-active' : ''}`}>
                          {item.active && <div className="gvc-dock-pill" />}
                          {item.open && <div className="gvc-dock-open-mark" />}
                          {item.active && <span className="gvc-dot-badge gvc-dock-marker gvc-dock-marker-active">A</span>}
                          {item.open && <span className="gvc-dot-badge gvc-dock-marker gvc-dock-marker-open">B</span>}
                        </div>
                      ))}
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Moving the Dock</div>

                {/* Visual: dock positions — self-contained grid, no overlapping labels */}
                <PositionGrid className="guide-visual-dock-positions">
                  {(['bottom', 'top', 'left', 'right'] as const).map((pos) => (
                    <PositionCell key={pos} position={pos}>
                      <div className={`gvc-mini-dock gvc-mini-dock-${pos}`} />
                    </PositionCell>
                  ))}
                </PositionGrid>

                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div>
                      <h3>Drag it to any edge</h3>
                      <p>Click and hold the Dock background (not an icon), then drag toward the top, bottom, left, or right edge of the screen. Release when the Dock snaps into place.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div>
                      <h3>Or use the right-click menu</h3>
                      <p>Right-click an empty part of the Dock. A small menu appears with the four edge options. Select the position you want.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div>
                      <h3>The desktop adjusts automatically</h3>
                      <p>Windows, sticky notes, and desktop icons shift to stay clear of wherever the Dock lands. Nothing gets hidden behind it.</p>
                    </div>
                  </div>
                </div>

                {/* Visual: context menu */}
                <div className="guide-visual-row">
                  <div className="guide-visual-crop guide-visual-dock-menu" aria-hidden="true">
                    <div className="gvc-menu">
                      <div className="gvc-menu-title">Dock position</div>
                      <div className="gvc-menu-sep" />
                      {['Top', 'Right', 'Bottom', 'Left'].map((label, i) => (
                        <div key={label} className={`gvc-menu-item${i === 2 ? ' gvc-menu-item-checked' : ''}`}>
                          {i === 2 && <span className="gvc-menu-check">&#10003;</span>}
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="guide-visual-caption">
                    <span className="guide-card-index">right-click</span>
                    <h3>The Dock context menu</h3>
                    <p>Right-click the Dock bar to see the position options. A checkmark shows the current position. Select any option to move the Dock immediately.</p>
                  </div>
                </div>

                <div className="guide-section-label">Useful details</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">labels</span>
                    <div>
                      <h3>Hover to see the app name</h3>
                      <p>On desktop, hold the pointer over a Dock icon to see a label. On touch screens, the label is always visible below each icon.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">open mark</span>
                    <div>
                      <h3>The mark follows the Dock edge</h3>
                      <p>When the Dock is at the bottom, the mark appears below each open icon. When the Dock is on a side, the mark appears on the inner edge facing the desktop.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">mobile</span>
                    <div>
                      <h3>Phones always use the bottom</h3>
                      <p>On small screens, the Dock is always pinned to the bottom edge and shows app names. You cannot reposition it on mobile.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">saved</span>
                    <div>
                      <h3>Position is remembered</h3>
                      <p>The Dock position is saved in this browser. If you drag it to the left, it will still be on the left the next time you open the page.</p>
                    </div>
                  </Surface>
                </div>
              </>
            )}

            {activeSection === 'systembar' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / system bar</SectionLabel>
                    <h2 className="settings-heading">The system bar</h2>
                    <p className="guide-intro">The system bar shows the time, status, and a few quick controls. It lives at the top by default, but you can move it to any edge just like the Dock.</p>
                  </div>
                </div>

                {/* Visual: system bar anatomy */}
                <AnnotatedFrame
                  className="guide-visual-sysbar-demo"
                  cropClassName="gvc-sysbar-crop"
                  markers={[
                    { label: 'A', description: 'Left side — logo, site name, and current location' },
                    { label: 'B', description: 'Right side — online status, quick icons, and clock' },
                  ]}
                >
                    <div className="gvc-sysbar">
                      <div className="gvc-sysbar-left">
                        <span className="gvc-sysbar-logo" />
                        <span className="gvc-sysbar-sep">|</span>
                        <span className="gvc-sysbar-mark">os-portfolio</span>
                        <span className="gvc-sysbar-sep">/</span>
                        <span className="gvc-sysbar-location">~ john</span>
                        <span className="gvc-dot-badge gvc-dot-inline" style={{ marginLeft: 6 }}>A</span>
                      </div>
                      <div className="gvc-sysbar-right">
                        <div className="gvc-sysbar-status">
                          <span className="gvc-sysbar-dot" />
                          <span className="gvc-sysbar-statustext">online</span>
                        </div>
                        <span className="gvc-sysbar-sep">|</span>
                        <div className="gvc-sysbar-icons">
                          <span className="gvc-sysbar-icon" />
                          <span className="gvc-sysbar-icon" />
                        </div>
                        <span className="gvc-sysbar-clock">10:42 am</span>
                        <span className="gvc-dot-badge gvc-dot-inline" style={{ marginLeft: 6 }}>B</span>
                      </div>
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Moving the system bar</div>

                {/* Visual: system bar positions — same contained grid pattern as Dock */}
                <PositionGrid className="guide-visual-sysbar-positions">
                  {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                    <PositionCell key={pos} position={pos}>
                      <div className={`gvc-mini-sysbar gvc-mini-sysbar-${pos}`} />
                    </PositionCell>
                  ))}
                </PositionGrid>

                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div>
                      <h3>Drag it to an edge</h3>
                      <p>Click and hold anywhere on the system bar background, then drag toward the edge you want. It snaps into place when you get close.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div>
                      <h3>Or right-click for a menu</h3>
                      <p>Right-click the system bar to open the position menu. Select Top, Bottom, Left, or Right. The bar moves immediately.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div>
                      <h3>Side placement compacts the bar</h3>
                      <p>When the system bar is on the left or right edge, it narrows to a 48px rail. The logo stays visible, the wordmark hides, and the clock and status stack vertically to fit.</p>
                    </div>
                  </div>
                </div>

                {/* Visual: side bar compact mode */}
                <div className="guide-visual-row">
                  <div className="guide-visual-crop guide-visual-sysbar-side" aria-hidden="true">
                    <div className="gvc-sysbar-rail">
                      <span className="gvc-sysbar-logo" />
                      <div className="gvc-sysbar-rail-sep" />
                      <div className="gvc-sysbar-rail-clock">
                        <span>10</span>
                        <span>42</span>
                        <span className="gvc-sysbar-rail-period">am</span>
                      </div>
                      <div className="gvc-sysbar-rail-sep" />
                      <div className="gvc-sysbar-rail-status">
                        <span className="gvc-sysbar-dot" />
                        <span className="gvc-sysbar-icon" />
                        <span className="gvc-sysbar-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="guide-visual-caption">
                    <span className="guide-card-index">side mode</span>
                    <h3>Compact rail on left or right</h3>
                    <p>When the bar is on a side, it becomes a narrow vertical column. The clock splits into hours and minutes. Status icons stack below. The wordmark disappears to save space.</p>
                  </div>
                </div>

                <div className="guide-section-label">Useful details</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">workspace</span>
                    <div>
                      <h3>The workspace shifts to clear the bar</h3>
                      <p>When you move the system bar, windows, stickies, and desktop icons automatically shift so nothing gets hidden behind the bar.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">mobile</span>
                    <div>
                      <h3>On small screens it is always at the top</h3>
                      <p>Phones and small tablets keep the system bar at the top regardless of the saved position. Your preference returns on a larger screen.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">saved</span>
                    <div>
                      <h3>Position is remembered per browser</h3>
                      <p>The position you choose is saved automatically. It will be the same the next time you open this portfolio in the same browser.</p>
                    </div>
                  </Surface>
                </div>
              </>
            )}

            {activeSection === 'terminal-guide' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / terminal</SectionLabel>
                    <h2 className="settings-heading">Terminal</h2>
                    <p className="guide-intro">The Terminal is a text-based window where you can explore this portfolio and change some desktop settings using short commands.</p>
                  </div>
                </div>

                {/* Visual: terminal anatomy */}
                <AnnotatedFrame
                  className="guide-visual-terminal-demo"
                  markers={[
                    { label: 'A', description: 'Prompt line — user, path, and your command' },
                    { label: 'B', description: 'Output — the result of the last command' },
                  ]}
                >
                    <div className="gvc-terminal">
                      <div className="gvc-terminal-header">
                        <span className="gvc-terminal-title">terminal</span>
                        <div className="gvc-win-controls" style={{ marginLeft: 'auto' }}>
                          <span className="gvc-win-btn gvc-win-min" />
                          <span className="gvc-win-btn gvc-win-max" />
                          <span className="gvc-win-btn gvc-win-close" />
                        </div>
                      </div>
                      <div className="gvc-terminal-body">
                        <div className="gvc-terminal-line">
                          <span className="gvc-terminal-prompt">john@portfolio</span>
                          <span className="gvc-terminal-path">~/work</span>
                          <span className="gvc-terminal-cmd"> ls</span>
                          <span className="gvc-dot-badge gvc-dot-inline" style={{ marginLeft: 6 }}>A</span>
                        </div>
                        <div className="gvc-terminal-output">
                          northstar-commerce-system.md<br />
                          signal-operations-platform.md
                          <span className="gvc-dot-badge gvc-dot-inline" style={{ marginLeft: 6 }}>B</span>
                        </div>
                        <div className="gvc-terminal-line gvc-terminal-line-active">
                          <span className="gvc-terminal-prompt">john@portfolio</span>
                          <span className="gvc-terminal-path">~/work</span>
                          <span className="gvc-terminal-cursor" />
                        </div>
                      </div>
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Getting started</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div>
                      <h3>Open the Terminal</h3>
                      <p>Select the Terminal icon in the Dock, on the desktop, or press <kbd>4</kbd>. The window opens with a command prompt ready.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div>
                      <h3>Type a command and press Enter</h3>
                      <p>Click the input line at the bottom of the terminal and type your command. Press Enter to run it. The result appears above.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div>
                      <h3>Use Tab to complete</h3>
                      <p>Press Tab while typing a command or path to auto-complete it. A grey suggestion appears as you type — press Tab or the right arrow to accept it.</p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div>
                      <h3>Scroll back through history</h3>
                      <p>Press the up arrow to recall the last command you ran. Press it again to go further back. Use the down arrow to move forward.</p>
                    </div>
                  </div>
                </div>

                <div className="guide-section-label">Common commands</div>
                <Surface elevation="flat" className="guide-shortcuts-panel guide-terminal-commands">
                  <div className="guide-shortcut-list" aria-label="Terminal commands">
                    {([
                      ['ls', 'List files and folders in the current directory'],
                      ['cd work', 'Go into the work directory'],
                      ['cat README.md', 'Print the contents of a file'],
                      ['open work', 'Open the Work window'],
                      ['close about', 'Close the About window'],
                      ['theme dark', 'Switch to dark mode'],
                      ['theme light', 'Switch to light mode'],
                      ['set high contrast on', 'Enable high contrast mode'],
                      ['history', 'Show the last commands you ran'],
                      ['clear', 'Clear the terminal output'],
                      ['help', 'List all available commands'],
                    ] as [string, string][]).map(([cmd, desc]) => (
                      <div className="guide-shortcut guide-terminal-command-row" key={cmd}>
                        <code className="guide-terminal-cmd-badge">{cmd}</code>
                        <span>{desc}</span>
                      </div>
                    ))}
                  </div>
                </Surface>

                <div className="guide-section-label">What the Terminal can and cannot do</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">can do</span>
                    <div>
                      <h3>Explore portfolio files</h3>
                      <p>Navigate directories with <code>cd</code>, list contents with <code>ls</code>, and read files with <code>cat</code>. The file tree reflects this portfolio.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">can do</span>
                    <div>
                      <h3>Control windows and settings</h3>
                      <p>Open and close windows, switch themes, toggle contrast, and adjust settings directly from the command line.</p>
                    </div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">cannot</span>
                    <div>
                      <h3>No access to your computer</h3>
                      <p>The Terminal is sandboxed to this page. It cannot see files on your computer, install software, or run any program outside this browser tab.</p>
                    </div>
                  </Surface>
                </div>

                <div className="guide-callout">
                  <span className="guide-callout-label">tip</span>
                  <p>Try <kbd>help</kbd> for the full command list, or click any of the example commands that appear below the welcome message when the Terminal first opens.</p>
                </div>
              </>
            )}

            {activeSection === 'customize' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / customize</SectionLabel>
                    <h2 className="settings-heading">Make the desktop yours</h2>
                    <p className="guide-intro">Open Settings from the Dock to change how the desktop looks, feels, and behaves. Your changes are saved in this browser as you make them.</p>
                  </div>
                </div>

                {/* Visual: settings window crop */}
                <AnnotatedFrame
                  className="guide-visual-customize"
                  cropClassName="gvc-settings-crop"
                  data-testid={"guide-visual-customize"}
                  markers={[
                    { label: 'A', description: 'Sidebar — choose Personalization or Accessibility' },
                    { label: 'B', description: 'Slider — drag to adjust a value' },
                    { label: 'C', description: 'Toggle — on/off for a single setting' },
                    { label: 'D', description: 'Save state / Reset desktop actions' },
                  ]}
                >
                    <div className="gvc-settings-win">
                      <div className="gvc-win-titlebar">
                        <span className="gvc-win-title-text">Settings</span>
                        <div className="gvc-win-controls">
                          <span className="gvc-win-btn gvc-win-min" />
                          <span className="gvc-win-btn gvc-win-max" />
                          <span className="gvc-win-btn gvc-win-close" />
                        </div>
                      </div>
                      <div className="gvc-settings-body">
                        {/* Nav sidebar */}
                        <div className="gvc-settings-nav">
                          <div className="gvc-settings-nav-item gvc-settings-nav-active">Personalization</div>
                          <div className="gvc-settings-nav-item">Accessibility</div>
                          <div className="gvc-settings-nav-item gvc-settings-nav-dim">About</div>
                          <span className="gvc-dot-badge" style={{ marginTop: 4 }}>A</span>
                        </div>
                        {/* Content */}
                        <div className="gvc-settings-content">
                          <div className="gvc-settings-heading-row">Personalization</div>
                          {/* Theme chips */}
                          <div className="gvc-settings-row">
                            <span className="gvc-settings-row-label">Theme</span>
                            <div className="gvc-settings-chips">
                              <span className="gvc-settings-chip gvc-chip-active">Light</span>
                              <span className="gvc-settings-chip">Dark</span>
                            </div>
                          </div>
                          {/* Open accordion: Surface effects */}
                          <div className="gvc-settings-accordion gvc-accordion-open">
                            <div className="gvc-accordion-header">
                              <span>Surface effects</span>
                              <span className="gvc-accordion-chevron gvc-chevron-open">&#9660;</span>
                            </div>
                            <div className="gvc-accordion-body">
                              <div className="gvc-settings-row">
                                <span className="gvc-settings-row-label">Transparency</span>
                                <div className="gvc-slider-track">
                                  <div className="gvc-slider-fill" style={{ width: '60%' }} />
                                  <div className="gvc-slider-thumb" style={{ left: '60%' }} />
                                </div>
                                <span className="gvc-dot-badge gvc-dot-inline">B</span>
                              </div>
                              <div className="gvc-settings-row">
                                <span className="gvc-settings-row-label">Blur</span>
                                <div className="gvc-toggle gvc-toggle-on">
                                  <div className="gvc-toggle-thumb" />
                                </div>
                                <span className="gvc-dot-badge gvc-dot-inline">C</span>
                              </div>
                            </div>
                          </div>
                          {/* Closed accordion */}
                          <div className="gvc-settings-accordion">
                            <div className="gvc-accordion-header">
                              <span>Wallpaper</span>
                              <span className="gvc-accordion-chevron">&#9654;</span>
                            </div>
                          </div>
                          {/* Save / Reset */}
                          <div className="gvc-settings-actions">
                            <button className="gvc-btn gvc-btn-primary">Save state</button>
                            <button className="gvc-btn gvc-btn-ghost">Reset desktop</button>
                            <span className="gvc-dot-badge gvc-dot-inline">D</span>
                          </div>
                        </div>
                      </div>
                    </div>
                </AnnotatedFrame>

                <div className="guide-section-label">Start here</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>Open Settings</h3><p>Select the gear in the Dock. On a smaller screen, open the menu first and then choose Settings.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>Choose a page</h3><p>Use Personalization for appearance and desktop text. Use Accessibility for visibility, movement, and contrast.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>Open a section</h3><p>Select a section name to show its controls. You can keep more than one section open while comparing settings.</p></div>
                  </div>
                </div>

                <div className="guide-section-label">Appearance</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Theme</span>
                    <div><h3>Choose light or dark mode</h3><p>Open Personalization, then Theme. Choose the option that is most comfortable to read.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Wallpaper</span>
                    <div><h3>Pick a background</h3><p>Choose Picture to use the desktop image, or Solid color for a plain background. Light and dark mode remember their own color choices.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Surface effects</span>
                    <div><h3>Change transparency and blur</h3><p>Use Window &amp; dock transparency for windows and the Dock. Sticky transparency only changes notes. If Window &amp; dock transparency is set to None, you cannot change Blur. Your blur setting stays saved and returns when you add transparency.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">04 / Desktop text</span>
                    <div><h3>Make the welcome message your own</h3><p>Edit the large heading, highlighted words, and short introduction. You can choose separate text colors for light and dark mode.</p></div>
                  </Surface>
                </div>

                <div className="guide-section-label">Comfort and readability</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Display</span>
                    <div><h3>Make controls easier to see</h3><p>Keep scrollbars visible when you want a clear sign that a page can scroll. Turn transparency off for solid surfaces, or turn blur off for a sharper background.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Motion</span>
                    <div><h3>Reduce movement</h3><p>Turn animations off, or choose a slower speed. This changes movement across windows, menus, and other controls.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Contrast</span>
                    <div><h3>Choose clearer colors</h3><p>Try Low contrast for a softer look or High contrast for stronger separation. Choose Standard to return to your wallpaper and usual colors.</p></div>
                  </Surface>
                </div>

                <div className="guide-section-label">Desktop layout</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Icons</span>
                    <div><h3>Line up desktop items</h3><p>Right-click an empty part of the desktop. Choose Clean up to tidy the current positions, or Auto arrange to keep items lined up automatically.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Dock</span>
                    <div><h3>Move the Dock</h3><p>Drag the Dock toward an edge of the screen. You can also right-click it and choose a position.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Save</span>
                    <div><h3>Keep a layout you like</h3><p>Choose Save state as default in Settings. This remembers your layout, open windows, theme, wallpaper, and other choices.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">04 / Reset</span>
                    <div><h3>Return to your saved layout</h3><p>Choose Reset desktop when you want to undo later changes. You will be asked to confirm before anything is reset.</p></div>
                  </Surface>
                </div>
              </>
            )}

            {activeSection === 'technical' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / tech notes</SectionLabel>
                    <h2 className="settings-heading">A desktop built in the browser</h2>
                    <p className="guide-intro">This desktop is a website that looks and behaves like a small operating system. These notes explain how it works and what it can—and cannot—do.</p>
                  </div>
                </div>

                {/* Visual: architecture + action flow */}
                <div className="guide-visual-full guide-visual-tech-arch" data-testid="guide-visual-tech" aria-hidden="true">
                  <div className="gvc-arch-row">
                    {/* Left panel: browser chrome + layer stack */}
                    <div className="gvc-arch-panel">
                      <div className="gvc-arch-panel-label">one browser tab</div>
                      <div className="gvc-arch-browser">
                        <div className="gvc-arch-browser-bar">
                          <span className="gvc-arch-browser-dot" />
                          <span className="gvc-arch-browser-dot" />
                          <span className="gvc-arch-browser-dot" />
                          <span className="gvc-arch-browser-url">os-portfolio</span>
                        </div>
                        <div className="gvc-arch-layers">
                          <div className="gvc-arch-layer gvc-arch-layer-react">React + TypeScript</div>
                          <div className="gvc-arch-arrow">&#8595;</div>
                          <div className="gvc-arch-layer gvc-arch-layer-css">CSS + Tailwind</div>
                          <div className="gvc-arch-arrow">&#8595;</div>
                          <div className="gvc-arch-layer gvc-arch-layer-storage">localStorage</div>
                        </div>
                      </div>
                    </div>

                    <div className="gvc-arch-divider" />

                    {/* Right panel: action flow */}
                    <div className="gvc-arch-panel">
                      <div className="gvc-arch-panel-label">what happens per action</div>
                      <div className="gvc-arch-flow">
                        <div className="gvc-arch-flow-step gvc-flow-user">01 — You act</div>
                        <div className="gvc-arch-flow-arrow">&#8595;</div>
                        <div className="gvc-arch-flow-step">02 — State updates</div>
                        <div className="gvc-arch-flow-arrow">&#8595;</div>
                        <div className="gvc-arch-flow-step">03 — React redraws</div>
                        <div className="gvc-arch-flow-arrow">&#8595;</div>
                        <div className="gvc-arch-flow-step gvc-flow-save">04 — Browser saves</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="guide-section-label">What runs the desktop</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Page</span>
                    <div><h3>Everything lives in one browser tab</h3><p>The desktop, windows, Dock, menus, Stickies, Settings, and this guide are all parts of one web page. Opening an app shows another part of that page.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Code</span>
                    <div><h3>React and TypeScript control what changes</h3><p>React updates the parts you can see. TypeScript helps keep window names, settings, and saved information consistent.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Style</span>
                    <div><h3>CSS controls the look and layout</h3><p>CSS sets colors, type, window sizes, movement, blur, shadows, and layouts for different screen sizes.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">04 / Saving</span>
                    <div><h3>The browser remembers your setup</h3><p>The browser saves window positions, theme, Dock placement, Stickies, and other choices on this device.</p></div>
                  </Surface>
                </div>
                <div className="guide-section-label">What happens when you use it</div>
                <div className="guide-step-list">
                  <div className="guide-step">
                    <span className="guide-step-number">01</span>
                    <div><h3>The browser receives your action</h3><p>You select, type, drag, or resize something. The browser sends that action to the page.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">02</span>
                    <div><h3>The page updates its information</h3><p>The desktop records what changed, such as the active window, a new position, or a different setting.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">03</span>
                    <div><h3>The screen changes</h3><p>React updates only the buttons, windows, text, or styles that need to change. The browser then draws the result.</p></div>
                  </div>
                  <div className="guide-step">
                    <span className="guide-step-number">04</span>
                    <div><h3>Your setup is saved</h3><p>Changes that should last are saved in the browser. When you return, the page uses that saved information to rebuild your desktop.</p></div>
                  </div>
                </div>
                <div className="guide-section-label">Limits to know</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Apps</span>
                    <div><h3>Windows are not separate programs</h3><p>Every app is part of the same page. Closing a window hides that part of the page; it does not quit a program on your computer.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Terminal</span>
                    <div><h3>The Terminal uses built-in commands</h3><p>It can explore this portfolio and change some desktop settings. It cannot view files on your computer, install software, or run other programs.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Storage</span>
                    <div><h3>Saved information stays in this browser</h3><p>Your setup does not automatically move to another browser, profile, or device. Private browsing may remove it when the private window closes.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">04 / Screens</span>
                    <div><h3>Small screens arrange windows for you</h3><p>Phones and tablets use a simpler layout that is easier to read and touch. Your larger-screen arrangement remains saved.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">05 / Browser</span>
                    <div><h3>Your browser controls some behavior</h3><p>Keyboard focus, touch, blur, transparency, and scrolling can look or work a little differently between browsers and devices.</p></div>
                  </Surface>
                </div>
                <div className="guide-section-label">What this means in practice</div>
                <dl className="guide-definition-list">
                  <div><dt>Clicking a window</dt><dd>Only changes the order of windows inside this page. It cannot move or control other browser tabs or programs.</dd></div>
                  <div><dt>Keyboard shortcuts</dt><dd>Work when the page can receive your keys. They pause while you type in a text box, and browser shortcuts may take priority.</dd></div>
                  <div><dt>Refreshing the page</dt><dd>Rebuilds the desktop and restores saved choices. Anything that was not saved may be lost.</dd></div>
                  <div><dt>Accessibility settings</dt><dd>May change movement, colors, scrollbars, transparency, and blur on purpose.</dd></div>
                  <div><dt>Security</dt><dd>The browser keeps this page separate from private files and unrelated programs on your computer.</dd></div>
                </dl>
                <div className="guide-callout">
                  <span className="guide-callout-label">important</span>
                  <p>Clearing site data, changing browser profiles, blocking storage, or using private browsing can remove your saved desktop.</p>
                </div>
              </>
            )}

            {activeSection === 'shortcuts' && (
              <>
                <div className="guide-page-header">
                  <div>
                    <SectionLabel className="section-kicker">user guide / shortcuts</SectionLabel>
                    <h2 className="settings-heading">Keyboard shortcuts</h2>
                    <p className="guide-intro">Use these keys when you want to move around the desktop without reaching for the pointer.</p>
                  </div>
                </div>

                {/* Visual: keyboard diagram */}
                <div className="guide-visual-full guide-visual-keyboard" data-testid="guide-visual-keyboard" aria-hidden="true">
                  <div className="gvc-kbd-section-label">Number keys</div>
                  <div className="gvc-kbd-number-row">
                    {[
                      ['1', 'About'],
                      ['2', 'Work'],
                      ['3', 'Contact'],
                      ['4', 'Terminal'],
                      ['5', 'Stickies'],
                      ['6', 'Shortcuts'],
                      ['7', 'Settings'],
                      ['8', 'Guide'],
                    ].map(([num, label]) => (
                      <div key={num} className="gvc-kbd-key-col">
                        <div className="gvc-kbd-key gvc-kbd-key-num">{num}</div>
                        <span className="gvc-kbd-key-label">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="gvc-kbd-section-label" style={{ marginTop: 16 }}>Modifier chords</div>
                  <div className="gvc-kbd-chord-rows">
                    <div className="gvc-kbd-chord-row">
                      <div className="gvc-kbd-chord-keys">
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Esc</span>
                      </div>
                      <span className="gvc-kbd-chord-desc">Close the front menu or dialog</span>
                    </div>
                    <div className="gvc-kbd-chord-row">
                      <div className="gvc-kbd-chord-keys">
                        <span className="gvc-kbd-key">&#8984;</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">&#8679;</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">X</span>
                      </div>
                      <span className="gvc-kbd-chord-desc">Close the front window <span className="gvc-kbd-os">Mac</span></span>
                    </div>
                    <div className="gvc-kbd-chord-row">
                      <div className="gvc-kbd-chord-keys">
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Ctrl</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Shift</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">X</span>
                      </div>
                      <span className="gvc-kbd-chord-desc">Close the front window <span className="gvc-kbd-os">Win / Linux</span></span>
                    </div>
                    <div className="gvc-kbd-chord-row">
                      <div className="gvc-kbd-chord-keys">
                        <span className="gvc-kbd-key">&#8984;</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">&#8997;</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">&#8679;</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">X</span>
                      </div>
                      <span className="gvc-kbd-chord-desc">Close all windows <span className="gvc-kbd-os">Mac</span></span>
                    </div>
                    <div className="gvc-kbd-chord-row">
                      <div className="gvc-kbd-chord-keys">
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Ctrl</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Alt</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key gvc-kbd-key-wide">Shift</span>
                        <span className="gvc-kbd-chord-plus">+</span>
                        <span className="gvc-kbd-key">X</span>
                      </div>
                      <span className="gvc-kbd-chord-desc">Close all windows <span className="gvc-kbd-os">Win / Linux</span></span>
                    </div>
                  </div>
                </div>

                <div className="guide-section-label">Before you start</div>
                <div className="guide-topic-list" role="list">
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">01 / Number keys</span>
                    <div><h3>Open or focus an app</h3><p>Press a number from <kbd>1</kbd> to <kbd>8</kbd>. If the app is closed, it opens. If it is already open, it comes forward or hides.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">02 / Typing</span>
                    <div><h3>Shortcuts pause in text boxes</h3><p>Number shortcuts do not run while you are typing in a field. Select the desktop or a window before trying the shortcut again.</p></div>
                  </Surface>
                  <Surface elevation="flat" className="guide-topic" role="listitem">
                    <span className="guide-card-index">03 / Escape</span>
                    <div><h3>Close a menu or message</h3><p>Press <kbd>Esc</kbd> to close the open menu or dialog without changing its action.</p></div>
                  </Surface>
                </div>
                <div className="guide-section-label">App numbers</div>
                <Surface elevation="flat" className="guide-shortcuts-panel">
                  <div className="guide-shortcut-list" aria-label="Keyboard shortcuts">
                  {[
                    ['1', 'About', 'Open the about window'],
                    ['2', 'Work', 'Open the work portfolio'],
                    ['3', 'Contact', 'Open the contact window'],
                    ['4', 'Terminal', 'Open the terminal'],
                    ['5', 'Stickies', 'Show or focus Stickies'],
                    ['6', 'Shortcuts', 'Open the shortcut menu'],
                    ['7', 'Settings', 'Open Settings'],
                    ['8', 'Guide', 'Open this user guide'],
                  ].map(([key, label, description]) => (
                    <div className="guide-shortcut" key={key}>
                      <kbd>{key}</kbd>
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </div>
                  ))}
                  </div>
                </Surface>
                <div className="guide-callout">
                  <span className="guide-callout-label">close windows</span>
                  <p>On a Mac, press <kbd>&#8984;</kbd> <kbd>&#8679;</kbd> <kbd>X</kbd> to close the front window. On Windows or Linux, use <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>X</kbd>. Add <kbd>&#8997;</kbd> on Mac or <kbd>Alt</kbd> on Windows and Linux to close every open window.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

type ShellNode = { type: 'directory' } | { type: 'file'; content: string };
type ShellEntry = { id: number; cwd: string; command: string; output?: string; error?: boolean };

const shellFiles: Record<string, ShellNode> = {
  '/': { type: 'directory' },
  '/home': { type: 'directory' },
  '/home/john': { type: 'directory' },
  '/home/john/README.md': { type: 'file', content: 'John Doe\nA product-minded designer making things feel clear, capable, and a little more human.\n\nTry: ls, cd work, cat README.md, open work' },
  '/home/john/about': { type: 'directory' },
  '/home/john/about/bio.txt': { type: 'file', content: 'Design systems designer, product thinker, and detail obsessive. I turn complex systems into clear, capable interfaces.' },
  '/home/john/about/skills.txt': { type: 'file', content: 'TypeScript  React  CSS systems  Node.js  Postgres  Figma  Playwright' },
  '/home/john/work': { type: 'directory' },
  '/home/john/work/northstar-commerce-system.md': { type: 'file', content: 'Northstar Commerce System\nA flexible foundation that helped a growing commerce team ship consistent storefront and account experiences.\n2024 — 2025' },
  '/home/john/work/signal-operations-platform.md': { type: 'file', content: 'Signal Operations Platform\nA focused operations language for teams coordinating alerts, handoffs, and high-stakes daily work.\n2023 — 2024' },
  '/home/john/work/mosaic-health-toolkit.md': { type: 'file', content: 'Mosaic Health Toolkit\nAn accessible toolkit for designing clear, reassuring health journeys across devices and contexts.\n2022 — 2023' },
  '/home/john/work/fieldnote-collaboration-kit.md': { type: 'file', content: 'Fieldnote Collaboration Kit\nA lightweight collaboration system that helped distributed teams turn observations into shared decisions.\n2021 — 2022' },
  '/home/john/contact': { type: 'directory' },
  '/home/john/contact/contact.txt': { type: 'file', content: 'Email: hello@johndoe.design\nStatus: Open to thoughtful product partnerships.' },
};

const shellCommands = ['help', 'ls', 'pwd', 'cd', 'cat', 'open', 'close', 'theme', 'set', 'history', 'whoami', 'date', 'echo', 'clear', 'exit'];
const shellExamples = ['ls', 'cd work', 'cat ~/work/northstar-commerce-system.md', 'open work', 'theme light', 'set high contrast on', 'history', 'clear'];
const shellContrastOptions = ['high contrast on', 'high contrast off', 'low contrast on', 'low contrast off', 'standard on'];
const shellArgumentOptions: Partial<Record<string, string[]>> = {
  open: ['about', 'work', 'contact', 'terminal'],
  close: ['about', 'work', 'contact', 'terminal', 'all'],
  theme: ['light', 'dark'],
};

function normalizeShellPath(cwd: string, target = '~') {
  const home = '/home/john';
  const expanded = target.startsWith('~') ? `${home}${target.slice(1)}` : target;
  const source = expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`;
  const parts: string[] = [];
  for (const part of source.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return `/${parts.join('/')}` || '/';
}

function displayShellPath(path: string) {
  if (path === '/home/john') return '~';
  if (path.startsWith('/home/john/')) return `~${path.slice('/home/john'.length)}`;
  return path;
}

function listShellDirectory(path: string) {
  const prefix = path === '/' ? '/' : `${path}/`;
  return Object.keys(shellFiles)
    .filter((candidate) => candidate.startsWith(prefix) && candidate !== path)
    .map((candidate) => candidate.slice(prefix.length).split('/')[0])
    .filter((name, index, names) => name && names.indexOf(name) === index)
    .sort();
}

function predictShellCommand(input: string, cwd: string) {
  const leadingWhitespace = input.match(/^\s*/)?.[0] ?? '';
  const value = input.slice(leadingWhitespace.length);
  if (!value) return '';

  const parts = value.split(/\s+/);
  const verb = parts[0]?.toLowerCase() ?? '';
  if (parts.length === 1 && !value.endsWith(' ')) {
    const match = shellCommands.find((item) => item.startsWith(verb));
    if (!match) return '';
    return `${leadingWhitespace}${match}${match === verb ? ' ' : ''}`;
  }

  const token = value.endsWith(' ') ? '' : parts.at(-1) ?? '';
  const commandPrefix = value.slice(0, value.length - token.length);
  if (verb === 'set') {
    const argumentInput = value.slice(verb.length).trimStart().toLowerCase();
    const match = shellContrastOptions.find((item) => item.startsWith(argumentInput));
    return match ? `${leadingWhitespace}set ${match}` : '';
  }
  const argumentOptions = shellArgumentOptions[verb];
  if (argumentOptions) {
    const match = argumentOptions.find((item) => item.startsWith(token.toLowerCase()));
    return match ? `${leadingWhitespace}${commandPrefix}${match}` : '';
  }

  if (!['ls', 'cd', 'cat'].includes(verb)) return '';
  const slash = token.lastIndexOf('/');
  const parentToken = slash >= 0 ? token.slice(0, slash + 1) : '';
  const fragment = slash >= 0 ? token.slice(slash + 1) : token;
  const parentPath = normalizeShellPath(cwd, parentToken || '.');
  const match = listShellDirectory(parentPath).find((name) => name.startsWith(fragment));
  if (!match) return '';
  const completedPath = normalizeShellPath(parentPath, match);
  const suffix = shellFiles[completedPath]?.type === 'directory' ? '/' : '';
  return `${leadingWhitespace}${commandPrefix}${parentToken}${match}${suffix}`;
}

function TerminalWindow({
  onOpenWindow,
  onCloseWindow,
  onSetTheme,
  onSetContrastTheme,
  openWindows,
  currentTheme,
  contrastTheme,
  ...props
}: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'> & {
  onOpenWindow: (id: WindowId) => void;
  onCloseWindow: (id: WindowId) => void;
  onSetTheme: (theme: Theme) => void;
  onSetContrastTheme: (contrastTheme: ContrastTheme) => void;
  openWindows: WindowState;
  currentTheme: Theme;
  contrastTheme: ContrastTheme;
}) {
  const [command, setCommand] = useState('');
  const [entries, setEntries] = useState<ShellEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [cwd, setCwd] = useState('/home/john');
  const [previousCwd, setPreviousCwd] = useState('/home/john');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(1);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries, cwd]);

  const appendEntry = (raw: string, output?: string, error = false, entryCwd = cwd) => {
    setEntries((current) => [...current, { id: nextEntryId.current++, cwd: entryCwd, command: raw, output, error }]);
  };

  const insertCommand = (example: string) => {
    setCommand(example);
    setHistoryIndex(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const predictedCommand = predictShellCommand(command, cwd);

  const completeCommand = () => {
    if (predictedCommand && predictedCommand !== command) {
      setCommand(predictedCommand);
      setHistoryIndex(null);
    }
  };

  const submitCommand = (event: FormEvent) => {
    event.preventDefault();
    const raw = command.trim();
    if (!raw) return;
    const [rawVerb, ...rawArgs] = raw.split(/\s+/);
    const verb = rawVerb.toLowerCase();
    const args = rawArgs.join(' ');
    const entryCwd = cwd;
    const nextHistory = [...commandHistory, raw];
    setCommandHistory(nextHistory);
    setHistoryIndex(null);
    setCommand('');

    if (verb === 'exit') {
      props.onClose();
      return;
    }
    if (verb === 'clear') {
      setEntries([]);
      return;
    }
    if (verb === 'help') {
      appendEntry(raw, 'Filesystem\n  ls [path]       list files\n  pwd             print current directory\n  cd [path]       change directory (cd - returns)\n  cat <file>      read a file\n\nSite controls\n  open <name>     open about, work, contact, or terminal\n  close <name>    close a window (or: close all)\n  theme <mode>    switch light or dark theme in Standard mode\n  set high contrast on|off\n  set low contrast on|off\n  set standard on\n\nShell\n  history         show command history\n  whoami          identify the current user\n  date            show local date and time\n  echo <text>     print text\n  clear           clear terminal output\n  exit            close the terminal\n\nUse ↑/↓ for history and Tab to complete commands or paths.');
      return;
    }
    if (verb === 'pwd') {
      appendEntry(raw, cwd);
      return;
    }
    if (verb === 'ls') {
      const path = normalizeShellPath(cwd, args || '.');
      const node = shellFiles[path];
      if (!node) appendEntry(raw, `ls: cannot access '${args || '.'}': No such file or directory`, true);
      else if (node.type !== 'directory') appendEntry(raw, path.split('/').pop());
      else appendEntry(raw, listShellDirectory(path).map((name) => shellFiles[normalizeShellPath(path, name)]?.type === 'directory' ? `${name}/` : name).join('   ') || '(empty)');
      return;
    }
    if (verb === 'cd') {
      const target = args === '-' ? previousCwd : normalizeShellPath(cwd, args || '~');
      const node = shellFiles[target];
      if (!node) appendEntry(raw, `cd: ${args || '~'}: No such file or directory`, true);
      else if (node.type !== 'directory') appendEntry(raw, `cd: ${args}: Not a directory`, true);
      else if (target === cwd) appendEntry(raw, `Already in ${displayShellPath(target)}.`);
      else {
        appendEntry(raw, args === '-' ? displayShellPath(target) : undefined, false, entryCwd);
        setPreviousCwd(cwd);
        setCwd(target);
      }
      return;
    }
    if (verb === 'cat') {
      if (!args) {
        appendEntry(raw, 'cat: missing file operand', true);
        return;
      }
      const path = normalizeShellPath(cwd, args);
      const node = shellFiles[path];
      if (!node) appendEntry(raw, `cat: ${args}: No such file or directory`, true);
      else if (node.type === 'directory') appendEntry(raw, `cat: ${args}: Is a directory`, true);
      else appendEntry(raw, node.content);
      return;
    }
    if (verb === 'open' || verb === 'close') {
      const target = rawArgs[0]?.toLowerCase();
      const validWindows: WindowId[] = ['about', 'work', 'contact', 'terminal'];
      if (verb === 'close' && target === 'all') {
        const openPortfolioWindows = (['about', 'work', 'contact'] as WindowId[]).filter((id) => openWindows[id]);
        if (!openPortfolioWindows.length) appendEntry(raw, 'All portfolio windows are already closed.');
        else {
          openPortfolioWindows.forEach(onCloseWindow);
          appendEntry(raw, 'Closed all portfolio windows.');
        }
      } else if (!validWindows.includes(target as WindowId)) {
        appendEntry(raw, `${verb}: expected about, work, contact, terminal${verb === 'close' ? ', or all' : ''}`, true);
      } else if (verb === 'open' && openWindows[target as WindowId]) {
        appendEntry(raw, `${target} is already open.`);
      } else if (verb === 'close' && !openWindows[target as WindowId]) {
        appendEntry(raw, `${target} is already closed.`);
      } else {
        if (verb === 'open') onOpenWindow(target as WindowId);
        else if (target === 'terminal') props.onClose();
        else onCloseWindow(target as WindowId);
        appendEntry(raw, `${verb === 'open' ? 'Opened' : 'Closed'} ${target}.`);
      }
      return;
    }
    if (verb === 'theme') {
      const mode = rawArgs[0]?.toLowerCase();
      if (mode !== 'light' && mode !== 'dark') appendEntry(raw, 'theme: expected light or dark', true);
      else if (contrastTheme !== 'none') appendEntry(raw, 'Light and dark themes are disabled while a contrast theme is active.');
      else if (mode === currentTheme) appendEntry(raw, `${mode} theme is already active.`);
      else {
        onSetTheme(mode);
        appendEntry(raw, `Theme changed to ${mode}.`);
      }
      return;
    }
    if (verb === 'set') {
      const setting = rawArgs.join(' ').toLowerCase();
      if (setting === 'high contrast on') {
        onSetContrastTheme('high');
        appendEntry(raw, 'High Contrast turned on.');
      } else if (setting === 'low contrast on') {
        onSetContrastTheme('low');
        appendEntry(raw, 'Low Contrast turned on.');
      } else if (setting === 'standard on' || setting === 'high contrast off' || setting === 'low contrast off') {
        onSetContrastTheme('none');
        appendEntry(raw, 'Standard theme restored.');
      } else {
        appendEntry(raw, 'set: expected high contrast on|off, low contrast on|off, or standard on', true);
      }
      return;
    }
    if (verb === 'history') {
      appendEntry(raw, nextHistory.map((item, index) => `${String(index + 1).padStart(3, ' ')}  ${item}`).join('\n'));
      return;
    }
    if (verb === 'whoami') {
      appendEntry(raw, 'john');
      return;
    }
    if (verb === 'date') {
      appendEntry(raw, new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(new Date()));
      return;
    }
    if (verb === 'echo') {
      appendEntry(raw, rawArgs.join(' '));
      return;
    }
    appendEntry(raw, `${rawVerb}: command not found. Type 'help' for available commands.`, true);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      completeCommand();
      return;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (!commandHistory.length) return;
    if (event.key === 'ArrowUp') {
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);
    } else {
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <WindowFrame {...props} id="terminal" title="Terminal">
      <div ref={bodyRef} className="window-body terminal-body" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-line"><span className="terminal-prompt">john@portfolio:~$</span><span className="terminal-command">whoami</span></div>
        <div className="terminal-output">john doe / design systems designer{'\n'}building thoughtful interfaces and resilient systems.</div>
        <div className="terminal-output terminal-hint">type "help" to explore. use ↑/↓ for history and Tab to complete.</div>
        {entries.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            <div className="terminal-line"><span className="terminal-prompt">john@portfolio:{displayShellPath(entry.cwd)}$</span><span className="terminal-command">{entry.command}</span></div>
            {entry.output && <div className={`terminal-output ${entry.error ? 'terminal-error' : ''}`} onPointerDown={(event) => event.stopPropagation()}>{entry.output}</div>}
            {entry.command.toLowerCase() === 'help' && (
              <div className="terminal-examples" aria-label="Example terminal commands">
                <span>click to paste:</span>
                {shellExamples.map((example) => <button type="button" key={example} onClick={() => insertCommand(example)}>{example}</button>)}
              </div>
            )}
          </div>
        ))}
        <form className="terminal-form" onSubmit={submitCommand}>
          <span className="terminal-prompt">john@portfolio:{displayShellPath(cwd)}$</span>
          <div className="terminal-input-group">
            <input ref={inputRef} className="terminal-input" value={command} onChange={(event) => { setCommand(event.target.value); setHistoryIndex(null); }} onKeyDown={handleInputKeyDown} aria-label="Terminal command" aria-describedby="terminal-prediction" placeholder="type a command" data-testid="input-terminal-command" autoComplete="off" spellCheck={false} />
            <span id="terminal-prediction" className="terminal-prediction" aria-live="polite" data-testid="terminal-prediction">
              {predictedCommand && predictedCommand !== command ? <><kbd>Tab</kbd><span aria-hidden="true"> → </span>{predictedCommand}</> : null}
            </span>
          </div>
        </form>
      </div>
    </WindowFrame>
  );
}

function DesktopFolder({
  id,
  label,
  open,
  onToggle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  style,
  appIcon,
  singleTap,
}: {
  id: DesktopLauncherId;
  label: string;
  open: boolean;
  onToggle: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  appIcon?: ReactNode;
  singleTap: boolean;
}) {
  const action = `${singleTap ? 'Tap' : 'Double-click'} to ${open ? 'focus' : 'open'} ${label}`;
  return (
    <DesktopLauncher
      className={`desktop-folder desktop-launcher-${id} ${appIcon ? 'desktop-app' : ''} ${open ? 'is-open' : ''}`}
      open={open}
      onClick={singleTap ? onToggle : undefined}
      onDoubleClick={singleTap ? undefined : onToggle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDragStart={(event) => event.preventDefault()}
      style={style}
      aria-pressed={open}
      aria-label={`${action} ${appIcon ? 'application' : 'folder'}`}
      data-draggable-item
      data-testid={`button-folder-${id}`}
    >
      {appIcon
        ? <span className="desktop-app-icon" aria-hidden="true">{appIcon}</span>
        : <span className="desktop-folder-icon" aria-hidden="true" />}
      <span className="desktop-folder-label">{label}</span>
      <span className="desktop-icon-tooltip" aria-hidden="true">{action}</span>
    </DesktopLauncher>
  );
}

// Compute desktop wallpaper background style
function desktopBackground(theme: Theme, wallpaperLight: WallpaperConfig, wallpaperDark: WallpaperConfig, contrastTheme: ContrastTheme): React.CSSProperties {
  // Contrast themes override wallpaper
  if (contrastTheme === 'high') return { backgroundColor: '#000000', backgroundImage: 'none' };
  if (contrastTheme === 'low') return { backgroundColor: '#282a38', backgroundImage: 'none' };

  const config = theme === 'light' ? wallpaperLight : wallpaperDark;
  if (config.mode === 'color') {
    return {
      backgroundColor: config.color,
      backgroundImage: 'none',
    };
  }
  const src = theme === 'light' ? './wallpaper-light.jpg' : './wallpaper-dark.jpg';
  return {
    backgroundColor: 'transparent',
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

function Home() {
  const [savedDesktopState] = useState(loadDesktopState);
  const [resetDesktopState, setResetDesktopState] = useState(() => loadDesktopState(DESKTOP_DEFAULT_STORAGE_KEY));
  const [storageUnavailable, setStorageUnavailable] = useState(storageUnavailableDuringLoad);
  const [storageRestored, setStorageRestored] = useState(false);
  const [storageHelpOpen, setStorageHelpOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState>(initialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId>('about');
  const [windowStack, setWindowStack] = useState<WindowId[]>(savedDesktopState.windowStack ?? defaultDesktopState.windowStack ?? []);
  const [clock, setClock] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const shortcutMenuRef = useRef<HTMLDivElement | null>(null);
  const [stickyVisible, setStickyVisible] = useState(true);
  const [stickyOnTop, setStickyOnTop] = useState(false);
  const [maximizedWindows, setMaximizedWindows] = useState<Partial<Record<WindowId, boolean>>>({});
  const [activeStickyId, setActiveStickyId] = useState<StickyItemId>('sticky');
  const [stickies, setStickies] = useState<StickyData[]>(savedDesktopState.stickies);
  const [dragPositions, setDragPositions] = useState<ItemPositions>(savedDesktopState.itemPositions);
  const [itemSizes, setItemSizes] = useState<ItemSizes>(savedDesktopState.itemSizes);
  const [folderPositions, setFolderPositions] = useState<FolderPositions>(savedDesktopState.folderPositions);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: 'desktop' | 'dock' | 'system-bar' } | null>(null);
  const [stickyMenu, setStickyMenu] = useState<{ x: number; y: number; id: StickyItemId } | null>(null);
  const [stickyPendingDelete, setStickyPendingDelete] = useState<StickyItemId | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [saveDefaultDialogOpen, setSaveDefaultDialogOpen] = useState(false);
  const [defaultStateSaved, setDefaultStateSaved] = useState(false);
  const [iconSize, setIconSize] = useState<IconSize>(savedDesktopState.iconSize);
  const [snapToGrid, setSnapToGrid] = useState(savedDesktopState.snapToGrid);
  const [theme, setTheme] = useState<Theme>(savedDesktopState.theme);
  const [showDesktopIcons, setShowDesktopIcons] = useState(savedDesktopState.showDesktopIcons);
  const [dockPosition, setDockPosition] = useState<DockPosition>(savedDesktopState.dockPosition);
  const [systemBarPosition, setSystemBarPosition] = useState<DockPosition>(savedDesktopState.systemBarPosition);
  const [viewportProfile, setViewportProfile] = useState<ViewportProfile>(readViewportProfile);
  const [coarsePointer, setCoarsePointer] = useState(() => window.matchMedia('(pointer: coarse)').matches);
  const [wallpaperLight, setWallpaperLight] = useState<WallpaperConfig>(savedDesktopState.wallpaperLight ?? DEFAULT_WALLPAPER_LIGHT);
  const [wallpaperDark, setWallpaperDark] = useState<WallpaperConfig>(savedDesktopState.wallpaperDark ?? DEFAULT_WALLPAPER_DARK);
  const [accessibility, setAccessibility] = useState<AccessibilityPrefs>(savedDesktopState.accessibility ?? DEFAULT_ACCESSIBILITY_PREFS);
  const setRegularTheme = (nextTheme: Theme) => {
    if (accessibility.contrastTheme === 'none') setTheme(nextTheme);
  };
  const setContrastTheme = (contrastTheme: ContrastTheme) => {
    setAccessibility((current) => ({ ...current, contrastTheme }));
  };
  const [introCustomization, setIntroCustomization] = useState<IntroCustomization>(savedDesktopState.introCustomization ?? DEFAULT_INTRO_CUSTOMIZATION);
  const [automaticIntroColors, setAutomaticIntroColors] = useState<Partial<Record<IntroTextKey, string>>>({});

  const desktopAreaRef = useRef<HTMLDivElement>(null);
  const introPrimaryRef = useRef<HTMLSpanElement>(null);
  const introAccentRef = useRef<HTMLElement>(null);
  const introBodyRef = useRef<HTMLParagraphElement>(null);
  const contextMenuOpenerRef = useRef<HTMLElement | null>(null);
  const previousMenuOpenRef = useRef(false);
  const deleteDialogRef = useRef<HTMLElement>(null);
  const resetDialogRef = useRef<HTMLElement>(null);
  const saveDefaultDialogRef = useRef<HTMLElement>(null);
  const deleteDialogOpenerRef = useRef<HTMLElement | null>(null);
  const resetDialogOpenerRef = useRef<HTMLElement | null>(null);
  const saveDefaultDialogOpenerRef = useRef<HTMLElement | null>(null);
  const dockDragRef = useRef<{ active: boolean; startX: number; startY: number; moved: boolean } | null>(null);
  const systemBarDragRef = useRef<{ active: boolean; startX: number; startY: number; moved: boolean } | null>(null);
  const desktopGeometryRef = useRef({
    dragPositions: savedDesktopState.itemPositions,
    itemSizes: savedDesktopState.itemSizes,
    folderPositions: savedDesktopState.folderPositions,
  });
  const { deviceMode, orientation, workspaceMode } = viewportProfile;
  const previousWorkspaceModeRef = useRef(workspaceMode);
  const managedLayout = workspaceMode === 'managed';
  const effectiveDockPosition: DockPosition = workspaceMode === 'desktop' && !coarsePointer ? dockPosition : 'bottom';
  const effectiveSystemBarPosition: DockPosition = workspaceMode === 'desktop' && !coarsePointer ? systemBarPosition : 'top';
  const singleTapLaunch = workspaceMode !== 'desktop' || coarsePointer;

  useEffect(() => {
    const suppressNativeContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener('contextmenu', suppressNativeContextMenu, { capture: true });
    return () => {
      document.removeEventListener('contextmenu', suppressNativeContextMenu, { capture: true });
    };
  }, []);

  // Apply accessibility data-attributes to document root
  useEffect(() => {
    const root = document.documentElement;
    const contrastActive = accessibility.contrastTheme !== 'none';
    // Scrollbars
    if (accessibility.alwaysShowScrollbars) {
      root.setAttribute('data-always-scrollbars', '');
    } else {
      root.removeAttribute('data-always-scrollbars');
    }
    // Transparency
    if (contrastActive || !accessibility.windowTransparency) {
      root.setAttribute('data-no-transparency', '');
      root.removeAttribute('data-transparency-enabled');
      root.style.removeProperty('--accessibility-transparency');
      root.style.removeProperty('--sticky-transparency');
    } else {
      root.removeAttribute('data-no-transparency');
      root.setAttribute('data-transparency-enabled', '');
      root.style.setProperty('--accessibility-transparency', `${accessibility.transparencyLevel}%`);
      root.style.setProperty('--sticky-transparency', `${accessibility.stickyTransparencyLevel}%`);
    }
    // Blur
    if (contrastActive || !accessibility.windowTransparency || !accessibility.blurEffects) {
      root.setAttribute('data-no-blur', '');
      root.removeAttribute('data-blur-enabled');
      root.style.removeProperty('--surface-blur');
    } else {
      root.removeAttribute('data-no-blur');
      root.setAttribute('data-blur-enabled', '');
      root.style.setProperty('--surface-blur', `${accessibility.blurLevel}px`);
    }
    // Animations
    root.removeAttribute('data-anim-speed');
    if (contrastActive || !accessibility.uiAnimations) {
      root.setAttribute('data-no-animations', '');
    } else {
      root.removeAttribute('data-no-animations');
      // Speed
      if (accessibility.animationSpeed !== 'default') {
        root.setAttribute('data-anim-speed', accessibility.animationSpeed);
      }
    }
    if (contrastActive || (!accessibility.uiAnimations && !accessibility.windowTransparency)) {
      root.setAttribute('data-fast-ui', '');
    } else {
      root.removeAttribute('data-fast-ui');
    }
    // Contrast theme
    root.removeAttribute('data-contrast');
    if (accessibility.contrastTheme !== 'none') {
      root.setAttribute('data-contrast', accessibility.contrastTheme);
    }
  }, [accessibility]);

  useEffect(() => {
    const wallpaper = theme === 'light' ? wallpaperLight : wallpaperDark;
    const enabled = introCustomization.automaticContrast;
    if (!enabled) {
      setAutomaticIntroColors({});
      return;
    }

    const image = new Image();
    let cancelled = false;
    let frame = 0;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const elements: Record<IntroTextKey, React.RefObject<HTMLElement | null>> = {
      primary: introPrimaryRef,
      accent: introAccentRef,
      body: introBodyRef,
    };

    const luminance = (red: number, green: number, blue: number) => {
      const linear = [red, green, blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const contrast = (first: number, second: number) => (
      (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
    );
    const brandedCandidates = [
      { color: '#111326', luminance: luminance(17, 19, 38) },
      { color: '#f7faf8', luminance: luminance(247, 250, 248) },
    ];
    const fallbackCandidates = [
      { color: '#000000', luminance: 0 },
      { color: '#ffffff', luminance: 1 },
    ];
    const selectAccessibleColor = (backgroundLuminances: number[]) => {
      const rank = (candidates: typeof brandedCandidates) => candidates
        .map((candidate) => {
          const ratios = backgroundLuminances
            .map((background) => contrast(candidate.luminance, background))
            .sort((a, b) => a - b);
          return {
            color: candidate.color,
            score: ratios[Math.floor(ratios.length * 0.2)] ?? 0,
          };
        })
        .sort((first, second) => second.score - first.score);
      const branded = rank(brandedCandidates)[0];
      if (branded.score >= 7) return branded.color;
      const fallback = rank(fallbackCandidates)[0];
      if (fallback.score >= 7) return fallback.color;
      return theme === 'dark' ? '#ffffff' : '#000000';
    };
    const solidBackground = accessibility.contrastTheme === 'high'
      ? '#000000'
      : accessibility.contrastTheme === 'low'
        ? '#282a38'
        : wallpaper.mode === 'color'
          ? wallpaper.color
          : null;
    if (solidBackground) {
      const channels = solidBackground.match(/[0-9a-f]{2}/gi)?.map((channel) => Number.parseInt(channel, 16));
      const backgroundLuminance = luminance(channels?.[0] ?? 0, channels?.[1] ?? 0, channels?.[2] ?? 0);
      const selected = selectAccessibleColor([backgroundLuminance]);
      setAutomaticIntroColors({ primary: selected, accent: selected, body: selected });
      return;
    }

    const analyze = () => {
      if (cancelled || !context || !image.naturalWidth || !image.naturalHeight) return;
      const shell = document.querySelector<HTMLElement>('.osp-shell');
      if (!shell) return;
      const shellRect = shell.getBoundingClientRect();
      const scale = Math.max(shellRect.width / image.naturalWidth, shellRect.height / image.naturalHeight);
      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;
      const offsetX = shellRect.left + (shellRect.width - renderedWidth) / 2;
      const offsetY = shellRect.top + (shellRect.height - renderedHeight) / 2;
      const next: Partial<Record<IntroTextKey, string>> = {};

      (Object.keys(elements) as IntroTextKey[]).forEach((key) => {
        const element = elements[key].current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const backgroundLuminances: number[] = [];
        for (let row = 0; row < 5; row += 1) {
          for (let column = 0; column < 5; column += 1) {
            const viewportX = rect.left + rect.width * ((column + 0.5) / 5);
            const viewportY = rect.top + rect.height * ((row + 0.5) / 5);
            const sourceX = Math.max(0, Math.min(image.naturalWidth - 1, Math.floor((viewportX - offsetX) / scale)));
            const sourceY = Math.max(0, Math.min(image.naturalHeight - 1, Math.floor((viewportY - offsetY) / scale)));
            const pixel = context.getImageData(sourceX, sourceY, 1, 1).data;
            backgroundLuminances.push(luminance(pixel[0], pixel[1], pixel[2]));
          }
        }
        next[key] = selectAccessibleColor(backgroundLuminances);
      });
      setAutomaticIntroColors(next);
    };
    const scheduleAnalysis = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(analyze);
    };

    image.onload = () => {
      if (cancelled || !context) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      scheduleAnalysis();
    };
    image.src = theme === 'light' ? './wallpaper-light.jpg' : './wallpaper-dark.jpg';
    window.addEventListener('resize', scheduleAnalysis);
    const observer = new ResizeObserver(scheduleAnalysis);
    Object.values(elements).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    if (desktopAreaRef.current) observer.observe(desktopAreaRef.current);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleAnalysis);
      observer.disconnect();
      image.onload = null;
    };
  }, [
    accessibility.contrastTheme,
    introCustomization.automaticContrast,
    introCustomization.text,
    systemBarPosition,
    theme,
    wallpaperDark,
    wallpaperLight,
    workspaceMode,
  ]);

  const getCurrentDesktopState = (): SavedDesktopState => ({
    folderPositions: workspaceMode === 'desktop' ? folderPositions : desktopGeometryRef.current.folderPositions,
    itemPositions: workspaceMode === 'desktop' ? dragPositions : desktopGeometryRef.current.dragPositions,
    itemSizes: workspaceMode === 'desktop' ? itemSizes : desktopGeometryRef.current.itemSizes,
    iconSize,
    snapToGrid,
    theme,
    showDesktopIcons,
    stickies,
    dockPosition,
    systemBarPosition,
    wallpaperLight,
    wallpaperDark,
    accessibility,
    introCustomization,
  });

  const retryDesktopSave = () => {
    try {
      window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(getCurrentDesktopState()));
      setStorageUnavailable(false);
      setStorageRestored(true);
      setStorageHelpOpen(false);
    } catch {
      setStorageUnavailable(true);
      setStorageRestored(false);
    }
  };

  const startDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || workspaceMode !== 'desktop' || coarsePointer) return;
    dockDragRef.current = { active: true, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dockDragRef.current?.active) return;
    const { startX, startY } = dockDragRef.current;
    if (Math.abs(event.clientX - startX) > 10 || Math.abs(event.clientY - startY) > 10) {
      dockDragRef.current.moved = true;
      const distTop = event.clientY;
      const distBottom = window.innerHeight - event.clientY;
      const distLeft = event.clientX;
      const distRight = window.innerWidth - event.clientX;
      const min = Math.min(distTop, distBottom, distLeft, distRight);
      let newPos: DockPosition = dockPosition;
      if (min === distTop) newPos = 'top';
      else if (min === distBottom) newPos = 'bottom';
      else if (min === distLeft) newPos = 'left';
      else if (min === distRight) newPos = 'right';
      if (newPos !== dockPosition) setDockPosition(newPos);
    }
  };
  const endDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dockDragRef.current?.active) return;
    dockDragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => { dockDragRef.current = null; }, 50);
  };
  const startSystemBarDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || workspaceMode !== 'desktop' || coarsePointer) return;
    systemBarDragRef.current = { active: true, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveSystemBarDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!systemBarDragRef.current?.active) return;
    const { startX, startY } = systemBarDragRef.current;
    if (Math.abs(event.clientX - startX) <= 10 && Math.abs(event.clientY - startY) <= 10) return;
    systemBarDragRef.current.moved = true;
    const distances: Record<DockPosition, number> = {
      top: event.clientY,
      bottom: window.innerHeight - event.clientY,
      left: event.clientX,
      right: window.innerWidth - event.clientX,
    };
    const nextPosition = (Object.keys(distances) as DockPosition[])
      .reduce((nearest, position) => distances[position] < distances[nearest] ? position : nearest, systemBarPosition);
    if (nextPosition !== systemBarPosition) setSystemBarPosition(nextPosition);
  };
  const endSystemBarDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!systemBarDragRef.current?.active) return;
    systemBarDragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => { systemBarDragRef.current = null; }, 50);
  };
  const dragRef = useRef<{ id: DesktopItemId; offsetX: number; offsetY: number; moved: boolean; currentLeft: number; currentTop: number } | null>(null);
  const [draggingWindowId, setDraggingWindowId] = useState<WindowId | null>(null);
  const maximizedDragRef = useRef<{
    id: WindowId;
    header: HTMLElement;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    ratioX: number;
    offsetY: number;
    restoring: boolean;
  } | null>(null);
  const resizeRef = useRef<{
    id: DesktopItemId;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const rotateRef = useRef<{ id: StickyItemId; centerX: number; centerY: number; pointerAngle: number; rotation: number } | null>(null);
  const lastDesktopDragRef = useRef<{ id: DesktopLauncherDragId; endedAt: number } | null>(null);

  useEffect(() => {
    const clearPointerOperations = () => {
      dragRef.current = null;
      maximizedDragRef.current = null;
      resizeRef.current = null;
      rotateRef.current = null;
      dockDragRef.current = null;
      setDraggingWindowId(null);
    };
    window.addEventListener('pointerup', clearPointerOperations);
    window.addEventListener('pointercancel', clearPointerOperations);
    window.addEventListener('mouseup', clearPointerOperations);
    return () => {
      window.removeEventListener('pointerup', clearPointerOperations);
      window.removeEventListener('pointercancel', clearPointerOperations);
      window.removeEventListener('mouseup', clearPointerOperations);
    };
  }, []);

  const restoreDialogFocus = (opener: HTMLElement | null, fallback?: HTMLElement | null) => {
    window.requestAnimationFrame(() => {
      const target = opener?.isConnected ? opener : fallback;
      target?.focus();
    });
  };
  const closeDeleteDialog = () => {
    const pendingId = stickyPendingDelete;
    setStickyPendingDelete(null);
    restoreDialogFocus(
      deleteDialogOpenerRef.current,
      pendingId ? document.querySelector<HTMLElement>(`[data-testid="button-delete-${pendingId}"]`) : desktopAreaRef.current,
    );
  };
  const closeResetDialog = () => {
    setResetDialogOpen(false);
    restoreDialogFocus(resetDialogOpenerRef.current, desktopAreaRef.current);
  };
  const closeSaveDefaultDialog = () => {
    setSaveDefaultDialogOpen(false);
    restoreDialogFocus(saveDefaultDialogOpenerRef.current, desktopAreaRef.current);
  };
  const trapDialogFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => !element.hidden);
    if (!focusable.length) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleContextMenuKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Escape') {
      setContextMenu(null);
      setStickyMenu(null);
      return;
    }
    const menuItems = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    )).filter((item) => item.closest('[role="menu"]') === event.currentTarget && !item.hasAttribute('disabled'));
    if (!menuItems.length) return;
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? menuItems.length - 1
        : event.key === 'ArrowDown'
          ? (currentIndex + 1 + menuItems.length) % menuItems.length
          : (currentIndex - 1 + menuItems.length) % menuItems.length;
    menuItems[nextIndex].focus();
  };

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const menuOpen = Boolean(contextMenu || stickyMenu);
    if (menuOpen) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[data-active-context-menu]')?.focus();
      });
    } else if (previousMenuOpenRef.current && !resetDialogOpen && !saveDefaultDialogOpen && !stickyPendingDelete) {
      restoreDialogFocus(contextMenuOpenerRef.current, desktopAreaRef.current);
    }
    previousMenuOpenRef.current = menuOpen;
  }, [contextMenu, resetDialogOpen, saveDefaultDialogOpen, stickyMenu, stickyPendingDelete]);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const updateWorkspace = () => {
      setViewportProfile(readViewportProfile());
      setCoarsePointer(pointerQuery.matches);
    };
    updateWorkspace();
    window.addEventListener('resize', updateWorkspace);
    pointerQuery.addEventListener('change', updateWorkspace);
    return () => {
      window.removeEventListener('resize', updateWorkspace);
      pointerQuery.removeEventListener('change', updateWorkspace);
    };
  }, []);

  useEffect(() => {
    if (workspaceMode === 'desktop') return;
    setStickyOnTop(false);
    setContextMenu(null);
    setStickyMenu(null);
    if (activeWindow !== 'terminal' && activeWindow !== 'guide') return;
    const fallback = (['work', 'about', 'contact'] as WindowId[]).find((id) => windows[id]) ?? 'work';
    if (!windows[fallback]) setWindows((current) => ({ ...current, [fallback]: true }));
    setActiveWindow(fallback);
  }, [activeWindow, windows, workspaceMode]);

  useEffect(() => {
    const previousMode = previousWorkspaceModeRef.current;
    if (previousMode === 'desktop' && workspaceMode !== 'desktop') {
      desktopGeometryRef.current = { dragPositions, itemSizes, folderPositions };
    } else if (previousMode !== 'desktop' && workspaceMode === 'desktop') {
      setDragPositions(desktopGeometryRef.current.dragPositions);
      setItemSizes(desktopGeometryRef.current.itemSizes);
      setFolderPositions(desktopGeometryRef.current.folderPositions);
    }
    previousWorkspaceModeRef.current = workspaceMode;
  }, [workspaceMode]);

  useEffect(() => {
    if (workspaceMode === 'desktop') {
      desktopGeometryRef.current = { dragPositions, itemSizes, folderPositions };
    }
  }, [dragPositions, folderPositions, itemSizes, workspaceMode]);

  useEffect(() => {
    if (workspaceMode !== 'tablet-landscape') return;
    const reclampWindows = () => {
      const area = desktopAreaRef.current;
      if (!area) return;
      const areaRect = area.getBoundingClientRect();
      const dockRect = document.querySelector<HTMLElement>('.dock')?.getBoundingClientRect();
      const bottom = Math.max(0, (dockRect?.top ?? window.innerHeight - 76) - areaRect.top - 8);
      setDragPositions((current) => {
        let changed = false;
        const next = { ...current };
        for (const id of ['about', 'work', 'contact', 'terminal', 'settings', 'guide'] as WindowId[]) {
          const element = area.querySelector<HTMLElement>(`[data-testid="window-${id}"]`);
          if (!element) continue;
          const position = current[id] ?? { left: element.offsetLeft, top: element.offsetTop };
          const constrained = {
            left: Math.max(8, Math.min(areaRect.width - element.offsetWidth - 8, position.left)),
            top: Math.max(8, Math.min(bottom - element.offsetHeight, position.top)),
          };
          if (Math.abs(constrained.left - position.left) >= .1 || Math.abs(constrained.top - position.top) >= .1) {
            next[id] = constrained;
            changed = true;
          }
        }
        return changed ? next : current;
      });
    };
    const frame = window.requestAnimationFrame(reclampWindows);
    window.addEventListener('resize', reclampWindows);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', reclampWindows);
    };
  }, [workspaceMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(getCurrentDesktopState()));
    } catch {
      setStorageUnavailable(true);
      setStorageRestored(false);
    }
  }, [dragPositions, folderPositions, iconSize, itemSizes, snapToGrid, stickies, theme, showDesktopIcons, dockPosition, systemBarPosition, workspaceMode, wallpaperLight, wallpaperDark, accessibility, introCustomization]);

  useEffect(() => {
    if (!storageRestored) return;
    const timeout = window.setTimeout(() => setStorageRestored(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [storageRestored]);

  useEffect(() => {
    if (!defaultStateSaved) return;
    const timeout = window.setTimeout(() => setDefaultStateSaved(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [defaultStateSaved]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (shortcutMenuRef.current?.contains(target) || target.closest('[data-shortcut-menu-toggle]')) return;
      setMobileOpen(false);
    };
    window.addEventListener('pointerdown', closeOnOutsidePointer, true);
    return () => window.removeEventListener('pointerdown', closeOnOutsidePointer, true);
  }, [mobileOpen]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setContextMenu(null);
        setStickyMenu(null);
        if (stickyPendingDelete) closeDeleteDialog();
        if (resetDialogOpen) closeResetDialog();
        if (saveDefaultDialogOpen) closeSaveDefaultDialog();
      }
      const isSiteWindowCloseShortcut = (
        workspaceMode === 'desktop'
        && (event.metaKey || event.ctrlKey)
        && event.shiftKey
        && event.key.toLowerCase() === 'x'
      );
      if (isSiteWindowCloseShortcut) {
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat) return;
        const openWindowsByStack = [...windowStack].reverse().filter((id) => windows[id]);
        if (event.altKey) openWindowsByStack.forEach((id) => closeWindow(id));
        else if (openWindowsByStack[0]) closeWindow(openWindowsByStack[0]);
        return;
      }
      if (event.metaKey || event.ctrlKey) return;
      const target = event.target;
      const isColorValueField = target instanceof HTMLElement && Boolean(target.closest('.cp-field'));
      if (isColorValueField && ['1', '2', '3', '4', '5', '6', '7', '8'].includes(event.key)) return;
      const shortcuts: Record<string, WindowId> = { '1': 'about', '2': 'work', '3': 'contact', '4': 'terminal' };
      const id = shortcuts[event.key];
      if (['4', '5', '6', '7', '8'].includes(event.key) && workspaceMode !== 'desktop') return;
      if (id) { event.preventDefault(); openWindow(id); }
      if (event.key === '5') { event.preventDefault(); handleStickyDock(); }
      if (event.key === '6') { event.preventDefault(); setMobileOpen((value) => !value); }
      if (event.key === '7') { event.preventDefault(); openWindow('settings'); }
      if (event.key === '8') { event.preventDefault(); openWindow('guide'); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const openWindow = (id: WindowId) => {
    if ((id === 'terminal' || id === 'guide') && workspaceMode !== 'desktop') return;
    setWindows((current) => ({ ...current, [id]: true }));
    setActiveWindow(id);
    setWindowStack((current) => [...current.filter((windowId) => windowId !== id), id]);
    setStickyOnTop(false);
    setMobileOpen(false);
  };
  const rememberWindowGeometry = (id: WindowId) => {
    const area = desktopAreaRef.current;
    const windowElement = area?.querySelector<HTMLElement>(`[data-testid="window-${id}"]`);
    if (area && windowElement && workspaceMode === 'desktop') {
      setDragPositions((current) => ({
        ...current,
        [id]: {
          left: windowElement.offsetLeft,
          top: windowElement.offsetTop,
        },
      }));
      setItemSizes((current) => ({
        ...current,
        [id]: {
          width: windowElement.offsetWidth,
          height: windowElement.offsetHeight,
        },
      }));
    }
  };
  const closeWindow = (id: WindowId) => {
    rememberWindowGeometry(id);
    setWindows((current) => ({ ...current, [id]: false }));
  };
  const minimizeWindow = (id: WindowId) => {
    rememberWindowGeometry(id);
    setWindows((current) => ({ ...current, [id]: false }));
  };
  const handleStickyDock = () => {
    if (!stickies.length) {
      setStickies([createUserSticky('sticky')]);
      setActiveStickyId('sticky');
      setStickyVisible(true);
      setStickyOnTop(true);
      setMobileOpen(false);
      return;
    }
    if (stickyVisible && stickyOnTop) {
      setStickyVisible(false);
      setStickyOnTop(false);
      return;
    }
    setStickyVisible(true);
    setStickyOnTop(true);
    if (stickies.length > 0) setActiveStickyId(stickies[0].id);
    setMobileOpen(false);
  };
  const openStickies = () => {
    if (!stickies.length) {
      setStickies([createUserSticky('sticky')]);
      setActiveStickyId('sticky');
    }
    setStickyVisible(true);
    setStickyOnTop(true);
    setMobileOpen(false);
  };
  const stickyWorkspace = (): WorkspaceBounds | null => {
    const area = desktopAreaRef.current;
    if (!area) return null;
    const areaRect = area.getBoundingClientRect();
    const dockRect = document.querySelector<HTMLElement>('.dock')?.getBoundingClientRect();
    const visibleRight = Math.min(areaRect.right, window.innerWidth) - areaRect.left;
    const visibleBottom = Math.min(areaRect.bottom, window.innerHeight) - areaRect.top;
    const leftDockEdge = dockRect ? dockRect.right - areaRect.left : DOCK_SAFE_INSET;
    const rightDockEdge = dockRect ? dockRect.left - areaRect.left : visibleRight - DOCK_SAFE_INSET;
    const topDockEdge = dockRect ? dockRect.bottom - areaRect.top : DOCK_SAFE_INSET;
    const bottomDockEdge = dockRect ? dockRect.top - areaRect.top : visibleBottom - DOCK_SAFE_INSET;
    return {
      left: STICKY_VIEWPORT_GAP + (effectiveDockPosition === 'left' ? leftDockEdge : 0),
      top: STICKY_VIEWPORT_GAP + (effectiveDockPosition === 'top' ? topDockEdge : 0),
      right: (effectiveDockPosition === 'right' ? rightDockEdge : visibleRight) - STICKY_VIEWPORT_GAP,
      bottom: (effectiveDockPosition === 'bottom' ? bottomDockEdge : visibleBottom) - STICKY_VIEWPORT_GAP,
    };
  };
  const setStickyRotation = (id: StickyItemId, rotation: number) => {
    const workspace = stickyWorkspace();
    const element = desktopAreaRef.current?.querySelector<HTMLElement>(`[data-testid="sticky-${id}"]`);
    const size = itemSizes[id] ?? (element && element.offsetWidth >= MIN_STICKY_SIZE.width && element.offsetHeight >= MIN_STICKY_SIZE.height
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : DEFAULT_STICKY_SIZE);
    setStickies((current) => current.map((sticky) => sticky.id === id ? { ...sticky, rotation } : sticky));
    if (workspace) {
      setDragPositions((current) => {
        const position = current[id] ?? { left: element?.offsetLeft ?? 0, top: element?.offsetTop ?? 0 };
        const constrained = constrainStickyPosition(position, size, rotation, workspace);
        if (Math.abs(constrained.left - position.left) < .1 && Math.abs(constrained.top - position.top) < .1) return current;
        return { ...current, [id]: constrained };
      });
    }
  };
  const stickyGeometrySignature = stickies.map((sticky) => `${sticky.id}:${sticky.rotation}`).join('|');
  const stickySizeSignature = stickies.map((sticky) => {
    const size = itemSizes[sticky.id];
    return `${sticky.id}:${size?.width ?? ''}:${size?.height ?? ''}`;
  }).join('|');
  useEffect(() => {
    const reclampStickies = () => {
      if (workspaceMode === 'managed') return;
      const workspace = stickyWorkspace();
      const area = desktopAreaRef.current;
      if (!workspace || !area) return;
      const fittedSizes: ItemSizes = {};
      for (const sticky of stickies) {
        const element = area.querySelector<HTMLElement>(`[data-testid="sticky-${sticky.id}"]`);
        if (!element) continue;
        const size = itemSizes[sticky.id] ?? DEFAULT_STICKY_SIZE;
        fittedSizes[sticky.id] = fitStickySize(size, sticky.rotation, workspace);
      }
      setItemSizes((current) => {
        let changed = false;
        const next = { ...current };
        for (const sticky of stickies) {
          const fitted = fittedSizes[sticky.id];
          if (!fitted) continue;
          const currentSize = current[sticky.id];
          if (!currentSize && Math.abs(fitted.width - DEFAULT_STICKY_SIZE.width) < .1 && Math.abs(fitted.height - DEFAULT_STICKY_SIZE.height) < .1) continue;
          if (!currentSize || Math.abs(currentSize.width - fitted.width) >= .1 || Math.abs(currentSize.height - fitted.height) >= .1) {
            next[sticky.id] = fitted;
            changed = true;
          }
        }
        return changed ? next : current;
      });
      setDragPositions((current) => {
        let changed = false;
        const next = { ...current };
        for (const sticky of stickies) {
          const element = area.querySelector<HTMLElement>(`[data-testid="sticky-${sticky.id}"]`);
          const size = fittedSizes[sticky.id];
          if (!element || !size) continue;
          const position = current[sticky.id];
          if (!position) continue;
          const constrained = constrainStickyPosition(position, size, sticky.rotation, workspace);
          if (Math.abs(constrained.left - position.left) >= .1 || Math.abs(constrained.top - position.top) >= .1) {
            next[sticky.id] = constrained;
            changed = true;
          }
        }
        return changed ? next : current;
      });
    };
    const frame = window.requestAnimationFrame(reclampStickies);
    window.addEventListener('resize', reclampStickies);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', reclampStickies);
    };
  }, [effectiveDockPosition, stickyGeometrySignature, stickySizeSignature, workspaceMode]);

  const startDrag = (id: DesktopItemId, event: ReactPointerEvent<HTMLElement>) => {
    const isLauncher = id.startsWith('desktop-');
    if (event.button !== 0 || workspaceMode === 'managed' || (isLauncher && (workspaceMode !== 'desktop' || coarsePointer))) return;
    const area = desktopAreaRef.current;
    if (!area) return;
    const draggableTarget = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!draggableTarget) return;
    if (isWindowId(id)) setDraggingWindowId(id);
    const target = draggableTarget.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
    const currentPosition = dragPositions[id] ?? {
      left: target.left - areaRect.left,
      top: target.top - areaRect.top,
    };

    setDragPositions((current) => ({ ...current, [id]: currentPosition }));
    dragRef.current = {
      id,
      offsetX: event.clientX - areaRect.left - currentPosition.left,
      offsetY: event.clientY - areaRect.top - currentPosition.top,
      moved: false,
      currentLeft: currentPosition.left,
      currentTop: currentPosition.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const startMaximizedDrag = (id: WindowId, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || workspaceMode === 'managed') return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!target) return;
    setDraggingWindowId(id);
    const targetRect = target.getBoundingClientRect();
    maximizedDragRef.current = {
      id,
      header: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      ratioX: Math.max(0, Math.min(1, (event.clientX - targetRect.left) / targetRect.width)),
      offsetY: event.clientY - targetRect.top,
      restoring: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const maximizedDrag = maximizedDragRef.current;
    if (maximizedDrag) {
      maximizedDrag.currentX = event.clientX;
      maximizedDrag.currentY = event.clientY;
      if (!maximizedDrag.restoring) {
        const distance = Math.hypot(
          event.clientX - maximizedDrag.startX,
          event.clientY - maximizedDrag.startY,
        );
        if (distance < 4) return;
        maximizedDrag.restoring = true;
        setMaximizedWindows((current) => ({ ...current, [maximizedDrag.id]: false }));
        window.requestAnimationFrame(() => {
          const pending = maximizedDragRef.current;
          const area = desktopAreaRef.current;
          const draggableTarget = pending?.header.closest('[data-draggable-item]') as HTMLElement | null;
          if (!pending || pending !== maximizedDrag || !area || !draggableTarget) return;
          const areaRect = area.getBoundingClientRect();
          const restoredRect = draggableTarget.getBoundingClientRect();
          const left = pending.currentX - areaRect.left - restoredRect.width * pending.ratioX;
          const top = Math.max(0, pending.currentY - areaRect.top - pending.offsetY);
          setDragPositions((current) => ({ ...current, [pending.id]: { left, top } }));
          dragRef.current = {
            id: pending.id,
            offsetX: restoredRect.width * pending.ratioX,
            offsetY: pending.offsetY,
            moved: true,
            currentLeft: left,
            currentTop: top,
          };
          maximizedDragRef.current = null;
        });
      }
      return;
    }
    const drag = dragRef.current;
    const area = desktopAreaRef.current;
    if (!drag || !area) return;
    if (drag.id.startsWith('desktop-') && (event.buttons & 1) !== 1) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      return;
    }
    const areaRect = area.getBoundingClientRect();
    const draggableTarget = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    const target = draggableTarget?.getBoundingClientRect();
    if (!draggableTarget || !target) return;
    const nextLeft = event.clientX - areaRect.left - drag.offsetX;
    const nextTop = event.clientY - areaRect.top - drag.offsetY;
    const padRight = effectiveDockPosition === 'right' ? 70 : 0;
    const padBottom = effectiveDockPosition === 'bottom' ? 70 : 0;
    const padLeft = effectiveDockPosition === 'left' ? 70 : 0;
    const padTop = effectiveDockPosition === 'top' ? 70 : 0;
    const maxLeft = Math.max(0, areaRect.width - target.width - padRight);
    const maxTop = Math.max(0, areaRect.height - target.height - padBottom);
    const minLeft = padLeft;
    const minTop = padTop;
    const staysOnDesktop = drag.id.startsWith('sticky') || draggableTarget?.classList.contains('desktop-folder');
    const sticky = drag.id.startsWith('sticky') ? stickies.find((item) => item.id === drag.id) : undefined;
    const workspace = sticky ? stickyWorkspace() : null;
    const stickySize = sticky ? (itemSizes[sticky.id] ?? { width: draggableTarget.offsetWidth, height: draggableTarget.offsetHeight }) : null;
    const constrainedSticky = sticky && workspace && stickySize
      ? constrainStickyPosition({ left: nextLeft, top: nextTop }, stickySize, sticky.rotation, workspace)
      : null;
    const constrainsWindow = workspaceMode === 'tablet-landscape' && ['about', 'work', 'contact', 'terminal', 'settings', 'guide'].includes(drag.id);
    const left = constrainedSticky?.left ?? (staysOnDesktop || constrainsWindow ? Math.max(minLeft, Math.min(maxLeft, nextLeft)) : nextLeft);
    const top = constrainedSticky?.top ?? (staysOnDesktop || constrainsWindow ? Math.max(minTop, Math.min(maxTop, nextTop)) : Math.max(0, nextTop));
    if (Math.abs(left - (dragPositions[drag.id]?.left ?? left)) > 2 || Math.abs(top - (dragPositions[drag.id]?.top ?? top)) > 2) {
      drag.moved = true;
    }
    drag.currentLeft = left;
    drag.currentTop = top;
    setDragPositions((current) => ({ ...current, [drag.id]: { left, top } }));
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    maximizedDragRef.current = null;
    dragRef.current = null;
    setDraggingWindowId(null);
  };
  const endDesktopLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag?.moved) {
      lastDesktopDragRef.current = { id: drag.id as DesktopLauncherDragId, endedAt: performance.now() };
      if (snapToGrid) {
        const area = desktopAreaRef.current;
        const target = event.currentTarget.getBoundingClientRect();
        if (area) {
          const minLeft = dockPosition === 'left' ? 70 : 0;
          const minTop = dockPosition === 'top' ? 70 : 0;
          const maxLeft = area.clientWidth - target.width - (dockPosition === 'right' ? 70 : 0);
          const maxTop = area.clientHeight - target.height - (dockPosition === 'bottom' ? 70 : 0);
          const left = snapWithinDesktopGrid(drag.currentLeft, minLeft, maxLeft);
          const top = snapWithinDesktopGrid(drag.currentTop, minTop, maxTop);
          setDragPositions((current) => ({ ...current, [drag.id]: { left, top } }));
        }
      }
    }
    endDrag(event);
  };
  const startResize = (id: DesktopItemId, event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection = 'se') => {
    if (workspaceMode === 'managed' || (id.startsWith('sticky') && coarsePointer)) return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    const area = desktopAreaRef.current;
    if (!target || !area) return;
    if (isWindowId(id)) setDraggingWindowId(id);
    const startLeft = dragPositions[id]?.left ?? target.offsetLeft;
    const startTop = dragPositions[id]?.top ?? target.offsetTop;
    setDragPositions((current) => ({ ...current, [id]: { left: startLeft, top: startTop } }));
    resizeRef.current = {
      id,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: target.offsetWidth,
      startHeight: target.offsetHeight,
      startLeft,
      startTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const isSticky = resize.id.startsWith('sticky');
    const minWidth = isSticky ? MIN_STICKY_SIZE.width : 320;
    const minHeight = isSticky ? MIN_STICKY_SIZE.height : 240;
    const deltaX = event.clientX - resize.startX;
    const deltaY = event.clientY - resize.startY;
    const growsEast = resize.direction.includes('e');
    const growsWest = resize.direction.includes('w');
    const growsSouth = resize.direction.includes('s');
    const growsNorth = resize.direction.includes('n');
    let width = Math.max(minWidth, resize.startWidth + (growsEast ? deltaX : growsWest ? -deltaX : 0));
    let height = Math.max(minHeight, resize.startHeight + (growsSouth ? deltaY : growsNorth ? -deltaY : 0));
    let left = growsWest ? resize.startLeft + resize.startWidth - width : resize.startLeft;
    let top = growsNorth ? resize.startTop + resize.startHeight - height : resize.startTop;
    if (isSticky) {
      const sticky = stickies.find((item) => item.id === resize.id);
      const workspace = stickyWorkspace();
      if (sticky && workspace) {
        const fitted = fitStickySize({ width, height }, sticky.rotation, workspace);
        width = fitted.width;
        height = fitted.height;
        left = growsWest ? resize.startLeft + resize.startWidth - width : resize.startLeft;
        top = growsNorth ? resize.startTop + resize.startHeight - height : resize.startTop;
        const constrained = constrainStickyPosition({ left, top }, fitted, sticky.rotation, workspace);
        left = constrained.left;
        top = constrained.top;
      }
    } else if (top < 0) {
      height = Math.max(minHeight, height + top);
      top = 0;
    }
    setItemSizes((current) => ({ ...current, [resize.id]: { width, height } }));
    setDragPositions((current) => ({ ...current, [resize.id]: { left, top } }));
  };
  const endResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resizeRef.current = null;
    setDraggingWindowId(null);
  };
  const startRotate = (id: StickyItemId, rotation: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (workspaceMode !== 'desktop' || coarsePointer) return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateRef.current = {
      id,
      centerX,
      centerY,
      pointerAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI,
      rotation,
    };
    setActiveStickyId(id);
    setStickyOnTop(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.stopPropagation();
  };
  const moveRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rotate = rotateRef.current;
    if (!rotate) return;
    const pointerAngle = Math.atan2(event.clientY - rotate.centerY, event.clientX - rotate.centerX) * 180 / Math.PI;
    let delta = pointerAngle - rotate.pointerAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const rawRotation = rotate.rotation + delta;
    const rotation = event.shiftKey ? Math.round(rawRotation / 15) * 15 : Math.round(rawRotation * 10) / 10;
    setStickyRotation(rotate.id, rotation);
  };
  const endRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rotateRef.current = null;
  };
  const rotateWithKeyboard = (id: StickyItemId, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Home' || event.key === '0') {
      event.preventDefault();
      event.stopPropagation();
      setActiveStickyId(id);
      setStickyOnTop(true);
      setStickyRotation(id, 0);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : -1;
    const increment = event.shiftKey ? 15 : 1;
    setActiveStickyId(id);
    setStickyOnTop(true);
    const sticky = stickies.find((item) => item.id === id);
    if (sticky) setStickyRotation(id, Math.round((sticky.rotation + direction * increment) * 10) / 10);
  };
  const handleDesktopWindowOpen = (id: WindowId) => {
    const recentDrag = lastDesktopDragRef.current;
    if (recentDrag?.id === `desktop-${id}` && performance.now() - recentDrag.endedAt < 500) {
      return;
    }
    if (windows[id]) {
      openWindow(id);
      return;
    }
    openWindow(id);
  };
  const handleDesktopStickiesOpen = () => {
    const recentDrag = lastDesktopDragRef.current;
    if (recentDrag?.id === 'desktop-stickies-app' && performance.now() - recentDrag.endedAt < 500) {
      return;
    }
    openStickies();
  };
  const positionStyle = (id: DesktopItemId): React.CSSProperties | undefined => {
    const position = dragPositions[id];
    return position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined;
  };
  const itemStyle = (id: DesktopItemId): React.CSSProperties => ({
    ...positionStyle(id),
    ...(itemSizes[id] ? { width: itemSizes[id]?.width, height: itemSizes[id]?.height } : {}),
  });
  const launcherStyle = (id: DesktopLauncherId): React.CSSProperties | undefined => {
    if (workspaceMode !== 'desktop' || coarsePointer) return undefined;
    const position = dragPositions[`desktop-${id}`] ?? folderPositions[id];
    return position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined;
  };
  const stickyStyle = (sticky: StickyData) => {
    const selectedColor = stickyPalette.find((color) => color.id === sticky.color) ?? stickyPalette[0];
    const usesLightText = selectedColor.foreground === 'light';
    return {
      ...(managedLayout ? {} : itemStyle(sticky.id)),
      zIndex: stickyOnTop && activeStickyId === sticky.id ? 5 : 4,
      '--sticky-bg': selectedColor.background,
      '--sticky-text': usesLightText ? '#ffffff' : '#1d2430',
      '--sticky-muted': usesLightText ? '#edf1f5' : '#37414d',
      '--sticky-accent': usesLightText ? '#ffffff' : '#1d2430',
      '--sticky-border': usesLightText ? 'rgba(255, 255, 255, .28)' : 'rgba(29, 36, 48, .25)',
      '--sticky-handle': selectedColor.handle,
      '--sticky-low-bg': selectedColor.lowBackground,
      '--sticky-low-accent': selectedColor.lowAccent,
      '--sticky-high-accent': selectedColor.highAccent,
      '--sticky-rotation': `${managedLayout ? 0 : sticky.rotation}deg`,
    } as React.CSSProperties;
  };
  const addSticky = (sourceId: StickyItemId) => {
    const source = stickies.find((sticky) => sticky.id === sourceId) ?? stickies[0] ?? defaultSticky;
    const numericIds = stickies.map((sticky) => sticky.id === 'sticky' ? 0 : Number(sticky.id.slice(7))).filter(Number.isFinite);
    const id = `sticky-${Math.max(0, ...numericIds) + 1}` as StickyItemId;
    const area = desktopAreaRef.current;
    const sourcePosition = workspaceMode === 'desktop'
      ? dragPositions[sourceId]
      : desktopGeometryRef.current.dragPositions[sourceId];
    const width = itemSizes[sourceId]?.width ?? DEFAULT_STICKY_SIZE.width;
    const height = itemSizes[sourceId]?.height ?? DEFAULT_STICKY_SIZE.height;
    const offset = 28 + (stickies.length % 4) * 12;
    const layoutWidth = workspaceMode === 'desktop' ? (area?.clientWidth ?? 900) : Math.max(900, window.innerWidth);
    const layoutHeight = workspaceMode === 'desktop' ? (area?.clientHeight ?? 650) : Math.max(650, window.innerHeight - 42);
    const left = Math.max(12, Math.min(layoutWidth - width - 12, (sourcePosition?.left ?? layoutWidth * .58) + offset));
    const top = Math.max(18, Math.min(layoutHeight - height - 18, (sourcePosition?.top ?? 95) + offset));
    const rotations = [-2, 1, -3, 2, -.8];
    desktopGeometryRef.current = {
      ...desktopGeometryRef.current,
      dragPositions: { ...desktopGeometryRef.current.dragPositions, [id]: { left, top } },
      itemSizes: { ...desktopGeometryRef.current.itemSizes, [id]: { width, height } },
    };
    setStickies((current) => [...current, createUserSticky(id, source.color, rotations[(numericIds.length - 1) % rotations.length])]);
    setDragPositions((current) => ({ ...current, [id]: { left, top } }));
    setItemSizes((current) => ({ ...current, [id]: { width, height } }));
    setActiveStickyId(id);
    setStickyVisible(true);
    setStickyOnTop(true);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLTextAreaElement>(`[data-testid="sticky-${id}"] .sticky-text`)?.focus();
    });
  };
  const deleteSticky = (id: StickyItemId) => {
    if (id === 'sticky') return;
    const remaining = stickies.filter((sticky) => sticky.id !== id);
    setStickies(remaining);
    setActiveStickyId((activeId) => activeId === id ? (remaining[0]?.id ?? 'sticky') : activeId);
    if (!remaining.length) {
      setStickyVisible(false);
      setStickyOnTop(false);
    }
    const desktopPositions = { ...desktopGeometryRef.current.dragPositions };
    const desktopSizes = { ...desktopGeometryRef.current.itemSizes };
    delete desktopPositions[id];
    delete desktopSizes[id];
    desktopGeometryRef.current = {
      ...desktopGeometryRef.current,
      dragPositions: desktopPositions,
      itemSizes: desktopSizes,
    };
    setDragPositions((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setItemSizes((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setStickyMenu(null);
    setStickyPendingDelete(null);
  };
  const cycleStickyColor = (id: StickyItemId) => {
    setStickies((current) => current.map((sticky) => {
      if (sticky.id !== id) return sticky;
      const index = stickyPalette.findIndex((color) => color.id === sticky.color);
      return { ...sticky, color: stickyPalette[(index + 1) % stickyPalette.length].id };
    }));
  };
  const selectAdjacentSticky = (direction: -1 | 1) => {
    const index = Math.max(0, stickies.findIndex((sticky) => sticky.id === activeStickyId));
    const next = stickies[(index + direction + stickies.length) % stickies.length];
    if (next) setActiveStickyId(next.id);
  };
  const resetStickyRotation = (id: StickyItemId) => {
    setStickyRotation(id, 0);
    setActiveStickyId(id);
    setStickyOnTop(true);
    setStickyMenu(null);
  };
  const openDesktopContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('.window, .desktop-note, .desktop-folder')) return;
    event.preventDefault();
    contextMenuOpenerRef.current = event.currentTarget;
    setStickyMenu(null);
    setContextMenu({
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - 430)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - 270)),
      target: 'desktop'
    });
  };
  const cleanupIcons = () => {
    const area = desktopAreaRef.current;
    if (!area) return;
    const launcherIds: DesktopLauncherId[] = ['about', 'work', 'terminal', 'contact', 'stickies-app'];
    const column = iconSize === 'large' ? 88 : 72;
    const current = launcherIds.map((id) => {
      const dragId: DesktopLauncherDragId = `desktop-${id}`;
      const element = area.querySelector<HTMLElement>(`[data-testid="button-folder-${id}"]`);
      return {
        dragId,
        left: dragPositions[dragId]?.left ?? element?.offsetLeft ?? 0,
        top: dragPositions[dragId]?.top ?? element?.offsetTop ?? 0,
      };
    }).sort((first, second) => first.left - second.left || first.top - second.top);
    const anchor = current[0];
    const cleanedPositions = current.reduce<ItemPositions>((positions, icon, index) => {
      positions[icon.dragId] = { left: anchor.left + column * index, top: anchor.top };
      return positions;
    }, { ...dragPositions });
    desktopGeometryRef.current = {
      ...desktopGeometryRef.current,
      dragPositions: {
        ...desktopGeometryRef.current.dragPositions,
        ...cleanedPositions,
      },
      folderPositions: {},
    };
    setFolderPositions({});
    setDragPositions(cleanedPositions);
    setContextMenu(null);
  };
  const autoArrangeIcons = () => {
    const area = desktopAreaRef.current;
    if (!area) return;
    const width = iconSize === 'large' ? 88 : 70;
    const row = iconSize === 'large' ? 86 : 68;
    const left = Math.max(dockPosition === 'left' ? 100 : 16, area.clientWidth - width - (dockPosition === 'right' ? 94 : 28));
    const startTop = dockPosition === 'top' ? 132 : 62;
    const arrangedPositions: ItemPositions = {
      ...dragPositions,
      'desktop-about': { left, top: startTop },
      'desktop-work': { left, top: startTop + row },
      'desktop-terminal': { left, top: startTop + row * 2 },
      'desktop-contact': { left, top: startTop + row * 3 },
      'desktop-stickies-app': { left, top: startTop + row * 4 },
    };
    const savedDesktopPositions: ItemPositions = {
      ...desktopGeometryRef.current.dragPositions,
      'desktop-about': arrangedPositions['desktop-about'],
      'desktop-work': arrangedPositions['desktop-work'],
      'desktop-terminal': arrangedPositions['desktop-terminal'],
      'desktop-contact': arrangedPositions['desktop-contact'],
      'desktop-stickies-app': arrangedPositions['desktop-stickies-app'],
    };
    desktopGeometryRef.current = {
      ...desktopGeometryRef.current,
      dragPositions: savedDesktopPositions,
      folderPositions: {},
    };
    setFolderPositions({});
    setDragPositions(arrangedPositions);
    setContextMenu(null);
  };
  const resetDesktop = () => {
    const restoredWindowStack = resetDesktopState.windowStack ?? defaultDesktopState.windowStack ?? [];
    const restoredWindows = resetDesktopState.windows ?? initialWindows;
    const restoredActiveWindow = (
      resetDesktopState.activeWindow
      && restoredWindows[resetDesktopState.activeWindow]
    )
      ? resetDesktopState.activeWindow
      : [...restoredWindowStack].reverse().find((id) => restoredWindows[id]) ?? 'about';
    try {
      window.localStorage.removeItem(DESKTOP_STORAGE_KEY);
    } catch {
      setStorageUnavailable(true);
    }
    desktopGeometryRef.current = {
      dragPositions: resetDesktopState.itemPositions,
      itemSizes: resetDesktopState.itemSizes,
      folderPositions: resetDesktopState.folderPositions,
    };
    setFolderPositions(resetDesktopState.folderPositions);
    setDragPositions(resetDesktopState.itemPositions);
    setItemSizes(resetDesktopState.itemSizes);
    setIconSize(resetDesktopState.iconSize);
    setSnapToGrid(resetDesktopState.snapToGrid);
    setTheme(resetDesktopState.theme);
    setShowDesktopIcons(resetDesktopState.showDesktopIcons);
    setStickies(resetDesktopState.stickies);
    setDockPosition(resetDesktopState.dockPosition);
    setSystemBarPosition(resetDesktopState.systemBarPosition);
    setWallpaperLight(resetDesktopState.wallpaperLight ?? DEFAULT_WALLPAPER_LIGHT);
    setWallpaperDark(resetDesktopState.wallpaperDark ?? DEFAULT_WALLPAPER_DARK);
    setAccessibility(resetDesktopState.accessibility ?? DEFAULT_ACCESSIBILITY_PREFS);
    setIntroCustomization(resetDesktopState.introCustomization ?? DEFAULT_INTRO_CUSTOMIZATION);
    setWindows(restoredWindows);
    setActiveWindow(restoredActiveWindow);
    setWindowStack(restoredWindowStack);
    setMaximizedWindows(resetDesktopState.maximizedWindows ?? {});
    setStickyVisible(resetDesktopState.stickyVisible ?? true);
    setStickyOnTop(resetDesktopState.stickyOnTop ?? false);
    setMobileOpen(false);
    setActiveStickyId(resetDesktopState.activeStickyId ?? resetDesktopState.stickies[0]?.id ?? 'sticky');
    setContextMenu(null);
    setStickyMenu(null);
    setResetDialogOpen(false);
  };
  const saveCurrentStateAsDefault = () => {
    const currentState: SavedDesktopState = {
      ...getCurrentDesktopState(),
      windowStack,
      windows,
      activeWindow,
      maximizedWindows,
      stickyVisible,
      stickyOnTop,
      activeStickyId,
    };
    try {
      window.localStorage.setItem(DESKTOP_DEFAULT_STORAGE_KEY, JSON.stringify(currentState));
      setResetDesktopState(currentState);
      setStorageUnavailable(false);
      setDefaultStateSaved(true);
    } catch {
      setStorageUnavailable(true);
      setDefaultStateSaved(false);
    }
    setSaveDefaultDialogOpen(false);
  };
  const maximizedWindowDockInset = dockPosition === systemBarPosition
    ? MAXIMIZED_WINDOW_DOCK_INSET_WITH_SYSTEM_BAR
    : MAXIMIZED_WINDOW_DOCK_INSET;
  const windowProps = (id: WindowId) => ({
    active: activeWindow === id,
    maximized: Boolean(maximizedWindows[id]),
    dragging: draggingWindowId === id,
    onFocus: () => {
      setActiveWindow(id);
      setWindowStack((current) => [...current.filter((windowId) => windowId !== id), id]);
      setStickyOnTop(false);
    },
    onClose: () => closeWindow(id),
    onMinimize: () => minimizeWindow(id),
    onMaximize: () => {
      setActiveWindow(id);
      setWindowStack((current) => [...current.filter((windowId) => windowId !== id), id]);
      setStickyOnTop(false);
      setMaximizedWindows((current) => ({ ...current, [id]: !current[id] }));
    },
    onHeaderDoubleClick: (event: ReactMouseEvent<HTMLElement>) => {
      if (deviceMode !== 'desktop' || (event.target as HTMLElement).closest('.traffic-lights')) return;
      setActiveWindow(id);
      setWindowStack((current) => [...current.filter((windowId) => windowId !== id), id]);
      setStickyOnTop(false);
      setMaximizedWindows((current) => ({ ...current, [id]: !current[id] }));
    },
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      setActiveWindow(id);
      setWindowStack((current) => [...current.filter((windowId) => windowId !== id), id]);
      setStickyOnTop(false);
      if (maximizedWindows[id]) startMaximizedDrag(id, event);
      else startDrag(id, event);
    },
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection) => {
      if (!maximizedWindows[id]) startResize(id, event, direction);
    },
    onResizeMove: moveResize,
    onResizeEnd: endResize,
    style: managedLayout
      ? undefined
      : maximizedWindows[id]
      ? {
        left: dockPosition === 'left' ? maximizedWindowDockInset : MAXIMIZED_WINDOW_GAP,
        top: dockPosition === 'top' ? maximizedWindowDockInset : MAXIMIZED_WINDOW_GAP,
        right: dockPosition === 'right' ? maximizedWindowDockInset : MAXIMIZED_WINDOW_GAP,
        bottom: dockPosition === 'bottom' ? maximizedWindowDockInset : MAXIMIZED_WINDOW_GAP,
        width: 'auto',
        height: 'auto',
        zIndex: 10 + windowStack.indexOf(id),
      }
      : { ...itemStyle(id), zIndex: 10 + windowStack.indexOf(id) },
  });

  const wallpaperConfig = theme === 'light' ? wallpaperLight : wallpaperDark;
  const presentationTheme: Theme = accessibility.contrastTheme === 'none' ? theme : 'dark';
  // Picture wallpapers stay desktop-only, while the selected solid color follows
  // its theme into tablet and mobile. Contrast modes continue to own the managed
  // workspace background.
  const appliesSelectedWallpaper = workspaceMode === 'desktop'
    || (wallpaperConfig.mode === 'color' && accessibility.contrastTheme === 'none');
  const currentWallpaperStyle = appliesSelectedWallpaper
    ? desktopBackground(theme, wallpaperLight, wallpaperDark, accessibility.contrastTheme)
    : undefined;
  const actionButtonPrimary = tokens.color.component[presentationTheme].actionButtonPrimary;
  const actionButtonSecondary = tokens.color.component[presentationTheme].actionButtonSecondary;
  const actionButtonTertiary = tokens.color.component[presentationTheme].actionButtonTertiary;
  const actionButtonDanger = tokens.color.component[presentationTheme].actionButtonDanger;
  const contactCta = tokens.color.component[presentationTheme].contactCta;
  const shellStyle = {
    ...currentWallpaperStyle,
    '--component-action-button-primary-background': hexToHslChannels(actionButtonPrimary.background),
    '--component-action-button-primary-foreground': hexToHslChannels(actionButtonPrimary.foreground),
    '--component-action-button-primary-border': hexToHslChannels(actionButtonPrimary.border),
    '--component-action-button-primary-hover': hexToHslChannels(actionButtonPrimary.hover),
    '--component-action-button-primary-hover-foreground': hexToHslChannels(actionButtonPrimary.hoverForeground),
    '--component-action-button-primary-hover-border': hexToHslChannels(actionButtonPrimary.hoverBorder),
    '--component-action-button-primary-focus': hexToHslChannels(actionButtonPrimary.focus),
    '--component-action-button-secondary-background': hexToHslChannels(actionButtonSecondary.background),
    '--component-action-button-secondary-foreground': hexToHslChannels(actionButtonSecondary.foreground),
    '--component-action-button-secondary-border': hexToHslChannels(actionButtonSecondary.border),
    '--component-action-button-secondary-hover': hexToHslChannels(actionButtonSecondary.hover),
    '--component-action-button-secondary-hover-foreground': hexToHslChannels(actionButtonSecondary.hoverForeground),
    '--component-action-button-secondary-hover-border': hexToHslChannels(actionButtonSecondary.hoverBorder),
    '--component-action-button-secondary-focus': hexToHslChannels(actionButtonSecondary.focus),
    '--component-action-button-tertiary-background': hexToHslChannels(actionButtonTertiary.background),
    '--component-action-button-tertiary-foreground': hexToHslChannels(actionButtonTertiary.foreground),
    '--component-action-button-tertiary-border': hexToHslChannels(actionButtonTertiary.border),
    '--component-action-button-tertiary-hover': hexToHslChannels(actionButtonTertiary.hover),
    '--component-action-button-tertiary-hover-foreground': hexToHslChannels(actionButtonTertiary.hoverForeground),
    '--component-action-button-tertiary-hover-border': hexToHslChannels(actionButtonTertiary.hoverBorder),
    '--component-action-button-tertiary-focus': hexToHslChannels(actionButtonTertiary.focus),
    '--component-action-button-danger-background': hexToHslChannels(actionButtonDanger.background),
    '--component-action-button-danger-foreground': hexToHslChannels(actionButtonDanger.foreground),
    '--component-action-button-danger-border': hexToHslChannels(actionButtonDanger.border),
    '--component-action-button-danger-hover': hexToHslChannels(actionButtonDanger.hover),
    '--component-action-button-danger-hover-foreground': hexToHslChannels(actionButtonDanger.hoverForeground),
    '--component-action-button-danger-hover-border': hexToHslChannels(actionButtonDanger.hoverBorder),
    '--component-action-button-danger-focus': hexToHslChannels(actionButtonDanger.focus),
    '--component-contact-cta-background': hexToHslChannels(contactCta.background),
    '--component-contact-cta-foreground': hexToHslChannels(contactCta.foreground),
    '--component-contact-cta-border': hexToHslChannels(contactCta.border),
    '--component-contact-cta-hover': hexToHslChannels(contactCta.hover),
    '--component-contact-cta-accent': hexToHslChannels(contactCta.accent),
  } as React.CSSProperties;
  const automaticContrastActive = (
    introCustomization.automaticContrast
  );
  const [clockTime = '', clockPeriod = ''] = clock.split(' ');
  const introTextStyle = (key: IntroTextKey): React.CSSProperties => {
    const automaticColor = automaticContrastActive ? automaticIntroColors[key] : undefined;
    return {
      color: automaticColor ?? introCustomization.colors[theme][key],
      textShadow: automaticColor
        ? automaticColor === '#111326' || automaticColor === '#000000'
          ? '0 1px 2px rgba(255, 255, 255, .58)'
          : '0 1px 3px rgba(0, 0, 0, .72)'
        : undefined,
    };
  };

  // When a wallpaper is applied, suppress the shell's default gradient.
  // In contrast mode the class is always 'wallpaper-color' for override styling
  const wallpaperClass = accessibility.contrastTheme !== 'none' ? 'wallpaper-color' : `wallpaper-${wallpaperConfig.mode}`;

  return (
    <main
      className={`osp-shell theme-${presentationTheme} icons-${iconSize} workspace-${workspaceMode} device-${deviceMode} orientation-${orientation} system-bar-at-${effectiveSystemBarPosition} ${coarsePointer ? 'pointer-coarse' : 'pointer-fine'} ${appliesSelectedWallpaper ? wallpaperClass : ''}`}
      onPointerDown={() => { setContextMenu(null); setStickyMenu(null); }}
      onContextMenu={(event) => event.preventDefault()}
      style={shellStyle}
    >
      <header
        className={`system-bar system-bar-${effectiveSystemBarPosition}`}
        aria-label={workspaceMode === 'desktop' ? 'System bar. Drag to a screen edge or right-click to choose its position.' : 'System bar'}
        data-testid="system-bar"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest('button')) return;
          startSystemBarDrag(event);
        }}
        onPointerMove={moveSystemBarDrag}
        onPointerUp={endSystemBarDrag}
        onPointerCancel={endSystemBarDrag}
        onClickCapture={(event) => {
          if (systemBarDragRef.current?.moved && !(event.target as HTMLElement).closest('button')) {
            event.stopPropagation();
            event.preventDefault();
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (workspaceMode !== 'desktop') return;
          contextMenuOpenerRef.current = event.currentTarget;
          setContextMenu({
            x: Math.max(8, Math.min(event.clientX, window.innerWidth - 220)),
            y: Math.max(8, Math.min(event.clientY, window.innerHeight - 250)),
            target: 'system-bar',
          });
        }}
      >
        <div className="system-left">
          <Apple className="system-logo" size={14} strokeWidth={1.8} aria-hidden="true" />
          <span className="system-mark">OS.Portfolio</span>
          <span className="system-separator">/</span>
          <span className="system-location">Seattle, WA</span>
          <span className="system-separator">/</span>
          <span className="system-location">workspace</span>
        </div>
        <div className="system-right">
          <span className="system-network">open to good problems</span>
          <StatusIndicator className="system-status" dotClassName="status-dot" />
          <Wifi className="system-network" size={14} />
          <BatteryMedium className="system-network" size={16} />
          <span className="system-side-separator" aria-hidden="true" />
          <span className="system-clock" data-testid="text-system-clock">
            <span className="system-clock-time">{clockTime}</span>
            <span className="system-clock-period">{clockPeriod}</span>
          </span>
          <button className="mobile-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Open portfolio menu" data-shortcut-menu-toggle data-testid="button-mobile-menu"><Menu size={17} /></button>
        </div>
      </header>

      {storageUnavailable && (
        <aside className="storage-notice" role="status" aria-live="polite" data-testid="notice-storage-unavailable">
          <div className="storage-notice-summary">
            <strong>Changes won{'\u2019'}t be saved.</strong>
            <span>They{'\u2019'}ll work for this session, but reset after you reload.</span>
            <button
              type="button"
              className="storage-help-toggle"
              aria-expanded={storageHelpOpen}
              aria-controls="storage-recovery-guidance"
              onClick={() => setStorageHelpOpen((open) => !open)}
            >
              {storageHelpOpen ? 'Hide help' : 'How to restore saving'}
            </button>
          </div>
          {storageHelpOpen && (
            <div id="storage-recovery-guidance" className="storage-recovery-guidance">
              <p>Leave private browsing, or allow this site to store site data in your browser settings.</p>
              <button type="button" className="storage-help-toggle" onClick={retryDesktopSave}>
                Try saving again
              </button>
            </div>
          )}
        </aside>
      )}
      {storageRestored && (
        <div className="storage-restored" role="status" aria-live="polite" data-testid="notice-storage-restored">
          Saving restored. Current desktop changes are saved.
        </div>
      )}
      {defaultStateSaved && (
        <div className="storage-restored" role="status" aria-live="polite" data-testid="notice-default-state-saved">
          Current desktop state saved as default.
        </div>
      )}

      <div
        className={`desktop-area dock-space-${dockPosition} system-bar-space-${systemBarPosition}`}
        ref={desktopAreaRef}
        tabIndex={-1}
        onContextMenu={openDesktopContextMenu}
      >
        <div className="desktop-intro" data-automatic-contrast={automaticContrastActive || undefined}>
          <SectionLabel className="eyebrow">personal workspace / v1.0</SectionLabel>
          <h1>
            <span
              ref={introPrimaryRef}
              style={introTextStyle('primary')}
              data-auto-contrast-color={automaticIntroColors.primary}
            >
              {introCustomization.text.primary}
            </span>
            <br />
            <em
              ref={introAccentRef}
              style={introTextStyle('accent')}
              data-auto-contrast-color={automaticIntroColors.accent}
            >
              {introCustomization.text.accent}
            </em>
          </h1>
          <p
            ref={introBodyRef}
            style={introTextStyle('body')}
            data-auto-contrast-color={automaticIntroColors.body}
          >
            {introCustomization.text.body}
          </p>
          <div className="quick-actions">
            <ActionButton className="quick-button primary" variant="primary" onClick={() => openWindow('work')} data-testid="button-open-work">open work <ChevronRight size={13} /></ActionButton>
            <ActionButton className="quick-button tertiary" variant="tertiary" onClick={() => openWindow('contact')} data-testid="button-open-contact">say hello <Mail size={13} /></ActionButton>
          </div>
        </div>

        {showDesktopIcons && workspaceMode === 'desktop' && (
          <div className="desktop-folders" aria-label="Desktop applications and folders">
            <DesktopFolder singleTap={singleTapLaunch} id="about" label="about" open={windows.about} onToggle={() => handleDesktopWindowOpen('about')} onPointerDown={(event) => startDrag('desktop-about', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('about')} appIcon={<CircleUserFill size={31} data-testid="icon-about-circle-user-fill" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="work" label="work" open={windows.work} onToggle={() => handleDesktopWindowOpen('work')} onPointerDown={(event) => startDrag('desktop-work', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('work')} appIcon={<FolderGit2 size={31} strokeWidth={1.8} />} />
            <DesktopFolder singleTap={singleTapLaunch} id="terminal" label="terminal" open={windows.terminal} onToggle={() => handleDesktopWindowOpen('terminal')} onPointerDown={(event) => startDrag('desktop-terminal', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('terminal')} appIcon={<TerminalCursorFill size={31} data-testid="icon-terminal-cursor-fill" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="contact" label="contact" open={windows.contact} onToggle={() => handleDesktopWindowOpen('contact')} onPointerDown={(event) => startDrag('desktop-contact', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('contact')} appIcon={<RiMailSendFill size={30} data-testid="icon-contact-mail-fill" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="stickies-app" label="stickies" open={stickyVisible && stickyOnTop} onToggle={handleDesktopStickiesOpen} onPointerDown={(event) => startDrag('desktop-stickies-app', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('stickies-app')} appIcon={<BsStickyFill size={30} data-testid="icon-stickies-bootstrap-fill" />} />
          </div>
        )}

        {workspaceMode === 'desktop' && stickyVisible && (!managedLayout || stickyOnTop) && stickies.filter((sticky) => !managedLayout || sticky.id === activeStickyId).map((sticky, index) => (
          <aside
            key={sticky.id}
            className="desktop-note"
            data-draggable-item
            data-sticky-color={sticky.color}
            data-testid={`sticky-${sticky.id}`}
            style={stickyStyle(sticky)}
            onPointerDown={(event) => { setActiveStickyId(sticky.id); setStickyOnTop(true); startDrag(sticky.id, event); }}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveStickyId(sticky.id);
              setStickyOnTop(true);
              contextMenuOpenerRef.current = document.activeElement instanceof HTMLElement && event.currentTarget.contains(document.activeElement)
                ? document.activeElement
                : event.currentTarget.querySelector<HTMLElement>('textarea, button') ?? event.currentTarget;
              setContextMenu(null);
              setStickyMenu({
                id: sticky.id,
                x: Math.max(8, Math.min(event.clientX, window.innerWidth - 224)),
                y: Math.max(8, Math.min(event.clientY, window.innerHeight - 304)),
              });
            }}
            aria-label={`Draggable sticky note ${index + 1}`}
          >
            <StickyNoteSurface className="desktop-note-surface">
              <span className="note-label">field note / {String(index + 4).padStart(3, '0')}</span>
              <button
                type="button"
                className="sticky-add-button"
                aria-label="Add sticky note"
                data-testid={`button-add-${sticky.id}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => { event.stopPropagation(); addSticky(sticky.id); }}
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              </button>
              {sticky.id !== 'sticky' && (
                <button
                  type="button"
                  className="sticky-delete-button"
                  aria-label={`Delete sticky note ${index + 1}`}
                  data-testid={`button-delete-${sticky.id}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    setStickyMenu(null);
                    deleteDialogOpenerRef.current = event.currentTarget;
                    setStickyPendingDelete(sticky.id);
                  }}
                >
                  <X size={15} strokeWidth={2} aria-hidden="true" />
                </button>
              )}
              <textarea
                className="sticky-text"
                value={sticky.text}
                onChange={(event) => setStickies((current) => current.map((item) => item.id === sticky.id ? { ...item, text: event.target.value } : item))}
                onPointerDown={(event) => { event.stopPropagation(); setActiveStickyId(sticky.id); setStickyOnTop(true); }}
                aria-label={`Sticky note ${index + 1} text`}
                placeholder="Write a note…"
              />
              <span className="note-signoff">— {sticky.author}, {sticky.createdAt}</span>
              <div className="managed-sticky-toolbar" aria-label="Sticky note controls">
                <button type="button" onClick={() => selectAdjacentSticky(-1)} disabled={stickies.length < 2} aria-label="Previous sticky"><ArrowLeft size={14} /></button>
                <span>{Math.max(1, stickies.findIndex((item) => item.id === sticky.id) + 1)} / {stickies.length}</span>
                <button type="button" onClick={() => selectAdjacentSticky(1)} disabled={stickies.length < 2} aria-label="Next sticky"><ChevronRight size={14} /></button>
                <button type="button" onClick={() => cycleStickyColor(sticky.id)}>Color</button>
                <button type="button" onClick={() => addSticky(sticky.id)}><Plus size={14} /> Add</button>
                {sticky.id !== 'sticky' && (
                  <button type="button" className="managed-sticky-delete" onClick={() => deleteSticky(sticky.id)}><X size={14} /> Delete</button>
                )}
              </div>
            </StickyNoteSurface>
            {(['top-left', 'top-right', 'bottom-left'] as const).map((corner, cornerIndex) => (
              <button
                type="button"
                key={corner}
                className={`sticky-rotate-handle sticky-rotate-${corner}`}
                aria-label={`Rotate sticky note ${index + 1} from ${corner.replace('-', ' ')}, currently ${Math.round(sticky.rotation)} degrees. Press Home or 0 to reset`}
                aria-keyshortcuts="Home 0"
                data-testid={`button-rotate-${sticky.id}-${corner}`}
                tabIndex={cornerIndex === 1 ? 0 : -1}
                onPointerDown={(event) => startRotate(sticky.id, sticky.rotation, event)}
                onPointerMove={moveRotate}
                onPointerUp={endRotate}
                onPointerCancel={endRotate}
                onKeyDown={(event) => rotateWithKeyboard(sticky.id, event)}
              />
            ))}
            <span
              className="desktop-resize-handle"
              onPointerDown={(event) => { event.stopPropagation(); startResize(sticky.id, event); }}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              role="separator"
              aria-label={`Resize sticky note ${index + 1}`}
              tabIndex={0}
            />
          </aside>
        ))}

        {windows.work && (!managedLayout || (!stickyOnTop && activeWindow === 'work')) && <WorkWindow {...windowProps('work')} />}
        {windows.about && (!managedLayout || (!stickyOnTop && activeWindow === 'about')) && <AboutWindow {...windowProps('about')} />}
        {windows.contact && (!managedLayout || (!stickyOnTop && activeWindow === 'contact')) && <ContactWindow {...windowProps('contact')} />}
        {workspaceMode === 'desktop' && windows.terminal && (!managedLayout || (!stickyOnTop && activeWindow === 'terminal')) && <TerminalWindow {...windowProps('terminal')} onOpenWindow={openWindow} onCloseWindow={closeWindow} onSetTheme={setRegularTheme} onSetContrastTheme={setContrastTheme} openWindows={windows} currentTheme={theme} contrastTheme={accessibility.contrastTheme} />}
        {workspaceMode === 'desktop' && windows.settings && (
          <SettingsWindow
            {...windowProps('settings')}
            theme={theme}
            onSetTheme={setRegularTheme}
            wallpaperLight={wallpaperLight}
            wallpaperDark={wallpaperDark}
            onSetWallpaperLight={setWallpaperLight}
            onSetWallpaperDark={setWallpaperDark}
            accessibility={accessibility}
            onSetAccessibility={setAccessibility}
            introCustomization={introCustomization}
            onSetIntroCustomization={setIntroCustomization}
            onOpenWindow={openWindow}
            openWindows={windows}
            windowStack={windowStack}
            stickiesCount={stickies.length}
            deviceMode={deviceMode}
            workspaceMode={workspaceMode}
            dockPosition={effectiveDockPosition}
          />
        )}
        {workspaceMode === 'desktop' && windows.guide && (
          <GuideWindow {...windowProps('guide')} />
        )}
      </div>

      {contextMenu?.target === 'desktop' && (
        <ContextMenuSurface
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={handleContextMenuKeyDown}
          tabIndex={-1}
          role="menu"
          aria-label="Desktop options"
          data-active-context-menu
          data-testid="menu-desktop-context"
        >
          {workspaceMode === 'desktop' && (
            <>
              <div className="context-menu-row has-submenu">
                <button type="button" role="menuitem" aria-haspopup="menu"><span className="context-check" /><span>View</span><ChevronRight size={13} /></button>
                <div className="context-submenu" role="menu" aria-label="Icon size">
                  <button type="button" role="menuitemradio" aria-checked={iconSize === 'large'} onClick={() => { setIconSize('large'); setContextMenu(null); }}><span className="context-check">{iconSize === 'large' && <Check size={12} />}</span><span>Large icons</span></button>
                  <button type="button" role="menuitemradio" aria-checked={iconSize === 'small'} onClick={() => { setIconSize('small'); setContextMenu(null); }}><span className="context-check">{iconSize === 'small' && <Check size={12} />}</span><span>Small icons</span></button>
                </div>
              </div>
              <button type="button" className="context-menu-button" role="menuitem" onClick={cleanupIcons}><span className="context-check" /><span>Cleanup icons</span></button>
              <button type="button" className="context-menu-button" role="menuitemcheckbox" aria-checked={snapToGrid} onClick={() => setSnapToGrid((value) => !value)}><span className="context-check">{snapToGrid && <Check size={12} />}</span><span>Snap to grid</span></button>
              <button type="button" className="context-menu-button" role="menuitem" onClick={autoArrangeIcons}><span className="context-check" /><span>Auto arrange icons</span></button>
              <div className="context-menu-separator" />
            </>
          )}
          {workspaceMode === 'desktop' && (
            <>
              <button type="button" className="context-menu-button" role="menuitemcheckbox" aria-checked={showDesktopIcons} onClick={() => setShowDesktopIcons((value) => !value)}><span className="context-check">{showDesktopIcons && <Check size={12} />}</span><span>Show desktop icons</span></button>
              <button
                type="button"
                className="context-menu-button"
                role="menuitem"
                onClick={() => {
                  saveDefaultDialogOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                  setContextMenu(null);
                  setSaveDefaultDialogOpen(true);
                }}
              >
                <span className="context-check" />
                <span>Save state as default</span>
              </button>
            </>
          )}
          <div className="context-menu-separator" />
          <button
            type="button"
            className="context-menu-button context-menu-danger"
            role="menuitem"
            onClick={() => {
              resetDialogOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
              setContextMenu(null);
              setResetDialogOpen(true);
            }}
          >
            <span className="context-check" />
            <span>Reset desktop…</span>
          </button>
        </ContextMenuSurface>
      )}

      {contextMenu?.target === 'dock' && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={handleContextMenuKeyDown}
          tabIndex={-1}
          role="menu"
          aria-label="Dock options"
          data-active-context-menu
          data-testid="menu-dock-context"
        >
          <div className="sticky-color-menu-title dock-menu-title">Dock position</div>
          {(['top', 'right', 'bottom', 'left'] as DockPosition[]).map((position) => (
            <button
              type="button"
              key={position}
              className="context-menu-button"
              role="menuitemradio"
              aria-checked={dockPosition === position}
              onClick={() => { setDockPosition(position); setContextMenu(null); }}
            >
              <span className="context-check">{dockPosition === position && <Check size={12} />}</span>
              <span>{position[0].toUpperCase() + position.slice(1)}</span>
            </button>
          ))}
        </div>
      )}

      {contextMenu?.target === 'system-bar' && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={handleContextMenuKeyDown}
          tabIndex={-1}
          role="menu"
          aria-label="System bar options"
          data-active-context-menu
          data-testid="menu-system-bar-context"
        >
          <div className="sticky-color-menu-title dock-menu-title">System bar position</div>
          {(['top', 'right', 'bottom', 'left'] as DockPosition[]).map((position) => (
            <button
              type="button"
              key={position}
              className="context-menu-button"
              role="menuitemradio"
              aria-checked={systemBarPosition === position}
              onClick={() => { setSystemBarPosition(position); setContextMenu(null); }}
            >
              <span className="context-check">{systemBarPosition === position && <Check size={12} />}</span>
              <span>{position[0].toUpperCase() + position.slice(1)}</span>
            </button>
          ))}
        </div>
      )}

      {stickyMenu && (
        <div
          className="desktop-context-menu sticky-color-menu"
          style={{ left: stickyMenu.x, top: stickyMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={handleContextMenuKeyDown}
          tabIndex={-1}
          role="menu"
          aria-label="Sticky options"
          data-active-context-menu
          data-testid="menu-sticky-colors"
        >
          <div className="sticky-color-menu-title">Sticky color</div>
          <div className="sticky-color-grid">
            {stickyPalette.map((color) => (
              <button
                type="button"
                key={color.id}
                className="sticky-color-option"
                style={{
                  background: accessibility.contrastTheme === 'high' ? '#000000' : accessibility.contrastTheme === 'low' ? color.lowBackground : color.background,
                  color: accessibility.contrastTheme === 'high' ? color.highAccent : accessibility.contrastTheme === 'low' ? color.lowAccent : color.foreground === 'light' ? '#ffffff' : '#1d2430',
                  borderColor: accessibility.contrastTheme === 'high' ? color.highAccent : accessibility.contrastTheme === 'low' ? color.lowAccent : undefined,
                }}
                role="menuitemradio"
                aria-checked={stickies.find((sticky) => sticky.id === stickyMenu.id)?.color === color.id}
                aria-label={color.label}
                onClick={() => {
                  setStickies((current) => current.map((sticky) => sticky.id === stickyMenu.id ? { ...sticky, color: color.id } : sticky));
                  setStickyMenu(null);
                }}
              >
                {stickies.find((sticky) => sticky.id === stickyMenu.id)?.color === color.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="sticky-color-name">
            {stickyPalette.find((color) => color.id === stickies.find((sticky) => sticky.id === stickyMenu.id)?.color)?.label ?? 'Lemon'}
          </div>
          <div className="context-menu-separator" />
          <button
            type="button"
            className="context-menu-button context-menu-button-no-icon"
            role="menuitem"
            onClick={() => resetStickyRotation(stickyMenu.id)}
            data-testid="button-reset-sticky-rotation"
          >
            <span>Reset rotation</span>
          </button>
          {stickyMenu.id !== 'sticky' && (
            <>
              <div className="context-menu-separator" />
              <button
                type="button"
                className="context-menu-button context-menu-button-no-icon context-menu-danger"
                role="menuitem"
                onClick={(event) => {
                  deleteDialogOpenerRef.current = event.currentTarget;
                  setStickyPendingDelete(stickyMenu.id);
                  setStickyMenu(null);
                }}
                data-testid="button-delete-sticky"
              >
                <span>Delete this sticky…</span>
              </button>
            </>
          )}
        </div>
      )}

      {stickyPendingDelete && (
        <div className="reset-dialog-backdrop">
          <section
            ref={deleteDialogRef}
            className="reset-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-sticky-dialog-title"
            aria-describedby="delete-sticky-dialog-description"
            data-testid="dialog-delete-sticky"
            tabIndex={-1}
            onKeyDown={trapDialogFocus}
          >
            <span className="reset-dialog-eyebrow">sticky note</span>
            <h2 id="delete-sticky-dialog-title">Delete this sticky?</h2>
            <p id="delete-sticky-dialog-description">Its text, color, size, position, and rotation will be permanently removed from this desktop.</p>
            <div className="reset-dialog-actions">
              <button type="button" className="quick-button" onClick={closeDeleteDialog} autoFocus>Cancel</button>
              <button
                type="button"
                className="quick-button reset-confirm-button"
                onClick={() => {
                  deleteSticky(stickyPendingDelete);
                  restoreDialogFocus(null, document.querySelector<HTMLElement>('[data-testid="button-add-sticky"]') ?? desktopAreaRef.current);
                }}
                data-testid="button-confirm-delete-sticky"
              >
                Delete sticky
              </button>
            </div>
          </section>
        </div>
      )}

      {resetDialogOpen && (
        <div className="reset-dialog-backdrop">
          <section
            ref={resetDialogRef}
            className="reset-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-description"
            data-testid="dialog-reset-desktop"
            tabIndex={-1}
            onKeyDown={trapDialogFocus}
          >
            <span className="reset-dialog-eyebrow">desktop settings</span>
            <h2 id="reset-dialog-title">Reset desktop?</h2>
            <p id="reset-dialog-description">Icon positions, window layouts, stickies, and desktop preferences will return to the saved default state.</p>
            <div className="reset-dialog-actions">
              <button type="button" autoFocus onClick={closeResetDialog} data-testid="button-cancel-reset">Cancel</button>
              <button
                type="button"
                className="reset-dialog-confirm"
                onClick={() => {
                  resetDesktop();
                  restoreDialogFocus(resetDialogOpenerRef.current, desktopAreaRef.current);
                }}
                data-testid="button-confirm-reset"
              >
                Reset desktop
              </button>
            </div>
          </section>
        </div>
      )}

      {saveDefaultDialogOpen && (
        <div className="reset-dialog-backdrop">
          <section
            ref={saveDefaultDialogRef}
            className="reset-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="save-default-dialog-title"
            aria-describedby="save-default-dialog-description"
            data-testid="dialog-save-default"
            tabIndex={-1}
            onKeyDown={trapDialogFocus}
          >
            <span className="reset-dialog-eyebrow">desktop settings</span>
            <h2 id="save-default-dialog-title">Overwrite current default state?</h2>
            <p id="save-default-dialog-description">Your current icon positions, window layouts, stickies, and desktop preferences will become the state restored by Reset desktop.</p>
            <div className="reset-dialog-actions">
              <button type="button" autoFocus onClick={closeSaveDefaultDialog} data-testid="button-cancel-save-default">Cancel</button>
              <button
                type="button"
                className="reset-dialog-confirm"
                onClick={() => {
                  saveCurrentStateAsDefault();
                  restoreDialogFocus(saveDefaultDialogOpenerRef.current, desktopAreaRef.current);
                }}
                data-testid="button-confirm-save-default"
              >
                Overwrite
              </button>
            </div>
          </section>
        </div>
      )}

      <nav
        className={`dock dock-${effectiveDockPosition} ${workspaceMode !== 'desktop' ? 'dock-fixed' : ''} ${deviceMode === 'mobile' ? 'dock-mobile-menu' : ''} ${deviceMode === 'tablet' ? 'dock-tablet-menu' : ''}`}
        tabIndex={-1}
        aria-label={workspaceMode === 'desktop' ? 'Application dock. Drag to a screen edge or right-click to choose its position.' : 'Application menu'}
        onPointerDown={(event) => {
          if (workspaceMode !== 'desktop') return;
          if ((event.target as HTMLElement).closest('button')) return;
          startDockDrag(event);
        }}
        onPointerMove={moveDockDrag}
        onPointerUp={endDockDrag}
        onPointerCancel={endDockDrag}
        onClickCapture={(e) => {
          if (dockDragRef.current?.moved && !(e.target as HTMLElement).closest('button')) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (workspaceMode !== 'desktop') return;
          contextMenuOpenerRef.current = event.currentTarget;
          setContextMenu({
            x: Math.max(8, Math.min(event.clientX, window.innerWidth - 220)),
            y: Math.max(8, Math.min(event.clientY, window.innerHeight - 250)),
            target: 'dock'
          });
        }}
      >
        <DockItem className="dock-item dock-app-work" active={windows.work} focused={windows.work && !stickyOnTop && activeWindow === 'work'} onClick={() => openWindow('work')} aria-label="Open work" data-testid="button-dock-work"><FolderGit2 size={20} /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Work{workspaceMode === 'desktop' ? ' · 2' : ''}</DockItemLabel></DockItem>
        <DockItem className="dock-item dock-app-about" active={windows.about} focused={windows.about && !stickyOnTop && activeWindow === 'about'} onClick={() => openWindow('about')} aria-label="Open about" data-testid="button-dock-about"><CircleUserFill size={20} data-testid="icon-dock-about-circle-user-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>About{workspaceMode === 'desktop' ? ' · 1' : ''}</DockItemLabel></DockItem>
        <DockItem className="dock-item dock-app-contact" active={windows.contact} focused={windows.contact && !stickyOnTop && activeWindow === 'contact'} onClick={() => openWindow('contact')} aria-label="Open contact" data-testid="button-dock-contact"><RiMailSendFill size={20} data-testid="icon-dock-contact-mail-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Contact{workspaceMode === 'desktop' ? ' · 3' : ''}</DockItemLabel></DockItem>
        {workspaceMode !== 'desktop' && (
            <DockItem
              className={`dock-item dock-mode-toggle mode-${theme}`}
            onClick={() => setRegularTheme(theme === 'light' ? 'dark' : 'light')}
            disabled={accessibility.contrastTheme !== 'none'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            data-testid="button-dock-mode"
          >
            <div className="mode-icon" aria-hidden="true">
              <Sun className="mode-sun" size={20} strokeWidth={1.8} />
              <Moon className="mode-moon" size={20} strokeWidth={1.8} />
            </div>
            <span>Mode</span>
            </DockItem>
        )}
        {workspaceMode === 'desktop' && (
          <>
            <DockItem className="dock-item dock-app-terminal" active={windows.terminal} focused={windows.terminal && !stickyOnTop && activeWindow === 'terminal'} onClick={() => { if (activeWindow === 'terminal' && windows.terminal) minimizeWindow('terminal'); else openWindow('terminal'); }} aria-label="Open terminal" data-testid="button-dock-terminal"><TerminalCursorFill size={20} data-testid="icon-dock-terminal-cursor-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Terminal · 4</DockItemLabel></DockItem>
            <DockItem className="dock-item dock-app-stickies" active={stickyVisible} focused={stickyVisible && stickyOnTop} onClick={handleStickyDock} aria-label={stickyVisible && stickyOnTop ? 'Minimize Stickies' : 'Open or focus Stickies'} data-testid="button-dock-stickies"><BsStickyFill size={20} data-testid="icon-dock-stickies-bootstrap-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Stickies · 5</DockItemLabel></DockItem>
            <DockItem className="dock-item" onClick={() => setMobileOpen((value) => !value)} aria-label="Show keyboard shortcuts" data-shortcut-menu-toggle data-testid="button-dock-shortcuts"><KeyboardFill size={19} data-testid="icon-dock-shortcuts-keyboard-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Shortcuts · 6</DockItemLabel></DockItem>
            <DockItem className="dock-item dock-app-settings" active={windows.settings} focused={windows.settings && !stickyOnTop && activeWindow === 'settings'} onClick={() => openWindow('settings')} aria-label="Open settings" data-testid="button-dock-settings"><BsGearWideConnected size={20} data-testid="icon-dock-settings-gear-wide-connected-fill" /><DockItemLabel presentation="tooltip">Settings · 7</DockItemLabel></DockItem>
            <DockItem className="dock-item dock-app-guide" active={windows.guide} focused={windows.guide && !stickyOnTop && activeWindow === 'guide'} onClick={() => openWindow('guide')} aria-label="Open user guide" data-testid="button-dock-guide"><BookFill size={20} data-testid="icon-dock-guide-book-fill" /><DockItemLabel presentation="tooltip">Guide · 8</DockItemLabel></DockItem>
          </>
        )}
      </nav>

      {mobileOpen && (
        <div ref={shortcutMenuRef} className={`mobile-shortcut-menu shortcut-menu-system-bar-${effectiveSystemBarPosition}`} data-testid="menu-mobile">
          <div className="section-kicker">keyboard map</div>
          <p style={{ margin: '9px 0 14px', fontSize: 12 }}>{workspaceMode === 'desktop' ? 'Use 1–8 for Dock shortcuts.' : 'Choose an app to open or bring it to the front.'} Escape closes this menu.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="quick-button" onClick={() => openWindow('about')} data-testid="button-menu-about"><span className="shortcut-number">1</span>about</button>
            <button className="quick-button" onClick={() => openWindow('work')} data-testid="button-menu-work"><span className="shortcut-number">2</span>work</button>
            <button className="quick-button" onClick={() => openWindow('contact')} data-testid="button-menu-contact"><span className="shortcut-number">3</span>contact</button>
            <button className="quick-button" onClick={() => openWindow('terminal')} data-testid="button-menu-terminal"><span className="shortcut-number">4</span>terminal</button>
            <button className="quick-button" onClick={handleStickyDock} data-testid="button-menu-stickies"><span className="shortcut-number">5</span>stickies</button>
            <button className="quick-button" onClick={() => setMobileOpen(false)} data-testid="button-menu-shortcuts"><span className="shortcut-number">6</span>shortcuts</button>
            <button className="quick-button" onClick={() => openWindow('settings')} data-testid="button-menu-settings"><span className="shortcut-number">7</span>settings</button>
            <button className="quick-button" onClick={() => openWindow('guide')} data-testid="button-menu-guide"><span className="shortcut-number">8</span>guide</button>
          </div>
        </div>
      )}
    </main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
