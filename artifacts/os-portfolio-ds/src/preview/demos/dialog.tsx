import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { CanonicalSpec } from '../md-renderer';
import { mdDialog } from '../docs-map';
import { Stack } from '../parts';

export function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Stack label={`Default trigger · ${open ? 'Open' : 'Closed'}`}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Update the details shown to your teammates.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-md border bg-muted/40 p-4 text-sm">
                Profile settings appear here.
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Stack>
      </div>
      <CanonicalSpec md={mdDialog} />
    </div>
  );
}
