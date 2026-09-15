import { useState } from 'react';
import { Calendar } from '../../components/ui/calendar';
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
  DocTokens,
} from '../doc-renderer';

export function CalendarDemo() {
  const [singleDate, setSingleDate] = useState<Date | undefined>(
    new Date(2026, 6, 20),
  );
  const [rangeFrom, setRangeFrom] = useState<Date | undefined>(
    new Date(2026, 6, 14),
  );
  const [rangeTo, setRangeTo] = useState<Date | undefined>(
    new Date(2026, 6, 20),
  );

  return (
    <div className="space-y-8">
      {/* Interactive demos */}
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        <div className="grid gap-8 lg:grid-cols-2">
          <Row label="Single date">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              <Calendar
                mode="single"
                defaultMonth={new Date(2026, 6, 1)}
                selected={singleDate}
                onSelect={setSingleDate}
              />
            </div>
          </Row>

          <Row label="Date range">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              <Calendar
                mode="range"
                defaultMonth={new Date(2026, 6, 1)}
                selected={{ from: rangeFrom, to: rangeTo }}
                onSelect={(r) => {
                  setRangeFrom(r?.from);
                  setRangeTo(r?.to);
                }}
              />
            </div>
          </Row>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Row label="With outside days">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              <Calendar
                mode="single"
                defaultMonth={new Date(2026, 6, 1)}
                showOutsideDays
              />
            </div>
          </Row>

          <Row label="With disabled days">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              <Calendar
                mode="single"
                defaultMonth={new Date(2026, 6, 1)}
                disabled={[
                  { before: new Date(2026, 6, 5) },
                  { after: new Date(2026, 6, 25) },
                ]}
              />
            </div>
          </Row>
        </div>

        <div className="mt-8">
          <Row label="Dropdown navigation">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                defaultMonth={new Date(2026, 6, 1)}
                startMonth={new Date(2020, 0, 1)}
                endMonth={new Date(2030, 11, 31)}
              />
            </div>
          </Row>
        </div>
      </div>

      {/* Spec section */}
      <DocSpec>
        <DocSection title="Purpose">
          <DocP>
            Calendar renders a deterministic date picker grid. It is a fully
            controlled component — the consuming product owns the selected date
            and provides it via <code className="font-mono text-xs">selected</code>{' '}
            and <code className="font-mono text-xs">onSelect</code>. Use it
            standalone, inside a Popover, or nested inside a Card/form field.
          </DocP>
          <DocP>
            Built on <code className="font-mono text-xs">react-day-picker</code>{' '}
            v9 — all DayPicker props are forwarded. Keyboard navigation, ARIA
            grid semantics, and locale formatting are handled by the underlying
            library.
          </DocP>
        </DocSection>

        <DocSection title="Anatomy">
          <DocAnatomy>{`
Calendar
├── Nav row (absolute)
│   ├── button_previous  ← ChevronLeft (ghost button, cell-size)
│   ├── month_caption    ← "July 2026" label or dropdowns
│   └── button_next      ← ChevronRight
├── weekdays row
│   └── weekday × 7      ← Mon Tue Wed … (text-xs, centred, cell-height)
└── weeks
    └── week row × N
        └── day td × 7   ← range stripe background here
            └── DayButton ← interactive button (2.5 rem × 2.5 rem)
`}</DocAnatomy>
        </DocSection>

        <DocSection title="Modes">
          <DocTable
            headers={['Mode', 'selected type', 'onSelect type', 'Description']}
            rows={[
              ['mode="single"', 'Date | undefined', '(date) => void', 'One date at a time'],
              ['mode="multiple"', 'Date[]', '(dates) => void', 'Any number of dates'],
              ['mode="range"', '{ from?, to? }', '(range) => void', 'Contiguous date span'],
            ]}
          />
        </DocSection>

        <DocSection title="Visual states">
          <DocTable
            headers={['State', 'Visual', 'Token']}
            rows={[
              ['Default', 'Transparent, readable weight-normal label', 'text-foreground'],
              ['Hover', 'Secondary fill', 'bg-secondary text-secondary-foreground'],
              ['Focus-visible', '2px ring with 1px ring-offset', 'ring-ring, ring-offset-background'],
              ['Selected (single)', 'Strong primary fill', 'bg-primary text-primary-foreground'],
              ['Today', '1px inset ring', 'ring-1 ring-primary/40'],
              ['Outside month', '35% opacity, 60% when selected', 'opacity-35'],
              ['Disabled', '30% opacity, no pointer events', 'opacity-30'],
              ['Range start / end', 'Primary fill, squared inner edge', 'bg-primary'],
              ['Range middle', 'Transparent (stripe from td)', 'bg-primary/10 on td'],
            ]}
          />
        </DocSection>

        <DocSection title="Navigation layouts">
          <DocTable
            headers={['captionLayout', 'Appearance', 'Use case']}
            rows={[
              ['label (default)', 'Static month/year text', 'Most uses — clean and focused'],
              ['dropdown', 'Month + Year select dropdowns', 'When jumping months/years is likely'],
              ['dropdown-months', 'Month dropdown only', 'Year is fixed or irrelevant'],
              ['dropdown-years', 'Year dropdown only', 'Month is fixed or irrelevant'],
            ]}
          />
        </DocSection>

        <DocSection title="Spacing & sizing">
          <DocP>
            Cell size is controlled by the CSS custom property{' '}
            <code className="font-mono text-xs">--cell-size: 2.5rem</code>{' '}
            (40 px). Every interactive cell meets the 40×40 px minimum pointer
            target. Weekday headers share the same height so the vertical rhythm
            is uniform. The outer wrapper uses <code className="font-mono text-xs">p-4</code>{' '}
            for comfortable breathing room inside a card or popover.
          </DocP>
        </DocSection>

        <DocSection title="Responsive behavior">
          <DocP>
            The calendar is <code className="font-mono text-xs">w-fit</code> by
            default — it expands no wider than seven cell columns. On narrow
            viewports, wrap it in a horizontally-scrollable container or use a
            Popover/Sheet trigger pattern to avoid viewport overflow.
          </DocP>
          <DocP>
            Multi-month layouts use{' '}
            <code className="font-mono text-xs">flex-col</code> below{' '}
            <code className="font-mono text-xs">md</code> and{' '}
            <code className="font-mono text-xs">flex-row</code> above it — set
            via the <code className="font-mono text-xs">months</code> classname
            slot.
          </DocP>
        </DocSection>

        <DocSection title="Accessibility">
          <DocList
            items={[
              'Grid rendered as role="grid" with aria-label set to the current month by react-day-picker.',
              'Each day cell is a native <button> with aria-label including the full date string.',
              'Arrow keys navigate between days; Page Up / Page Down moves between months.',
              'Enter or Space selects the focused day.',
              'Home / End jump to first / last day of the current week.',
              'Disabled days are aria-disabled and cannot be activated.',
              'Outside-month days have aria-label clarifying the month they belong to.',
              'Focus ring: 2px primary ring with 1px ring-offset ensures visibility on both light and dark range stripe backgrounds.',
            ]}
          />
        </DocSection>

        <DocSection title="Tokens">
          <DocTokens
            tokens={[
              '--cell-size',
              'bg-primary',
              'text-primary-foreground',
              'bg-secondary',
              'text-secondary-foreground',
              'ring-ring',
              'ring-offset-background',
              'bg-primary/10',
              'bg-primary/15',
              'text-muted-foreground',
              'ring-primary/40',
              'bg-background',
            ]}
          />
        </DocSection>

        <DocSection title="Do / Don't">
          <DocDoGrid
            items={[
              { kind: 'do', text: 'Wrap in a Popover when used as an inline date picker input.' },
              { kind: 'do', text: 'Pair with a visible text input that echoes the selected date.' },
              { kind: 'do', text: 'Use disabled prop to enforce business logic (past dates, blackout periods).' },
              { kind: 'do', text: 'Use mode="range" for date spans — do not simulate range with two singles.' },
              { kind: 'dont', text: "Rely on color alone to communicate today vs. selected — today also has a ring, selected has high contrast fill." },
              { kind: 'dont', text: 'Apply a custom cell size via arbitrary values — override --cell-size via CSS variable instead.' },
              { kind: 'dont', text: 'Nest more than one Calendar per Popover without clear separation.' },
              { kind: 'dont', text: 'Use Calendar as a full-page date picker — it is an inline/popover widget.' },
            ]}
          />
        </DocSection>

        <DocSection title="Code example">
          <DocCodeBlock language="tsx">{`
import { useState } from 'react';
import { Calendar } from '@workspace/portfolio-os-ds/components/ui/calendar';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '@workspace/portfolio-os-ds/components/ui/popover';
import { Button } from '@workspace/portfolio-os-ds/components/ui/button';

function DatePickerField() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-52 justify-start text-left">
          {date ? date.toLocaleDateString() : 'Pick a date…'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Range picker
function DateRangePicker() {
  const [range, setRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
    />
  );
}
`}</DocCodeBlock>
        </DocSection>
      </DocSpec>
    </div>
  );
}
