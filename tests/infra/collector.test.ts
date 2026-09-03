import { describe, it, expect } from "vitest";
import { mapHealth, mapSync, healthFromReplicas } from "@/infra/collector";

describe("collector mapping helpers", () => {
  describe("mapHealth", () => {
    it("maps ArgoCD health states to the public schema", () => {
      expect(mapHealth("Healthy")).toBe("healthy");
      expect(mapHealth("Degraded")).toBe("unhealthy");
      expect(mapHealth("Missing")).toBe("unhealthy");
      expect(mapHealth("Progressing")).toBe("degraded");
      expect(mapHealth("Suspended")).toBe("unknown");
      expect(mapHealth("Unknown")).toBe("unknown");
      expect(mapHealth(undefined)).toBe("unknown");
    });
  });

  describe("mapSync", () => {
    it("maps ArgoCD sync states to the public schema", () => {
      expect(mapSync("Synced")).toBe("synced");
      expect(mapSync("OutOfSync")).toBe("out_of_sync");
      expect(mapSync("Unknown")).toBe("unknown");
      expect(mapSync(undefined)).toBe("unknown");
    });
  });

  describe("healthFromReplicas", () => {
    it("derives health from replica counts when ArgoCD resource health is absent", () => {
      expect(healthFromReplicas(2, 2)).toBe("healthy");
      expect(healthFromReplicas(2, 1)).toBe("degraded");
      expect(healthFromReplicas(2, 0)).toBe("unhealthy");
      expect(healthFromReplicas(0, 0)).toBe("unknown");
    });
  });
});
