/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  
  // غیرفعال کردن type checking در بیلد (برای سرعت بیشتر)
  typescript: {
    // ⚠️ فقط برای بیلد سریع‌تر - در production بهتر است فعال باشد
    ignoreBuildErrors: true,
  },
  
  // غیرفعال کردن ESLint در بیلد (برای سرعت بیشتر)
  eslint: {
    // ⚠️ فقط برای بیلد سریع‌تر - در production بهتر است فعال باشد
    ignoreDuringBuilds: true,
  },
  
  // غیرفعال کردن error overlay برای خطاهای extension (فقط در development)
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // بهینه‌سازی تصاویر
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // بهینه‌سازی کامپایل
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // بهینه‌سازی bundle
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // بهینه‌سازی برای production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers برای cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Rewrites برای پشتیبانی از .html
  async rewrites() {
    return [
      {
        source: '/reports/testology-complete-2025.html',
        destination: '/reports/testology-complete-2025',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);