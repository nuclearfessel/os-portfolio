import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant = 'secondary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={classes(
        'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2',
        variant === 'primary' && 'border-primary bg-primary text-primary-foreground hover:brightness-105',
        variant === 'secondary' && 'border-border bg-secondary text-secondary-foreground hover:border-primary hover:text-primary',
        variant === 'danger' && 'border-destructive bg-destructive text-destructive-foreground hover:brightness-110',
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
};

export function StatusIndicator({
  className,
  label = 'online',
  tone = 'online',
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
        'rounded-lg border border-border bg-card text-card-foreground',
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
        'grid items-center gap-3 rounded-md border border-border bg-card p-4 text-card-foreground',
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