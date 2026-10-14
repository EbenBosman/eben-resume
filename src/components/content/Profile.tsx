import React from 'react';

import { Basics } from '../../types/resume';
import { Decode } from '../hud/Motion';
import { SectionHead } from '../hud/SectionHead';

interface ProfileProps {
  basics: Basics;
  paragraphs: string[];
}

/**
 * The rest of the About text in Cesium's 1 : 1.4 split (`pub-stack-md is-1-14`): heading and a
 * small fact list on the left, the paragraphs on an accent rule on the right.
 */
const Profile: React.FC<ProfileProps> = ({ basics, paragraphs }) => {
  if (!paragraphs.length) return null;

  const facts = [
    ['Since', String(basics.firstWorkYear)],
    ['Role', basics.position],
    ['Based', basics.location],
  ];

  return (
    <section
      aria-labelledby="profile-title"
      className="px-4 py-20 sm:px-6"
      style={{ borderTop: '1px solid var(--accent)' }}
    >
      <div
        className="mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14"
        style={{ maxWidth: 'var(--content-max)' }}
      >
        <div>
          <SectionHead eyebrow="PROFILE.README" title="Profile" id="profile-title" />
          <dl className="-mt-2 space-y-3 border-b pb-3">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-4 border-t pt-3"
              >
                <dt className="t-chip">
                  <Decode text={label} />
                </dt>
                <dd className="text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-5 border-l-2 pl-6" style={{ borderColor: 'var(--accent)' }}>
          {paragraphs.map((p, i) => (
            <p key={i} className="t-body-lg" style={{ color: 'var(--fg)' }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;
