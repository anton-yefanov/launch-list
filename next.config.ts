import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.tally.so",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
