# OS Portfolio foundations and patterns

## Themes

Light and dark are equal system themes. Both expose the same semantic roles for backgrounds, surfaces, text, borders, actions, focus, danger, navigation, and charts. Components must be reviewed in both.

## Color

- Use `primary` for the active system accent and primary action.
- Use `accent` sparingly for secondary emphasis.
- Use semantic surface and foreground pairs rather than raw colors.
- Keep focus rings visible and distinct from borders.

## Typography

- Space Grotesk carries display, body, and interface copy.
- DM Mono carries system status, metadata, keyboard commands, labels, and compact numeric details.
- Use compact uppercase mono labels to orient, not for paragraphs.

## Motion

- Hover and focus feedback: 100ms.
- Entry transitions: approximately 160ms ease-out.
- Theme icon morphs: 240–340ms using crossfade, rotation, and scale.
- Pointer-controlled movement is direct and has no easing.
- Honor reduced-motion preferences for nonessential transitions.

## Iconography

- Use `@keyline-icons/react` when a matching icon exists.
- Default stroke width is 1.7–1.8.
- Pair unfamiliar icons with text or accessible labels.
- Keep state-changing icons inside a fixed footprint.

## Responsive composition

- Desktop is freeform and user-arranged.
- Tablet and mobile geometry is managed and temporary.
- Responsive reflow must never overwrite desktop geometry.
- Mobile navigation remains fixed at the bottom with visible labels.
- Every resizable window with side navigation must respond to its own container width. At narrow widths, the side navigation smoothly becomes a horizontal sub-navigation toolbar directly below the window toolbar, preserving item order, active state, keyboard order, and a separate content row.

## Accessibility

- Target WCAG 2.2 Level AA; this is an implementation target, not a certification claim.
- Normal text targets 4.5:1 contrast and large text targets 3:1 in both themes.
- Use native interactive elements and preserve a visible keyboard focus treatment.
- Icon-only controls require accessible names; decorative icons are hidden from assistive technology.
- Express toggle and selection state through semantic ARIA attributes, never color alone.
- Use live status regions for important asynchronous recovery messages.
- Require confirmation for destructive actions that remove persisted user data.
- Honor reduced-motion preferences for nonessential animation.
- Provide managed-layout or keyboard alternatives to pointer-only desktop manipulation.