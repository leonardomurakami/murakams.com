import { z } from "zod";

export const playgroundCapabilitySchema = z.enum(["fullscreen", "pointer-lock", "clipboard-write"]);
export type PlaygroundCapability = z.infer<typeof playgroundCapabilitySchema>;

export const playgroundPresentationSchema = z.enum(["embedded", "fullscreen"]);
export type PlaygroundPresentation = z.infer<typeof playgroundPresentationSchema>;

const slugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const labsCatalogEntrySchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(500),
    tags: z.array(z.string().trim().min(1).max(32)).max(12),
    featured: z.boolean(),
    order: z.number().int().nonnegative(),
    presentation: playgroundPresentationSchema,
    standalonePath: z.string().regex(/^\/experiments\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
    embedPath: z.string().regex(/^\/embed\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
    capabilities: z.array(playgroundCapabilitySchema).max(3),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.standalonePath !== `/experiments/${entry.slug}`) {
      context.addIssue({
        code: "custom",
        path: ["standalonePath"],
        message: "Standalone path must match the experiment slug",
      });
    }
    if (entry.embedPath !== `/embed/${entry.slug}`) {
      context.addIssue({
        code: "custom",
        path: ["embedPath"],
        message: "Embed path must match the experiment slug",
      });
    }
    if (new Set(entry.capabilities).size !== entry.capabilities.length) {
      context.addIssue({
        code: "custom",
        path: ["capabilities"],
        message: "Capabilities must be unique",
      });
    }
  });

export const labsCatalogSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.datetime(),
    experiments: z.array(labsCatalogEntrySchema),
  })
  .strict()
  .superRefine((catalog, context) => {
    const slugs = new Set<string>();
    for (const [index, experiment] of catalog.experiments.entries()) {
      if (slugs.has(experiment.slug)) {
        context.addIssue({
          code: "custom",
          path: ["experiments", index, "slug"],
          message: "Experiment slugs must be unique",
        });
      }
      slugs.add(experiment.slug);
    }
  });
export type LabsCatalog = z.infer<typeof labsCatalogSchema>;

export const playgroundEntrySchema = z
  .object({
    slug: slugSchema,
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean(),
    order: z.number().int().nonnegative(),
    presentation: playgroundPresentationSchema,
    standaloneUrl: z.url(),
    embedUrl: z.url(),
    host: z.string(),
    capabilities: z.array(playgroundCapabilitySchema).max(3),
  })
  .strict();
export type PlaygroundEntry = z.infer<typeof playgroundEntrySchema>;

export const playgroundCatalogStatusSchema = z.enum(["fresh", "stale", "unavailable"]);
export type PlaygroundCatalogStatus = z.infer<typeof playgroundCatalogStatusSchema>;

export const playgroundCatalogResultSchema = z
  .object({
    status: playgroundCatalogStatusSchema,
    entries: z.array(playgroundEntrySchema),
    note: z.string().nullable(),
  })
  .strict();
export type PlaygroundCatalogResult = z.infer<typeof playgroundCatalogResultSchema>;
