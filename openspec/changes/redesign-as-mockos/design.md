## Context

See `proposal.md` for motivation. The application is Next.js 16 with React 19, App Router, server-rendered canonical routes, typed in-repository project/resume/playground content, a sanitized infrastructure schema, Tailwind v4 tokens, and `motion` for client transitions.

The redesign must introduce a highly stateful client experience without sacrificing canonical route HTML, metadata, direct links, infrastructure security, or a complete no-animation alternative. Power-on, boot, desktop, and removable-media interaction now share one persistent 2D repair-bench scene so the physical computer and live CRT maintain spatial continuity without WebGL.

## Goals / Non-Goals

**Goals:**

- Preserve canonical server routes as the content and SEO authority while making MockOS the default presentation.
- Make a fresh-load boot and desktop shell persist across client navigation.
- Provide real desktop window behavior without coupling portfolio content to window-manager internals.
- Create one seamless 2D repair-bench scene shared by case power-on, CRT boot, desktop, program-disk selection, drive insertion, and return.
- Keep Projects inside a native MKS/98 folder and reserve physical floppy disks for Playground programs.
- Keep the accessible presentation complete, conventional, and independently usable.
- Reuse typed content and sanitized infrastructure contracts across both presentations.

**Non-Goals:**

- Pixel-perfect Windows emulation, Microsoft assets, or a general-purpose browser OS.
- A persistent filesystem, user accounts, or cloud-synchronized workspace.
- Decorative utilities unrelated to portfolio content.
- Making the physical program-disk cabinet the only path to playground content.
- Adding private Kubernetes/ArgoCD data for a richer visualization.

## Decisions

### 1. Use a root-level dual-presentation gate

Every canonical route will continue to render its conventional server component. The root layout will also mount a lightweight client experience gate. A pre-paint script reads the persisted presentation preference and applies `data-experience="immersive|accessible"` to the root element before either presentation paints.

CSS and the gate ensure only one presentation is visible and exposed to assistive technology. With JavaScript disabled or preference initialization unavailable, the conventional route remains the default visible result. Changing presentation stores the explicit preference and reloads the current canonical route.

**Alternative considered:** Create a separate `/os` route. Rejected because the user wants the entire default site to be the old PC and direct links should still open inside the OS without separate URLs.

**Alternative considered:** Replace route HTML with a client-only OS. Rejected because it would weaken SEO, no-JavaScript behavior, deep links, and the accessible bypass.

### 2. Keep the complete workstation DOM-based

The repair bench, computer case, monitor, live CRT, disk cabinet, desktop, windows, launcher, taskbar, application content, boot text, and overlays will be semantic DOM/CSS. `motion` coordinates transform-based camera states and disk movement.

**Rationale:** A shared DOM scene preserves one live screen through every phase, supports real controls and text, remains responsive and accessible, and avoids a visible medium handoff.

**Alternative considered:** Render the complete operating system on a 3D monitor texture. Rejected because interactive text and multi-window content would become brittle and inaccessible.

**Alternative considered:** Use a separate WebGL cabinet. Rejected after implementation because replacing the 2D startup scene with an unrelated 3D surface broke spatial continuity and made the disk interaction feel detached from the computer.

### 3. Model boot and workstation camera behavior as explicit reducers

Boot states remain `off → post → splash → desktop`, with a direct skip to `desktop`. The shared workstation states are `bench-off → bench-powering → screen-boot → screen-desktop ↔ cabinet-browsing ↔ disk-selected → disk-inserting → screen-return → experiment-window`.

Reducers own legal transitions; animation completion events advance state. Visual components do not infer workflow from timers alone. This makes interrupted transitions, reduced motion, repeated cabinet visits, and tests deterministic.

### 4. Use canonical pathname as active-app identity

An app registry maps canonical route patterns to application IDs and application IDs back to canonical routes. Opening or focusing a content app navigates to that route. Popstate/back/forward reopens or focuses the mapped app. Other open windows and geometry remain transient client state and reset on document reload, matching the requested boot-every-load behavior.

