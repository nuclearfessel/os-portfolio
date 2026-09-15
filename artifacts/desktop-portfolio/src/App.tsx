import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ColorPicker } from '@/components/color-picker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Sparkle as Apple, ArrowLeft, ArrowUpRight, BatteryMedium, ChevronRight,
  Check, Keyboard as Command, GitGraph as FolderGit2, Mail, Maximize2, Menu, Minus,
  Moon, Plus, Settings, Sun, SquareTerminal, Wifi, Eye, X,
} from '@keyline-icons/react';
import { CircleUser as CircleUserFill } from '@keyline-icons/react/fill';
import { RiMailSendFill } from 'react-icons/ri';
import { BsStickyFill } from 'react-icons/bs';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@workspace/portfolio-os-design-system/components/ui/toaster';
import { TooltipProvider } from '@workspace/portfolio-os-design-system/components/ui/tooltip';
import { Separator } from '@workspace/portfolio-os-design-system/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/portfolio-os-design-system/components/ui/accordion';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@workspace/portfolio-os-design-system/components/ui/dialog';
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
} from '@workspace/portfolio-os-design-system/components/ui/portfolio-os';

const queryClient = new QueryClient();

type WindowId = 'about' | 'work' | 'contact' | 'terminal' | 'settings';
type WindowState = Record<WindowId, boolean>;
type IconSize = 'large' | 'small';
type Theme = 'dark' | 'light';
type DesktopLauncherId = Exclude<WindowId, 'settings'> | 'stickies-app';
type FolderPositions = Partial<Record<DesktopLauncherId, { left: number; top: number }>>;
type StickyItemId = 'sticky' | `sticky-${number}`;
type DesktopLauncherDragId = `desktop-${DesktopLauncherId}`;
type DesktopItemId = WindowId | StickyItemId | DesktopLauncherDragId;
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

const DEFAULT_STICKY_SIZE: Size = { width: 214, height: 138 };
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
  { id: 'lemon', label: 'Lemon', background: '#ffd84d', foreground: 'dark', handle: '#8f6900' },
  { id: 'orange', label: 'Orange', background: '#ffb84d', foreground: 'dark', handle: '#9f5700' },
  { id: 'coral', label: 'Coral', background: '#ffaaa3', foreground: 'dark', handle: '#9d4648' },
  { id: 'cream', label: 'Cream', background: '#fff0d2', foreground: 'dark', handle: '#a88655' },
  { id: 'teal', label: 'Teal', background: '#006456', foreground: 'light', handle: '#76dccb' },
  { id: 'blue', label: 'Blue', background: '#0d56b3', foreground: 'light', handle: '#8ac4ff' },
  { id: 'purple', label: 'Purple', background: '#6648b8', foreground: 'light', handle: '#c8b3ff' },
  { id: 'berry', label: 'Berry', background: '#a93570', foreground: 'light', handle: '#ffb2d5' },
  { id: 'forest', label: 'Forest', background: '#1e603d', foreground: 'light', handle: '#91d6aa' },
  { id: 'charcoal', label: 'Charcoal', background: '#343b4f', foreground: 'light', handle: '#b8c2dd' },
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

