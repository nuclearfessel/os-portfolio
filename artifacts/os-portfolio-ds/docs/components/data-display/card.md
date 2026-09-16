# Card

**Source:** `src/components/ui/card.tsx`  
**Exports:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/card`  
**Preview page:** `card`

---

## Purpose

`Card` is a grouped content container for a related piece of information or task. Use its optional header, content, and footer primitives to create consistent project summaries, reports, settings panels, and other bounded surfaces.

Card is presentational: it does not add interaction, selection, disclosure, or link behavior. Add an appropriate interactive element inside it when the card contains an action.

## Anatomy

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting description</CardDescription>
  </CardHeader>
  <CardContent>{/* primary content */}</CardContent>
  <CardFooter>{/* actions or metadata */}</CardFooter>
</Card>
```

- `Card` is the outer surface.
- `CardHeader` groups the heading and optional supporting description.
- `CardTitle` is styled title text. It renders a `<div>`, so supply heading semantics when the card title is a document heading (for example, `as` is not supported; use an appropriate heading element in the content or add `role`/`aria-level` deliberately).
- `CardDescription` is muted supporting text.
- `CardContent` is the main body region.
- `CardFooter` is an aligned row for actions, metadata, or status.
- All primitives accept `className`; use it to adjust layout or spacing for the consuming composition.

## API

All six exports forward a ref to an `HTMLDivElement` and accept `React.HTMLAttributes<HTMLDivElement>` in addition to the props listed below.

| Component | Default classes | Description |
|---|---|---|
| `Card` | `rounded-xl border bg-card text-card-foreground shadow` | Outer container |
| `CardHeader` | `flex flex-col space-y-1.5 p-6` | Header region |
| `CardTitle` | `font-semibold leading-none tracking-tight` | Title text |
| `CardDescription` | `text-sm text-muted-foreground` | Supporting text |
| `CardContent` | `p-6 pt-0` | Body region |
| `CardFooter` | `flex items-center p-6 pt-0` | Footer/action row |

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional classes merged with the component defaults |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded DOM ref |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Native div attributes, including `id`, `data-*`, and event handlers |

## Variants, states, and behavior

Card has no built-in variants, interactive states, loading state, or responsive behavior. The base surface always uses the same border, card background, foreground, rounded corner, and shadow classes.

- Omit any region that is not needed; a card may contain only `CardContent`, for example.
- `CardContent` and `CardFooter` intentionally remove the top padding (`pt-0`) to connect them to a preceding header/content region. Override spacing with `className` when a standalone region needs top padding.
- Use layout utilities such as `justify-between`, `gap-*`, or grid classes on `CardFooter` and content as needed.
- The primitive forwards arbitrary HTML attributes and does not impose a click handler or keyboard interaction.

## Accessibility

- `Card` is a `<div>` with no landmark or widget role by default. Do not add `role="button"` unless you also implement complete keyboard and interaction behavior.
- `CardTitle` renders a `<div>`, not an `h1`–`h6`. Preserve the page heading hierarchy by providing heading semantics in the composition when the title identifies a section.
- Keep the title and description concise and use them to establish the card's accessible context.
- Put actions in real `<button>` or `<a>` elements (for example, `Button` with `asChild`) rather than making the entire card an unlabeled clickable surface.
- Ensure text and controls maintain sufficient contrast against `bg-card`.

## Relevant tokens

`bg-card`, `text-card-foreground`, `border`, `rounded-xl`, `shadow`, `p-6`, `text-muted-foreground`, `font-semibold`, `tracking-tight`

## Import & usage

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/os-portfolio-ds/components/ui/card';
import { Button } from '@workspace/os-portfolio-ds/components/ui/button';

<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Weekly report</CardTitle>
    <CardDescription>Activity across your workspace.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>24 projects are currently on track.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View report</Button>
  </CardFooter>
</Card>
```

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use a card to keep related content and its actions together. | Don’t use a card as a substitute for a dialog, alert, or disclosure component. |
| Use the provided regions for consistent spacing, then customize with `className` for the composition. | Don’t make the entire presentational `<div>` clickable without implementing keyboard access and an accessible name. |
| Use real headings and native interactive controls inside the card. | Don’t nest unrelated controls or multiple unrelated tasks in one card. |