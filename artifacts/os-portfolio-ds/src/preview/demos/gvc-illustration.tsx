/**
 * Guide Illustration Components — DS Preview Demo
 *
 * Shows theme-safe annotations, narrow wrapping, correct window controls,
 * and a position grid. Registered as 'gvc-illustration' in the preview registry.
 */
import type { CSSProperties } from 'react';
import '@workspace/os-portfolio-ds/components/ui/gvc-illustration.css';
import {
  AnnotatedFrame,
  AbstractWindow,
  DotBadge,
  PositionGrid,
  PositionCell,
} from '../../components/ui/gvc-illustration';
import { SectionLabel, Surface } from '../../components/ui/os-portfolio';

// Demo: AnnotatedFrame with abstract window interior
function WindowAnatomyDemo() {
  return (
    <AnnotatedFrame
      aria-hidden="true"
      cropClassName="guide-visual-window-demo"
      cropStyle={{ padding: '28px 16px 32px' }}
      markers={[
        { label: 'A', description: 'Title bar — drag here to move the window' },
        { label: 'B', description: 'Minimize / Maximize / Close — left to right' },
        { label: 'C', description: 'Corner handle — drag to resize' },
      ]}
    >
      <AbstractWindow
        title="~/about"
        showResizeHandle
        className="gvc-window-overflow-visible"
        style={{ width: '100%', maxWidth: 360 }}
      >
        {/* Marker A on titlebar */}
        <span
          className="gvc-dot-badge"
          style={{ position: 'absolute', left: '46%', top: 8, transform: 'translateX(-50%)' }}
        >
          A
        </span>
        {/* Marker B on controls */}
        <span
          className="gvc-dot-badge"
          style={{ position: 'absolute', right: 2, top: 8 }}
        >
          B
        </span>
        <div className="gvc-content-line" style={{ width: '55%', height: 3, marginBottom: 6 }} />
        <div className="gvc-content-line" style={{ width: '85%' }} />
        <div className="gvc-content-line" style={{ width: '70%' }} />
        <div className="gvc-content-line" style={{ width: '80%' }} />
        {/* Marker C on resize handle (rendered by AbstractWindow) */}
        <DotBadge label="C" className="gvc-dot-edge-se" />
      </AbstractWindow>
    </AnnotatedFrame>
  );
}

// Demo: AnnotatedFrame with desktop overview interior
function DesktopOverviewDemo() {
  return (
    <AnnotatedFrame
      aria-hidden="true"
      cropClassName="gvc-overview-crop"
      markers={[
        { label: 'A', description: 'System bar — time, status, and location' },
        { label: 'B', description: 'Windows — each app opens here' },
        { label: 'C', description: 'Desktop icons — open apps from the workspace' },
        { label: 'D', description: 'Stickies — quick notes on the desktop' },
        { label: 'E', description: 'Dock — open and switch apps' },
      ]}
    >
      {/* System bar */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '10%', background: 'var(--gv-surface-deep)',
          borderBottom: '1px solid var(--gv-border)',
          display: 'flex', alignItems: 'center',
          padding: '0 10px', gap: 6,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gv-primary)', display: 'block' }} />
        <span style={{ flex: 1 }} />
        <span style={{ font: '7px var(--app-font-mono)', color: 'var(--gv-fg-muted)' }}>10:42 am</span>
        <DotBadge label="A" />
      </div>

      {/* Window 1 */}
      <div style={{ position: 'absolute', left: '6%', top: '16%', width: '42%', height: '52%' }}>
        <AbstractWindow title="~/about">
          <div className="gvc-content-line" style={{ width: '60%', height: 4 }} />
          <div className="gvc-content-line" style={{ width: '90%', height: 4 }} />
          <div className="gvc-content-line" style={{ width: '75%', height: 4 }} />
        </AbstractWindow>
        <DotBadge label="B" className="gvc-dot-edge-left" style={{ bottom: 12 } as CSSProperties} />
      </div>

      {/* Window 2 */}
      <div style={{ position: 'absolute', left: '44%', top: '24%', width: '50%', height: '46%' }}>
        <AbstractWindow title="~/work">
          <div className="gvc-content-line" style={{ width: '50%', height: 4 }} />
          <div className="gvc-content-line" style={{ width: '80%', height: 4 }} />
        </AbstractWindow>
      </div>

      {/* Sticky note */}
      <div style={{ position: 'absolute', left: '6%', top: '72%', display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 48, height: 36, background: '#ffd84d', borderRadius: 4, border: '1px solid rgba(143,105,0,.2)' }} />
        <DotBadge label="D" />
      </div>

      {/* Dock */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%',
        height: '12%', background: 'var(--gv-surface-deep)',
        borderTop: '1px solid var(--gv-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0 8px',
      }}>
        {['#d64f8c','#7478b8','#e7ded5','#303747','#ebca75','#56cbd3','#c9f27b'].map((bg, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: bg, flexShrink: 0 }} />
        ))}
        <DotBadge label="E" />
      </div>
    </AnnotatedFrame>
  );
}

