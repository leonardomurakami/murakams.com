import { getInfrastructureStatus } from "@/infra/api";
import type { InfraResult } from "@/infra/api";

// Always serve the latest mounted snapshot; never cache at the CDN edge.
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const result: InfraResult = await getInfrastructureStatus();
  return Response.json(result);
}
