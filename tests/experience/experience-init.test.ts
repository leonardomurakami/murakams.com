import { readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const initializer = readFileSync(path.resolve(process.cwd(), "public/experience-init.js"), "utf8");

function runInitializer(stored: string | null, reducedMotion: boolean) {
  let experience: string | undefined;
  let storageKey: string | undefined;
  let mediaQuery: string | undefined;

  runInNewContext(initializer, {
    window: {
      localStorage: {
        getItem(key: string) {
          storageKey = key;
          return stored;
        },
      },
      matchMedia(query: string) {
        mediaQuery = query;
        return { matches: reducedMotion };
      },
    },
    document: {
      documentElement: {
        setAttribute(name: string, value: string) {
          if (name === "data-experience") experience = value;
        },
      },
    },
  });

  return { experience, storageKey, mediaQuery };
}

describe("experience pre-paint initializer", () => {
  it.each([
    ["immersive", true, "immersive"],
    ["accessible", false, "accessible"],
  ])("restores an explicit %s preference", (stored, reducedMotion, expected) => {
    const result = runInitializer(stored, reducedMotion);

    expect(result.storageKey).toBe("mks98-experience");
    expect(result.experience).toBe(expected);
  });

  it("defaults visitors who prefer reduced motion to accessible", () => {
    const result = runInitializer(null, true);

    expect(result.mediaQuery).toBe("(prefers-reduced-motion: reduce)");
    expect(result.experience).toBe("accessible");
  });

  it("defaults other visitors without a stored preference to immersive", () => {
    expect(runInitializer(null, false).experience).toBe("immersive");
  });

  it("treats an unknown stored value as no preference", () => {
    expect(runInitializer("legacy", true).experience).toBe("accessible");
  });
});