// Demo: PositionGrid
function DockPositionDemo() {
  const positions = ['top', 'right', 'bottom', 'left'] as const;
  return (
    <PositionGrid>
      {positions.map((pos) => (
        <PositionCell key={pos} position={pos}>
          <div className={`gvc-mini-dock gvc-mini-dock-${pos}`} />
        </PositionCell>
      ))}
    </PositionGrid>
  );
}

// Demo: Narrow wrapping test
function NarrowWrapDemo() {
  return (
    <div style={{ maxWidth: 400, containerType: 'inline-size' }}>
      <AnnotatedFrame
        aria-hidden="true"
        markers={[
          { label: 'A', description: 'Narrow layout — legend wraps to single column' },
          { label: 'B', description: 'Content lines stay within crop bounds' },
          { label: 'C', description: 'Position grid collapses to 2 columns' },
        ]}
      >
        <AbstractWindow title="~/narrow" style={{ width: '100%' }}>
          <div className="gvc-content-line" style={{ width: '80%' }} />
          <div className="gvc-content-line" style={{ width: '60%' }} />
        </AbstractWindow>
      </AnnotatedFrame>
    </div>
  );
}

export function GvcIllustrationDemo() {
  return (
    <div className="space-y-8 p-4">
      <Surface className="space-y-4 p-6">
        <SectionLabel>gvc-illustration / window anatomy</SectionLabel>
        <h2 className="text-2xl font-semibold">Abstract Window Chrome</h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Product-correct illustration chrome: title left, Minimize → Maximize → Close at top-right.
          Monochrome buttons, no macOS traffic-light colours. All colours from DS tokens.
        </p>
        <WindowAnatomyDemo />
      </Surface>

      <Surface className="space-y-4 p-6">
        <SectionLabel>gvc-illustration / annotated frame</SectionLabel>
        <h2 className="text-2xl font-semibold">Desktop Overview (AnnotatedFrame)</h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          AnnotatedFrame wraps any illustration crop with a legend rail. Markers placed
          inside the crop link to legend entries below. Theme-safe in light and dark.
        </p>
        <DesktopOverviewDemo />
      </Surface>

      <Surface className="space-y-4 p-6">
        <SectionLabel>gvc-illustration / position grid</SectionLabel>
        <h2 className="text-2xl font-semibold">PositionGrid + PositionCell</h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Four position cells with mini-screen + label. At ≤ 499px container width,
          collapses to 2 columns. Dock/sysbar strips use CSS utility classes.
        </p>
        <DockPositionDemo />
      </Surface>

      <Surface className="space-y-4 p-6">
        <SectionLabel>gvc-illustration / responsive containment</SectionLabel>
        <h2 className="text-2xl font-semibold">Narrow wrapping (≤400px)</h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Legend items wrap to single-column at narrow container widths.
          Crops remain contained with no horizontal overflow.
        </p>
        <NarrowWrapDemo />
      </Surface>
    </div>
  );
}
