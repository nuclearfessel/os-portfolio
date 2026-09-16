import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { CanonicalSpec } from '../md-renderer';
import { mdAlertDialog } from '../docs-map';
import { Stack } from '../parts';

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Stack label={`Destructive trigger · ${open ? 'Open' : 'Closed'}`}>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and removes all project data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete project</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Stack>
      </div>
      <CanonicalSpec md={mdAlertDialog} />
    </div>
  );
}
