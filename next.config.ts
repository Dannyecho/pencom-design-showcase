import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The development badge sat on top of the quick-links button (bottom left).
  devIndicators: false,
  images: { unoptimized: true },
  // Lets the hosted preview (airoapp.ai) load dev-only resources such as hot reload.
  allowedDevOrigins: ["*.airoapp.ai"],
  // `npm run bundle` sets this to build a self-contained server for GoDaddy (see tools/deploy/bundle.mjs).
  output: process.env.NEXT_STANDALONE ? "standalone" : undefined,
};

export default nextConfig;
