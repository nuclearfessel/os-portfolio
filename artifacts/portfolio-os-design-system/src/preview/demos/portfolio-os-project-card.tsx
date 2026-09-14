import { ProjectCard, ActionButton } from '../../components/ui/portfolio-os';
import { CanonicalSpec } from '../md-renderer';
import { mdPortfolioOsProjectCard } from '../docs-map';

export function PortfolioOsProjectCardDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Default — with accent and action</p>
        <ProjectCard
          index="01"
          title="Northstar Commerce System"
          description="A flexible foundation that helped a growing commerce team ship consistent storefront and account experiences."
          tag="DESIGN SYSTEM / 2025"
          accent="#e4ff5b"
          action={<ActionButton variant="primary">View case study</ActionButton>}
        />

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Secondary action variant</p>
        <ProjectCard
          index="02"
          title="Signal Operations Platform"
          description="A focused operations language for teams coordinating alerts, handoffs, and high-stakes daily work."
          tag="PRODUCT SYSTEM / 2024"
          accent="#e4ff5b"
          action={<ActionButton>View case study</ActionButton>}
        />

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">No action (display only)</p>
        <ProjectCard
          index="03"
          title="Mosaic Health Toolkit"
          description="An accessible toolkit for designing clear, reassuring health journeys across devices and contexts."
          tag="DESIGN SYSTEM / 2023"
          accent="#e4ff5b"
        />
      </div>

      <CanonicalSpec md={mdPortfolioOsProjectCard} title="ProjectCard reference" />
    </div>
  );
}
