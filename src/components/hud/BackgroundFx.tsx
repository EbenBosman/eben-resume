'use client';

import React, { useEffect, useRef } from 'react';

interface BackgroundFxProps {
  /**
   * subtle = radial glow only.
   * hud    = glow + masked grid + cursor-following spotlight + corner ticks + scanlines.
   */
  level?: 'subtle' | 'hud';
}

const CORNERS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

/**
 * Port of ataru-cesium's public BackgroundFx: decorative only (aria-hidden, no pointer events).
 * The spotlight follows the pointer over the parent section and fades after 1.4s of stillness;
 * it is skipped entirely for visitors who prefer reduced motion.
 */
export const BackgroundFx: React.FC<BackgroundFxProps> = ({ level = 'subtle' }) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (level !== 'hud' || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spot = () => el.querySelector<HTMLElement>('.fx-grid-spot');
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      spot()?.classList.remove('is-idle');
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => spot()?.classList.add('is-idle'), 1400);
    };
    const onLeave = () => spot()?.classList.add('is-idle');

    const target: Element = el.closest('section') ?? el.parentElement ?? document.body;
    target.addEventListener('pointermove', onMove as EventListener);
    target.addEventListener('pointerleave', onLeave);
    return () => {
      target.removeEventListener('pointermove', onMove as EventListener);
      target.removeEventListener('pointerleave', onLeave);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [level]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div className="fx-radial-glow absolute inset-0" />
      {level === 'hud' && (
        <>
          <div
            className="fx-grid absolute inset-0"
            style={{
              opacity: 0.3,
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 90%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 90%)',
            }}
          />
          <div className="fx-grid-spot is-idle absolute inset-0" />
          {CORNERS.map((c) => (
            <div
              key={`${c.x}${c.y}`}
              className="absolute"
              style={{
                width: 28,
                height: 28,
                opacity: 0.5,
                [c.y ? 'bottom' : 'top']: 16,
                [c.x ? 'right' : 'left']: 16,
                [c.y ? 'borderBottom' : 'borderTop']: '1px solid var(--accent)',
                [c.x ? 'borderRight' : 'borderLeft']: '1px solid var(--accent)',
              }}
            />
          ))}
          <div className="fx-scanlines absolute inset-0" style={{ opacity: 0.35 }} />
        </>
      )}
    </div>
  );
};
