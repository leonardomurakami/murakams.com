import { z } from "zod";

export const resumeEntrySchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(), // e.g. "2023-01"
  endDate: z.string().or(z.literal("present")),
  location: z.string().optional(),
  responsibilities: z.array(z.string()),
  engineeringWork: z.array(z.string()),
  impact: z.array(z.string()),
  technologies: z.array(z.string()).default([]),
  /** Optional progression note describing the move from the previous role. */
  progression: z.string().optional(),
});
export type ResumeEntry = z.infer<typeof resumeEntrySchema>;

export const resumeSchema = z.object({
  summary: z.string(),
  entries: z.array(resumeEntrySchema),
});
export type Resume = z.infer<typeof resumeSchema>;
