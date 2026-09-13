import { lazy, type ComponentType } from 'react';
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from './foundations';

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

const AlexOsDemo = lazyPage(() =>
  import('./demos/alex-os').then(({ AlexOsDemo }) => AlexOsDemo),
);
const GuidelinesDemo = lazyPage(() =>
  import('./demos/guidelines').then(({ GuidelinesDemo }) => GuidelinesDemo),
);

export type PreviewEntry = {
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

export const DESIGN_SYSTEM = {
  title: 'Alex OS Design System',
  description:
    'Foundations, components, and responsive interaction patterns for the Alex Rivera desktop portfolio in light and dark themes.',
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: 'overview',
  name: 'Overview',
  description: 'The visual foundations and principles that shape Alex OS.',
  Page: OverviewPage,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Foundations',
    entries: [
      {
        id: 'color-roles',
        name: 'Color roles',
        description: 'Complete semantic palettes for light and dark themes.',
        Page: ColorsPage,
      },
      {
        id: 'type-scale',
        name: 'Typography',
        description: 'Space Grotesk and DM Mono roles and hierarchy.',
        Page: FontsPage,
      },
      {
        id: 'spacing-radius',
        name: 'Spacing & radius',
        description: 'The four-pixel spacing rhythm and corner treatments.',
        Page: LayoutPage,
      },
      {
        id: 'icon-motion',
        name: 'Iconography & motion',
        description: 'Keyline icon rules, transition timing, and interaction feedback.',
        Page: GuidelinesDemo,
      },
    ],
  },
  {
    name: 'Components',
    entries: [
      {
        id: 'alex-os-pilot',
        name: 'Portfolio primitives',
        description: 'Actions, labels, status, surfaces, and project cards used by the portfolio.',
        Page: AlexOsDemo,
      },
    ],
  },
  {
    name: 'Patterns',
    entries: [
      {
        id: 'responsive-workspace',
        name: 'Responsive workspace',
        description: 'Freeform desktop, managed mobile, and preserved geometry.',
        Page: GuidelinesDemo,
      },
    ],
  },
];

export const ALL_ENTRIES = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];