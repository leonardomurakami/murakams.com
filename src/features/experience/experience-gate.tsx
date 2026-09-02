"use client";

import dynamic from "next/dynamic";
import { useExperience } from "@/features/experience/experience-provider";

const MockOsShell = dynamic(
  () => import("@/features/mock-os/mock-os-shell").then((module) => module.MockOsShell),
  { ssr: false },
);

export function ExperienceGate() {
  const { experience } = useExperience();
  const inactive = experience !== "immersive";

  return (
    <div
      data-experience-region="immersive"
      className="experience-immersive min-h-full"
      aria-hidden={inactive ? true : undefined}
      inert={inactive ? true : undefined}
    >
      {inactive ? null : <MockOsShell />}
    </div>
  );
}
