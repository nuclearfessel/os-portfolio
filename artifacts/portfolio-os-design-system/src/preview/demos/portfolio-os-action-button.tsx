import { ActionButton } from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import { mdPortfolioOsActionButton } from '../docs-map';

export function PortfolioOsActionButtonDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">All variants</p>
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary">Primary action</ActionButton>
            <ActionButton variant="secondary">Secondary action</ActionButton>
            <ActionButton variant="danger">Destructive action</ActionButton>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Disabled state</p>
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary" disabled>Primary disabled</ActionButton>
            <ActionButton variant="secondary" disabled>Secondary disabled</ActionButton>
            <ActionButton variant="danger" disabled>Danger disabled</ActionButton>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Common use cases</p>
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton variant="primary">View case study</ActionButton>
            <ActionButton>Close</ActionButton>
            <ActionButton>Reset desktop&hellip;</ActionButton>
            <ActionButton variant="danger">Delete note</ActionButton>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdPortfolioOsActionButton} title="ActionButton reference" />
    </div>
  );
}
