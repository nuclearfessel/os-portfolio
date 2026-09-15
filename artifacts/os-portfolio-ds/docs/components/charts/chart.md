# Chart

**Source:** `src/components/ui/chart.tsx`
**Exports:** `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`
**Export path:** `@workspace/os-portfolio-ds/components/ui/chart`
**Preview page:** `chart`

---

## Purpose

A configured Recharts wrapper that applies the design system's semantic color tokens (`chart-1` through `chart-5`) to data series, tooltips, and legends. Both light and dark themes are handled via `ChartStyle`.

---

## ChartConfig

Each series gets a `label` and either a direct `color` or a `theme` object mapping light/dark CSS selectors to colors.

```ts
const chartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
  expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
};
```

---

## Anatomy

```
<ChartContainer config={chartConfig} className="aspect-video">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" />
    <Bar dataKey="expenses" fill="var(--color-expenses)" />
  </BarChart>
</ChartContainer>
```

`ChartStyle` injects `--color-<key>` CSS variables into the chart's DOM scope, derived from `chartConfig`. Use `var(--color-<key>)` in Recharts fill/stroke props.

---

## Props — ChartContainer

| Prop | Type | Description |
|---|---|---|
| `config` | `ChartConfig` | Series labels, colors, and theme maps |
| `children` | Recharts `ResponsiveContainer` children | Chart markup |
| `id` | `string` | Optional stable ID; auto-generated if omitted |
| `className` | `string` | Sizing and layout — `aspect-video` is the default convention |

---

## Chart tokens

| Token | Light | Dark | Series |
|---|---|---|---|
| `chart-1` | `#0b665d` | `#e4ff5b` | 1st series |
| `chart-2` | `#c54f48` | `#ff8d79` | 2nd series |
| `chart-3` | `#287f8f` | `#86d9ee` | 3rd series |
| `chart-4` | `#6f5ca8` | `#b996ed` | 4th series |
| `chart-5` | `#b77824` | `#f5b85c` | 5th series |

---

## Accessibility

- SVG charts have no built-in ARIA semantics. Supplement with:
  - A visible `<caption>` or heading describing the chart's content.
  - An accessible table of the underlying data (can be visually hidden with `sr-only`).
  - `role="img"` + `aria-label` on the chart container as a fallback.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `hsl(var(--chart-N))` or `var(--color-<key>)` for series colors | Hardcode hex values in chart fills |
| Provide a `ChartTooltipContent` for hover details | Leave charts with no tooltip |
| Include a text summary or data table alongside the chart | Rely on the chart alone to communicate data |
