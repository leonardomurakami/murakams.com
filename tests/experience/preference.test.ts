import { describe, expect, it } from "vitest";
import {
  EXPERIENCE_STORAGE_KEY,
  persistExperienceAndReload,
  resolveExperience,
  type Experience,
} from "@/features/experience/preference";

describe("experience preference", () => {
  it.each([
    ["immersive", true, "immersive"],
    ["accessible", false, "accessible"],
    [null, true, "accessible"],
    [null, false, "immersive"],
    ["legacy", true, "accessible"],
  ])("resolves stored=%s and reduced-motion=%s to %s", (stored, reducedMotion, expected) => {
    expect(resolveExperience(stored, reducedMotion)).toBe(expected);
  });

  it.each<Experience>(["immersive", "accessible"])(
    "persists %s before reloading the current route",
    (experience) => {
      const calls: string[] = [];
      const stored = new Map<string, string>();
      const currentRoute = "/projects/homelab-gitops?source=desktop#architecture";
      let reloadedRoute: string | undefined;

      persistExperienceAndReload(experience, {
        storage: {
          setItem(key, value) {
            calls.push("store");
            stored.set(key, value);
          },
        },
        reloadCurrentRoute() {
          calls.push("reload");
          reloadedRoute = currentRoute;
        },
      });

      expect(calls).toEqual(["store", "reload"]);
      expect(stored.get(EXPERIENCE_STORAGE_KEY)).toBe(experience);
      expect(reloadedRoute).toBe(currentRoute);
    },
  );
});
