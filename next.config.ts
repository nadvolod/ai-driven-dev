import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Basic Configuration */
  reactStrictMode: true,
  swcMinify: true,
  
  /* TypeScript Configuration */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  /* ESLint Configuration */
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  /* Experimental Features for Next.js 15 */
  experimental: {
    // Enable React 19 features
    reactCompiler: false, // Set to true when React Compiler is stable
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Modern bundling optimizations
    bundlePagesRouterDependencies: true,
    optimizePackageImports: [
      'react-icons',
      'lucide-react',
      '@headlessui/react',
      '@heroicons/react',
    ],
  },

  /* Image Optimization */
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Performance Optimizations */
  poweredByHeader: false,
  generateEtags: false,
  compress: true,

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

  /* Environment Variables */
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
};

export default nextConfig; 