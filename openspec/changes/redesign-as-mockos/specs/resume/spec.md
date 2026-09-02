## MODIFIED Requirements

### Requirement: Chronological career presentation
The system SHALL preserve a chronological career story while allowing immersive visitors to select roles from an outline and inspect responsibilities, engineering work, measurable impact, progression, and technologies in a focused detail pane. Accessible and print presentations SHALL remain linear and semantic.

#### Scenario: Visitor selects a role
- **WHEN** an immersive visitor selects a role from the resume outline
- **THEN** the detail pane presents that role's full period, progression, work, impact, and technologies

#### Scenario: Chronological context remains clear
- **WHEN** a visitor changes the selected role or applies a technology filter
- **THEN** the order and progression between roles remain understandable

#### Scenario: Chronological ordering
- **WHEN** a visitor views the resume in either presentation
- **THEN** roles are available in chronological order with clear time periods

#### Scenario: Impact is surfaced
- **WHEN** a role contains measurable impact
- **THEN** those real metrics are presented as first-class content rather than hidden behind interaction

## ADDED Requirements

### Requirement: Technology exploration
The resume application SHALL allow visitors to select a listed technology and identify roles in which it was used without permanently hiding the complete career history.

#### Scenario: Technology filter applied
- **WHEN** a visitor selects a technology
- **THEN** matching roles are emphasized and a clear control restores the unfiltered view

### Requirement: Printable resume
The resume capability SHALL provide a print-friendly conventional layout without MockOS desktop or window chrome.

#### Scenario: Visitor prints resume
- **WHEN** the resume is printed or print preview opens
- **THEN** the output uses a readable linear document layout containing the complete resume content
