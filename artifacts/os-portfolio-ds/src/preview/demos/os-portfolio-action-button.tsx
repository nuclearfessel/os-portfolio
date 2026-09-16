import { ActionButton } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioActionButton } from '../docs-map';

export function OsPortfolioActionButtonDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">All variants</p>
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary">Primary · idle</ActionButton>
            <ActionButton variant="secondary">Secondary · idle</ActionButton>
            <ActionButton variant="tertiary">Tertiary · idle</ActionButton>
            <ActionButton variant="danger">Danger · idle</ActionButton>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Disabled state</p>
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary" disabled>Primary · disabled</ActionButton>
            <ActionButton variant="secondary" disabled>Secondary · disabled</ActionButton>
            <ActionButton variant="tertiary" disabled>Tertiary · disabled</ActionButton>
            <ActionButton variant="danger" disabled>Danger · disabled</ActionButton>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Common use cases</p>
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton variant="primary">Primary · idle · Open work</ActionButton>
            <ActionButton variant="secondary">Secondary · idle · View case study</ActionButton>
            <ActionButton variant="tertiary">Tertiary · idle · Say hello</ActionButton>
            <ActionButton>Secondary · idle · Close</ActionButton>
            <ActionButton>Secondary · idle · Reset desktop&hellip;</ActionButton>
            <ActionButton variant="danger">Danger · idle · Delete note</ActionButton>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioActionButton} title="ActionButton reference" />
    </div>
  );
}
