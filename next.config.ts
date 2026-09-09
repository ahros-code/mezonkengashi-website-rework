import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /*
   * Sanity Studio imports `useSWR` as a default export, which only exists in
   * swr's client build. Bundling `sanity` into the RSC graph makes Turbopack
   * resolve swr under the `react-server` condition, where that default export
   * is absent and the build fails. Keeping the package external means Node
   * requires it at runtime through the normal condition instead.
   */
  serverExternalPackages: ["sanity", "@sanity/vision"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
