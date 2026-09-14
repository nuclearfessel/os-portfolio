import { Progress } from '../../components/ui/progress';
import { Stack } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFeedbackFamily } from '../docs-map';

const specMd = extractSection(mdFeedbackFamily, 'Progress');

export function ProgressDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md space-y-6 rounded-xl border bg-card p-6">
        <Stack label="Upload 64%">
          <Progress value={64} />
        </Stack>
        <Stack label="Complete">
          <Progress value={100} />
        </Stack>
        <Stack label="Waiting">
          <Progress value={0} />
        </Stack>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
