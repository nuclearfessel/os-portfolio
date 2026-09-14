import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { CanonicalSpec } from './md-renderer';
import {
  mdFoundationColor,
  mdFoundationTypography,
  mdFoundationSpacingRadius,
} from './docs-map';

const CORE_SWATCHES = [
  { name: 'Primary', className: 'bg-primary' },
  { name: 'Secondary', className: 'bg-secondary' },
  { name: 'Accent', className: 'bg-accent' },
] as const;

const SUPPORTING_SWATCHES = [
  { name: 'Background', className: 'border bg-background' },
  { name: 'Foreground', className: 'bg-foreground' },
  { name: 'Muted', className: 'bg-muted' },
  { name: 'Destructive', className: 'bg-destructive' },
  { name: 'Border', className: 'bg-border' },
] as const;

const TYPE_SCALE = [
  { label: 'Display', token: 'display', size: '56px', mobileSize: '44px', weight: '500', lineHeight: '1.00 / 56px', tracking: '−0.040em', use: 'Portfolio statements and major editorial moments', className: 'text-[clamp(2.75rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em]' },
  { label: 'Title 1', token: 'title-1', size: '40px', mobileSize: '34px', weight: '500', lineHeight: '1.05 / 42px', tracking: '−0.035em', use: 'Primary page and window headings', className: 'text-[clamp(2.125rem,4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.035em]' },
  { label: 'Title 2', token: 'title-2', size: '30px', mobileSize: '28px', weight: '500', lineHeight: '1.13 / 34px', tracking: '−0.025em', use: 'Major section and case-study headings', className: 'text-[clamp(1.75rem,3vw,1.875rem)] font-medium leading-[1.13] tracking-[-0.025em]' },
  { label: 'Heading', token: 'heading', size: '20px', mobileSize: '20px', weight: '500', lineHeight: '1.30 / 26px', tracking: '−0.015em', use: 'Cards, dialogs, and grouped content', className: 'text-xl font-medium leading-[1.3] tracking-[-0.015em]' },
  { label: 'Body large', token: 'body-lg', size: '17px', mobileSize: '17px', weight: '400', lineHeight: '1.53 / 26px', tracking: '−0.005em', use: 'Introductions and high-emphasis prose', className: 'text-[1.0625rem] leading-[1.53] tracking-[-0.005em]' },
  { label: 'Body', token: 'body', size: '15px', mobileSize: '15px', weight: '400', lineHeight: '1.60 / 24px', tracking: '0', use: 'Default interface copy and paragraphs', className: 'text-[0.9375rem] leading-6' },
  { label: 'Body small', token: 'body-sm', size: '13px', mobileSize: '13px', weight: '400', lineHeight: '1.54 / 20px', tracking: '0', use: 'Supporting copy and compact controls', className: 'text-[0.8125rem] leading-5' },
  { label: 'Label', token: 'label', size: '12px', mobileSize: '12px', weight: '500', lineHeight: '1.33 / 16px', tracking: '0.010em', use: 'Buttons, tabs, and navigation labels', className: 'text-xs font-medium leading-4 tracking-[0.01em]' },
  { label: 'System label', token: 'system', size: '10px', mobileSize: '10px', weight: '500', lineHeight: '1.40 / 14px', tracking: '0.140em', use: 'Kickers, status, metadata, and file paths', className: 'font-mono text-[0.625rem] font-medium uppercase leading-[1.4] tracking-[0.14em]' },
  { label: 'Caption', token: 'caption', size: '11px', mobileSize: '11px', weight: '400', lineHeight: '1.45 / 16px', tracking: '0.015em', use: 'Timestamps, annotations, and secondary metadata', className: 'font-mono text-[0.6875rem] leading-4 tracking-[0.015em] text-muted-foreground' },
] as const;

const SPACING_SCALE = [
  { label: '4', className: 'w-4' },
  { label: '8', className: 'w-8' },
  { label: '12', className: 'w-12' },
  { label: '16', className: 'w-16' },
  { label: '24', className: 'w-24' },
] as const;

function Swatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <div className={`h-16 rounded-lg ${className}`} />
      <p className="text-sm font-medium">{name}</p>
    </div>
  );
}

