# Tabs

**Source:** `src/components/ui/tabs.tsx`  
**Export:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`  
**Export path:** `@workspace/os-portfolio-ds/components/ui/tabs`  
**Preview page:** `tabs`

---

## Purpose

Switch between related content views without leaving the current context. Tabs are for peer sections of content; each trigger maps to exactly one panel through its shared `value`.

## Anatomy

```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label="Project sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Project summary…</TabsContent>
  <TabsContent value="activity">Recent changes…</TabsContent>
</Tabs>
```

- `Tabs` owns selection and orientation.
- `TabsList` is the tablist container.
- `TabsTrigger` is a selectable tab; its `value` must match a `TabsContent` value.
- `TabsContent` is the associated panel and receives generated tab/tabpanel ARIA relationships from Radix.

## API

| Component | Important props | Description |
|---|---|---|
| `Tabs` | `defaultValue`, `value`, `onValueChange`, `orientation`, `activationMode`, `dir`, `loop` | Root state. `defaultValue` is uncontrolled; `value` + `onValueChange` is controlled. |
| `TabsList` | `loop`, `aria-label`, `className` | Tablist container; accepts Radix list props. |
| `TabsTrigger` | `value`, `disabled`, `textValue`, `className` | Selectable tab. `value` identifies its panel. |
| `TabsContent` | `value`, `forceMount`, `className` | Associated panel; `forceMount` keeps inactive content mounted. |

All wrappers forward refs and accept the corresponding Radix props. The component does not add a visual variant prop; customize with `className`.

## Variants, states, and behavior

- **Orientation:** horizontal is the default; set `orientation="vertical"` on `Tabs` for vertical tablists.
- **Activation:** automatic activation (default) selects a tab as focus moves; use `activationMode="manual"` to require `Enter` or `Space`.
- **Controlled/uncontrolled:** use `defaultValue` for initial selection or `value`/`onValueChange` for external state.
- **Active:** the trigger uses `data-state="active"`, `bg-background`, `text-foreground`, and a shadow.
- **Disabled:** a disabled trigger cannot be selected and renders with reduced opacity.
- **Panel mounting:** inactive panels are not mounted by default; set `forceMount` when preserving local state or measuring content is required.
- **Wrapping:** keyboard navigation wraps by default; set `loop={false}` to stop at the first or last tab.

## Accessibility and keyboard behavior

Radix renders the tab pattern with `role="tablist"`, `role="tab"` plus `aria-selected`, and `role="tabpanel"` plus the matching `aria-labelledby` relationship. Add an `aria-label` to `TabsList` when its purpose is not otherwise clear.

- `ArrowLeft`/`ArrowRight` move between horizontal tabs; `ArrowUp`/`ArrowDown` move between vertical tabs.
- `Home` and `End` move to the first and last enabled tabs.
- In automatic mode, focusing a tab activates it; in manual mode, press `Enter` or `Space` to activate.
- Disabled tabs are skipped. Do not put interactive controls inside a tab label.

## Relevant tokens

`bg-muted`, `text-muted-foreground`, `bg-background`, `text-foreground`, `ring`, `ring-offset-background`, `shadow`, `opacity-50`

## Import & usage

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/os-portfolio-ds/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList aria-label="Project sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="rounded-md border p-4">
    Project summary and recent milestones.
  </TabsContent>
  <TabsContent value="activity" className="rounded-md border p-4">
    Latest changes from your team.
  </TabsContent>
</Tabs>
```

## Do / Don't

- **Do** keep tab labels short, parallel, and mutually exclusive.
- **Do** preserve unsaved input when switching tabs, or warn before discarding it.
- **Don't** use tabs for a linear process; use a stepper or separate pages.
- **Don't** overload a tablist with many labels; use a different navigation pattern when scanning becomes difficult.