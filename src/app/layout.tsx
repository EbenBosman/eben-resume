import './globals.css';

import type { Metadata } from 'next';

import { fontVariables } from '../lib/fonts';
import { MOTION_BOOT_SCRIPT } from '../lib/motion';
import { SITE_URL } from '../lib/site';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Eben Bosman | Senior Full-Stack Engineer',
  description:
    'Eben Bosman is a driven Senior Full-Stack Engineer with nearly two decades of hands-on experience architecting and building modern web applications using React, Next.js, TypeScript, C#, and .NET.',
  keywords: [
    'Eben Bosman',
    'Senior Full-Stack Engineer',
    'Full Stack Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Node.js',
    'C#',
    '.NET',
    'Software Engineer',
    'Web Developer',
    'AI Engineer',
    'AI-Assisted Development',
    'LLM Integration',
    'Anthropic Claude API',
    'Prompt Engineering',
    'Python',
    'Independent Contractor',
    'Independent Fullstack Developer',
    'Independent Software Engineer',
    'Freelance Developer',
    'Freelance Fullstack Developer',
    'Freelance Software Engineer',
    'Resume',
  ],
  authors: [{ name: 'Eben Bosman', url: SITE_URL }],
  creator: 'Eben Bosman',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Eben Bosman Resume',
    title: 'Eben Bosman | Senior Full-Stack Engineer',
    description:
      'Nearly two decades of experience building modern web applications with React, Next.js, TypeScript, C#, and .NET.',
  },
  twitter: {
    card: 'summary',
    title: 'Eben Bosman | Senior Full-Stack Engineer',
    description:
      'Nearly two decades of experience building modern web applications with React, Next.js, TypeScript, C#, and .NET.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: lets reveal-on-scroll items start hidden without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body className="bg-page text-fg antialiased">
        <a
          href="#main"
          className="t-mono sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:border focus:bg-card focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <Providers>
          <div id="app" className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
