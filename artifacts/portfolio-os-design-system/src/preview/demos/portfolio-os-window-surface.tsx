import { WindowSurface, SectionLabel } from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import { mdPortfolioOsWindowSurface } from '../docs-map';

export function PortfolioOsWindowSurfaceDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Window surface shell</p>
        <WindowSurface className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-destructive/60" />
              <span className="size-3 rounded-full bg-muted-foreground/40" />
              <span className="size-3 rounded-full bg-primary/40" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">~/john/about</span>
          </div>
          <div className="p-5">
            <SectionLabel>component / window frame</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              WindowSurface owns the visual shell — border, background, rounded corners, and large shadow.
              The consuming product supplies movement, resizing, z-order, and window controls.
            </p>
          </div>
        </WindowSurface>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Compact window (narrower)</p>
        <WindowSurface className="max-w-xs overflow-hidden">
          <div className="border-b border-border px-3 py-2 font-mono text-xs text-muted-foreground">~/john/terminal</div>
          <div className="bg-black p-4 font-mono text-xs text-green-400">
            <p>$ whoami</p>
            <p className="mt-1 text-muted-foreground">john</p>
          </div>
        </WindowSurface>
      </div>

      <CanonicalSpec md={mdPortfolioOsWindowSurface} title="WindowSurface reference" />
    </div>
  );
}
