import { SectionLabel, Surface, StatusIndicator } from '../components/ui/fes-os';

const RULES = [
  {
    area: 'Contrast and color',
    target: 'WCAG AA',
    rules: [
      'Normal text targets at least 4.5:1 contrast in both themes.',
      'Large text targets at least 3:1 contrast.',
      'Hover and keyboard-focus states must preserve readable contrast.',
      'Color never carries selection, status, or destructive meaning by itself.',
    ],
    evidence: 'Representative light-theme surfaces and interactive states have automated contrast coverage.',
  },
  {
    area: 'Keyboard and focus',
    target: 'Operable',
    rules: [
      'Every action uses a native button, input, textarea, or link.',
      'Visible focus treatment is required for all keyboard-operable controls.',
      'Escape closes open menus and transient interface layers.',
      'Window shortcuts, Terminal history, and sticky rotation include keyboard paths.',
    ],
    evidence: 'Keyboard interaction and focus-visible states are covered by the portfolio interaction tests.',
  },
  {
    area: 'Names and semantics',
    target: 'Understandable',
    rules: [
      'Icon-only actions require accessible names and visible hover/focus explanations.',
      'Windows, menus, dialogs, navigation regions, resize handles, and controls expose semantic roles.',
      'Toggle and selection state use aria-pressed, aria-checked, or aria-expanded.',
      'Decorative icons are hidden from assistive technology.',
    ],
    evidence: 'The interface uses labeled landmarks, controls, menus, dialogs, separators, and state attributes.',
  },
  {
    area: 'Status and errors',
    target: 'Announced',
    rules: [
      'Storage availability and recovery messages use polite live status regions.',
      'Destructive actions require confirmation before data is removed.',
      'Failure states explain what happened and offer a recovery path.',
      'Status indicators pair visual treatment with readable text.',
    ],
    evidence: 'Blocked-storage recovery and sticky deletion behavior are exercised in persistence tests.',
  },
  {
    area: 'Motion and manipulation',
    target: 'Adaptable',
    rules: [
      'Nonessential transitions are removed when reduced motion is requested.',
      'Pointer-controlled dragging, resizing, and rotation remain direct and interruptible.',
      'Drag-only desktop interactions receive button, keyboard, or managed-layout alternatives.',
      'Responsive reflow never destroys the user’s saved desktop arrangement.',
    ],
    evidence: 'Reduced-motion CSS, managed tablet/mobile layouts, and preserved desktop geometry are implemented.',
  },
  {
    area: 'Responsive access',
    target: 'Reachable',
    rules: [
      'Mobile navigation remains fixed at the bottom with visible text labels.',
      'Desktop-only tools are removed—not left unreachable—on touch-oriented layouts.',
      'Content reflows without requiring horizontal page scrolling.',
      'Body copy stays at 13px or larger and major controls use practical touch targets.',
    ],
    evidence: 'Responsive tests cover desktop, tablet, mobile, and wide-phone portrait behavior.',
  },
] as const;

export function AccessibilityPage() {
  return (
    <div className="space-y-6">
      <Surface elevation="floating" className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <SectionLabel>foundation / accessibility</SectionLabel>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.025em]">Accessible by structure, not decoration.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Fes OS targets WCAG 2.2 Level AA. These rules describe the current portfolio implementation and the requirements every shared component must preserve.
          </p>
        </div>
        <StatusIndicator label="AA target" />
      </Surface>

      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <h2 className="font-semibold">Rules the site follows</h2>
          <p className="mt-1 text-sm text-muted-foreground">Implementation rules and the evidence used to keep them enforceable.</p>
        </div>
        <div className="divide-y">
          {RULES.map((group, index) => (
            <article key={group.area} className="grid gap-5 p-6 lg:grid-cols-[12rem_minmax(0,1fr)_18rem]">
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
                  {String(index + 1).padStart(2, '0')} / {group.target}
                </span>
                <h3 className="mt-2 text-lg font-medium">{group.area}</h3>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
                {group.rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <div className="rounded-lg bg-muted p-4">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Evidence</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{group.evidence}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Surface className="p-5">
          <SectionLabel>review checklist</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Before a component ships</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Use it with keyboard only and confirm focus never disappears.</li>
            <li>Check accessible name, role, current state, and reading order.</li>
            <li>Review light, dark, narrow, zoomed, and reduced-motion presentations.</li>
            <li>Confirm status and errors remain understandable without color or motion.</li>
          </ul>
        </Surface>
        <Surface className="p-5">
          <SectionLabel>scope note</SectionLabel>
          <h2 className="mt-2 text-lg font-medium">Target, not certification</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The portfolio follows these rules and includes focused automated checks, but this page is not a formal accessibility certification. New components should receive keyboard and assistive-technology review before release.
          </p>
        </Surface>
      </section>
    </div>
  );
}