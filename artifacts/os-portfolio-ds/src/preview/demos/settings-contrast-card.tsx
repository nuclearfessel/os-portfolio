import { useState } from 'react';
import { SettingsContrastCard, type ContrastVariant } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsContrastCard } from '../docs-map';

const CARDS: { variant: ContrastVariant; label: string; description: string }[] = [
  { variant: 'standard', label: 'Standard', description: 'Default appearance' },
  { variant: 'low', label: 'Low contrast', description: 'Reduced visual harshness' },
  { variant: 'high', label: 'High contrast', description: 'Maximum separation' },
];

export function SettingsContrastCardDemo() {
  const [selected, setSelected] = useState<ContrastVariant>('standard');

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · contrast variants · selected: {selected}</p>
          <div role="radiogroup" aria-label="Contrast theme" className="flex flex-wrap gap-3">
            {CARDS.map(({ variant, label, description }) => (
              <SettingsContrastCard
                key={variant}
                variant={variant}
                label={label}
                description={description}
                selected={selected === variant}
                onSelect={() => setSelected(variant)}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Selected: <span className="text-primary font-medium">{selected}</span></p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static · each contrast variant · selected state</p>
          <div className="space-y-4">
            {CARDS.map(({ variant, label, description }) => (
              <div key={variant} className="space-y-1">
                <p className="text-xs text-muted-foreground">{label} selected</p>
                <div role="radiogroup" aria-label={`${label} reference`} className="flex flex-wrap gap-3">
                  {CARDS.map((card) => (
                    <SettingsContrastCard
                      key={card.variant}
                      variant={card.variant}
                      label={card.label}
                      description={card.description}
                      selected={card.variant === variant}
                      disabled
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsContrastCard} title="SettingsContrastCard reference" />
    </div>
  );
}
