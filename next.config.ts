import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Other Next.js config options can go here
  eslint: {
    // Disables ESLint from blocking production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
