import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@uturi/sonification'],
  async redirects() {
    return [{ source: '/', destination: '/docs', permanent: true }];
  },
};

const withMDX = createMDX();

export default withMDX(config);
