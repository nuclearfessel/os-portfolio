import tokensJson from '../../tokens.json';
import { motionTokens, radiusTokens, spacingTokens } from '../generated/tokens';
import { SectionLabel } from '../components/ui/os-portfolio';
import { CanonicalSpec, extractSection } from './md-renderer';
import {
  mdFoundationIconographyMotion,
  mdFoundationSpacingRadius,
} from './docs-map';

type Leaf = { $value: string; $description?: string };
type ComponentSource = Record<string, Record<string, Leaf>>;
type ComponentResolved = Record<string, Record<string, string>>;
type Family = 'spacing' | 'radius' | 'motion';

const SOURCE = {
  spacing: tokensJson.spacing.component as unknown as ComponentSource,
  radius: tokensJson.radius.component as unknown as ComponentSource,
  motion: tokensJson.motion.component as unknown as ComponentSource,
};

const RESOLVED = {
  spacing: spacingTokens.component as unknown as ComponentResolved,
  radius: radiusTokens.component as unknown as ComponentResolved,
  motion: motionTokens.component as unknown as ComponentResolved,
};

function kebab(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function aliasName(family: Family, component: string, property: string) {
  return `osp.${kebab(component)}.container.${family}.${kebab(property)}`;
}

function sourceAlias(value: string) {
  return value.replace(/^\{/, 'osp.').replace(/\}$/, '');
}

function ValuePreview({
  family,
  property,
  value,
  easing,
}: {
  family: Family;
  property: string;
  value: string;
  easing?: string;
}) {
  if (family === 'spacing') {
    const width = Math.min(Math.max(Number.parseFloat(value), 2), 96);
    return <div className="h-3 rounded-full bg-primary" style={{ width }} />;
  }
  if (family === 'radius') {
    return <div className="size-12 border border-primary bg-primary/10" style={{ borderRadius: value }} />;
  }
  if (property.toLowerCase().includes('duration')) {
    return (
      <div className="relative h-5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute top-1 size-3 rounded-full bg-primary"
          style={{
            animation: `osp-token-motion-preview ${value} ${easing ?? 'ease'} infinite alternate`,
          }}
        />
      </div>
    );
  }
  return <span className="font-mono text-xs text-primary">{value}</span>;
}

function ComponentTokenFamily({ family, title, description }: { family: Family; title: string; description: string }) {
  const components = Object.entries(SOURCE[family]).filter(([key]) => !key.startsWith('$'));
  return (
    <section className="space-y-5">
      <header>
        <SectionLabel>component tokens / {family}</SectionLabel>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {components.map(([component, properties]) => (
          <article key={component} className="rounded-xl border border-border bg-card p-5 text-card-foreground">
            <h3 className="font-mono text-sm font-medium">{kebab(component)}</h3>
            <div className="mt-4 divide-y divide-border/60">
              {Object.entries(properties).filter(([key]) => !key.startsWith('$')).map(([property, leaf]) => {
                const resolved = RESOLVED[family][component]?.[property] ?? leaf.$value;
                const resolvedEasing = family === 'motion'
                  ? RESOLVED.motion[component]?.easing
                  : undefined;
                return (
                  <div key={property} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="break-all font-mono text-[11px] text-foreground">
                        {aliasName(family, component, property)}
                      </p>
                      <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                        {sourceAlias(leaf.$value)} → {resolved}
                      </p>
                    </div>
                    <ValuePreview
                      family={family}
                      property={property}
                      value={resolved}
                      easing={resolvedEasing}
                    />
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SpacingRadiusTokensPage() {
  return (
    <div className="space-y-12">
      <CanonicalSpec md={mdFoundationSpacingRadius} title="Spacing & radius guidance" />
      <ComponentTokenFamily
        family="spacing"
        title="Spacing contracts"
        description="Padding and gap values consumed by shared components and the OS Portfolio."
      />
      <ComponentTokenFamily
        family="radius"
        title="Radius contracts"
        description="Corner treatments assigned to controls, surfaces, overlays, and desktop primitives."
      />
    </div>
  );
}

export function MotionTokensPage() {
  return (
    <div className="space-y-12">
      <style>{`
        @keyframes osp-token-motion-preview {
          from { transform: translateX(0); }
          to { transform: translateX(76px); }
        }
      `}</style>
      <CanonicalSpec
        md={extractSection(mdFoundationIconographyMotion, 'Motion')}
        title="Motion guidance"
      />
      <ComponentTokenFamily
        family="motion"
        title="Motion contracts"
        description="Durations and easing curves for feedback, entry, overlays, launchers, settings controls, and the functional Terminal caret."
      />
    </div>
  );
}