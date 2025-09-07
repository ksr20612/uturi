/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  transpilePackages: ['@uturi/sonification'],
};

module.exports = nextConfig;
