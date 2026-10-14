import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sidebar px-4 py-16">
      <div className="w-full max-w-2xl rounded-lg border border-sidebar-border bg-black/40 p-8 font-mono text-gray-300 shadow-xl">
        <h1 className="mb-6 text-3xl text-white">
          Error <span className="text-primary">404</span>
        </h1>
        <p className="mb-4 before:mr-2 before:text-primary before:content-['>']">
          The page you are looking for might have been removed, had its name changed or is
          temporarily unavailable.
        </p>
        <p className="mb-4 before:mr-2 before:text-primary before:content-['>']">
          Please try to{' '}
          <Link href="/" className="text-white underline hover:text-primary">
            return to the homepage
          </Link>
          .
        </p>
        <p className="before:mr-2 before:text-primary before:content-['>']">Good luck.</p>
      </div>
    </main>
  );
}
