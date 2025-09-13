import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Completely disable TypeScript checking during production builds  
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
