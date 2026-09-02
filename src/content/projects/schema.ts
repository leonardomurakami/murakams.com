import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "maintenance", "completed", "archived"]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const visualMaterialSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("screenshot"),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("demo"),
    src: z.string(), // iframe or external demo URL
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("other"),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
]);
export type VisualMaterial = z.infer<typeof visualMaterialSchema>;

export const projectLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  kind: z.enum(["repository", "live", "other"]).optional(),
});
export type ProjectLink = z.infer<typeof projectLinkSchema>;

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  status: projectStatusSchema,
  technologies: z.array(z.string()),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  visualMaterial: z.array(visualMaterialSchema).default([]),
  problem: z.string(),
  architecture: z.string(),
  implementation: z.string(),
  challenges: z.string(),
  tradeoffs: z.string(),
  links: z.array(projectLinkSchema).default([]),
});
export type Project = z.infer<typeof projectSchema>;

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "Active",
  maintenance: "Maintenance",
  completed: "Completed",
  archived: "Archived",
};

export const projectStatusKey: Record<
  ProjectStatus,
  "healthy" | "degraded" | "unhealthy" | "unknown"
> = {
  active: "healthy",
  maintenance: "degraded",
  completed: "unknown",
  archived: "unknown",
};
