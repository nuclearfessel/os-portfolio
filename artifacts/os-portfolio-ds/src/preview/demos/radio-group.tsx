import { Label } from '../../components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../components/ui/radio-group';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdRadioGroup } from '../docs-map';

export function RadioGroupDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-sm rounded-xl border bg-card p-6">
        <Stack label="Plan">
          <RadioGroup defaultValue="pro">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="free" id="radio-free" />
              <Label htmlFor="radio-free">Free</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pro" id="radio-pro" />
              <Label htmlFor="radio-pro">Pro</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="enterprise" id="radio-enterprise" disabled />
              <Label htmlFor="radio-enterprise">Enterprise</Label>
            </div>
          </RadioGroup>
        </Stack>
      </div>
      <CanonicalSpec md={mdRadioGroup} />
    </div>
  );
}
