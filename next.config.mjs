/**
 * Base path for hosts that serve the site under a sub-path
 * (GitHub Pages project sites: https://<owner>.github.io/Pilot/).
 * Set NEXT_PUBLIC_BASE_PATH="/Pilot" in the deploy workflow; leave unset
 * for root-domain hosts (Vercel/Netlify/custom domain).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site deploys anywhere (GitHub Pages, Netlify, S3, etc.)
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  reactStrictMode: true,
  images: {
    // Required for `output: export`; we also hotlink the Higgsfield CDN until
    // assets are downloaded into /public (see lib/assets.ts).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "d2ol7oe51mr4n9.cloudfront.net" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
