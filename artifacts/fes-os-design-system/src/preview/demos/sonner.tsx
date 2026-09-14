import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Toaster } from '../../components/ui/sonner';
import { Row } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFeedbackFamily } from '../docs-map';

const specMd = extractSection(mdFeedbackFamily, 'Sonner');

export function SonnerDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Row label="Notifications">
          <Button onClick={() => toast.success('Project published')}>Success</Button>
          <Button
            variant="outline"
            onClick={() =>
              toast('Invitation sent', {
                description: 'fes@example.com can now join the workspace.',
                action: { label: 'Undo', onClick: () => undefined },
              })
            }
          >
            With action
          </Button>
        </Row>
        <Toaster />
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
