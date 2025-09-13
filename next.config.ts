import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,  // Enable linting during builds to catch real errors
  },
  typescript: {
    ignoreBuildErrors: false,   // Enable TypeScript checking to catch real errors  
  },
  experimental: {
    turbo: {
      // Configure Turbopack properly
    }
  }
};

export default nextConfig;
