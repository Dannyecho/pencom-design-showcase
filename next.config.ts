import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The development badge sat on top of the quick-links button (bottom left).
  devIndicators: false,
  images: { unoptimized: true },
  // Open to every origin, so the app works on any host or custom domain (airoapp preview, a published domain,
  // GoDaddy). Next refuses a bare "*" or "**", so "**.*" is the widest pattern it accepts: any name with a dot.
  allowedDevOrigins: ["**.*"],
  // Open CORS: any site may fetch the pages and assets.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
  // `npm run bundle` sets this to build a self-contained server for GoDaddy (see tools/deploy/bundle.mjs).
  output: process.env.NEXT_STANDALONE ? "standalone" : undefined,
};

export default nextConfig;
