import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  describeReadiness,
  formatUtcTimestamp,
  selectApplication,
  selectInfrastructureApplications,
} from "@/features/infra/infra-selectors";
import { getInfrastructureStatus, getInfrastructureStatusSync } from "@/infra/api";
import type { PublicInfrastructureSnapshot } from "@/infra/public-schema";

const snapshotWithUntrustedExtras = {
  generatedAt: "2026-08-19T14:00:00.000Z",
  applications: [
    {
      id: "public-app",
      name: "public-app",
      health: "degraded",
      sync: "out_of_sync",
      statusSummary: "One replica is still becoming ready.",
      updatedAt: "2026-08-19T13:58:00.000Z",
      sourceRepo: "must-not-be-projected",
      workloads: [
        {
          name: "public-workload",
          kind: "deployment",
          desiredReplicas: 2,
          readyReplicas: 1,
          health: "degraded",
          nodeNames: ["must-not-be-projected"],
        },
      ],
      services: [
        {
          name: "public-service",
          port: 8080,
          protocol: "TCP",
          clusterIP: "must-not-be-projected",
        },
      ],
    },
  ],
  summary: {
    total: 1,
    healthy: 0,
    degraded: 1,
    unhealthy: 0,
    unknown: 0,
  },
  rawResponse: "must-not-be-projected",
} as unknown as PublicInfrastructureSnapshot;

const publicApplicationKeys = [
  "health",
  "id",
  "name",
  "services",
  "statusSummary",
  "sync",
  "updatedAt",
  "workloads",
];
const publicWorkloadKeys = ["desiredReplicas", "health", "kind", "name", "readyReplicas"];
const publicServiceKeys = ["name", "port", "protocol"];

function expectPublicSnapshotShape(snapshot: PublicInfrastructureSnapshot) {
  expect(Object.keys(snapshot).sort()).toEqual(["applications", "generatedAt", "summary"]);
  expect(Object.keys(snapshot.summary).sort()).toEqual([
    "degraded",
    "healthy",
    "total",
    "unhealthy",
    "unknown",
  ]);
  for (const application of snapshot.applications) {
    expect(Object.keys(application).sort()).toEqual(publicApplicationKeys);
    for (const workload of application.workloads) {
      expect(Object.keys(workload).sort()).toEqual(publicWorkloadKeys);
    }
    for (const service of application.services) {
      expect(Object.keys(service).sort()).toEqual(publicServiceKeys);
    }
  }
}

describe("infrastructure public interface", () => {
  it("projects only allowlisted public fields into interface view models", () => {
    const [application] = selectInfrastructureApplications(snapshotWithUntrustedExtras);

    expect(Object.keys(application).sort()).toEqual([
      "health",
      "healthExplanation",
      "healthLabel",
      "id",
      "name",
      "readiness",
      "services",
      "statusSummary",
      "sync",
      "syncExplanation",
      "syncLabel",
      "updatedAt",
      "workloads",
    ]);
    expect(Object.keys(application.workloads[0]).sort()).toEqual([
      "desiredReplicas",
      "health",
      "healthExplanation",
      "healthLabel",
      "kind",
      "kindLabel",
      "name",
      "readiness",
      "readyReplicas",
    ]);
    expect(Object.keys(application.services[0]).sort()).toEqual(publicServiceKeys);
    expect(JSON.stringify(application)).not.toContain("must-not-be-projected");
  });

  it("derives plain-language readiness without reading outside replica counts", () => {
    expect(describeReadiness(2, 1)).toMatchObject({
      desired: 2,
      ready: 1,
      unavailable: 1,
      percentage: 50,
      complete: false,
      label: "1 / 2 ready",
    });
    expect(describeReadiness(1, 1).explanation).toBe(
      "All 1 requested replica is ready to serve work.",
    );
    expect(describeReadiness(2, 0).explanation).toBe(
      "None of the 2 requested replicas are ready to serve work.",
    );
  });

  it("keeps selection within projected application records", () => {
    const applications = selectInfrastructureApplications(snapshotWithUntrustedExtras);
    expect(selectApplication(applications, "public-app")?.id).toBe("public-app");
    expect(selectApplication(applications, "missing")?.id).toBe("public-app");
    expect(selectApplication([], "missing")).toBeUndefined();
  });

  it("formats public timestamps deterministically in UTC", () => {
    expect(formatUtcTimestamp("2026-08-19T14:00:00.000Z")).toBe("Aug 19, 2026, 14:00 UTC");
    expect(formatUtcTimestamp("not-a-time")).toBe("Time unavailable");
  });

  it("returns only public snapshot and fetch-state metadata through the API layer", async () => {
    const syncResult = getInfrastructureStatusSync();
    const asyncResult = await getInfrastructureStatus();

    for (const result of [syncResult, asyncResult]) {
      expect(Object.keys(result).sort()).toEqual(["note", "snapshot", "status"]);
      expect(["fresh", "stale", "degraded"]).toContain(result.status);
      expect(result.note).toBeTypeOf("string");
      expectPublicSnapshotShape(result.snapshot);
    }
  });

  it("does not import collector contracts or fixture modules into the interface", () => {
    const interfaceFiles = [
      "src/app/infra/page.tsx",
      "src/features/infra/infra-view.tsx",
      "src/features/infra/infra-components.tsx",
      "src/features/infra/infra-selectors.ts",
    ];

    for (const file of interfaceFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toContain("collector-contract");
      expect(source).not.toContain("raw-collector-snapshot");
      expect(source).not.toContain("@/infra/fixtures/");
    }
  });
});
