/**
 * docs-map.ts — All canonical Markdown docs imported as raw strings via Vite ?raw.
 *
 * Usage:
 *   import { mdFormsFamily, extractSection } from '../docs-map';
 *   const md = extractSection(mdFormsFamily, 'Input');
 *
 * Family docs contain multiple ## sections. Use extractSection() from md-renderer
 * to get only the relevant subsection. Use extractPreamble() for shared conventions.
 */

// ── Actions ────────────────────────────────────────────────────────────────────
export { default as mdButton } from '../../docs/components/actions/button.md?raw';
export { default as mdButtonGroup } from '../../docs/components/actions/button-group.md?raw';
export { default as mdToggle } from '../../docs/components/actions/toggle.md?raw';
export { default as mdToggleGroup } from '../../docs/components/actions/toggle-group.md?raw';

// ── Forms family (one file, sections per component) ───────────────────────────
export { default as mdFormsFamily } from '../../docs/components/forms/forms-family.md?raw';

// ── Overlays family ───────────────────────────────────────────────────────────
export { default as mdOverlaysFamily } from '../../docs/components/overlays/overlays-family.md?raw';

// ── Navigation family ─────────────────────────────────────────────────────────
export { default as mdNavigationFamily } from '../../docs/components/navigation/navigation-family.md?raw';

// ── Data display family ───────────────────────────────────────────────────────
export { default as mdDataDisplayFamily } from '../../docs/components/data-display/data-display-family.md?raw';

// ── Feedback family ───────────────────────────────────────────────────────────
export { default as mdFeedbackFamily } from '../../docs/components/feedback/feedback-family.md?raw';

// ── Structure family ──────────────────────────────────────────────────────────
export { default as mdStructureFamily } from '../../docs/components/structure/structure-family.md?raw';

// ── Charts ─────────────────────────────────────────────────────────────────────
export { default as mdChart } from '../../docs/components/charts/chart.md?raw';

// ── Guide illustration components ────────────────────────────────────────────────────
export { default as mdGvcIllustration } from '../../docs/components/os-portfolio/gvc-illustration.md?raw';

// ── OS Portfolio primitives (individual files) ──────────────────────────────────────
export { default as mdOsPortfolioActionButton } from '../../docs/components/os-portfolio/action-button.md?raw';
export { default as mdOsPortfolioSectionLabel } from '../../docs/components/os-portfolio/section-label.md?raw';
export { default as mdOsPortfolioStatusIndicator } from '../../docs/components/os-portfolio/status-indicator.md?raw';
export { default as mdOsPortfolioSurface } from '../../docs/components/os-portfolio/surface.md?raw';
export { default as mdOsPortfolioProjectCard } from '../../docs/components/os-portfolio/project-card.md?raw';
export { default as mdOsPortfolioWindowSurface } from '../../docs/components/os-portfolio/window-surface.md?raw';
export { default as mdOsPortfolioDockItem } from '../../docs/components/os-portfolio/dock-item.md?raw';
export { default as mdOsPortfolioDesktopLauncher } from '../../docs/components/os-portfolio/desktop-launcher.md?raw';
export { default as mdOsPortfolioStickyNote } from '../../docs/components/os-portfolio/sticky-note-surface.md?raw';
export { default as mdOsPortfolioContextMenuSurface } from '../../docs/components/os-portfolio/context-menu-surface.md?raw';

// ── Settings primitives (individual files) ────────────────────────────────────
export { default as mdSettingsFamily } from '../../docs/components/settings/settings-family.md?raw';
export { default as mdSettingsNav } from '../../docs/components/settings/settings-nav.md?raw';
export { default as mdSettingsToggleRow } from '../../docs/components/settings/settings-toggle-row.md?raw';
export { default as mdSettingsSliderGroup } from '../../docs/components/settings/settings-slider-group.md?raw';
export { default as mdSettingsSegmentedChoice } from '../../docs/components/settings/settings-segmented-choice.md?raw';
export { default as mdSettingsContrastCard } from '../../docs/components/settings/settings-contrast-card.md?raw';
export { default as mdSettingsColorPreset } from '../../docs/components/settings/settings-color-preset.md?raw';
export { default as mdSettingsDivider } from '../../docs/components/settings/settings-divider.md?raw';
export { default as mdSettingsSectionHeader } from '../../docs/components/settings/settings-section-header.md?raw';

// ── Foundations ───────────────────────────────────────────────────────────────
export { default as mdFoundationColor } from '../../docs/foundations/color.md?raw';
export { default as mdFoundationTypography } from '../../docs/foundations/typography.md?raw';
export { default as mdFoundationSpacingRadius } from '../../docs/foundations/spacing-radius.md?raw';
export { default as mdFoundationIconographyMotion } from '../../docs/foundations/iconography-motion.md?raw';
export { default as mdFoundationAccessibility } from '../../docs/foundations/accessibility.md?raw';

// ── Patterns ──────────────────────────────────────────────────────────────────
export { default as mdPatternDesktopWindow } from '../../docs/patterns/desktop-window-workspace.md?raw';
export { default as mdPatternResponsiveDock } from '../../docs/patterns/responsive-dock.md?raw';
export { default as mdPatternLauncherGrid } from '../../docs/patterns/desktop-launcher-grid.md?raw';
export { default as mdPatternStickyNotes } from '../../docs/patterns/sticky-notes.md?raw';
export { default as mdPatternContextMenus } from '../../docs/patterns/context-menus.md?raw';
export { default as mdPatternProjectCardList } from '../../docs/patterns/project-card-list.md?raw';
export { default as mdPatternSettingsWindow } from '../../docs/patterns/settings-window.md?raw';
export { default as mdPatternPersonalizationColors } from '../../docs/patterns/personalization-colors.md?raw';
export { default as mdPatternAccessibilityPanel } from '../../docs/patterns/accessibility-panel.md?raw';
export { default as mdPatternContrastOverride } from '../../docs/patterns/contrast-override.md?raw';
export { default as mdPatternTransparencySurfaces } from '../../docs/patterns/transparency-surfaces.md?raw';
export { default as mdPatternSavedState } from '../../docs/patterns/saved-state-ownership.md?raw';
export { default as mdPatternAnnotatedInterfaceTeaching } from '../../docs/patterns/annotated-interface-teaching.md?raw';
