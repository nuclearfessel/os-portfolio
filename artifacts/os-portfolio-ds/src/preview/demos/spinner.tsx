import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { Row } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFeedbackFamily } from '../docs-map';

const specMd = extractSection(mdFeedbackFamily, 'Spinner');

export function SpinnerDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Row label="Sizes and context">
          <Spinner className="size-4" />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
          <Button disabled>
            <Spinner /> Saving
          </Button>
        </Row>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
