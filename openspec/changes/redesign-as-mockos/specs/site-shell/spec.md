## MODIFIED Requirements

### Requirement: Application foundation and routing
The system SHALL be a Next.js application using the App Router, React, and TypeScript. It SHALL expose the routes `/`, `/projects`, `/projects/[slug]`, `/infra`, `/playground`, `/playground/[slug]`, `/resume`, and `/contact`. Each route SHALL support both the immersive MockOS presentation and a conventional accessible presentation.

#### Scenario: Unknown route
- **WHEN** a visitor requests a route that does not exist
- **THEN** the system returns a not-found response appropriate to the active presentation mode and offers navigation back to primary sections

#### Scenario: Immersive route rendering
- **WHEN** an immersive visitor requests a primary route
- **THEN** the system boots and opens the application associated with that route

#### Scenario: Accessible route rendering
- **WHEN** an accessible-mode visitor requests a primary route
- **THEN** the system renders the route as a conventional responsive page without the MockOS shell

#### Scenario: Route rendering
- **WHEN** a visitor requests any primary route
- **THEN** its canonical content is available through the active presentation mode

### Requirement: Primary navigation
The system SHALL provide persistent access to `/`, `/projects`, `/infra`, `/playground`, `/resume`, and `/contact`. Immersive mode SHALL provide access through desktop icons and a launcher; accessible mode SHALL provide conventional navigation. Navigation SHALL indicate current context and SHALL be operable by keyboard and touch.

#### Scenario: Immersive navigation
- **WHEN** a visitor uses the desktop or launcher to activate a section
- **THEN** its application opens or receives focus and its canonical route becomes current

#### Scenario: Accessible navigation
- **WHEN** a visitor uses the accessible site navigation
- **THEN** each primary route is reachable through a conventional link with a visible focus indicator

#### Scenario: Current section indication
- **WHEN** a primary section is active
- **THEN** the active application, taskbar item, or conventional navigation item indicates the current context

#### Scenario: Keyboard navigation
- **WHEN** a visitor uses the keyboard to move through navigation controls
- **THEN** each control is focusable, visibly focused, and keyboard activatable

### Requirement: Responsive site shell
The system SHALL adapt from small mobile to large desktop viewports. Accessible pages SHALL remain readable without horizontal scrolling. Immersive mode SHALL use free windows on desktop-sized viewports and one maximized application at a time on narrow viewports.

#### Scenario: Mobile viewport
- **WHEN** the viewport is narrow or touch-first
- **THEN** the immersive shell disables free drag and resize and presents touch-sized launch and switching controls

#### Scenario: Wide viewport
- **WHEN** the viewport is a large desktop width
- **THEN** the immersive shell permits window movement, resizing, and overlap within usable bounds

### Requirement: Design system tokens
The system SHALL define a single source of truth for the MockOS and accessible-site typography, spacing, color, material, icon, motion, and interactive-state tokens. The immersive visual language SHALL be an original Windows 95/98-era interpretation rather than a copy of Windows assets.

#### Scenario: Consistent token usage
- **WHEN** a page, application, or system component applies visual styling
- **THEN** it references the committed design system rather than introducing an unrelated local visual language

#### Scenario: Original identity
- **WHEN** the MockOS is rendered
- **THEN** its naming, icons, graphics, sounds, and visual assets are original

#### Scenario: Color restraint
- **WHEN** either presentation applies color
- **THEN** it uses committed palette roles and semantic status colors rather than unrelated ad-hoc decoration

### Requirement: Motion principles and reduced-motion support
The immersive presentation MAY use an authored shared-workstation camera move, boot, window, CRT, cabinet, and disk-mount transitions as part of the experience. The full-computer view and CRT view SHALL be spatial states of one 2D scene rather than unrelated layouts. Startup SHALL be skippable, content SHALL remain available through accessible mode, and reduced-motion visitors without a stored override SHALL default to the accessible presentation.

#### Scenario: Reduced motion requested
- **WHEN** a visitor prefers reduced motion and has not explicitly chosen immersive mode
- **THEN** the system presents the accessible site without cinematic transitions

#### Scenario: Startup is skipped
- **WHEN** a visitor invokes the startup skip affordance
- **THEN** no remaining startup animation delays access to the desktop

#### Scenario: Navigation not delayed
- **WHEN** a visitor switches normal applications after boot
- **THEN** decorative animation does not block the requested application from becoming available

### Requirement: SEO and metadata baseline
The system SHALL provide per-route metadata and meaningful server-rendered HTML for every canonical route regardless of presentation mode. The MockOS SHALL be a client presentation layer and SHALL NOT be the only source of substantive route content.

#### Scenario: Crawler loads a route
- **WHEN** a crawler loads a primary route without executing JavaScript
- **THEN** the route's meaningful conventional content and unique metadata are present in the response

#### Scenario: Immersive deep link
- **WHEN** a visitor enters through a deep link in immersive mode
- **THEN** the same canonical URL is retained while the corresponding MockOS application opens after boot

#### Scenario: Route metadata
- **WHEN** a crawler or visitor loads any primary route
- **THEN** the response includes a unique title and description appropriate to that section

#### Scenario: Server-rendered content
- **WHEN** a crawler loads a primary route without executing JavaScript
- **THEN** the meaningful conventional content of that route is present in the HTML response

### Requirement: Accessibility baseline
The accessible presentation SHALL meet WCAG AA expectations for semantic HTML, keyboard operation, visible focus, body-text contrast, reduced motion, and alternatives for non-decorative media. The immersive presentation SHALL always expose a direct way to enter that accessible presentation.

#### Scenario: Accessible bypass
- **WHEN** a visitor cannot or does not wish to use the immersive shell
- **THEN** they can select Accessible Site before startup or from the running system

#### Scenario: No JavaScript
- **WHEN** JavaScript does not execute
- **THEN** the conventional accessible route content remains visible and usable

#### Scenario: Color contrast
- **WHEN** body text is rendered in the accessible presentation
- **THEN** its contrast meets WCAG AA

#### Scenario: Image alternatives
- **WHEN** a non-decorative image or visual is rendered in the accessible presentation
- **THEN** it provides a text alternative describing its purpose
