/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site deploys anywhere (GitHub Pages, Netlify, S3, etc.)
  output: "export",
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
