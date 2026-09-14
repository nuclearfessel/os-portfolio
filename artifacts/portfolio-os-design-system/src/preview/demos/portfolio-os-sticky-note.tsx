import { StickyNoteSurface, SectionLabel } from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import { mdPortfolioOsStickyNote } from '../docs-map';

export function PortfolioOsStickyNoteDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Color variants</p>
        <div className="flex flex-wrap gap-4">
          <StickyNoteSurface
            className="w-44 rotate-[-2deg] bg-yellow-200 p-4 shadow-xl"
            style={{ backgroundColor: 'rgba(255, 216, 77, .82)' }}
          >
            <SectionLabel className="text-yellow-900/70">field note / lemon</SectionLabel>
            <p className="mt-2 text-sm font-medium text-yellow-900">
              Direct manipulation stays in the product; the note surface stays shared.
            </p>
          </StickyNoteSurface>

          <StickyNoteSurface
            className="w-44 rotate-[1deg] p-4 shadow-xl"
            style={{ backgroundColor: 'rgba(102, 72, 184, .82)' }}
          >
            <SectionLabel className="text-white/70">field note / purple</SectionLabel>
            <p className="mt-2 text-sm font-medium text-white">
              The best interfaces don&rsquo;t ask for attention.
            </p>
          </StickyNoteSurface>

          <StickyNoteSurface
            className="w-44 rotate-[-1.5deg] p-4 shadow-xl"
            style={{ backgroundColor: 'rgba(0, 100, 86, .82)' }}
          >
            <SectionLabel className="text-teal-200/80">field note / teal</SectionLabel>
            <p className="mt-2 text-sm font-medium text-white">
              Motion should confirm state, not compete for attention.
            </p>
          </StickyNoteSurface>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Flat (no rotation)</p>
        <StickyNoteSurface
          className="max-w-xs p-5 shadow-xl"
          style={{ backgroundColor: 'rgba(255, 240, 210, .82)' }}
        >
          <SectionLabel className="text-amber-900/60">component / sticky-note-surface</SectionLabel>
          <p className="mt-3 text-sm text-amber-900">
            StickyNoteSurface provides the surface shell only — <code className="font-mono text-xs">rounded-lg border shadow-xl</code>.
            Rotation, positioning, and drag logic live in the consuming product.
          </p>
        </StickyNoteSurface>
      </div>

      <CanonicalSpec md={mdPortfolioOsStickyNote} title="StickyNoteSurface reference" />
    </div>
  );
}
