"use client";

import { useEffect, useState } from "react";
import {
  playgroundCatalogResultSchema,
  type PlaygroundCatalogResult,
} from "@/content/playground/schema";

export type ClientPlaygroundCatalog =
  | PlaygroundCatalogResult
  | {
      status: "loading";
      entries: [];
      note: null;
    };

const loadingCatalog: ClientPlaygroundCatalog = {
  status: "loading",
  entries: [],
  note: null,
};

export function usePlaygroundCatalog(): ClientPlaygroundCatalog {
  const [catalog, setCatalog] = useState<ClientPlaygroundCatalog>(loadingCatalog);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch("/api/playground", {
          headers: { accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Playground catalog request failed");
        setCatalog(playgroundCatalogResultSchema.parse(await response.json()));
      } catch (error) {
        if (controller.signal.aborted) return;
        setCatalog({
          status: "unavailable",
          entries: [],
          note:
            error instanceof Error
              ? "The Programs catalog is temporarily unavailable."
              : "The Programs catalog could not be loaded.",
        });
      }
    }

    void loadCatalog();
    return () => controller.abort();
  }, []);

  return catalog;
}
