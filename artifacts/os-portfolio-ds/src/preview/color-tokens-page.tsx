/**
 * Color Tokens page — EightShapes taxonomy preview with osp namespace.
 *
 * Imports tokens.json directly (resolveJsonModule: true) to read the exact
 * authored alias references ({color.primitive.xxx}, {color.light.xxx}, etc.)
 * rather than guessing aliases by matching resolved hex values. Hex values for
 * display come from the generated tokens object which has already resolved them.
 *
 * Proposed naming only — tokens.json, src/index.css, and src/generated/tokens.tsx
 * have not been renamed. Generated spacing/radius CSS already uses --osp-; color
 * names are proposed and not yet renamed.
 */

import tokensJson from '../../tokens.json';
import { tokens } from '../generated/tokens';
import { Separator } from '../components/ui/separator';
import { SectionLabel } from '../components/ui/os-portfolio';

// ── JSON shape helpers ────────────────────────────────────────────────────────

// Extract the primitive key from a DTCG reference like "{color.primitive.teal}"
function refToPrimKey(ref: string): string {
  // "{color.primitive.teal}" → "teal"
  return ref.replace(/^\{color\.primitive\./, '').replace(/\}$/, '');
}

// Extract the semantic key from a DTCG reference like "{color.light.primary}"
function refToSemanticKey(ref: string): string {
  // "{color.light.primary}" → "primary"  |  "{color.dark.muted}" → "muted"
  return ref.replace(/^\{color\.(light|dark)\./, '').replace(/\}$/, '');
}

// Type helpers for the JSON shape
type DtcgLeaf = { $value: string; $description?: string };
type PrimitiveMap = Record<string, DtcgLeaf>;
type SemanticMap = Record<string, DtcgLeaf>;
type ComponentPropMap = Record<string, DtcgLeaf>;
type ComponentMap = Record<string, ComponentPropMap>;

const primJson = tokensJson.color.primitive as unknown as PrimitiveMap;
const lightJson = tokensJson.color.light as unknown as SemanticMap;
const darkJson = tokensJson.color.dark as unknown as SemanticMap;
const compLightJson = tokensJson.color.component.light as unknown as ComponentMap;
const compDarkJson = tokensJson.color.component.dark as unknown as ComponentMap;

// ── EightShapes proposed taxonomy names ──────────────────────────────────────
//
// Namespace: osp
//
// Primitive:  osp.color.palette.<name>
// Semantic:   osp.color.<property>[.<concept>].<mode>
// Component:  osp.<component>.<element>.color.<property>[.<variant|state>].<mode>
//
// The 33 current semantic camelCase keys → proposed dot-path segments (no mode suffix — added at call site)

const SEMANTIC_PROPOSED: Record<string, string> = {
  // Background & surface
  background:        'background.canvas',
  foreground:        'foreground.default',
  card:              'background.surface',
  cardForeground:    'foreground.surface',
  popover:           'background.overlay',
  popoverForeground: 'foreground.overlay',
  // Interactive & brand
  primary:           'background.action.primary',
  primaryForeground: 'foreground.action.primary',
  secondary:         'background.action.secondary',
  secondaryForeground:'foreground.action.secondary',
  muted:             'background.muted',
  mutedForeground:   'foreground.muted',
  accent:            'background.accent',
  accentForeground:  'foreground.accent',
  ring:              'border.focus',
  // Status
  destructive:       'background.status.danger',
  destructiveForeground:'foreground.status.danger',
  // Borders & inputs
  border:            'border.default',
  input:             'border.input',
  // Charts
  chart1:            'background.chart.1',
  chart2:            'background.chart.2',
  chart3:            'background.chart.3',
  chart4:            'background.chart.4',
  chart5:            'background.chart.5',
  // Sidebar system
  sidebar:           'background.sidebar',
  sidebarForeground: 'foreground.sidebar',
  sidebarBorder:     'border.sidebar',
  sidebarPrimary:    'background.sidebar.primary',
  sidebarPrimaryForeground:'foreground.sidebar.primary',
  sidebarAccent:     'background.sidebar.accent',
  sidebarAccentForeground:'foreground.sidebar.accent',
  sidebarRing:       'border.sidebar.focus',
  // Window chrome
  windowTitleForeground:'foreground.window-title',
};

