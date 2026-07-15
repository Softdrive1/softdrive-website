import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev-tools badge (dev-only overlay, bottom-left)
  devIndicators: false,
  // Let phones on the local network load the dev server (device testing)
  allowedDevOrigins: ["192.168.1.93"],
};

export default nextConfig;
