import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    skipTrailingSlashRedirect: true,
    experimental: {
        authInterrupts: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.ppy.sh",
            },
            {
                protocol: "https",
                hostname: "a.ppy.sh",
            }
        ]
    }
};

export default nextConfig;
