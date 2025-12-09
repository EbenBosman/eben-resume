/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. CRITICAL: Creates a tiny, optimized build for Heroku.
  // This reduces your slug size and memory usage significantly.
  output: 'standalone',

  // 2. REQUIRED: Keeps Puppeteer/PDF binaries out of the bundler
  // so they don't crash the build.
  serverExternalPackages: ['html-pdf-node'],

  // 3. Recommended for catching bugs early
  reactStrictMode: true,
};

export default nextConfig;