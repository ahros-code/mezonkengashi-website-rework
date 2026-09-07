"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marks its subtree with data-inview once, so CSS can run a single reveal.
 * Used sparingly — only where the arrival of the content is the point.
 */
export default function InView({
  className = "",
  as: Tag = "div",
  threshold = 0.35,
  children,
}: {
  className?: string;
  as?: "div" | "ol" | "ul" | "section";
  threshold?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);

  return (
    <Tag ref={ref as React.RefObject<never>} className={className} data-inview={seen}>
      {children}
    </Tag>
  );
}
