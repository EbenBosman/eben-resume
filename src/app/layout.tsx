import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Eben Bosman Resume',
  description: 'Resume for Eben Bosman',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-text dark:bg-dark-background dark:text-dark-text transition-colors duration-300">
        <Providers>
          <div id="app" className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
