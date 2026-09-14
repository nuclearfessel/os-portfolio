import { SettingsDivider, SettingsSectionHeader, SettingsToggleRow } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsDivider } from '../docs-map';

export function SettingsDividerDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">In context — separating settings sections</p>

        <div className="max-w-md space-y-3">
          <SettingsSectionHeader
            label="Display"
            description="Adjust how elements appear on screen."
          />
          <SettingsToggleRow
            id="ref-scrollbars"
            label="Always show scrollbars"
            checked={false}
            onChange={() => {}}
          />

          <SettingsDivider />

          <SettingsSectionHeader
            label="Motion"
            description="Control animations and transitions."
          />
          <SettingsToggleRow
            id="ref-animations"
            label="UI animations"
            checked={true}
            onChange={() => {}}
          />

          <SettingsDivider />

          <SettingsSectionHeader
            label="Contrast"
            description="Adjust visual contrast levels."
          />
        </div>

        <div>
          <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Standalone divider</p>
          <div className="max-w-md rounded-md border border-border bg-card/40 px-4 py-3">
            <p className="text-sm text-muted-foreground">Section above</p>
            <SettingsDivider />
            <p className="text-sm text-muted-foreground">Section below</p>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsDivider} title="SettingsDivider reference" />
    </div>
  );
}
