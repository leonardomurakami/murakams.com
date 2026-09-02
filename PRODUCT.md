# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is engineering peers and the broader technical community exploring Leonardo Murakami’s work, systems, experiments, and career. The site also serves Leonardo as a personal archive of substantial engineering work.

## Product Purpose

murakams.com is an interactive personal engineering portfolio and archive. It presents project case studies, a sanitized view of infrastructure running on Leonardo’s VPS, a web-native resume, experiments, and direct contact information. Success means the archive remains accurate, enjoyable to explore, technically credible, and memorable.

## Positioning

The portfolio demonstrates the work through the site itself rather than presenting a conventional collection of repository cards. Its distinctive mechanism is a fictional old-PC operating system that visitors actively explore, paired with a conventional accessible version of the same content.

## Operating Context

Visitors may arrive at the homepage or a deep link to a project, infrastructure status, resume entry, experiment, or contact page. The immersive entry screen lets visitors boot into the full-screen MockOS or bypass it for conventional responsive pages.

## Capabilities and Constraints

- Next.js App Router, React, TypeScript, Tailwind CSS, and repository-backed typed content.
- Primary routes remain `/`, `/projects`, `/projects/[slug]`, `/infra`, `/playground`, `/playground/[slug]`, `/resume`, and `/contact`.
- The immersive MockOS supports a boot sequence, desktop, taskbar, start menu, and draggable, resizable, minimizable, maximizable windows.
- On phone-sized screens, the same content runs in an early-smartphone shell with a touch launcher, single-app screens, and persistent Home, Back, and accessible-site controls.
- The immersive experience runs a full-screen boot sequence before entering the MKS/98 desktop directly.
- Projects live in a folder inside MKS/98 and open as complete case-study applications.
- Playground programs are discovered from the versioned MKS Labs catalog and appear as executables in the MKS/98 Programs folder and as records on the accessible `/playground` route.
- The first Labs release intentionally has no public experiments; both experiences show honest empty, stale, and unavailable states instead of placeholder programs.
- The accessible experience bypasses the OS, startup motion, and overlapping windows entirely.
- Primary content remains server-rendered and available without client-side JavaScript.
- The infrastructure surface consumes only the existing sanitized public schema. ArgoCD, Kubernetes internals, credentials, secrets, private addressing, and raw API responses remain private.
- Experiments execute in cross-origin, sandboxed Labs iframes. Catalog paths are joined only to the configured trusted Labs origin, and iframe permissions are derived from local capability mappings.
- Contact remains email-first and does not require a backend form service.

## Brand Commitments

- The site name is `murakams.com`; the author is Leonardo Murakami, SRE & Software Engineer.
- The experience may be deliberately playful and gimmicky when the interaction is purposeful and well crafted.
- The MockOS is inspired by Windows 95/98-era interaction and physical computing, but uses original naming, icons, sounds, graphics, and assets rather than copying Microsoft trademarks or protected assets.
- The site should not fall into the stereotypical neon terminal or generic SRE dashboard aesthetic.

## Evidence on Hand

- Typed project case studies in `src/content/projects/projects.ts`.
- Architecture diagrams in `public/projects/*/overview.svg`.
- Typed resume data in `src/content/resume/resume.ts`.
- Typed public infrastructure schema, sanitizer, collector contract, and fixtures under `src/infra/`.
- Versioned Zod Labs catalog consumer, trusted URL normalization, and capability policy under `src/content/playground/`.
- Existing page implementations for all primary routes.
- No testimonials, customer logos, or external commercial claims are available and none should be fabricated.

## Product Principles

1. Make exploration itself demonstrate engineering and creative judgment.
2. Preserve direct access to substantive content beneath the theatrical interface.
3. Keep infrastructure exposure explicitly allowlisted and sanitized.
4. Use interaction to reveal real work, not to conceal thin content.
5. Treat the accessible version as a complete first-class experience.

## Accessibility & Inclusion

The conventional accessible experience must meet WCAG AA expectations for semantics, keyboard operation, focus visibility, contrast, reduced motion, responsive behavior, and text alternatives. A prominent control during startup and within the running system lets visitors bypass the MockOS entirely. The immersive boot sequence and desktop remain keyboard and touch operable, and the conventional Playground catalog remains available without cinematic interaction.
