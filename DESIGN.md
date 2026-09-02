# MKS/98 Design System

## Concept

MKS/98 is a fictional hobbyist operating system that frames Leonardo Murakami's engineering portfolio. The visual world is **Hobbyist Repair Bench**: warm beige ABS plastic, deep cobalt desktop surfaces, voltage-yellow focus accents, and diagnostic monospace boot text — inspired by the Windows 95/98 era but entirely original in naming, iconography, sound, and graphics.

The composition is **Asymmetric Workbench**: the first viewport after boot places the Welcome application and System Monitor side-by-side at different sizes, establishing the desktop as a working surface rather than a centered landing page.

## Dual presentation

Every canonical route has two presentations:

1. **Immersive (MKS/98)** — the default for visitors without a stored preference or reduced-motion signal. The site boots from a powered-off state, reveals a desktop with draggable/resizable windows, and routes applications through a Start-style launcher, taskbar, and desktop icons.
2. **Accessible** — the permanent rollback path. Conventional responsive pages with semantic HTML, keyboard focus, WCAG AA contrast, and no boot, audio, window chrome, or WebGL. Available before power-on and inside the running OS.

A pre-paint script (`public/experience-init.js`) reads `localStorage["mks98-experience"]` and `prefers-reduced-motion` to set `data-experience` on `<html>` before hydration. Explicit preference wins; reduced-motion visitors default to accessible; otherwise immersive is selected.

## Color tokens

Tokens are authored in `src/app/globals.css` under `:root` (light) and `.dark` (dark), then mirrored in `src/design/tokens.ts` for programmatic access.

| Token                      | Light     | Dark      | Role                                 |
| -------------------------- | --------- | --------- | ------------------------------------ |
| `--color-background`       | `#e8deca` | `#10182c` | Warm beige bench / deep cobalt night |
| `--color-surface`          | `#f6efdf` | `#17213a` | Paper / raised panel                 |
| `--color-surface-raised`   | `#ddd2bb` | `#202c48` | Card and window surface              |
| `--color-foreground`       | `#17191d` | `#f3ead9` | Body ink                             |
| `--color-structural`       | `#173d8f` | `#244991` | Cobalt — primary structural color    |
| `--color-structural-deep`  | `#102251` | `#0b1530` | Deep cobalt — desktop wallpaper      |
| `--color-action`           | `#f2c84b` | `#f2c84b` | Voltage yellow — focus and action    |
| `--color-status-healthy`   | `#28623f` | `#7ccf96` | Green                                |
| `--color-status-degraded`  | `#765c00` | `#f2c84b` | Amber                                |
| `--color-status-unhealthy` | `#a83232` | `#ff8b80` | Red                                  |
| `--color-status-unknown`   | `#5f5a50` | `#b6ad9c` | Neutral                              |

Status color is never the sole carrier of meaning — every status badge includes a text label and plain-language explanation.

## Typography

- **Sans**: Geist Sans (`--font-geist-sans`) for body and UI text.
- **Mono**: Geist Mono (`--font-geist-mono`) for diagnostic boot text, labels, metadata, and instrument-paper surfaces.

Monospace is used purposefully for system chrome (labels, timestamps, status keys) — not as a costume for body content. Application body text remains readable modern sans at standard sizes.

## Spacing and radius

- Container widths: `prose` 42rem, `narrow` 60rem, `default` 76rem, `wide` 86rem.
- Section spacing: `clamp(3.75rem, 8vw, 7rem)`.
- Gutter: `clamp(1.25rem, 4vw, 2.5rem)`.
- Radius: intentionally small (`0.125rem` – `0.25rem`) to evoke the crisp pixel-edge of retro chrome without forcing a pixel font.

## Shadow

Hard offset shadows (`2px 2px 0` / `5px 6px 0`) in cobalt-tinted or black — the stamp-like shadow of physical objects on a bench surface, not soft material elevation.

## Motion

- `--duration-fast`: 120ms — hover, focus, selection.
- `--duration-base`: 180ms — panel transitions, window state changes.
- `--duration-slow`: 300ms — boot phase transitions, cabinet camera moves.
- `--ease-standard`: `cubic-bezier(0.4, 0, 0.2, 1)`.
- `--ease-emphasized`: `cubic-bezier(0.2, 0, 0, 1)`.
- One authored pulse animation (`status-pulse`, 2.4s) for live infrastructure indicators only.
- Reduced-motion visitors default to accessible mode. If they explicitly choose immersive mode, the shared workstation uses a short crossfade rather than long-distance spatial movement.

## Immersive desktop

### Boot sequence

Every fresh document load begins on a complete powered-off repair bench. The visitor presses the button on the computer case, which lights the case and monitor and expands the same live CRT into the viewport while the `off → post → splash → desktop` state machine runs. An original startup chime plays from the power gesture. Skip startup and Escape are always available. Client-side application navigation does not reboot.

### Window manager

Windows are DOM/CSS elements managed by `glazier` behind a local adapter (`src/features/mock-os/window-manager/adapter.tsx`). The adapter exists so glazier can be replaced by a custom reducer if compatibility or behavior becomes unacceptable.

Desktop windows support: focus, z-order, dragging, edge/corner resizing, minimize, maximize, restore, close, and viewport bounds correction. All window controls have accessible names (`aria-label`). On mobile, free movement and resizing are disabled; one application is maximized at a time with a taskbar app switcher.

### Applications

