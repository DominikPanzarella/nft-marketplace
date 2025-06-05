import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coral-calm-cephalopod-969.mypinata.cloud",
        pathname: "/ipfs/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2000mb",
    },
  },
};

export default nextConfig;
