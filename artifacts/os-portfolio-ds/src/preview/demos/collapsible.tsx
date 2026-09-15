import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'Collapsible');

export function CollapsibleDemo() {
  return (
    <div className="space-y-8">
      <Collapsible className="max-w-md space-y-2 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">3 linked repositories</p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle repositories">
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">web-app</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">api</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">docs</div>
        </CollapsibleContent>
      </Collapsible>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
