---
name: Playwright WebKit on Replit
description: Safe runtime-library handling for downloaded Playwright WebKit binaries in a Replit Nix workspace.
---

Expose Nix compatibility libraries only inside the WebKit browser launcher. Resolve the specific libraries reported missing by `ldd`, preserve Playwright's bundled WebKit library directories, and use exact compatibility ABIs when the browser requires them.

**Why:** Playwright's bundled MiniBrowser wrapper replaces inherited `LD_LIBRARY_PATH`. Exporting the complete WebKitGTK closure globally makes Node or MiniBrowser load incompatible low-level Nix libraries and can abort with stack-smashing protection.

**How to apply:** Keep the compatibility launcher scoped to the WebKit Playwright project. After Playwright or the Nix channel changes, run its linker-validation mode and the WebKit recovery project before trusting the existing package set.