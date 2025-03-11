import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/api/chat",
        headers: [
          { key: "Connection", value: "Upgrade" },
          { key: "Upgrade", value: "websocket" },
        ],
      },
    ];
  },
};

export default nextConfig;
