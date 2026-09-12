import { indexNowKey } from "@/lib/indexnow";

/** The IndexNow ownership proof: the key itself, served from our own host. */
export function GET() {
  if (!indexNowKey) return new Response("Not found", { status: 404 });
  return new Response(indexNowKey, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
