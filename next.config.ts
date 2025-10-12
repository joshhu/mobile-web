import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sogi.com.tw',
      },
      {
        protocol: 'https',
        hostname: '**.sogi.com.tw',
      },
    ],
  },
};

export default nextConfig;
