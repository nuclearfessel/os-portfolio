import { Surface, SectionLabel } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioSurface } from '../docs-map';

export function OsPortfolioSurfaceDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Elevation variants · static</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Surface elevation="flat" className="p-4">
              <SectionLabel>elevation / flat</SectionLabel>
              <p className="mt-2 text-sm text-muted-foreground">No shadow — use for inline content areas flush with the background.</p>
            </Surface>
            <Surface elevation="raised" className="p-4">
              <SectionLabel>elevation / raised</SectionLabel>
              <p className="mt-2 text-sm text-muted-foreground">Subtle shadow — the default. Use for cards, metric blocks, and grouped info.</p>
            </Surface>
            <Surface elevation="floating" className="p-4">
              <SectionLabel>elevation / floating</SectionLabel>
              <p className="mt-2 text-sm text-muted-foreground">Large shadow — for overlays, dropdowns, and prominent containers.</p>
            </Surface>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">In context — case study metrics block</p>
          <Surface elevation="raised" className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <strong className="block text-2xl font-bold">34%</strong>
                <span className="text-xs text-muted-foreground">faster account reviews</span>
              </div>
              <div>
                <strong className="block text-2xl font-bold">2.1&times;</strong>
                <span className="text-xs text-muted-foreground">more risks caught early</span>
              </div>
              <div>
                <strong className="block text-2xl font-bold">18%</strong>
                <span className="text-xs text-muted-foreground">fewer escalations</span>
              </div>
            </div>
          </Surface>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioSurface} title="Surface reference" />
    </div>
  );
}
