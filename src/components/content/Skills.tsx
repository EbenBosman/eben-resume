import React from 'react';

import { SkillItem } from '../../types/resume';
import { BackgroundFx } from '../hud/BackgroundFx';
import { Decode } from '../hud/Motion';
import { pad2, SectionHead } from '../hud/SectionHead';

// Website only: "AI-Assisted Development (Claude Code, Cursor, Antigravity)" becomes four chips, so a
// long parenthetical list never wraps one chip onto two lines on phones. The PDF keeps the
// original wording from resume.json.
const toChips = (items: string[]) =>
  items.flatMap((item) => {
    const m = item.match(/^(.+?)\s*\((.+,.+)\)$/);
    return m ? [m[1], ...m[2].split(',').map((s) => s.trim())] : [item];
  });

interface SkillsProps {
  content: SkillItem[];
}

/** Skill groups as hairline-ruled columns with square mono chips. */
const Skills: React.FC<SkillsProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      // z-10 + opaque background: slides over the released experience deck (CardDeck).
      className="relative z-10 overflow-hidden bg-page px-4 py-20 sm:px-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <BackgroundFx level="subtle" />
      <div className="relative mx-auto" style={{ maxWidth: 'var(--content-max)', zIndex: 1 }}>
        <SectionHead
          eyebrow={`STACK.${pad2(content.length)}`}
          title="Skills & favourite tools"
          id="skills-title"
        />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {content.map((group, key) => (
            <div
              key={key}
              className="border-l pl-5"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              <h3 className="t-eyebrow">
                <Decode text={group.Title} />
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {toChips(group.Items).map((skill, i) => (
                  <li
                    key={i}
                    data-reveal
                    className="t-mono border bg-card px-2.5 py-1 text-sm text-fg"
                    style={{ borderColor: 'var(--border-strong)', '--i': i } as React.CSSProperties}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
