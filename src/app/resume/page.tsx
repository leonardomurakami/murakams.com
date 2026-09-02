import type { Metadata } from "next";
import { resume } from "@/content/resume/resume";
import { ResumeTimeline } from "@/features/resume/resume-timeline";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "A chronological career story: roles, responsibilities, engineering work, and measurable impact.",
};

export default function ResumePage() {
  return <ResumeTimeline summary={resume.summary} entries={resume.entries} />;
}
