import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { articleNode, breadcrumbs, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { getResearch } from "@/content/source";
import { byNewestFirst, categoryLabel, countWords } from "@/content/types";
import ArticleView from "@/components/ArticleView";

export async function generateStaticParams() {
  const research = await getResearch();
  return locales.flatMap((locale) =>
    research.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = (await getResearch()).find((a) => a.slug === slug);
  if (!article) return {};
  const t = getDict(locale);
  const author = t.council.members[article.author as keyof typeof t.council.members];

  return pageMetadata({
    locale,
    path: `/research/${slug}`,
    title: article.title[locale],
    description: article.excerpt[locale],
    type: "article",
    publishedTime: article.date,
    authors: [author.name],
    section: categoryLabel[article.category][locale],
  });
}

export default async function ResearchArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const all = await getResearch();
  const article = all.find((a) => a.slug === slug);
  if (!article) notFound();

  const t = getDict(locale);
  const author = t.council.members[article.author as keyof typeof t.council.members];

  const related = all
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const sameCat = Number(b.category === article.category) - Number(a.category === article.category);
      return sameCat !== 0 ? sameCat : byNewestFirst(a, b);
    })
    .slice(0, 3);

  const jsonLd = graph(
    articleNode({
      locale,
      path: `/research/${slug}`,
      type: "ScholarlyArticle",
      headline: article.title[locale],
      description: article.excerpt[locale],
      datePublished: article.date,
      authorName: author.name,
      section: categoryLabel[article.category][locale],
      wordCount: countWords(article.body, locale),
    }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.research, path: "/research" },
      { name: article.title[locale], path: `/research/${slug}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main">
        <ArticleView
          article={article}
          related={related}
          locale={locale}
          t={t}
          listPath={paths.research(locale)}
          listLabel={t.nav.research}
          itemPath={(s) => paths.researchItem(locale, s)}
        />
      </main>
    </>
  );
}