export function OverviewPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-card p-5 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Core palette
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {CORE_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Typography
          </h2>
          <div className="mt-4 space-y-3">
            {TYPE_SCALE.map((entry) => (
              <p key={entry.label} className={entry.className}>
                {entry.label}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            In use
          </h2>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Create workspace</CardTitle>
              <CardDescription>
                Components composed from the tokens above.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="overview-name">Workspace name</Label>
                <Input id="overview-name" placeholder="Enter a name" />
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked id="overview-notify" />
                <Label htmlFor="overview-notify">Email notifications</Label>
                <Badge className="ml-auto">New</Badge>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Save</Button>
              <Button variant="outline">Cancel</Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      <section className="space-y-4 rounded-xl border bg-card p-5 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Components
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Brand colors</h2>
            <p className="text-sm text-muted-foreground">
              The core roles used for emphasis, supporting actions, and accents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {CORE_SWATCHES.map((swatch) => (
              <Swatch key={swatch.name} {...swatch} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Semantic and surface colors</h2>
            <p className="text-sm text-muted-foreground">
              Roles for text, backgrounds, borders, muted content, and danger.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SUPPORTING_SWATCHES.map((swatch) => (
              <Swatch key={swatch.name} {...swatch} />
            ))}
          </div>
        </section>
      </div>
      <CanonicalSpec md={mdFoundationColor} />
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 text-card-foreground">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Primary / sans</p>
          <p className="mt-4 text-4xl font-medium leading-tight tracking-[-0.035em]">Space Grotesk</p>
          <p className="mt-3 text-base leading-6">Thoughtful interfaces. Fast systems.</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
            <div><dt className="text-muted-foreground">Token</dt><dd className="mt-1 font-mono">font-sans</dd></div>
            <div><dt className="text-muted-foreground">Weights used</dt><dd className="mt-1 font-mono">400 · 500 · 600</dd></div>
            <div><dt className="text-muted-foreground">Role</dt><dd className="mt-1">Display, body, UI</dd></div>
            <div><dt className="text-muted-foreground">Fallback</dt><dd className="mt-1 font-mono">sans-serif</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-6 font-mono text-card-foreground">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Secondary / mono</p>
          <p className="mt-4 text-3xl font-medium leading-tight">DM Mono</p>
          <p className="mt-3 text-sm leading-6">fes@studio:~/selected-work$</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
            <div><dt className="text-muted-foreground">Token</dt><dd className="mt-1">font-mono</dd></div>
            <div><dt className="text-muted-foreground">Weights used</dt><dd className="mt-1">400 · 500</dd></div>
            <div><dt className="text-muted-foreground">Role</dt><dd className="mt-1">System, code, metadata</dd></div>
            <div><dt className="text-muted-foreground">Fallback</dt><dd className="mt-1">monospace</dd></div>
          </dl>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <h2 className="font-semibold">Type ramp</h2>
          <p className="mt-1 text-sm text-muted-foreground">Desktop values are the default. Only display and title roles scale down on mobile.</p>
        </div>
        <div className="divide-y">
          {TYPE_SCALE.map((entry) => (
            <article key={entry.token} className="grid gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_29rem]">
              <div className="min-w-0">
                <p className={entry.className}>Build products people understand.</p>
              </div>
              <div>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <strong className="text-sm">{entry.label}</strong>
                  <code className="font-mono text-xs text-primary">{entry.token}</code>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
                  <div><dt className="text-muted-foreground">Size</dt><dd className="mt-1 font-mono">{entry.size}</dd></div>
                  <div><dt className="text-muted-foreground">Mobile</dt><dd className="mt-1 font-mono">{entry.mobileSize}</dd></div>
                  <div><dt className="text-muted-foreground">Weight</dt><dd className="mt-1 font-mono">{entry.weight}</dd></div>
                  <div><dt className="text-muted-foreground">Line height</dt><dd className="mt-1 font-mono">{entry.lineHeight}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Letter spacing</dt><dd className="mt-1 font-mono">{entry.tracking}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Use</dt><dd className="mt-1">{entry.use}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-sm font-semibold">Weight discipline</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use 400 for reading, 500 for hierarchy and controls, and 600 only for compact emphasis. Avoid 700 in product UI.</p>
        </div>
        <div className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-sm font-semibold">Measure</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Keep body copy between 45–72 characters per line. Introductory text can be shorter; system labels stay on one line.</p>
        </div>
        <div className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-sm font-semibold">Accessibility</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Body text never drops below 13px. Do not use tracking below −0.04em, and avoid uppercase for sentences.</p>
        </div>
      </section>
      <CanonicalSpec md={mdFoundationTypography} />
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Spacing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The spacing scale, derived from the base spacing token.
          </p>
          <div className="mt-6 space-y-4">
            {SPACING_SCALE.map((space) => (
              <div key={space.label} className="flex items-center gap-4">
                <span className="w-8 text-xs text-muted-foreground">
                  {space.label}
                </span>
                <div className={`h-3 rounded-full bg-primary ${space.className}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Radius</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Corner treatments derive from the base radius token.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: 'Small', className: 'rounded-sm' },
              { label: 'Medium', className: 'rounded-md' },
              { label: 'Large', className: 'rounded-lg' },
              { label: 'Extra large', className: 'rounded-xl' },
            ].map((radius) => (
              <div
                key={radius.label}
                className={`flex h-24 items-end border bg-muted p-3 ${radius.className}`}
              >
                <span className="text-xs font-medium">{radius.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CanonicalSpec md={mdFoundationSpacingRadius} />
    </div>
  );
}
