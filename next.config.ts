import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment
  output: 'standalone',
  
  // Image optimization for production
  images: {
    domains: ['localhost', '*.digitaloceanspaces.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Disable trailing slash
  trailingSlash: false,
  
  // Enable compression
  compress: true,
  
  // Power settings for Digital Ocean
  poweredByHeader: false,
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
