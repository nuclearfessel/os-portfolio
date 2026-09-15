/**
 * Settings UI primitives — OS Portfolio DS
 *
 * Visual-only components for settings windows. Product behavior (localStorage,
 * wallpaper persistence, desktop orchestration) lives in consuming apps only.
 *
 * Exports:
 *  - SettingsNavSection / SettingsNavItem — sidebar section navigation
 *  - SettingsToggleRow — accessible switch row (role="switch", aria-checked)
 *  - SettingsSliderGroup — transparency/range slider with live percentage output
 *  - SettingsSegmentedChoice — Less/Default/More radio group (animation speed)
 *  - SettingsContrastCard — Standard/Low/High contrast theme card
 *  - SettingsColorPreset — solid-color wallpaper preset block (selected + focus states)
 *  - SettingsDivider — section separator
 *  - SettingsSectionHeader — label + description header block
 */

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// SettingsNavSection
// ---------------------------------------------------------------------------

export type SettingsNavSectionProps = HTMLAttributes<HTMLElement> & {
  /** Accessible label for the nav landmark */
  label?: string;
};

/**
 * Sidebar navigation container for a settings window.
 *
 * Renders a `<nav>` landmark. Place `SettingsNavItem` children inside.
 *
 * ```tsx
 * <SettingsNavSection label="Settings sections">
 *   <SettingsNavItem active aria-current="page" icon={<Sun size={14} />}>Personalization</SettingsNavItem>
 *   <SettingsNavItem icon={<Eye size={14} />}>Accessibility</SettingsNavItem>
 * </SettingsNavSection>
 * ```
 */
