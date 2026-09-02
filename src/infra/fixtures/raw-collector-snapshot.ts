/**
 * Raw collector fixture — exercises the sanitizer with realistic sensitive
 * fields that MUST be stripped (Secrets, env refs, internal IPs, node names,
 * private hostnames, ArgoCD tokens, raw API responses, repo URLs, annotations).
 *
 * Used by the sanitizer tests (tests/infra/sanitizer.test.ts) to assert that
 * no sensitive information crosses the boundary.
 */

import type { CollectorSnapshot } from "../collector-contract";

export const rawCollectorFixture: CollectorSnapshot = {
  generatedAt: "2026-08-19T14:00:00.000Z",
  applications: [
    {
      name: "portfolio-site",
      health: "healthy",
      sync: "synced",
      statusSummary: "All replicas ready; last sync succeeded.",
      updatedAt: "2026-08-19T13:58:00.000Z",
      workloads: [
        {
          name: "portfolio-web",
          kind: "deployment",
          desiredReplicas: 2,
          readyReplicas: 2,
          health: "healthy",
          // SENSITIVE — must be stripped:
          podNames: ["portfolio-web-7d4f-x9k2", "portfolio-web-7d4f-ab12"],
          nodeNames: ["node-prod-01", "node-prod-02"],
          podIps: ["10.244.1.5", "10.244.2.7"],
          images: ["ghcr.io/murakams/portfolio:sha-abc123"],
          annotations: { "argocd.argoproj.io/sync-wave": "1" },
          envRefs: ["secret/portfolio-db", "configmap/portfolio-env"],
        },
      ],
      services: [
        {
          name: "portfolio-http",
          port: 8080,
          protocol: "TCP",
          // SENSITIVE — must be stripped:
          clusterIP: "10.96.34.21",
          externalIP: "203.0.113.10",
          privateHostnames: ["portfolio.internal.murakams.com"],
          annotations: { "service.kubernetes.io/cluster-ip": "10.96.34.21" },
        },
      ],
      // SENSITIVE — must be stripped:
      sourceRepo: "https://oauth2:ghp_secrettoken@github.com/murakams/portfolio.git",
      targetRevision: "main",
      argoToken: "argocd-token-eyJhbGciOiJIUzI1NiJ9.secret",
      rawArgoResponse: { metadata: { name: "portfolio-site", namespace: "argocd" } },
      clusterCredentials: { kubeconfig: "REDACTED" },
      secretRefs: ["secret/portfolio-db", "secret/registry-creds"],
      configMapData: { DATABASE_URL: "postgres://user:pass@db.internal:5432" },
      annotations: { "argocd.argoproj.io/application-set": "true" },
    },
  ],
};
