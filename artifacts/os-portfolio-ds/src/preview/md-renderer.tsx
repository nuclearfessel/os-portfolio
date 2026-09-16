/**
 * MarkdownDoc — a safe React-based Markdown renderer.
 *
 * Supports: headings (h1-h4), paragraphs, inline code, fenced code blocks,
 * bullet & numbered lists, tables, links, bold, italic, horizontal rules,
 * and blockquotes.
 *
 * No dangerouslySetInnerHTML.  All output is React elements.
 */

import { type ReactNode } from 'react';
import { CodeSourceBlock } from './doc-renderer';

// ─── Tokeniser ────────────────────────────────────────────────────────────────

type Block =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; lang: string; body: string }
  | { kind: 'bullet-list'; items: string[] }
  | { kind: 'ordered-list'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'rule' }
  | { kind: 'blockquote'; lines: string[] };

function tokenise(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        bodyLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      blocks.push({ kind: 'code', lang, body: bodyLines.join('\n') });
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      blocks.push({ kind: 'rule' });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4) as 1 | 2 | 3 | 4;
      blocks.push({ kind: 'heading', level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // Table  (GFM — requires |…| header + separator row)
    if (line.includes('|')) {
      const tableLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].includes('|')) {
        tableLines.push(lines[j]);
        j++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (l: string) =>
          l
            .split('|')
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const headers = parseRow(tableLines[0]);
        // Skip separator row (index 1)
        const rows = tableLines.slice(2).map(parseRow);
        if (headers.length > 0) {
          blocks.push({ kind: 'table', headers, rows });
          i = j;
          continue;
        }
      }
    }

    // Unordered list
    if (/^[-*+]\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        const itemLines = [lines[i].trim().replace(/^[-*+]\s+/, '')];
        i++;
        while (
          i < lines.length &&
          lines[i].trim().length > 0 &&
          !/^([-*+]\s|\d+\.\s|#{1,4}\s|>|```|\|)/.test(lines[i].trim())
        ) {
          itemLines.push(lines[i].trim());
          i++;
        }
        items.push(itemLines.join(' '));
      }
      blocks.push({ kind: 'bullet-list', items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const itemLines = [lines[i].trim().replace(/^\d+\.\s+/, '')];
        i++;
        while (
          i < lines.length &&
          lines[i].trim().length > 0 &&
          !/^([-*+]\s|\d+\.\s|#{1,4}\s|>|```|\|)/.test(lines[i].trim())
        ) {
          itemLines.push(lines[i].trim());
          i++;
        }
        items.push(itemLines.join(' '));
      }
      blocks.push({ kind: 'ordered-list', items });
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ kind: 'blockquote', lines: bqLines });
      continue;
    }

    // Paragraph (non-empty line)
    if (line.trim().length > 0) {
      const paragraphLines: string[] = [line.trim()];
      i++;
      while (
        i < lines.length &&
        lines[i].trim().length > 0 &&
        !/^(#{1,4}\s|[-*+]\s|\d+\.\s|>|```|\|)/.test(lines[i].trim())
      ) {
        paragraphLines.push(lines[i].trim());
        i++;
      }
      blocks.push({ kind: 'paragraph', text: paragraphLines.join(' ') });
      continue;
    }

    // Blank line — skip
    i++;
  }

  return blocks;
}

// ─── Inline rendering ─────────────────────────────────────────────────────────

