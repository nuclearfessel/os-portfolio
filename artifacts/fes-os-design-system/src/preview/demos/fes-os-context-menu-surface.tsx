import { ContextMenuSurface, SectionLabel } from '../../components/ui/fes-os';
import { CanonicalSpec } from '../md-renderer';
import { mdFesOsContextMenuSurface } from '../docs-map';

export function FesOsContextMenuSurfaceDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <SectionLabel>desktop context menu</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Right-click context menu for the desktop canvas. Items and interaction logic live in the consuming product.</p>
          <ContextMenuSurface className="w-52 p-1.5 text-sm">
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Theme</div>
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Wallpaper&hellip;</div>
            <hr className="my-1 border-border/50" />
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Icon size</div>
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Sort by&hellip;</div>
            <hr className="my-1 border-border/50" />
            <div className="rounded px-3 py-1.5 text-muted-foreground hover:bg-secondary cursor-default">Reset desktop&hellip;</div>
          </ContextMenuSurface>
        </div>

        <div>
          <SectionLabel>sticky note context menu</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Shorter menu for sticky note actions.</p>
          <ContextMenuSurface className="w-44 p-1.5 text-sm">
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Change color</div>
            <div className="rounded px-3 py-1.5 text-foreground hover:bg-secondary cursor-default">Duplicate</div>
            <hr className="my-1 border-border/50" />
            <div className="rounded px-3 py-1.5 text-destructive hover:bg-secondary cursor-default">Delete note</div>
          </ContextMenuSurface>
        </div>
      </div>

      <CanonicalSpec md={mdFesOsContextMenuSurface} title="ContextMenuSurface reference" />
    </div>
  );
}
