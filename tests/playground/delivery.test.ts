import { describe, expect, it } from "vitest";
import { labsCatalogSchema } from "../../src/content/playground/schema";
import {
  getPlaygroundIframePolicy,
  normalizeLabsCatalog,
  normalizeLabsOrigin,
} from "../../src/content/playground/registry";
import { getPlaygroundLaunchTarget } from "../../src/features/playground/playground-browser";

const catalog = {
  schemaVersion: 1,
  generatedAt: "2026-09-02T10:00:00.000Z",
  experiments: [
    {
      slug: "light-table",
      title: "Light Table",
      description: "A small visual experiment.",
      tags: ["visual"],
      featured: true,
      order: 1,
      presentation: "embedded",
      standalonePath: "/experiments/light-table",
      embedPath: "/embed/light-table",
      capabilities: ["fullscreen", "pointer-lock", "clipboard-write"],
    },
  ],
} as const;

describe("Labs playground catalog", () => {
  it("validates schema version 1 and creates only trusted Labs URLs", () => {
    const entries = normalizeLabsCatalog(
      labsCatalogSchema.parse(catalog),
      "https://labs.example.test",
    );

    expect(entries[0]).toMatchObject({
      standaloneUrl: "https://labs.example.test/experiments/light-table",
      embedUrl: "https://labs.example.test/embed/light-table",
      host: "labs.example.test",
    });
    expect(getPlaygroundLaunchTarget(entries[0])).toEqual({
      href: "/playground/light-table",
      opensExternalSite: false,
      opensNewTab: false,
    });
  });

  it("rejects mismatched, absolute, and traversal catalog paths", () => {
    for (const embedPath of [
      "/embed/other-slug",
      "https://attacker.test/embed/light-table",
      "/embed/../light-table",
    ]) {
      expect(() =>
        labsCatalogSchema.parse({
          ...catalog,
          experiments: [{ ...catalog.experiments[0], embedPath }],
        }),
      ).toThrow();
    }
  });

  it("rejects duplicate experiment slugs", () => {
    expect(() =>
      labsCatalogSchema.parse({
        ...catalog,
        experiments: [catalog.experiments[0], catalog.experiments[0]],
      }),
    ).toThrow();
  });

  it("accepts only a clean configured HTTP origin", () => {
    expect(normalizeLabsOrigin("http://localhost:3001")).toBe("http://localhost:3001");
    expect(() => normalizeLabsOrigin("https://labs.example.test/path")).toThrow();
    expect(() => normalizeLabsOrigin("javascript:alert(1)")).toThrow();
    expect(() => normalizeLabsOrigin("https://user:pass@labs.example.test")).toThrow();
  });

  it("derives iframe permissions only from local capability mappings", () => {
    expect(getPlaygroundIframePolicy([])).toEqual({
      sandbox: "allow-scripts allow-same-origin",
      allow: undefined,
      allowFullScreen: false,
    });
    expect(getPlaygroundIframePolicy(["fullscreen", "pointer-lock", "clipboard-write"])).toEqual({
      sandbox: "allow-scripts allow-same-origin allow-pointer-lock",
      allow: "fullscreen; clipboard-write",
      allowFullScreen: true,
    });
  });
});
