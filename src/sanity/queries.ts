import { groq } from "next-sanity";

/**
 * Localised values are stored as `{uz, ru}` objects, which is already the shape
 * the site's `L` type expects, so they are projected verbatim.
 *
 * Body blocks are the one place that needs translating: Sanity names the
 * discriminator `_type` and the site's `Block` union names it `type`, so the
 * projection renames it here rather than leaving a mapping step in every
 * consumer.
 */
const localised = `{uz, ru}`;

const bodyProjection = `body[]{
  "type": select(
    _type == "paragraphBlock" => "p",
    _type == "headingBlock" => "h",
    _type == "listBlock" => "ul",
    _type == "quoteBlock" => "quote"
  ),
  text${localised},
  by${localised},
  items[]${localised}
}`;

const articleProjection = `{
  "slug": slug.current,
  date,
  category,
  author,
  readingMinutes,
  title${localised},
  excerpt${localised},
  ${bodyProjection}
}`;

export const researchQuery = groq`*[_type == "researchArticle" && defined(slug.current)]|order(date desc)${articleProjection}`;
export const newsQuery = groq`*[_type == "newsArticle" && defined(slug.current)]|order(date desc)${articleProjection}`;

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)]|order(start desc){
  "slug": slug.current,
  start,
  end,
  format,
  seats,
  price,
  host,
  venue${localised},
  city${localised},
  title${localised},
  excerpt${localised},
  audience${localised},
  agenda[]{time, text${localised}},
  outcomes[]${localised}
}`;

export const faqQuery = groq`*[_type == "faqCategory" && defined(slug.current)]|order(order asc){
  "id": slug.current,
  title${localised},
  items[]{q${localised}, a${localised}}
}`;

/** One singleton per listing page, fetched by its fixed document id. */
export const pageCopyQuery = groq`*[_id == $id][0]{
  metaTitle${localised},
  metaDescription${localised},
  kicker${localised},
  title${localised},
  lede${localised},
  featured${localised},
  all${localised},
  latest${localised},
  upcoming${localised},
  past${localised},
  noUpcoming${localised},
  stillTitle${localised},
  stillBody${localised},
  stillCta${localised}
}`;

export const organizationsQuery = groq`*[_type == "organization" && defined(slug.current)]|order(name asc){
  "slug": slug.current,
  name,
  sector,
  city${localised},
  since,
  "logo": logo.asset->url
}`;

export const certificatesQuery = groq`*[_type == "certificate" && defined(number) && defined(organization->slug.current)]|order(issued desc){
  number,
  "org": organization->slug.current,
  kind,
  subject${localised},
  "standards": coalesce(standards, []),
  issued,
  validUntil,
  "revoked": coalesce(revoked, false),
  "file": file.asset->url
}`;
