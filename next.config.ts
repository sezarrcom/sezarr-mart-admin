import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during builds to avoid plugin issues
  },
  typescript: {
    ignoreBuildErrors: false,   // Enable TypeScript checking to catch real errors  
  },
  turbopack: {
    // Configure Turbopack properly (moved from experimental.turbo)
  }
};

export default nextConfig;
