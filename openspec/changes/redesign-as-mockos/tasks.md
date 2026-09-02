## 1. Visual Direction and Baseline

- [x] 1.1 Run the Impeccable replacement-world direction process for the pinned Windows 95/98-inspired experience and record the selected concept.
- [x] 1.2 Produce and approve desktop compositions for the powered-off state, post-boot desktop, and one representative application window.
- [x] 1.3 Produce and approve a compact mobile composition and define the original OS name, icon language, typography, palette, wallpaper, materials, and motion vocabulary.
- [x] 1.4 Record the direction contract and route surface brief before production UI edits.
- [x] 1.5 Run the current typecheck, lint, tests, and production build to record a clean implementation baseline or document pre-existing failures.

## 2. Technical Risk Spikes

- [x] 2.1 Install `glazier@0.0.5` in an isolated spike and implement one draggable, resizable, minimizable, maximizable test window behind a local adapter.
- [x] 2.2 Verify the glazier spike under React 19, Next 16 production build, pointer input, viewport resize, and mobile touch; record keep-or-fallback decision in `design.md`.
- [x] 2.3 Install and evaluate stable React-19-compatible Three.js/R3F dependencies in an isolated cabinet spike.
- [x] 2.4 Build a temporary DOM-to-CRT-to-WebGL camera-pullback prototype and identify the continuity limitations of replacing the 2D startup scene.
- [x] 2.5 Remove the rejected WebGL cabinet spike and dependencies while retaining the selected window-manager adapter.

## 3. Presentation Mode Foundation

- [x] 3.1 Add a pre-paint experience initialization script that restores immersive or accessible preference and defaults reduced-motion visitors to accessible mode.
- [x] 3.2 Add the experience provider and switching controls, including Accessible Site before startup and Launch MockOS in the conventional header.
- [x] 3.3 Update the root layout to render canonical server content and the client MockOS gate without a flash or duplicate assistive-technology exposure.
- [x] 3.4 Add no-JavaScript behavior that leaves every conventional canonical page visible and usable.
- [x] 3.5 Add tests for preference restoration, reduced-motion defaulting, mode switching, and current-route preservation after reload.

## 4. Boot and Power Experience

- [x] 4.1 Implement and unit-test the `off → post → splash → desktop` boot reducer, including skip and interrupted-state handling.
- [x] 4.2 Rebuild the powered-off state inside the shared repair-bench scene with the power control on the computer case, sound state, Accessible Site, and keyboard controls.
- [x] 4.3 Author an original startup sound and implement playback from the power gesture with immediate mute controls.
- [x] 4.4 Render POST/BIOS, splash, CRT effects, and desktop inside the same live monitor while the scene moves from full computer to screen view.
- [x] 4.5 Add visible Skip startup, Escape handling, live status announcements, and a maximum authored boot duration within the specified range.
- [x] 4.6 Verify that fresh document loads reboot while client-side application navigation does not.

## 5. Desktop and Window Manager

- [x] 5.1 Define the typed application registry and canonical route-to-application mapping for Welcome, Projects, System Monitor, Resume, Program Disks, Mail, project details, and experiments.
- [x] 5.2 Implement and unit-test desktop/window state for open, close, focus, z-order, move, resize, minimize, maximize, restore, and viewport bounds correction.
- [x] 5.3 Build original desktop icons, wallpaper, icon selection/activation, and the default desktop arrangement.
- [x] 5.4 Build the Start-style launcher, taskbar window buttons, clock, system tray, sound control, and Accessible Site command.
- [x] 5.5 Build the original window frame and controls through the selected window-manager adapter.
- [x] 5.6 Synchronize active applications with canonical paths and handle browser Back/Forward without rebooting.
- [x] 5.7 Implement deep-link startup so each canonical route opens its associated application after boot.
- [x] 5.8 Implement compact mobile mode with one maximized application, touch launcher, app switcher, safe-area support, and no drag/resize.
- [x] 5.9 Test keyboard icon launch, taskbar restore, focus ordering, bounds correction, direct routes, browser history, and mobile switching.

## 6. Shared Content and Accessible Presentation

- [x] 6.1 Extract reusable semantic content/data boundaries from the existing home, project, infrastructure, resume, playground, and contact route components.
- [x] 6.2 Rebuild shared tokens, typography, controls, focus treatment, and conventional page primitives in the selected visual world.
- [x] 6.3 Redesign the conventional accessible header, footer, homepage, and route layouts without MockOS window behavior.
- [x] 6.4 Preserve per-route metadata, canonical URLs, sitemap, robots behavior, and meaningful server-rendered content.
- [x] 6.5 Add print rules that suppress immersive chrome and produce readable project and resume documents.

## 7. Core MockOS Applications

