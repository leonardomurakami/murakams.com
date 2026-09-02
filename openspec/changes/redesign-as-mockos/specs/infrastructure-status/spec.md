## MODIFIED Requirements

### Requirement: Custom infrastructure UI
The system SHALL provide an explorable Infrastructure/System Monitor interface in immersive and accessible presentations. It SHALL visualize applications and their sanitized relationships without reproducing the ArgoCD interface or exposing private topology.

#### Scenario: Visitor explores an application
- **WHEN** a visitor selects an application in the topology or tree
- **THEN** the interface shows its public health, sync state, workload readiness, service summaries, and update time in a detail region

#### Scenario: Understandable to non-experts
- **WHEN** a visitor unfamiliar with Kubernetes views the interface
- **THEN** health and readiness are explained in plain language and are not communicated by color alone

#### Scenario: Not an ArgoCD clone
- **WHEN** the interface is rendered
- **THEN** it uses the portfolio's original System Monitor model rather than mirroring ArgoCD layout or terminology

### Requirement: State change animation
The infrastructure interface SHALL support purposeful transitions for selection and genuine status changes and SHALL not simulate activity unsupported by the current data source.

#### Scenario: Genuine state change
- **WHEN** a new sanitized snapshot changes application health or sync state
- **THEN** the affected representation transitions to the new state and preserves a textual label

#### Scenario: State change is animated subtly
- **WHEN** an application's health or sync state genuinely changes
- **THEN** the interface communicates the new state with a purposeful non-distracting transition

#### Scenario: Fixture-backed snapshot
- **WHEN** the interface is using a static fixture
- **THEN** it does not imply that periodic fake changes are live infrastructure events

#### Scenario: Reduced motion
- **WHEN** an accessible visitor prefers reduced motion
- **THEN** state and selection changes occur without non-essential animation

#### Scenario: Reduced motion respected
- **WHEN** a visitor uses the reduced-motion accessible presentation
- **THEN** state changes update without non-essential animation

## ADDED Requirements

### Requirement: Sanitization boundary visualization
The interface SHALL explain the boundary between private Kubernetes/ArgoCD collection and the allowlisted public model without depicting or inferring sensitive internal details.

#### Scenario: Visitor inspects the boundary
- **WHEN** the sanitization explanation is opened
- **THEN** it shows the public flow and explicitly identifies classes of data that are withheld
