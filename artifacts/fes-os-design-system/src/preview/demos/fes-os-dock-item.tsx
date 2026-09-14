import { DockItem, DockItemLabel, SectionLabel } from '../../components/ui/fes-os';
import { CanonicalSpec } from '../md-renderer';
import { mdFesOsDockItem } from '../docs-map';

export function FesOsDockItemDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <SectionLabel>desktop / tooltip presentation</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Tooltip label appears above the item. Used on desktop breakpoint.</p>
          <div className="flex items-end gap-4">
            {['Work', 'About', 'Contact'].map((label, i) => (
              <div key={label} className="relative flex flex-col items-center">
                <DockItemLabel
                  presentation="tooltip"
                  className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-100"
                >
                  {label}
                </DockItemLabel>
                <DockItem
                  active={i === 0}
                  className="size-14 bg-secondary text-sm font-mono"
                  aria-label={`${label} dock item`}
                >
                  0{i + 1}
                </DockItem>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>mobile + tablet / inline presentation</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Label renders inline below the icon. Used on mobile and tablet breakpoints.</p>
          <div className="flex items-end gap-3">
            {['Work', 'About', 'Contact'].map((label, i) => (
              <DockItem
                key={label}
                active={i === 0}
                className="flex h-14 w-16 flex-col items-center gap-0.5 bg-secondary text-sm font-mono"
                aria-label={`${label} dock item`}
              >
                0{i + 1}
                <DockItemLabel presentation="inline">{label}</DockItemLabel>
              </DockItem>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>states / active vs inactive</SectionLabel>
          <div className="mt-3 flex items-end gap-3">
            <div className="text-center">
              <DockItem active className="size-14 bg-secondary text-sm font-mono" aria-label="Active dock item">01</DockItem>
              <p className="mt-1 text-xs text-muted-foreground">active</p>
            </div>
            <div className="text-center">
              <DockItem className="size-14 bg-secondary text-sm font-mono" aria-label="Inactive dock item">02</DockItem>
              <p className="mt-1 text-xs text-muted-foreground">inactive</p>
            </div>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdFesOsDockItem} title="DockItem / DockItemLabel reference" />
    </div>
  );
}
