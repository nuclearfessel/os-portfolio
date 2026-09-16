import { useState } from 'react';
import { SettingsSegmentedChoice } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsSegmentedChoice } from '../docs-map';

const SPEED_OPTIONS = [
  { value: 'less', label: 'Less', description: 'Slower, reduced intensity' },
  { value: 'default', label: 'Default', description: 'Standard timing' },
  { value: 'more', label: 'More', description: 'Faster, snappier motion' },
];

const SIZE_OPTIONS = [
  { value: 'small', label: 'Small', description: 'Compact icon size' },
  { value: 'medium', label: 'Medium', description: 'Default icon size' },
  { value: 'large', label: 'Large', description: 'Larger icon size' },
];

export function SettingsSegmentedChoiceDemo() {
  const [speed, setSpeed] = useState('default');
  const [size, setSize] = useState('medium');

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · segmented choice · selected: {speed}</p>
          <SettingsSegmentedChoice
            groupLabel="Animation speed"
            options={SPEED_OPTIONS}
            value={speed}
            onChange={setSpeed}
          />
          <p className="mt-2 text-xs text-muted-foreground">Selected: <span className="text-primary font-medium">{speed}</span></p>
        </div>

        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · segmented choice · selected: {size}</p>
          <SettingsSegmentedChoice
            groupLabel="Icon size"
            options={SIZE_OPTIONS}
            value={size}
            onChange={setSize}
          />
          <p className="mt-2 text-xs text-muted-foreground">Selected: <span className="text-primary font-medium">{size}</span></p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">All selected states — static reference</p>
          <div className="space-y-3">
            {SPEED_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <p className="w-20 text-xs text-muted-foreground">{opt.label} selected</p>
                <SettingsSegmentedChoice
                  groupLabel="Speed reference"
                  options={SPEED_OPTIONS}
                  value={opt.value}
                  onChange={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsSegmentedChoice} title="SettingsSegmentedChoice reference" />
    </div>
  );
}
