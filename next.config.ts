import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
      {
        protocol: "https",
        hostname: "backend.palworldkorea.co.kr",
      },
    ],
  },
};

export default nextConfig;
