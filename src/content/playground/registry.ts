import type { LabsCatalog, PlaygroundCapability, PlaygroundEntry } from "./schema";

export const DEFAULT_LABS_ORIGIN = "https://labs.murakams.com";

export function normalizeLabsOrigin(value: string | undefined): string {
  const candidate = new URL(value || DEFAULT_LABS_ORIGIN);
  if (!(["http:", "https:"] as string[]).includes(candidate.protocol)) {
    throw new Error("LABS_ORIGIN must use HTTP or HTTPS");
  }
  if (candidate.username || candidate.password) {
    throw new Error("LABS_ORIGIN must not contain credentials");
  }
  if (candidate.pathname !== "/" || candidate.search || candidate.hash) {
    throw new Error("LABS_ORIGIN must be an origin without a path, query, or fragment");
  }
  return candidate.origin;
}

function trustedLabsUrl(origin: string, path: string): string {
  const url = new URL(path, `${origin}/`);
  if (url.origin !== origin || !path.startsWith("/")) {
    throw new Error("Catalog paths must remain on the configured labs origin");
  }
  return url.href;
}

export function normalizeLabsCatalog(
  catalog: LabsCatalog,
  originValue?: string,
): PlaygroundEntry[] {
  const origin = normalizeLabsOrigin(originValue);
  return catalog.experiments
    .map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      tags: entry.tags,
      featured: entry.featured,
      order: entry.order,
      presentation: entry.presentation,
      standaloneUrl: trustedLabsUrl(origin, entry.standalonePath),
      embedUrl: trustedLabsUrl(origin, entry.embedPath),
      host: new URL(entry.standalonePath, `${origin}/`).host,
      capabilities: entry.capabilities,
    }))
    .sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug),
    );
}

export function getPlaygroundBySlug(
  entries: readonly PlaygroundEntry[],
  slug: string,
): PlaygroundEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

type IframePolicy = {
  sandbox: string;
  allow?: string;
  allowFullScreen: boolean;
};

const capabilityPolicy = {
  fullscreen: { sandbox: [], allow: ["fullscreen"] },
  "pointer-lock": { sandbox: ["allow-pointer-lock"], allow: [] },
  "clipboard-write": { sandbox: [], allow: ["clipboard-write"] },
} satisfies Record<PlaygroundCapability, { sandbox: string[]; allow: string[] }>;

export function getPlaygroundIframePolicy(
  capabilities: readonly PlaygroundCapability[],
): IframePolicy {
  const sandbox = new Set(["allow-scripts", "allow-same-origin"]);
  const allow = new Set<string>();

  for (const capability of capabilities) {
    for (const token of capabilityPolicy[capability].sandbox) sandbox.add(token);
    for (const permission of capabilityPolicy[capability].allow) allow.add(permission);
  }

  return {
    sandbox: [...sandbox].join(" "),
    allow: allow.size > 0 ? [...allow].join("; ") : undefined,
    allowFullScreen: capabilities.includes("fullscreen"),
  };
}
