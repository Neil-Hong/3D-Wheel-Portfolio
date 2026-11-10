import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Slug typo fixed; keep old links and search results working.
      {
        source: "/project/past-porfolios",
        destination: "/project/past-portfolios",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
