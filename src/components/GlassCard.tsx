"use client";

import { useSpecular } from "@/lib/useSpecular";

/**
 * Wraps the .glass material with pointer-tracked specular highlight.
 * Kept tiny so the sections around it can stay server components.
 */
export default function GlassCard({
  className = "",
  as: Tag = "div",
  children,
  ...rest
}: {
  className?: string;
  as?: "div" | "figure" | "article" | "li";
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const spec = useSpecular<HTMLElement>();
  return (
    <Tag
      className={`glass ${className}`}
      onPointerMove={spec.onPointerMove as unknown as React.PointerEventHandler<HTMLElement>}
      {...rest}
    >
      {children}
    </Tag>
  );
}
