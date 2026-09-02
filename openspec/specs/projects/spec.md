# projects Specification

## Purpose

Provides the projects capability: a typed in-repo project content model, a `/projects` index, and `/projects/[slug]` case-study detail pages that treat projects as substantial engineering work rather than GitHub repository cards.

## Requirements

### Requirement: Project content model
The system SHALL define a typed in-repo content model for projects stored in the repository (no CMS). Each project SHALL support: title, short description, project status, technologies, visual material (screenshots, video, interactive demo, or other), problem being solved, architecture, implementation details, interesting engineering challenges, important design decisions and trade-offs, and links to repository and/or live application.

#### Scenario: Project data is typed
- **WHEN** a project is authored in the repository
- **THEN** its content is validated against the typed project model and invalid or missing required fields are surfaced during build/development

#### Scenario: Optional visual material
- **WHEN** a project includes visual material
- **THEN** the model accepts one or more of screenshots, video, interactive demo, or other visual material types

### Requirement: Projects index
The system SHALL provide a `/projects` index listing projects in a way that communicates them as engineering work, not as GitHub repository cards. Each entry SHALL link to its detail page.

#### Scenario: Index lists projects
- **WHEN** a visitor opens `/projects`
- **THEN** the page lists projects with enough context (title, short description, status, technologies) to choose one to explore

#### Scenario: Index entry links to detail
- **WHEN** a visitor selects a project from the index
- **THEN** they are taken to `/projects/[slug]` for that project

### Requirement: Project detail case study
The system SHALL provide a `/projects/[slug]` route that renders a full project case study covering the problem, architecture, implementation details, engineering challenges, design decisions and trade-offs, visual material, and links to repository/live application.

#### Scenario: Existing project
- **WHEN** a visitor requests `/projects/[slug]` for a project that exists
- **THEN** the page renders the full case study content for that project

#### Scenario: Unknown project
- **WHEN** a visitor requests `/projects/[slug]` for a slug that does not exist
- **THEN** the system returns an on-brand not-found response

### Requirement: One representative project detail page
The initial implementation SHALL ship at least one fully populated representative project detail page that exercises the full content model.

#### Scenario: Representative project is complete
- **WHEN** a visitor opens the representative project detail page
- **THEN** all sections of the content model are populated with real content

### Requirement: Project status representation
The system SHALL represent project status (for example: active, maintenance, completed, archived) consistently across the index and detail pages.

#### Scenario: Status displayed consistently
- **WHEN** a project with a given status is shown on the index and on its detail page
- **THEN** the status is represented with the same label and visual treatment in both places
