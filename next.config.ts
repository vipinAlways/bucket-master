import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["www.w3.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "",
      },
    ],
  },
};

export default nextConfig;
