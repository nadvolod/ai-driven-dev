import type { NextConfig } from 'next';

/**
 * Next.js 15 Configuration
 * 
 * Optimized for React 19, TypeScript 5.6, and modern development patterns
 */
const nextConfig: NextConfig = {
  /* TypeScript Configuration */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  /* ESLint Configuration */
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  /* React Configuration for React 19 */
  reactStrictMode: true,
  
  /* Performance Optimizations */
  poweredByHeader: false,
  compress: true,
  
  /* Image Optimization */
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  /* Experimental Features for Next.js 15 */
  experimental: {
    /* React Compiler for React 19 (experimental) */
    reactCompiler: false,
    
    /* Performance optimizations */
    optimizePackageImports: [
      'react-icons',
      'lucide-react',
      '@heroicons/react',
      'framer-motion'
    ],
    
    /* Modern CSS features */
    cssChunking: 'strict',
  },

  /* Turbopack Configuration (stable in Next.js 15) */
  turbopack: {
    /* Enable for development */
    resolveAlias: {
      canvas: './empty-module.ts',
    },
  },

  /* Webpack Configuration Fallback */
  webpack: (config, { dev, isServer }) => {
    /* Optimize for development */
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    /* Canvas fallback for server-side rendering */
    if (isServer) {
      config.resolve.alias.canvas = false
    }

    return config
  },

  /* Environment Variables */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default',
  },

  /* Security Headers */
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
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig; 