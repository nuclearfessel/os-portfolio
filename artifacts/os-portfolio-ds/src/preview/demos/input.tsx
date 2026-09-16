import { Input } from '../../components/ui/input';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdInput } from '../docs-map';

export function InputDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-sm space-y-6 rounded-xl border bg-card p-6">
        <Stack label="Text · Idle">
          <Input placeholder="Name" />
        </Stack>
        <Stack label="Email · Idle">
          <Input type="email" placeholder="name@example.com" />
        </Stack>
        <Stack label="File · Idle">
          <Input type="file" />
        </Stack>
        <Stack label="Text · Read-only">
          <Input defaultValue="Read only" readOnly />
        </Stack>
        <Stack label="Text · Disabled">
          <Input placeholder="Disabled" disabled />
        </Stack>
        <Stack label="Text · Invalid">
          <Input placeholder="Invalid" aria-invalid="true" />
        </Stack>
      </div>
      <CanonicalSpec md={mdInput} />
    </div>
  );
}
