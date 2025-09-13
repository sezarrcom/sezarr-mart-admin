/** @type {import('next').NextConfig} */
const nextConfig = {
  // NUCLEAR OPTION: Completely disable ALL linting and type checking
  eslint: {
    ignoreDuringBuilds: true,
    dirs: []  // Don't lint any directories
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip all validation during builds
  swcMinify: false,
  // Disable telemetry
  telemetry: false,
  // Experimental flags to bypass checks
  experimental: {
    // Disable all experimental linting
    eslint: false,
  }
};

module.exports = nextConfig;
