---
name: Fes OS component ownership
description: Approved boundary between shared visual components and portfolio-specific desktop behavior.
---

Shared visual primitives and structural surfaces belong to the Fes OS Design System package and should be consumed directly by the portfolio. Product-specific behavior—dragging, resizing, persistence, keyboard control, window focus, and responsive workspace state—stays in the portfolio.

**Why:** The user approved the source-backed pilot and its direct-consumption approach on September 13, 2026. This keeps the style guide authoritative without forcing application behavior into generic components.

**How to apply:** Add or change reusable appearance and semantic structure in the design system first. Every shipped component or pattern must include a spec, usage guidelines, inventory entry, and preview link. Then consume it from the portfolio while preserving its existing handlers, ARIA contracts, and state ownership.

The living documentation browser must consume the design system it describes. Its public navigation is portfolio-scoped: surface only foundations, components, and patterns used by the portfolio; keep other documented entries registered but hidden.

**Why:** The user requires the documentation to demonstrate the same visual language and interactions as the portfolio, without presenting unused catalog items as part of the public system.

Determine public usage semantically from rendered portfolio behavior, including local wrappers and composed implementations—not only direct package imports. Used primitives need individual pages as well as references in applicable pattern pages.

Keep the 18 Fes OS and Settings primitive details accessible through one compact “Fes OS primitives” directory entry; do not flatten all detail links into the sidebar.