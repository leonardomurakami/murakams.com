## Why

The current portfolio is clear but visually restrained and structurally conventional, so it does not create the playful, memorable exploration the site should demonstrate. Rebuilding the presentation as a fictional old-PC operating system makes interaction part of the portfolio while preserving direct access to the substantive engineering content.

## What Changes

- **BREAKING:** Replace the current shared page shell as the default presentation with a full-screen Windows 95/98-inspired, originally designed MockOS.
- Add an opt-in power-on interaction, original startup sound, authored boot sequence, desktop, launcher, taskbar, and full window management.
- Keep all canonical routes server-rendered and add a persistent Accessible Site mode that bypasses boot, windows, audio, and cinematic interactions entirely.
- Make the desktop and initially opened Welcome window the homepage.
- Build one persistent 2D repair-bench scene shared by power-on, boot, desktop, and removable-media interactions. The visitor powers on the computer from the case, the view moves into the CRT for MKS/98, and Program Disks reverses that move to reveal the same computer and cabinet.
- Present Projects as a folder inside MKS/98 while preserving complete canonical case studies.
- Present each typed playground experiment as a labeled floppy disk. Selecting and mounting a disk animates it entering the computer drive before the corresponding experiment opens.
- Replace the infrastructure card grid with an explorable System Monitor topology/details interface while preserving the existing sanitized schema and boundary.
- Replace the passive resume timeline with an interactive Resume application containing role navigation, technology filtering, impact callouts, and a printable linear view.
- Present contact as a local mail application that still uses `mailto:`.
- Add mobile-specific MockOS behavior with one maximized application at a time.
- Use only original OS naming, icons, sounds, and graphics; do not reproduce Microsoft assets.

## Capabilities

### New Capabilities

- `mock-os-experience`: Power, boot, experience-mode selection, desktop, application registry, URL-backed window manager, responsive behavior, and immersive error handling.

### Modified Capabilities

- `site-shell`: Replace the default visual shell while preserving canonical routes, server-rendered content, metadata, and an accessible conventional presentation.
- `home`: Make the desktop plus Welcome application the immersive homepage.
- `projects`: Present typed projects as files inside a Projects folder while retaining canonical project routes and full case-study applications.
- `infrastructure-status`: Replace static cards with an interactive topology and detail view using only sanitized public data.
- `resume`: Add interactive role navigation, technology filters, impact emphasis, and print behavior.
- `playground`: Present registered experiments as mountable floppy disks within the shared 2D workstation scene while retaining delivery modes.
- `contact`: Present contact as a mail application while preserving `mailto:` as the only send mechanism.

## Impact

- Root layout, route pages, shared design tokens/primitives, navigation, motion, and all main feature views will be redesigned.
- New client-side MockOS shell, boot and desktop state machines, shared 2D workstation scene, application registry, window-manager adapter, experience preference layer, and original media assets will be added.
- The shared workstation animation uses DOM/CSS and the existing motion library; the headless window manager remains isolated behind a local adapter.
- No WebGL dependency or DOM/WebGL handoff is required.
- The existing project, resume, playground, and infrastructure schemas remain the sources of truth.
- Infrastructure security guarantees and the public allowlist do not change.