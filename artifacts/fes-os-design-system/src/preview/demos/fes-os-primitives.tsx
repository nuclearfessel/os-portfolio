/**
 * Fes OS Primitives — unified directory page.
 *
 * Organises all 18 Fes OS + Settings primitives into a compact, scannable
 * directory. Each primitive shows its component name, concise purpose, and a
 * link button to its dedicated spec/demo page. No inline demos are shown here;
 * individual detail pages remain deep-linkable at their existing hashes.
 */

import { Button } from '../../components/ui/button';
import { Surface } from '../../components/ui/fes-os';
import { SectionLabel } from '../../components/ui/fes-os';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';

// ── Type ─────────────────────────────────────────────────────────────────────

type PrimitiveEntry = {
  id: string;
  name: string;
  purpose: string;
};

// ── Desktop primitives (10) ───────────────────────────────────────────────────

const DESKTOP_PRIMITIVES: PrimitiveEntry[] = [
  {
    id: 'action-button',
    name: 'ActionButton',
    purpose: 'Compact action primitive for window quick-actions, project links, and calls to action. Primary, secondary, and danger variants.',
  },
  {
    id: 'section-label',
    name: 'SectionLabel',
    purpose: 'Compact mono kicker label used above headings, as breadcrumb-style namespaces, and as category annotations.',
  },
  {
    id: 'status-indicator',
    name: 'StatusIndicator',
    purpose: 'Dot-and-text presence indicator with online, idle, and danger tones for the desktop menubar.',
  },
  {
    id: 'surface',
    name: 'Surface',
    purpose: 'Semantic surface container with flat, raised, and floating elevation levels.',
  },
  {
    id: 'project-card',
    name: 'ProjectCard',
    purpose: 'Indexed portfolio project card with accent color, metadata tag, and an optional action slot.',
  },
  {
    id: 'window-surface',
    name: 'WindowSurface',
    purpose: 'Visual shell of a desktop application window — border, background, rounded corners, and large shadow.',
  },
  {
    id: 'dock-item',
    name: 'DockItem / DockItemLabel',
    purpose: 'Individual dock button with tooltip (desktop) or inline (mobile/tablet) label presentation modes.',
  },
  {
    id: 'desktop-launcher',
    name: 'DesktopLauncher',
    purpose: 'Draggable desktop icon that opens or focuses a window. Applies is-open class when the target window is active.',
  },
  {
    id: 'sticky-note-surface',
    name: 'StickyNoteSurface',
    purpose: 'Surface shell for free-floating rotatable sticky notes on the desktop canvas.',
  },
  {
    id: 'context-menu-surface',
    name: 'ContextMenuSurface',
    purpose: 'Surface shell for custom-positioned desktop context menus — popover background, border, and shadow.',
  },
];

// ── Settings primitives (8) ───────────────────────────────────────────────────

const SETTINGS_PRIMITIVES: PrimitiveEntry[] = [
  {
    id: 'settings-nav',
    name: 'SettingsNav',
    purpose: 'Sidebar navigation for a settings window — SettingsNavSection landmark and SettingsNavItem buttons with active state.',
  },
  {
    id: 'settings-toggle-row',
    name: 'SettingsToggleRow',
    purpose: 'Accessible settings preference row with label, description, and a pill switch using role="switch" and aria-checked.',
  },
  {
    id: 'settings-slider-group',
    name: 'SettingsSliderGroup',
    purpose: 'Range slider group with live percentage output, guidance labels, and a live-region output element.',
  },
  {
    id: 'settings-segmented-choice',
    name: 'SettingsSegmentedChoice',
    purpose: 'Segmented radio pill group for exclusive choices — Less, Default, More or any set of options.',
  },
  {
    id: 'settings-contrast-card',
    name: 'SettingsContrastCard',
    purpose: 'Selectable contrast theme card — Standard, Low, and High contrast — with visual preview miniature.',
  },
  {
    id: 'settings-color-preset',
    name: 'SettingsColorPreset',
    purpose: 'Selectable solid-color swatch for wallpaper and background personalization with selected state and focus ring.',
  },
  {
    id: 'settings-divider',
    name: 'SettingsDivider',
    purpose: 'Horizontal rule separating settings sections with consistent vertical rhythm.',
  },
  {
    id: 'settings-section-header',
    name: 'SettingsSectionHeader',
    purpose: 'Label and optional description header block for settings sub-sections.',
  },
];

