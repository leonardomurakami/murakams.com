/**
 * Sanitizer — the explicit sanitization boundary between the collector and the
 * public interface.
 *
 * This is a DEFAULT-DENY allowlist projection: it accepts the raw collector
 * contract shape and emits ONLY fields explicitly present in the public schema.
 * Anything not in the allowlist is dropped by construction, not by convention.
 *
 * ArgoCD itself is never exposed to the Internet; this sanitizer is the only
 * path data takes toward the public interface. Sensitive fields (secrets, env
 * vars, ConfigMap contents, internal IPs, node names, private hostnames,
 * credentials, raw API responses, annotations) are never forwarded.
 */

import type {
  CollectorSnapshot,
  RawApplication,
  RawService,
  RawWorkload,
} from "./collector-contract";
import type {
  HealthState,
  PublicApplication,
  PublicInfrastructureSnapshot,
  PublicService,
  PublicWorkload,
  SyncState,
} from "./public-schema";

const ALLOWED_HEALTH: readonly HealthState[] = ["healthy", "degraded", "unhealthy", "unknown"];
const ALLOWED_SYNC: readonly SyncState[] = ["synced", "out_of_sync", "unknown"];
const ALLOWED_WORKLOAD_KINDS: readonly PublicWorkload["kind"][] = [
  "deployment",
  "statefulset",
  "daemonset",
];

function coerceHealth(value: string): HealthState {
  return (ALLOWED_HEALTH as readonly string[]).includes(value) ? (value as HealthState) : "unknown";
}

function coerceSync(value: string): SyncState {
  return (ALLOWED_SYNC as readonly string[]).includes(value) ? (value as SyncState) : "unknown";
}

function sanitizeWorkload(raw: RawWorkload): PublicWorkload {
  return {
    name: String(raw.name),
    kind: ALLOWED_WORKLOAD_KINDS.includes(raw.kind) ? raw.kind : "deployment",
    desiredReplicas: Number(raw.desiredReplicas) || 0,
    readyReplicas: Number(raw.readyReplicas) || 0,
    health: coerceHealth(raw.health),
  };
}

function sanitizeService(raw: RawService): PublicService {
  return {
    name: String(raw.name),
    port: Number(raw.port) || 0,
    protocol: raw.protocol === "UDP" ? "UDP" : "TCP",
  };
}

function sanitizeApplication(raw: RawApplication): PublicApplication {
  return {
    id: String(raw.name)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-"),
    name: String(raw.name),
    health: coerceHealth(raw.health),
    sync: coerceSync(raw.sync),
    workloads: (raw.workloads ?? []).map(sanitizeWorkload),
    services: (raw.services ?? []).map(sanitizeService),
    statusSummary: String(raw.statusSummary ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
  };
}

export function sanitizeSnapshot(raw: CollectorSnapshot): PublicInfrastructureSnapshot {
  const applications = (raw.applications ?? []).map(sanitizeApplication);
  const summary = {
    total: applications.length,
    healthy: applications.filter((a) => a.health === "healthy").length,
    degraded: applications.filter((a) => a.health === "degraded").length,
    unhealthy: applications.filter((a) => a.health === "unhealthy").length,
    unknown: applications.filter((a) => a.health === "unknown").length,
  };
  return {
    generatedAt: String(raw.generatedAt ?? new Date().toISOString()),
    applications,
    summary,
  };
}
