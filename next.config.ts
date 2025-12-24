import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
    ],
  },
};

export default nextConfig;
