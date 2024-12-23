import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'placehold.co']
  }
};

export default nextConfig;
