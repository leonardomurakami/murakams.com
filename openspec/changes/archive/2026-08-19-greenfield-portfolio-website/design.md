## Context

Greenfield build of `murakams.com`. See `proposal.md` for motivation and scope; see the delta specs under `specs/` for the behavior contract. This document covers how the system is structured and the key technical decisions. The current repo has no existing application code, no existing specs, and no design system to preserve — everything is new. The site is a modern TypeScript web app whose only expected dynamic data source in scope is the (mocked, sanitized) infrastructure status feed; everything else is static/server-rendered content.

## Goals / Non-Goals

**Goals:**
- Establish a repository layout where portfolio UI, project/resume content, playground registry, public infrastructure model, and infrastructure collector remain reasonably independent concerns.
- Make the interesting parts come from content, infrastructure integration, projects, and interaction design rather than application complexity.
- Establish the infrastructure sanitization boundary, typed public schema, collector contract, and mock fixtures now, so a future live-collection phase plugs in without frontend or schema changes.
- Choose a boring, maintainable baseline stack and a small intentional design system.
- Make motion a deliberate, bounded concern via a single animation library.

**Non-Goals:**
- Implementing live Kubernetes/ArgoCD collection, cluster credential handling, or collector deployment.
- Introducing a CMS, database, authentication, state-management framework, or backend service (no current requirement).
- Final content for every project, resume entry, and playground experiment.
- Independent hosting/deployment of `labs.murakams.com/*` experiments.
- Reproducing the ArgoCD interface or building a general-purpose Kubernetes dashboard.

## Decisions

### Decision: Next.js App Router with TypeScript and Tailwind CSS
Use Next.js (App Router) with React and TypeScript as the application framework and Tailwind CSS for styling. Rationale: App Router gives server-rendered/static content by default (satisfies the SEO and "server-rendered content" requirements), file-based routing maps directly to the required routes, and TypeScript gives typed content models. Tailwind maps cleanly onto a token-based design system without hand-writing CSS utility layers.

Alternatives considered:
- Remix/Astro: viable for content-heavy sites, but Next.js's App Router + RSC + route metadata primitives align better with the mix of static content and one dynamic (mocked) data source, and is the most familiar modern baseline.
- CSS-in-JS / vanilla CSS modules: rejected as the primary system in favor of Tailwind's token-friendly configuration; CSS modules may still be used locally where warranted.

### Decision: Design tokens as the single source of truth, exposed to Tailwind
Define design tokens (typography scale, spacing, container widths, color, radius, border, shadows, motion durations/easings) as a typed token module and map them into Tailwind's theme config. Components consume Tailwind utilities backed by tokens; no ad-hoc literals. This satisfies the "consistent token usage" and "color restraint" requirements and keeps the design system small and intentional.

Alternatives considered:
- A separate design-token pipeline (Style Dictionary, etc.): overkill for a single Next.js app; revisit only if multiple consumers emerge.
- Per-page styling: explicitly rejected by the spec.

### Decision: Motion as the single animation library
Use Motion for animation. Use it only for navigation transitions, shared-layout project transitions, expanding project content, subtle content entrance, infrastructure health/state changes, and timeline interactions. Wrap motion in a small set of in-house primitives that check `prefers-reduced-motion` and no-op/simplify accordingly, so reduced-motion support is centralized and not re-implemented per component.

Alternatives considered:
- Framer Motion legacy naming / raw CSS transitions only: CSS transitions suffice for some state changes and will be used where they are enough; Motion is reserved for shared-layout and orchestrated transitions that justify it.
- React Bits / heavy effect libraries: used only selectively if an individual effect genuinely improves the experience; not adopted as a blanket dependency.

### Decision: Content as typed in-repo data modules
Author projects, resume entries, and the playground registry as typed TypeScript data modules (with Zod or equivalent schema validation at build/development time) colocated in dedicated content directories. This satisfies the "typed in-repo content model" requirements, gives compile-time safety, and avoids a CMS. Project detail pages are generated from the project list at build time via `generateStaticParams`.

Alternatives considered:
- MDX per project: useful for long-form prose and may be used for the long-form sections of a project case study, but the structured fields (status, technologies, links, challenges, trade-offs) remain typed data; MDX is a complement, not a replacement.
- A headless CMS: explicitly out of scope.

### Decision: Repository layout separating concerns
Organize the repository so the five concerns in the proposal stay independent:

