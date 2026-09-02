# playground Specification

## Purpose

Provides the playground capability: a discovery/catalog layer at `/playground` for small experiments, JavaScript toys, simulations, minigames, and side projects, with a project registry and support for embedding or linking experiments that may live inside the portfolio, in an iframe, fullscreen, or on independent subdomains.

## Requirements

### Requirement: Playground project registry
The system SHALL define a typed in-repo playground project registry. Each registry entry SHALL identify an experiment and how it is delivered: in-app, iframe, fullscreen, or external (independent subdomain/service such as `labs.murakams.com/project-a`).

#### Scenario: Registry entry is typed
- **WHEN** a playground experiment is registered
- **THEN** its entry conforms to the typed registry model including its delivery mode

#### Scenario: External experiment
- **WHEN** a registry entry references an experiment hosted on an independent subdomain
- **THEN** the entry records the external URL and the portfolio links to or embeds it rather than bundling it

### Requirement: Playground index
The system SHALL provide a `/playground` index that catalogs registered experiments and acts as the discovery layer. The index SHALL remain coherent with the primary design system even though individual experiments may be more experimental.

#### Scenario: Index lists experiments
- **WHEN** a visitor opens `/playground`
- **THEN** the page lists registered experiments with enough context to choose one

#### Scenario: Index is design-system coherent
- **WHEN** the `/playground` index is rendered
- **THEN** it follows the primary design system tokens and navigation, distinct from the potentially experimental styling of individual experiments

### Requirement: Experiments are decoupled from the main app
The system SHALL NOT require every experiment to be coupled to the main Next.js application. Experiments MAY run directly inside the portfolio, appear in an iframe, open fullscreen, or live on independent subdomains/services and be embedded or linked from the portfolio.

#### Scenario: In-app experiment
- **WHEN** a registered experiment has delivery mode in-app
- **THEN** it runs within the portfolio application

#### Scenario: Iframe experiment
- **WHEN** a registered experiment has delivery mode iframe
- **THEN** the portfolio embeds it via iframe at its registered source

#### Scenario: External experiment
- **WHEN** a registered experiment has delivery mode external
- **THEN** the portfolio links to or embeds the external service without bundling its code
