import { useState } from 'react';
import { SectionLabel, Surface, StatusIndicator } from '../components/ui/fes-os';
import {
  SettingsContrastCard,
  SettingsNavItem,
  SettingsNavSection,
  SettingsSegmentedChoice,
  SettingsSliderGroup,
  SettingsToggleRow,
  type ContrastVariant,
} from '../components/ui/settings';
import { CanonicalSpec } from './md-renderer';
import { mdFoundationAccessibility } from './docs-map';

const RULES = [
  {
    area: 'Contrast and color',
    target: 'WCAG AA',
    rules: [
      'Normal text targets at least 4.5:1 contrast in both themes.',
      'Large text targets at least 3:1 contrast.',
      'Hover and keyboard-focus states must preserve readable contrast.',
      'Color never carries selection, status, or destructive meaning by itself.',
    ],
    evidence: 'Representative light-theme surfaces and interactive states have automated contrast coverage.',
  },
  {
    area: 'Keyboard and focus',
    target: 'Operable',
    rules: [
      'Every action uses a native button, input, textarea, or link.',
      'Visible focus treatment is required for all keyboard-operable controls.',
      'Escape closes open menus and transient interface layers.',
      'Window shortcuts, Terminal history, and sticky rotation include keyboard paths.',
    ],
    evidence: 'Keyboard interaction and focus-visible states are covered by the portfolio interaction tests.',
  },
  {
    area: 'Names and semantics',
    target: 'Understandable',
    rules: [
      'Icon-only actions require accessible names and visible hover/focus explanations.',
      'Windows, menus, dialogs, navigation regions, resize handles, and controls expose semantic roles.',
      'Toggle and selection state use aria-pressed, aria-checked, or aria-expanded.',
      'Decorative icons are hidden from assistive technology.',
    ],
    evidence: 'The interface uses labeled landmarks, controls, menus, dialogs, separators, and state attributes.',
  },
  {
    area: 'Status and errors',
    target: 'Announced',
    rules: [
      'Storage availability and recovery messages use polite live status regions.',
      'Destructive actions require confirmation before data is removed.',
      'Failure states explain what happened and offer a recovery path.',
      'Status indicators pair visual treatment with readable text.',
    ],
    evidence: 'Blocked-storage recovery and sticky deletion behavior are exercised in persistence tests.',
  },
  {
    area: 'Motion and manipulation',
    target: 'Adaptable',
    rules: [
      'Nonessential transitions are removed when reduced motion is requested.',
      'Pointer-controlled dragging, resizing, and rotation remain direct and interruptible.',
      'Drag-only desktop interactions receive button, keyboard, or managed-layout alternatives.',
      "Responsive reflow never destroys the user\u2019s saved desktop arrangement.",
    ],
    evidence: 'Reduced-motion CSS, managed tablet/mobile layouts, and preserved desktop geometry are implemented.',
  },
  {
    area: 'Responsive access',
    target: 'Reachable',
    rules: [
      'Mobile navigation remains fixed at the bottom with visible text labels.',
      'Desktop-only tools are removed—not left unreachable—on touch-oriented layouts.',
      'Content reflows without requiring horizontal page scrolling.',
      'Body copy stays at 13px or larger and major controls use practical touch targets.',
    ],
    evidence: 'Responsive tests cover desktop, tablet, mobile, and wide-phone portrait behavior.',
  },
] as const;

// ---------------------------------------------------------------------------
// State-contract reference variants
// ---------------------------------------------------------------------------

type AnimSpeed = 'less' | 'default' | 'more';
type ContrastTheme = 'none' | 'low' | 'high';

const ANIM_OPTIONS = [
  { value: 'less', label: 'Less', description: 'Slower, reduced intensity' },
  { value: 'default', label: 'Default', description: 'Standard timing' },
  { value: 'more', label: 'More', description: 'Faster, snappier motion' },
];

