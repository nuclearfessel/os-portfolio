import { lazy, type ComponentType } from 'react';
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from './foundations';

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

const AccordionDemo = lazyPage(() =>
  import('./demos/accordion').then(({ AccordionDemo }) => AccordionDemo),
);
const AlertDemo = lazyPage(() =>
  import('./demos/alert').then(({ AlertDemo }) => AlertDemo),
);
const AlertDialogDemo = lazyPage(() =>
  import('./demos/alert-dialog').then(({ AlertDialogDemo }) => AlertDialogDemo),
);
const AspectRatioDemo = lazyPage(() =>
  import('./demos/aspect-ratio').then(({ AspectRatioDemo }) => AspectRatioDemo),
);
const AvatarDemo = lazyPage(() =>
  import('./demos/avatar').then(({ AvatarDemo }) => AvatarDemo),
);
const BadgeDemo = lazyPage(() =>
  import('./demos/badge').then(({ BadgeDemo }) => BadgeDemo),
);
const BreadcrumbDemo = lazyPage(() =>
  import('./demos/breadcrumb').then(({ BreadcrumbDemo }) => BreadcrumbDemo),
);
const ButtonDemo = lazyPage(() =>
  import('./demos/button').then(({ ButtonDemo }) => ButtonDemo),
);
const ButtonGroupDemo = lazyPage(() =>
  import('./demos/button-group').then(({ ButtonGroupDemo }) => ButtonGroupDemo),
);
const CalendarDemo = lazyPage(() =>
  import('./demos/calendar').then(({ CalendarDemo }) => CalendarDemo),
);
const CardDemo = lazyPage(() =>
  import('./demos/card').then(({ CardDemo }) => CardDemo),
);
const CarouselDemo = lazyPage(() =>
  import('./demos/carousel').then(({ CarouselDemo }) => CarouselDemo),
);
const ChartDemo = lazyPage(() =>
  import('./demos/chart').then(({ ChartDemo }) => ChartDemo),
);
const CheckboxDemo = lazyPage(() =>
  import('./demos/checkbox').then(({ CheckboxDemo }) => CheckboxDemo),
);
const CollapsibleDemo = lazyPage(() =>
  import('./demos/collapsible').then(({ CollapsibleDemo }) => CollapsibleDemo),
);
const CommandDemo = lazyPage(() =>
  import('./demos/command').then(({ CommandDemo }) => CommandDemo),
);
const ContextMenuDemo = lazyPage(() =>
  import('./demos/context-menu').then(({ ContextMenuDemo }) => ContextMenuDemo),
);
const DialogDemo = lazyPage(() =>
  import('./demos/dialog').then(({ DialogDemo }) => DialogDemo),
);
const DrawerDemo = lazyPage(() =>
  import('./demos/drawer').then(({ DrawerDemo }) => DrawerDemo),
);
const DropdownMenuDemo = lazyPage(() =>
  import('./demos/dropdown-menu').then(
    ({ DropdownMenuDemo }) => DropdownMenuDemo,
  ),
);
const EmptyDemo = lazyPage(() =>
  import('./demos/empty').then(({ EmptyDemo }) => EmptyDemo),
);
const FieldDemo = lazyPage(() =>
  import('./demos/field').then(({ FieldDemo }) => FieldDemo),
);
const FormDemo = lazyPage(() =>
  import('./demos/form').then(({ FormDemo }) => FormDemo),
);
const HoverCardDemo = lazyPage(() =>
  import('./demos/hover-card').then(({ HoverCardDemo }) => HoverCardDemo),
);
const InputDemo = lazyPage(() =>
  import('./demos/input').then(({ InputDemo }) => InputDemo),
);
const InputGroupDemo = lazyPage(() =>
  import('./demos/input-group').then(({ InputGroupDemo }) => InputGroupDemo),
);
const InputOtpDemo = lazyPage(() =>
  import('./demos/input-otp').then(({ InputOtpDemo }) => InputOtpDemo),
);
const ItemDemo = lazyPage(() =>
  import('./demos/item').then(({ ItemDemo }) => ItemDemo),
);
const KbdDemo = lazyPage(() =>
  import('./demos/kbd').then(({ KbdDemo }) => KbdDemo),
);
const MenubarDemo = lazyPage(() =>
  import('./demos/menubar').then(({ MenubarDemo }) => MenubarDemo),
);
const NavigationMenuDemo = lazyPage(() =>
  import('./demos/navigation-menu').then(
    ({ NavigationMenuDemo }) => NavigationMenuDemo,
  ),
);
const PaginationDemo = lazyPage(() =>
  import('./demos/pagination').then(({ PaginationDemo }) => PaginationDemo),
);
const PopoverDemo = lazyPage(() =>
  import('./demos/popover').then(({ PopoverDemo }) => PopoverDemo),
);
const ProgressDemo = lazyPage(() =>
  import('./demos/progress').then(({ ProgressDemo }) => ProgressDemo),
);
const RadioGroupDemo = lazyPage(() =>
  import('./demos/radio-group').then(({ RadioGroupDemo }) => RadioGroupDemo),
);
const ResizableDemo = lazyPage(() =>
  import('./demos/resizable').then(({ ResizableDemo }) => ResizableDemo),
);
const ScrollAreaDemo = lazyPage(() =>
  import('./demos/scroll-area').then(({ ScrollAreaDemo }) => ScrollAreaDemo),
);
const SelectDemo = lazyPage(() =>
  import('./demos/select').then(({ SelectDemo }) => SelectDemo),
);
const SeparatorDemo = lazyPage(() =>
  import('./demos/separator').then(({ SeparatorDemo }) => SeparatorDemo),
);
const SheetDemo = lazyPage(() =>
  import('./demos/sheet').then(({ SheetDemo }) => SheetDemo),
);
const SidebarDemo = lazyPage(() =>
  import('./demos/sidebar').then(({ SidebarDemo }) => SidebarDemo),
);
const SkeletonDemo = lazyPage(() =>
  import('./demos/skeleton').then(({ SkeletonDemo }) => SkeletonDemo),
);
const SliderDemo = lazyPage(() =>
  import('./demos/slider').then(({ SliderDemo }) => SliderDemo),
);
const SonnerDemo = lazyPage(() =>
  import('./demos/sonner').then(({ SonnerDemo }) => SonnerDemo),
);
const SpinnerDemo = lazyPage(() =>
  import('./demos/spinner').then(({ SpinnerDemo }) => SpinnerDemo),
);
const SwitchDemo = lazyPage(() =>
  import('./demos/switch').then(({ SwitchDemo }) => SwitchDemo),
);
const TableDemo = lazyPage(() =>
  import('./demos/table').then(({ TableDemo }) => TableDemo),
);
const TabsDemo = lazyPage(() =>
  import('./demos/tabs').then(({ TabsDemo }) => TabsDemo),
);
const TextareaDemo = lazyPage(() =>
  import('./demos/textarea').then(({ TextareaDemo }) => TextareaDemo),
);
const ToastDemo = lazyPage(() =>
  import('./demos/toast').then(({ ToastDemo }) => ToastDemo),
);
const ToggleDemo = lazyPage(() =>
  import('./demos/toggle').then(({ ToggleDemo }) => ToggleDemo),
);
const ToggleGroupDemo = lazyPage(() =>
  import('./demos/toggle-group').then(({ ToggleGroupDemo }) => ToggleGroupDemo),
);
const TooltipDemo = lazyPage(() =>
  import('./demos/tooltip').then(({ TooltipDemo }) => TooltipDemo),
);
const AccessibilityPage = lazyPage(() =>
  import('./accessibility').then(({ AccessibilityPage }) => AccessibilityPage),
);
const FesOsDemo = lazyPage(() =>
  import('./demos/fes-os').then(({ FesOsDemo }) => FesOsDemo),
);
const GuidelinesDemo = lazyPage(() =>
  import('./demos/guidelines').then(({ GuidelinesDemo }) => GuidelinesDemo),
);
const SettingsDemo = lazyPage(() =>
  import('./demos/settings').then(({ SettingsDemo }) => SettingsDemo),
);

