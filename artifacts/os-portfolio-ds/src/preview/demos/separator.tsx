import { Separator } from '../../components/ui/separator';
import { CanonicalSpec } from '../md-renderer';
import { mdSeparator } from '../docs-map';
import { Stack } from '../parts';

export function SeparatorDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md rounded-xl border bg-card p-6">
        <Stack label="Horizontal · Static">
        <div>
          <p className="font-medium">Design system</p>
          <p className="text-sm text-muted-foreground">Reusable interface foundations.</p>
        </div>
        <Separator className="my-4" />
        </Stack>
        <Stack label="Vertical · Static">
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Components</span>
          <Separator orientation="vertical" />
          <span>Patterns</span>
        </div>
        </Stack>
      </div>
      <CanonicalSpec md={mdSeparator} />
    </div>
  );
}
