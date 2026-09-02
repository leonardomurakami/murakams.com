## 1. Project foundation

- [x] 1.1 Initialize Next.js (App Router) + React + TypeScript project in the repo, with Tailwind CSS configured
- [x] 1.2 Add Motion as a dependency and configure base tooling (lint, format, typecheck, build scripts)
- [x] 1.3 Establish the repository layout from design.md (`src/app`, `src/components`, `src/design`, `src/content/*`, `src/features/*`, `src/infra/*`)
- [x] 1.4 Set up site-wide metadata baseline (title template, description, Open Graph defaults, favicon, robots)

## 2. Design system

- [x] 2.1 Define typed design tokens (typography scale, spacing, container widths, color, radius, border, shadow, motion durations/easings) in `src/design`
- [x] 2.2 Map tokens into Tailwind theme config so utilities are token-backed; forbid ad-hoc literals by convention
- [x] 2.3 Implement the neutral base palette with a single restrained accent and bounded monospace usage for technical metadata only
- [x] 2.4 Implement dark mode via token inversion, pre-paint theme class to avoid flash, default to `prefers-color-scheme`, and persist explicit overrides
- [x] 2.5 Build a small set of shared primitives (container, section, heading, prose, link, status label) consuming the tokens

## 3. Site shell, navigation, and cross-cutting baselines

- [x] 3.1 Build the responsive site shell and layout with a defined max container width and no edge-to-edge stretching on wide viewports
- [x] 3.2 Build primary navigation for `/`, `/projects`, `/infra`, `/playground`, `/resume`, `/contact` with current-section indication and keyboard/touch operability
- [x] 3.3 Implement the mobile navigation pattern (collapsed menu) with visible focus indicators
- [x] 3.4 Build motion primitives that centralize `prefers-reduced-motion` handling and simplify/disable non-essential motion
- [x] 3.5 Implement an on-brand not-found page that offers navigation back to primary sections
- [x] 3.6 Verify accessibility baseline: semantic HTML, keyboard operability, visible focus, WCAG AA body-text contrast, text alternatives for non-decorative images
- [x] 3.7 Verify SEO baseline: per-route unique title/description and crawlable server-rendered HTML for primary routes without JS

## 4. Home

- [x] 4.1 Build the homepage introduction and current SRE/engineering focus within the first viewport
- [x] 4.2 Build the selected projects preview that links to `/projects` and individual `/projects/[slug]` pages
- [x] 4.3 Build the small public infrastructure status preview that links to `/infra`
- [x] 4.4 Add clear paths from the homepage to `/projects`, `/infra`, `/playground`, `/resume`, and `/contact`

## 5. Projects

- [x] 5.1 Define the typed project content model (title, short description, status, technologies, visual material, problem, architecture, implementation, challenges, trade-offs, links) with build-time schema validation
- [x] 5.2 Author one fully populated representative project that exercises the full content model
- [x] 5.3 Build the `/projects` index presenting projects as engineering work (not repo cards), with status and technologies, linking to detail pages
- [x] 5.4 Build the `/projects/[slug]` detail case-study page rendering all model sections, with `generateStaticParams` and an on-brand not-found for unknown slugs
- [x] 5.5 Implement consistent project status representation (active/maintenance/completed/archived) across index and detail
- [x] 5.6 Add shared-layout project transitions and expanding content motion via Motion primitives, respecting reduced-motion

## 6. Infrastructure status (mocked, sanitized)

- [x] 6.1 Define the typed public infrastructure schema (applications, workloads, services, desired/ready replicas, healthy/unhealthy/degraded, ArgoCD sync state, app health, high-level uptime/status) in `src/infra/public-schema.ts`
- [x] 6.2 Define the collector contract (shape emitted into the sanitizer) in `src/infra/collector-contract.ts`, independent of the web framework
- [x] 6.3 Implement the sanitizer as a default-deny allowlist projection from the collector contract to the public schema in `src/infra/sanitizer.ts`
- [x] 6.4 Add build-time tests asserting every public-schema field is allowlisted, and that Secrets/IPs/node names/private hostnames/raw API responses are stripped
- [x] 6.5 Author realistic mocked sanitized fixtures conforming to the public schema in `src/infra/fixtures`
- [x] 6.6 Implement the portfolio API/cache layer with a fallback-to-last-known/degraded-state interface, backed by fixtures in this phase
- [x] 6.7 Build the custom `/infra` UI communicating a real live system in plain terms understandable to non-Kubernetes visitors (not an ArgoCD clone)
- [x] 6.8 Add subtle state-change animation for health/sync transitions, respecting `prefers-reduced-motion`
- [x] 6.9 Document that ArgoCD is never exposed and that live collection is a subsequent phase wired behind the sanitizer

## 7. Playground

- [x] 7.1 Define the typed playground registry model with delivery modes (in-app, iframe, fullscreen, external) and external URL support
- [x] 7.2 Seed the registry with representative entries covering each delivery mode
- [x] 7.3 Build the `/playground` index as the discovery/catalog layer, coherent with the primary design system
- [x] 7.4 Implement per-delivery-mode rendering: in-app, iframe embed, fullscreen, and external link/embed (no bundling of external experiments)

## 8. Resume

- [x] 8.1 Define the typed resume data model (company, role, time period, progression, responsibilities, engineering work, measurable impact, technologies) with build-time schema validation
- [x] 8.2 Author populated resume data representing chronological career progression
- [x] 8.3 Build the `/resume` chronological career/story presentation that surfaces impact and engineering work as first-class content
- [x] 8.4 Add timeline interaction motion via Motion primitives, respecting reduced-motion

## 9. Contact

- [x] 9.1 Build the `/contact` page with a `mailto:` link as the primary interaction (no backend/form service)
- [x] 9.2 Add optional social/professional links opening external profiles
- [x] 9.3 Confirm no database, auth, or backend service is introduced solely for contact

## 10. Verification and acceptance

- [x] 10.1 Run typecheck, lint, and build cleanly across the project
- [x] 10.2 Verify all primary routes render server-side content without JS and have unique metadata
- [x] 10.3 Verify accessibility baseline (keyboard, focus, contrast, image alternatives) across pages
- [x] 10.4 Verify `prefers-reduced-motion` disables/simplifies non-essential motion across home, projects, infra, and resume
- [x] 10.5 Verify the infrastructure sanitizer tests pass and no sensitive fields appear in the public model
- [x] 10.6 Verify responsive behavior from mobile to wide desktop with no horizontal scrolling at standard widths
- [x] 10.7 Verify dark mode: no flash on first load, persisted override, system preference respected
