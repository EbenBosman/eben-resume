import Image from 'next/image';
import React from 'react';

import cesiumTile from '../../images/cesium-tile.svg';
import { Ataru } from '../../types/resume';
import { BackgroundFx } from '../hud/BackgroundFx';
import { Decode } from '../hud/Motion';
import { pad2, SectionHead } from '../hud/SectionHead';

interface AtaruSectionProps {
  content: Ataru;
}

/** The flagship project, framed like Cesium's accent card (`pub-card-center`). */
const AtaruSection: React.FC<AtaruSectionProps> = ({ content }) => {
  if (!content) return null;
  const host = content.url.replace(/^https?:\/\//, '');
  const subtitle = content.subtitle.charAt(0) + content.subtitle.slice(1).toLowerCase();

  return (
    <section
      id="ataru"
      aria-labelledby="ataru-title"
      className="relative overflow-hidden px-4 py-20 sm:px-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <BackgroundFx level="subtle" />
      <div className="relative mx-auto" style={{ maxWidth: 'var(--content-max)', zIndex: 1 }}>
        <SectionHead
          eyebrow="PROJECT.FLAGSHIP"
          title={`${content.name} ${subtitle}`}
          id="ataru-title"
        />

        <div
          className="grid gap-10 border p-4 sm:p-8 md:grid-cols-[220px_minmax(0,1fr)]"
          style={{ borderColor: 'var(--accent)', background: 'rgba(0, 76, 255, 0.04)' }}
        >
          {/* Brand block */}
          <div className="flex flex-col items-center text-center">
            {/* The product's own mark (ataru-cesium BL-0222: the product identifies itself; the
                company keeps the kanji). 128px with a 36px radius is Cesium's BrandTile `2xl`: the full
                artwork's thin "55"/"CESIUM" strokes wash out below ~80px (BL-0230). Clipped to the
                radius so the glow follows the shape. */}
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-[36px] transition-transform duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: '0 12px 24px -6px rgba(0, 76, 255, 0.4)' }}
            >
              <Image
                src={cesiumTile}
                alt={`${subtitle} logo`}
                width={128}
                height={128}
                className="block"
              />
            </a>
            <div className="mt-5 text-3xl font-bold tracking-tight text-fg">{content.name}</div>
            <div className="t-submark mt-1 pl-[0.32em]">{content.subtitle}</div>
            <a
              className="hud-link mt-5"
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              &raquo; {host}
            </a>
          </div>

          {/* Description */}
          <div>
            {/* One item per line below lg (an item never breaks mid-phrase, and no wrapped line starts
                with a bullet); inline with bullets from lg, where it fits on one row. */}
            <ul className="t-chip flex flex-col gap-1 tracking-[0.12em] lg:flex-row lg:flex-wrap lg:gap-0 lg:tracking-[0.18em]">
              {content.tagline.split('•').map((item, i) => (
                <li key={i} className="whitespace-nowrap">
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-2 hidden lg:inline">
                      &bull;
                    </span>
                  )}
                  {item.trim()}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-3">
              {content.summary.map((paragraph, key) => (
                <p key={key} className="t-body">
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="t-eyebrow mt-8">
              <Decode text={`// MODULES.${pad2(content.features.length)}`} />
            </h3>
            <ul className="mt-3 grid gap-x-6 gap-y-2 xl:grid-cols-2">
              {content.features.map((feature, key) => (
                <li
                  key={key}
                  data-reveal
                  style={{ '--i': key } as React.CSSProperties}
                  className="flex items-baseline gap-2 text-[13px] text-fg sm:gap-3 sm:text-[15px] lg:text-base"
                >
                  <span className="t-num w-[1.6em] shrink-0 text-xs sm:text-sm" aria-hidden="true">
                    {pad2(key + 1)}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtaruSection;
