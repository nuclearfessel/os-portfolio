import { Input } from '../../components/ui/input';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdInput } from '../docs-map';

export function InputDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md space-y-6 rounded-xl border bg-card p-6">
        <Stack label="Types">
          <Input placeholder="Name" />
          <Input type="email" placeholder="name@example.com" />
          <Input type="file" />
        </Stack>
        <Stack label="States">
          <Input defaultValue="Read only" readOnly />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Invalid" aria-invalid="true" />
        </Stack>
      </div>
      <CanonicalSpec md={mdInput} />
    </div>
  );
}
