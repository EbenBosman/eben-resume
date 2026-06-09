/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. CRITICAL: Creates a tiny, optimized build for Heroku.
  // This reduces your slug size and memory usage significantly.
  output: 'standalone',

  // 2. REQUIRED: Keeps Puppeteer out of the bundler so it isn't traced/bundled
  // (Chrome is supplied by the chrome-for-testing buildpack on Heroku via
  // PUPPETEER_EXECUTABLE_PATH; locally Puppeteer uses its bundled Chromium).
  serverExternalPackages: ['puppeteer', 'puppeteer-core'],

  // 3. Recommended for catching bugs early
  reactStrictMode: true,
};

export default nextConfig;