function renderInline(text: string, key?: string): ReactNode {
  // Process inline patterns: **bold**, *italic*, `code`, [link](url)
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    if (m[2] !== undefined) {
      // **bold**
      parts.push(<strong key={`b-${idx++}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      // *italic*
      parts.push(<em key={`i-${idx++}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      // `code`
      parts.push(
        <code key={`c-${idx++}`} className="rounded bg-muted/60 px-1 py-0.5 font-mono text-[0.8em] text-primary">
          {m[4]}
        </code>
      );
    } else if (m[5] !== undefined && m[6] !== undefined) {
      // [link](url)
      parts.push(
        <a
          key={`a-${idx++}`}
          href={m[6]}
          className="text-primary underline underline-offset-2 hover:text-primary/80"
          target={m[6].startsWith('http') ? '_blank' : undefined}
          rel={m[6].startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {m[5]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <span key={key}>{parts}</span>;
}

// ─── Block rendering ─────────────────────────────────────────────────────────

function renderBlock(block: Block, i: number): ReactNode {
  switch (block.kind) {
    case 'heading': {
      const headingClass =
        block.level === 1
          ? 'mt-8 text-lg font-semibold tracking-tight text-foreground first:mt-0'
          : block.level === 2
          ? 'mt-6 text-base font-semibold tracking-tight text-foreground first:mt-0'
          : block.level === 3
          ? 'mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground'
          : 'mt-3 text-sm font-medium text-foreground';

      return (
        <div key={i} className={headingClass}>
          {renderInline(block.text)}
        </div>
      );
    }

    case 'paragraph':
      return (
        <p key={i} className="w-full max-w-none text-sm leading-6 text-foreground/80">
          {renderInline(block.text)}
        </p>
      );

    case 'code':
      return <CodeSourceBlock key={i} code={block.body} language={block.lang || 'text'} />;

    case 'bullet-list':
      return (
        <ul key={i} className="w-full max-w-none space-y-1.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0 flex-1 leading-6">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case 'ordered-list':
      return (
        <ol key={i} className="w-full max-w-none space-y-1.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-primary">{j + 1}.</span>
              <span className="min-w-0 flex-1 leading-6">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    case 'table': {
      if (block.headers.length === 0) return null;
      return (
        <div key={i} className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {block.headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0 transition-colors hover:bg-muted/20">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 align-top text-foreground/80">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'rule':
      return <hr key={i} className="border-border" />;

    case 'blockquote':
      return (
        <blockquote key={i} className="w-full max-w-none border-l-2 border-primary/40 pl-4">
          {block.lines.map((l, j) => (
            <p key={j} className="text-sm italic text-muted-foreground leading-6">
              {renderInline(l)}
            </p>
          ))}
        </blockquote>
      );

    default:
      return null;
  }
}

// ─── Public component ─────────────────────────────────────────────────────────

/**
 * Renders a Markdown string as styled React elements.
 * Safe — no dangerouslySetInnerHTML.
 */
export function MarkdownDoc({
  markdown,
  md,
}: {
  markdown?: string;
  md?: string;
}) {
  const source = markdown ?? md ?? '';
  const blocks = tokenise(source);
  return (
    <div className="w-full max-w-none space-y-4">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

/**
 * Wraps a MarkdownDoc in the standard "Specification & guidelines" frame
 * used by component pages.
 */
export function MarkdownDocSpec({
  markdown,
  md,
  title = 'Component reference',
}: {
  markdown?: string;
  md?: string;
  title?: string;
}) {
  const source = markdown ?? md ?? '';
  return (
    <div className="mt-10 border-t pt-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Specification &amp; guidelines
        </p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <MarkdownDoc markdown={source} />
    </div>
  );
}

/**
 * CanonicalSpec — the primary exported wrapper for canonical Markdown documentation.
 * Accepts `md` (a raw Markdown string) and renders it in the standard spec frame.
 * Named to match the import contract already established across demo files.
 */
export function CanonicalSpec({
  md,
  markdown,
  title = 'Component reference',
}: {
  md?: string;
  markdown?: string;
  title?: string;
}) {
  return <MarkdownDocSpec md={md ?? markdown ?? ''} title={title} />;
}

/**
 * Extracts a single ## section (and its sub-sections) from a Markdown string.
 * Returns the matched section's content only, without the heading itself.
 * If the section is not found, returns the full document.
 */
export function extractSection(markdown: string, sectionName: string): string {
  const lines = markdown.split('\n');
  let inSection = false;
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2Match = line.match(/^## (.+)$/);

    if (h2Match) {
      if (inSection) break; // Next h2 = end of our section
      const headingText = h2Match[1].trim().toLowerCase();
      const needle = sectionName.toLowerCase();
      // Match exactly OR the heading starts with the section name followed by space/slash
      const isMatch =
        headingText === needle ||
        headingText.startsWith(needle + ' ') ||
        headingText.startsWith(needle + '/') ||
        headingText.startsWith(needle + ',');
      if (isMatch) {
        inSection = true;
        // Include the heading so context is clear
        result.push(line);
        continue;
      }
    }

    if (inSection) {
      result.push(line);
    }
  }

  return result.length > 0 ? result.join('\n') : markdown;
}
