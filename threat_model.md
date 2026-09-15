# Threat Model

## Project Overview

OS Portfolio is a React/Vite static portfolio with browser-local workspace persistence and a shared React design-system package. A small Express service is configured under `/api`; its current production API exposes only a JSON health check and has no database-backed or user-account functionality. The design-system browser is a separate preview artifact, while the mockup sandbox is development-only. Deployment discovery for this scan found no active deployment, though configured production behavior remains in scope.

## Assets

- **Portfolio content and release integrity** — the public site and downloadable material represent the owner; injected content could misrepresent the owner or attack visitors.
- **Visitor browser context** — local desktop state includes user-authored sticky text and preferences. It is not server-synchronized, but must not become script or URL execution.
- **API/runtime integrity** — the Express process and its environment must not expose filesystem data, environment secrets, or privileged server capabilities.
- **Design-system consumers** — shared rendering primitives can become trust-boundary sinks when reused with application- or user-controlled values.

## Trust Boundaries

- **Browser to static application** — URL state, browser storage, and user-entered terminal/sticky content are untrusted. React rendering and explicit parsing must keep them as data rather than executable markup or navigation targets.
- **Browser to API** — `/api` is network-accessible when deployed. Every future non-public route must authenticate a trusted subject and authorize the exact object/action; the current `/api/healthz` response is intentionally public and contains only `{status: "ok"}`.
- **Application to browser storage** — localStorage is attacker-modifiable from the same browser context and must never be treated as trusted, despite being local to one origin/profile.
- **Consumer to shared design system** — component properties may eventually contain untrusted application data. Components using raw HTML or CSS construction require strict validation at that boundary.
- **Source/build to public bundles** — all Vite-delivered code and configuration is public; privileged credentials must remain server-side.

## Scan Anchors

- Production web entry points: `artifacts/os-portfolio/src/main.tsx`, `artifacts/os-portfolio/src/App.tsx`, and its static artifact production config.
- Production API entry points: `artifacts/api-server/src/index.ts`, `src/app.ts`, and `src/routes/`.
- Highest-risk client areas: localStorage parsing and sticky/terminal rendering in `App.tsx`; raw style generation in both packages' `components/ui/chart.tsx`.
- Public surfaces: portfolio static content and `/api/healthz`. There are currently no authenticated, admin, billing, upload, database, or user-account surfaces.
- Design-system preview is a separate artifact; `artifacts/mockup-sandbox` is development-only unless future production configuration proves otherwise. Generated `dist/` output should be traced back to source before reporting.

## Threat Categories

### Spoofing and Elevation of Privilege

There are currently no identities or privileged API actions. If account, admin, or private-data routes are added, the server must establish authentication and enforce subject/object/action/scope authorization on every route; browser-side checks are insufficient.

### Tampering

Browser storage and interactive text are attacker-controlled. Persisted structures must be allowlisted and bounded, and user strings must render as text. Shared components that synthesize CSS or raw HTML must validate or safely encode every interpolated selector, property name, and value before accepting untrusted consumer data.

### Information Disclosure

Public bundles must contain no privileged secrets. API logging must continue to omit credentials, cookies, query values, bodies, and sensitive response data. Future API reads must return only fields and records authorized for the caller.

### Denial of Service

The present health endpoint performs constant work and the static site has no server-side expensive operation. Future API body processing, uploads, searches, or external calls must enforce appropriate size, rate, and timeout limits before becoming publicly deployable.

### Injection

User-controlled text, storage values, URL fragments, and future request fields must not reach raw HTML/CSS, command execution, filesystem paths, database queries, or outbound URLs without context-appropriate validation. React text rendering and parameterized/scoped server operations should remain the default.
