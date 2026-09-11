"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cleanTitle, takeResume, touchTrail } from "@/lib/trail";

/**
 * Remembers which pages the reader visited and how far down each one they got,
 * so the 404 page can send them back to where they left off. Renders nothing.
 */
export default function VisitTrail() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    /* A dead link is not somewhere anyone wants to be sent back to. */
    if (document.querySelector("[data-not-found]")) return;

    const path = pathname + window.location.search;

    const target = takeResume(path);
    if (target !== null) {
      requestAnimationFrame(() => window.scrollTo({ top: target, behavior: "instant" }));
    }

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.round(window.scrollY);
      return { y, read: max > 0 ? Math.min(1, y / max) : 1 };
    };

    /* The title can land a frame after the route does on client navigation. */
    const first = requestAnimationFrame(() =>
      touchTrail(path, { title: cleanTitle(document.title), ...measure() }),
    );

    let timer: ReturnType<typeof setTimeout> | null = null;
    const save = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      touchTrail(path, measure());
    };
    const onScroll = () => {
      if (!timer) timer = setTimeout(save, 700);
    };
    const onHide = () => document.visibilityState === "hidden" && save();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelAnimationFrame(first);
      if (timer) save();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [pathname]);

  return null;
}