// ── Assertion: all 18 detail IDs are accounted for ───────────────────────────

export const FES_OS_PRIMITIVE_IDS = [
  ...DESKTOP_PRIMITIVES.map((p) => p.id),
  ...SETTINGS_PRIMITIVES.map((p) => p.id),
] as const;

if (import.meta.env.DEV) {
  const expected18 = [
    'action-button', 'section-label', 'status-indicator', 'surface',
    'project-card', 'window-surface', 'dock-item', 'desktop-launcher',
    'sticky-note-surface', 'context-menu-surface',
    'settings-nav', 'settings-toggle-row', 'settings-slider-group',
    'settings-segmented-choice', 'settings-contrast-card',
    'settings-color-preset', 'settings-divider', 'settings-section-header',
  ] as const;

  const ids = new Set(FES_OS_PRIMITIVE_IDS as readonly string[]);
  const missing = expected18.filter((id) => !ids.has(id));
  if (missing.length > 0) {
    console.error(
      `[fes-os-primitives] Directory is missing ${missing.length} primitive(s):\n` +
      missing.map((id) => `  • ${id}`).join('\n'),
    );
  }
  if (FES_OS_PRIMITIVE_IDS.length !== 18) {
    console.error(
      `[fes-os-primitives] Expected 18 primitives, found ${FES_OS_PRIMITIVE_IDS.length}.`,
    );
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

function navigateTo(id: string) {
  window.location.hash = new URLSearchParams({ page: id }).toString();
}

// ── PrimitiveRow ──────────────────────────────────────────────────────────────

function PrimitiveRow({ entry }: { entry: PrimitiveEntry }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      {/* Name + purpose */}
      <div className="min-w-0 flex-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => navigateTo(entry.id)}
              className="text-left font-mono text-[0.8125rem] font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:rounded-sm"
            >
              {entry.name}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            Open {entry.name} detail page
          </TooltipContent>
        </Tooltip>
        <p className="mt-0.5 text-[0.75rem] leading-relaxed text-muted-foreground">
          {entry.purpose}
        </p>
      </div>

      {/* Action */}
      <div className="shrink-0 pt-0.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateTo(entry.id)}
          className="h-7 px-2.5 text-xs"
          aria-label={`View ${entry.name} spec`}
        >
          Spec
        </Button>
      </div>
    </div>
  );
}

// ── PrimitiveGroup ────────────────────────────────────────────────────────────

function PrimitiveGroup({
  label,
  count,
  primitives,
}: {
  label: string;
  count: number;
  primitives: PrimitiveEntry[];
}) {
  return (
    <Surface className="overflow-hidden p-0">
      {/* Group header */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-baseline gap-3">
          <SectionLabel>{label}</SectionLabel>
        </div>
        <span className="font-mono text-[0.625rem] font-medium tabular-nums text-muted-foreground">
          {count}
        </span>
      </div>

      {/* Primitive rows */}
      <div className="divide-y divide-border/50 px-5">
        {primitives.map((entry) => (
          <PrimitiveRow key={entry.id} entry={entry} />
        ))}
      </div>
    </Surface>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function FesOsPrimitivesPage() {
  return (
    <div className="space-y-6">
      {/* Preamble */}
      <section className="rounded-xl border bg-card p-5 text-card-foreground">
        <SectionLabel>components / fes os</SectionLabel>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          18 primitives in two families. Desktop primitives shape the portfolio
          canvas — windows, dock, launchers, surfaces, and actions. Settings
          primitives power the preference window — navigation, toggles, sliders,
          segmented choices, contrast cards, and color presets.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Each row links to a focused demo and canonical specification. These
          pages are publicly accessible by direct link and are not hidden or
          internal.
        </p>
      </section>

      {/* Desktop primitives */}
      <PrimitiveGroup
        label="desktop primitives"
        count={DESKTOP_PRIMITIVES.length}
        primitives={DESKTOP_PRIMITIVES}
      />

      {/* Settings primitives */}
      <PrimitiveGroup
        label="settings primitives"
        count={SETTINGS_PRIMITIVES.length}
        primitives={SETTINGS_PRIMITIVES}
      />
    </div>
  );
}