// Component: source camelCase key → proposed kebab display name + element
// Format: { displayName, element }
// Element is the sub-part of the component (container, icon, label, etc.)
const COMPONENT_META: Record<string, { display: string; element: string; group: string }> = {
  actionButton:    { display: 'action-button', element: 'container', group: 'Shared' },
  accordion:       { display: 'accordion',     element: 'container', group: 'Shared' },
  dialog:          { display: 'dialog',        element: 'container', group: 'Shared' },
  separator:       { display: 'separator',     element: 'rule',      group: 'Shared' },
  toast:           { display: 'toast',         element: 'container', group: 'Shared' },
  tooltip:         { display: 'tooltip',       element: 'container', group: 'Shared' },
  contextMenu:     { display: 'context-menu',  element: 'container', group: 'Shared' },
  desktopLauncher: { display: 'desktop-launcher', element: 'container', group: 'Desktop OS' },
  dock:            { display: 'dock',          element: 'container', group: 'Desktop OS' },
  dockLabel:       { display: 'dock-label',    element: 'label',     group: 'Desktop OS' },
  projectCard:     { display: 'project-card',  element: 'container', group: 'Desktop OS' },
  sectionLabel:    { display: 'section-label', element: 'container', group: 'Desktop OS' },
  statusIndicator: { display: 'status-indicator', element: 'container', group: 'Desktop OS' },
  stickyNoteSurface:{ display: 'sticky-note-surface', element: 'container', group: 'Desktop OS' },
  genericSurface:  { display: 'generic-surface', element: 'container', group: 'Desktop OS' },
  windowSurface:   { display: 'window-surface', element: 'container', group: 'Desktop OS' },
  systemBar:       { display: 'system-bar',    element: 'container', group: 'Desktop OS' },
  settingsControls:{ display: 'settings-controls', element: 'container', group: 'Desktop OS' },
  colorPicker:     { display: 'color-picker',  element: 'container', group: 'Desktop OS' },
  terminal:        { display: 'terminal',      element: 'container', group: 'Desktop OS' },
  contactCta:      { display: 'contact-cta',   element: 'container', group: 'Desktop OS' },
};

// Component property → proposed property segment in EightShapes name
// Some props need an explicit segment mapping when the camelCase isn't direct
const COMP_PROP_SEGMENT: Record<string, string> = {
  background:        'background',
  foreground:        'foreground',
  border:            'border',
  surface:           'background',
  icon:              'foreground.icon',
  overlay:           'background.overlay',
  success:           'background.status.success',
  error:             'background.status.error',
  danger:            'background.status.danger',
  warning:           'background.status.warning',
  idle:              'foreground.status.idle',
  hover:             'background.hover',
  active:            'background.active',
  focus:             'border.focus',
  ring:              'border.focus',
  label:             'foreground.label',
  itemHover:         'background.item.hover',
  separator:         'border.separator',
  iconAccent:        'foreground.icon.accent',
  selection:         'background.selection',
  muted:             'foreground.muted',
  link:              'foreground.link',
  accent:            'background.accent',
  titleBar:          'background.title-bar',
  titleForeground:   'foreground.title-bar',
  control:           'background.control',
  controlForeground: 'foreground.control',
  swatchBorder:      'border.swatch',
  prompt:            'foreground.prompt',
  cursor:            'background.cursor',
  selection2:        'background.selection',
};

function compPropSegment(prop: string): string {
  return COMP_PROP_SEGMENT[prop] ?? prop.replace(/([A-Z])/g, (m) => `.${m.toLowerCase()}`);
}

// Build the proposed EightShapes token name for a component token
// osp.<display>.<element>.color.<prop-segment>.<mode>
function compTokenName(compKey: string, prop: string, mode: 'light' | 'dark'): string {
  const meta = COMPONENT_META[compKey];
  if (!meta) return `osp.${compKey}.container.color.${prop}.${mode}`;
  return `osp.${meta.display}.${meta.element}.color.${compPropSegment(prop)}.${mode}`;
}

// Build the proposed EightShapes token name for a semantic token
// osp.color.<property-path>.<mode>
function semanticTokenName(key: string, mode: 'light' | 'dark'): string {
  const path = SEMANTIC_PROPOSED[key] ?? key;
  return `osp.color.${path}.${mode}`;
}

