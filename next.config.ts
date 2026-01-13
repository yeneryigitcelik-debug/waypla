import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable PPR to avoid build issues with client components in Server Components
    ppr: false,
  },
  // Disable static optimization for dynamic routes
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