// ── Pattern pages ──────────────────────────────────────────────────────────
const PatternDesktopWindowWorkspace = lazyPage(() =>
  import('./demos/patterns').then(({ PatternDesktopWindowWorkspace }) => PatternDesktopWindowWorkspace),
);
const PatternResponsiveDock = lazyPage(() =>
  import('./demos/patterns').then(({ PatternResponsiveDock }) => PatternResponsiveDock),
);
const PatternDesktopLauncherGrid = lazyPage(() =>
  import('./demos/patterns').then(({ PatternDesktopLauncherGrid }) => PatternDesktopLauncherGrid),
);
const PatternStickyNotes = lazyPage(() =>
  import('./demos/patterns').then(({ PatternStickyNotes }) => PatternStickyNotes),
);
const PatternContextMenus = lazyPage(() =>
  import('./demos/patterns').then(({ PatternContextMenus }) => PatternContextMenus),
);
const PatternProjectCardList = lazyPage(() =>
  import('./demos/patterns').then(({ PatternProjectCardList }) => PatternProjectCardList),
);
const PatternSettingsWindow = lazyPage(() =>
  import('./demos/patterns').then(({ PatternSettingsWindow }) => PatternSettingsWindow),
);
const PatternPersonalizationColors = lazyPage(() =>
  import('./demos/patterns').then(({ PatternPersonalizationColors }) => PatternPersonalizationColors),
);
const PatternAccessibilityPanel = lazyPage(() =>
  import('./demos/patterns').then(({ PatternAccessibilityPanel }) => PatternAccessibilityPanel),
);
const PatternContrastOverride = lazyPage(() =>
  import('./demos/patterns').then(({ PatternContrastOverride }) => PatternContrastOverride),
);
const PatternTransparencySurfaces = lazyPage(() =>
  import('./demos/patterns').then(({ PatternTransparencySurfaces }) => PatternTransparencySurfaces),
);
const PatternSavedStateOwnership = lazyPage(() =>
  import('./demos/patterns').then(({ PatternSavedStateOwnership }) => PatternSavedStateOwnership),
);

