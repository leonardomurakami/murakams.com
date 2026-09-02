import type { Metadata } from "next";
import { InfraView } from "@/features/infra/infra-view";
import { getInfrastructureStatus } from "@/infra/api";

export const metadata: Metadata = {
  title: "Infrastructure status",
  description:
    "A sanitized public snapshot of personal infrastructure applications, replica readiness, health, and configuration state.",
};

export const dynamic = "force-dynamic";

export default async function InfraPage() {
  const { snapshot, status, note } = await getInfrastructureStatus();
  return <InfraView initial={snapshot} fetchStatus={status} fetchNote={note} />;
}
