import { StatusIndicator } from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import { mdPortfolioOsStatusIndicator } from '../docs-map';

export function PortfolioOsStatusIndicatorDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">All tones</p>
          <div className="flex flex-wrap items-center gap-6">
            <StatusIndicator tone="online" label="online" />
            <StatusIndicator tone="idle" label="away" />
            <StatusIndicator tone="danger" label="offline" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Custom labels</p>
          <div className="flex flex-wrap items-center gap-6">
            <StatusIndicator tone="online" label="active" />
            <StatusIndicator tone="online" label="available" />
            <StatusIndicator tone="idle" label="busy" />
            <StatusIndicator tone="danger" label="error" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">In context — menubar / status bar</p>
          <div className="flex items-center gap-4 rounded-md border border-border bg-muted/40 px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">~/john</span>
            <span className="mx-auto" />
            <StatusIndicator tone="online" />
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdPortfolioOsStatusIndicator} title="StatusIndicator reference" />
    </div>
  );
}
