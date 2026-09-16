import { SectionLabel, TerminalCursor } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioTerminalCursor } from '../docs-map';

export function OsPortfolioTerminalCursorDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-lg border border-border bg-card p-6">
        <SectionLabel>terminal cursor</SectionLabel>
        <p className="text-xs text-muted-foreground">
          Functional block caret shown at the active native-input selection.
        </p>
        <div className="flex items-center gap-2 rounded-md bg-[#111326] px-4 py-3 font-mono text-xs text-[#f3f0e3]">
          <span className="text-[#e4ff5b]">john@portfolio:~$</span>
          <span>help</span>
          <TerminalCursor />
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioTerminalCursor} title="TerminalCursor reference" />
    </div>
  );
}