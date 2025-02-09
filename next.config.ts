import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
    ],
    domains: ["backend.palworldkorea.co.kr"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
