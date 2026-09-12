import { GirihStar } from "./Girih";
import { monogram, type Organization } from "@/content/types";

/**
 * An organisation's mark: its logo when the CMS has one, otherwise its initials
 * set inside the khatam star — so a roster without a single logo still reads
 * as a set rather than a list of missing images.
 */
export default function OrgMark({ org, className }: { org: Organization; className?: string }) {
  return (
    <span className={className} data-org-mark="" data-logo={org.logo ? "" : undefined} aria-hidden="true">
      {org.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS asset of unknown size
        <img src={org.logo} alt="" loading="lazy" />
      ) : (
        <>
          <GirihStar size={100} strokeWidth={2.2} />
          <span>{monogram(org.name)}</span>
        </>
      )}
    </span>
  );
}
