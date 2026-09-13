import {
  ActionButton,
  ContextMenuSurface,
  DesktopLauncher,
  DockItem,
  ProjectCard,
  SectionLabel,
  StatusIndicator,
  StickyNoteSurface,
  Surface,
  WindowSurface,
} from '../../components/ui/fes-os';

export function FesOsDemo() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <SectionLabel>components / pilot</SectionLabel>
        <h1 className="text-3xl font-semibold tracking-tight">Fes OS primitives</h1>
        <p className="max-w-2xl text-muted-foreground">
          Reusable foundations for the portfolio’s desktop windows, actions, project lists, and system status.
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
        title="Orbit CRM"
        description="A calmer command center for customer teams managing complex accounts."
        tag="PRODUCT / 2024"
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
          <div className="border-b border-border px-4 py-3 font-mono text-xs">~/fes/about</div>
          <div className="space-y-2 p-5"><SectionLabel>component / window frame</SectionLabel><p className="text-sm text-muted-foreground">Owns the window surface while the product supplies movement, resizing, and controls.</p></div>
        </WindowSurface>
        <StickyNoteSurface className="rotate-[-1deg] bg-accent p-5 text-accent-foreground">
          <SectionLabel>field note / 004</SectionLabel>
          <p className="mt-3 text-sm">Direct manipulation stays in the product; the note surface stays shared.</p>
        </StickyNoteSurface>
      </div>

      <Surface className="flex flex-wrap items-end gap-5 p-5">
        <DesktopLauncher className="rounded-md border border-border p-3 text-sm" open>About launcher</DesktopLauncher>
        <DockItem className="size-14 bg-secondary" active aria-label="Active Dock item">01</DockItem>
        <ContextMenuSurface className="w-48 p-2 text-sm">
          <div className="rounded px-2 py-1.5 hover:bg-secondary">Theme</div>
          <div className="rounded px-2 py-1.5 hover:bg-secondary">Reset desktop…</div>
        </ContextMenuSurface>
      </Surface>
    </div>
  );
}