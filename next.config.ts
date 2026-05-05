import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/promises", destination: "/", permanent: false },
      { source: "/promises/:path*", destination: "/", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      { source: "/library", destination: "/", permanent: false },
      { source: "/library/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
