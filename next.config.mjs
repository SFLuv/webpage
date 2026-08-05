/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Assets are pre-sized in `public/`; no optimizer runs in this deployment.
    unoptimized: true,
    remotePatterns: [
      // One merchant logo is still hotlinked from Google's image cache.
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" }
    ]
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
