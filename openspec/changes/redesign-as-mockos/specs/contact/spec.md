## MODIFIED Requirements

### Requirement: Email primary interaction
The contact capability SHALL present email as a mail application in immersive mode and a conventional email action in accessible mode. Sending SHALL always hand off through a `mailto:` URL; the site SHALL NOT claim to transmit a message itself.

#### Scenario: Immersive email contact
- **WHEN** an immersive visitor activates Send in the Mail application
- **THEN** the visitor's email client opens through a `mailto:` URL containing the configured recipient and any locally entered subject or body

#### Scenario: Accessible email contact
- **WHEN** an accessible visitor activates the primary contact action
- **THEN** their email client opens through a `mailto:` URL addressed to Leonardo

#### Scenario: Email contact
- **WHEN** a visitor selects the primary contact affordance in either presentation
- **THEN** their email client opens addressed to Leonardo through a `mailto:` URL

#### Scenario: Handoff is explicit
- **WHEN** the visitor activates Send
- **THEN** the interface makes clear that the system is opening an external email client rather than sending from the portfolio

### Requirement: Contact is deliberately simple
The contact capability SHALL NOT introduce a database, authentication, stored message state, or backend message-processing service.

#### Scenario: No backend required
- **WHEN** contact is initiated from either presentation mode
- **THEN** no portfolio backend, database, or authentication is required

#### Scenario: No backend required for contact
- **WHEN** the contact capability is used
- **THEN** no backend service, database, or authentication is required to initiate contact
