import { ProjectCard, ActionButton } from '../../components/ui/fes-os';
import { CanonicalSpec } from '../md-renderer';
import { mdFesOsProjectCard } from '../docs-map';

export function FesOsProjectCardDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Default — with accent and action</p>
        <ProjectCard
          index="01"
          title="Orbit CRM"
          description="A calmer command center for customer teams managing complex accounts."
          tag="PRODUCT / 2024"
          accent="#e4ff5b"
          action={<ActionButton variant="primary">View case study</ActionButton>}
        />

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Secondary action variant</p>
        <ProjectCard
          index="02"
          title="SimNow 2.0 — da Vinci Simulator"
          description="Unified the da Vinci console and Intuitive Digital design systems for surgeon training."
          tag="ENTERPRISE / 2025"
          accent="#e4ff5b"
          action={<ActionButton>View case study</ActionButton>}
        />

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">No action (display only)</p>
        <ProjectCard
          index="03"
          title="Cedar — REI Design System"
          description="Library and tooling contributions to Cedar, REI's open-source design system."
          tag="OPEN SOURCE / 2020"
          accent="#e4ff5b"
        />
      </div>

      <CanonicalSpec md={mdFesOsProjectCard} title="ProjectCard reference" />
    </div>
  );
}
