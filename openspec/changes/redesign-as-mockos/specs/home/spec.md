## MODIFIED Requirements

### Requirement: Concise homepage introduction
In immersive mode, the homepage SHALL be the post-boot desktop with a Welcome/Home application initially open. The Welcome content SHALL identify Leonardo Murakami, describe his SRE/software-engineering focus, and expose real proof without becoming a conventional long landing page. Accessible mode SHALL present the same substance as a conventional responsive homepage.

#### Scenario: Immersive first impression
- **WHEN** the boot sequence completes on `/`
- **THEN** the desktop appears with the Welcome/Home application open and primary applications discoverable

#### Scenario: Accessible first impression
- **WHEN** an accessible-mode visitor opens `/`
- **THEN** the page presents the introduction, current focus, and primary navigation without startup or window chrome

#### Scenario: First impression
- **WHEN** a visitor completes immersive startup or opens the accessible homepage
- **THEN** the introduction and current focus are available in the initial experience without requiring navigation to another section

### Requirement: Selected projects preview
The homepage SHALL provide a concise path into the Projects folder rather than duplicate the complete project library.

#### Scenario: Immersive project entry
- **WHEN** an immersive visitor activates Projects from the homepage
- **THEN** the Projects folder opens inside MKS/98

#### Scenario: Accessible project entry
- **WHEN** an accessible visitor activates Projects
- **THEN** the conventional `/projects` index opens

#### Scenario: Navigating to a project
- **WHEN** a visitor selects a specific project from a homepage preview or the Projects folder
- **THEN** that project's canonical `/projects/[slug]` content opens in the active presentation

#### Scenario: Navigating to all projects
- **WHEN** a visitor selects the general Projects affordance
- **THEN** the project index or Projects folder opens in the active presentation

### Requirement: Public infrastructure status preview
The homepage SHALL show a compact, real public infrastructure summary sourced from the sanitized snapshot and SHALL open the Infrastructure/System Monitor capability for detail.

#### Scenario: Status preview opens monitor
- **WHEN** an immersive visitor activates the infrastructure preview
- **THEN** the System Monitor application opens or receives focus

#### Scenario: Accessible status preview
- **WHEN** an accessible visitor activates the infrastructure preview
- **THEN** the conventional `/infra` page opens

#### Scenario: Status preview links to detail
- **WHEN** a visitor selects the public infrastructure status preview
- **THEN** the `/infra` content opens through the active presentation

### Requirement: Links into deeper sections
The post-boot desktop and launcher SHALL make Projects, Infrastructure, Playground, Resume, and Contact discoverable. The accessible homepage SHALL provide conventional links to the same sections.

#### Scenario: Desktop discoverability
- **WHEN** a visitor views the desktop after boot
- **THEN** each primary section is represented by a labeled application icon or launcher item

#### Scenario: Accessible discoverability
- **WHEN** a visitor views the accessible homepage
- **THEN** each primary section is reachable by a conventional link

#### Scenario: Section discoverability
- **WHEN** a visitor reaches the homepage in either presentation
- **THEN** Projects, Infrastructure, Playground, Resume, and Contact are reachable from the visible navigation model
