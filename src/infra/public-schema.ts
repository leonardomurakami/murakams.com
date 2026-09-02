/**
 * Public infrastructure schema — the intentionally small, typed data model
 * that is allowed to cross the sanitization boundary and reach the public
 * portfolio interface.
 *
 * This is the ONLY shape the /infra UI and portfolio API/cache layer consume.
 * Every field here is explicitly allowlisted by src/infra/sanitizer.ts.
 *
 * Sensitive information (secrets, env vars, ConfigMap contents, internal IPs,
 * node names, private hostnames, credentials, annotations unless allowlisted,
 * raw Kubernetes/ArgoCD API responses, etc.) MUST NEVER appear here.
 */

export type HealthState = "healthy" | "degraded" | "unhealthy" | "unknown";

export type SyncState = "synced" | "out_of_sync" | "unknown";

export type WorkloadKind = "deployment" | "statefulset" | "daemonset";

/**
 * A sanitized workload. Only desired/ready replica counts are public — never
 * pod names, node names, IPs, images with registry credentials, or annotations.
 */
export interface PublicWorkload {
  readonly name: string;
  readonly kind: WorkloadKind;
  readonly desiredReplicas: number;
  readonly readyReplicas: number;
  readonly health: HealthState;
}

/**
 * A sanitized service. Only a public-facing label and port summary are exposed —
 * never internal cluster IPs, external IPs, or private hostnames.
 */
export interface PublicService {
  readonly name: string;
  readonly port: number;
  readonly protocol: "TCP" | "UDP";
}

/**
 * A sanitized ArgoCD application. Only sync/health state and a friendly name
 * are exposed — never the source repo URL with credentials, target revision
 * secrets, or raw ArgoCD API fields.
 */
export interface PublicApplication {
  readonly id: string;
  readonly name: string;
  readonly health: HealthState;
  readonly sync: SyncState;
  readonly workloads: readonly PublicWorkload[];
  readonly services: readonly PublicService[];
  /** High-level uptime/status where available, as a human-readable string. */
  readonly statusSummary: string;
  readonly updatedAt: string; // ISO 8601
}

/**
 * Top-level public snapshot. The portfolio API/cache layer returns this shape.
 */
export interface PublicInfrastructureSnapshot {
  readonly generatedAt: string; // ISO 8601
  readonly applications: readonly PublicApplication[];
  /** Aggregate counts derived from applications, for quick summaries. */
  readonly summary: {
    readonly total: number;
    readonly healthy: number;
    readonly degraded: number;
    readonly unhealthy: number;
    readonly unknown: number;
  };
}
