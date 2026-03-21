import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qiopxupsgpfhbnpwhybc.supabase.co",
        port: "",
        pathname: '/**',
      },
    ],
      }
};

export default nextConfig;
