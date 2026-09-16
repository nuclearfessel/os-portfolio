import { useState } from 'react';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdSwitch } from '../docs-map';

export function SwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [sync, setSync] = useState(false);

  return (
    <div className="space-y-8">
      <div className="max-w-sm space-y-6 rounded-xl border bg-card p-6">
        <Stack label={`Notifications · ${notifications ? 'Checked' : 'Unchecked'}`}>
          <div className="flex items-center justify-between gap-6">
            <Label htmlFor="switch-notifications">Notifications</Label>
            <Switch
              id="switch-notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </Stack>
        <Stack label={`Background sync · ${sync ? 'Checked' : 'Unchecked'}`}>
          <div className="flex items-center justify-between gap-6">
            <Label htmlFor="switch-sync">Background sync</Label>
            <Switch id="switch-sync" checked={sync} onCheckedChange={setSync} />
          </div>
        </Stack>
        <Stack label="Unavailable · Disabled">
          <div className="flex items-center justify-between gap-6">
            <Label htmlFor="switch-disabled">Unavailable</Label>
            <Switch id="switch-disabled" disabled />
          </div>
        </Stack>
      </div>
      <CanonicalSpec md={mdSwitch} />
    </div>
  );
}
