"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const tooltipSurfaceClassName =
  "box-border w-max max-w-none overflow-visible whitespace-nowrap rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--popover))] px-3 py-[5px] font-mono text-[10px] leading-[1.2] text-[hsl(var(--popover-foreground))] shadow-[0_5px_16px_rgba(0,0,0,0.24)]"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      data-slot="tooltip-content"
      className={cn(
        "z-50 animate-in fade-in-0 duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 origin-[--radix-tooltip-content-transform-origin]",
        tooltipSurfaceClassName,
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, tooltipSurfaceClassName }
