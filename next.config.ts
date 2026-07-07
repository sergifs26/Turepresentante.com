import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

// Enables the OpenNext Cloudflare adapter during `next dev` so that
// Cloudflare bindings (env, R2, etc.) are available locally.
// Solo en desarrollo: arranca workerd, que el build no necesita (y que
// políticas de Windows pueden bloquear, rompiendo `next build`).
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
