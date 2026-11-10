const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/**
 * Absolute origin of the deployed site, used for canonical URLs, Open Graph
 * tags, robots.txt and the sitemap. Set NEXT_PUBLIC_SITE_URL to your custom
 * domain; on Vercel it falls back to the production deployment URL.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionHost
    ? `https://${vercelProductionHost}`
    : "http://localhost:3000");

export const siteName = "Neil Hong";

export const siteDescription =
  "A portfolio for Web3, full-stack development, creative coding, 3D interfaces and interactive digital work.";
