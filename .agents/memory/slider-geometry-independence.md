---
name: Slider geometry independence
description: Required invariant for slider track thickness and handle alignment.
---

Slider track thickness and handle alignment must be independent. The rail and handle must share an explicit centerline, so changing the rail thickness can never move the handle.

**Why:** The user explicitly established this as a permanent rule after native range rendering repeatedly shifted the handle when the track changed to 4px.

**How to apply:** Keep visual rail and handle geometry separate from the interaction layer. Center both within a stable hit area and verify their computed centers whenever slider dimensions change.