| App            | Icon         | Route                | Description                                                                       |
| -------------- | ------------ | -------------------- | --------------------------------------------------------------------------------- |
| Welcome        | computer     | `/`                  | Identifies Leonardo, explains his work, links to all apps                         |
| Projects       | folder       | `/projects`          | Project folder inside the computer; lists all projects with links to case studies |
| System Monitor | monitor      | `/infra`             | Sanitized infrastructure snapshot with application topology and detail            |
| Resume         | document     | `/resume`            | Chronological role outline with technology filtering and detail pane              |
| Program Disks  | disk-cabinet | `/playground`        | 2D floppy-disk cabinet; selecting and mounting a disk opens the experiment        |
| Mail           | mail         | `/contact`           | Local mail composer with explicit `mailto:` handoff                               |
| Project        | —            | `/projects/[slug]`   | Full case study in a maximized reading window                                     |
| Experiment     | —            | `/playground/[slug]` | Individual experiment runner                                                      |

### Shared 2D workstation and floppy cabinet

Power, boot, desktop, and Program Disks inhabit one persistent DOM/CSS repair-bench scene. A measured live-screen layer aligns with the CRT opening in bench view and expands to the viewport for boot and desktop; reversing that layout animation creates the authored zoom-out without replacing the live screen or remounting its windows.

The physical cabinet shows every typed playground experiment as a labeled floppy disk, including its delivery mode. Selecting a disk reveals a paper service record with the real experiment description. Insertion measures the selected disk and computer-drive rectangles, then uses a FLIP-style overlay to carry the disk across the desk, align it to the drive mouth, and sink it behind the bezel. The drive lamp activates, the live CRT expands again, and the experiment opens only after the return animation completes.

The monitor, case, drive, cabinet, disks, and keyboard are responsive 2D geometry. Desktop and mobile use different bench arrangements while sharing the same state machine and content. No WebGL or 3D dependencies are used.

## Accessible presentation

The accessible presentation renders conventional responsive pages with:

- Semantic HTML and visible keyboard focus.
- WCAG AA body-text contrast.
- Alternative text for non-decorative images.
- No-JavaScript usability (server-rendered content remains visible).
- SEO metadata and canonical URLs.
- Print rules that suppress immersive chrome and produce readable project and resume documents.
- A "Launch MKS/98" control to enter immersive mode.

## Direction contract

The direction contract is embedded in `src/app/layout.tsx` in a `<template data-design-contract>` element with key `mks98-3779d000`. It describes MKS/98 as a hobbyist workstation, the material language, the user journey from power-on through applications, and the Asymmetric Workbench first viewport. The contract survives the production build and is present in all server-rendered HTML.

## File map

### Design tokens and primitives

- `src/app/globals.css` — color, typography, spacing, radius, shadow, motion tokens.
- `src/design/tokens.ts` — typed token mirror for JS access.
- `src/design/site-config.ts` — site-level metadata.
- `src/components/primitives.tsx` — Container, Heading, Section.
- `src/components/motion.tsx` — FadeIn, useIsMobile.

### MockOS implementation

- `src/features/mock-os/mock-os-shell.tsx` — top-level shell and shared-workstation entry.
- `src/features/mock-os/workstation/workstation-scene.tsx` — persistent monitor, case, cabinet, live CRT, and measured disk flight.
- `src/features/mock-os/workstation/workstation-machine.ts` — legal camera, cabinet, insertion, and return states.
- `src/features/mock-os/workstation/workstation.module.css` — responsive physical workstation geometry and materials.
- `src/features/mock-os/desktop-workspace.tsx` — desktop, icons, taskbar, launcher, window rendering, route sync.
- `src/features/mock-os/window-manager/adapter.tsx` — glazier re-export boundary.
- `src/features/mock-os/registry.ts` — typed app registry and route mapping.
- `src/features/mock-os/icons.tsx` — original SVG icons and window control glyphs.
- `src/features/mock-os/desktop-context.tsx` — desktop provider and open-app context.
- `src/features/mock-os/mock-os.module.css` — live desktop and window chrome styles.
- `src/features/mock-os/apps/core-apps.tsx` — Welcome, Projects, System Monitor, Resume, Program Disks, Mail, Project, Experiment apps.
- `src/features/mock-os/apps/app-states.tsx` — shared loading, empty, error, external states.
- `src/features/mock-os/boot/` — boot machine, boot screen, power screen, startup chime.
- `src/features/mock-os/state/window-bounds.ts` — viewport bounds correction.

### Experience gating

- `src/features/experience/experience-provider.tsx` — context and AccessibleExperience wrapper.
- `src/features/experience/experience-gate.tsx` — immersive gate that mounts MockOS.
- `src/features/experience/preference.ts` — preference read/write.
- `public/experience-init.js` — pre-paint experience initialization.

### Accessible route features

- `src/features/infra/` — System Monitor view, components, selectors.
- `src/features/resume/` — interactive resume timeline.
- `src/features/playground/` — playground browser and runner.
- `src/features/contact/` — contact composer and mailto builder.
- `src/features/projects/` — project page styles.

### Content

- `src/content/projects/` — typed project registry and schema.
- `src/content/resume/` — typed resume registry and schema.
- `src/content/playground/` — typed playground registry and schema.

### Infrastructure boundary

- `src/infra/public-schema.ts` — allowlisted public fields.
- `src/infra/api/index.ts` — public API layer.
- `src/infra/sanitizer.ts` — sanitization boundary.
- `src/infra/fixtures/` — fixture data (never imported by UI code).

## Verification

The shipped system passes:

- `pnpm typecheck`
- `pnpm test` (10 files, 50 tests)
- `pnpm build` (19 static pages, no spike routes)
- `pnpm lint` (0 errors; warnings only in vendored Impeccable scripts)
- Impeccable detector over all changed UI files (0 findings)
- No Three.js/WebGL dependencies (cabinet is fully 2D DOM/CSS)
- Direction contract (`mks98-3779d000`) present in all production HTML
