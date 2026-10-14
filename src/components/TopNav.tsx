'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { ContactButton } from './contact/ContactButton';
import { HudButton } from './hud/HudButton';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './hud/Icons';

// "About" targets #main (the page top): on large screens the hero is sticky, so scrolling to
// #about itself barely moves. The scroll spy still tracks the #about section.
const hrefFor = (id: string) => (id === 'about' ? '#main' : `#${id}`);

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'ataru', label: 'Ataru' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
] as const;

/**
 * Section currently under the reading line, for the underline (scroll spy). Tracks every section
 * crossing the line and picks the last in page order, so the pinned hero (which stays "in view"
 * underneath on large screens) never outranks the section sliding over it.
 */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) crossing.add(e.target.id);
          else crossing.delete(e.target.id);
        }
        const current = [...LINKS].reverse().find((l) => crossing.has(l.id));
        if (current) setActive(current.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

/** Fixed, blurred Cesium public nav: brand left, section links, theme toggle and CTA right. */
export const TopNav: React.FC<{ name: string }> = ({ name }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();
  const close = () => setMenuOpen(false);

  // Both icons are server-rendered; the `.dark` class (set by next-themes before first paint)
  // picks which one shows, so nothing swaps or resizes after hydration.
  // Theme switch: where View Transitions exist, the new theme is revealed by a circle growing
  // from the toggle; otherwise (or with reduced motion) it switches instantly.
  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      root.style.colorScheme = next;
      setTheme(next);
    };
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 550,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid h-9 w-9 place-items-center text-fg-muted transition-colors hover:text-fg"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        height: 'var(--nav-h)',
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-hairline)',
      }}
    >
      <nav
        className="mx-auto flex h-full items-center gap-4 px-4 sm:px-6"
        style={{ maxWidth: 'var(--content-max)' }}
        aria-label="Primary"
      >
        {/* Console-line wordmark: a static Cesium-blue prompt, the name typed in on page load
            (CSS only, see .type-char), and a blinking cursor that follows the text. */}
        <a
          href="#main"
          aria-label={name}
          className="inline-flex items-center gap-1 text-lg font-bold tracking-tight text-fg"
          onClick={close}
        >
          <span
            aria-hidden="true"
            className="-mt-1 text-[34px] leading-none font-medium text-accent-text"
          >
            &rsaquo;
          </span>
          {/* An invisible full copy reserves the final width, so the nav links don't shift
              while the name types in; the typed letters and cursor sit on top of it. */}
          <span className="relative inline-block whitespace-pre">
            <span aria-hidden="true" className="invisible">
              {name}
              <span className="nav-cursor" />
            </span>
            <span className="absolute inset-0">
              {Array.from(name).map((ch, i) => (
                <span key={i} className="type-char" style={{ '--c': i } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
              <span aria-hidden="true" className="nav-cursor cursor-blink" />
            </span>
          </span>
        </a>

        <div className="ml-4 hidden flex-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={hrefFor(l.id)}
              className="nav-link"
              data-active={active === l.id}
              aria-current={active === l.id ? 'location' : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {themeToggle}
          {/* Desktop: contact stays reachable from anywhere on the page (the drawer holds it on
              smaller screens). */}
          <div className="hidden items-center gap-3 lg:flex">
            <ContactButton size="sm" />
            <HudButton href="/api/pdf-resume" size="sm" target="_blank" rel="noopener noreferrer">
              <span>$ resume.pdf</span>
              <span aria-hidden="true">&darr;</span>
            </HudButton>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center text-fg-muted lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* Reading progress: fills left to right with page scroll (CSS scroll-driven). */}
      <div
        aria-hidden="true"
        className="scroll-progress absolute inset-x-0 -bottom-px h-0.5"
        style={{ background: 'var(--accent)' }}
      />

      {/* Mobile drawer: out of the tab order and accessibility tree while collapsed. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        // Scrolls when taller than the screen (phones in landscape), so the buttons at the end
        // stay reachable; overscroll-contain keeps the page behind from scrolling instead.
        className={`overflow-y-auto overscroll-contain border-b bg-page transition-[max-height,opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:hidden ${menuOpen ? 'max-h-[calc(100dvh-var(--nav-h))] translate-y-0 opacity-100' : 'max-h-0 -translate-y-2 opacity-0'}`}
      >
        <div className="flex flex-col gap-1 px-4 pt-2 pb-5">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={hrefFor(l.id)}
              onClick={close}
              className="block px-2 py-3 text-base font-medium"
              style={{ color: active === l.id ? 'var(--accent-text)' : 'var(--fg-muted)' }}
            >
              {l.label}
            </a>
          ))}
          <div className="my-3 h-px" style={{ background: 'var(--border)' }} />
          <div className="flex flex-col gap-2">
            <HudButton
              href="/api/pdf-resume"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <span>$ download resume</span>
              <span aria-hidden="true">&darr;</span>
            </HudButton>
            <ContactButton className="w-full" onOpen={close} />
          </div>
        </div>
      </div>
    </header>
  );
};
