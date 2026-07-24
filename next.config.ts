import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loyverse.com",
        port: "",
        pathname: "/sites/all/themes/loyversecom/images/product/download/br/**",
        search: "",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
