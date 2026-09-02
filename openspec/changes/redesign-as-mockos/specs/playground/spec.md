## MODIFIED Requirements

### Requirement: Playground index
The system SHALL present every registered experiment as a labeled floppy disk in immersive mode and as a conventional catalog in accessible mode. Both presentations SHALL derive labels and delivery behavior from the typed registry.

#### Scenario: Immersive program disks
- **WHEN** an immersive visitor opens Program Disks or Playground
- **THEN** the view pulls back from the live CRT to the shared repair-bench scene and registered experiments appear as labeled floppy disks with their delivery behavior identifiable

#### Scenario: Accessible catalog
- **WHEN** an accessible visitor opens `/playground`
- **THEN** the page lists experiments with enough context and delivery information to choose one

#### Scenario: Index lists experiments
- **WHEN** a visitor opens `/playground` in either presentation
- **THEN** every registered experiment is discoverable with enough context to choose one

#### Scenario: Index is design-system coherent
- **WHEN** the Playground or Program Disks index is rendered
- **THEN** its discovery surface follows the active presentation's committed design system while individual experiments may retain their own identity

#### Scenario: Visitor mounts a program disk
- **WHEN** an immersive visitor confirms a selected program disk
- **THEN** the disk visibly leaves the cabinet, enters the computer-case drive, and the view returns to the CRT before the experiment opens

#### Scenario: External destination
- **WHEN** an experiment opens an external destination
- **THEN** the interface clearly communicates that the visitor will leave the portfolio

### Requirement: Experiments are decoupled from the main app
The system SHALL NOT require every experiment to be coupled to the main Next.js application. In immersive mode, in-app and iframe experiments MAY open in MockOS windows, fullscreen experiments MAY maximize, and external experiments SHALL remain external.

#### Scenario: In-app experiment
- **WHEN** an immersive visitor launches an in-app experiment
- **THEN** it runs inside an application window or maximized application surface

#### Scenario: Iframe experiment
- **WHEN** an immersive visitor launches an iframe experiment
- **THEN** it opens inside an isolated application window with a clear close or external-open action

#### Scenario: External experiment
- **WHEN** a visitor launches an external experiment
- **THEN** the registered external service opens without bundling its code into the portfolio
