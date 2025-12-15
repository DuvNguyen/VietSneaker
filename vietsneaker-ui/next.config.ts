import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Cho phép build production dù có lỗi eslint
    ignoreDuringBuilds: true,
  },

  // Dùng standalone cho Docker
  output: "standalone",

  // 🔥 REWRITE API → BACKEND CONTAINER
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://vietsneaker-server:8083/api/:path*",
      },
    ];
  },
};

export default nextConfig;
