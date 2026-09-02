# site-shell Specification

## Purpose

Provides the application foundation, routing, primary navigation, responsive layout shell, design system, and cross-cutting non-functional baselines (SEO/metadata, accessibility, reduced-motion) that all other portfolio capabilities build on.

## Requirements

### Requirement: Application foundation and routing
The system SHALL be a greenfield Next.js application using the App Router, React, and TypeScript. It SHALL expose the routes `/`, `/projects`, `/projects/[slug]`, `/infra`, `/playground`, `/resume`, and `/contact`. No code, layout, design system, or architecture from the prior `murakams.com` site SHALL be inherited.

#### Scenario: Unknown route
- **WHEN** a visitor requests a route that does not exist
- **THEN** the system returns a not-found response that is on-brand and offers navigation back to primary sections

#### Scenario: Route rendering
- **WHEN** a visitor requests any primary route
- **THEN** the route renders inside the shared site shell with primary navigation visible

### Requirement: Primary navigation
The system SHALL provide persistent primary navigation linking to `/`, `/projects`, `/infra`, `/playground`, `/resume`, and `/contact`. Navigation SHALL indicate the current section and SHALL be operable by keyboard and touch.

#### Scenario: Current section indication
- **WHEN** a visitor is on a route belonging to a primary section
- **THEN** the navigation visually indicates that section as current

#### Scenario: Keyboard navigation
- **WHEN** a visitor uses the keyboard to move through navigation items
- **THEN** each item is focusable with a visible focus indicator and activatable with the keyboard

### Requirement: Responsive site shell
The system SHALL provide a responsive layout shell that adapts from small mobile to large desktop viewports. Content SHALL remain readable and operable across breakpoints without horizontal scrolling at standard viewport widths.

#### Scenario: Mobile viewport
- **WHEN** the viewport is a small mobile width
- **THEN** the shell renders a navigation pattern appropriate to mobile (e.g. a collapsed menu) and content remains within the viewport

#### Scenario: Wide viewport
- **WHEN** the viewport is a large desktop width
- **THEN** content is constrained to a defined maximum container width and does not stretch edge-to-edge indefinitely

### Requirement: Design system tokens
The system SHALL define a single source of truth for design tokens covering typography scale, spacing scale, container widths, color tokens (neutral base with a restrained accent), surface treatment, border treatment, and interactive states. Tokens SHALL be consumed consistently across all pages and components.

#### Scenario: Consistent token usage
- **WHEN** any page or component applies color, spacing, typography, or radius
- **THEN** it references a defined token rather than an ad-hoc literal

#### Scenario: Color restraint
- **WHEN** the design system is applied across the site
- **THEN** the palette is a neutral base with a single restrained accent, avoiding aggressive multi-color UI

### Requirement: Dark mode support
The system SHALL support a dark color mode. Dark mode SHALL be available but SHALL NOT be assumed as the default state solely because the site is a developer portfolio. The system SHALL respect the visitor's `prefers-color-scheme` preference on first visit and allow an explicit override that persists.

#### Scenario: First visit with system preference
- **WHEN** a visitor with `prefers-color-scheme: dark` loads the site for the first time
- **THEN** the site renders in dark mode without a flash of the wrong theme

#### Scenario: Explicit override persistence
- **WHEN** a visitor explicitly selects a color mode
- **THEN** that choice persists across navigations and reloads and overrides the system preference

### Requirement: Monospace usage is bounded
Monospace typography MAY be used for technical metadata (labels, identifiers, status, code). Monospace SHALL NOT dominate the site's body content or headings.

#### Scenario: Technical metadata
- **WHEN** the system renders technical metadata such as a status label or identifier
- **THEN** it MAY use a monospace face

#### Scenario: Body and headings
- **WHEN** the system renders body copy or headings
- **THEN** it uses the primary non-monospace typeface

### Requirement: Motion principles and reduced-motion support
The system SHALL use motion only to communicate navigation, state transitions, hierarchy, or interaction feedback. It SHALL NOT include constant ambient movement, scroll hijacking, animations that delay navigation, or decorative animation on every element. The system SHALL respect `prefers-reduced-motion` by disabling or simplifying non-essential motion.

#### Scenario: Reduced motion requested
- **WHEN** a visitor has `prefers-reduced-motion: reduce` set
- **THEN** non-essential animations are disabled or replaced with near-instant transitions and no content is hidden or made inaccessible

#### Scenario: Navigation not delayed
- **WHEN** a visitor navigates between routes
- **THEN** no animation blocks or meaningfully delays the navigation from completing

### Requirement: SEO and metadata baseline
The system SHALL provide per-route metadata (title, description, Open Graph tags) and a site-wide metadata baseline. It SHALL render meaningful, crawlable HTML for primary content rather than requiring client-side execution to appear.

#### Scenario: Route metadata
- **WHEN** a crawler or visitor loads any primary route
- **THEN** the response includes a unique title and description appropriate to that section

#### Scenario: Server-rendered content
- **WHEN** a crawler loads a primary content route without executing JavaScript
- **THEN** the meaningful content of that route is present in the HTML response

### Requirement: Accessibility baseline
The system SHALL meet an accessibility baseline across all pages: semantic HTML, keyboard operability, visible focus indicators, sufficient color contrast for body text, and text alternatives for non-decorative images.

#### Scenario: Color contrast
- **WHEN** body text is rendered on its background
- **THEN** the contrast ratio meets WCAG AA

#### Scenario: Image alternatives
- **WHEN** a non-decorative image is rendered
- **THEN** it provides a text alternative describing its purpose
