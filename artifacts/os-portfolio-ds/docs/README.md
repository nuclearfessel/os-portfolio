# OS Portfolio DS — Documentation

Welcome to the documentation root for `@workspace/os-portfolio-ds`. Every spec, foundation, pattern, and reference lives here.

---

## Quick navigation

| Section | What you'll find |
|---|---|
| [Foundations](#foundations) | Color, typography, spacing & radius, iconography & motion, accessibility |
| [Component specs](#component-specs) | Every shipped primitive — purpose, anatomy, variants, states, API, tokens, Do/Don't |
| [Pattern specs](#pattern-specs) | Composite patterns used by the portfolio |
| [References](#references) | Canonical component inventory, consuming guides |

---

## Foundations

| Doc | Living preview ID |
|---|---|
| [Overview](./README.md) | `overview` |
| [Color](./foundations/color.md) | `color-roles` |
| [Typography](./foundations/typography.md) | `type-scale` |
| [Spacing & Radius](./foundations/spacing-radius.md) | `spacing-radius` |
| Motion tokens | `motion-tokens` |
| [Iconography & Motion](./foundations/iconography-motion.md) | `os-portfolio-guidelines` |
| [Accessibility](./foundations/accessibility.md) | `accessibility` |

---

## Component specs

Components are grouped into eight families matching the living style guide.

### OS Portfolio primitives

Source: `src/components/ui/os-portfolio.tsx` · Preview: `os-portfolio-pilot`

| Component | Spec |
|---|---|
| ActionButton | [→](./components/os-portfolio/action-button.md) |
| **Guide Illustration** (`gvc-illustration.tsx`) | [→](./components/os-portfolio/gvc-illustration.md) |
| SectionLabel | [→](./components/os-portfolio/section-label.md) |
| StatusIndicator | [→](./components/os-portfolio/status-indicator.md) |
| Surface | [→](./components/os-portfolio/surface.md) |
| ProjectCard | [→](./components/os-portfolio/project-card.md) |
| WindowSurface | [→](./components/os-portfolio/window-surface.md) |
| DockItem / DockItemLabel | [→](./components/os-portfolio/dock-item.md) |
| DesktopLauncher | [→](./components/os-portfolio/desktop-launcher.md) |
| StickyNoteSurface | [→](./components/os-portfolio/sticky-note-surface.md) |
| ContextMenuSurface | [→](./components/os-portfolio/context-menu-surface.md) |
| TerminalCursor | [→](./components/os-portfolio/terminal-cursor.md) |

### Settings primitives

Source: `src/components/ui/settings.tsx` · Preview: `os-portfolio-settings`

| Component | Spec |
|---|---|
| SettingsNavSection / SettingsNavItem | [→](./components/settings/settings-nav.md) |
| SettingsToggleRow | [→](./components/settings/settings-toggle-row.md) |
| SettingsSliderGroup | [→](./components/settings/settings-slider-group.md) |
| SettingsSegmentedChoice | [→](./components/settings/settings-segmented-choice.md) |
| SettingsContrastCard | [→](./components/settings/settings-contrast-card.md) |
| SettingsColorPreset | [→](./components/settings/settings-color-preset.md) |
| SettingsDivider | [→](./components/settings/settings-divider.md) |
| SettingsSectionHeader | [→](./components/settings/settings-section-header.md) |

Full settings family reference: [settings-family.md](./components/settings/settings-family.md)
(mirrors `docs/references/components/settings.md`).

### Actions

Source: `src/components/ui/button.tsx`, `button-group.tsx`, `toggle.tsx`, `toggle-group.tsx`

| Component | Preview ID | Spec |
|---|---|---|
| Button | `button` | [→](./components/actions/button.md) |
| ButtonGroup | `button-group` | [→](./components/actions/button-group.md) |
| Toggle | `toggle` | [→](./components/actions/toggle.md) |
| ToggleGroup / ToggleGroupItem | `toggle-group` | [→](./components/actions/toggle-group.md) |

### Forms & Inputs

Source: `src/components/ui/input.tsx`, `input-group.tsx`, `input-otp.tsx`, `textarea.tsx`,
`checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `slider.tsx`, `switch.tsx`, `calendar.tsx`,
`field.tsx`, `form.tsx`

Family spec: [forms-family.md](./components/forms/forms-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| Input | `input` | [forms-family.md#input](./components/forms/forms-family.md#input) |
| InputGroup | `input-group` | [forms-family.md#inputgroup](./components/forms/forms-family.md#inputgroup) |
| InputOTP | `input-otp` | [forms-family.md#inputotp](./components/forms/forms-family.md#inputotp) |
| Textarea | `textarea` | [forms-family.md#textarea](./components/forms/forms-family.md#textarea) |
| Checkbox | `checkbox` | [forms-family.md#checkbox](./components/forms/forms-family.md#checkbox) |
| RadioGroup / RadioGroupItem | `radio-group` | [forms-family.md#radiogroup-radiogroupitem](./components/forms/forms-family.md#radiogroup-radiogroupitem) |
| Select | `select` | [forms-family.md#select](./components/forms/forms-family.md#select) |
| Slider | `slider` | [forms-family.md#slider](./components/forms/forms-family.md#slider) |
| Switch | `switch` | [forms-family.md#switch](./components/forms/forms-family.md#switch) |
| Calendar | `calendar` | [forms-family.md#calendar](./components/forms/forms-family.md#calendar) |
| Field / FieldSet / FieldGroup | `field` | [forms-family.md#field-fieldset-fieldgroup](./components/forms/forms-family.md#field-fieldset-fieldgroup) |
| Form | `form` | [forms-family.md#form](./components/forms/forms-family.md#form) |

### Overlays

Source: `src/components/ui/dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `drawer.tsx`,
`popover.tsx`, `hover-card.tsx`, `tooltip.tsx`, `command.tsx`

Family spec: [overlays-family.md](./components/overlays/overlays-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| Dialog | `dialog` | [overlays-family.md#dialog](./components/overlays/overlays-family.md#dialog) |
| AlertDialog | `alert-dialog` | [overlays-family.md#alertdialog](./components/overlays/overlays-family.md#alertdialog) |
| Sheet | `sheet` | [overlays-family.md#sheet](./components/overlays/overlays-family.md#sheet) |
| Drawer | `drawer` | [overlays-family.md#drawer](./components/overlays/overlays-family.md#drawer) |
| Popover | `popover` | [overlays-family.md#popover](./components/overlays/overlays-family.md#popover) |
| HoverCard | `hover-card` | [overlays-family.md#hovercard](./components/overlays/overlays-family.md#hovercard) |
| Tooltip | `tooltip` | [overlays-family.md#tooltip](./components/overlays/overlays-family.md#tooltip) |
| Command | `command` | [overlays-family.md#command](./components/overlays/overlays-family.md#command) |

### Menus & Navigation

Source: `src/components/ui/dropdown-menu.tsx`, `context-menu.tsx`, `menubar.tsx`,
`navigation-menu.tsx`, `breadcrumb.tsx`, `pagination.tsx`, `tabs.tsx`, `sidebar.tsx`

Family spec: [navigation-family.md](./components/navigation/navigation-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| DropdownMenu | `dropdown-menu` | [navigation-family.md#dropdownmenu](./components/navigation/navigation-family.md#dropdownmenu) |
| ContextMenu | `context-menu` | [navigation-family.md#contextmenu](./components/navigation/navigation-family.md#contextmenu) |
| Menubar | `menubar` | [navigation-family.md#menubar](./components/navigation/navigation-family.md#menubar) |
| NavigationMenu | `navigation-menu` | [navigation-family.md#navigationmenu](./components/navigation/navigation-family.md#navigationmenu) |
| Breadcrumb | `breadcrumb` | [navigation-family.md#breadcrumb](./components/navigation/navigation-family.md#breadcrumb) |
| Pagination | `pagination` | [navigation-family.md#pagination](./components/navigation/navigation-family.md#pagination) |
| Tabs | `tabs` | [navigation-family.md#tabs](./components/navigation/navigation-family.md#tabs) |
| Sidebar | `sidebar` | [navigation-family.md#sidebar](./components/navigation/navigation-family.md#sidebar) |

### Data Display

Source: `src/components/ui/avatar.tsx`, `badge.tsx`, `card.tsx`, `table.tsx`, `accordion.tsx`,
`collapsible.tsx`, `carousel.tsx`, `item.tsx`, `empty.tsx`, `kbd.tsx`, `aspect-ratio.tsx`

Family spec: [data-display-family.md](./components/data-display/data-display-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| Avatar | `avatar` | [data-display-family.md#avatar](./components/data-display/data-display-family.md#avatar) |
| Badge | `badge` | [data-display-family.md#badge](./components/data-display/data-display-family.md#badge) |
| Card | `card` | [data-display-family.md#card](./components/data-display/data-display-family.md#card) |
| Table | `table` | [data-display-family.md#table](./components/data-display/data-display-family.md#table) |
| Accordion | `accordion` | [data-display-family.md#accordion](./components/data-display/data-display-family.md#accordion) |
| Collapsible | `collapsible` | [data-display-family.md#collapsible](./components/data-display/data-display-family.md#collapsible) |
| Carousel | `carousel` | [data-display-family.md#carousel](./components/data-display/data-display-family.md#carousel) |
| Item / ItemGroup | `item` | [data-display-family.md#item-itemgroup](./components/data-display/data-display-family.md#item-itemgroup) |
| Empty | `empty` | [data-display-family.md#empty](./components/data-display/data-display-family.md#empty) |
| Kbd / KbdGroup | `kbd` | [data-display-family.md#kbd-kbdgroup](./components/data-display/data-display-family.md#kbd-kbdgroup) |
| AspectRatio | `aspect-ratio` | [data-display-family.md#aspectratio](./components/data-display/data-display-family.md#aspectratio) |

### Feedback

Source: `src/components/ui/alert.tsx`, `progress.tsx`, `skeleton.tsx`, `spinner.tsx`,
`toast.tsx`, `toaster.tsx`, `sonner.tsx`

Family spec: [feedback-family.md](./components/feedback/feedback-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| Alert | `alert` | [feedback-family.md#alert](./components/feedback/feedback-family.md#alert) |
| Progress | `progress` | [feedback-family.md#progress](./components/feedback/feedback-family.md#progress) |
| Skeleton | `skeleton` | [feedback-family.md#skeleton](./components/feedback/feedback-family.md#skeleton) |
| Spinner | `spinner` | [feedback-family.md#spinner](./components/feedback/feedback-family.md#spinner) |
| Toast / Toaster | `toast` | [feedback-family.md#toast-toaster](./components/feedback/feedback-family.md#toast-toaster) |
| Sonner | `sonner` | [feedback-family.md#sonner](./components/feedback/feedback-family.md#sonner) |

### Structure & Layout

Source: `src/components/ui/separator.tsx`, `scroll-area.tsx`, `resizable.tsx`

Family spec: [structure-family.md](./components/structure/structure-family.md)

| Component | Preview ID | Spec anchor |
|---|---|---|
| Separator | `separator` | [structure-family.md#separator](./components/structure/structure-family.md#separator) |
| ScrollArea | `scroll-area` | [structure-family.md#scrollarea](./components/structure/structure-family.md#scrollarea) |
| ResizablePanelGroup | `resizable` | [structure-family.md#resizablepanelgroup](./components/structure/structure-family.md#resizablepanelgroup) |

### Charts

Source: `src/components/ui/chart.tsx`

| Component | Preview ID | Spec |
|---|---|---|
| ChartContainer / ChartTooltip / ChartLegend | `chart` | [→](./components/charts/chart.md) |

---

## Pattern specs

| Pattern | Spec |
|---|---|
| Annotated interface teaching pattern | [→](./patterns/annotated-interface-teaching.md) |
| Desktop window workspace | [→](./patterns/desktop-window-workspace.md) |
| Responsive Dock navigation | [→](./patterns/responsive-dock.md) |
| Desktop launcher grid | [→](./patterns/desktop-launcher-grid.md) |
| Sticky notes | [→](./patterns/sticky-notes.md) |
| Context menus | [→](./patterns/context-menus.md) |
| Project-card list | [→](./patterns/project-card-list.md) |
| Settings window & sidebar | [→](./patterns/settings-window.md) |
| Personalization color presets | [→](./patterns/personalization-colors.md) |
| Accessibility preference panel | [→](./patterns/accessibility-panel.md) |
| Contrast override behavior | [→](./patterns/contrast-override.md) |
| Transparency surfaces | [→](./patterns/transparency-surfaces.md) |
| Saved-state ownership | [→](./patterns/saved-state-ownership.md) |

---

## References

| Doc | Purpose |
|---|---|
| [Component inventory](./references/component-inventory.md) | Canonical cross-reference: every export → spec → preview ID |
| [Consuming (web)](./consuming-web.md) | How to import and use this package in a web app |
| [Consuming (Expo)](./consuming-expo.md) | Native Expo usage |
| [Consuming (slides)](./consuming-slides.md) | Slide deck token translation |
| [Migrating (web)](./migrating-web.md) | Replacing existing web themes/components |
| [Migrating (Expo)](./migrating-expo.md) | Replacing existing Expo implementations |
