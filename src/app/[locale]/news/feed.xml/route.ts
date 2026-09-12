import { getNews } from "@/content/source";
import { feedParams, rss } from "@/lib/feed";

export const revalidate = 1800;
export const generateStaticParams = feedParams;

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return rss({ rawLocale: locale, section: "news", articles: await getNews() });
}
