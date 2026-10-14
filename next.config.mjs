import resume from './src/data/resume.json' with { type: 'json' };

// Same origin as SITE_URL in src/lib/site.ts (both derive from resume.json basics.website).
const SITE_URL = `https://${resume.basics.website}`;
const isProd = process.env.NODE_ENV === 'production';

// Next's App Router injects inline bootstrap scripts (and next-themes adds one), so script-src
// needs 'unsafe-inline' without per-request nonces, which would make the static pages dynamic.
// The policy still blocks third-party scripts, plugins, framing, and base/form hijacking.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  // data: for the resume template's embedded @font-face fonts (/resume-preview).
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

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

  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,

  // Don't let `next dev` write a generic AGENTS.md; agent guidance lives in CLAUDE.md.
  agentRules: false,

  // Production only: dev needs eval/websockets for HMR, and HSTS must never stick to localhost.
  async headers() {
    return isProd ? [{ source: '/:path*', headers: securityHeaders }] : [];
  },

  // Heroku terminates TLS and forwards plain HTTP with X-Forwarded-Proto, so force HTTPS here,
  // and send the herokuapp.com hostname to the canonical origin.
  async redirects() {
    if (!isProd) return [];
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'eben-resume.herokuapp.com' }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
