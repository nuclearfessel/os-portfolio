/**
 * Pattern pages — all docs/patterns/*.md rendered via the canonical Markdown renderer.
 *
 * Each exported function is a self-contained page registered in the registry
 * under the "Patterns" nav group.
 */

import { MarkdownDoc } from '../md-renderer';
import {
  mdPatternDesktopWindow,
  mdPatternResponsiveDock,
  mdPatternLauncherGrid,
  mdPatternStickyNotes,
  mdPatternContextMenus,
  mdPatternProjectCardList,
  mdPatternSettingsWindow,
  mdPatternPersonalizationColors,
  mdPatternAccessibilityPanel,
  mdPatternContrastOverride,
  mdPatternTransparencySurfaces,
  mdPatternSavedState,
  mdPatternAnnotatedInterfaceTeaching,
} from '../docs-map';

function PatternPage({ md }: { md: string }) {
  return (
    <div className="w-full max-w-none">
      <MarkdownDoc markdown={md} hideTokenSections />
    </div>
  );
}

export function PatternDesktopWindowWorkspace() {
  return <PatternPage md={mdPatternDesktopWindow} />;
}

export function PatternResponsiveDock() {
  return <PatternPage md={mdPatternResponsiveDock} />;
}

export function PatternDesktopLauncherGrid() {
  return <PatternPage md={mdPatternLauncherGrid} />;
}

export function PatternStickyNotes() {
  return <PatternPage md={mdPatternStickyNotes} />;
}

export function PatternContextMenus() {
  return <PatternPage md={mdPatternContextMenus} />;
}

export function PatternProjectCardList() {
  return <PatternPage md={mdPatternProjectCardList} />;
}

export function PatternSettingsWindow() {
  return <PatternPage md={mdPatternSettingsWindow} />;
}

export function PatternPersonalizationColors() {
  return <PatternPage md={mdPatternPersonalizationColors} />;
}

export function PatternAccessibilityPanel() {
  return <PatternPage md={mdPatternAccessibilityPanel} />;
}

export function PatternContrastOverride() {
  return <PatternPage md={mdPatternContrastOverride} />;
}

export function PatternTransparencySurfaces() {
  return <PatternPage md={mdPatternTransparencySurfaces} />;
}

export function PatternSavedStateOwnership() {
  return <PatternPage md={mdPatternSavedState} />;
}

export function PatternAnnotatedInterfaceTeaching() {
  return <PatternPage md={mdPatternAnnotatedInterfaceTeaching} />;
}
