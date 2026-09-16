import { useState } from 'react';
import { SettingsSliderGroup } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsSliderGroup } from '../docs-map';

export function SettingsSliderGroupDemo() {
  const [level, setLevel] = useState(20);
  const [brightness, setBrightness] = useState(80);

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · stepped slider · current {level}%</p>
          <SettingsSliderGroup
            id="demo-transparency"
            label="Transparency level"
            value={level}
            min={0}
            max={70}
            step={5}
            onChange={setLevel}
            guidanceStart="None"
            guidanceEnd="Almost full"
          />
        </div>

        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · percentage slider · current {brightness}%</p>
          <SettingsSliderGroup
            id="demo-brightness"
            label="Display brightness"
            value={brightness}
            min={0}
            max={100}
            step={10}
            onChange={setBrightness}
            guidanceStart="Dim"
            guidanceEnd="Bright"
            unit="%"
          />
        </div>

        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static · stepped slider · low/mid/high values</p>
          <div className="space-y-3">
            <SettingsSliderGroup
              id="ref-low"
              label="Low value (5%)"
              value={5}
              min={0}
              max={70}
              step={5}
              onChange={() => {}}
              guidanceStart="None"
              guidanceEnd="Almost full"
            />
            <SettingsSliderGroup
              id="ref-mid"
              label="Mid value (35%)"
              value={35}
              min={0}
              max={70}
              step={5}
              onChange={() => {}}
              guidanceStart="None"
              guidanceEnd="Almost full"
            />
            <SettingsSliderGroup
              id="ref-high"
              label="High value (70%)"
              value={70}
              min={0}
              max={70}
              step={5}
              onChange={() => {}}
              guidanceStart="None"
              guidanceEnd="Almost full"
            />
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsSliderGroup} title="SettingsSliderGroup reference" />
    </div>
  );
}
