import React from 'react';

import { Basics } from '../types/resume';
import { ContactLink } from './contact/ContactButton';

/**
 * Slim Cesium-style footer: the name on its own line, then position, links and the build label
 * sharing one baseline beneath it (stacked on phones).
 */
const Footer: React.FC<{ basics: Basics }> = ({ basics }) => (
  <footer
    className="relative z-10 bg-page px-4 py-10 sm:px-6"
    style={{ borderTop: '1px solid var(--border)' }}
  >
    <div className="mx-auto" style={{ maxWidth: 'var(--content-max)' }}>
      <div className="font-bold text-fg">{basics.name}</div>
      <div className="mt-1 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
        <div className="t-chip">{basics.position}</div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            ['resume.pdf', '/api/pdf-resume'],
            ['github', basics.social.github],
            ['linkedin', basics.social.linkedIn],
            ['stack overflow', basics.social.stackOverflow],
          ].map(([label, href]) => (
            <li key={label}>
              <a
                className="hud-link"
                href={href}
                target="_blank"
                rel={href.startsWith('/') ? 'noopener noreferrer' : 'noreferrer'}
              >
                &raquo; {label}
              </a>
            </li>
          ))}
          <li>
            <ContactLink />
          </li>
        </ul>
        <div className="t-chip">
          &copy; {new Date().getFullYear()} &middot; {'// BUILT WITH NEXT.JS'}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
