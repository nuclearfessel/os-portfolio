import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { CanonicalSpec } from '../md-renderer';
import { mdCard } from '../docs-map';

export function CardDemo() {
  return (
    <div className="space-y-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription>Activity across your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-2xl font-semibold">24</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-2xl font-semibold">89%</p>
              <p className="text-sm text-muted-foreground">On track</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View report</Button>
        </CardFooter>
      </Card>
      <CanonicalSpec md={mdCard} />
    </div>
  );
}
