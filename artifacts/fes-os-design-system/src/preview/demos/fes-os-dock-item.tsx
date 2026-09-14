import { DockItem, DockItemLabel, SectionLabel } from '../../components/ui/fes-os';
import { CanonicalSpec } from '../md-renderer';
import { mdFesOsDockItem } from '../docs-map';

const desktopActiveClassName =
  "size-14 border-accent bg-secondary text-sm font-mono ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[18px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']";
const desktopInactiveClassName =
  "size-14 border-accent bg-secondary text-sm font-mono hover:outline-2 hover:outline-offset-2 hover:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const responsiveActiveClassName =
  "flex h-14 w-16 flex-col items-center gap-0.5 border-accent bg-secondary text-sm font-mono ring-[3px] ring-primary after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-[26px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']";
const responsiveInactiveClassName =
  "flex h-14 w-16 flex-col items-center gap-0.5 border-accent bg-secondary text-sm font-mono hover:outline-2 hover:outline-offset-2 hover:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function FesOsDockItemDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <SectionLabel>desktop / tooltip presentation</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Tooltip label appears above the item. Used on desktop breakpoint.</p>
          <div className="inline-flex items-end gap-2 rounded-xl border border-border bg-card p-2">
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
                  className={i === 0 ? desktopActiveClassName : desktopInactiveClassName}
                  aria-label={`${label} dock item`}
                  aria-current={i === 0 ? 'true' : undefined}
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
          <div className="inline-flex items-end gap-2 rounded-xl border border-border bg-card p-2">
            {['Work', 'About', 'Contact'].map((label, i) => (
              <DockItem
                key={label}
                active={i === 0}
                className={i === 0 ? responsiveActiveClassName : responsiveInactiveClassName}
                aria-label={`${label} dock item`}
                aria-current={i === 0 ? 'true' : undefined}
              >
                0{i + 1}
                <DockItemLabel presentation="inline">{label}</DockItemLabel>
              </DockItem>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>states / active vs inactive</SectionLabel>
          <div className="mt-3 inline-flex items-end gap-2 rounded-xl border border-border bg-card p-2">
            <div className="text-center">
              <DockItem active className={desktopActiveClassName} aria-label="Active dock item" aria-current="true">01</DockItem>
              <p className="mt-1 text-xs text-muted-foreground">active</p>
            </div>
            <div className="text-center">
              <DockItem className={desktopInactiveClassName} aria-label="Inactive dock item">02</DockItem>
              <p className="mt-1 text-xs text-muted-foreground">inactive</p>
            </div>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdFesOsDockItem} title="DockItem / DockItemLabel reference" />
    </div>
  );
}
