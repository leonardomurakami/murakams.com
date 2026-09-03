"use client";

import { useEffect, useState } from "react";
import type { InfraResult } from "@/infra/api";
import { publicFixtureSnapshot } from "@/infra/fixtures/public-snapshot";

/**
 * Client hook for the public infrastructure snapshot.
 *
 * Seeds initial render (including SSR) with the static public fixture so the
 * immersive System Monitor paints immediately, then fetches the live sanitized
 * snapshot from the `/api/infra` server endpoint on mount. The endpoint reads
 * the ConfigMap-mounted snapshot written by the infra-collector CronJob; the
 * client never imports the collector contract or touches the private boundary.
 *
 * If the fetch fails, the last result is retained (the fixture on first load),
 * matching the API/cache layer's fallback-to-last-known contract.
 */
const seed: InfraResult = {
  snapshot: publicFixtureSnapshot,
  status: "degraded",
  note: "Loading live infrastructure snapshot.",
};

export function useInfraSnapshot(): InfraResult {
  const [result, setResult] = useState<InfraResult>(seed);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/infra", { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? (res.json() as Promise<InfraResult>) : null))
      .then((next) => {
        if (!cancelled && next && next.snapshot) setResult(next);
      })
      .catch(() => {
        /* keep last-known result on fetch failure */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}
