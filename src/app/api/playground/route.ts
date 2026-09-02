import { NextResponse } from "next/server";
import { getPlaygroundCatalog } from "@/content/playground/catalog-server";

export async function GET() {
  const catalog = await getPlaygroundCatalog();
  const response = NextResponse.json(catalog);
  response.headers.set(
    "Cache-Control",
    catalog.status === "unavailable"
      ? "no-store"
      : "public, s-maxage=60, stale-while-revalidate=300",
  );
  return response;
}
