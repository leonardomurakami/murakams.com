## Purpose

Provides the resume capability: a web-native, chronological career/story presentation at `/resume` (not a rendered PDF), backed by structured in-repo data that captures company, role, time period, role progression, responsibilities, significant engineering work, measurable impact, and technologies.

## ADDED Requirements

### Requirement: Resume data model
The system SHALL define a typed in-repo resume data model (no CMS). Each entry SHALL support: company, role, time period, progression between roles, major responsibilities, significant engineering work, measurable impact, and technologies where relevant.

#### Scenario: Resume data is typed
- **WHEN** a resume entry is authored in the repository
- **THEN** its content is validated against the typed resume model and invalid or missing required fields are surfaced during build/development

#### Scenario: Role progression
- **WHEN** a person progresses between roles at the same company
- **THEN** the data model represents the progression as distinct role entries tied to the same company with their own time periods

### Requirement: Chronological career presentation
The system SHALL present `/resume` as a chronological career/story format that makes career progression and engineering impact easy to understand, rather than rendering a PDF resume.

#### Scenario: Chronological ordering
- **WHEN** a visitor views `/resume`
- **THEN** roles are presented in chronological order with clear time periods

#### Scenario: Impact is surfaced
- **WHEN** a visitor views a role entry
- **THEN** measurable impact and significant engineering work are presented as first-class content, not hidden

### Requirement: Resume content is repository data
Resume content SHALL be stored as structured repository data. The system SHALL NOT require a CMS or external data source for the resume in the initial implementation.

#### Scenario: No external data source
- **WHEN** the resume is rendered
- **THEN** all content is sourced from structured in-repo data
