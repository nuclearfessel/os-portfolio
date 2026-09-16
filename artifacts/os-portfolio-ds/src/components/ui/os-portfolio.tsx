import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { tooltipSurfaceClassName } from './tooltip';
import './os-portfolio-action-button.css';
import './os-portfolio-terminal-cursor.css';

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant = 'secondary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={classes(
        'osp-action-button inline-flex min-h-9 items-center justify-center border text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
        `osp-action-button--${variant}`,
        className,
      )}
      {...props}
    />
  ),
);
ActionButton.displayName = 'ActionButton';

export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={classes(
        'font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary',
        className,
      )}
      {...props}
    />
  );
}

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
  tone?: 'online' | 'idle' | 'danger';
  dotClassName?: string;
};

export function StatusIndicator({
  className,
  label = 'online',
  tone = 'online',
  dotClassName,
  ...props
}: StatusIndicatorProps) {
  return (
    <span className={classes('inline-flex items-center gap-1.5 font-mono text-xs', className)} {...props}>
      <span
        aria-hidden="true"
        className={classes(
          'size-1.5 rounded-full shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_10%,transparent)]',
          tone === 'online' && 'bg-primary text-primary',
          tone === 'idle' && 'bg-muted-foreground text-muted-foreground',
          tone === 'danger' && 'bg-destructive text-destructive',
          dotClassName,
        )}
      />
      {label}
    </span>
  );
}

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: 'flat' | 'raised' | 'floating';
};

export function Surface({ className, elevation = 'raised', ...props }: SurfaceProps) {
  return (
    <div
      className={classes(
        'rounded-[var(--osp-radius-component-generic-surface-radius)] border border-border bg-card text-card-foreground',
        elevation === 'raised' && 'shadow-sm',
        elevation === 'floating' && 'shadow-xl',
        className,
      )}
      {...props}
    />
  );
}

export type ProjectCardProps = HTMLAttributes<HTMLElement> & {
  index: string;
  title: string;
  description: string;
  tag: string;
  accent?: string;
  action?: ReactNode;
};

export function ProjectCard({
  className,
  index,
  title,
  description,
  tag,
  accent,
  action,
  ...props
}: ProjectCardProps) {
  return (
    <article
      className={classes(
        'grid items-center gap-[var(--osp-spacing-component-project-card-gap)] rounded-[var(--osp-radius-component-project-card-radius)] border border-border bg-card p-[var(--osp-spacing-component-project-card-padding)] text-card-foreground',
        className,
      )}
      {...props}
    >
      <span className="project-index font-mono text-xs" style={accent ? { color: accent } : undefined}>{index}</span>
      <div className="project-copy"><h3>{title}</h3><p>{description}</p></div>
      <span className="project-tag">{tag}</span>
      {action}
    </article>
  );
}

export const WindowSurface = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={classes('rounded-[var(--osp-radius-component-window-surface-radius)] border border-border bg-card text-card-foreground shadow-xl', className)} {...props} />
  ),
);
WindowSurface.displayName = 'WindowSurface';

export type DockItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Whether the app is open and should retain its active border. */
  active?: boolean;
  /** Whether the app is currently focused/topmost and should show its edge tab. */
  focused?: boolean;
};

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(
  ({ className, active = false, focused = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={classes(
        'relative grid place-items-center rounded-[var(--osp-radius-component-dock-radius)] border transition-colors duration-[var(--osp-motion-component-dock-duration)] [transition-timing-function:var(--osp-motion-component-dock-easing)]',
        active && 'active',
        focused && 'focused',
        className,
      )}
      data-active={active || undefined}
      data-focused={focused || undefined}
      {...props}
    />
  ),
);
DockItem.displayName = 'DockItem';

export type DockItemLabelProps = HTMLAttributes<HTMLSpanElement> & {
  presentation?: 'tooltip' | 'inline';
};

export const DockItemLabel = forwardRef<HTMLSpanElement, DockItemLabelProps>(
  ({ className, presentation = 'tooltip', ...props }, ref) => (
    <span
      ref={ref}
      className={classes(
        'dock-item-label pointer-events-none whitespace-nowrap text-[10px]',
        presentation === 'tooltip' &&
          classes('dock-item-label-tooltip', tooltipSurfaceClassName),
        presentation === 'inline' &&
          'dock-item-label-inline block w-auto max-w-none border-0 bg-transparent p-0 font-sans leading-none text-inherit shadow-none',
        className,
      )}
      {...props}
    />
  ),
);
DockItemLabel.displayName = 'DockItemLabel';

export const DesktopLauncher = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }>(
  ({ className, open = false, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={classes(open && 'is-open', className)} {...props} />
  ),
);
DesktopLauncher.displayName = 'DesktopLauncher';

export function StickyNoteSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes('rounded-lg border shadow-xl', className)} {...props} />;
}

export function ContextMenuSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes('rounded-md border border-border bg-popover text-popover-foreground shadow-xl', className)} {...props} />;
}

export function TerminalCursor({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={classes('osp-terminal-cursor', className)}
      {...props}
      aria-hidden="true"
    />
  );
}