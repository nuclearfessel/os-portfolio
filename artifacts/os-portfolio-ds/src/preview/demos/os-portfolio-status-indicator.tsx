import { StatusIndicator } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioStatusIndicator } from '../docs-map';

export function OsPortfolioStatusIndicatorDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Tone · static</p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Online · static</p><StatusIndicator tone="online" label="online" /></div>
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Idle · static</p><StatusIndicator tone="idle" label="away" /></div>
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Danger · static</p><StatusIndicator tone="danger" label="offline" /></div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Custom labels · static</p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Online · active · static</p><StatusIndicator tone="online" label="active" /></div>
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Online · available · static</p><StatusIndicator tone="online" label="available" /></div>
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Idle · busy · static</p><StatusIndicator tone="idle" label="busy" /></div>
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Danger · error · static</p><StatusIndicator tone="danger" label="error" /></div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">In context — menubar / status bar</p>
          <div className="flex items-center gap-4 rounded-md border border-border bg-muted/40 px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">~/john</span>
            <span className="mx-auto" />
            <div className="space-y-1"><p className="text-xs uppercase text-muted-foreground">Online · menubar · static</p><StatusIndicator tone="online" /></div>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioStatusIndicator} title="StatusIndicator reference" />
    </div>
  );
}
