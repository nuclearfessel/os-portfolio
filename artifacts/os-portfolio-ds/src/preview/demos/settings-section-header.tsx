import { SettingsSectionHeader } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsSectionHeader } from '../docs-map';

export function SettingsSectionHeaderDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
           <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static · section header variant · with description</p>
          <div className="max-w-md space-y-4">
            <SettingsSectionHeader
              label="Display"
              description="Adjust how elements appear on screen."
            />
            <SettingsSectionHeader
              label="Motion"
              description="Control animations and transitions across the UI."
            />
            <SettingsSectionHeader
              label="Contrast theme"
              description={
                <><strong>Low contrast</strong> softens visual harshness for brightness sensitivity. <strong>High contrast</strong> maximises separation and sharpens focus indicators.</>
              }
            />
          </div>
        </div>

        <div>
           <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static · section header variant · label only</p>
          <div className="max-w-md space-y-3">
            <SettingsSectionHeader label="Desktop wallpaper" />
            <SettingsSectionHeader label="Animation speed" />
            <SettingsSectionHeader label="Icon size" />
          </div>
        </div>

        <div>
           <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static · section header variant · above control</p>
          <div className="max-w-md space-y-3 rounded-md border border-border bg-card/40 p-4">
            <SettingsSectionHeader
              label="Animation speed"
              description={
                <><strong>Less</strong> slows animations for reduced sensitivity. <strong>Default</strong> uses standard timing. <strong>More</strong> makes motion snappier.</>
              }
            />
            <div className="flex gap-1.5">
              {['Less', 'Default', 'More'].map((opt) => (
                <span
                  key={opt}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${opt === 'Default' ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 bg-card/60 text-muted-foreground'}`}
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsSectionHeader} title="SettingsSectionHeader reference" />
    </div>
  );
}
