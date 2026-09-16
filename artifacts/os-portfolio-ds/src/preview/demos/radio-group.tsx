import { useState } from 'react';
import { Label } from '../../components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../components/ui/radio-group';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdRadioGroup } from '../docs-map';

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('pro');

  return (
    <div className="space-y-8">
      <div className="max-w-sm rounded-xl border bg-card p-6">
        <Stack label="Plan">
          <RadioGroup value={plan} onValueChange={setPlan} className="gap-4">
            <Stack label={`Free · ${plan === 'free' ? 'Selected' : 'Unselected'}`}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="radio-free" />
                <Label htmlFor="radio-free">Free</Label>
              </div>
            </Stack>
            <Stack label={`Pro · ${plan === 'pro' ? 'Selected' : 'Unselected'}`}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pro" id="radio-pro" />
                <Label htmlFor="radio-pro">Pro</Label>
              </div>
            </Stack>
            <Stack label="Enterprise · Disabled">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="enterprise" id="radio-enterprise" disabled />
                <Label htmlFor="radio-enterprise">Enterprise</Label>
              </div>
            </Stack>
          </RadioGroup>
        </Stack>
      </div>
      <CanonicalSpec md={mdRadioGroup} />
    </div>
  );
}
