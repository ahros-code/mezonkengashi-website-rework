import type { ReactNode } from "react";

/**
 * A second root layout, for the Studio only.
 *
 * The site's root layout lives at src/app/[locale]/layout.tsx — it is locale
 * aware and pulls in the site's fonts, globals and chrome, none of which the
 * Studio wants. /studio sits outside that segment, so it needs its own <html>
 * and <body>, deliberately bare: Sanity ships its own styling and would fight
 * the site's.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
