'use client';

import React, { useEffect, useRef, useState } from 'react';

// Deck only where every card fits on screen, and never for reduced motion; elsewhere the cards
// are an ordinary list (with the staggered reveal).
const DECK_QUERY =
  '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';
const TOP = 24; // first card's offset below the nav
const PEEK = 14; // visible strip of each covered card
const GAP = 24; // space between cards while they travel
const TUCK = 160; // over the last 160px of a card's approach, the card under it tucks its overflow away
const HOLD = 0.3; // fraction of the viewport the finished stack holds before it releases
const BLEED = 2; // extra px clipped under the card on top, so anti-aliased edges never peek out

/**
 * Scroll-driven card stack (replaces CSS sticky, which can't land the last card and pushes
 * taller cards up early when the list ends). One sticky frame; each card follows the page until
 * it reaches its slot (TOP + i·PEEK), then stays; a covered card is clipped to the card on top
 * so a taller card never shows below a shorter one. The release overlaps the next section via a
 * negative bottom margin, so no empty frame space scrolls past.
 */
export const CardDeck: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [deck, setDeck] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DECK_QUERY);
    const sync = () => setDeck(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const list = listRef.current;
    if (!deck || !outer || !list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const last = cards.length - 1;
    let heights: number[] = [];
    let bases: number[] = [];
    let slots: number[] = [];
    let navH = 56;
    let raf = 0;
    let firstMeasure = true;

    const update = () => {
      const progress = Math.max(0, navH - outer.getBoundingClientRect().top);
      const y = cards.map((_, i) => Math.max(slots[i], bases[i] - progress));
      const visible: number[] = [];
      for (let i = last; i >= 0; i--) {
        let clip = 0;
        if (i < last) {
          const above = i + 1;
          const approach = Math.min(1, Math.max(0, 1 - (y[above] - slots[above]) / TUCK));
          const limit = y[above] + visible[above] - y[i];
          clip = Math.max(0, heights[i] - limit + BLEED) * approach;
        }
        visible[i] = heights[i] - clip;
        const card = cards[i];
        card.style.transform = `translate3d(0, ${y[i]}px, 0)`;
        card.style.clipPath = clip > 0.5 ? `inset(0 0 ${clip}px 0)` : '';
        card.style.zIndex = String(i + 1);
      }
    };

    const measure = () => {
      navH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 56;
      const frameH = window.innerHeight - navH;
      // Exact (fractional) heights: rounded offsetHeight left sub-pixel slivers of covered text.
      heights = cards.map((c) => c.getBoundingClientRect().height);
      let acc = TOP;
      bases = heights.map((h) => {
        const b = acc;
        acc += h + GAP;
        return b;
      });
      slots = cards.map((_, i) => TOP + i * PEEK);
      const land = bases[last] - slots[last];
      const stackEnd = slots[last] + heights[last] + TOP;
      // The server renders a plain list; switching to the deck changes the page height after the
      // browser has already scrolled to a #fragment or restored the scroll position. Measure the
      // change once and put the reader back where they were.
      const before = firstMeasure ? outer.getBoundingClientRect() : null;
      const marginBottom = -Math.max(0, frameH - stackEnd);
      outer.style.height = `${frameH + land + frameH * HOLD}px`;
      outer.style.marginBottom = `${marginBottom}px`;
      if (before) {
        firstMeasure = false;
        const deckBottom = before.top + window.scrollY + before.height;
        const delta = outer.getBoundingClientRect().height + marginBottom - before.height;
        const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
        if (target && outer.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else if (delta !== 0 && window.scrollY >= deckBottom) {
          window.scrollBy({ top: delta, behavior: 'instant' });
        }
      }
      update();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(measure);
    cards.forEach((c) => resize.observe(c));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();

    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
      outer.style.height = '';
      outer.style.marginBottom = '';
      cards.forEach((c) => {
        c.style.transform = '';
        c.style.clipPath = '';
        c.style.zIndex = '';
      });
    };
  }, [deck]);

  return (
    <div ref={outerRef} className={deck ? 'card-deck' : undefined}>
      <div className="card-deck-frame">
        <ol ref={listRef} className={className}>
          {children}
        </ol>
      </div>
    </div>
  );
};
