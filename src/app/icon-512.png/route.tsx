import { brandIcon } from "@/lib/brandIcon";

/** Raster logo for schema.org Organization.logo and the web manifest. */
export const dynamic = "force-static";

export function GET() {
  return brandIcon(512);
}
