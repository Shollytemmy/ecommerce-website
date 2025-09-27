import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  // experimental: {
  //   turbo: {
  //     rules: {}, // leave empty to prevent turbopack optimization
  //   },
  // },
};

export default nextConfig;
