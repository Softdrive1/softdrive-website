import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev-tools badge (dev-only overlay, bottom-left)
  devIndicators: false,
  // Let phones on the local network load the dev server (device testing)
  // DHCP vergibt gern neue IPs — bei "nur der Hero lädt auf dem iPhone"
  // zuerst prüfen, ob die aktuelle Mac-IP (ipconfig getifaddr en0) hier steht.
  allowedDevOrigins: ["192.168.1.93", "192.168.1.102"],
};

export default nextConfig;
