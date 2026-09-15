import { StickyNoteSurface, SectionLabel } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioStickyNote } from '../docs-map';

const STICKY_COLORS = [
  { id: 'lemon', standard: '#ffd84d', standardText: '#1d2430' },
  { id: 'orange', standard: '#ffb84d', standardText: '#1d2430' },
  { id: 'red', standard: '#c9363e', standardText: '#ffffff' },
  { id: 'cream', standard: '#fff0d2', standardText: '#1d2430' },
  { id: 'teal', standard: '#006456', standardText: '#ffffff' },
  { id: 'blue', standard: '#0d56b3', standardText: '#ffffff' },
  { id: 'purple', standard: '#6648b8', standardText: '#ffffff' },
  { id: 'berry', standard: '#a93570', standardText: '#ffffff' },
  { id: 'forest', standard: '#1e603d', standardText: '#ffffff' },
  { id: 'charcoal', standard: '#343b4f', standardText: '#ffffff' },
] as const;

function StickyPaletteRow({ mode }: { mode: 'standard' | 'low' | 'high' }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {STICKY_COLORS.map((color, index) => {
        const lowAccent = `var(--fixed-sticky-${color.id}-low-accent)`;
        const highAccent = `var(--fixed-sticky-${color.id}-high-accent)`;
        const background = mode === 'standard'
          ? color.standard
          : mode === 'low'
            ? `var(--fixed-sticky-${color.id}-low-bg)`
            : '#000000';
        const foreground = mode === 'standard' ? color.standardText : '#f0eee8';
        const accent = mode === 'standard' ? color.standardText : mode === 'low' ? lowAccent : highAccent;
        return (
          <StickyNoteSurface
            key={`${mode}-${color.id}`}
            className="min-h-32 p-4 shadow-xl"
            data-testid={`sticky-preview-${mode}-${color.id}`}
            style={{
              backgroundColor: background,
              color: foreground,
              borderColor: mode === 'standard' ? 'color-mix(in srgb, currentColor 24%, transparent)' : accent,
              borderWidth: mode === 'high' ? 3 : mode === 'low' ? 2 : 1,
              transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`,
              boxShadow: mode === 'high' ? '0 0 0 1px #000, 0 0 0 3px #fff' : undefined,
            }}
          >
            <SectionLabel style={{ color: accent }}>field note / {color.id}</SectionLabel>
            <p className="mt-2 text-sm font-medium">
              {mode === 'standard' ? 'Standard color' : mode === 'low' ? 'Low Contrast color' : 'High Contrast color'}
            </p>
          </StickyNoteSurface>
        );
      })}
    </div>
  );
}

export function OsPortfolioStickyNoteDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Standard / all 10 colors</p>
        <StickyPaletteRow mode="standard" />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Low Contrast / all 10 colors</p>
        <StickyPaletteRow mode="low" />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">High Contrast / all 10 colors</p>
        <StickyPaletteRow mode="high" />
      </div>

      <CanonicalSpec md={mdOsPortfolioStickyNote} title="StickyNoteSurface reference" />
    </div>
  );
}
