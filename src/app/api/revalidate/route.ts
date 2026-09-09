import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target, so Publish shows up on the site immediately instead of
 * waiting out the revalidation window in src/sanity/client.ts.
 *
 * Set it up at sanity.io/manage -> API -> Webhooks:
 *   URL      <site>/api/revalidate
 *   Trigger  Create, Update, Delete
 *   Secret   the same value as SANITY_REVALIDATE_SECRET
 *
 * The signature check is what makes this safe to expose: without the shared
 * secret a stranger could force cache churn on every page.
 */
const TAGS: Record<string, string[]> = {
  researchArticle: ["research"],
  newsArticle: ["news"],
  event: ["events"],
  faqCategory: ["faq"],
  researchPage: ["page:researchPage"],
  newsPage: ["page:newsPage"],
  eventsPage: ["page:eventsPage"],
  faqPage: ["page:faqPage"],
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Webhook secret not configured" }, { status: 501 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const tags = TAGS[body?._type ?? ""] ?? [];
  if (tags.length === 0) {
    return NextResponse.json({ message: `Ignored type ${body?._type}` });
  }

  // `expire: 0` purges immediately — the editor pressed Publish and expects to
  // see it, not to wait out whichever cache profile happens to be the default.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tags });
}
