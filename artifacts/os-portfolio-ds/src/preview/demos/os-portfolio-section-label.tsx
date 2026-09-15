import { SectionLabel } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioSectionLabel } from '../docs-map';

export function OsPortfolioSectionLabelDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Common contexts</p>
          <div className="space-y-5">
            <div className="space-y-1">
              <SectionLabel>readme.md</SectionLabel>
              <p className="text-sm text-muted-foreground">Inline kicker label above a heading</p>
            </div>
            <div className="space-y-1">
              <SectionLabel>components / pilot</SectionLabel>
              <p className="text-sm text-muted-foreground">Breadcrumb-style namespace label</p>
            </div>
            <div className="space-y-1">
              <SectionLabel>projects / selected</SectionLabel>
              <p className="text-sm text-muted-foreground">Category label in a content section</p>
            </div>
            <div className="space-y-1">
              <SectionLabel>field note / 004</SectionLabel>
              <p className="text-sm text-muted-foreground">Sequential annotation label</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">In context — heading pairing</p>
          <div className="rounded-md border border-border bg-card p-4">
            <SectionLabel>case study / product systems / 2024</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Signal Operations Platform</h2>
            <p className="mt-1 text-sm text-muted-foreground">A calm, coherent operating layer for teams who need to act on signals quickly.</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Color override via className</p>
          <div className="flex flex-wrap gap-4">
            <SectionLabel>default (primary)</SectionLabel>
            <SectionLabel className="text-muted-foreground">muted override</SectionLabel>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioSectionLabel} title="SectionLabel reference" />
    </div>
  );
}
