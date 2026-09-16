import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../components/ui/hover-card';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdOverlaysFamily } from '../docs-map';

const specMd = extractSection(mdOverlaysFamily, 'HoverCard');

export function HoverCardDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-sm rounded-xl border bg-card p-6">
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href="#page=hover-card"
              className="font-medium underline underline-offset-4"
            >
              @design-team
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="flex gap-3">
            <Avatar>
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">Design team</p>
              <p className="text-sm text-muted-foreground">
                Building clear, consistent product experiences.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
