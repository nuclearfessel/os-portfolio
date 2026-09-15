import { AspectRatio } from '../../components/ui/aspect-ratio';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'AspectRatio');

export function AspectRatioDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-lg overflow-hidden rounded-xl border bg-card">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full items-end bg-gradient-to-br from-primary/80 via-primary/40 to-muted p-6 text-primary-foreground">
            <div>
              <p className="text-lg font-semibold">16:9 media</p>
              <p className="text-sm opacity-80">Responsive, proportional content.</p>
            </div>
          </div>
        </AspectRatio>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
