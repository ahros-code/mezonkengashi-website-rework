"use client";

import dynamic from "next/dynamic";
import { dataset, isSanityConfigured } from "@/sanity/env";

/**
 * The Studio is a browser application, not a page: it manages its own routing,
 * state and data fetching. Server-rendering it gains nothing and actively
 * breaks — React ends up with no active dispatcher during SSR — so it is loaded
 * on the client only.
 */
const StudioRoot = dynamic(() => import("./StudioRoot"), {
  ssr: false,
  loading: () => <Notice title="Studio yuklanmoqda…" />,
});

function Notice({ title, body }: { title: string; body?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        textAlign: "center",
        font: "16px/1.6 system-ui, sans-serif",
        background: "#0d1117",
        color: "#e6edf3",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h1>
      {body && <p style={{ margin: 0, maxWidth: "48ch", color: "#9aa7b4" }}>{body}</p>}
    </div>
  );
}

export default function Studio() {
  /* Without a project id the Studio would throw an unreadable config error, so
     say plainly what is missing instead. */
  if (!isSanityConfigured) {
    return (
      <Notice
        title="Sanity not configured"
        body={`Set NEXT_PUBLIC_SANITY_PROJECT_ID (and NEXT_PUBLIC_SANITY_DATASET, currently "${dataset}") in .env.local, then restart. See README, “Sanity CMS”.`}
      />
    );
  }
  return <StudioRoot />;
}
