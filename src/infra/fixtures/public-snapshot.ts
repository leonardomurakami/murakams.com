/**
 * Realistic mocked sanitized fixtures conforming to the PUBLIC schema.
 *
 * The frontend develops against these until live collection is wired in. They
 * exercise the public schema (healthy/degraded/unhealthy states, sync states,
 * replica counts) so the /infra UI can be built and validated without cluster
 * access. A parallel raw fixture (raw-collector-snapshot.ts) exercises the
 * sanitizer and its sensitive-field stripping.
 */

import type { PublicInfrastructureSnapshot } from "../public-schema";

export const publicFixtureSnapshot: PublicInfrastructureSnapshot = {
  generatedAt: "2026-08-19T14:00:00.000Z",
  applications: [
    {
      id: "portfolio-site",
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
        },
      ],
      services: [{ name: "portfolio-http", port: 8080, protocol: "TCP" }],
    },
    {
      id: "git-server",
      name: "git-server",
      health: "healthy",
      sync: "synced",
      statusSummary: "Single replica ready; sync current.",
      updatedAt: "2026-08-19T13:45:00.000Z",
      workloads: [
        {
          name: "gitea",
          kind: "statefulset",
          desiredReplicas: 1,
          readyReplicas: 1,
          health: "healthy",
        },
      ],
      services: [
        { name: "gitea-web", port: 3000, protocol: "TCP" },
        { name: "gitea-ssh", port: 22, protocol: "TCP" },
      ],
    },
    {
      id: "monitoring-stack",
      name: "monitoring-stack",
      health: "degraded",
      sync: "out_of_sync",
      statusSummary: "1 of 2 replicas ready; pending manifest change.",
      updatedAt: "2026-08-19T13:30:00.000Z",
      workloads: [
        {
          name: "prometheus",
          kind: "statefulset",
          desiredReplicas: 1,
          readyReplicas: 1,
          health: "healthy",
        },
        {
          name: "alertmanager",
          kind: "deployment",
          desiredReplicas: 2,
          readyReplicas: 1,
          health: "degraded",
        },
      ],
      services: [{ name: "prometheus-web", port: 9090, protocol: "TCP" }],
    },
    {
      id: "ci-runner",
      name: "ci-runner",
      health: "unhealthy",
      sync: "out_of_sync",
      statusSummary: "No replicas ready; last deployment failing readiness.",
      updatedAt: "2026-08-19T12:10:00.000Z",
      workloads: [
        {
          name: "runner-controller",
          kind: "deployment",
          desiredReplicas: 2,
          readyReplicas: 0,
          health: "unhealthy",
        },
      ],
      services: [],
    },
  ],
  summary: {
    total: 4,
    healthy: 2,
    degraded: 1,
    unhealthy: 1,
    unknown: 0,
  },
};