const DESKTOP_STORAGE_KEY = 'portfolio-os.desktop.v4';
const DESKTOP_DEFAULT_STORAGE_KEY = 'portfolio-os.desktop.default.v1';
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
  windowStack: ['work', 'about', 'contact', 'terminal', 'settings'],
  windows: { about: true, work: true, contact: false, terminal: false, settings: false },
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
  let savedState = '{}';
  try {
    savedState = window.localStorage.getItem(storageKey) ?? '{}';
  } catch {
    storageUnavailableDuringLoad = true;
    return defaultDesktopState;
  }
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
          top: ['about', 'work', 'contact', 'terminal', 'settings'].includes(id) ? Math.max(0, position.top) : position.top,
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
    const stickies = Array.isArray(parsed.stickies)
      ? parsed.stickies.flatMap((sticky) => (
        Boolean(sticky)
        && (sticky.id === 'sticky' || /^sticky-\d+$/.test(sticky.id))
        && stickyPalette.some((color) => color.id === sticky.color)
        && typeof sticky.text === 'string'
          ? [{
            ...sticky,
            rotation: Number.isFinite(sticky.rotation) ? sticky.rotation : 3,
            author: sticky.author === 'user' ? 'user' as const : sticky.id === 'sticky' ? 'john' as const : 'user' as const,
            createdAt: typeof sticky.createdAt === 'string' && sticky.createdAt ? sticky.createdAt : sticky.id === 'sticky' ? '09:42' : 'saved',
          }]
          : []
      ))
      : [{
        ...defaultSticky,
        color: stickyPalette.some((color) => color.id === parsed.stickyColor)
          ? parsed.stickyColor as StickyColorId
          : defaultSticky.color,
      }];
    const allWindowIds: WindowId[] = ['about', 'work', 'contact', 'terminal', 'settings'];
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

    return {
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
};

