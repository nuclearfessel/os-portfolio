import { useState } from 'react';
import { SettingsToggleRow } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsToggleRow } from '../docs-map';

export function SettingsToggleRowDemo() {
  const [scrollbars, setScrollbars] = useState(false);
  const [transparency, setTransparency] = useState(true);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive toggles</p>
          <div className="space-y-2">
            <SettingsToggleRow
              id="demo-scrollbars"
              label="Always show scrollbars"
              description="Keeps scrollbar tracks permanently visible instead of hiding when idle."
              checked={scrollbars}
              onChange={setScrollbars}
            />
            <SettingsToggleRow
              id="demo-transparency"
              label="Window transparency effects"
              description="Enables blur and translucency on windows, the dock, and menus."
              checked={transparency}
              onChange={setTransparency}
            />
            <SettingsToggleRow
              id="demo-animations"
              label="UI animations"
              description="Enables transitions, keyframe animations, and motion effects."
              checked={animations}
              onChange={setAnimations}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">All states — static reference</p>
          <div className="space-y-2">
            <SettingsToggleRow
              id="ref-off"
              label="Unchecked state"
              description="Toggle is off — bg-border/60 track, knob at left."
              checked={false}
              onChange={() => {}}
            />
            <SettingsToggleRow
              id="ref-on"
              label="Checked state"
              description="Toggle is on — bg-primary track, knob translated right."
              checked={true}
              onChange={() => {}}
            />
            <SettingsToggleRow
              id="ref-disabled"
              label="Disabled state"
              description="Pointer events removed and opacity reduced to 45%."
              checked={false}
              onChange={() => {}}
              disabled
            />
            <SettingsToggleRow
              id="ref-disabled-on"
              label="Disabled checked"
              description="A feature that is on but cannot be toggled in this context."
              checked={true}
              onChange={() => {}}
              disabled
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Without description</p>
          <div className="space-y-2 max-w-sm">
            <SettingsToggleRow
              id="ref-no-desc"
              label="Compact toggle (no description)"
              checked={true}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsToggleRow} title="SettingsToggleRow reference" />
    </div>
  );
}