`/projects` maps to the Projects folder and `/projects/[slug]` maps directly to a project application. `/playground` maps to Program Disks and moves the shared scene from the CRT to the cabinet view after boot; `/playground/[slug]` maps directly to an experiment application for efficient deep linking.

**Alternative considered:** Encode every open window and rectangle in query parameters. Rejected because it creates noisy URLs, unnecessary router updates during manipulation, and no user requirement for shareable workspace layouts.

### 5. Hide window-manager choice behind an adapter

A short spike will test `glazier@0.0.5`, a small MIT headless React window manager with pointer capture, resize, focus/z-order, taskbar primitives, and route support. Production code will depend on a local adapter exposing open, close, focus, move, resize, minimize, maximize, restore, bounds, and selectors.

The compatibility spike passed React 19 typechecking, Next 16 production compilation, mouse drag/resize, and emulated touch dragging. Glazier is retained behind the adapter. Its window geometry does not automatically correct when the viewport shrinks, so the adapter will add ResizeObserver-based bounds correction and compact mode will not mount free drag/resize. No visual component imports the third-party library directly.

**Alternative considered:** Commit immediately to a custom manager. Rejected because drag, eight-direction resize, snapping, focus, bounds, and taskbar behavior are substantial commodity work, but the adapter preserves that fallback if later integration reveals a blocker.

### 6. Split content data from presentation-specific views

Current page components will be decomposed so typed data and common semantic sections can feed both conventional routes and MockOS applications. The immersive views may use distinct composition and chrome; they do not duplicate source strings or public data models.

The application registry will dynamically load application views. Long-form project content remains DOM content in the project window rather than a canvas texture.

### 7. Use the live CRT as the shared scene viewport

`MockOsShell` owns one full-screen repair-bench stage. The monitor glass is a clipped viewport that renders the actual POST, splash, desktop, and application windows. At the bench camera state the complete monitor, case, drive, and program-disk cabinet are visible. At the screen camera state a transform scales and translates the same stage so the live CRT fills the viewport.

Opening Program Disks freezes ordinary desktop interaction and reverses that transform. Because the live desktop never unmounts or changes medium, no screenshot capture, fake monitor texture, or CRT seam mask is required.

### 8. Use authored 2D hardware and dynamic program disks

The monitor, case, drive, cabinet, and disks use layered DOM/CSS geometry in the committed warm ABS, wood, cobalt, and voltage-yellow materials. Program disk labels derive from the typed playground registry, so every experiment appears automatically and delivery mode remains visible.

The initial power button lives on the computer case. Mounting a disk uses a spatial transform from its cabinet slot to the case drive, then sinks behind the drive bezel before the camera returns to the live CRT and opens the experiment.

### 9. Bound animation to one transform-driven sequence

The scene uses transform and opacity for the camera move and disk travel, with short light/shadow changes for power and drive feedback. One authored transition lasts 650–800ms per camera leg; disk insertion completes within the same bounded sequence. Normal application navigation remains immediate.

When reduced motion is requested after an explicit immersive override, the camera uses a short crossfade and the disk state updates without long-distance travel. The default reduced-motion path remains the accessible site.

### 10. Design mobile as a compact OS, not a shrunken desktop

On narrow or touch-first devices, only one app is visible and maximized; drag and resize are not mounted. The launcher becomes a touch grid and taskbar becomes a switcher. The same app registry, routes, and reducer remain in use.

On mobile, the shared workstation stage uses a compact crop: the case power control remains reachable before boot, the CRT fills the running view, and Program Disks pulls back only far enough to keep the drive and disk cabinet touch-operable. Accessible mode remains available before startup.

### 11. Use an explicit user gesture for original sound

The computer-case power control is required before boot, satisfying browser audio policies. The system will synthesize or play an original short startup sound and offer mute before activation and in the system tray. It will not use Windows audio.

### 12. Serve infrastructure data through the existing public boundary

The immersive System Monitor may fetch from a client endpoint that returns only `PublicInfrastructureSnapshot` plus existing fetch-state metadata. The endpoint calls the existing API/cache layer; client code never imports or receives the private collector shape or raw source responses.

