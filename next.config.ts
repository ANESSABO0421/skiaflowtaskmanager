import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 configuration
  serverExternalPackages: ["@supabase/supabase-js"],
  
  // Note: eslint and typescript ignore options are now handled via CLI flags 
  // or separate configuration files in Next.js 16.
  
  experimental: {
    // Other experimental features can go here
  },
};

export default nextConfig;
