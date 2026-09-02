import { labsCatalogSchema, type PlaygroundCatalogResult } from "./schema";
import { normalizeLabsCatalog, normalizeLabsOrigin } from "./registry";

export const DEFAULT_REFRESH_TTL_MS = 5 * 60 * 1000;

type CatalogClientOptions = {
  origin?: string;
  ttlMs?: number;
  fetchImpl?: typeof fetch;
  now?: () => number;
};

export function createPlaygroundCatalogClient(options: CatalogClientOptions = {}) {
  const origin = normalizeLabsOrigin(options.origin);
  const ttlMs = options.ttlMs ?? DEFAULT_REFRESH_TTL_MS;
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now;
  let lastValid: { entries: PlaygroundCatalogResult["entries"]; refreshedAt: number } | undefined;
  let refresh: Promise<PlaygroundCatalogResult> | undefined;

  async function refreshCatalog(): Promise<PlaygroundCatalogResult> {
    try {
      const response = await fetchImpl(`${origin}/api/v1/experiments`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Labs catalog returned HTTP ${response.status}`);

      const catalog = labsCatalogSchema.parse(await response.json());
      const entries = normalizeLabsCatalog(catalog, origin);
      lastValid = { entries, refreshedAt: now() };
      return { status: "fresh", entries, note: null };
    } catch {
      if (lastValid) {
        return {
          status: "stale",
          entries: lastValid.entries,
          note: "Labs could not be refreshed. Showing the last verified catalog.",
        };
      }
      return {
        status: "unavailable",
        entries: [],
        note: "Labs is temporarily unavailable. Try the catalog again shortly.",
      };
    }
  }

  return {
    async getCatalog(): Promise<PlaygroundCatalogResult> {
      if (lastValid && now() - lastValid.refreshedAt < ttlMs) {
        return { status: "fresh", entries: lastValid.entries, note: null };
      }
      refresh ??= refreshCatalog().finally(() => {
        refresh = undefined;
      });
      return refresh;
    },
  };
}
