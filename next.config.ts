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
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "www.koithe.com",
      },
       {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "zand.sgp1.cdn.digitaloceanspaces.com",
      },
    ],
  },
  reactCompiler: true,
};


export default nextConfig;
