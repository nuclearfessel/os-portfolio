import { Skeleton } from '../../components/ui/skeleton';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFeedbackFamily } from '../docs-map';

const specMd = extractSection(mdFeedbackFamily, 'Skeleton');

export function SkeletonDemo() {
  return (
    <div className="space-y-8">
      <div className="flex max-w-md items-center gap-4 rounded-xl border bg-card p-6">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