function WindowFrame({
  id,
  title,
  active,
  maximized,
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
      className={`window portfolio-scrollbar-window ${id} ${active ? 'is-active' : ''} ${maximized ? 'is-maximized' : ''}`}
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

type SettingsSection = 'personalization' | 'accessibility';

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
  max?: number;
  step?: number;
  unit?: string;
  guidanceStart?: string;
  guidanceEnd?: string;
  ariaValueText?: string;
}) {
  const progress = (value / max) * 100;

  return (
    <div className="settings-transparency-group" data-testid={testId}>
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
}) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personalization');
  const [textColorTarget, setTextColorTarget] = useState<IntroTextKey | null>(null);
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
                  {accessibility.windowTransparency || accessibility.blurEffects ? (
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
                      {accessibility.blurEffects && (
                        <EffectSlider
                          id="personalization-blur"
                          label="Blur"
                          value={accessibility.blurLevel}
                          onChange={(value) => updateAccessibility({ blurLevel: value })}
                          testId="settings-personalization-blur"
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
                    description="Enables transparency across windows, the dock, menus, and stickies. Turn off for opaque solid surfaces."
                    checked={accessibility.windowTransparency}
                    onChange={(v) => updateAccessibility({ windowTransparency: v })}
                    data-testid="settings-a11y-transparency"
                  />

                  <SettingsToggle
                    id="a11y-blur"
                    label="Blur effects"
                    description="Enables backdrop blur across windows, the dock, menus, and stickies."
                    checked={accessibility.blurEffects}
                    onChange={(v) => updateAccessibility({ blurEffects: v })}
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
                    description="Enables transitions, keyframe animations, and motion effects. Turn off to remove all motion."
                    checked={accessibility.uiAnimations}
                    onChange={(v) => updateAccessibility({ uiAnimations: v })}
                    data-testid="settings-a11y-animations"
                  />

                  {accessibility.uiAnimations && (
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
                      {accessibility.contrastTheme !== 'none' && ' Wallpaper controls are disabled while a contrast theme is active.'}
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

const shellCommands = ['help', 'ls', 'pwd', 'cd', 'cat', 'open', 'close', 'theme', 'history', 'whoami', 'date', 'echo', 'clear', 'exit'];
const shellExamples = ['ls', 'cd work', 'cat ~/work/northstar-commerce-system.md', 'open work', 'theme light', 'history', 'clear'];
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
  openWindows,
  currentTheme,
  ...props
}: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'> & {
  onOpenWindow: (id: WindowId) => void;
  onCloseWindow: (id: WindowId) => void;
  onSetTheme: (theme: Theme) => void;
  openWindows: WindowState;
  currentTheme: Theme;
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
      appendEntry(raw, 'Filesystem\n  ls [path]       list files\n  pwd             print current directory\n  cd [path]       change directory (cd - returns)\n  cat <file>      read a file\n\nSite controls\n  open <name>     open about, work, contact, or terminal\n  close <name>    close a window (or: close all)\n  theme <mode>    switch light or dark theme\n\nShell\n  history         show command history\n  whoami          identify the current user\n  date            show local date and time\n  echo <text>     print text\n  clear           clear terminal output\n  exit            close the terminal\n\nUse ↑/↓ for history and Tab to complete commands or paths.');
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
      else if (mode === currentTheme) appendEntry(raw, `${mode} theme is already active.`);
      else {
        onSetTheme(mode);
        appendEntry(raw, `Theme changed to ${mode}.`);
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
    // Scrollbars
    if (accessibility.alwaysShowScrollbars) {
      root.setAttribute('data-always-scrollbars', '');
    } else {
      root.removeAttribute('data-always-scrollbars');
    }
    // Transparency
    if (!accessibility.windowTransparency) {
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
    if (!accessibility.blurEffects) {
      root.setAttribute('data-no-blur', '');
      root.removeAttribute('data-blur-enabled');
      root.style.removeProperty('--surface-blur');
    } else {
      root.removeAttribute('data-no-blur');
      root.setAttribute('data-blur-enabled', '');
      root.style.setProperty('--surface-blur', `${accessibility.blurLevel}px`);
    }
    // Animations
    if (!accessibility.uiAnimations) {
      root.setAttribute('data-no-animations', '');
    } else {
      root.removeAttribute('data-no-animations');
      // Speed
      root.removeAttribute('data-anim-speed');
      if (accessibility.animationSpeed !== 'default') {
        root.setAttribute('data-anim-speed', accessibility.animationSpeed);
      }
    }
    if (!accessibility.uiAnimations && !accessibility.windowTransparency) {
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
      const shell = document.querySelector<HTMLElement>('.os-shell');
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
    if (activeWindow !== 'terminal') return;
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
        for (const id of ['about', 'work', 'contact', 'terminal', 'settings'] as WindowId[]) {
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
      if (isColorValueField && ['1', '2', '3', '4', '5', '6', '7'].includes(event.key)) return;
      const shortcuts: Record<string, WindowId> = { '1': 'about', '2': 'work', '3': 'contact', '4': 'terminal' };
      const id = shortcuts[event.key];
      if (['4', '5', '6', '7'].includes(event.key) && workspaceMode !== 'desktop') return;
      if (id) { event.preventDefault(); openWindow(id); }
      if (event.key === '5') { event.preventDefault(); handleStickyDock(); }
      if (event.key === '6') { event.preventDefault(); setMobileOpen((value) => !value); }
      if (event.key === '7') { event.preventDefault(); openWindow('settings'); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const openWindow = (id: WindowId) => {
    if (id === 'terminal' && workspaceMode !== 'desktop') return;
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
    const constrainsWindow = workspaceMode === 'tablet-landscape' && ['about', 'work', 'contact', 'terminal', 'settings'].includes(drag.id);
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
  const windowProps = (id: WindowId) => ({
    active: activeWindow === id,
    maximized: Boolean(maximizedWindows[id]),
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
        left: dockPosition === 'left' ? 82 : systemBarPosition === 'left' ? 60 : 12,
        top: dockPosition === 'top' ? 82 : systemBarPosition === 'top' ? 54 : 12,
        right: dockPosition === 'right' ? 82 : systemBarPosition === 'right' ? 60 : 12,
        bottom: dockPosition === 'bottom' ? 82 : systemBarPosition === 'bottom' ? 54 : 12,
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
      className={`os-shell theme-${presentationTheme} icons-${iconSize} workspace-${workspaceMode} device-${deviceMode} orientation-${orientation} system-bar-at-${effectiveSystemBarPosition} ${coarsePointer ? 'pointer-coarse' : 'pointer-fine'} ${appliesSelectedWallpaper ? wallpaperClass : ''}`}
      onPointerDown={() => { setContextMenu(null); setStickyMenu(null); }}
      onContextMenu={(event) => event.preventDefault()}
      style={currentWallpaperStyle}
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
          <span className="system-mark">PORTFOLIO.OS</span>
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
            <ActionButton className="quick-button" onClick={() => openWindow('contact')} data-testid="button-open-contact">say hello <Mail size={13} /></ActionButton>
          </div>
        </div>

        {showDesktopIcons && workspaceMode === 'desktop' && (
          <div className="desktop-folders" aria-label="Desktop applications and folders">
            <DesktopFolder singleTap={singleTapLaunch} id="about" label="about" open={windows.about} onToggle={() => handleDesktopWindowOpen('about')} onPointerDown={(event) => startDrag('desktop-about', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('about')} appIcon={<CircleUserFill size={31} data-testid="icon-about-circle-user-fill" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="work" label="work" open={windows.work} onToggle={() => handleDesktopWindowOpen('work')} onPointerDown={(event) => startDrag('desktop-work', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('work')} appIcon={<FolderGit2 size={31} strokeWidth={1.8} />} />
            <DesktopFolder singleTap={singleTapLaunch} id="terminal" label="terminal" open={windows.terminal} onToggle={() => handleDesktopWindowOpen('terminal')} onPointerDown={(event) => startDrag('desktop-terminal', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('terminal')} appIcon={<SquareTerminal size={31} strokeWidth={1.7} data-testid="icon-terminal-square" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="contact" label="contact" open={windows.contact} onToggle={() => handleDesktopWindowOpen('contact')} onPointerDown={(event) => startDrag('desktop-contact', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('contact')} appIcon={<RiMailSendFill size={30} data-testid="icon-contact-mail-fill" />} />
            <DesktopFolder singleTap={singleTapLaunch} id="stickies-app" label="stickies" open={stickyVisible && stickyOnTop} onToggle={handleDesktopStickiesOpen} onPointerDown={(event) => startDrag('desktop-stickies-app', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('stickies-app')} appIcon={<BsStickyFill size={30} data-testid="icon-stickies-bootstrap-fill" />} />
          </div>
        )}

        {workspaceMode === 'desktop' && stickyVisible && (!managedLayout || stickyOnTop) && stickies.filter((sticky) => !managedLayout || sticky.id === activeStickyId).map((sticky, index) => (
          <aside
            key={sticky.id}
            className="desktop-note"
            data-draggable-item
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
        {workspaceMode === 'desktop' && windows.terminal && (!managedLayout || (!stickyOnTop && activeWindow === 'terminal')) && <TerminalWindow {...windowProps('terminal')} onOpenWindow={openWindow} onCloseWindow={closeWindow} onSetTheme={setRegularTheme} openWindows={windows} currentTheme={theme} />}
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
          />
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
                style={{ background: color.background, color: color.foreground === 'light' ? '#ffffff' : '#1d2430' }}
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
            className="context-menu-button"
            role="menuitem"
            onClick={() => resetStickyRotation(stickyMenu.id)}
            data-testid="button-reset-sticky-rotation"
          >
            <span className="context-check" aria-hidden="true">0°</span>
            <span>Reset rotation</span>
          </button>
          {stickyMenu.id !== 'sticky' && (
            <>
              <div className="context-menu-separator" />
              <button
                type="button"
                className="context-menu-button context-menu-danger"
                role="menuitem"
                onClick={(event) => {
                  deleteDialogOpenerRef.current = event.currentTarget;
                  setStickyPendingDelete(stickyMenu.id);
                  setStickyMenu(null);
                }}
                data-testid="button-delete-sticky"
              >
                <X size={14} aria-hidden="true" />
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
        <DockItem className="dock-item dock-app-work" active={windows.work && (workspaceMode === 'desktop' || activeWindow === 'work')} onClick={() => openWindow('work')} aria-label="Open work" data-testid="button-dock-work"><FolderGit2 size={20} /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Work{workspaceMode === 'desktop' ? ' · 2' : ''}</DockItemLabel></DockItem>
        <DockItem className="dock-item dock-app-about" active={windows.about && (workspaceMode === 'desktop' || activeWindow === 'about')} onClick={() => openWindow('about')} aria-label="Open about" data-testid="button-dock-about"><CircleUserFill size={20} data-testid="icon-dock-about-circle-user-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>About{workspaceMode === 'desktop' ? ' · 1' : ''}</DockItemLabel></DockItem>
        <DockItem className="dock-item dock-app-contact" active={windows.contact && (workspaceMode === 'desktop' || activeWindow === 'contact')} onClick={() => openWindow('contact')} aria-label="Open contact" data-testid="button-dock-contact"><RiMailSendFill size={20} data-testid="icon-dock-contact-mail-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Contact{workspaceMode === 'desktop' ? ' · 3' : ''}</DockItemLabel></DockItem>
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
            <DockItem className="dock-item dock-app-terminal" active={windows.terminal} onClick={() => { if (activeWindow === 'terminal' && windows.terminal) minimizeWindow('terminal'); else openWindow('terminal'); }} aria-label="Open terminal" data-testid="button-dock-terminal"><SquareTerminal size={20} data-testid="icon-dock-terminal-square" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Terminal · 4</DockItemLabel></DockItem>
            <DockItem className="dock-item dock-app-stickies" active={stickyVisible} onClick={handleStickyDock} aria-label={stickyVisible && stickyOnTop ? 'Minimize Stickies' : 'Open or focus Stickies'} data-testid="button-dock-stickies"><BsStickyFill size={20} data-testid="icon-dock-stickies-bootstrap-fill" /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Stickies · 5</DockItemLabel></DockItem>
            <DockItem className="dock-item" onClick={() => setMobileOpen((value) => !value)} aria-label="Show keyboard shortcuts" data-shortcut-menu-toggle data-testid="button-dock-shortcuts"><Command size={19} /><DockItemLabel presentation={workspaceMode === 'desktop' ? 'tooltip' : 'inline'}>Shortcuts · 6</DockItemLabel></DockItem>
            <DockItem className="dock-item" active={windows.settings} onClick={() => openWindow('settings')} aria-label="Open settings" data-testid="button-dock-settings"><Settings size={20} strokeWidth={1.8} /><DockItemLabel presentation="tooltip">Settings · 7</DockItemLabel></DockItem>
          </>
        )}
      </nav>

      {mobileOpen && (
        <div ref={shortcutMenuRef} className={`mobile-shortcut-menu shortcut-menu-system-bar-${effectiveSystemBarPosition}`} data-testid="menu-mobile">
          <div className="section-kicker">keyboard map</div>
          <p style={{ margin: '9px 0 14px', fontSize: 12 }}>{workspaceMode === 'desktop' ? 'Use 1–7 for Dock shortcuts.' : 'Choose an app to open or bring it to the front.'} Escape closes this menu.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="quick-button" onClick={() => openWindow('about')} data-testid="button-menu-about"><span className="shortcut-number">1</span>about</button>
            <button className="quick-button" onClick={() => openWindow('work')} data-testid="button-menu-work"><span className="shortcut-number">2</span>work</button>
            <button className="quick-button" onClick={() => openWindow('contact')} data-testid="button-menu-contact"><span className="shortcut-number">3</span>contact</button>
            <button className="quick-button" onClick={() => openWindow('terminal')} data-testid="button-menu-terminal"><span className="shortcut-number">4</span>terminal</button>
            <button className="quick-button" onClick={handleStickyDock} data-testid="button-menu-stickies"><span className="shortcut-number">5</span>stickies</button>
            <button className="quick-button" onClick={() => setMobileOpen(false)} data-testid="button-menu-shortcuts"><span className="shortcut-number">6</span>shortcuts</button>
            <button className="quick-button" onClick={() => openWindow('settings')} data-testid="button-menu-settings"><span className="shortcut-number">7</span>settings</button>
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
