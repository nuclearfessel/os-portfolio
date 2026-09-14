/**
 * DocRenderer — renders structured design system documentation.
 *
 * Provides a set of composable primitives for inline documentation sections:
 * - DocSection: wraps a spec section with a title
 * - DocGrid: two-column layout for do/dont pairs or token tables
 * - DocTable: horizontally scrollable table with styled headers
 * - DocCodeBlock: monospace code block with readable styling
 * - DocSpec: the full "Specifications & Guidelines" wrapper
 * - Plus prose helpers: DocP, DocH2, DocH3, DocList, DocDoGrid
 */

import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Section wrapper ─────────────────────────────────────────────────────────

export function DocSpec({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 space-y-0 border-t pt-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Specification &amp; guidelines
        </p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
          Component reference
        </h2>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

export function DocSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─── Prose helpers ────────────────────────────────────────────────────────────

export function DocP({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm leading-6 text-foreground/80', className)}>
      {children}
    </p>
  );
}

export function DocH3({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-foreground">{children}</h4>
  );
}

export function DocList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-foreground/80">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <span className="leading-6">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Code block ───────────────────────────────────────────────────────────────

export function CodeSourceBlock({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: string;
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const source = code.trim();

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1600);
    } catch {
      setCopyState('failed');
      window.setTimeout(() => setCopyState('idle'), 2400);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={() => void copySource()}
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={copyState === 'copied' ? 'Code copied' : 'Copy code'}
          title={copyState === 'copied' ? 'Copied' : 'Copy code'}
        >
          {copyState === 'copied' ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words p-4 text-xs leading-6">
        <code className="font-mono text-foreground">{source}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copyState === 'copied'
          ? 'Code copied to clipboard.'
          : copyState === 'failed'
            ? 'Unable to copy code.'
            : ''}
      </span>
    </div>
  );
}

export function DocCodeBlock({
  children,
  language = 'tsx',
}: {
  children: string;
  language?: string;
}) {
  return <CodeSourceBlock code={children} language={language} />;
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function DocTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[400px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 align-top">
                  {ci === 0 ? (
                    <code className="font-mono text-xs text-primary">{cell}</code>
                  ) : (
                    <span className="text-foreground/80">{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Do / Don't grid ─────────────────────────────────────────────────────────

export function DocDoGrid({
  items,
}: {
  items: Array<{ kind: 'do' | 'dont'; text: string }>;
}) {
  const dos = items.filter((i) => i.kind === 'do');
  const donts = items.filter((i) => i.kind === 'dont');

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-primary">Do</p>
        <ul className="space-y-2 text-sm text-foreground/80">
          {dos.map((item, i) => (
            <li key={i} className="flex gap-2 leading-6">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-destructive">
          Don&apos;t
        </p>
        <ul className="space-y-2 text-sm text-foreground/80">
          {donts.map((item, i) => (
            <li key={i} className="flex gap-2 leading-6">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Token pill row ───────────────────────────────────────────────────────────

export function DocTokens({ tokens }: { tokens: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <code
          key={token}
          className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs text-primary"
        >
          {token}
        </code>
      ))}
    </div>
  );
}

// ─── Anatomy block ────────────────────────────────────────────────────────────

export function DocAnatomy({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-6 text-foreground/70">
      {children.trim()}
    </pre>
  );
}

// ─── Key–value pair list ──────────────────────────────────────────────────────

export function DocKV({
  pairs,
}: {
  pairs: Array<{ key: string; value: ReactNode }>;
}) {
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
      {pairs.map(({ key, value }) => (
        <>
          <dt key={`k-${key}`} className="font-medium text-muted-foreground">
            {key}
          </dt>
          <dd key={`v-${key}`} className="text-foreground/80">
            {value}
          </dd>
        </>
      ))}
    </dl>
  );
}
