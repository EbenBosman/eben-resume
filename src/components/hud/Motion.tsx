'use client';

import React, { useEffect, useRef } from 'react';

/** Reveals every [data-reveal] element once, as it enters the viewport. Mount once per page. */
export const RevealObserver: React.FC = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('reveal-live');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
};

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * HUD "decode": the label scrambles through characters and settles left to right, once, when it
 * first scrolls into view. Server-rendered as the final text (SEO, no-JS); screen readers get a
 * stable copy; skipped for reduced motion.
 */
export const Decode: React.FC<{ text: string; duration?: number }> = ({ text, duration = 700 }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const settled = Math.floor(progress * text.length);
          el.textContent = Array.from(text, (ch, i) =>
            i < settled || !/[A-Z0-9]/i.test(ch)
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join('');
          if (progress < 1) frame = requestAnimationFrame(tick);
          else el.textContent = text;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text, duration]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </>
  );
};

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const scrambleChar = (ch: string) => {
  const set = /[a-z]/.test(ch) ? LOWER : /[A-Z]/.test(ch) ? UPPER : /[0-9]/.test(ch) ? DIGITS : '';
  return set ? set[Math.floor(Math.random() * set.length)] : ch;
};

/**
 * A paragraph that decodes on load: every letter scrambles (case kept) and the text settles left
 * to right. Each word's width is locked (after web fonts load) while it scrambles, so lines never
 * re-wrap. Hidden until it starts (html.motion-ready); if JS is slow, a CSS failsafe shows it as
 * plain text after 0.7s and the scramble is skipped. Plain text for screen readers; skipped for
 * reduced motion.
 */
export const DecodeParagraph: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}> = ({ text, className = '', delay = 260, duration = 900 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = ref.current;
    const para = paraRef.current;
    if (!host || !para) return;
    // `is-live` lifts the pre-start hide (a class, not state: nothing else re-renders).
    const goLive = () => para.classList.add('is-live');
    // Already visible means reduced motion, no motion-ready, or the CSS failsafe fired because
    // JS was slow: leave it as plain text rather than scramble text the reader can already see.
    const alreadyShown = () => getComputedStyle(para).opacity !== '0';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || alreadyShown()) {
      goLive();
      return;
    }

    const words = Array.from(host.querySelectorAll<HTMLSpanElement>('.lw'));
    const finals = words.map((w) => w.textContent ?? '');
    const total = finals.reduce((n, f) => n + f.length, 0);
    let cancelled = false;
    let started = false;
    let frame = 0;
    let timer = 0;

    const render = (settled: number) => {
      let offset = 0;
      words.forEach((w, i) => {
        const f = finals[i];
        w.textContent = Array.from(f, (ch, k) =>
          offset + k < settled ? ch : scrambleChar(ch),
        ).join('');
        offset += f.length;
      });
    };
    const finish = () => {
      words.forEach((w, i) => {
        w.textContent = finals[i];
        w.removeAttribute('style');
      });
    };

    // Lock widths only once the web font is in (fallback metrics would re-wrap later), reading
    // every width first and writing afterwards (one layout pass, not one per word).
    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (alreadyShown()) {
        goLive();
        return;
      }
      const widths = words.map((w) => w.getBoundingClientRect().width);
      words.forEach((w, i) => {
        w.style.display = 'inline-block';
        w.style.width = `${widths[i]}px`;
        w.style.whiteSpace = 'nowrap';
        w.style.overflow = 'hidden';
        w.style.verticalAlign = 'bottom';
      });
      started = true;
      render(0);
      goLive();
      let start = 0;
      const tick = (now: number) => {
        if (!start) start = now;
        const settled = Math.floor(Math.min(1, (now - start) / duration) * total);
        render(settled);
        if (settled < total) frame = requestAnimationFrame(tick);
        else finish();
      };
      timer = window.setTimeout(() => {
        frame = requestAnimationFrame(tick);
      }, delay);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      if (started) finish();
    };
  }, [text, delay, duration]);

  return (
    <p ref={paraRef} className={`${className} lead-decode`}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text.split(' ').map((word, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            <span className="lw">{word}</span>
          </React.Fragment>
        ))}
      </span>
    </p>
  );
};

/**
 * On large screens the hero is pinned under the sliding sheet, so its links and buttons can be
 * tabbed to while covered. When one takes focus while the page is scrolled, bring the hero back.
 */
export const HeroFocusGuard: React.FC<{ heroId: string }> = ({ heroId }) => {
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const onFocusIn = () => {
      if (getComputedStyle(hero).position === 'sticky' && window.scrollY > 0) {
        window.scrollTo({ top: 0 });
      }
    };
    hero.addEventListener('focusin', onFocusIn);
    return () => hero.removeEventListener('focusin', onFocusIn);
  }, [heroId]);
  return null;
};