```
src/
  app/                      # portfolio UI: routes, layout, navigation
  components/               # shared UI components + motion primitives
  design/                   # design tokens, typography, theme config
  content/
    projects/               # typed project content model + data
    resume/                 # typed resume content model + data
    playground/             # typed playground registry + data
  features/
    home/
    projects/
    playground/
    resume/
    contact/
  infra/
    public-schema.ts        # typed public infrastructure model (allowlisted)
    sanitizer.ts            # sanitizer boundary contract + allowlist
    collector-contract.ts   # shape the collector emits into the sanitizer
    fixtures/               # realistic mocked sanitized fixtures
    api/                    # portfolio API/cache layer (mocked in scope)
```

The `infra/` module is deliberately framework-agnostic and depends only on the public schema, so the frontend consumes the public model + fixtures and a future live collector can be wired behind the sanitizer without touching `app/` or the schema.

Alternatives considered:
- Flat feature folders mixing content and UI: rejected because it couples content models to the UI and makes the infra boundary less visible.
- Putting infra under `app/api` only: rejected because the public schema and sanitizer must exist independently of the web framework.

### Decision: Infrastructure sanitization boundary as an explicit allowlist
The sanitizer is implemented as an explicit, allowlisted projection: it takes the collector contract shape as input and emits only fields present in the public schema, dropping everything else by default. The allowlist is the single place where "what is public" is decided. This makes the "sensitive information never crosses the boundary" requirement enforceable by construction (default-deny) rather than by convention.

Alternatives considered:
- Blocklist (deny specific fields): rejected; too easy to leak new fields when the upstream API changes.
- Forwarding raw responses with redaction: rejected by spec (raw API responses must not cross).

### Decision: Frontend develops against mock fixtures via the portfolio API/cache layer
The `/infra` UI reads through a small portfolio API/cache layer that, in the initial implementation, is backed by realistic mocked sanitized fixtures conforming to the public schema. The API/cache layer has the same interface it will have when fed by the real sanitizer, so swapping the backend later is a single wiring change. This satisfies "frontend develops against fixtures" and "collector contract is documented."

Alternatives considered:
- Hardcoding fixture data in components: rejected; hides the contract and makes the future swap invasive.
- Building the live collector now: explicitly deferred.

### Decision: Dark mode via token inversion + persisted override
Implement theming by inverting the token set between light and dark and persisting an explicit override, while defaulting to `prefers-color-scheme` on first visit. Apply the theme class before paint to avoid a flash of the wrong theme.

Alternatives considered:
- Always-dark: rejected by spec (dark mode supported but not assumed as the default developer aesthetic).
- No dark mode: rejected by spec.

### Decision: Playground experiments are referenced, not bundled, when external
The playground registry records a delivery mode per experiment. In-app experiments live in the portfolio; iframe/fullscreen experiments are embedded by URL; external experiments (e.g. `labs.murakams.com/*`) are linked/embedded and their code is not bundled into the main app. This keeps the main app lean and lets experiments be deployed independently.

Alternatives considered:
- Bundling every experiment into the Next.js app: rejected by spec (do not couple every experiment to the main app).

## Risks / Trade-offs

- [Sanitizer allowlist drift] → The public schema and sanitizer allowlist are the security boundary. Mitigation: keep them in one module, add a build-time test that asserts every public-schema field is explicitly allowlisted, and add a test that feeds representative sensitive inputs (Secrets, IPs, raw responses) through the sanitizer and asserts none appear in output.
- [Mock fixtures diverge from real collector output] → Mitigation: the collector contract is the shared type; fixtures are typed against it, and the future collector must satisfy the same contract.
- [Motion creep / "vibe-coded" look] → Mitigation: centralize motion behind primitives, enforce reduced-motion, and review each animation against the "does it communicate something?" rule; avoid ambient/decorative motion by convention and code review.
- [Content model churn late in build] → Mitigation: ship one representative project detail page first to stress the model before scaling content.
- [Tailwind token drift] → Mitigation: tokens are the only source; Tailwind theme is generated from them, and ad-hoc literals are disallowed by convention/review.
- [Single-page-app SEO regressions] → Mitigation: prefer server components and static generation for primary content; verify crawlable HTML without JS for primary routes.
- [Future live collector introduces latency/failure modes] → Mitigation: the API/cache layer is the seam; design it with a fallback to last-known/cached state and degraded UI states now, even while mocked.

## Open Questions

- Exact contact email address and which social/professional links to display on `/contact` (content detail; does not change specs, design, or tasks).
- Final list of selected projects for the homepage preview and which project becomes the representative detail page (content selection; does not change the model).
- Whether long-form project sections should be MDX or plain typed data (can be decided per-project during implementation without changing the spec).