export type PreviewEntry = {
  // Globally unique across every group — it is the deep-link slug (`#page=<id>`)
  // and the active-page key. Group-qualify names that repeat across groups
  // (e.g. `brand-icons` vs `components-icons`).
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

export const DESIGN_SYSTEM = {
  title: 'Fes OS Design System',
  description:
    'Foundations, components, and responsive interaction patterns for the Fes Naqvi desktop portfolio in light and dark themes.',
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: 'overview',
  name: 'Overview',
  description: 'The visual foundations and principles that shape this system.',
  Page: OverviewPage,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Fes OS',
    entries: [
      {
        id: 'fes-os-pilot',
        name: 'Portfolio primitives',
        description: 'Actions, labels, status, surfaces, and project cards used by the portfolio.',
        Page: FesOsDemo,
      },
      {
        id: 'fes-os-settings',
        name: 'Settings primitives',
        description: 'Settings sidebar nav, accessible toggle rows, sliders, segmented choices, contrast cards, and color presets.',
        Page: SettingsDemo,
      },
    ],
  },
  {
    name: 'Foundations',
    entries: [
      {
        id: 'color-roles',
        name: 'Color roles',
        description: 'Brand, semantic, text, background, and border colors.',
        Page: ColorsPage,
      },
      {
        id: 'type-scale',
        name: 'Typography',
        description: 'Font families, headings, body text, labels, and captions.',
        Page: FontsPage,
      },
      {
        id: 'spacing-radius',
        name: 'Spacing & radius',
        description: 'The spacing rhythm and corner treatments used by the system.',
        Page: LayoutPage,
      },
      {
        id: 'fes-os-guidelines',
        name: 'Iconography & motion',
        description: 'Keyline icon rules, motion timing, and responsive workspace composition.',
        Page: GuidelinesDemo,
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        description: 'WCAG AA targets and the accessibility rules followed by the portfolio.',
        Page: AccessibilityPage,
      },
    ],
  },
  {
    name: 'Actions',
    entries: [
      {
        id: 'button',
        name: 'Buttons',
        description: 'Button variants, sizes, icon treatments, and states.',
        Page: ButtonDemo,
      },
      {
        id: 'button-group',
        name: 'Button group',
        description: 'Attached actions, labels, and separators.',
        Page: ButtonGroupDemo,
      },
      {
        id: 'toggle',
        name: 'Toggle',
        description: 'Pressed controls in multiple variants and sizes.',
        Page: ToggleDemo,
      },
      {
        id: 'toggle-group',
        name: 'Toggle group',
        description: 'Single and multiple selection toggle sets.',
        Page: ToggleGroupDemo,
      },
    ],
  },
  {
    name: 'Forms & inputs',
    entries: [
      {
        id: 'input',
        name: 'Input',
        description: 'Text, email, file, and validation states.',
        Page: InputDemo,
      },
      {
        id: 'input-group',
        name: 'Input group',
        description: 'Inputs with inline and block addons.',
        Page: InputGroupDemo,
      },
      {
        id: 'input-otp',
        name: 'Input OTP',
        description: 'Segmented one-time code entry.',
        Page: InputOtpDemo,
      },
      {
        id: 'textarea',
        name: 'Textarea',
        description: 'Multiline text entry and states.',
        Page: TextareaDemo,
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        description: 'Checked, unchecked, indeterminate group state, and disabled options.',
        Page: CheckboxDemo,
      },
      {
        id: 'radio-group',
        name: 'Radio group',
        description: 'Exclusive choices with labels and disabled states.',
        Page: RadioGroupDemo,
      },
      {
        id: 'select',
        name: 'Select',
        description: 'Selection controls, grouped options, and disabled states.',
        Page: SelectDemo,
      },
      {
        id: 'slider',
        name: 'Slider',
        description: 'Single values, ranges, and disabled states.',
        Page: SliderDemo,
      },
      {
        id: 'switch',
        name: 'Switch',
        description: 'Binary preference controls and states.',
        Page: SwitchDemo,
      },
      {
        id: 'calendar',
        name: 'Calendar',
        description: 'Date picker supporting single, range, and multi-date modes.',
        Page: CalendarDemo,
      },
      {
        id: 'field',
        name: 'Field',
        description: 'Labels, descriptions, errors, and grouped fields.',
        Page: FieldDemo,
      },
      {
        id: 'form',
        name: 'Form',
        description: 'Validated form composition with labels and messages.',
        Page: FormDemo,
      },
    ],
  },
  {
    name: 'Overlays',
    entries: [
      {
        id: 'dialog',
        name: 'Dialog',
        description: 'Modal content with header, footer, and actions.',
        Page: DialogDemo,
      },
      {
        id: 'alert-dialog',
        name: 'Alert dialog',
        description: 'Confirmation for consequential actions.',
        Page: AlertDialogDemo,
      },
      {
        id: 'sheet',
        name: 'Sheet',
        description: 'Edge-aligned overlay panels.',
        Page: SheetDemo,
      },
      {
        id: 'drawer',
        name: 'Drawer',
        description: 'Touch-friendly bottom overlay content.',
        Page: DrawerDemo,
      },
      {
        id: 'popover',
        name: 'Popover',
        description: 'Anchored interactive content.',
        Page: PopoverDemo,
      },
      {
        id: 'hover-card',
        name: 'Hover card',
        description: 'Rich context revealed on hover.',
        Page: HoverCardDemo,
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        description: 'Brief labels for focused or hovered controls.',
        Page: TooltipDemo,
      },
      {
        id: 'command',
        name: 'Command',
        description: 'Searchable keyboard-first command lists.',
        Page: CommandDemo,
      },
    ],
  },
  {
    name: 'Menus & navigation',
    entries: [
      {
        id: 'dropdown-menu',
        name: 'Dropdown menu',
        description: 'Actions, choices, shortcuts, and submenus.',
        Page: DropdownMenuDemo,
      },
      {
        id: 'context-menu',
        name: 'Context menu',
        description: 'Right-click actions and nested choices.',
        Page: ContextMenuDemo,
      },
      {
        id: 'menubar',
        name: 'Menubar',
        description: 'Desktop-style application menus.',
        Page: MenubarDemo,
      },
      {
        id: 'navigation-menu',
        name: 'Navigation menu',
        description: 'Primary navigation with rich flyouts.',
        Page: NavigationMenuDemo,
      },
      {
        id: 'breadcrumb',
        name: 'Breadcrumb',
        description: 'Hierarchical location and parent links.',
        Page: BreadcrumbDemo,
      },
      {
        id: 'pagination',
        name: 'Pagination',
        description: 'Previous, next, page, and overflow controls.',
        Page: PaginationDemo,
      },
      {
        id: 'tabs',
        name: 'Tabs',
        description: 'Switch between related content views.',
        Page: TabsDemo,
      },
      {
        id: 'sidebar',
        name: 'Sidebar',
        description: 'Bounded application navigation and content layout.',
        Page: SidebarDemo,
      },
    ],
  },
  {
    name: 'Data display',
    entries: [
      {
        id: 'avatar',
        name: 'Avatar',
        description: 'Profile images, fallbacks, and sizes.',
        Page: AvatarDemo,
      },
      {
        id: 'badge',
        name: 'Badge',
        description: 'Compact status and category labels.',
        Page: BadgeDemo,
      },
      {
        id: 'card',
        name: 'Card',
        description: 'Grouped content with header, body, and footer.',
        Page: CardDemo,
      },
      {
        id: 'table',
        name: 'Table',
        description: 'Structured tabular data and summaries.',
        Page: TableDemo,
      },
      {
        id: 'accordion',
        name: 'Accordion',
        description: 'Expandable sections for progressive disclosure.',
        Page: AccordionDemo,
      },
      {
        id: 'collapsible',
        name: 'Collapsible',
        description: 'A compact expandable content region.',
        Page: CollapsibleDemo,
      },
      {
        id: 'carousel',
        name: 'Carousel',
        description: 'Keyboard-accessible paged content.',
        Page: CarouselDemo,
      },
      {
        id: 'item',
        name: 'Item',
        description: 'Flexible rows with media, metadata, and actions.',
        Page: ItemDemo,
      },
      {
        id: 'empty',
        name: 'Empty state',
        description: 'Guidance and actions when content is absent.',
        Page: EmptyDemo,
      },
      {
        id: 'kbd',
        name: 'Keyboard key',
        description: 'Individual and grouped keyboard shortcuts.',
        Page: KbdDemo,
      },
      {
        id: 'aspect-ratio',
        name: 'Aspect ratio',
        description: 'Responsive proportional media containers.',
        Page: AspectRatioDemo,
      },
    ],
  },
  {
    name: 'Feedback',
    entries: [
      {
        id: 'alert',
        name: 'Alert',
        description: 'Informational and destructive messages.',
        Page: AlertDemo,
      },
      {
        id: 'progress',
        name: 'Progress',
        description: 'Completion indicators for ongoing work.',
        Page: ProgressDemo,
      },
      {
        id: 'skeleton',
        name: 'Skeleton',
        description: 'Placeholder shapes for loading content.',
        Page: SkeletonDemo,
      },
      {
        id: 'spinner',
        name: 'Spinner',
        description: 'Indeterminate loading indicators.',
        Page: SpinnerDemo,
      },
      {
        id: 'toast',
        name: 'Toast',
        description: 'Provider-backed transient notifications and actions.',
        Page: ToastDemo,
      },
      {
        id: 'sonner',
        name: 'Sonner',
        description: 'Stacked notifications with status and actions.',
        Page: SonnerDemo,
      },
    ],
  },
  {
    name: 'Structure',
    entries: [
      {
        id: 'separator',
        name: 'Separator',
        description: 'Horizontal and vertical visual dividers.',
        Page: SeparatorDemo,
      },
      {
        id: 'scroll-area',
        name: 'Scroll area',
        description: 'Bounded vertical and horizontal scrolling.',
        Page: ScrollAreaDemo,
      },
      {
        id: 'resizable',
        name: 'Resizable panels',
        description: 'Bounded split panes with draggable handles.',
        Page: ResizableDemo,
      },
    ],
  },
  { name: 'Content', entries: [] },
  {
    name: 'Charts',
    entries: [
      {
        id: 'chart',
        name: 'Chart',
        description: 'Configured data visualization, tooltip, and legend.',
        Page: ChartDemo,
      },
    ],
  },
  { name: 'Motion', entries: [] },
  { name: 'Applied examples', entries: [] },
  {
    name: 'Patterns',
    entries: [
      {
        id: 'pattern-desktop-window',
        name: 'Desktop window workspace',
        description: 'Floating windows, geometry management, drag/resize, and transparency.',
        Page: PatternDesktopWindowWorkspace,
      },
      {
        id: 'pattern-responsive-dock',
        name: 'Responsive Dock navigation',
        description: 'DockItem label switching between tooltip (desktop) and inline (mobile/tablet).',
        Page: PatternResponsiveDock,
      },
      {
        id: 'pattern-launcher-grid',
        name: 'Desktop launcher grid',
        description: 'User-arranged launcher icons that open/focus windows.',
        Page: PatternDesktopLauncherGrid,
      },
      {
        id: 'pattern-sticky-notes',
        name: 'Sticky notes',
        description: 'Free-floating rotatable note surfaces on the desktop canvas.',
        Page: PatternStickyNotes,
      },
      {
        id: 'pattern-context-menus',
        name: 'Context menus',
        description: 'Two-tier context menu implementation: Radix and custom-positioned.',
        Page: PatternContextMenus,
      },
      {
        id: 'pattern-project-card-list',
        name: 'Project-card list',
        description: 'Portfolio project list with indexed cards, accents, and actions.',
        Page: PatternProjectCardList,
      },
      {
        id: 'pattern-settings-window',
        name: 'Settings window & sidebar',
        description: 'Two-pane settings layout with nav sidebar and preference controls.',
        Page: PatternSettingsWindow,
      },
      {
        id: 'pattern-personalization-colors',
        name: 'Personalization color presets',
        description: 'Wallpaper color swatch presets with custom picker exclusion logic.',
        Page: PatternPersonalizationColors,
      },
      {
        id: 'pattern-accessibility-panel',
        name: 'Accessibility preference panel',
        description: 'Display, motion, and contrast preference controls with dependency rules.',
        Page: PatternAccessibilityPanel,
      },
      {
        id: 'pattern-contrast-override',
        name: 'Contrast override behavior',
        description: 'How data-contrast re-maps semantic tokens to fixed low/high-contrast palettes.',
        Page: PatternContrastOverride,
      },
      {
        id: 'pattern-transparency-surfaces',
        name: 'Transparency surfaces',
        description: 'fes-surface-translucent: frosted-glass backdrop-filter with preference integration.',
        Page: PatternTransparencySurfaces,
      },
      {
        id: 'pattern-saved-state',
        name: 'Saved-state ownership',
        description: 'What the design system provides vs. what the consuming product must own.',
        Page: PatternSavedStateOwnership,
      },
    ],
  },
];

