import "server-only";

import { createPlaygroundCatalogClient, DEFAULT_REFRESH_TTL_MS } from "./catalog-client";
import type { PlaygroundCatalogResult } from "./schema";

function environmentTtl(): number {
  const parsed = Number(process.env.LABS_CATALOG_TTL_MS);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REFRESH_TTL_MS;
}

const catalogClient = createPlaygroundCatalogClient({
  origin: process.env.LABS_ORIGIN,
  ttlMs: environmentTtl(),
});

export function getPlaygroundCatalog(): Promise<PlaygroundCatalogResult> {
  return catalogClient.getCatalog();
}
