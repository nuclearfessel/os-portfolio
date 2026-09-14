import {
  ActionButton,
  ContextMenuSurface,
  DesktopLauncher,
  DockItem,
  DockItemLabel,
  ProjectCard,
  SectionLabel,
  StatusIndicator,
  StickyNoteSurface,
  Surface,
  WindowSurface,
} from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import {
  mdPortfolioOsActionButton,
  mdPortfolioOsSectionLabel,
  mdPortfolioOsStatusIndicator,
  mdPortfolioOsSurface,
  mdPortfolioOsProjectCard,
  mdPortfolioOsWindowSurface,
  mdPortfolioOsDockItem,
  mdPortfolioOsDesktopLauncher,
  mdPortfolioOsStickyNote,
  mdPortfolioOsContextMenuSurface,
} from '../docs-map';

// Combine all Portfolio OS primitive docs into one readable spec
const combinedMd = [
  mdPortfolioOsActionButton,
  mdPortfolioOsSectionLabel,
  mdPortfolioOsStatusIndicator,
  mdPortfolioOsSurface,
  mdPortfolioOsProjectCard,
  mdPortfolioOsWindowSurface,
  mdPortfolioOsDockItem,
  mdPortfolioOsDesktopLauncher,
  mdPortfolioOsStickyNote,
  mdPortfolioOsContextMenuSurface,
].join('\n\n---\n\n');

export function PortfolioOsDemo() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <SectionLabel>components / pilot</SectionLabel>
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio OS primitives</h1>
        <p className="max-w-2xl text-muted-foreground">
          Reusable foundations for the portfolio&rsquo;s desktop windows, actions, project lists, and system status.
        </p>
      </header>

      <Surface elevation="floating" className="space-y-6 p-6">
        <div className="flex flex-wrap gap-3">
          <ActionButton variant="primary">Primary action</ActionButton>
          <ActionButton>Secondary action</ActionButton>
          <ActionButton variant="danger">Destructive action</ActionButton>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <StatusIndicator />
          <StatusIndicator tone="idle" label="away" />
          <StatusIndicator tone="danger" label="offline" />
        </div>
      </Surface>

      <ProjectCard
        index="01"
        title="Northstar Commerce System"
        description="A flexible foundation that helped a growing commerce team ship consistent storefront and account experiences."
        tag="DESIGN SYSTEM / 2025"
        accent="#e4ff5b"
        action={<ActionButton variant="primary">View case study</ActionButton>}
      />

      <Surface className="space-y-3 p-5">
        <SectionLabel>pattern / window content</SectionLabel>
        <h2 className="text-xl font-medium">Quiet structure, visible hierarchy.</h2>
        <p className="text-sm text-muted-foreground">
          Use one accent, compact mono labels, and restrained surfaces. Motion should confirm state rather than compete for attention.
        </p>
      </Surface>

      <div className="grid gap-5 lg:grid-cols-2">
        <WindowSurface className="overflow-hidden">
          <div className="border-b border-border px-4 py-3 font-mono text-xs">~/john/about</div>
          <div className="space-y-2 p-5"><SectionLabel>component / window frame</SectionLabel><p className="text-sm text-muted-foreground">Owns the window surface while the product supplies movement, resizing, and controls.</p></div>
        </WindowSurface>
        <StickyNoteSurface className="rotate-[-1deg] bg-accent p-5 text-accent-foreground">
          <SectionLabel>field note / 004</SectionLabel>
          <p className="mt-3 text-sm">Direct manipulation stays in the product; the note surface stays shared.</p>
        </StickyNoteSurface>
      </div>

      <Surface className="flex flex-wrap items-end gap-8 p-5">
        <DesktopLauncher className="rounded-md border border-border p-3 text-sm" open>About launcher</DesktopLauncher>
        <div className="space-y-2">
          <SectionLabel>desktop / tooltip label</SectionLabel>
          <div className="inline-flex gap-2 rounded-xl border border-border bg-card p-2">
            <DockItem
              className="size-14 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[18px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
              active
              aria-label="Active desktop Dock item"
              aria-current="true"
            >
              01
              <DockItemLabel presentation="tooltip" className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-100">
                Work &middot; 2
              </DockItemLabel>
            </DockItem>
            <DockItem
              className="size-14 border-accent bg-secondary hover:outline-2 hover:outline-offset-2 hover:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Inactive desktop Dock item"
            >
              02
            </DockItem>
          </div>
        </div>
        <div className="space-y-2">
          <SectionLabel>mobile + tablet / inline label</SectionLabel>
          <DockItem className="flex h-14 w-20 flex-col gap-1 border-accent bg-secondary ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[26px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']" active aria-label="Active responsive Dock item" aria-current="true">
            01
            <DockItemLabel presentation="inline">Work</DockItemLabel>
          </DockItem>
        </div>
        <ContextMenuSurface className="w-48 p-2 text-sm">
          <div className="rounded px-2 py-1.5 hover:bg-secondary">Theme</div>
          <div className="rounded px-2 py-1.5 hover:bg-secondary">Reset desktop&hellip;</div>
        </ContextMenuSurface>
      </Surface>

      <CanonicalSpec md={combinedMd} />
    </div>
  );
}
