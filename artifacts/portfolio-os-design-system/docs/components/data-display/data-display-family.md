# Data Display — Family Reference

**Preview pages:** `avatar`, `badge`, `card`, `table`, `accordion`, `collapsible`, `carousel`, `item`, `empty`, `kbd`, `aspect-ratio`

---

## Avatar

**Source:** `src/components/ui/avatar.tsx` · **Preview:** `avatar`
**Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`

Profile image with image fallback text. Built on `@radix-ui/react-avatar`.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/portfolio-os-design-system/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="John Doe" />
  <AvatarFallback>FN</AvatarFallback>
</Avatar>
```

Size via `className` — `size-10`, `size-8`, `size-12`. `AvatarFallback` shows while the image loads or if it errors. Always supply `alt` on `AvatarImage`.

---

## Badge

**Source:** `src/components/ui/badge.tsx` · **Preview:** `badge`
**Exports:** `Badge`, `badgeVariants`

Compact status and category labels. Never wraps (`whitespace-nowrap`).

| Variant | Appearance | Use |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | Active / primary status |
| `secondary` | `bg-secondary text-secondary-foreground` | Neutral tag |
| `destructive` | `bg-destructive text-destructive-foreground` | Error or warning tag |
| `outline` | `border text-foreground` | Subtle tag on card backgrounds |

```tsx
import { Badge } from '@workspace/portfolio-os-design-system/components/ui/badge';

<Badge>Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">2024</Badge>
```

---

## Card

**Source:** `src/components/ui/card.tsx` · **Preview:** `card`
**Exports:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

Grouped content container with optional header, body, and footer.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@workspace/portfolio-os-design-system/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project title</CardTitle>
    <CardDescription>A short description of the project.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* main content */}
  </CardContent>
  <CardFooter className="justify-between">
    <Badge>2024</Badge>
    <Button size="sm">View</Button>
  </CardFooter>
</Card>
```

Tokens: `bg-card`, `text-card-foreground`, `border`, `rounded-xl`, `shadow`.

---

## Table

**Source:** `src/components/ui/table.tsx` · **Preview:** `table`
**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`

Structured tabular data.

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@workspace/portfolio-os-design-system/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Fieldnote Collaboration Kit</TableCell>
      <TableCell><Badge>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Accordion

**Source:** `src/components/ui/accordion.tsx` · **Preview:** `accordion`
**Exports:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

Expandable sections for progressive disclosure. Built on `@radix-ui/react-accordion`.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@workspace/portfolio-os-design-system/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Portfolio OS?</AccordionTrigger>
    <AccordionContent>A desktop-style portfolio experience…</AccordionContent>
  </AccordionItem>
</Accordion>
```

`type`: `'single'` (one open at a time) | `'multiple'`.
Keyboard: Enter/Space to toggle, Arrow keys to navigate.

---

## Collapsible

**Source:** `src/components/ui/collapsible.tsx` · **Preview:** `collapsible`
**Exports:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`

Compact single expandable region. Built on `@radix-ui/react-collapsible`.

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@workspace/portfolio-os-design-system/components/ui/collapsible';

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="outline">Toggle section</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p className="text-sm text-muted-foreground">Hidden content…</p>
  </CollapsibleContent>
</Collapsible>
```

---

## Carousel

**Source:** `src/components/ui/carousel.tsx` · **Preview:** `carousel`
**Exports:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `useCarousel`

Keyboard-accessible paged content. Built on `embla-carousel-react`.

```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@workspace/portfolio-os-design-system/components/ui/carousel';

<Carousel opts={{ align: 'start' }}>
  <CarouselContent>
    <CarouselItem className="basis-1/3"><Card>Slide 1</Card></CarouselItem>
    <CarouselItem className="basis-1/3"><Card>Slide 2</Card></CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

## Item / ItemGroup

**Source:** `src/components/ui/item.tsx` · **Preview:** `item`
**Exports:** `Item`, `ItemGroup`, `ItemSeparator`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`

Flexible list row with media, content, and action slots. Use for project lists, activity feeds, search results.

| Variant | Appearance |
|---|---|
| `default` | Transparent background |
| `outline` | `border-border` border |
| `muted` | `bg-muted/50` background |

| Size | Padding / gap |
|---|---|
| `default` | `gap-4 p-4` |
| `sm` | `gap-2.5 px-4 py-3` |

```tsx
import { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@workspace/portfolio-os-design-system/components/ui/item';

<ItemGroup>
  <Item variant="outline">
    <ItemMedia variant="icon"><FolderIcon /></ItemMedia>
    <ItemContent>
      <ItemTitle>Mosaic Health Toolkit</ItemTitle>
      <ItemDescription>An accessible toolkit for clear, reassuring health journeys.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button variant="ghost" size="icon" aria-label="Open"><ChevronRightIcon /></Button>
    </ItemActions>
  </Item>
</ItemGroup>
```

`ItemMedia.variant`: `'default'` | `'icon'` (8×8 icon box with border) | `'image'` (10×10 cover image)
`asChild`: Item supports `asChild` to render as a link or other element.

---

## Empty

**Source:** `src/components/ui/empty.tsx` · **Preview:** `empty`

Empty state with guidance and optional action.

```tsx
import { Empty } from '@workspace/portfolio-os-design-system/components/ui/empty';

<Empty
  icon={<FolderOpenIcon className="size-8" />}
  title="No projects yet"
  description="Add your first project to get started."
  action={<Button>Add project</Button>}
/>
```

---

## Kbd / KbdGroup

**Source:** `src/components/ui/kbd.tsx` · **Preview:** `kbd`
**Exports:** `Kbd`, `KbdGroup`

Individual and grouped keyboard shortcuts.

```tsx
import { Kbd, KbdGroup } from '@workspace/portfolio-os-design-system/components/ui/kbd';

<Kbd>⌘</Kbd>
<Kbd>K</Kbd>

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>Shift</Kbd>
  <Kbd>P</Kbd>
</KbdGroup>
```

Tokens: `bg-muted`, `text-muted-foreground`, `rounded-sm`.
Inside tooltips: inverted colors (`bg-background/20 text-background`).

---

## AspectRatio

**Source:** `src/components/ui/aspect-ratio.tsx` · **Preview:** `aspect-ratio`

Responsive proportional container. Built on `@radix-ui/react-aspect-ratio`.

```tsx
import { AspectRatio } from '@workspace/portfolio-os-design-system/components/ui/aspect-ratio';

<AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
  <img src="/project-screenshot.jpg" alt="Project screenshot" className="w-full h-full object-cover" />
</AspectRatio>
```