export function SettingsNavSection({ className, label = 'Settings sections', children, ...props }: SettingsNavSectionProps) {
  return (
    <nav
      aria-label={label}
      className={classes(
        'portfolio-settings-nav flex flex-col gap-0.5 overflow-y-auto',
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// SettingsNavItem
// ---------------------------------------------------------------------------

export type SettingsNavItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Whether this item is the currently active section */
  active?: boolean;
  /** Optional leading icon — 14×14px recommended */
  icon?: ReactNode;
};

/**
 * Individual settings sidebar navigation button.
 *
 * Pass `active` + `aria-current="page"` on the selected item.
 *
 * ```tsx
 * <SettingsNavItem
 *   active={section === 'personalization'}
 *   aria-current={section === 'personalization' ? 'page' : undefined}
 *   icon={<Sun size={14} />}
 *   onClick={() => setSection('personalization')}
 * >
 *   Personalization
 * </SettingsNavItem>
 * ```
 */
export const SettingsNavItem = forwardRef<HTMLButtonElement, SettingsNavItemProps>(
  ({ className, active = false, icon, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={classes(
        'portfolio-settings-nav-item flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-100',
        'text-muted-foreground hover:bg-muted hover:text-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        active && 'portfolio-settings-nav-item--active bg-primary/10 text-primary',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="portfolio-settings-nav-icon flex size-[18px] shrink-0 items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  ),
);
SettingsNavItem.displayName = 'SettingsNavItem';

// ---------------------------------------------------------------------------
// SettingsDivider
// ---------------------------------------------------------------------------

/**
 * Horizontal rule separating settings sections.
 */
export function SettingsDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={classes('portfolio-settings-divider my-5 border-0 border-t border-border/50', className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// SettingsSectionHeader
// ---------------------------------------------------------------------------

export type SettingsSectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  description?: ReactNode;
};

/**
 * Label + optional description header for a settings sub-section.
 */
export function SettingsSectionHeader({ label, description, className, ...props }: SettingsSectionHeaderProps) {
  return (
    <div className={classes('portfolio-settings-section-header grid gap-0.5', className)} {...props}>
      <span className="portfolio-settings-label text-[13px] font-medium text-foreground">{label}</span>
      {description && (
        <span className="portfolio-settings-description text-[11px] leading-relaxed text-muted-foreground">{description}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsToggleRow
// ---------------------------------------------------------------------------

export type SettingsToggleRowProps = {
  /** id linking <label> to the switch button */
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'data-testid'?: string;
  className?: string;
};

/**
 * Accessible settings toggle row — label + optional description + pill switch.
 *
 * The pill button carries `role="switch"` and `aria-checked`, so assistive
 * technology announces it correctly as a toggle switch.
 *
 * ```tsx
 * <SettingsToggleRow
 *   id="a11y-transparency"
 *   label="Transparency effects"
 *   description="Enables transparency across system surfaces."
 *   checked={prefs.windowTransparency}
 *   onChange={(v) => updatePrefs({ windowTransparency: v })}
 * />
 * ```
 */
export function SettingsToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
  'data-testid': testId,
  className,
}: SettingsToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className={classes(
        'portfolio-settings-toggle-row flex cursor-pointer items-center gap-3.5 rounded-lg border border-border/30 bg-card/40 px-3 py-2.5 transition-colors duration-100',
        'hover:border-border/60 hover:bg-card/60',
        disabled && 'portfolio-settings-toggle-row--disabled pointer-events-none opacity-45',
        className,
      )}
      data-testid={testId}
    >
      <div className="portfolio-settings-toggle-label-group flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="portfolio-settings-label text-[13px] font-medium text-foreground">{label}</span>
        {description && (
          <span className="portfolio-settings-description text-[11px] leading-relaxed text-muted-foreground">{description}</span>
        )}
      </div>
      {/* Pill switch — uses native button with switch semantics */}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        aria-label={label}
        className={classes(
          'portfolio-settings-toggle-switch relative h-5 w-9 shrink-0 appearance-none rounded-full transition-colors duration-150',
          'bg-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          checked && 'portfolio-settings-toggle-switch--on bg-primary',
        )}
        onClick={() => onChange(!checked)}
        data-testid={testId ? `${testId}-switch` : undefined}
      >
        {/* Knob */}
        <span
          className={classes(
            'portfolio-settings-toggle-knob pointer-events-none absolute left-[3px] top-[3px] size-3.5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </label>
  );
}

// ---------------------------------------------------------------------------
// SettingsSliderGroup
// ---------------------------------------------------------------------------

export type SettingsSliderGroupProps = {
  /** Associates <label> and <input> */
  id: string;
  label: string;
  /** Current numeric value */
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  /** Makes the range non-interactive without changing its controlled value */
  disabled?: boolean;
  /** Explains why the range is disabled and is announced with the input */
  disabledDescription?: ReactNode;
  /** Left guidance label (e.g. "Subtle") */
  guidanceStart?: string;
  /** Right guidance label (e.g. "More transparent") */
  guidanceEnd?: string;
  /** Unit string appended to the value display (default "%") */
  unit?: string;
  /** aria-valuetext template — receives value+unit */
  ariaValueText?: string;
  'data-testid'?: string;
  className?: string;
};

/**
 * Conditional transparency/range slider group with live percentage output.
 *
 * Show level controls in Personalization while the system transparency toggle
 * is on. The `<output>` element announces live
 * changes to assistive technology.
 *
 * ```tsx
 * {prefs.windowTransparency && (
 *   <SettingsSliderGroup
 *     id="personalization-window-transparency"
 *     label="Window transparency"
 *     value={prefs.transparencyLevel}
 *     min={0}
 *     max={70}
 *     step={5}
 *     onChange={(v) => updatePrefs({ transparencyLevel: v })}
 *     guidanceStart="None"
 *     guidanceEnd="Almost full"
 *   />
 * )}
 * ```
 */
export function SettingsSliderGroup({
  id,
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  disabledDescription,
  guidanceStart,
  guidanceEnd,
  unit = '%',
  ariaValueText,
  'data-testid': testId,
  className,
}: SettingsSliderGroupProps) {
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div
      className={classes(
        'portfolio-settings-slider-group grid gap-2 rounded-lg border border-border/30 bg-card/40 p-3',
        disabled && 'border-border/20 bg-card/25',
        className,
      )}
      data-testid={testId}
      data-disabled={disabled ? '' : undefined}
    >
      {/* Heading row: label + live value output */}
      <div className={classes(
        'portfolio-settings-slider-heading flex items-center justify-between gap-3',
        disabled && 'opacity-50',
      )}>
        <span className="portfolio-settings-label text-[13px] font-medium text-foreground" id={`${id}-label`}>
          {label}
        </span>
        <output
          htmlFor={id}
          aria-live="polite"
          className="portfolio-settings-slider-value font-mono text-[11px] text-primary"
          data-testid={testId ? `${testId}-value` : undefined}
        >
          {value}{unit}
        </output>
      </div>

      {/* Range input */}
      <div
        className={classes(
          'portfolio-settings-slider-control relative h-5',
          disabled && 'opacity-50',
        )}
        style={{
          '--slider-progress': `${progress}%`,
          '--slider-thumb-left': `calc(${progress}% - ${(progress / 100) * 14}px)`,
        } as React.CSSProperties}
        data-testid={testId ? `${testId}-track` : undefined}
      >
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={ariaValueText ?? `${value}${unit}`}
          aria-labelledby={`${id}-label`}
          aria-describedby={disabled && disabledDescription ? `${id}-disabled-description` : undefined}
          className={classes(
            'portfolio-settings-slider absolute inset-0 z-[1] h-5 w-full opacity-0',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          data-testid={testId ? `${testId}-slider` : undefined}
        />
      </div>

      {/* Guidance labels */}
      {(guidanceStart || guidanceEnd) && (
        <div
          className={classes(
            'portfolio-settings-slider-guidance flex justify-between font-mono text-[9px] text-muted-foreground',
            disabled && 'opacity-50',
          )}
          aria-hidden="true"
        >
          <span>{guidanceStart}</span>
          <span>{guidanceEnd}</span>
        </div>
      )}
      {disabled && disabledDescription && (
        <p
          id={`${id}-disabled-description`}
          className="portfolio-settings-slider-disabled-description m-0 font-mono text-[10px] leading-relaxed text-muted-foreground"
          data-testid={testId ? `${testId}-disabled-description` : undefined}
        >
          {disabledDescription}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsSegmentedChoice
// ---------------------------------------------------------------------------

export type SegmentedOption = {
  value: string;
  label: string;
  description?: string;
};

export type SettingsSegmentedChoiceProps = {
  /** Accessible label for the radiogroup */
  groupLabel: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
  className?: string;
};

/**
 * Segmented radio choice — Less / Default / More or any set of exclusive options.
 *
 * Renders a `role="radiogroup"` wrapper around pill buttons that each carry
 * `role="radio"` and `aria-checked`. Wraps to new lines on narrow layouts.
 *
 * ```tsx
 * <SettingsSegmentedChoice
 *   groupLabel="Animation speed"
 *   options={[
 *     { value: 'less',    label: 'Less',    description: 'Slower, reduced intensity' },
 *     { value: 'default', label: 'Default', description: 'Standard timing' },
 *     { value: 'more',    label: 'More',    description: 'Faster, snappier motion' },
 *   ]}
 *   value={prefs.animationSpeed}
 *   onChange={(v) => updatePrefs({ animationSpeed: v as AnimationSpeed })}
 * />
 * ```
 */
export function SettingsSegmentedChoice({
  groupLabel,
  options,
  value: selected,
  onChange,
  'data-testid': testId,
  className,
}: SettingsSegmentedChoiceProps) {
  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className={classes('portfolio-settings-segmented-choice flex flex-wrap gap-1.5', className)}
      data-testid={testId}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            title={option.description}
            className={classes(
              'portfolio-settings-segment-chip inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isSelected
                ? 'portfolio-settings-segment-chip--selected border-primary bg-primary text-primary-foreground'
                : 'border-border/50 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-primary',
            )}
            onClick={() => onChange(option.value)}
            data-testid={testId ? `${testId}-${option.value}` : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsContrastCard
// ---------------------------------------------------------------------------

export type ContrastVariant = 'standard' | 'low' | 'high';

export type SettingsContrastCardProps = {
  variant: ContrastVariant;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  'data-testid'?: string;
  className?: string;
};

/**
 * Selectable contrast theme card — Standard / Low Contrast / High Contrast.
 *
 * Renders a visual preview miniature, a label with optional check mark, and
 * a description. Uses `role="radio"` inside a `role="radiogroup"` parent.
 *
 * The preview miniature uses fixed CSS custom properties (--contrast-*, --hc-*)
 * defined unconditionally in the package stylesheet for low/high variants, and
 * fixed inline values for the standard variant (always shows dark appearance).
 * These are theme-independent so the card always shows what the mode looks like.
 *
 * ```tsx
 * <div role="radiogroup" aria-label="Contrast theme">
 *   {(['standard','low','high'] as ContrastVariant[]).map((v) => (
 *     <SettingsContrastCard
 *       key={v}
 *       variant={v}
 *       label={v === 'standard' ? 'Standard' : v === 'low' ? 'Low contrast' : 'High contrast'}
 *       description={...}
 *       selected={prefs.contrastTheme === (v === 'standard' ? 'none' : v)}
 *       onSelect={() => updatePrefs({ contrastTheme: v === 'standard' ? 'none' : v })}
 *     />
 *   ))}
 * </div>
 * ```
 */
export function SettingsContrastCard({
  variant,
  label,
  description,
  selected,
  onSelect,
  'data-testid': testId,
  className,
}: SettingsContrastCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      data-testid={testId}
      className={classes(
        'portfolio-settings-contrast-card flex min-w-24 max-w-[148px] flex-1 flex-col items-start gap-1.5 rounded-md p-0 text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      {/* Preview miniature — fixed colours, not themed */}
      <div
        className={classes(
          'portfolio-settings-contrast-preview w-full overflow-hidden rounded-md border-2 transition-colors duration-100',
          'aspect-[3/2] flex flex-col',
          selected
            ? 'border-primary'
            : 'border-border/40 hover:border-primary/50',
          variant === 'standard' && 'portfolio-settings-contrast-preview--standard',
          variant === 'low' && 'portfolio-settings-contrast-preview--low',
          variant === 'high' && 'portfolio-settings-contrast-preview--high',
        )}
        aria-hidden="true"
        style={previewStyle(variant)}
      >
        <div style={barStyle(variant)} />
        <div style={contentStyle(variant)} />
        <div style={textStyle(variant)} />
      </div>

      {/* Label */}
      <span
        className={classes(
          'portfolio-settings-contrast-label inline-flex items-center gap-1 text-[11px] font-semibold leading-none',
          selected ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {selected && (
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {label}
      </span>
      {description && (
        <span className="portfolio-settings-contrast-desc pb-0.5 text-[10px] leading-snug text-muted-foreground/70">
          {description}
        </span>
      )}
    </button>
  );
}

/**
 * Preview miniature style helpers.
 *
 * - standard: uses semantic dark-surface values (inline, no variable needed — it always
 *   shows the dark appearance regardless of app theme, so values are intentionally fixed).
 * - low: references the package's --contrast-* CSS custom properties (defined in index.css).
 * - high: references the package's --hc-* CSS custom properties (defined in index.css).
 *
 * CSS variable references inside style objects resolve correctly because the variables are
 * unconditionally defined on :root in the package stylesheet (not guarded by a data attribute).
 */
function previewStyle(variant: ContrastVariant): React.CSSProperties {
  if (variant === 'standard') {
    // Always show dark desktop appearance — fixed values, not theme variables.
    return { background: 'linear-gradient(160deg, #111326 0%, #1d2042 100%)' };
  }
  if (variant === 'low') {
    return { background: 'var(--contrast-bg)' };
  }
  // high
  return { background: 'var(--hc-bg)' };
}

function barStyle(variant: ContrastVariant): React.CSSProperties {
  const base: React.CSSProperties = { height: '18%', borderBottom: '1px solid', flexShrink: 0 };
  if (variant === 'standard') {
    return { ...base, background: 'rgba(17,19,38,.78)', borderColor: 'rgba(228,255,91,.18)' };
  }
  if (variant === 'low') {
    return { ...base, background: 'var(--contrast-surface)', borderColor: 'var(--contrast-surface-2)' };
  }
  // high
  return { ...base, background: 'var(--hc-surface)', borderColor: 'var(--hc-border)' };
}

function contentStyle(variant: ContrastVariant): React.CSSProperties {
  const base: React.CSSProperties = { margin: '6px 8px 3px', height: '12%', borderRadius: 3, flexShrink: 0 };
  if (variant === 'standard') {
    return { ...base, background: 'rgba(228,255,91,.2)' };
  }
  if (variant === 'low') {
    return { ...base, background: 'var(--contrast-accent)', opacity: 0.4 };
  }
  // high
  return { ...base, background: 'var(--hc-accent)', borderRadius: 2 };
}

function textStyle(variant: ContrastVariant): React.CSSProperties {
  const base: React.CSSProperties = { margin: '0 8px', height: '8%', borderRadius: 3, flexShrink: 0 };
  if (variant === 'standard') {
    return { ...base, background: 'rgba(214,221,255,.15)' };
  }
  if (variant === 'low') {
    return { ...base, background: 'var(--contrast-text)', opacity: 0.25 };
  }
  // high
  return { ...base, background: 'var(--hc-text)', opacity: 0.7, borderRadius: 2 };
}

// ---------------------------------------------------------------------------
// SettingsColorPreset
// ---------------------------------------------------------------------------

export type SettingsColorPresetProps = {
  /** Hex color for the swatch background */
  color: string;
  /** Accessible label (e.g. "Light default, #e8f0ec") */
  label: string;
  /** Display name shown below the swatch */
  name: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  'data-testid'?: string;
  className?: string;
};

/**
 * Selectable solid-color preset block for wallpaper/theme selection.
 *
 * Two presets ship by default:
 * - **Light default** `#E8F0EC` — muted sage
 * - **Dark default**  `#111326` — deep navy
 *
 * When a custom color picker is present alongside presets, selecting a preset
 * clears the custom color; selecting a custom color deselects all presets.
 * The consuming app owns this exclusion logic — the component only reflects
 * the `selected` prop.
 *
 * Focus/selected ring uses `outline-ring` (primary color) so it meets focus
 * visibility requirements in both themes. Selected state adds a 2px primary
 * border and a subtle shadow ring around the swatch.
 *
 * ```tsx
 * <SettingsColorPreset
 *   color="#e8f0ec"
 *   label="Light default, #e8f0ec"
 *   name="Light default"
 *   selected={currentColor === '#e8f0ec'}
 *   onSelect={() => setColor('#e8f0ec')}
 * />
 * ```
 */
export function SettingsColorPreset({
  color,
  label,
  name,
  selected,
  onSelect,
  disabled = false,
  'data-testid': testId,
  className,
}: SettingsColorPresetProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onSelect}
      data-testid={testId}
      className={classes(
        'portfolio-settings-color-preset grid cursor-pointer justify-items-start gap-1 border-0 bg-transparent p-0 text-left text-[10px] text-muted-foreground disabled:cursor-not-allowed disabled:opacity-45',
        'focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        className,
      )}
    >
      <span
        className={classes(
          'portfolio-settings-color-preset-swatch grid size-12 place-items-center rounded-md border shadow-md transition-all duration-100',
          selected
            ? 'portfolio-settings-color-preset-swatch--selected border-2 border-primary shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]'
            : 'border-border/40',
        )}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {selected && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: isLightColor(color) ? '#0b665d' : '#fff' }}
            />
          </svg>
        )}
      </span>
      <span>{name}</span>
    </button>
  );
}

/** Heuristic: pick contrasting check mark color based on perceived lightness */
function isLightColor(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.5;
}
