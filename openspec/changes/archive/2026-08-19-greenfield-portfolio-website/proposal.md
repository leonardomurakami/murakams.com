## Why

`murakams.com` currently exists as a domain but has no modern, intentional personal engineering site behind it. As an SRE/software engineer, I need a portfolio that represents my work through strong project case studies, a web-native resume, a catalog for experiments, and a sanitized live view of the infrastructure running on my personal VPS — without falling into the stereotypical "SRE portfolio" aesthetic or the "vibe-coded" look. This change establishes that foundation from scratch so the site can grow into a broader personal engineering presence over time.

## What Changes

- Establish a greenfield Next.js + React + TypeScript + Tailwind CSS application as the new `murakams.com`, with no inheritance from the current site's architecture, layout, design system, or code.
- Define a small intentional design system: typography, spacing, container widths, color tokens, surface/border treatment, interactive states, motion principles, and responsive behavior. Neutral base with a restrained accent; dark mode supported but not assumed as the default developer aesthetic.
- Build a responsive site shell with primary navigation across `/`, `/projects`, `/infra`, `/playground`, `/resume`, and `/contact`, including shared layout, metadata/SEO baseline, accessibility baseline, and `prefers-reduced-motion` support.
- Build a concise homepage that introduces who I am, current SRE/engineering focus, selected projects, a small public infrastructure status preview, and links into deeper sections — not a giant landing page.
- Build a projects capability treating projects as substantial engineering case studies (not GitHub repo cards), with a typed content model stored in-repo, a `/projects` index, and `/projects/[slug]` detail pages covering problem, architecture, implementation, challenges, trade-offs, and links.
- Build a public infrastructure status capability with an explicitly allowlisted, typed public schema and a sanitization boundary between Kubernetes/ArgoCD and the public interface. The initial frontend consumes realistic mocked sanitized fixtures; live cluster collection is deferred. ArgoCD is never exposed to the Internet.
- Build a playground capability that acts as a discovery/catalog layer for small experiments and toys, with a project registry and support for embedded, fullscreen, or independently-hosted experiments (e.g. `labs.murakams.com/*`). The index stays coherent with the primary design system while individual experiments may be more experimental.
- Build a resume capability as a web-native chronological career/story presentation (not a rendered PDF), backed by structured in-repo data covering company, role, time period, progression, responsibilities, engineering work, measurable impact, and technologies.
- Build a simple contact capability using a `mailto:` link as the primary interaction, with optional social/professional links.
- Use Motion for meaningful animation (navigation transitions, shared-layout project transitions, content entrance, infra state changes, timeline interactions) and respect `prefers-reduced-motion`. Avoid ambient movement, scroll hijacking, and decorative animation.
- Keep portfolio UI, project/resume content, playground registry, public infrastructure model, and infrastructure collector as reasonably independent concerns in the repository.

### Deferred (out of initial scope)

- Live Kubernetes/ArgoCD collection implementation (collector deployment, cluster credentials, real-time wiring). The boundary, contract, mock fixtures, and intended architecture are established now; live integration is a subsequent phase.
- CMS, database, authentication, state-management framework, or backend service (no current requirement).
- Authoring the full final content for every project, resume entry, and playground experiment. Initial scope ships one representative project detail page, a populated resume data model, and a seeded playground registry.
- Independent hosting/deployment of `labs.murakams.com/*` experiments.

## Capabilities

### New Capabilities
- `site-shell`: Application foundation, routing, primary navigation, responsive layout shell, design system (tokens, typography, color, surfaces, motion principles), SEO/metadata baseline, accessibility baseline, and reduced-motion support.
- `home`: Homepage content sections — introduction, current engineering/SRE focus, selected projects preview, public infrastructure status preview, and links into deeper sections.
- `projects`: Projects index and project detail case-study pages, plus the typed in-repo project content model.
- `infrastructure-status`: Typed public infrastructure schema, sanitization boundary and collector contract, realistic mocked sanitized fixtures, and the `/infra` public showcase UI.
- `playground`: Playground index, project registry model, and embedding/linking strategy for experiments (in-app, iframe, fullscreen, or independent subdomain).
- `resume`: Web-native chronological career timeline presentation and the structured in-repo resume data model.
- `contact`: Simple contact page with `mailto:` primary interaction and optional social/professional links.

### Modified Capabilities
<!-- None — greenfield project, no existing specs. -->

## Impact

- **Code**: New greenfield Next.js application replacing the eventual host content of `murakams.com`. No existing project code is modified or migrated.
- **Dependencies**: Introduces Next.js, React, TypeScript, Tailwind CSS, and Motion as baseline dependencies. React Bits or equivalent may be added selectively later; no CMS, database, auth, state-management framework, or backend service is introduced in this scope.
- **Data/content**: New in-repo structured content models for projects, resume entries, playground registry items, and the public infrastructure status model. No external data stores.
- **Infrastructure**: Establishes the architectural boundary and contract for a future infrastructure collector; does not deploy or wire live cluster access. ArgoCD remains private.
- **Systems affected**: None at runtime beyond the new application. Future phase will integrate the collector against the personal VPS/Kubernetes environment.
