import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../components/ui/alert';
import { Stack } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFeedbackFamily } from '../docs-map';

const specMd = extractSection(mdFeedbackFamily, 'Alert');

export function AlertDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-sm rounded-xl border bg-card p-6">
        <Stack label="Variants">
          <Alert>
            <CheckCircle2 />
            <AlertTitle>Deployment complete</AlertTitle>
            <AlertDescription>Your latest changes are now live.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Connection failed</AlertTitle>
            <AlertDescription>Check your credentials and try again.</AlertDescription>
          </Alert>
        </Stack>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
