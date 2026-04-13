import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Prevents the dev server from injecting large internal headers on every
    // request, which is the root cause of HTTP 431 when combined with
    // Supabase's chunked auth cookies.
    optimizeServerReact: true,
  },
};

export default nextConfig;
