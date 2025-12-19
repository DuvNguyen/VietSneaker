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
    const backendUrl = process.env.BACKEND_URL || "https://4.241.131.190";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
