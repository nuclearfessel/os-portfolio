/**
 * GVC Illustration Components
 *
 * Reusable React components for guide/teaching illustrations.
 * These provide the reusable structural wrappers (AnnotatedFrame,
 * AbstractWindow, PositionGrid) while leaving product-specific
 * diagram interiors to the consuming application.
 *
 * Import the companion CSS alongside these components:
 *   import '@workspace/os-portfolio-ds/components/ui/gvc-illustration.css';
 *
 * All colours are driven by --component-guide-illustration-* custom
 * properties generated from tokens.json — no raw hex in this file
 * except representational traffic-light colours documented inline.
 */

import type { ReactNode, CSSProperties } from 'react';

// ---------------------------------------------------------------------------
// AnnotatedFrame
// ---------------------------------------------------------------------------

export type AnnotatedFrameMarker = {
  /** Single uppercase letter or short label (e.g. "A", "B", "01") */
  label: string;
  /** Human-readable description shown in the legend */
  description: string;
};

export type AnnotatedFrameProps = {
  /** Crop content — illustration interior; markers placed absolutely within */
  children: ReactNode;
  /** Legend entries rendered below the crop */
  markers?: AnnotatedFrameMarker[];
  /** Additional className for the outer .gvc-annotated wrapper */
  className?: string;
  /** Additional className for the .gvc-annotated-crop element */
  cropClassName?: string;
  /** Additional style for the .gvc-annotated-crop element */
  cropStyle?: CSSProperties;
  /** aria-hidden on the outer wrapper (illustrations are decorative by default) */
  'aria-hidden'?: boolean | 'true' | 'false';
  /** data-testid for testing hooks */
  'data-testid'?: string;
};

/**
 * AnnotatedFrame wraps an illustration crop with a bottom legend rail.
 * Dot-badge markers can be placed anywhere inside `children`; the legend
 * maps each label to a text description below the crop.
 *
 * @example
 * <AnnotatedFrame
 *   markers={[
 *     { label: 'A', description: 'System bar — time, status, and location' },
 *     { label: 'B', description: 'Windows — each app opens here' },
 *   ]}
 *   aria-hidden="true"
 * >
 *   <div className="gvc-overview-crop">...</div>
 * </AnnotatedFrame>
 */
export function AnnotatedFrame({
  children,
  markers,
  className,
  cropClassName,
  cropStyle,
  'aria-hidden': ariaHidden = 'true',
  'data-testid': dataTestId,
}: AnnotatedFrameProps) {
  return (
    <div
      className={`gvc-annotated${className ? ` ${className}` : ''}`}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
    >
      <div
        className={`gvc-annotated-crop${cropClassName ? ` ${cropClassName}` : ''}`}
        style={cropStyle}
      >
        {children}
      </div>
      {markers && markers.length > 0 && (
        <div className="gvc-legend">
          {markers.map((m) => (
            <div key={m.label} className="gvc-legend-item">
              <DotBadge label={m.label} />
              {m.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DotBadge
// ---------------------------------------------------------------------------

export type DotBadgeProps = {
  label: string;
  /** When true, renders with .gvc-dot-inline (margin-left + align-self: center) */
  inline?: boolean;
  className?: string;
  /** Optional composition geometry such as an edge marker's along-edge offset */
  style?: CSSProperties;
};

/**
 * Circular numbered/lettered badge used both inside crops and in legend items.
 * Uses the primary token for its background colour (theme-safe).
 */
export function DotBadge({ label, inline, className, style }: DotBadgeProps) {
  const cls = [
    'gvc-dot-badge',
    inline ? 'gvc-dot-inline' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={cls} style={style}>{label}</span>;
}

// ---------------------------------------------------------------------------
// AbstractWindow
// ---------------------------------------------------------------------------

export type AbstractWindowProps = {
  /** Title shown left in the title bar */
  title?: string;
  /** Window body content */
  children?: ReactNode;
  /** Additional className for the outer .gvc-window wrapper */
  className?: string;
  /** Additional style for the outer .gvc-window wrapper */
  style?: CSSProperties;
  /** Render a resize handle at the SE corner */
  showResizeHandle?: boolean;
};

/**
 * AbstractWindow renders a product-correct illustration of a desktop window:
 * - Title bar with title on the left
 * - Minimize / Maximize / Close controls at the **top right** (in that order)
 * - Monochrome dot buttons (no macOS traffic-light colours)
 *
 * The window body is the `children` slot; callers supply content lines,
 * stats, or other interior elements.
 *
 * @example
 * <AbstractWindow title="~/about" showResizeHandle>
 *   <div className="gvc-content-line" style={{ width: '60%' }} />
 *   <div className="gvc-content-line" style={{ width: '90%' }} />
 * </AbstractWindow>
 */
export function AbstractWindow({
  title,
  children,
  className,
  style,
  showResizeHandle,
}: AbstractWindowProps) {
  return (
    <div
      className={`gvc-window${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className="gvc-win-titlebar">
        {title && <span className="gvc-win-title-text">{title}</span>}
        <div className="gvc-win-controls">
          {/* Minimize → Maximize → Close: left-to-right, top-right of titlebar */}
          <span className="gvc-win-btn gvc-win-min" aria-label="Minimize" />
          <span className="gvc-win-btn gvc-win-max" aria-label="Maximize" />
          <span className="gvc-win-btn gvc-win-close" aria-label="Close" />
        </div>
      </div>
      {children && (
        <div className="gvc-window-body">{children}</div>
      )}
      {showResizeHandle && (
        <div className="gvc-resize-handle gvc-resize-se" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PositionGrid
// ---------------------------------------------------------------------------

export type PositionCellProps = {
  /** Short position label, e.g. "top", "right", "bottom", "left" */
  position: string;
  /** Mini-screen content — dock/sysbar position indicators */
  children: ReactNode;
};

/**
 * A single cell in the PositionGrid: mini-screen above, label below.
 */
export function PositionCell({ position, children }: PositionCellProps) {
  return (
    <div className="gvc-pos-cell">
      <div className="gvc-screen-mini">{children}</div>
      <span className="gvc-pos-label">{position}</span>
    </div>
  );
}

export type PositionGridProps = {
  /** Columns override (default: 4) */
  columns?: number;
  /** Grid cells — use `<PositionCell>` components */
  children: ReactNode;
  /** Additional className */
  className?: string;
};

/**
 * PositionGrid renders a row of labelled mini-screen position diagrams
 * (e.g. for dock/system-bar placement options).
 * Each child should be a `<PositionCell>`.
 *
 * @example
 * <PositionGrid>
 *   {(['top', 'right', 'bottom', 'left'] as const).map((pos) => (
 *     <PositionCell key={pos} position={pos}>
 *       <div className="gvc-mini-sysbar gvc-mini-sysbar-top" />
 *     </PositionCell>
 *   ))}
 * </PositionGrid>
 */
export function PositionGrid({ columns = 4, children, className }: PositionGridProps) {
  return (
    <div
      className={`gvc-positions-grid${className ? ` ${className}` : ''}`}
      style={columns !== 4 ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      {children}
    </div>
  );
}