export const ALL_ENTRIES: PreviewEntry[] = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];

// ── Duplicate-id guard ────────────────────────────────────────────────────────
// A duplicate id makes one page unreachable; fail loudly rather than shipping
// a dead deep-link.
const duplicateIds = ALL_ENTRIES.map((entry) => entry.id).filter(
  (id, index, ids) => ids.indexOf(id) !== index,
);
if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate preview page id(s): ${[...new Set(duplicateIds)].join(
      ', ',
    )}. Every page id must be unique across all nav groups.`,
  );
}

// ── Documentation coverage classification ─────────────────────────────────────
// Every non-overview registry entry must be explicitly classified here.
// Missing entries are surfaced as a console warning in development.
//
// Classifications:
//   "interactive+inline" — demo has hand-written DocSpec section (Button, Calendar)
//   "interactive+canonical" — demo appends CanonicalSpec from docs/?raw imports
//   "canonical-only" — documentation-only page rendering canonical Markdown (Patterns, Foundations)
//   "uncovered" — no spec section yet (should be empty)

export type DocCoverage = 'interactive+inline' | 'interactive+canonical' | 'canonical-only' | 'uncovered';

export const DOC_COVERAGE_MAP: Record<string, DocCoverage> = {
  // ── Fes OS ──────────────────────────────────────────────────────────────────
  'fes-os-pilot': 'interactive+canonical',
  'fes-os-settings': 'interactive+canonical',
  // ── Foundations ─────────────────────────────────────────────────────────────
  'color-roles': 'interactive+canonical',
  'type-scale': 'interactive+canonical',
  'spacing-radius': 'interactive+canonical',
  'fes-os-guidelines': 'interactive+canonical',
  'accessibility': 'interactive+canonical',
  // ── Actions ─────────────────────────────────────────────────────────────────
  'button': 'interactive+inline',
  'button-group': 'interactive+canonical',
  'toggle': 'interactive+canonical',
  'toggle-group': 'interactive+canonical',
  // ── Forms & inputs ──────────────────────────────────────────────────────────
  'input': 'interactive+canonical',
  'input-group': 'interactive+canonical',
  'input-otp': 'interactive+canonical',
  'textarea': 'interactive+canonical',
  'checkbox': 'interactive+canonical',
  'radio-group': 'interactive+canonical',
  'select': 'interactive+canonical',
  'slider': 'interactive+canonical',
  'switch': 'interactive+canonical',
  'calendar': 'interactive+inline',
  'field': 'interactive+canonical',
  'form': 'interactive+canonical',
  // ── Overlays ─────────────────────────────────────────────────────────────────
  'dialog': 'interactive+canonical',
  'alert-dialog': 'interactive+canonical',
  'sheet': 'interactive+canonical',
  'drawer': 'interactive+canonical',
  'popover': 'interactive+canonical',
  'hover-card': 'interactive+canonical',
  'tooltip': 'interactive+canonical',
  'command': 'interactive+canonical',
  // ── Menus & navigation ───────────────────────────────────────────────────────
  'dropdown-menu': 'interactive+canonical',
  'context-menu': 'interactive+canonical',
  'menubar': 'interactive+canonical',
  'navigation-menu': 'interactive+canonical',
  'breadcrumb': 'interactive+canonical',
  'pagination': 'interactive+canonical',
  'tabs': 'interactive+canonical',
  'sidebar': 'interactive+canonical',
  // ── Data display ─────────────────────────────────────────────────────────────
  'avatar': 'interactive+canonical',
  'badge': 'interactive+canonical',
  'card': 'interactive+canonical',
  'table': 'interactive+canonical',
  'accordion': 'interactive+canonical',
  'collapsible': 'interactive+canonical',
  'carousel': 'interactive+canonical',
  'item': 'interactive+canonical',
  'empty': 'interactive+canonical',
  'kbd': 'interactive+canonical',
  'aspect-ratio': 'interactive+canonical',
  // ── Feedback ─────────────────────────────────────────────────────────────────
  'alert': 'interactive+canonical',
  'progress': 'interactive+canonical',
  'skeleton': 'interactive+canonical',
  'spinner': 'interactive+canonical',
  'toast': 'interactive+canonical',
  'sonner': 'interactive+canonical',
  // ── Structure ────────────────────────────────────────────────────────────────
  'separator': 'interactive+canonical',
  'scroll-area': 'interactive+canonical',
  'resizable': 'interactive+canonical',
  // ── Charts ───────────────────────────────────────────────────────────────────
  'chart': 'interactive+canonical',
  // ── Patterns ─────────────────────────────────────────────────────────────────
  'pattern-desktop-window': 'canonical-only',
  'pattern-responsive-dock': 'canonical-only',
  'pattern-launcher-grid': 'canonical-only',
  'pattern-sticky-notes': 'canonical-only',
  'pattern-context-menus': 'canonical-only',
  'pattern-project-card-list': 'canonical-only',
  'pattern-settings-window': 'canonical-only',
  'pattern-personalization-colors': 'canonical-only',
  'pattern-accessibility-panel': 'canonical-only',
  'pattern-contrast-override': 'canonical-only',
  'pattern-transparency-surfaces': 'canonical-only',
  'pattern-saved-state': 'canonical-only',
};

// Development-time coverage audit
if (import.meta.env.DEV) {
  const nonOverviewIds = ALL_ENTRIES
    .filter(e => e.id !== 'overview')
    .map(e => e.id);

  const uncovered = nonOverviewIds.filter(id => {
    const classification = DOC_COVERAGE_MAP[id];
    return !classification || classification === 'uncovered';
  });

  if (uncovered.length > 0) {
    console.warn(
      `[design-system] Documentation coverage gap — ${uncovered.length} page(s) have no doc classification:\n` +
      uncovered.map(id => `  • ${id}`).join('\n') +
      '\n  Add them to DOC_COVERAGE_MAP in registry.tsx.',
    );
  }
}
