import { useState } from 'react';
import { SectionLabel, Surface } from '../../components/ui/os-portfolio';
import {
  SettingsColorPreset,
  SettingsContrastCard,
  SettingsDivider,
  SettingsNavItem,
  SettingsNavSection,
  SettingsSectionHeader,
  SettingsSegmentedChoice,
  SettingsSliderGroup,
  SettingsToggleRow,
  type ContrastVariant,
} from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import {
  mdSettingsFamily,
  mdSettingsNav,
  mdSettingsToggleRow,
  mdSettingsSliderGroup,
  mdSettingsSegmentedChoice,
  mdSettingsContrastCard,
  mdSettingsColorPreset,
  mdSettingsDivider,
  mdSettingsSectionHeader,
} from '../docs-map';

const combinedSettingsMd = [
  mdSettingsFamily,
  mdSettingsNav,
  mdSettingsToggleRow,
  mdSettingsSliderGroup,
  mdSettingsSegmentedChoice,
  mdSettingsContrastCard,
  mdSettingsColorPreset,
  mdSettingsDivider,
  mdSettingsSectionHeader,
].join('\n\n---\n\n');

type AnimSpeed = 'less' | 'default' | 'more';
type ContrastTheme = 'none' | 'low' | 'high';

const ANIMATION_SPEED_OPTIONS = [
  { value: 'less', label: 'Less', description: 'Slower, reduced intensity' },
  { value: 'default', label: 'Default', description: 'Standard timing' },
  { value: 'more', label: 'More', description: 'Faster, snappier motion' },
];

const CONTRAST_CARDS: { variant: ContrastVariant; key: ContrastTheme; label: string; description: string }[] = [
  { variant: 'standard', key: 'none', label: 'Standard', description: 'Default appearance' },
  { variant: 'low', key: 'low', label: 'Low contrast', description: 'Reduced visual harshness' },
  { variant: 'high', key: 'high', label: 'High contrast', description: 'Maximum black/white separation' },
];

const COLOR_PRESETS = [
  { color: '#e8f0ec', label: 'Light default, #e8f0ec', name: 'Light default' },
  { color: '#111326', label: 'Dark default, #111326', name: 'Dark default' },
] as const;

