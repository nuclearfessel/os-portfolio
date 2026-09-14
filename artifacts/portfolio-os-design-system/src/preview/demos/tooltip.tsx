import { Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdOverlaysFamily } from '../docs-map';

const specMd = extractSection(mdOverlaysFamily, 'Tooltip');

export function TooltipDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <TooltipProvider delayDuration={200}>
          <div className="flex flex-wrap items-center gap-4">
            {['Folder', 'Window control', 'Dock item'].map((label) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label={label}>
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
