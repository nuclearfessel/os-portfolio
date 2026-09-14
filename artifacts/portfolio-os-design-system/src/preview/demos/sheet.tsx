import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdOverlaysFamily } from '../docs-map';

const specMd = extractSection(mdOverlaysFamily, 'Sheet');

export function SheetDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open settings</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Workspace settings</SheetTitle>
              <SheetDescription>
                Configure members, access, and notifications.
              </SheetDescription>
            </SheetHeader>
            <div className="my-6 rounded-md border p-4 text-sm text-muted-foreground">
              Settings content
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Save</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
