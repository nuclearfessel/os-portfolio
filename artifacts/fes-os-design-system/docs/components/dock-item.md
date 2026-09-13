# Dock item

Use `DockItem` for application navigation in desktop, tablet, and mobile workspaces. Pair it with `DockItemLabel` so label presentation follows the current interaction model.

## Label presentations

- `tooltip`: desktop-only hover and focus label. Uses the shared Tooltip surface, spacing, type, border, radius, and shadow.
- `inline`: always-visible mobile and tablet label. It has no tooltip background, border, shadow, or extra padding.

Never apply the tooltip presentation to responsive inline labels. The shadow and surface treatment create a colored halo when the label is rendered as transparent text.