// Primitive source key → proposed palette family and scale.
const PRIMITIVE_PROPOSED: Record<string, string> = {
  lightCanvas: 'sage.075',
  ink: 'navy.900',
  sageBorder: 'sage.400',
  paper: 'sage.025',
  lightPopover: 'sage.050',
  teal: 'teal.700',
  sageSurface: 'sage.200',
  sageMuted: 'sage.150',
  slateMuted: 'slate.600',
  coral: 'coral.700',
  white: 'neutral.0',
  redDanger: 'red.600',
  sageInput: 'sage.500',
  tealChart: 'teal.500',
  violet: 'violet.600',
  amber: 'amber.600',
  sageAccent: 'sage.300',
  windowLight: 'neutral.650',
  navy: 'navy.950',
  lavenderText: 'lavender.050',
  indigoBorder: 'indigo.600',
  indigoCard: 'indigo.850',
  indigoPopover: 'indigo.900',
  lime: 'lime.400',
  indigoSurface: 'indigo.750',
  lavenderMuted: 'lavender.400',
  salmon: 'coral.300',
  coralDanger: 'coral.500',
  indigoInput: 'indigo.550',
  cyan: 'cyan.300',
  purple: 'purple.400',
  gold: 'gold.400',
  indigoSidebar: 'indigo.925',
  windowDark: 'neutral.400',
};

// Primitive: osp.color.palette.<family>.<scale>
function primTokenName(key: string): string {
  return `osp.color.palette.${PRIMITIVE_PROPOSED[key] ?? key}`;
}

// Filter helper — skip DTCG meta-keys like $description, $type
function tokenKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).filter((k) => !k.startsWith('$'));
}

// ── Build data from JSON + resolved tokens ─────────────────────────────────────

// Primitives
const PRIMITIVES = tokenKeys(primJson).map((key) => ({
  key,
  tokenName: primTokenName(key),
  hex: (tokens.color.primitive as Record<string, string>)[key],
}));

// Semantics — exact alias from JSON
const LIGHT_SEMANTICS = tokenKeys(lightJson).map((key) => {
  const ref = lightJson[key].$value; // e.g. "{color.primitive.teal}"
  const primKey = refToPrimKey(ref);
  const primAlias = primTokenName(primKey);
  return {
    key,
    tokenName: semanticTokenName(key, 'light'),
    sourceKey: key,
    hex: (tokens.color.light as Record<string, string>)[key],
    primAlias,          // exact, from JSON reference
    primKey,
  };
});

const DARK_SEMANTICS = tokenKeys(darkJson).map((key) => {
  const ref = darkJson[key].$value;
  const primKey = refToPrimKey(ref);
  const primAlias = primTokenName(primKey);
  return {
    key,
    tokenName: semanticTokenName(key, 'dark'),
    sourceKey: key,
    hex: (tokens.color.dark as Record<string, string>)[key],
    primAlias,
    primKey,
  };
});

const darkSemanticByKey = Object.fromEntries(DARK_SEMANTICS.map((e) => [e.key, e]));

// Component tokens — exact alias from JSON
type CompTokenEntry = {
  compKey: string;
  prop: string;
  tokenName: string;
  hex: string;
  semanticKey: string;     // exact sourced key
  semanticAlias: string;   // proposed EightShapes name of aliased semantic
  mode: 'light' | 'dark';
};

function buildCompEntries(mode: 'light' | 'dark', compMap: ComponentMap): CompTokenEntry[] {
  const entries: CompTokenEntry[] = [];
  const resolvedComp = (mode === 'light' ? tokens.color.component.light : tokens.color.component.dark) as Record<string, Record<string, string>>;
  for (const compKey of tokenKeys(compMap as unknown as Record<string, unknown>)) {
    const props = compMap[compKey];
    if (!props) continue;
    for (const prop of tokenKeys(props as unknown as Record<string, unknown>)) {
      const leaf = props[prop];
      if (!leaf?.$value) continue;
      const ref = leaf.$value; // e.g. "{color.light.primary}"
      const semKey = refToSemanticKey(ref);
      const semAlias = semanticTokenName(semKey, mode);
      entries.push({
        compKey,
        prop,
        tokenName: compTokenName(compKey, prop, mode),
        hex: resolvedComp[compKey]?.[prop] ?? '',
        semanticKey: semKey,
        semanticAlias: semAlias,
        mode,
      });
    }
  }
  return entries;
}

const LIGHT_COMP_ENTRIES = buildCompEntries('light', compLightJson);
const DARK_COMP_ENTRIES  = buildCompEntries('dark',  compDarkJson);

// Group component entries by component key, pairing light+dark
type CompGroup = {
  compKey: string;
  meta: { display: string; element: string; group: string };
  props: Array<{
    prop: string;
    light: CompTokenEntry;
    dark: CompTokenEntry | undefined;
  }>;
};

