/**
 * Portfolio infrastructure API/cache layer.
 *
 * The /infra UI reads through this layer. When a live sanitized snapshot is
 * mounted (written by the infra-collector CronJob to a ConfigMap that this pod
 * mounts at INFRA_SNAPSHOT_PATH), the layer reads it from disk on each request
 * and reports it as "fresh" (or "stale" once it ages past the staleness
 * threshold). When no live snapshot is mounted yet, or the file is unreadable,
 * the layer falls back to the realistic mocked fixture and reports "degraded".
 *
 * The interface is identical to the original mocked phase, so the frontend and
 * public schema do not change. The layer never imports or receives the private
 * collector contract or raw source responses — only the public schema shape,
 * whether it comes from the live mounted file or the public fixture.
 */

import "server-only";
import { readFileSync } from "node:fs";
import type { PublicInfrastructureSnapshot } from "../public-schema";
import { publicFixtureSnapshot } from "../fixtures/public-snapshot";

export type InfraFetchStatus = "fresh" | "stale" | "degraded";

export interface InfraResult {
  snapshot: PublicInfrastructureSnapshot;
  status: InfraFetchStatus;
  /** Human-readable note for degraded/stale states; empty when fresh. */
  note: string;
}

const SNAPSHOT_PATH = process.env.INFRA_SNAPSHOT_PATH ?? "/var/lib/infra/snapshot.json";
const STALE_THRESHOLD_MS = Number(process.env.INFRA_STALE_THRESHOLD_MS ?? 15 * 60 * 1000);

function isPublicSnapshot(value: unknown): value is PublicInfrastructureSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.generatedAt === "string" &&
    Array.isArray(v.applications) &&
    typeof v.summary === "object" &&
    v.summary !== null
  );
}

/**
 * Reads the live mounted snapshot from disk. Returns null when the file is
 * absent or does not conform to the public schema, so callers can fall back to
 * the fixture without throwing.
 */
function readLiveSnapshot(): PublicInfrastructureSnapshot | null {
  try {
    const raw = readFileSync(SNAPSHOT_PATH, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return isPublicSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function ageMs(generatedAt: string): number {
  const ts = Date.parse(generatedAt);
  if (Number.isNaN(ts)) return Number.POSITIVE_INFINITY;
  return Date.now() - ts;
}

function resolveResult(): InfraResult {
  const live = readLiveSnapshot();
  if (!live) {
    return {
      snapshot: publicFixtureSnapshot,
      status: "degraded",
      note: "Live infrastructure snapshot is not yet available; showing a static fixture.",
    };
  }
  const age = ageMs(live.generatedAt);
  if (age > STALE_THRESHOLD_MS) {
    return {
      snapshot: live,
      status: "stale",
      note: `Snapshot was generated ${Math.round(age / 60000)}m ago and may be behind live state.`,
    };
  }
  return { snapshot: live, status: "fresh", note: "" };
}

/**
 * Returns the current public infrastructure snapshot.
 *
 * Reads the live mounted snapshot file when present; otherwise falls back to
 * the fixture and reports "degraded". A present-but-aged snapshot is reported
 * as "stale".
 */
export async function getInfrastructureStatus(): Promise<InfraResult> {
  return resolveResult();
}

/**
 * Synchronous accessor for server components / build-time rendering that does
 * not want to await. Same live-first, fixture-fallback behavior.
 */
export function getInfrastructureStatusSync(): InfraResult {
  return resolveResult();
}
