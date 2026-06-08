import './globals.css';
import { Providers } from './providers';

import type { Metadata } from 'next';
import favIcon from '../images/fav-sm.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://ebenbosman.com'),
  title: 'Eben Bosman | Fullstack Developer',
  description:
    'Eben Bosman is a driven Full-Stack Developer with nearly two decades of hands-on experience architecting and building modern web applications using React, Next.js, TypeScript, C#, and .NET.',
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
  authors: [{ name: 'Eben Bosman', url: 'https://ebenbosman.com' }],
  creator: 'Eben Bosman',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ebenbosman.com',
    siteName: 'Eben Bosman Resume',
    title: 'Eben Bosman | Fullstack Developer',
    description:
      'Nearly two decades of experience building modern web applications with React, Next.js, TypeScript, C#, and .NET.',
  },
  twitter: {
    card: 'summary',
    title: 'Eben Bosman | Fullstack Developer',
    description:
      'Nearly two decades of experience building modern web applications with React, Next.js, TypeScript, C#, and .NET.',
  },
  icons: {
    icon: favIcon.src,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className="bg-background text-foreground transition-colors duration-300">
        <Providers>
          <div id="app" className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
