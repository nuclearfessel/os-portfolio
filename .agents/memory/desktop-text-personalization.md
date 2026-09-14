---
name: Desktop text personalization
description: Theme ownership for editable desktop display copy and its colors.
---

Desktop text personalization keeps the three text values shared across themes, while each element has an independent light-theme and dark-theme color.

**Why:** Background images and solid backgrounds can have very different values in light and dark themes, so one text color cannot guarantee readable or intentional contrast in both.

**How to apply:** Persist shared copy and per-theme colors. Edit the active theme's color through the shared color picker in a named floating modal dialog with a transparent overlay, without changing the other theme. Warning dialogs retain their scrims. Match the three-effect-slider layout: three equal columns at a `620px` Settings-container width, then one item per row below it.