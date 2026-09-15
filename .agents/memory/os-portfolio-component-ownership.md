---
name: OS Portfolio component ownership
description: Approved boundary between shared visual components and portfolio-specific desktop behavior.
---

Shared visual primitives and structural surfaces belong to the OS Portfolio DS package and should be consumed directly by OS Portfolio. Product-specific behavior—dragging, resizing, persistence, keyboard control, window focus, and responsive workspace state—stays in the portfolio.

**Why:** The user approved the source-backed pilot and its direct-consumption approach on September 13, 2026. This keeps the style guide authoritative without forcing application behavior into generic components.

**How to apply:** Add or change reusable appearance and semantic structure in the design system first. Every shipped component or pattern must include a spec, usage guidelines, inventory entry, and preview link. Then consume it from the portfolio while preserving its existing handlers, ARIA contracts, and state ownership.

Package-level visual utilities are not automatically active in the portfolio because it does not load the design system's global stylesheet. Keep the canonical utility in the design system, but also apply the documented CSS behavior in the portfolio stylesheet unless the package CSS is intentionally imported later.

**Why:** A window-scrollbar utility existed correctly in the package but had no browser effect in the portfolio until the product stylesheet supplied the rules.

**How to apply:** When adding a global utility rather than an imported React component, verify its computed styles in the portfolio. For generated design-system CSS, edit the source template and regenerate; do not treat generated output as the only source.

The living documentation browser must consume the design system it describes. Its public navigation is portfolio-scoped: surface only foundations, components, and patterns used by the portfolio; keep other documented entries registered but hidden.

**Why:** The user requires the documentation to demonstrate the same visual language and interactions as the portfolio, without presenting unused catalog items as part of the public system.

Determine public usage semantically from rendered portfolio behavior, including local wrappers and composed implementations—not only direct package imports. Used primitives need individual pages as well as references in applicable pattern pages.

Keep the 18 OS Portfolio and Settings primitive details accessible through one compact “OS Portfolio primitives” directory entry under Patterns; do not flatten detail links into the sidebar. Detail pages must link back to the directory.