## MODIFIED Requirements

### Requirement: Projects index
The system SHALL provide a conventional `/projects` index in accessible mode and a Projects folder inside the running MockOS in immersive mode. Both presentations SHALL use the typed project model and provide enough title, description, status, and technology context to choose a project.

#### Scenario: Accessible index lists projects
- **WHEN** an accessible visitor opens `/projects`
- **THEN** the page lists projects as conventional selectable entries with title, description, status, and technologies

#### Scenario: Immersive index opens folder
- **WHEN** an immersive visitor opens `/projects` or launches Projects
- **THEN** the Projects folder opens within the live CRT desktop without leaving the screen view

#### Scenario: Index lists projects
- **WHEN** a visitor opens `/projects`
- **THEN** every project is represented with enough typed context to choose one in the active presentation

#### Scenario: Index entry links to detail
- **WHEN** a visitor selects a project from the index experience
- **THEN** its canonical `/projects/[slug]` case study opens

### Requirement: Project detail case study
The system SHALL provide a `/projects/[slug]` route that renders the full case study and SHALL open the same substantive content inside a MockOS project application in immersive mode.

#### Scenario: Existing accessible project
- **WHEN** an accessible visitor requests an existing project slug
- **THEN** the conventional page renders the complete case study

#### Scenario: Existing immersive project
- **WHEN** an immersive visitor requests an existing project slug
- **THEN** the system boots and opens the complete case study in a project application without requiring folder navigation

#### Scenario: Existing project
- **WHEN** a visitor requests an existing `/projects/[slug]`
- **THEN** the complete project case study renders through the active presentation

#### Scenario: Unknown project
- **WHEN** a visitor requests a project slug that does not exist
- **THEN** the system returns the presentation-mode-appropriate not-found response

## ADDED Requirements

### Requirement: Projects remain native to the computer
Project discovery and case-study reading SHALL remain within the live MKS/98 screen rather than reusing the physical removable-media interaction reserved for playground programs.

#### Scenario: Visitor exits a project
- **WHEN** a visitor closes a project application
- **THEN** the system returns to the running MockOS desktop and allows the Projects folder to be opened again
