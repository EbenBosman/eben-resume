import { Electrolize, Ubuntu, Ubuntu_Mono } from 'next/font/google';

// The Cesium 455 type stack (ataru-cesium src/theme/tokens.css), self-hosted at build time by
// next/font so no request goes to Google at runtime (CSP font-src stays 'self').
export const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const ubuntuMono = Ubuntu_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu-mono',
  display: 'swap',
});

export const electrolize = Electrolize({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-electrolize',
  display: 'swap',
});

export const fontVariables = [ubuntu, ubuntuMono, electrolize].map((f) => f.variable).join(' ');
