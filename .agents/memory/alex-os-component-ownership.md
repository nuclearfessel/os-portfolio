---
name: Alex OS component ownership
description: Approved boundary between shared visual components and portfolio-specific desktop behavior.
---

Shared visual primitives and structural surfaces belong to the Alex OS Design System package and should be consumed directly by the portfolio. Product-specific behavior—dragging, resizing, persistence, keyboard control, window focus, and responsive workspace state—stays in the portfolio.

**Why:** The user approved the source-backed pilot and its direct-consumption approach on September 13, 2026. This keeps the style guide authoritative without forcing application behavior into generic components.

**How to apply:** Add or change reusable appearance and semantic structure in the design system first, document it in the living guide, then consume it from the portfolio while preserving its existing handlers, ARIA contracts, and state ownership.