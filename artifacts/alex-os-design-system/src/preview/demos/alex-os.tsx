import {
  ActionButton,
  ProjectCard,
  SectionLabel,
  StatusIndicator,
  Surface,
} from '../../components/ui/alex-os';

export function AlexOsDemo() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <SectionLabel>components / pilot</SectionLabel>
        <h1 className="text-3xl font-semibold tracking-tight">Alex OS primitives</h1>
        <p className="max-w-2xl text-muted-foreground">
          Reusable foundations for the portfolio’s desktop windows, actions, project lists, and system status.
        </p>
      </header>

      <Surface elevation="floating" className="space-y-6 p-6">
        <div className="flex flex-wrap gap-3">
          <ActionButton variant="primary">Primary action</ActionButton>
          <ActionButton>Secondary action</ActionButton>
          <ActionButton variant="danger">Destructive action</ActionButton>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <StatusIndicator />
          <StatusIndicator tone="idle" label="away" />
          <StatusIndicator tone="danger" label="offline" />
        </div>
      </Surface>

      <ProjectCard
        index="01"
        title="Orbit CRM"
        description="A calmer command center for customer teams managing complex accounts."
        tag="PRODUCT / 2024"
        accent="#e4ff5b"
        action={<ActionButton variant="primary">View case study</ActionButton>}
      />

      <Surface className="space-y-3 p-5">
        <SectionLabel>pattern / window content</SectionLabel>
        <h2 className="text-xl font-medium">Quiet structure, visible hierarchy.</h2>
        <p className="text-sm text-muted-foreground">
          Use one accent, compact mono labels, and restrained surfaces. Motion should confirm state rather than compete for attention.
        </p>
      </Surface>
    </div>
  );
}