function buildCompGroups(): CompGroup[] {
  const darkByCompProp: Record<string, CompTokenEntry> = {};
  for (const e of DARK_COMP_ENTRIES) {
    darkByCompProp[`${e.compKey}::${e.prop}`] = e;
  }

  const lightByComp: Record<string, CompTokenEntry[]> = {};
  for (const e of LIGHT_COMP_ENTRIES) {
    (lightByComp[e.compKey] ??= []).push(e);
  }

  return Object.entries(lightByComp).map(([compKey, lightEntries]) => ({
    compKey,
    meta: COMPONENT_META[compKey] ?? { display: compKey, element: 'container', group: 'Other' },
    props: lightEntries.map((light) => ({
      prop: light.prop,
      light,
      dark: darkByCompProp[`${compKey}::${light.prop}`],
    })),
  }));
}

const COMP_GROUPS = buildCompGroups();

// ── Alias chain data — all 97 light component tokens → full prim→sem→comp chain
// (97 light + 97 dark = 194 total component tokens)
// We pair by compKey+prop since property sets match between modes.
type ChainRow = {
  compKey:      string;
  prop:         string;
  // Light chain
  lightCompToken:    string;
  lightCompHex:      string;
  lightSemKey:       string;
  lightSemToken:     string;
  lightSemHex:       string;
  lightPrimKey:      string;
  lightPrimToken:    string;
  lightPrimHex:      string;
  // Dark chain
  darkCompToken:     string;
  darkCompHex:       string;
  darkSemKey:        string;
  darkSemToken:      string;
  darkSemHex:        string;
  darkPrimKey:       string;
  darkPrimToken:     string;
  darkPrimHex:       string;
};

function buildChainRows(): ChainRow[] {
  const darkByCompProp: Record<string, CompTokenEntry> = {};
  for (const e of DARK_COMP_ENTRIES) {
    darkByCompProp[`${e.compKey}::${e.prop}`] = e;
  }

  const rows: ChainRow[] = [];
  for (const light of LIGHT_COMP_ENTRIES) {
    const dark = darkByCompProp[`${light.compKey}::${light.prop}`];

    // Light semantic → primitive chain (exact from JSON)
    const lightSemKey = light.semanticKey;
    const lightSemHex = (tokens.color.light as Record<string, string>)[lightSemKey] ?? '';
    const lightSemJson = lightJson[lightSemKey];
    const lightPrimKey = lightSemJson ? refToPrimKey(lightSemJson.$value) : '';
    const lightPrimHex = lightPrimKey ? (tokens.color.primitive as Record<string, string>)[lightPrimKey] ?? '' : '';

    // Dark semantic → primitive chain
    const darkSemKey  = dark?.semanticKey ?? lightSemKey;
    const darkSemHex  = (tokens.color.dark as Record<string, string>)[darkSemKey] ?? '';
    const darkSemJson = darkJson[darkSemKey];
    const darkPrimKey = darkSemJson ? refToPrimKey(darkSemJson.$value) : '';
    const darkPrimHex = darkPrimKey ? (tokens.color.primitive as Record<string, string>)[darkPrimKey] ?? '' : '';

    rows.push({
      compKey:         light.compKey,
      prop:            light.prop,
      lightCompToken:  light.tokenName,
      lightCompHex:    light.hex,
      lightSemKey,
      lightSemToken:   semanticTokenName(lightSemKey, 'light'),
      lightSemHex,
      lightPrimKey,
      lightPrimToken:  lightPrimKey ? primTokenName(lightPrimKey) : '',
      lightPrimHex,
      darkCompToken:   dark?.tokenName ?? '',
      darkCompHex:     dark?.hex ?? '',
      darkSemKey,
      darkSemToken:    semanticTokenName(darkSemKey, 'dark'),
      darkSemHex,
      darkPrimKey,
      darkPrimToken:   darkPrimKey ? primTokenName(darkPrimKey) : '',
      darkPrimHex,
    });
  }
  return rows;
}

const ALL_CHAIN_ROWS = buildChainRows();

// Group chain rows by component for section display
const CHAIN_BY_COMP: Record<string, ChainRow[]> = {};
for (const row of ALL_CHAIN_ROWS) {
  (CHAIN_BY_COMP[row.compKey] ??= []).push(row);
}

