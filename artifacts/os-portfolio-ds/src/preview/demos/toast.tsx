import { Button } from '../../components/ui/button';
import { ToastAction } from '../../components/ui/toast';
import { Toaster } from '../../components/ui/toaster';
import { toast } from '../../hooks/use-toast';
import { Row } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdToast } from '../docs-map';

export function ToastDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Row label="Default · Success toast trigger">
          <Button
            onClick={() =>
              toast({
                title: 'Changes saved',
                description: 'Your project settings are up to date.',
              })
            }
          >
            Show toast
          </Button>
        </Row>
        <Row label="Destructive · Error toast with action">
          <Button
            variant="destructive"
            onClick={() =>
              toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: 'The file could not be uploaded.',
                action: <ToastAction altText="Retry upload">Retry</ToastAction>,
              })
            }
          >
            Show error
          </Button>
        </Row>
        <Toaster />
      </div>
      <CanonicalSpec md={mdToast} />
    </div>
  );
}
