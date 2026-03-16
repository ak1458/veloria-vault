import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // Disabled for dev — enable for static production builds
  // distDir: 'dist',
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "veloriavault.com",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
      },
    ],
  },
};

export default nextConfig;
