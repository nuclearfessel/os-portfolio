---
name: Guide documentation spacing
description: Layout guidance for the OS Portfolio User Guide and future documentation-heavy windows.
---

The User Guide should use generous outer gutters, a readable single-column flow, indexed rows, and spacious callout panels. Use color as a small structural accent rather than filling every surface.

**Why:** Compact multi-column cards made the documentation feel congested even when the amount of copy was reasonable.

**How to apply:** Prefer the site's editorial Work/About patterns and design-system flat surfaces. Keep explanatory content stacked with breathing room; reserve color for section markers, indexed edges, and occasional callouts.

Single-column documentation in the design-system site must use the full available main-content width. Only explicit multi-column grids and bounded component specimens should constrain their contents.

**Why:** A global page-width cap made sections such as Exclusions wrap as though they occupied one half of a two-column layout.

**How to apply:** Keep the design-system page shell and shared Markdown blocks uncapped. Apply width limits locally only when a demo, form, dialog, readable intro measure, or deliberate grid requires one.

Every surfaced component and pattern page needs a complete reference, but must not surface a token section. Token documentation belongs on the foundation token pages.

**Why:** Family excerpts left many component pages less useful than Buttons, while repeating token inventories across component and pattern pages added unnecessary detail.

**How to apply:** Surface dedicated references covering purpose, anatomy, behavior, states, accessibility, usage, and Do/Don’t. Suppress Tokens and Tokens / contracts sections outside foundations.

Every design-system specimen must visibly identify its variant and state. Interactive specimens must demonstrate real state changes; static references must be explicitly labeled and non-operable.

**Why:** Unlabeled examples forced readers to infer states such as disabled, selected, or active, while inert controls could look interactive.

**How to apply:** Use concise `variant · state` captions that stay truthful after interaction. Add controlled behavior where applicable; do not invent hover or pressed behavior for static primitives.

Guide instructions should use plain language and break each topic into short, specific actions. Explain necessary technical terms where they appear instead of assuming the reader already knows them.

**Why:** The user wants the Guide to offer more detail without becoming jargon-heavy or difficult to scan.

**How to apply:** Use clear section names, one action or idea per indexed row, and short paragraphs. Describe what the person does and sees before explaining implementation details.

Every Guide page should pair its main instructions with a cropped or abstracted view of the interface. These teaching visuals must adapt to both light and dark themes and use the design system’s semantic tokens.

**Why:** The user wants the Guide to explain actions and processes visually, not rely on text alone.

**How to apply:** Show the relevant control, state, or sequence near its instructions. Label important parts directly, keep diagrams compact, and use real product behavior and positioning options.

Guide illustration annotations must remain contained and readable when the Guide window is resized. Use labels in normal layout flow instead of placing descriptive text over the interface crop.

**Why:** Free-floating labels overlapped controls, collided with each other, and escaped the page at narrow Guide widths.

**How to apply:** Put small markers on the illustrated elements and map them to a wrapping legend below the crop. Test the actual window resize handle and verify label containment and non-overlap below 500px.