### 13. Establish the visual system before production UI

The Windows 95/98-era interaction world is pinned, but palette, typography, icon style, wallpaper, window materials, and motion treatment require the Impeccable replacement-world direction process. A first-viewport desktop/power composition must be selected before shell implementation. `DESIGN.md` is written from the reviewed build, not guessed before it.

### 14. Selected direction: MKS/98 Hobbyist Repair Bench

The public OS name is **MKS/98**. The selected world treats the portfolio as a personally assembled late-1990s repair-bench workstation rather than a Windows replica: warm beige ABS hardware, a deep cobalt screen field, voltage-yellow focus and selection, red reserved for genuine error state, dot-matrix diagnostic typography during boot, compact original pixel-like icons in chrome, and readable modern text inside content applications.

The selected desktop composition is **Asymmetric Workbench**: a vertical rack of application icons on the left, a large Welcome window offset from center, a small live System Monitor window at lower right, and the taskbar anchoring the bottom. The desktop wallpaper uses an original schematic derived from the sanitized homelab data-flow diagram. Mobile opens Welcome maximized above a compact launcher/task switcher.

The memorable continuity is physical: the visitor powers on the beige computer from its case, the camera moves into the live CRT for boot and desktop, and opening Program Disks pulls back through the exact same scene to reveal hand-labeled experiment disks beside the drive. Motion is mechanical and singular—switches depress, windows snap, disks carry weight, and the shared screen never breaks continuity—rather than ambient animation.

## Risks / Trade-offs

- **The experience becomes frustrating on repeat loads** → Keep boot short, provide Skip startup/Escape, and do not reboot during client navigation.
- **The OS becomes a Windows costume rather than an identity** → Use original branding/assets and select one coherent variation within the pinned era before implementation.
- **Glazier is immature or incompatible** → Validate it in a production-build spike and retain a strict adapter with a custom reducer fallback.
- **Dual presentation causes flashes or duplicate screen-reader content** → Set mode before paint, default no-JS to conventional content, and toggle visibility plus inert/ARIA state atomically.
- **Shared-stage transforms blur or crop the live desktop** → Use transform-origin and viewport-derived CSS variables, keep the CRT clip bounds stable, and inspect desktop/mobile captures at both camera states.
- **Disk travel looks disconnected from its selected slot** → Measure source and drive rectangles and use a FLIP-style transform before sinking the disk behind the drive bezel.
- **Cinematic movement feels slow on repeat use** → Keep each camera leg under 800ms, allow interruption, and use the reduced-motion crossfade when requested.
- **Window movement causes excessive React renders** → Mutate transforms during pointer movement and commit rectangles at interaction boundaries.
- **Long-form content is cramped by retro chrome** → Allow project and resume windows to maximize and use modern readable typography inside the original shell.
- **Interactive infrastructure implies fake liveness** → Display source/generated time and animate only actual snapshots or selection, never synthetic health changes.
- **Audio surprises visitors** → Make the power control and sound state explicit before playback and provide immediate mute.

## Migration Plan

1. Create and approve the replacement visual direction and first-viewport compositions.
2. Run the isolated glazier spike and retire the rejected DOM/WebGL cabinet spike.
3. Add the experience gate and accessible/immersive preference while conventional pages remain default.
4. Build boot, desktop, URL mapping, and a minimal Welcome application behind a development feature flag.
5. Add applications incrementally, preserving existing routes throughout.
6. Consolidate power, boot, desktop, and Program Disks into the shared 2D workstation scene.
7. Switch immersive mode to the default after desktop/mobile, direct-link, no-JavaScript, and fallback tests pass.
8. Retain the accessible mode and prior semantic page components as the permanent rollback path.

Rollback requires changing the pre-paint default to accessible mode and disabling the immersive gate; canonical route content remains deployable throughout.

## Open Questions

None. The shared workstation is intentionally 2D DOM/CSS, the power control lives on the computer case, Projects remain inside the screen, and playground programs use physical floppy disks.