---
name: Guide documentation spacing
description: Layout guidance for the OS Portfolio User Guide and future documentation-heavy windows.
---

The User Guide should use generous outer gutters, a readable single-column flow, indexed rows, and spacious callout panels. Use color as a small structural accent rather than filling every surface.

**Why:** Compact multi-column cards made the documentation feel congested even when the amount of copy was reasonable.

**How to apply:** Prefer the site's editorial Work/About patterns and design-system flat surfaces. Keep explanatory content stacked with breathing room; reserve color for section markers, indexed edges, and occasional callouts.

Guide instructions should use plain language and break each topic into short, specific actions. Explain necessary technical terms where they appear instead of assuming the reader already knows them.

**Why:** The user wants the Guide to offer more detail without becoming jargon-heavy or difficult to scan.

**How to apply:** Use clear section names, one action or idea per indexed row, and short paragraphs. Describe what the person does and sees before explaining implementation details.

Every Guide page should pair its main instructions with a cropped or abstracted view of the interface. These teaching visuals must adapt to both light and dark themes and use the design system’s semantic tokens.

**Why:** The user wants the Guide to explain actions and processes visually, not rely on text alone.

**How to apply:** Show the relevant control, state, or sequence near its instructions. Label important parts directly, keep diagrams compact, and use real product behavior and positioning options.

Guide illustration annotations must remain contained and readable when the Guide window is resized. Use labels in normal layout flow instead of placing descriptive text over the interface crop.

**Why:** Free-floating labels overlapped controls, collided with each other, and escaped the page at narrow Guide widths.

**How to apply:** Put small markers on the illustrated elements and map them to a wrapping legend below the crop. Test the actual window resize handle and verify label containment and non-overlap below 500px.