import React from 'react';

import profilePicture from '../../images/eben-profile.webp';
import { Basics } from '../../types/resume';
import { ContactButton } from '../contact/ContactButton';
import { BackgroundFx } from '../hud/BackgroundFx';
import { HudButton } from '../hud/HudButton';
import { Decode, DecodeParagraph } from '../hud/Motion';
import { ScrollGlitchImage } from '../hud/ScrollGlitchImage';

interface HeroProps {
  basics: Basics;
  lead: string;
}

// Corner ticks, each scaling in from its own corner.
const TICKS = [
  'top-0 left-0 border-t border-l origin-top-left',
  'top-0 right-0 border-t border-r origin-top-right',
  'bottom-0 left-0 border-b border-l origin-bottom-left',
  'bottom-0 right-0 border-b border-r origin-bottom-right',
];

const step = (n: number) => ({ '--d': n }) as React.CSSProperties;

/**
 * The photo in HUD corner ticks (tablet and up). On load the ticks snap in first (.photo-tick),
 * then the image glitches in *inside* them: the glitching layer (.glitch-in) sits in a clipping box
 * so offset slices never leave the frame. As the hero scrolls out the image glitches again
 * (ScrollGlitchImage: harder the further you scroll down, calm when scrolling back).
 */
const PhotoFrame: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => (
  <div className={`relative p-3 ${className}`}>
    {TICKS.map((pos) => (
      <span
        key={pos}
        aria-hidden="true"
        className={`photo-tick absolute h-6 w-6 ${pos}`}
        style={{ borderColor: 'var(--accent)' }}
      />
    ))}
    <div className="overflow-hidden">
      <div className="glitch-in" style={step(3)}>
        <ScrollGlitchImage
          heroId="about"
          src={profilePicture}
          alt={name}
          width={320}
          height={320}
          placeholder="blur"
          // Lazy, not priority: the frame is display:none on phones, and a priority preload
          // made every phone download a photo it never shows. Above the fold on larger
          // screens, so it still loads straight away there.
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      </div>
    </div>
  </div>
);

/** HUD hero: mission-brief eyebrow, name with a terminal cursor, lead paragraph, CTAs, photo. */
const Hero: React.FC<HeroProps> = ({ basics, lead }) => (
  <section
    id="about"
    aria-labelledby="hero-title"
    // px-8 / sm:px-10: content sits inside the HUD corner brackets (16px in, 28px arms).
    className="hero-pin relative overflow-clip px-8 pt-16 pb-20 sm:px-10 md:pt-20 md:pb-24"
  >
    <BackgroundFx level="hud" />

    <div
      className="hero-dim relative mx-auto grid items-center gap-12 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
      style={{ maxWidth: 'var(--content-max)', zIndex: 1 }}
    >
      {/* Load-in: each line wipes in where it stands (--d = step), see .hero-in in globals.css. */}
      <div className="hero-in">
        <div className="t-eyebrow" style={step(0)}>
          <Decode text="// " />
          <span className="hidden lg:inline">
            <Decode text="MISSION BRIEF · " />
          </span>
          <Decode text={basics.position} />
        </div>
        <h1 id="hero-title" className="t-h1 mt-5" style={step(1)}>
          Hi, I&apos;m {basics.name}
        </h1>
        {/* Lead paragraph decodes on load: scrambles, then settles left to right (word widths
            locked so lines never re-wrap). */}
        <DecodeParagraph text={lead} className="lead-fx t-body-lg mt-6 max-w-[620px]" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={step(3)}>
          <HudButton href="/api/pdf-resume" target="_blank" rel="noopener noreferrer">
            <span>$ download resume</span>
            <span aria-hidden="true">&darr;</span>
          </HudButton>
          <ContactButton />
        </div>

        <ul
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start"
          style={step(4)}
        >
          {[
            ['github', basics.social.github],
            ['linkedin', basics.social.linkedIn],
            ['stack overflow', basics.social.stackOverflow],
          ].map(([label, href]) => (
            <li key={label}>
              <a className="hud-link" href={href} target="_blank" rel="noreferrer">
                &raquo; {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Tablet and up only: on phones the photo is left out so the hero stays compact. */}
      <PhotoFrame name={basics.name} className="mx-auto hidden w-full max-w-[340px] md:block" />
    </div>
  </section>
);

export default Hero;
