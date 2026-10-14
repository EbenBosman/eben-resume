import Link from 'next/link';

import { BackgroundFx } from '../components/hud/BackgroundFx';

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      <BackgroundFx level="hud" />
      <section className="relative w-full max-w-2xl" style={{ zIndex: 1 }}>
        <div className="t-eyebrow">{'// SIGNAL.LOST · ERR 404'}</div>
        <h1 className="t-h1 mt-4">
          Page not found
          <span className="cursor-blink" aria-hidden="true">
            _
          </span>
        </h1>
        <div
          className="t-mono mt-8 space-y-2 border-l-2 pl-5 text-lg text-fg-muted"
          style={{ borderColor: 'var(--accent)' }}
        >
          <p>&gt; The page you are looking for might have been removed or renamed.</p>
          <p>&gt; Good luck.</p>
        </div>
        <Link href="/" className="hud-btn hud-btn-primary mt-10">
          <span>$ return home</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    </main>
  );
}
