import { useState } from 'react';
import { SettingsColorPreset } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsColorPreset } from '../docs-map';

const PRESETS = [
  { color: '#e8f0ec', label: 'Light default, #e8f0ec', name: 'Light default' },
  { color: '#111326', label: 'Dark default, #111326', name: 'Dark default' },
  { color: '#1a1a2e', label: 'Deep navy, #1a1a2e', name: 'Deep navy' },
  { color: '#2d3561', label: 'Indigo night, #2d3561', name: 'Indigo night' },
  { color: '#0f3460', label: 'Ocean, #0f3460', name: 'Ocean' },
  { color: '#3d5a80', label: 'Steel blue, #3d5a80', name: 'Steel blue' },
];

export function SettingsColorPresetDemo() {
  const [selected, setSelected] = useState<string | null>('#e8f0ec');

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive — wallpaper preset selection</p>
          <div className="flex flex-wrap gap-3" aria-label="Wallpaper color presets">
            {PRESETS.map((preset) => (
              <SettingsColorPreset
                key={preset.color}
                color={preset.color}
                label={preset.label}
                name={preset.name}
                selected={selected === preset.color}
                onSelect={() => setSelected(preset.color)}
              />
            ))}
            <button
              type="button"
              className="grid cursor-pointer justify-items-start gap-1 border-0 bg-transparent p-0 text-left text-[10px] text-muted-foreground focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              onClick={() => setSelected(null)}
            >
              <span
                className="grid size-12 place-items-center rounded-md border border-dashed border-border/60 text-muted-foreground"
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" />
                  <circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" />
                  <path d="M12 22c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7z" />
                </svg>
              </span>
              <span>Custom&hellip;</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Selected: <span className="font-mono text-primary">{selected ?? 'custom'}</span>
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Both default presets — static reference</p>
          <div className="flex gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Selected</p>
              <SettingsColorPreset
                color="#e8f0ec"
                label="Light default, #e8f0ec"
                name="Light default"
                selected={true}
                onSelect={() => {}}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Unselected</p>
              <SettingsColorPreset
                color="#111326"
                label="Dark default, #111326"
                name="Dark default"
                selected={false}
                onSelect={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsColorPreset} title="SettingsColorPreset reference" />
    </div>
  );
}
