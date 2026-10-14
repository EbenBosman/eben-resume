'use client';

import Image, { ImageProps } from 'next/image';
import React, { useEffect, useRef } from 'react';

/**
 * An image that glitches as the hero scrolls out, harder and more often the further it goes
 * (progress p = scrollY / hero height). Glitches fire only while scrolling DOWN; scrolling back up
 * clears the image at once, so the return is calm. Each glitch is a brief offset slice with a
 * colour shift, cleared after ~70–120ms. Off for reduced motion and when the image is hidden.
 */
export const ScrollGlitchImage: React.FC<ImageProps & { heroId: string }> = ({
  heroId,
  alt,
  ...props
}) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    const hero = document.getElementById(heroId);
    if (!img || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastY = window.scrollY;
    let clearTimer = 0;
    const clear = () => {
      window.clearTimeout(clearTimer);
      img.style.clipPath = '';
      img.style.transform = '';
      img.style.filter = '';
    };

    const glitch = (p: number) => {
      const shift = (4 + p * 18) * (Math.random() < 0.5 ? -1 : 1);
      const hue = Math.round((30 + p * 120) * (Math.random() < 0.5 ? -1 : 1));
      img.style.transform = `translateX(${shift.toFixed(1)}px)`;
      img.style.filter = `hue-rotate(${hue}deg) saturate(${(1.4 + p * 1.6).toFixed(2)}) contrast(${(1 + p * 0.6).toFixed(2)})`;
      // Slices (only part of the image showing) get likelier as the hero leaves.
      if (Math.random() < 0.25 + p * 0.6) {
        const top = Math.random() * 70;
        const height = 10 + Math.random() * (40 - p * 20);
        img.style.clipPath = `inset(${top.toFixed(1)}% 0 ${Math.max(0, 100 - top - height).toFixed(1)}% 0)`;
      } else {
        img.style.clipPath = '';
      }
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(clear, 70 + Math.random() * 50);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY;
      lastY = y;
      if (img.offsetParent === null) return; // hidden (phones)
      const p = Math.min(1, Math.max(0, y / hero.offsetHeight));
      // Off at the very top, and once the hero is fully covered (nothing to see, no repaints).
      if (!down || p < 0.04 || p >= 1) {
        clear();
        return;
      }
      // Glitch chance per scroll event grows with progress.
      if (Math.random() < 0.12 + p * 0.55) glitch(p);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clear();
    };
  }, [heroId]);

  return <Image ref={ref} alt={alt} {...props} />;
};
