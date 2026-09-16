import { useState } from 'react';
import { ProjectCard, ActionButton } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioProjectCard } from '../docs-map';

export function OsPortfolioProjectCardDemo() {
  const [openedProject, setOpenedProject] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Default card · accent · action {openedProject === 'Northstar' ? 'opened' : 'idle'}
        </p>
        <ProjectCard
          index="01"
          title="Northstar Commerce System"
          description="A flexible foundation that helped a growing commerce team ship consistent storefront and account experiences."
          tag="DESIGN SYSTEM / 2025"
          accent="#e4ff5b"
          action={<ActionButton onClick={() => setOpenedProject('Northstar')}>View case study</ActionButton>}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Northstar action outcome · {openedProject === 'Northstar' ? 'Opened' : 'Idle'}
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Primary action variant · {openedProject === 'Signal' ? 'opened' : 'idle'}
        </p>
        <ProjectCard
          index="02"
          title="Signal Operations Platform"
          description="A focused operations language for teams coordinating alerts, handoffs, and high-stakes daily work."
          tag="PRODUCT SYSTEM / 2024"
          accent="#e4ff5b"
          action={<ActionButton variant="primary" onClick={() => setOpenedProject('Signal')}>View case study</ActionButton>}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Signal action outcome · {openedProject === 'Signal' ? 'Opened' : 'Idle'}
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">No action variant · display-only static</p>
        <ProjectCard
          index="03"
          title="Mosaic Health Toolkit"
          description="An accessible toolkit for designing clear, reassuring health journeys across devices and contexts."
          tag="DESIGN SYSTEM / 2023"
          accent="#e4ff5b"
        />
      </div>

      <CanonicalSpec md={mdOsPortfolioProjectCard} title="ProjectCard reference" />
    </div>
  );
}
