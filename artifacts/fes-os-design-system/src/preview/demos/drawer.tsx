import { Button } from '../../components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdOverlaysFamily } from '../docs-map';

const specMd = extractSection(mdOverlaysFamily, 'Drawer');

export function DrawerDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open activity</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle>Recent activity</DrawerTitle>
                <DrawerDescription>
                  Review changes made to this project.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
