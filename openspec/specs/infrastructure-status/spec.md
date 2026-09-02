# infrastructure-status Specification

## Purpose

Provides the public infrastructure status capability: an explicitly allowlisted, typed public schema, a sanitization boundary and collector contract between Kubernetes/ArgoCD and the public interface, realistic mocked sanitized fixtures for initial development, and a custom `/infra` showcase UI that communicates a real live system while remaining understandable to non-Kubernetes visitors.

## Requirements

### Requirement: Sanitization boundary
The system SHALL enforce a sanitization boundary between Kubernetes/ArgoCD and the public interface with the flow: Kubernetes/ArgoCD → private collector → explicit sanitizer → small public data model → portfolio API/cache → `/infra`. ArgoCD itself SHALL NOT be exposed to the Internet.

#### Scenario: ArgoCD remains private
- **WHEN** the public infrastructure interface is operating
- **THEN** no ArgoCD endpoint, token, or raw ArgoCD API response is reachable from the public Internet

#### Scenario: Allowlisted data only
- **WHEN** data crosses the boundary toward the public interface
- **THEN** only explicitly allowlisted fields in the public data model are emitted; all other fields are stripped by the sanitizer

### Requirement: Public data model is small and typed
The system SHALL define an intentionally small, typed public schema for infrastructure status. Allowlisted public information includes: applications, deployments/workloads, services, desired vs ready replicas, healthy/unhealthy/degraded state, ArgoCD sync state, application health, and high-level uptime/status where available.

#### Scenario: Typed public schema
- **WHEN** the public interface consumes infrastructure data
- **THEN** the data conforms to the typed public schema and malformed data is rejected

#### Scenario: Replica state is public
- **WHEN** a workload's desired and ready replica counts are emitted
- **THEN** both counts are available in the public model

### Requirement: Sensitive information never crosses the boundary
The system SHALL NEVER expose, across the sanitization boundary: Kubernetes manifests, secrets, environment variables, ConfigMap contents, internal IP addresses, node names, private hostnames, repository credentials, cluster credentials, ArgoCD tokens, annotations unless explicitly allowlisted, container registry credentials, arbitrary Kubernetes API objects, or raw ArgoCD API responses.

#### Scenario: Secret material is stripped
- **WHEN** the collector observes a Secret or secret reference
- **THEN** no part of its contents or reference appears in the public model

#### Scenario: Internal addressing is stripped
- **WHEN** the collector observes internal IPs, node names, or private hostnames
- **THEN** none of those values appear in the public model

#### Scenario: Raw API responses are not forwarded
- **WHEN** the collector queries Kubernetes or ArgoCD
- **THEN** raw API responses are not forwarded across the boundary; only sanitized, allowlisted fields are emitted

### Requirement: Collector contract and mock fixtures
The system SHALL define the collector contract (the shape the collector emits into the sanitizer) independently enough that the frontend can develop against realistic mocked sanitized fixtures before live cluster integration exists. Live Kubernetes/ArgoCD collection is out of the initial implementation scope; the boundary, contract, mock fixtures, and intended architecture SHALL be established now.

#### Scenario: Frontend develops against fixtures
- **WHEN** the frontend renders `/infra` before live collection exists
- **THEN** it consumes realistic mocked sanitized fixtures that conform to the public schema

#### Scenario: Collector contract is documented
- **WHEN** a future implementation wires live collection
- **THEN** it implements the already-defined collector contract and sanitizer, requiring no change to the public schema or frontend

### Requirement: Custom infrastructure UI
The system SHALL provide a custom-built `/infra` UI. It SHALL NOT attempt to reproduce the ArgoCD interface. The UI SHALL visually communicate that this is a real live system with applications and current state while remaining understandable to people who do not use Kubernetes daily.

#### Scenario: Understandable to non-experts
- **WHEN** a visitor unfamiliar with Kubernetes views `/infra`
- **THEN** application status and health are presented in plain terms without requiring Kubernetes knowledge to interpret

#### Scenario: Not an ArgoCD clone
- **WHEN** the `/infra` UI is rendered
- **THEN** it does not mirror the ArgoCD interface layout or terminology as its primary presentation

### Requirement: State change animation
The `/infra` UI SHALL support subtle animation for status and state changes. Animation SHALL respect `prefers-reduced-motion`.

#### Scenario: State change is animated subtly
- **WHEN** an application's health or sync state changes
- **THEN** the UI transitions to the new state with a subtle, non-distracting animation

#### Scenario: Reduced motion respected
- **WHEN** a visitor has `prefers-reduced-motion: reduce`
- **THEN** state changes update without non-essential animation
