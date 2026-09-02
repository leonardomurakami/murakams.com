/**
 * Portfolio infrastructure API/cache layer.
 *
 * The /infra UI reads through this layer. In the initial implementation it is
 * backed by realistic mocked sanitized fixtures conforming to the public
 * schema. The interface is identical to what it will be when fed by the real
 * sanitizer + a live collector, so swapping the backend later is a single
 * wiring change with no frontend or schema impact.
 *
 * The layer is designed with a fallback-to-last-known / degraded-state
 * contract: callers can distinguish a fresh snapshot from a stale/cached one
 * and from a degraded state, even while mocked.
 */

import type { PublicInfrastructureSnapshot } from "../public-schema";
import { publicFixtureSnapshot } from "../fixtures/public-snapshot";

export type InfraFetchStatus = "fresh" | "stale" | "degraded";

export interface InfraResult {
  snapshot: PublicInfrastructureSnapshot;
  status: InfraFetchStatus;
  /** Human-readable note for degraded/stale states; empty when fresh. */
  note: string;
}

/**
 * Returns the current public infrastructure snapshot.
 *
 * Mocked phase: returns the fixture as "fresh". When live collection is wired
 * in, this will call through the sanitizer and cache results, returning "stale"
 * from cache on collector failure and "degraded" when no cache is available.
 */
export async function getInfrastructureStatus(): Promise<InfraResult> {
  return {
    snapshot: publicFixtureSnapshot,
    status: "fresh",
    note: "",
  };
}

/**
 * Synchronous accessor for server components / build-time rendering that does
 * not want to await. Same fixture-backed behavior in the mocked phase.
 */
export function getInfrastructureStatusSync(): InfraResult {
  return {
    snapshot: publicFixtureSnapshot,
    status: "fresh",
    note: "",
  };
}
