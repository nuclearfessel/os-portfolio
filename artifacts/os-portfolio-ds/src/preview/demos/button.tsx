import { ArrowRight, Loader2, Mail, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Row } from '../parts';
import {
  DocAnatomy,
  DocCodeBlock,
  DocDoGrid,
  DocList,
  DocP,
  DocSection,
  DocSpec,
  DocTable,
} from '../doc-renderer';

export function ButtonDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-xl border bg-card p-6 text-card-foreground">
        <Row label="Variants">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Mail">
            <Mail />
          </Button>
        </Row>
        <Row label="With icon">
          <Button>
            <Mail /> Email
          </Button>
          <Button variant="secondary">
            Continue <ArrowRight />
          </Button>
          <Button variant="outline">
            <Settings /> Settings
          </Button>
        </Row>
        <Row label="States">
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2 className="animate-spin" /> Loading
          </Button>
        </Row>
      </div>

      <DocSpec>
        <DocSection title="Purpose">
          <DocP>
            The general-purpose interactive trigger. Use{' '}
            <code className="font-mono text-xs">Button</code> for standard UI
            patterns — forms, dialogs, toolbars. For OS Portfolio portfolio-specific
            window controls and project links prefer{' '}
            <code className="font-mono text-xs">ActionButton</code> from{' '}
            <code className="font-mono text-xs">os-portfolio.tsx</code>.
          </DocP>
        </DocSection>

        <DocSection title="Anatomy">
          <DocAnatomy>{`
<button | Comp (asChild)>
  [leading icon?]  Label text  [trailing icon?]
</button>

SVG children: automatically size-4, pointer-events-none.
asChild: renders the consumer's child element via Radix Slot.`}</DocAnatomy>
        </DocSection>

        <DocSection title="Variants">
          <DocTable
            headers={['Variant', 'Appearance', 'Use']}
            rows={[
              ['default', 'bg-primary text-primary-foreground', 'Primary action'],
              ['destructive', 'bg-destructive text-destructive-foreground', 'Irreversible / destructive'],
              ['outline', 'border bg-transparent shadow-xs', 'Secondary/neutral action'],
              ['secondary', 'bg-secondary text-secondary-foreground', 'Supporting action'],
              ['ghost', 'border-transparent', 'Minimal UI, icon buttons, table actions'],
              ['link', 'text-primary underline-offset-4', 'In-context text links'],
            ]}
          />
        </DocSection>

        <DocSection title="Sizes">
          <DocTable
            headers={['Size', 'Height', 'Padding', 'Notes']}
            rows={[
              ['default', 'min-h-9', 'px-4 py-2', 'Standard'],
              ['sm', 'min-h-8', 'px-3 text-xs', 'Compact controls'],
              ['lg', 'min-h-10', 'px-8', 'Prominent CTA'],
              ['icon', 'h-9 w-9', '—', 'Square icon-only button'],
            ]}
          />
        </DocSection>

        <DocSection title="Interactive states">
          <DocTable
            headers={['State', 'Visual']}
            rows={[
              ['Default', 'Variant base styles'],
              ['Hover', 'hover-elevate — subtle overlay lift via CSS variable'],
              ['Active', 'active-elevate-2 — slightly stronger overlay'],
              ['Focus-visible', 'ring-1 ring-ring around the button'],
              ['Disabled', 'opacity-50, pointer-events-none'],
            ]}
          />
        </DocSection>

        <DocSection title="Accessibility">
          <DocList
            items={[
              'Native <button> — keyboard focus and Enter/Space activation built in.',
              'asChild with <a> produces a styled link — add aria-label if text is icon-only.',
              'Disabled state: use disabled prop (not aria-disabled) for form buttons.',
              'Icon-only buttons must have aria-label set on the <Button>.',
              'Destructive variant does not suppress confirmation — pair with AlertDialog.',
            ]}
          />
        </DocSection>

        <DocSection title="Do / Don't">
          <DocDoGrid
            items={[
              { kind: 'do', text: 'Use the default variant for the single primary action in a form or dialog.' },
              { kind: 'do', text: 'Use ghost + icon for toolbar controls — it keeps chrome minimal.' },
              { kind: 'do', text: 'Add aria-label on icon-only buttons.' },
              { kind: 'do', text: 'Use asChild to render links that look like buttons without nesting <a> inside <button>.' },
              { kind: 'dont', text: 'Use multiple default-variant buttons in the same view — it dilutes emphasis.' },
              { kind: 'dont', text: 'Omit aria-label on icon-only buttons.' },
              { kind: 'dont', text: 'Use link variant for navigation inside the same app — use Button + router Link instead.' },
              { kind: 'dont', text: 'Skip the AlertDialog confirmation step before a destructive action.' },
            ]}
          />
        </DocSection>

        <DocSection title="Code example">
          <DocCodeBlock language="tsx">{`
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';
import { Mail, Trash2 } from 'lucide-react';

// Standard variants
<Button>Save changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete account</Button>

// With icon
<Button>
  <Mail /> Send email
</Button>

// Icon-only
<Button variant="ghost" size="icon" aria-label="Settings">
  <Settings />
</Button>

// As router link (wouter example)
<Button variant="link" asChild>
  <Link href="/about">Learn more</Link>
</Button>
`}</DocCodeBlock>
        </DocSection>
      </DocSpec>
    </div>
  );
}
