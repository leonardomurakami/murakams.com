import { describe, it, expect } from "vitest";
import { sanitizeSnapshot } from "@/infra/sanitizer";
import { rawCollectorFixture } from "@/infra/fixtures/raw-collector-snapshot";
import { publicFixtureSnapshot } from "@/infra/fixtures/public-snapshot";
import type { PublicApplication, PublicInfrastructureSnapshot } from "@/infra/public-schema";

describe("sanitizer", () => {
  it("emits only allowlisted fields and strips all sensitive data", () => {
    const sanitized = sanitizeSnapshot(rawCollectorFixture);

    const serialized = JSON.stringify(sanitized);
    const sensitive = [
      "ghp_secrettoken",
      "argocd-token-",
      "kubeconfig",
      "REDACTED",
      "10.244.1.5",
      "10.244.2.7",
      "10.96.34.21",
      "203.0.113.10",
      "node-prod-01",
      "node-prod-02",
      "portfolio.internal.murakams.com",
      "oauth2:",
      "DATABASE_URL",
      "postgres://user:pass",
      "secret/portfolio-db",
      "secret/registry-creds",
      "configmap/portfolio-env",
      "ghcr.io/murakams/portfolio",
      "argocd.argoproj.io",
      "rawArgoResponse",
      "sourceRepo",
      "targetRevision",
      "argoToken",
      "clusterCredentials",
      "secretRefs",
      "configMapData",
      "annotations",
      "podNames",
      "nodeNames",
      "podIps",
      "images",
      "envRefs",
      "clusterIP",
      "externalIP",
      "privateHostnames",
    ];
    for (const needle of sensitive) {
      expect(
        serialized,
        `sensitive value "${needle}" must not appear in public output`,
      ).not.toContain(needle);
    }
  });

  it("produces a valid PublicInfrastructureSnapshot shape", () => {
    const sanitized = sanitizeSnapshot(rawCollectorFixture);
    expect(sanitized.generatedAt).toBeTypeOf("string");
    expect(Array.isArray(sanitized.applications)).toBe(true);
    expect(sanitized.summary.total).toBe(sanitized.applications.length);
    expect(
      sanitized.summary.healthy +
        sanitized.summary.degraded +
        sanitized.summary.unhealthy +
        sanitized.summary.unknown,
    ).toBe(sanitized.summary.total);
  });

  it("every public-schema field is explicitly produced by the sanitizer (allowlist coverage)", () => {
    const sanitized = sanitizeSnapshot(rawCollectorFixture);
    const app = sanitized.applications[0] as PublicApplication;
    // PublicApplication fields
    expect(app).toHaveProperty("id");
    expect(app).toHaveProperty("name");
    expect(app).toHaveProperty("health");
    expect(app).toHaveProperty("sync");
    expect(app).toHaveProperty("workloads");
    expect(app).toHaveProperty("services");
    expect(app).toHaveProperty("statusSummary");
    expect(app).toHaveProperty("updatedAt");
    // No extra fields leaked onto the application object
    const allowedAppKeys = [
      "id",
      "name",
      "health",
      "sync",
      "workloads",
      "services",
      "statusSummary",
      "updatedAt",
    ];
    expect(Object.keys(app).sort()).toEqual([...allowedAppKeys].sort());

    const wl = app.workloads[0];
    const allowedWlKeys = ["name", "kind", "desiredReplicas", "readyReplicas", "health"];
    expect(Object.keys(wl).sort()).toEqual([...allowedWlKeys].sort());

    const svc = app.services[0];
    const allowedSvcKeys = ["name", "port", "protocol"];
    expect(Object.keys(svc).sort()).toEqual([...allowedSvcKeys].sort());

    const allowedTopKeys = ["generatedAt", "applications", "summary"];
    expect(Object.keys(sanitized).sort()).toEqual([...allowedTopKeys].sort());
  });

  it("coerces unknown enum values to 'unknown' rather than leaking raw strings", () => {
    const sanitized = sanitizeSnapshot({
      generatedAt: "2026-08-19T14:00:00.000Z",
      applications: [
        {
          name: "weird-app",
          health: "some-future-state" as never,
          sync: "pending-manual" as never,
          statusSummary: "",
          updatedAt: "",
          workloads: [
            {
              name: "w",
              kind: "replicaset" as never,
              desiredReplicas: 1,
              readyReplicas: 0,
              health: "broken" as never,
            },
          ],
          services: [],
        },
      ],
    });
    const app = sanitized.applications[0] as PublicApplication;
    expect(app.health).toBe("unknown");
    expect(app.sync).toBe("unknown");
    expect(app.workloads[0].health).toBe("unknown");
    expect(app.workloads[0].kind).toBe("deployment");
  });

  it("the public fixture itself contains no sensitive values", () => {
    const serialized = JSON.stringify(publicFixtureSnapshot);
    const sensitive = [
      "secret",
      "token",
      "password",
      "10.",
      "192.168",
      "kubeconfig",
      "ghcr.io",
      "internal",
      "annotation",
    ];
    for (const needle of sensitive) {
      expect(serialized, `public fixture must not contain "${needle}"`).not.toContain(needle);
    }
  });

  it("satisfies the PublicInfrastructureSnapshot type at compile time", () => {
    const snapshot: PublicInfrastructureSnapshot = publicFixtureSnapshot;
    expect(snapshot.summary.total).toBeGreaterThan(0);
  });
});
