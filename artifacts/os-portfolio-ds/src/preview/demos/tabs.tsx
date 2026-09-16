import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { CanonicalSpec } from '../md-renderer';
import { mdTabs } from '../docs-map';
import { Stack } from '../parts';

export function TabsDemo() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-8">
      <div className="max-w-sm rounded-xl border bg-card p-6">
        <Stack label={`Underline tabs · ${tab === 'overview' ? 'Overview selected' : 'Activity selected'}`}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="rounded-md border p-4 text-sm">
            Project summary and recent milestones.
          </TabsContent>
          <TabsContent value="activity" className="rounded-md border p-4 text-sm">
            Latest changes from your team.
          </TabsContent>
        </Tabs>
        </Stack>
      </div>
      <CanonicalSpec md={mdTabs} />
    </div>
  );
}
