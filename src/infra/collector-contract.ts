/**
 * Collector contract — the shape a future private collector emits into the
 * sanitizer. This is NOT the public model and MUST NOT be consumed by the
 * frontend. It is framework-agnostic and lives behind the sanitization boundary.
 *
 * The collector reads from Kubernetes/ArgoCD and produces this raw shape. The
 * sanitizer (src/infra/sanitizer.ts) then projects it down to the allowlisted
 * public schema (src/infra/public-schema.ts).
 *
 * IMPORTANT: This contract intentionally includes fields that must NEVER reach
 * the public interface (secrets, env vars, internal IPs, node names, private
 * hostnames, raw annotations, repo credentials, etc.). The sanitizer exists to
 * strip them. Live collection is a subsequent implementation phase; defining
 * this contract now lets the frontend develop against mock fixtures that
 * conform to the PUBLIC schema without changing when live collection arrives.
 */

import type { PublicApplication, PublicService, PublicWorkload } from "./public-schema";

/**
 * Raw workload as observed by the collector. Contains sensitive fields that the
 * sanitizer must drop (node names, internal IPs, pod names, image refs, raw
 * annotations, env refs).
 */
export interface RawWorkload {
  name: string;
  kind: PublicWorkload["kind"];
  desiredReplicas: number;
  readyReplicas: number;
  health: PublicWorkload["health"];
  // --- SENSITIVE: must never cross the boundary ---
  /** Pod names — private, dropped. */
  podNames?: string[];
  /** Node names — private, dropped. */
  nodeNames?: string[];
  /** Internal pod IPs — private, dropped. */
  podIps?: string[];
  /** Container image refs (may contain registry credentials context) — dropped. */
  images?: string[];
  /** Raw annotations — dropped unless explicitly allowlisted (none are). */
  annotations?: Record<string, string>;
  /** Environment variable references / secrets — dropped. */
  envRefs?: string[];
}

export interface RawService {
  name: string;
  port: number;
  protocol: PublicService["protocol"];
  // --- SENSITIVE: must never cross the boundary ---
  /** ClusterIP — internal, dropped. */
  clusterIP?: string;
  /** ExternalIP — dropped to avoid exposing infrastructure addressing. */
  externalIP?: string;
  /** Private hostnames — dropped. */
  privateHostnames?: string[];
  annotations?: Record<string, string>;
}

export interface RawApplication {
  name: string;
  health: PublicApplication["health"];
  sync: PublicApplication["sync"];
  workloads: RawWorkload[];
  services: RawService[];
  statusSummary: string;
  updatedAt: string;
  // --- SENSITIVE: must never cross the boundary ---
  /** ArgoCD source repo URL (may embed credentials) — dropped. */
  sourceRepo?: string;
  /** Target revision — dropped. */
  targetRevision?: string;
  /** ArgoCD API token used to read this — dropped. */
  argoToken?: string;
  /** Raw ArgoCD API response object — dropped. */
  rawArgoResponse?: unknown;
  /** Cluster credentials / kubeconfig refs — dropped. */
  clusterCredentials?: unknown;
  /** Secret references — dropped. */
  secretRefs?: string[];
  /** ConfigMap contents — dropped. */
  configMapData?: Record<string, string>;
  /** Raw annotations — dropped. */
  annotations?: Record<string, string>;
}

export interface CollectorSnapshot {
  generatedAt: string;
  applications: RawApplication[];
}

/**
 * Type the sanitizer implements. A future live collector exports a function
 * matching this signature; the sanitizer output is the public schema.
 */
export type CollectorFn = () => Promise<CollectorSnapshot> | CollectorSnapshot;
