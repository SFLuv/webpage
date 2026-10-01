// Images uploaded through the admin panel are served by the API, so its host
// has to be an allowed image source. Derived from the same variable the rest of
// the site uses to find the API, so there is nothing extra to configure.
const apiHost = (() => {
  try {
    return process.env.SFLUV_API_BASE_URL ? new URL(process.env.SFLUV_API_BASE_URL) : null;
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Assets are pre-sized in `public/`; no optimizer runs in this deployment.
    unoptimized: true,
    remotePatterns: [
      // One merchant logo is still hotlinked from Google's image cache.
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      ...(apiHost
        ? [{ protocol: apiHost.protocol.replace(":", ""), hostname: apiHost.hostname, port: apiHost.port }]
        : [])
    ]
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