export function SettingsDemo() {
  // Nav state
  const [section, setSection] = useState<'personalization' | 'accessibility'>('personalization');

  // Accessibility prefs
  const [alwaysScrollbars, setAlwaysScrollbars] = useState(false);
  const [transparency, setTransparency] = useState(true);
  const [transparencyLevel, setTransparencyLevel] = useState(20);
  const [stickyTransparencyLevel, setStickyTransparencyLevel] = useState(20);
  const [animations, setAnimations] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<AnimSpeed>('default');
  const [contrastTheme, setContrastTheme] = useState<ContrastTheme>('none');
  const [regularTheme, setRegularTheme] = useState<'light' | 'dark'>('light');

  // Wallpaper state
  const [selectedPreset, setSelectedPreset] = useState<string | null>('#e8f0ec');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <SectionLabel>components / settings</SectionLabel>
        <h1 className="text-3xl font-semibold tracking-tight">Settings primitives</h1>
        <p className="max-w-2xl text-muted-foreground">
          Visual-only components for settings windows. Product behavior (localStorage, wallpaper persistence,
          desktop orchestration) lives in consuming apps only.
        </p>
      </header>

      {/* Live interactive demo — settings window layout */}
      <Surface elevation="floating" className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-3.5">
          <SectionLabel>live demo / settings window</SectionLabel>
        </div>
        <div className="grid min-h-[440px]" style={{ gridTemplateColumns: '160px 1fr' }}>
          {/* Sidebar */}
          <div className="border-r border-border bg-sidebar p-3">
            <SettingsNavSection label="Demo settings sections">
              <SettingsNavItem
                active={section === 'personalization'}
                aria-current={section === 'personalization' ? 'page' : undefined}
                onClick={() => setSection('personalization')}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
                data-testid="demo-nav-personalization"
              >
                Personalization
              </SettingsNavItem>
              <SettingsNavItem
                active={section === 'accessibility'}
                aria-current={section === 'accessibility' ? 'page' : undefined}
                onClick={() => setSection('accessibility')}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="4" r="2"/><line x1="12" y1="22" x2="12" y2="12"/><path d="M5 9l7 3 7-3"/><line x1="5" y1="19" x2="12" y2="12"/><line x1="19" y1="19" x2="12" y2="12"/></svg>}
                data-testid="demo-nav-accessibility"
              >
                Accessibility
              </SettingsNavItem>
            </SettingsNavSection>
          </div>

          {/* Content pane */}
          <div className="space-y-4 overflow-y-auto p-5">
            {section === 'personalization' && (
              <>
                <SectionLabel>personalization</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight">Appearance</h2>

                <div className="space-y-3.5">
                  <SettingsSectionHeader
                    label="Theme"
                    description={contrastTheme === 'none'
                      ? 'Controls the regular light or dark appearance.'
                      : 'Light and dark themes are disabled while a contrast theme is active.'}
                  />
                  <div className="flex gap-2" role="group" aria-label="Regular theme">
                    {(['light', 'dark'] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        disabled={contrastTheme !== 'none'}
                        aria-pressed={regularTheme === value}
                        onClick={() => setRegularTheme(value)}
                        className="rounded-md border border-border bg-card px-3 py-2 text-sm capitalize text-foreground aria-pressed:border-primary aria-pressed:text-primary disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <SettingsDivider />

                {/* Color presets section */}
                <div className="space-y-3.5">
                  <SettingsSectionHeader
                    label="Desktop wallpaper"
                    description={contrastTheme === 'none'
                      ? 'Choose a solid color for your desktop background.'
                      : 'Wallpaper controls are disabled while a contrast theme is active.'}
                  />
                  <div className="flex gap-2.5" aria-label="Default solid colors">
                    {COLOR_PRESETS.map((preset) => (
                      <SettingsColorPreset
                        key={preset.color}
                        color={preset.color}
                        label={preset.label}
                        name={preset.name}
                        selected={selectedPreset === preset.color}
                        onSelect={() => setSelectedPreset(preset.color)}
                        disabled={contrastTheme !== 'none'}
                        data-testid={`demo-color-preset-${preset.name.toLowerCase().replace(' ', '-')}`}
                      />
                    ))}
                    {/* Custom color indicator */}
                    <button
                      type="button"
                      disabled={contrastTheme !== 'none'}
                      className="grid cursor-pointer justify-items-start gap-1 border-0 bg-transparent p-0 text-left text-[10px] text-muted-foreground focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-45"
                      onClick={() => setSelectedPreset(null)}
                    >
                      <span
                        className="grid size-12 place-items-center rounded-md border border-dashed border-border/60 text-muted-foreground"
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7z"/></svg>
                      </span>
                      <span>Custom…</span>
                    </button>
                  </div>
                </div>

                <SettingsDivider />

                <div className="space-y-3">
                  <SettingsSectionHeader
                    label="Transparency levels"
                    description="Fine-tune translucent surfaces while Transparency effects is enabled."
                  />
                  {transparency && (
                    <>
                      <SettingsSliderGroup
                        id="demo-window-transparency"
                        label="Window transparency"
                        value={transparencyLevel}
                        min={0}
                        max={70}
                        step={5}
                        onChange={setTransparencyLevel}
                        guidanceStart="None"
                        guidanceEnd="Almost full"
                      />
                      <SettingsSliderGroup
                        id="demo-sticky-transparency"
                        label="Sticky transparency"
                        value={stickyTransparencyLevel}
                        min={0}
                        max={70}
                        step={5}
                        onChange={setStickyTransparencyLevel}
                        guidanceStart="None"
                        guidanceEnd="Almost full"
                      />
                    </>
                  )}
                </div>
              </>
            )}

            {section === 'accessibility' && (
              <>
                <SectionLabel>accessibility</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight">Accessibility</h2>

                {/* Display section */}
                <div className="space-y-3">
                  <SettingsSectionHeader
                    label="Display"
                    description="Adjust how elements appear on screen."
                  />

                  <SettingsToggleRow
                    id="demo-scrollbars"
                    label="Always show scrollbars"
                    description="Keeps scrollbar tracks permanently visible instead of hiding when idle."
                    checked={alwaysScrollbars}
                    onChange={setAlwaysScrollbars}
                    data-testid="demo-toggle-scrollbars"
                  />

                  <SettingsToggleRow
                    id="demo-transparency"
                    label="Transparency effects"
                    description="Enables transparency across windows, the dock, menus, and stickies."
                    checked={transparency}
                    onChange={setTransparency}
                    data-testid="demo-toggle-transparency"
                  />

                </div>

                <SettingsDivider />

                {/* Motion section */}
                <div className="space-y-3">
                  <SettingsSectionHeader
                    label="Motion"
                    description="Control animations and transitions across the UI."
                  />

                  <SettingsToggleRow
                    id="demo-animations"
                    label="UI animations"
                    description="Enables transitions, keyframe animations, and motion effects."
                    checked={animations}
                    onChange={setAnimations}
                    data-testid="demo-toggle-animations"
                  />

                  {animations && (
                    <div className="space-y-2 rounded-lg border border-border/30 bg-card/40 p-3">
                      <SettingsSectionHeader
                        label="Animation speed"
                        description={
                          <><strong>Less</strong> — slower, reduced intensity. <strong>Default</strong> — standard timing. <strong>More</strong> — faster, snappier.</>
                        }
                      />
                      <SettingsSegmentedChoice
                        groupLabel="Animation speed"
                        options={ANIMATION_SPEED_OPTIONS}
                        value={animationSpeed}
                        onChange={(v) => setAnimationSpeed(v as AnimSpeed)}
                        data-testid="demo-segmented-speed"
                      />
                    </div>
                  )}
                </div>

                <SettingsDivider />

                {/* Contrast section */}
                <div className="space-y-3">
                  <SettingsSectionHeader
                    label="Contrast theme"
                    description={
                      <><strong>Low contrast</strong> softens visual harshness for brightness sensitivity. <strong>High contrast</strong> maximises black/white separation and sharpens focus indicators.</>
                    }
                  />
                  <div role="radiogroup" aria-label="Contrast theme" className="flex flex-wrap gap-2.5">
                    {CONTRAST_CARDS.map(({ variant, key, label, description }) => (
                      <SettingsContrastCard
                        key={variant}
                        variant={variant}
                        label={label}
                        description={description}
                        selected={contrastTheme === key}
                        onSelect={() => setContrastTheme(key)}
                        data-testid={`demo-contrast-${key}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Surface>

      {/* Static component reference: all states side-by-side */}
      <section className="space-y-6">
        <div>
          <SectionLabel>reference / all states</SectionLabel>
          <h2 className="mt-2 text-xl font-semibold">Component gallery</h2>
        </div>

        {/* Toggle rows: unchecked / checked / disabled */}
        <Surface className="space-y-3 p-5">
          <SectionLabel>settings-toggle-row</SectionLabel>
          <div className="space-y-2">
            <SettingsToggleRow id="ref-off" label="Always show scrollbars" description="Keeps scrollbar tracks permanently visible." checked={false} onChange={() => {}} />
            <SettingsToggleRow id="ref-on" label="Transparency effects" description="Enables transparency across system surfaces." checked={true} onChange={() => {}} />
            <SettingsToggleRow id="ref-disabled" label="Feature unavailable" description="Disabled when contrast theme is active." checked={false} onChange={() => {}} disabled />
          </div>
        </Surface>

        {/* Slider group */}
        <Surface className="p-5">
          <SectionLabel>settings-slider-group</SectionLabel>
          <div className="mt-3">
            <SettingsSliderGroup
              id="ref-slider"
              label="Transparency level"
              value={35}
              min={0}
              max={70}
              step={5}
              onChange={() => {}}
              guidanceStart="None"
              guidanceEnd="Almost full"
            />
          </div>
        </Surface>

        {/* Segmented choice */}
        <Surface className="p-5">
          <SectionLabel>settings-segmented-choice</SectionLabel>
          <div className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Default selected</p>
            <SettingsSegmentedChoice
              groupLabel="Animation speed"
              options={ANIMATION_SPEED_OPTIONS}
              value="default"
              onChange={() => {}}
            />
            <p className="text-xs text-muted-foreground">Less selected</p>
            <SettingsSegmentedChoice
              groupLabel="Animation speed"
              options={ANIMATION_SPEED_OPTIONS}
              value="less"
              onChange={() => {}}
            />
          </div>
        </Surface>

        {/* Contrast cards */}
        <Surface className="p-5">
          <SectionLabel>settings-contrast-card</SectionLabel>
          <div role="radiogroup" aria-label="Contrast theme reference" className="mt-3 flex flex-wrap gap-3">
            {CONTRAST_CARDS.map(({ variant, key, label, description }) => (
              <SettingsContrastCard
                key={variant}
                variant={variant}
                label={label}
                description={description}
                selected={key === 'none'}
                onSelect={() => {}}
              />
            ))}
          </div>
        </Surface>

        {/* Color presets */}
        <Surface className="p-5">
          <SectionLabel>settings-color-preset</SectionLabel>
          <div className="mt-3 flex flex-wrap gap-3">
            {COLOR_PRESETS.map((preset, i) => (
              <SettingsColorPreset
                key={preset.color}
                color={preset.color}
                label={preset.label}
                name={preset.name}
                selected={i === 0}
                onSelect={() => {}}
              />
            ))}
          </div>
        </Surface>

        {/* Nav section */}
        <Surface className="p-5">
          <SectionLabel>settings-nav-section / settings-nav-item</SectionLabel>
          <div className="mt-3 max-w-[180px] rounded-lg border border-border bg-sidebar p-2">
            <SettingsNavSection label="Reference nav">
              <SettingsNavItem active icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/></svg>
              }>Active item</SettingsNavItem>
              <SettingsNavItem icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="4" r="2"/><line x1="12" y1="22" x2="12" y2="12"/><path d="M5 9l7 3 7-3"/></svg>
              }>Inactive item</SettingsNavItem>
            </SettingsNavSection>
          </div>
        </Surface>
      </section>

      <CanonicalSpec md={combinedSettingsMd} />
    </div>
  );
}
