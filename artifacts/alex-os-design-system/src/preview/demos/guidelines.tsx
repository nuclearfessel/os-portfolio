import { ActionButton, SectionLabel, StatusIndicator, Surface } from '../../components/ui/alex-os';

const motion = [
  ['Hover and focus', '100ms', 'Color, border, and small positional feedback'],
  ['Theme morphs', '240–340ms', 'Crossfade, rotate, and scale within a fixed footprint'],
  ['Window entry', '160ms', 'Short ease-out; never delay interaction'],
  ['Drag and resize', 'Direct', 'No easing while the pointer is controlling geometry'],
] as const;

export function GuidelinesDemo() {
  return (
    <div className="space-y-6">
      <Surface className="space-y-4 p-6">
        <SectionLabel>foundation / iconography</SectionLabel>
        <h2 className="text-2xl font-semibold">Keyline, not decoration.</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Use Keyline Icons with a consistent 1.7–1.8 stroke. Icons clarify actions and status; they do not replace visible labels in mobile navigation or unfamiliar controls.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton variant="primary">Icon + label</ActionButton>
          <StatusIndicator />
        </div>
      </Surface>

      <Surface className="space-y-4 p-6">
        <SectionLabel>foundation / motion</SectionLabel>
        <h2 className="text-2xl font-semibold">Fast, spatial, interruptible.</h2>
        <div className="divide-y divide-border">
          {motion.map(([name, duration, use]) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[10rem_6rem_1fr]">
              <strong className="text-sm">{name}</strong>
              <span className="font-mono text-xs text-primary">{duration}</span>
              <span className="text-sm text-muted-foreground">{use}</span>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="space-y-4 p-6">
        <SectionLabel>pattern / responsive workspace</SectionLabel>
        <h2 className="text-2xl font-semibold">Freeform desktop, managed mobile.</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Desktop preserves user-arranged window, launcher, sticky, and Dock geometry.</li>
          <li>Tablet and mobile use temporary managed geometry without overwriting desktop state.</li>
          <li>Mobile navigation stays fixed, labeled, and reachable at the bottom edge.</li>
          <li>Every surface and interaction must remain legible in both light and dark themes.</li>
        </ul>
      </Surface>
    </div>
  );
}