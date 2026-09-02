# contact Specification

## Purpose

Provides the contact capability: a deliberately simple `/contact` page whose primary interaction is contacting me via email using a `mailto:` link, with optional social/professional links.

## Requirements

### Requirement: Email primary interaction
The `/contact` page SHALL provide a `mailto:` link as the primary contact interaction. The system SHALL NOT require a backend form-processing service to initiate contact.

#### Scenario: Email contact
- **WHEN** a visitor selects the primary contact affordance
- **THEN** their email client opens addressed to my contact address via a `mailto:` link

### Requirement: Optional social/professional links
The `/contact` page MAY show social or professional links (for example GitHub, LinkedIn) where appropriate.

#### Scenario: Social links open externally
- **WHEN** a visitor selects a social/professional link
- **THEN** it opens the corresponding external profile

### Requirement: Contact is deliberately simple
The contact page SHALL remain simple and SHALL NOT introduce a database, authentication, or backend service solely for contact in the initial implementation.

#### Scenario: No backend required for contact
- **WHEN** the contact page is used
- **THEN** no backend service, database, or authentication is required to initiate contact
