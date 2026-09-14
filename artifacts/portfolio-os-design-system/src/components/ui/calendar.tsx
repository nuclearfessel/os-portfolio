"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button, buttonVariants } from "./button"

/**
 * Calendar — Portfolio OS Design System
 *
 * Key geometry decisions:
 * - Cell size: 44px (--rdp-day-width/height overridden on root)
 * - Day button fills 40×40px inside the 44px cell (2px inset each side)
 * - Border-radius: rounded-md (not 100% circle) via --rdp-day_button-border-radius
 * - month_grid uses table layout; each td has a fixed w-11 (44px) so the
 *   grid is always exactly 7×44px = 308px wide — no collapse.
 * - weekday headers match the same 44px column width
 * - Total calendar width: 308px + 32px padding = ~340px — a proper card
 */

const CELL = 44   // px — single source of truth for column width
const BTN  = 40   // px — button inset inside cell (2px gap each side)

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Geometry root — set all rdp CSS variables here so they cascade
        // to every descendant including .rdp-day and .rdp-day_button
        "group/calendar",
        // The calendar itself is always ~340px — a deliberate widget, not a
        // collapsed mini-widget. w-fit is kept so it doesn't stretch, but the
        // 7-column grid enforces the minimum width internally.
        "w-fit overflow-hidden rounded-[inherit]",
        // Outer padding: generous breathing room
        "p-4",
        // Bg
        "bg-background",
        // Transparent inside card/popover
        "[[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        // RTL chevron flip
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      style={{
        // Override rdp CSS variables at the root so they propagate through
        // the rdp-* classes in the base stylesheet
        "--rdp-day-width":                  `${CELL}px`,
        "--rdp-day-height":                 `${CELL}px`,
        "--rdp-day_button-width":           `${BTN}px`,
        "--rdp-day_button-height":          `${BTN}px`,
        "--rdp-day_button-border-radius":   "0.375rem", // rounded-md
        "--rdp-nav_button-width":           `${CELL}px`,
        "--rdp-nav_button-height":          `${CELL}px`,
        "--rdp-nav-height":                 `${CELL}px`,
        // Disable accent color so our Tailwind classes win cleanly
        "--rdp-accent-color":               "transparent",
        "--rdp-accent-background-color":    "transparent",
        "--rdp-today-color":                "inherit",
        "--rdp-selected-border":            "none",
        "--rdp-range_middle-background-color": "transparent",
        "--rdp-range_start-background":     "none",
        "--rdp-range_end-background":       "none",
      } as React.CSSProperties}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),

        months: cn(
          "relative flex flex-col gap-6 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn(
          "flex flex-col gap-4",
          defaultClassNames.month,
        ),

        // ── Navigation ───────────────────────────────────────────────────────
        nav: cn(
          // Absolute overlay sitting in front of the month_caption
          "absolute inset-x-0 top-0 z-10",
          "flex items-center justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          // Exact cell-size square so it aligns with day columns
          "size-11 shrink-0 select-none p-0",
          "aria-disabled:opacity-40",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-11 shrink-0 select-none p-0",
          "aria-disabled:opacity-40",
          defaultClassNames.button_next,
        ),

        // ── Caption (month + year label) ─────────────────────────────────────
        month_caption: cn(
          // Same height as nav buttons so prev/next align vertically
          "flex h-11 items-center justify-center",
          // Horizontal padding = one cell width each side (for prev/next buttons)
          "px-11",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-11 items-center justify-center gap-2 text-sm font-semibold",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50",
          "has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none text-sm font-semibold tracking-tight",
          captionLayout !== "label" &&
            "[&>svg]:text-muted-foreground flex items-center gap-1 rounded-md pl-2 pr-1 [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),

        // ── Grid ─────────────────────────────────────────────────────────────
        // border-collapse + fixed layout: each td will be exactly 44px
        month_grid: "w-full border-collapse",

        // ── Weekday header row ────────────────────────────────────────────────
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          // Fixed 44px width matching the day columns — no flex:1 collapse
          "w-11 h-9",
          "flex items-end justify-center",
          "pb-2",
          "select-none text-center text-xs font-medium text-muted-foreground",
          defaultClassNames.weekday,
        ),

        // ── Week rows ─────────────────────────────────────────────────────────
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-11 select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.7rem]",
          defaultClassNames.week_number,
        ),

        // ── Day cell (the <td>) ───────────────────────────────────────────────
        // Fixed 44×44px so the 7-column grid is always 308px wide regardless
        // of the w-fit root. Range stripe backgrounds live on this td.
        day: cn(
          "relative flex size-11 shrink-0 select-none items-center justify-center p-0 text-center",
          defaultClassNames.day,
        ),

        // Range band: a centered 40px strip behind identical 40px endpoint
        // buttons. Keeping the band off the cell background prevents the
        // 44px cell box from making either terminal appear larger.
        range_start: cn(
          "relative bg-transparent",
          "after:pointer-events-none after:absolute after:left-1/2 after:right-0 after:top-1/2 after:z-0 after:h-10 after:-translate-y-1/2 after:bg-primary/10",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          "relative bg-transparent",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:z-0 before:h-10 before:-translate-y-1/2 before:bg-primary/10",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          "relative bg-transparent",
          "before:pointer-events-none before:absolute before:left-0 before:right-1/2 before:top-1/2 before:z-0 before:h-10 before:-translate-y-1/2 before:bg-primary/10",
          defaultClassNames.range_end,
        ),

        // Today ring: 1px inset ring so it's visible under any button state
        today: cn(
          "ring-1 ring-inset ring-primary/50 rounded-md",
          defaultClassNames.today,
        ),

        // Outside-month days: dim, still legible
        outside: cn(
          "opacity-35",
          "aria-selected:opacity-60",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "opacity-30 cursor-not-allowed pointer-events-none",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: cn2, rootRef, ...p }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(cn2)} {...p} />
        ),

        Chevron: ({ className: cn2, orientation, ...p }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className={cn("size-4", cn2)} {...p} />
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4", cn2)} {...p} />
          return <ChevronDownIcon className={cn("size-4", cn2)} {...p} />
        },

        DayButton: CalendarDayButton,

        WeekNumber: ({ children, ...p }) => (
          <td {...p}>
            <div className="flex size-11 items-center justify-center text-center text-[0.7rem] text-muted-foreground">
              {children}
            </div>
          </td>
        ),

        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      disabled={modifiers.disabled}
      aria-disabled={modifiers.disabled || undefined}
      aria-pressed={modifiers.selected || undefined}
      className={cn(
        // ── Explicit size: 40×40px, centered in the 44px td via auto margins ─
        "relative z-10 m-0 size-10",
        "flex items-center justify-center",
        // ── Override rdp's circle border-radius with our rounded-md ──────────
        "!rounded-md",
        "text-sm font-normal leading-none",
        "border-0 bg-transparent",
        // Transitions
        "transition-colors duration-100 motion-reduce:transition-none",
        "cursor-pointer disabled:cursor-not-allowed",

        // ── Hover (default) ────────────────────────────────────────────────
        "hover:bg-secondary hover:text-secondary-foreground",

        // ── Focus ring ────────────────────────────────────────────────────
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",

        // ── Selected single: full rounded-square primary fill ─────────────
        isSelectedSingle && [
          "!bg-primary !text-primary-foreground font-semibold",
          "hover:!bg-primary hover:!text-primary-foreground",
        ],

        // ── Range terminals: identical 40px rounded squares ───────────────
        modifiers.range_start && !modifiers.range_end && [
          "!bg-primary !text-primary-foreground font-semibold",
          "!rounded-md",
          "hover:!bg-primary hover:!text-primary-foreground",
        ],

        modifiers.range_end && !modifiers.range_start && [
          "!bg-primary !text-primary-foreground font-semibold",
          "!rounded-md",
          "hover:!bg-primary hover:!text-primary-foreground",
        ],

        // ── Range start = end (single day range): full rounded ────────────
        modifiers.range_start && modifiers.range_end && [
          "!bg-primary !text-primary-foreground font-semibold !rounded-md",
        ],

        // ── Range middle: no fill (stripe on <td>), no radius ────────────
        modifiers.range_middle && !modifiers.range_start && !modifiers.range_end && [
          "!rounded-none !bg-transparent text-foreground",
          "hover:!bg-primary/20",
        ],

        // ── Disabled ──────────────────────────────────────────────────────
        modifiers.disabled && "opacity-30 pointer-events-none",

        // ── rdp focus helper ──────────────────────────────────────────────
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",

        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
