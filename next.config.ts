import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The development badge sat on top of the quick-links button (bottom left).
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
