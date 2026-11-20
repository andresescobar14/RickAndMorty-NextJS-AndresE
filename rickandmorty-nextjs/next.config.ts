import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "rickandmortyapi.com", pathname: "/api/character/avatar/**" }],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Para este ejercicio usamos la caché sencilla de fetch con next.revalidate.
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
