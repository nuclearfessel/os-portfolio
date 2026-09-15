# Pattern: Settings Window & Sidebar

**Preview:** `os-portfolio-settings`

---

## Intent

The settings window uses a fixed-width sidebar beside the active section at large widths. When the window itself narrows, the same navigation smoothly becomes a horizontal sub-navigation toolbar directly below the window title bar. It floats as a desktop window using `WindowSurface`.

---

## Constituent components

| Component | Source | Role |
|---|---|---|
| `WindowSurface` | `os-portfolio.tsx` | Window shell |
| `SettingsNavSection` | `settings.tsx` | Sidebar `<nav>` landmark |
| `SettingsNavItem` | `settings.tsx` | Section nav button |
| `SettingsSectionHeader` | `settings.tsx` | Content section heading |
| `SettingsDivider` | `settings.tsx` | Section separator |
| `SettingsToggleRow` | `settings.tsx` | Boolean preference control |
| `SettingsSliderGroup` | `settings.tsx` | Range slider with live output |
| `SettingsSegmentedChoice` | `settings.tsx` | Exclusive option group |
| `SettingsContrastCard` | `settings.tsx` | Contrast theme selector |
| `SettingsColorPreset` | `settings.tsx` | Wallpaper color swatch |

---

## Anatomy / Composition

```
┌───────────────────────────────────────────────────────┐  WindowSurface
│  Settings                         ← title bar         │
├─────────────────┬─────────────────────────────────────┤
│ Sidebar (160px) │ Content pane (flex-1)                │
│                 │                                      │
│ SettingsNavSection                │ SettingsSectionHeader            │
│   NavItem ● Personalization       │ label + description              │
│   NavItem   Accessibility         │                                  │
│                 │ SettingsToggleRow(s)                 │
│                 │ SettingsDivider                      │
│                 │ SettingsSliderGroup (conditional)    │
│                 │ SettingsDivider                      │
│                 │ SettingsSegmentedChoice              │
│                 │ …                                    │
└─────────────────┴─────────────────────────────────────┘
```

Grid: `gridTemplateColumns: '160px 1fr'`. Sidebar uses `bg-sidebar border-r border-border`.

---

## State ownership

| Concern | Product responsibility |
|---|---|
| Active section | Product state → `active` + `aria-current` on `SettingsNavItem` |
| Preference values | Product state (localStorage, URL, in-memory) |
| Editable display copy | Product state; copy is shared across themes while each element's color is stored per theme |
| DOM attribute writes | Product (see [State contracts](../references/components/settings.md#state-contracts)) |
| "Save as Default" / "Reset" | Product — not design system behavior |
| Window position / open state | Product |

---

## Responsive transformation

This is the reference implementation of the universal OS Portfolio side-navigation window contract. Apply the same transformation to every resizable window that has side navigation; it is not specific to Settings.

| Breakpoint | Layout |
|---|---|
| Wide desktop window | Floating `WindowSurface`, two-pane sidebar + content |
| Narrow desktop window | Sidebar smoothly becomes a two-item sub-navigation toolbar below the title bar; content remains in the row below |
| Tablet | Modal `Sheet` or `Dialog`; sidebar collapses to top tabs or Select |
| Mobile | Full-screen; sidebar becomes a `Select` or inline tabs |

---

## Accessibility checklist

- [ ] `WindowSurface` has `aria-label="Settings"` or `aria-labelledby`.
- [ ] `SettingsNavSection` has descriptive `label` prop.
- [ ] Active nav item has `aria-current="page"`.
- [ ] Narrow-window sub-navigation remains the same named `<nav>` landmark and does not overlap the title bar or content.
- [ ] All preference controls have `id` + linked `label`.
- [ ] `SettingsToggleRow` uses `role="switch"` and `aria-checked`.
- [ ] `SettingsSegmentedChoice` uses `role="radiogroup"` and `role="radio"`.
- [ ] `SettingsContrastCard` parent has `role="radiogroup"`.
- [ ] `SettingsColorPreset` uses `aria-pressed`.
- [ ] Full color pickers open in a named modal dialog and restore focus to their trigger on close.
- [ ] Three-item Personalization groups use three equal columns at `620px` and wider, then one full-width row per item below that container width.
- [ ] Items in the same three-item Personalization group remain equal height in both wide and stacked layouts, including when one item contains a multiline field.

---

## Tokens

`bg-card`, `border-border`, `bg-sidebar`, `border-r border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary/10`, `text-primary`, `ring-ring`

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Show the disabled toggle row when a preference is unavailable | Hide the toggle row when unavailable |
| Use `SettingsDivider` between major setting groups | Use generic `Separator` inside settings pane |
| Keep all state in the consuming product | Add localStorage logic to design system components |
| Show `SettingsSliderGroup` conditionally (when parent toggle is on) | Always render the slider regardless of toggle state |
| Put the full color picker in a floating `Dialog` with a transparent overlay | Expand a complex color picker inline or add a warning-style scrim |

---

## Composition example

```tsx
import { WindowSurface, SectionLabel } from '@workspace/portfolio-os-ds/components/ui/os-portfolio';
import {
  SettingsNavSection, SettingsNavItem,
  SettingsSectionHeader, SettingsDivider,
  SettingsToggleRow, SettingsSliderGroup,
} from '@workspace/portfolio-os-ds/components/ui/settings';

function SettingsWindow({ prefs, updatePrefs, onClose }) {
  const [section, setSection] = useState('accessibility');

  return (
    <WindowSurface aria-label="Settings" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <SectionLabel>settings</SectionLabel>
        <ActionButton aria-label="Close settings" onClick={onClose}>×</ActionButton>
      </div>
      <div className="grid min-h-80" style={{ gridTemplateColumns: '160px 1fr' }}>
        <div className="border-r border-border bg-sidebar p-3">
          <SettingsNavSection label="Settings sections">
            <SettingsNavItem
              active={section === 'accessibility'}
              aria-current={section === 'accessibility' ? 'page' : undefined}
              onClick={() => setSection('accessibility')}
            >
              Accessibility
            </SettingsNavItem>
          </SettingsNavSection>
        </div>
        <div className="overflow-y-auto p-5 space-y-4">
          <SettingsSectionHeader label="Display" description="Adjust visual behavior." />
          <SettingsToggleRow
            id="a11y-transparency"
            label="Transparency effects"
            checked={prefs.windowTransparency}
            onChange={(v) => updatePrefs({ windowTransparency: v })}
          />
          <SettingsDivider />
        </div>
      </div>
    </WindowSurface>
  );
}
```
