## Why

The portfolio's projects capability currently ships only one representative project case study (`homelab-gitops-platform`). The site needs real project content drawn from actual work I've deployed in my personal Kubernetes cluster to make the projects section a genuine showcase rather than a single-example stub.

## What Changes

- Add four new project case studies to the in-repo project content, each fully populated against the existing typed project content model:
  - **discord-bot-framework** — a plugin-driven Discord bot framework (Hikari/Lightbulb/Lavalink) where any feature can be enabled/disabled without touching core.
  - **gamdle** — a daily deterministic probability casino with fictional points, passwordless magic-link accounts, and per-user-per-day seeding.
  - **graduation-ime-usp** — a Docusaurus static site archiving my IME-USP coursework as a browsable, living record of my CS education.
  - **message-board** — a FastAPI + HTMX + SQLAlchemy forum built as an individual assignment for MAC0350 at IME-USP.
- Mark `graduation-ime-usp` as featured so it appears in the homepage's selected projects preview.
- Add visual material (architecture diagrams / screenshots) for each project where appropriate.
- Update the projects index and homepage preview to reflect the expanded project set.

## Capabilities

### New Capabilities
<!-- None — this change adds content to the existing projects capability. No new spec-level behavior. -->

### Modified Capabilities
<!-- None — the existing projects spec already defines the content model, index, detail pages, and status representation. Adding more project entries is content, not a behavior change. skip_specs: true is set in .openspec.yaml. -->

## Impact

- **Content**: New project data entries in `src/content/projects/` and associated visual assets in `public/projects/`.
- **Code**: Minor updates to the projects data module to include the new entries; the homepage selected-projects preview will pick up the featured entry automatically from the existing `featuredProjects` selector.
- **Dependencies**: None — no new libraries or frameworks.
- **Specs**: No spec-level behavior changes; `skip_specs: true` is declared.
