## Purpose

Provides the homepage at `/`: a concise introduction to who I am, my current SRE/engineering focus, a preview of selected projects, a small preview of public infrastructure status, and links into the deeper sections of the site.

## ADDED Requirements

### Requirement: Concise homepage introduction
The homepage SHALL present a short introduction stating who I am and what I work on, plus my current engineering/SRE focus. The homepage SHALL NOT become a giant landing-page version of the entire website.

#### Scenario: First impression
- **WHEN** a visitor lands on `/`
- **THEN** the page presents a short introduction and current focus within the first viewport without requiring scroll

### Requirement: Selected projects preview
The homepage SHALL show a small, curated preview of selected projects that links into the `/projects` section and individual project detail pages.

#### Scenario: Navigating to a project
- **WHEN** a visitor selects a project from the homepage preview
- **THEN** they are taken to that project's `/projects/[slug]` detail page

#### Scenario: Navigating to all projects
- **WHEN** a visitor selects the projects section affordance on the homepage
- **THEN** they are taken to `/projects`

### Requirement: Public infrastructure status preview
The homepage SHALL show a small preview of public infrastructure status (for example, a summary of healthy/degraded applications) that links into `/infra`.

#### Scenario: Status preview links to detail
- **WHEN** a visitor selects the infrastructure preview
- **THEN** they are taken to `/infra`

### Requirement: Links into deeper sections
The homepage SHALL provide clear paths into `/projects`, `/infra`, `/playground`, `/resume`, and `/contact` so visitors can reach deeper content from the entry point.

#### Scenario: Section discoverability
- **WHEN** a visitor views the homepage
- **THEN** each primary deeper section is reachable from the homepage content or navigation