// ── Derived counts ────────────────────────────────────────────────────────────
const PRIM_COUNT       = PRIMITIVES.length;
const SEM_PER_MODE     = LIGHT_SEMANTICS.length;
const COMP_GROUP_COUNT = Object.keys(compLightJson).length;
const COMP_TOTAL       = LIGHT_COMP_ENTRIES.length + DARK_COMP_ENTRIES.length;
const CHAIN_COUNT      = ALL_CHAIN_ROWS.length; // light side (each has both modes)

// ── UI helpers ────────────────────────────────────────────────────────────────

function ColorSwatch({ hex, size = 'md' }: { hex: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-9 w-9' : 'h-7 w-7';
  return (
    <span
      className={`${sizeClass} inline-block shrink-0 rounded border border-black/10 dark:border-white/10`}
      style={{ backgroundColor: hex || 'transparent' }}
      aria-label={hex}
    />
  );
}

function ModeChip({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[0.5rem] font-medium uppercase tracking-wide ${
      mode === 'light'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
    }`}>
      {mode}
    </span>
  );
}

function GroupChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[0.5rem] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-xs text-muted-foreground">
      {count}
    </span>
  );
}

function SectionHead({
  label, title, description, count,
}: {
  label?: string; title: string; description?: string; count?: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {label && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>}
        <h2 className="mt-1 font-semibold">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {count !== undefined && <CountBadge count={count} />}
    </div>
  );
}

// Inline cell for a swatch + hex — compact for table cells
function SwatchHex({ hex }: { hex: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <ColorSwatch hex={hex} size="sm" />
      <code className="font-mono text-[0.5625rem] uppercase text-muted-foreground">{hex || '—'}</code>
    </div>
  );
}

// ── Role categories (for semantic table grouping) ─────────────────────────────
const ROLE_CATEGORY: Record<string, string> = {
  background: 'Background & surface', foreground: 'Background & surface',
  card: 'Background & surface', cardForeground: 'Background & surface',
  popover: 'Background & surface', popoverForeground: 'Background & surface',
  primary: 'Interactive & brand', primaryForeground: 'Interactive & brand',
  secondary: 'Interactive & brand', secondaryForeground: 'Interactive & brand',
  muted: 'Interactive & brand', mutedForeground: 'Interactive & brand',
  accent: 'Interactive & brand', accentForeground: 'Interactive & brand',
  ring: 'Interactive & brand',
  destructive: 'Status', destructiveForeground: 'Status',
  border: 'Borders & inputs', input: 'Borders & inputs',
  chart1: 'Charts', chart2: 'Charts', chart3: 'Charts', chart4: 'Charts', chart5: 'Charts',
  sidebar: 'Sidebar', sidebarForeground: 'Sidebar', sidebarBorder: 'Sidebar',
  sidebarPrimary: 'Sidebar', sidebarPrimaryForeground: 'Sidebar',
  sidebarAccent: 'Sidebar', sidebarAccentForeground: 'Sidebar', sidebarRing: 'Sidebar',
  windowTitleForeground: 'Window chrome',
};

const CATEGORY_ORDER = [
  'Background & surface', 'Interactive & brand', 'Status',
  'Borders & inputs', 'Charts', 'Sidebar', 'Window chrome',
];

// ── Sections ──────────────────────────────────────────────────────────────────

function ProposedBanner() {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <SectionLabel className="mt-0.5 shrink-0">Proposed</SectionLabel>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            Naming preview — EightShapes taxonomy with{' '}
             <code className="rounded bg-muted px-1 font-mono text-xs">osp</code> namespace
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Token names on this page use the proposed EightShapes naming model.{' '}
            <strong className="font-medium text-foreground">Color</strong> token names in{' '}
            <code className="font-mono text-xs">tokens.json</code>,{' '}
            <code className="font-mono text-xs">src/index.css</code>, and{' '}
            <code className="font-mono text-xs">src/generated/tokens.tsx</code> have not yet been renamed.
            Spacing and radius tokens already use the{' '}
            <code className="font-mono text-xs">--osp-</code> CSS namespace.
            Current generated color CSS remains unprefixed until this proposal is approved.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Primitive colors', value: PRIM_COUNT },
        { label: 'Semantic roles (per mode)', value: SEM_PER_MODE },
        { label: 'Component groups', value: COMP_GROUP_COUNT },
        { label: 'Component tokens (both modes)', value: COMP_TOTAL },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-lg border bg-card p-4 text-card-foreground">
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Section 1: Primitives ─────────────────────────────────────────────────────
function PrimitivesSection() {
  return (
    <section className="space-y-4 rounded-xl border bg-card p-6 text-card-foreground">
      <SectionHead
        label="Layer 1 of 3"
        title="Primitive colors"
        description="Raw palette values. Never consumed by components directly — they are the source from which semantic roles are derived."
        count={PRIM_COUNT}
      />
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {PRIMITIVES.map(({ key, tokenName, hex }) => (
          <div key={key} className="flex items-center gap-3 rounded-lg border bg-background p-2.5">
            <ColorSwatch hex={hex} size="lg" />
            <div className="min-w-0 flex-1">
              <code className="block truncate font-mono text-[0.6875rem] text-primary">{tokenName}</code>
              <div className="mt-0.5 flex items-center gap-2">
                <code className="font-mono text-[0.625rem] uppercase text-muted-foreground">{hex}</code>
                <span className="font-mono text-[0.5rem] text-muted-foreground/50">{key}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section 2: Semantic colors ────────────────────────────────────────────────
function SemanticsSection() {
  // Group by category preserving order
  const grouped: Record<string, typeof LIGHT_SEMANTICS> = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const entry of LIGHT_SEMANTICS) {
    const cat = ROLE_CATEGORY[entry.key] ?? 'Other';
    (grouped[cat] ??= []).push(entry);
  }

  return (
    <section className="space-y-5 rounded-xl border bg-card p-6 text-card-foreground">
      <SectionHead
        label="Layer 2 of 3"
        title="Semantic colors"
        description="Theme-aware color roles. The stable public color API. Light and dark values side by side with exact primitive alias from tokens.json."
        count={SEM_PER_MODE * 2}
      />

      <div className="space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const entries = grouped[cat];
          if (!entries || entries.length === 0) return null;
          return (
            <div key={cat}>
              <p className="mb-1.5 text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">{cat}</p>
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="py-2 pl-3 pr-2 text-left font-medium text-muted-foreground">Proposed token name</th>
                        <th className="py-2 px-2 text-left font-medium text-muted-foreground">Source key</th>
                        <th className="py-2 px-2 text-left font-medium text-muted-foreground"><ModeChip mode="light" /></th>
                        <th className="py-2 px-2 text-left font-medium text-muted-foreground"><ModeChip mode="dark" /></th>
                        <th className="py-2 px-2 text-left font-medium text-muted-foreground">Light prim alias</th>
                        <th className="py-2 pr-3 pl-2 text-left font-medium text-muted-foreground">Dark prim alias</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {entries.map((light) => {
                        const dark = darkSemanticByKey[light.key];
                        return (
                          <tr key={light.key} className="hover:bg-muted/20">
                            <td className="py-2 pl-3 pr-2">
                              <code className="block font-mono text-[0.6875rem] text-primary">{light.tokenName}</code>
                            </td>
                            <td className="py-2 px-2">
                              <code className="font-mono text-[0.5625rem] text-muted-foreground/70">{light.key}</code>
                            </td>
                            <td className="py-2 px-2"><SwatchHex hex={light.hex} /></td>
                            <td className="py-2 px-2">
                              {dark ? <SwatchHex hex={dark.hex} /> : <span className="text-muted-foreground">—</span>}
                            </td>
                            <td className="py-2 px-2">
                              <code className="block font-mono text-[0.5625rem] text-muted-foreground">{light.primAlias}</code>
                              <span className="font-mono text-[0.5rem] text-muted-foreground/50">{light.primKey}</span>
                            </td>
                            <td className="py-2 pr-3 pl-2">
                              {dark ? (
                                <>
                                  <code className="block font-mono text-[0.5625rem] text-muted-foreground">{dark.primAlias}</code>
                                  <span className="font-mono text-[0.5rem] text-muted-foreground/50">{dark.primKey}</span>
                                </>
                              ) : <span className="text-muted-foreground">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section 3: Component color inventory ──────────────────────────────────────
function ComponentInventorySection() {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-6 text-card-foreground">
      <SectionHead
        label="Layer 3 of 3"
        title="Component color inventory"
        description="All component color tokens. Each aliases a same-mode semantic role — never a primitive directly. Semantic alias shown for both light and dark."
        count={COMP_TOTAL}
      />

      <div className="space-y-4">
        {COMP_GROUPS.map(({ compKey, meta, props }) => (
          <div key={compKey} className="overflow-hidden rounded-lg border">
            <div className="flex items-center gap-2.5 border-b bg-muted/30 px-3 py-2">
              <code className="font-mono text-xs font-medium text-foreground">
                 osp.{meta.display}.{meta.element}.color.*
              </code>
              <GroupChip>{meta.group}</GroupChip>
              <CountBadge count={props.length * 2} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="border-b bg-muted/10">
                    <th className="py-1.5 pl-3 pr-2 text-left font-medium text-muted-foreground">Property</th>
                    <th className="py-1.5 px-2 text-left font-medium text-muted-foreground"><ModeChip mode="light" /></th>
                    <th className="py-1.5 px-2 text-left font-medium text-muted-foreground">Light semantic alias</th>
                    <th className="py-1.5 px-2 text-left font-medium text-muted-foreground"><ModeChip mode="dark" /></th>
                    <th className="py-1.5 pr-3 pl-2 text-left font-medium text-muted-foreground">Dark semantic alias</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {props.map(({ prop, light, dark }) => (
                    <tr key={prop} className="hover:bg-muted/20">
                      <td className="py-1.5 pl-3 pr-2">
                        <code className="font-mono text-[0.6875rem] text-muted-foreground">{prop}</code>
                      </td>
                      <td className="py-1.5 px-2"><SwatchHex hex={light.hex} /></td>
                      <td className="py-1.5 px-2">
                        <code className="block font-mono text-[0.5625rem] text-primary">{light.semanticAlias}</code>
                        <span className="font-mono text-[0.5rem] text-muted-foreground/50">{light.semanticKey}</span>
                      </td>
                      <td className="py-1.5 px-2">
                        {dark ? <SwatchHex hex={dark.hex} /> : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-1.5 pr-3 pl-2">
                        {dark ? (
                          <>
                            <code className="block font-mono text-[0.5625rem] text-primary">{dark.semanticAlias}</code>
                            <span className="font-mono text-[0.5rem] text-muted-foreground/50">{dark.semanticKey}</span>
                          </>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Complete alias chains — all 97 × 2 component tokens ────────────
function AliasChainsSection() {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-6 text-card-foreground">
      <SectionHead
        label="Complete alias chains"
        title="Primitive → semantic → component"
        description="All component color tokens traced from source primitive through semantic role to component intent. Grouped by component; light and dark paths shown together for each property."
        count={CHAIN_COUNT * 2}
      />

      <div className="space-y-5">
        {Object.entries(CHAIN_BY_COMP).map(([compKey, rows]) => {
          const meta = COMPONENT_META[compKey] ?? { display: compKey, element: 'container', group: 'Other' };
          return (
            <div key={compKey} className="overflow-hidden rounded-lg border">
              {/* Component header */}
              <div className="flex items-center gap-2.5 border-b bg-muted/30 px-3 py-2">
                <code className="font-mono text-xs font-medium text-foreground">
                   osp.{meta.display}.{meta.element}
                </code>
                <GroupChip>{meta.group}</GroupChip>
              </div>

              <div className="divide-y">
                {rows.map((row) => (
                  <div key={row.prop} className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                    {/* Light chain */}
                    <div className="flex items-start gap-2 border-b p-3 sm:border-b-0 sm:border-r">
                      <div className="mt-0.5 shrink-0">
                        <ModeChip mode="light" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Primitive */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.lightPrimHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-muted-foreground">{row.lightPrimToken}</code>
                            <code className="font-mono text-[0.5rem] uppercase text-muted-foreground/50">{row.lightPrimHex}</code>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="pl-1 font-mono text-[0.5625rem] text-muted-foreground/40">↓</div>
                        {/* Semantic */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.lightSemHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-muted-foreground">{row.lightSemToken}</code>
                            <code className="font-mono text-[0.5rem] text-muted-foreground/50">{row.lightSemKey}</code>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="pl-1 font-mono text-[0.5625rem] text-muted-foreground/40">↓</div>
                        {/* Component */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.lightCompHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-primary">{row.lightCompToken}</code>
                            <code className="font-mono text-[0.5rem] text-muted-foreground/50">{row.prop}</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dark chain */}
                    <div className="flex items-start gap-2 p-3">
                      <div className="mt-0.5 shrink-0">
                        <ModeChip mode="dark" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Primitive */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.darkPrimHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-muted-foreground">{row.darkPrimToken || '—'}</code>
                            <code className="font-mono text-[0.5rem] uppercase text-muted-foreground/50">{row.darkPrimHex || '—'}</code>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="pl-1 font-mono text-[0.5625rem] text-muted-foreground/40">↓</div>
                        {/* Semantic */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.darkSemHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-muted-foreground">{row.darkSemToken}</code>
                            <code className="font-mono text-[0.5rem] text-muted-foreground/50">{row.darkSemKey}</code>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="pl-1 font-mono text-[0.5625rem] text-muted-foreground/40">↓</div>
                        {/* Component */}
                        <div className="flex items-center gap-2">
                          <ColorSwatch hex={row.darkCompHex} size="sm" />
                          <div className="min-w-0">
                            <code className="block truncate font-mono text-[0.5625rem] text-primary">{row.darkCompToken || '—'}</code>
                            <code className="font-mono text-[0.5rem] text-muted-foreground/50">{row.prop}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[0.6875rem] text-muted-foreground">
        {CHAIN_COUNT * 2} chains total ({CHAIN_COUNT} light + {CHAIN_COUNT} dark).
        Every chain is exact: aliases read from <code className="rounded bg-muted px-1">tokens.json</code> <code className="rounded bg-muted px-1">${'{'}value{'}'}</code> references.
         Proposed namespace: <code className="rounded bg-muted px-1">osp</code>.
        Mode is always the last segment.
      </p>
    </section>
  );
}

// ── Section 5: Taxonomy reference ─────────────────────────────────────────────
const TAXONOMY_ROWS = [
  { segment: 'Namespace', value: 'osp', note: 'Proposed; color CSS remains unprefixed (spacing/radius use --osp-)' },
  { segment: 'Object', value: 'action-button', note: 'Component display name — kebab-case' },
  { segment: 'Element', value: 'container', note: 'Sub-part of the component (container, label, icon, rule…)' },
  { segment: 'Category', value: 'color', note: 'Visual style family — always present' },
  { segment: 'Property', value: 'background', note: 'Styled CSS property (background, foreground, border…)' },
  { segment: 'Concept', value: 'action', note: 'Purpose or intent — omitted when self-evident' },
  { segment: 'Variant / state', value: 'hover', note: 'Alternative treatment or interaction condition — omitted at rest' },
  { segment: 'Scale', value: '1', note: 'Numeric step — chart series only in this system' },
  { segment: 'Mode', value: 'light', note: 'Always last; required on every color token' },
] as const;

function TaxonomySection() {
  return (
    <section className="space-y-4 rounded-xl border bg-card p-6 text-card-foreground">
      <SectionHead
        label="EightShapes taxonomy"
        title="Naming segments and patterns"
        description="Token names are dot-separated segment sequences. Inapplicable segments are omitted. Mode is always last."
      />

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-xs">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="py-2 pl-3 pr-2 text-left font-medium text-muted-foreground">Segment</th>
                <th className="py-2 px-2 text-left font-medium text-muted-foreground">Example</th>
                <th className="py-2 pr-3 pl-2 text-left font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {TAXONOMY_ROWS.map((row) => (
                <tr key={row.segment} className="hover:bg-muted/20">
                  <td className="py-2 pl-3 pr-2 font-medium">{row.segment}</td>
                  <td className="py-2 px-2">
                    <code className="font-mono text-[0.6875rem] text-primary">{row.value}</code>
                  </td>
                  <td className="py-2 pr-3 pl-2 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            layer: 'Primitive',
             pattern: 'osp.color.palette.<name>',
             example: 'osp.color.palette.teal',
          },
          {
            layer: 'Semantic',
             pattern: 'osp.color.<property>[.<concept>].<mode>',
             example: 'osp.color.background.action.primary.light',
          },
          {
            layer: 'Component',
             pattern: 'osp.<component>.<element>.color.<property>[.<variant>].<mode>',
             example: 'osp.action-button.container.color.background.light',
          },
        ].map((t) => (
          <div key={t.layer} className="rounded-lg border bg-muted/40 p-4">
            <p className="text-xs font-medium">{t.layer}</p>
            <code className="mt-2 block break-words font-mono text-[0.6875rem] text-muted-foreground">{t.pattern}</code>
            <Separator className="my-2" />
            <code className="block break-words font-mono text-[0.6875rem] text-primary">{t.example}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────
export function ColorTokensPage() {
  return (
    <div className="space-y-6">
      <ProposedBanner />
      <StatsBar />
      <PrimitivesSection />
      <SemanticsSection />
      <ComponentInventorySection />
      <AliasChainsSection />
      <TaxonomySection />
    </div>
  );
}
