import { describe, expect, it, vi } from "vitest";
import { createPlaygroundCatalogClient } from "../../src/content/playground/catalog-client";

const validCatalog = {
  schemaVersion: 1,
  generatedAt: "2026-09-02T10:00:00.000Z",
  experiments: [
    {
      slug: "light-table",
      title: "Light Table",
      description: "A small visual experiment.",
      tags: [],
      featured: false,
      order: 0,
      presentation: "embedded",
      standalonePath: "/experiments/light-table",
      embedPath: "/embed/light-table",
      capabilities: [],
    },
  ],
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("playground catalog server client", () => {
  it("uses its TTL and retains the last validated catalog after refresh failure", async () => {
    let now = 100;
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response(validCatalog))
      .mockResolvedValueOnce(response({ error: "offline" }, 503));
    const client = createPlaygroundCatalogClient({
      origin: "https://labs.example.test",
      ttlMs: 1_000,
      now: () => now,
      fetchImpl,
    });

    const fresh = await client.getCatalog();
    expect(fresh.status).toBe("fresh");
    expect(fresh.entries).toHaveLength(1);

    now = 500;
    expect((await client.getCatalog()).status).toBe("fresh");
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    now = 1_101;
    const stale = await client.getCatalog();
    expect(stale.status).toBe("stale");
    expect(stale.entries).toEqual(fresh.entries);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("returns an unavailable empty state on a cold invalid response", async () => {
    const client = createPlaygroundCatalogClient({
      origin: "https://labs.example.test",
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response({ schemaVersion: 2 })),
    });

    await expect(client.getCatalog()).resolves.toEqual({
      status: "unavailable",
      entries: [],
      note: "Labs is temporarily unavailable. Try the catalog again shortly.",
    });
  });
});
