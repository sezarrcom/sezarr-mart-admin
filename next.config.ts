import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Completely disable ESLint during all builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Completely disable TypeScript checking during all builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable telemetry 
  telemetry: false,
  // Output settings for deployment
  output: 'standalone'
};

export default nextConfig;