const CONTRAST_VARIANTS: { variant: ContrastVariant; key: ContrastTheme; label: string; description: string }[] = [
  { variant: 'standard', key: 'none', label: 'Standard', description: 'Default appearance' },
  { variant: 'low', key: 'low', label: 'Low contrast', description: 'Reduced visual harshness' },
  { variant: 'high', key: 'high', label: 'High contrast', description: 'Maximum black/white separation' },
];

function DataAttributeChip({ attr, value }: { attr: string; value?: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-primary">
      {value !== undefined ? `${attr}="${value}"` : attr}
    </code>
  );
}

function CssVarRow({ name, value, description }: { name: string; value: string; description: string }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_2fr] gap-x-4 gap-y-1 border-b border-border py-2 text-xs last:border-0">
      <code className="font-mono text-primary">{name}</code>
      <code className="font-mono text-muted-foreground">{value}</code>
      <span className="text-muted-foreground">{description}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function AccessibilityPage() {
  const [scrollbars, setScrollbars] = useState(false);
  const [transparency, setTransparency] = useState(true);
  const [transparencyLevel, setTransparencyLevel] = useState(20);
  const [animations, setAnimations] = useState(true);
  const [animSpeed, setAnimSpeed] = useState<AnimSpeed>('default');
  const [contrastTheme, setContrastTheme] = useState<ContrastTheme>('none');
  const [navSection, setNavSection] = useState<'display' | 'motion' | 'contrast'>('display');

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Surface elevation="floating" className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <SectionLabel>foundation / accessibility</SectionLabel>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.025em]">Accessible by structure, not decoration.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Fes OS targets WCAG 2.2 Level AA. These rules describe the current portfolio implementation and
            the requirements every shared component must preserve. The interactive demos below show every
            settings state the design system ships primitives for.
          </p>
        </div>
        <StatusIndicator label="AA target" />
      </Surface>

      {/* ------------------------------------------------------------------ */}
      {/* Interactive state demos */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="rounded-xl border bg-card p-6">
          <SectionLabel>interactive / settings primitives</SectionLabel>
          <h2 className="mt-2 text-lg font-semibold">Live state demonstrations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every component below is interactive. Explore all variants to verify focus, labels, and ARIA attributes.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Toggle rows */}
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <SectionLabel>toggle row / switch semantics</SectionLabel>
            <p className="text-xs text-muted-foreground">
              The pill button carries <code className="font-mono">role="switch"</code> and{' '}
              <code className="font-mono">aria-checked</code>. The surrounding <code className="font-mono">&lt;label&gt;</code>{' '}
              links by <code className="font-mono">htmlFor</code> so clicking the label row also toggles.
            </p>
            <div className="space-y-2">
              <SettingsToggleRow
                id="a11y-scrollbars"
                label="Always show scrollbars"
                description="Keeps scrollbar tracks permanently visible."
                checked={scrollbars}
                onChange={setScrollbars}
                data-testid="a11y-demo-scrollbars"
              />
              <SettingsToggleRow
                id="a11y-transparency"
                label="Window transparency effects"
                description="Enables blur and translucency on windows and dock."
                checked={transparency}
                onChange={setTransparency}
                data-testid="a11y-demo-transparency"
              />
              <SettingsToggleRow
                id="a11y-animations"
                label="UI animations"
                description="Enables transitions and motion effects."
                checked={animations}
                onChange={setAnimations}
                data-testid="a11y-demo-animations"
              />
              <SettingsToggleRow
                id="a11y-disabled"
                label="Disabled example"
                description="opacity-45, pointer-events-none — not reachable by any input method."
                checked={false}
                onChange={() => {}}
                disabled
                data-testid="a11y-demo-disabled"
              />
            </div>
            <div className="mt-2 rounded-md bg-muted p-3">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Data attributes emitted</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {scrollbars && <DataAttributeChip attr="data-always-scrollbars" />}
                {!transparency && <DataAttributeChip attr="data-no-transparency" />}
                {transparency && <DataAttributeChip attr="data-transparency-enabled" />}
                {!animations && <DataAttributeChip attr="data-no-animations" />}
                {!scrollbars && transparency && animations && (
                  <span className="text-[0.625rem] text-muted-foreground">none active</span>
                )}
              </div>
            </div>
          </div>

          {/* Slider group */}
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <SectionLabel>slider group / live percentage</SectionLabel>
            <p className="text-xs text-muted-foreground">
              The <code className="font-mono">&lt;output&gt;</code> element carries{' '}
              <code className="font-mono">aria-live="polite"</code> so screen readers announce the value
              after the user stops dragging. Range guidance labels are{' '}
              <code className="font-mono">aria-hidden</code>.
            </p>
            {transparency && (
              <SettingsSliderGroup
                id="a11y-transparency-level"
                label="Transparency level"
                value={transparencyLevel}
                min={0}
                max={70}
                step={5}
                onChange={setTransparencyLevel}
                guidanceStart="None"
                guidanceEnd="Almost full"
                ariaValueText={`${transparencyLevel}% transparent`}
                data-testid="a11y-demo-transparency-level"
              />
            )}
            {!transparency && (
              <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                Enable "Window transparency effects" above to show the slider.
              </p>
            )}
            <div className="mt-2 rounded-md bg-muted p-3">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">CSS variable emitted</p>
              <code className="mt-1 block font-mono text-xs text-primary">
                --accessibility-transparency: {transparencyLevel / 100}
              </code>
            </div>
          </div>

          {/* Segmented choice */}
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <SectionLabel>segmented choice / radio group</SectionLabel>
            <p className="text-xs text-muted-foreground">
              Wraps a <code className="font-mono">role="radiogroup"</code> around pill buttons that each carry{' '}
              <code className="font-mono">role="radio"</code> and <code className="font-mono">aria-checked</code>.
              Visible labels, no icon-only controls.
            </p>
            {animations && (
              <SettingsSegmentedChoice
                groupLabel="Animation speed"
                options={ANIM_OPTIONS}
                value={animSpeed}
                onChange={(v) => setAnimSpeed(v as AnimSpeed)}
                data-testid="a11y-demo-anim-speed"
              />
            )}
            {!animations && (
              <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                Enable "UI animations" above to show animation speed.
              </p>
            )}
            <div className="mt-2 rounded-md bg-muted p-3">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Data attribute emitted</p>
              <div className="mt-1">
                {animations
                  ? <DataAttributeChip attr="data-anim-speed" value={animSpeed === 'default' ? undefined : animSpeed} />
                  : <DataAttributeChip attr="data-no-animations" />}
              </div>
            </div>
          </div>

          {/* Contrast cards */}
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <SectionLabel>contrast cards / fixed palette</SectionLabel>
            <p className="text-xs text-muted-foreground">
              Preview miniatures use fixed hex values independent of the current app theme so they
              accurately show what each contrast mode looks like.
            </p>
            <div role="radiogroup" aria-label="Contrast theme" className="flex flex-wrap gap-2.5">
              {CONTRAST_VARIANTS.map(({ variant, key, label, description }) => (
                <SettingsContrastCard
                  key={variant}
                  variant={variant}
                  label={label}
                  description={description}
                  selected={contrastTheme === key}
                  onSelect={() => setContrastTheme(key)}
                  data-testid={`a11y-demo-contrast-${key}`}
                />
              ))}
            </div>
            <div className="mt-2 rounded-md bg-muted p-3">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Data attribute emitted</p>
              <div className="mt-1">
                {contrastTheme !== 'none'
                  ? <DataAttributeChip attr="data-contrast" value={contrastTheme} />
                  : <span className="text-[0.625rem] text-muted-foreground">none (Standard mode)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar nav demo */}
        <div className="rounded-xl border bg-card p-5">
          <SectionLabel>sidebar navigation / settings-nav-item</SectionLabel>
          <p className="mt-1 text-xs text-muted-foreground">
            <code className="font-mono">&lt;nav aria-label="…"&gt;</code> landmark. Active item uses{' '}
            <code className="font-mono">aria-current="page"</code>. Focus ring uses{' '}
            <code className="font-mono">outline-ring</code> (primary) in both themes.
          </p>
          <div className="mt-4 flex gap-4">
            <div className="w-40 rounded-lg border border-border bg-sidebar p-2">
              <SettingsNavSection label="Settings sections">
                {(['display', 'motion', 'contrast'] as const).map((s) => (
                  <SettingsNavItem
                    key={s}
                    active={navSection === s}
                    aria-current={navSection === s ? 'page' : undefined}
                    onClick={() => setNavSection(s)}
                    data-testid={`a11y-nav-${s}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SettingsNavItem>
                ))}
              </SettingsNavSection>
            </div>
            <div className="flex-1 rounded-lg bg-muted p-3">
              <p className="text-sm font-medium capitalize">{navSection}</p>
              <p className="text-xs text-muted-foreground">Active section: <code className="font-mono">{navSection}</code></p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* State contract reference */}
      {/* ------------------------------------------------------------------ */}
      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <SectionLabel>state contracts</SectionLabel>
          <h2 className="mt-2 font-semibold">CSS class and data-attribute contracts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The package stylesheet (<code className="font-mono">src/index.css</code>) ships CSS that reads these
            attributes from the shell element. Consuming apps write/remove the attributes;
            the package styles react automatically. The translucent-surface utility class{' '}
            <code className="font-mono">.fes-surface-translucent</code> is the only component-level hook —
            all other rules apply globally to all descendants.
          </p>
        </div>
        <div className="divide-y">
          {/* always-show-scrollbars */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <DataAttributeChip attr="data-always-scrollbars" />
              <p className="mt-2 text-xs text-muted-foreground">On the shell/root element</p>
            </div>
            <div className="text-sm">
              <p>Sets <code className="font-mono">scrollbar-width: thin</code> and makes WebKit scrollbar tracks and thumbs permanently visible on all descendant scrollable areas. Track and thumb colors adapt to light/dark theme via <code className="font-mono">--muted</code> and <code className="font-mono">--muted-foreground</code>.</p>
            </div>
          </article>

          {/* fes-surface-translucent + no-transparency */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <div className="flex flex-col gap-1">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-primary">.fes-surface-translucent</code>
                <DataAttributeChip attr="data-no-transparency" />
                <DataAttributeChip attr="data-transparency-enabled" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Class on surface element; attributes on shell</p>
            </div>
            <div className="text-sm space-y-2">
              <p>Add <code className="font-mono">.fes-surface-translucent</code> to any window, dock, or menu surface. The class applies <code className="font-mono">backdrop-filter: blur(12px)</code> and uses <code className="font-mono">--accessibility-transparency</code> (a unitless alpha, default <code className="font-mono">0.2</code>, range <code className="font-mono">0–0.7</code>) to set background opacity.</p>
              <p>When <code className="font-mono">data-transparency-enabled</code> is on the shell, the consuming app sets <code className="font-mono">--accessibility-transparency</code> on <code className="font-mono">:root</code> to control the level. When <code className="font-mono">data-no-transparency</code> is set instead, <code className="font-mono">backdrop-filter</code> is removed and backgrounds become fully opaque. Only surfaces carrying <code className="font-mono">.fes-surface-translucent</code> are affected.</p>
            </div>
          </article>

          {/* no-animations */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <DataAttributeChip attr="data-no-animations" />
              <p className="mt-2 text-xs text-muted-foreground">On the shell/root element</p>
            </div>
            <div className="text-sm">
              <p>Collapses <code className="font-mono">animation-duration</code>, <code className="font-mono">animation-delay</code>, and <code className="font-mono">transition-duration</code> to <code className="font-mono">0.001ms</code> on all descendants using <code className="font-mono">!important</code>. Events still fire; the motion is imperceptible. Applied when UI animations are off.</p>
            </div>
          </article>

          {/* fast-ui */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <DataAttributeChip attr="data-fast-ui" />
              <p className="mt-2 text-xs text-muted-foreground">On the shell/root element</p>
            </div>
            <div className="text-sm">
              <p>More aggressive than <code className="font-mono">data-no-animations</code>: sets <code className="font-mono">animation: none !important</code> and <code className="font-mono">transition: none !important</code> on all descendants, and <code className="font-mono">scroll-behavior: auto</code> on the shell. Use for the most aggressive motion-reduction state.</p>
            </div>
          </article>

          {/* anim-speed */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <div className="flex flex-col gap-1">
                <DataAttributeChip attr='data-anim-speed="less"' />
                <DataAttributeChip attr='data-anim-speed="more"' />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">On the shell/root element; absent = default speed</p>
            </div>
            <div className="text-sm">
              <p><strong>less</strong> — sets <code className="font-mono">animation-duration: 2s</code> and <code className="font-mono">transition-duration: 0.6s</code> (~2× normal). <strong>more</strong> — sets <code className="font-mono">animation-duration: 0.4s</code> and <code className="font-mono">transition-duration: 0.12s</code> (~0.4× normal). Absent = no override; component defaults apply.</p>
            </div>
          </article>

          {/* contrast */}
          <article className="grid gap-4 p-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <div className="flex flex-col gap-1">
                <DataAttributeChip attr='data-contrast="low"' />
                <DataAttributeChip attr='data-contrast="high"' />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">On :root</p>
            </div>
            <div className="text-sm space-y-2">
              <p><strong>low</strong> — re-maps <em>all</em> semantic channel vars via HSL counterparts: <code className="font-mono">--background</code>, <code className="font-mono">--foreground</code>, <code className="font-mono">--card</code>, <code className="font-mono">--primary</code>, <code className="font-mono">--accent</code>, <code className="font-mono">--destructive</code>, <code className="font-mono">--chart-1…5</code>, <code className="font-mono">--sidebar-primary</code>, <code className="font-mono">--sidebar-accent</code>, <code className="font-mono">--sidebar-ring</code>, and border/input/ring. <code className="font-mono">.fes-surface-translucent</code> surfaces are forced opaque.</p>
              <p><strong>high</strong> — same full remap with <code className="font-mono">--hc-*-hsl</code> channel vars (black/white/yellow/cyan). Chart-1 = yellow, chart-2 = cyan, chart-3–5 = white. All <code className="font-mono">*:focus-visible</code> get a 3px yellow outline. <code className="font-mono">.fes-surface-translucent</code> surfaces are forced opaque. No per-component overrides needed.</p>
              <p>Absent = Standard mode; normal theme variables apply.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Fixed palette tokens */}
      {/* ------------------------------------------------------------------ */}
      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <SectionLabel>tokens / fixed palette</SectionLabel>
          <h2 className="mt-2 font-semibold">Contrast theme and wallpaper tokens</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These values are fixed regardless of the current light/dark theme. They live under{' '}
            <code className="font-mono">color.fixed</code> in <code className="font-mono">tokens.json</code>{' '}
            and are emitted to <code className="font-mono">src/generated/tokens.tsx</code> for mobile/portable consumers.
            Web consumers reference them via two sets of CSS custom properties on <code className="font-mono">:root</code>:
            raw hex vars (<code className="font-mono">--contrast-*</code>, <code className="font-mono">--hc-*</code>, <code className="font-mono">--fixed-wallpaper-*</code>) for
            direct background/preview use, and companion HSL-channel vars (<code className="font-mono">--contrast-*-hsl</code>, <code className="font-mono">--hc-*-hsl</code>)
            for assignment into semantic variables consumed as <code className="font-mono">hsl(var(--background))</code> etc.
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Wallpaper */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Wallpaper presets</h3>
              <div className="flex gap-3">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="h-10 w-16 rounded-md border border-border" style={{ background: '#e8f0ec' }} />
                  <code className="font-mono text-[10px] text-muted-foreground">#E8F0EC</code>
                  <span className="text-[10px] text-muted-foreground">Light default</span>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <div className="h-10 w-16 rounded-md border border-border" style={{ background: '#111326' }} />
                  <code className="font-mono text-[10px] text-muted-foreground">#111326</code>
                  <span className="text-[10px] text-muted-foreground">Dark default</span>
                </div>
              </div>
            </div>
            {/* Low contrast */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Low-contrast palette</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: '--contrast-bg', hex: '#282a38' },
                  { name: '--contrast-surface', hex: '#31334a' },
                  { name: '--contrast-surface-2', hex: '#3a3c52' },
                  { name: '--contrast-text', hex: '#c4c8da' },
                  { name: '--contrast-accent', hex: '#8fa8c8' },
                ].map(({ name, hex }) => (
                  <div key={name} className="flex flex-col items-start gap-1">
                    <div className="h-7 w-10 rounded border border-border" style={{ background: hex }} />
                    <code className="font-mono text-[9px] text-muted-foreground">{hex}</code>
                  </div>
                ))}
              </div>
            </div>
            {/* High contrast */}
            <div className="lg:col-span-2">
              <h3 className="mb-3 text-sm font-semibold">High-contrast palette</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: '--hc-bg', hex: '#000000' },
                  { name: '--hc-surface', hex: '#0d0d0d' },
                  { name: '--hc-surface-2', hex: '#1a1a1a' },
                  { name: '--hc-text', hex: '#ffffff' },
                  { name: '--hc-text-muted', hex: '#e0e0e0' },
                  { name: '--hc-accent', hex: '#ffff00' },
                  { name: '--hc-accent-alt', hex: '#00ffff' },
                  { name: '--hc-border', hex: '#ffffff' },
                  { name: '--hc-focus', hex: '#ffff00' },
                ].map(({ name, hex }) => (
                  <div key={name} className="flex flex-col items-start gap-1">
                    <div className="h-7 w-10 rounded border border-border" style={{ background: hex }} />
                    <code className="font-mono text-[9px] text-muted-foreground">{hex}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Focus-ring / opaque-surface / contrast guidance */}
      {/* ------------------------------------------------------------------ */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Surface className="p-5">
          <SectionLabel>focus-ring guidance</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Focus rings</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Standard mode: use <code className="font-mono">focus-visible:ring-2 focus-visible:ring-ring</code> or <code className="font-mono">focus-visible:outline-2 focus-visible:outline-ring</code> Tailwind utilities so the ring color follows <code className="font-mono">--ring</code> (primary brand).</li>
            <li>High-contrast mode: the package rule <code className="font-mono">[data-contrast="high"] *:focus-visible</code> overrides all focus rings to <code className="font-mono">outline: 3px solid var(--hc-focus)</code> (yellow, 19.6:1 on black) automatically — no per-component change needed.</li>
            <li>Never suppress focus rings with bare <code className="font-mono">outline: none</code> on keyboard-reachable elements.</li>
          </ul>
        </Surface>
        <Surface className="p-5">
          <SectionLabel>translucent surfaces</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Opaque and translucent surfaces</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Add <code className="font-mono">.fes-surface-translucent</code> to surfaces that should carry adjustable transparency (windows, dock panels, floating menus).</li>
            <li>When <code className="font-mono">data-no-transparency</code> is on the shell, <code className="font-mono">.fes-surface-translucent</code> surfaces become fully opaque — <code className="font-mono">backdrop-filter</code> removed, background alpha removed.</li>
            <li><strong>Both contrast modes force <code className="font-mono">.fes-surface-translucent</code> opaque directly</strong> — the package stylesheet includes <code className="font-mono">[data-contrast="low"] .fes-surface-translucent</code> and <code className="font-mono">[data-contrast="high"] .fes-surface-translucent</code> rules that disable blur and alpha. The consuming app does <em>not</em> need to also set <code className="font-mono">data-no-transparency</code>. Other surfaces (using plain <code className="font-mono">bg-card</code> or inline backgrounds) are <em>not</em> automatically made opaque by the contrast rules alone — only <code className="font-mono">.fes-surface-translucent</code> is covered.</li>
            <li>Never place text over a purely translucent element with no solid fallback layer behind it.</li>
          </ul>
        </Surface>
        <Surface className="p-5">
          <SectionLabel>low-contrast mode</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Low contrast design rules</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Softens surfaces, reduces saturation — not the same as failing WCAG contrast requirements.</li>
            <li>Text (<code className="font-mono">--contrast-text: #c4c8da</code>) achieves 4.5:1 on surface (<code className="font-mono">--contrast-surface: #31334a</code>).</li>
            <li>Accent (<code className="font-mono">--contrast-accent: #8fa8c8</code>) replaces vivid primary, accent, and destructive roles — all interactive elements use the muted blue-grey.</li>
            <li>All five chart slots, sidebar-primary, sidebar-accent, sidebar-ring, and border/input/ring are fully remapped — no standard-theme color leaks through package components.</li>
            <li><code className="font-mono">.fes-surface-translucent</code> surfaces are forced opaque so contrast-palette backgrounds are not diluted by backdrop-filter alpha.</li>
          </ul>
        </Surface>
        <Surface className="p-5">
          <SectionLabel>high-contrast mode</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">High contrast design rules</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Black/white/yellow/cyan palette — no mid-tones, no gradients. All semantic roles remapped: primary, accent, and destructive → yellow; chart-1 → yellow, chart-2 → cyan, chart-3–5 → white.</li>
            <li>Yellow accent (<code className="font-mono">--hc-accent: #ffff00</code>) on black achieves 19.6:1 contrast. Cyan (<code className="font-mono">--hc-accent-alt</code>) on black achieves 21:1.</li>
            <li>All focus rings become 3px yellow automatically via the global <code className="font-mono">[data-contrast="high"] *:focus-visible</code> rule — no per-component change needed.</li>
            <li><code className="font-mono">.fes-surface-translucent</code> surfaces are forced opaque directly by the package stylesheet. This covers the opacity/blur of translucent surfaces only — the package does not and cannot guarantee that every inline <code className="font-mono">rgba()</code> or <code className="font-mono">bg-*/*</code> background set by the consuming app is also made opaque. The consuming app should avoid alpha backgrounds under contrast modes.</li>
          </ul>
        </Surface>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WCAG rules table */}
      {/* ------------------------------------------------------------------ */}
      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <h2 className="font-semibold">Rules the site follows</h2>
          <p className="mt-1 text-sm text-muted-foreground">Implementation rules and the evidence used to keep them enforceable.</p>
        </div>
        <div className="divide-y">
          {RULES.map((group, index) => (
            <article key={group.area} className="grid gap-5 p-6 lg:grid-cols-[12rem_minmax(0,1fr)_18rem]">
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
                  {String(index + 1).padStart(2, '0')} / {group.target}
                </span>
                <h3 className="mt-2 text-lg font-medium">{group.area}</h3>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
                {group.rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <div className="rounded-lg bg-muted p-4">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Evidence</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{group.evidence}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Checklist + scope */}
      {/* ------------------------------------------------------------------ */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Surface className="p-5">
          <SectionLabel>review checklist</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Before a component ships</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Use it with keyboard only and confirm focus never disappears.</li>
            <li>Check accessible name, role, current state, and reading order.</li>
            <li>Review light, dark, narrow, zoomed, and reduced-motion presentations.</li>
            <li>Confirm status and errors remain understandable without color or motion.</li>
            <li>Verify settings primitives: toggle rows, sliders, segmented choices, and contrast cards all pass in all three contrast modes.</li>
          </ul>
        </Surface>
        <Surface className="p-5">
          <SectionLabel>scope note</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Target, not certification</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The portfolio follows these rules and includes focused automated checks, but this page is not a formal
            accessibility certification. New components should receive keyboard and assistive-technology review
            before release.
          </p>
        </Surface>
      </section>

      <CanonicalSpec md={mdFoundationAccessibility} />
    </div>
  );
}