- [x] 7.1 Build the Welcome application and launch it automatically after `/` finishes booting.
- [x] 7.2 Build the Projects folder and Program Disks application from their typed content registries.
- [x] 7.3 Build the project case-study application from typed project content with maximized long-form reading support.
- [x] 7.4 Build shared application loading, empty, error, offline/fallback, and external-destination states.
- [x] 7.5 Verify every primary capability is reachable from desktop icons, launcher, taskbar, and canonical deep links.

## 8. Shared 2D Workstation and Program Disks

- [x] 8.1 Implement and unit-test the shared workstation reducer for bench-off, powering, screen boot/desktop, cabinet browsing, disk selection, insertion, return, experiment opening, and cancellation.
- [x] 8.2 Build one persistent responsive repair-bench stage containing the monitor, live CRT viewport, computer case, drive, and program-disk cabinet.
- [x] 8.3 Move the startup power control onto the computer case and synchronize case/monitor lamps with boot state.
- [x] 8.4 Render the live boot and desktop surfaces inside the monitor viewport without duplicating or remounting application state.
- [x] 8.5 Implement the authored screen-to-bench and bench-to-screen camera transforms with interruption-safe completion events.
- [x] 8.6 Build reusable 2D floppy disks and generate readable experiment labels/details from the typed playground registry.
- [x] 8.7 Measure the selected disk and drive rectangles, animate the disk from cabinet to case drive, sink it behind the bezel, and return to the CRT before opening the experiment.
- [x] 8.8 Implement close/eject/reopen behavior without losing the running desktop workspace.
- [x] 8.9 Add compact mobile framing and an explicit reduced-motion crossfade path.
- [x] 8.10 Verify every typed playground program appears once, mounts the correct experiment, remains directly accessible by canonical URL, and leaves Projects inside the screen.

## 9. Infrastructure System Monitor

- [x] 9.1 Add a client endpoint only if required, returning the existing `PublicInfrastructureSnapshot` and public fetch-state metadata through the current API/cache layer.
- [x] 9.2 Build an application/tree topology from the allowlisted application, workload, replica, health, sync, and service fields.
- [x] 9.3 Add application selection and a detail pane with plain-language health/readiness interpretation and generated time.
- [x] 9.4 Visualize the sanitization boundary and withheld data classes without depicting private topology.
- [x] 9.5 Add purposeful selection and genuine snapshot-change transitions without fabricating live status activity.
- [x] 9.6 Add tests proving the client endpoint and interface consume only the public schema and never the collector contract/raw fixtures.

## 10. Interactive Resume

- [x] 10.1 Build the immersive Resume application with chronological role outline and selected-role detail pane.
- [x] 10.2 Surface progression, engineering work, and real measurable impact without hiding essential content behind hover.
- [x] 10.3 Add technology filtering that emphasizes matching roles and can restore the complete chronology.
- [x] 10.4 Build the accessible linear timeline and complete print layout from the same typed resume data.
- [x] 10.5 Test role navigation, filters, complete-content parity, keyboard behavior, mobile layout, and print output.

## 11. Programs, Mail, and System States

- [x] 11.1 Integrate Program Disks with distinct in-app, iframe, fullscreen, and external launch behavior from the typed playground registry.
- [x] 11.2 Open in-app and iframe experiments in isolated windows, maximize fullscreen entries appropriately, and label external handoffs.
- [x] 11.3 Build the Mail application with local recipient/subject/body controls and an explicit `mailto:` handoff that never claims server delivery.
- [x] 11.4 Preserve GitHub and LinkedIn as explicit external links in both presentation modes.
- [x] 11.5 Build immersive application error dialogs and an accessible conventional 404 for unknown routes.
- [x] 11.6 Add tests for playground delivery modes, mailto encoding, external-link behavior, and presentation-mode error states.

## 12. Performance, Accessibility, and Finish

- [x] 12.1 Verify the final production bundle contains no retired Three.js/R3F/WebGL cabinet code.
- [x] 12.2 Profile shared-stage camera movement and disk insertion, avoiding pointer-frame React rerenders and layout animation.
- [x] 12.3 Run keyboard, screen-reader, contrast, reduced-motion, no-JavaScript, audio-mute, touch, repeated-transition, and interruption checks.
- [x] 12.4 Run unit/component/E2E tests, `pnpm typecheck`, `pnpm lint`, production build, and the Impeccable detector over changed UI files.
- [x] 12.5 Inspect desktop and mobile full-bench, boot, CRT desktop, cabinet, and insertion captures in one bounded review pass and fix resulting material issues in one batch.
- [x] 12.6 Run the Impeccable finish reviewer and complete any required fix/verdict pass.
- [x] 12.7 Update `PRODUCT.md`, the surface brief, and `DESIGN.md` from the approved shipped system and verify the direction contract survives the production build.
- [x] 12.8 Switch immersive mode to the default only after acceptance checks pass, retaining accessible mode as the permanent rollback path.
