import React from 'react';

import { EducationItem } from '../../types/resume';
import { pad2, SectionHead } from '../hud/SectionHead';

interface EducationProps {
  content: EducationItem[];
}

/** Certificates as Cesium "principles": a big Electrolize year over a hairline-ruled column. */
const Education: React.FC<EducationProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="px-4 py-20 sm:px-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--content-max)' }}>
        <SectionHead
          eyebrow={`CERTIFICATES.${pad2(content.length)}`}
          title="Certificates"
          id="certificates-title"
        />
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {content.map((education, key) => (
            <div
              key={key}
              data-reveal
              className="border-l pl-5"
              style={{ borderColor: 'var(--border-strong)', '--i': key } as React.CSSProperties}
            >
              <div className="t-num text-[34px] leading-none">
                {education.when || pad2(key + 1)}
              </div>
              <h3 className="t-h3 mt-4">{education.what}</h3>
              <p className="mt-1.5 text-sm text-fg-muted">{education.where}</p>
              {education.credentialId && (
                <p className="t-mono mt-2 text-sm text-fg-subtle">ID {education.credentialId}</p>
              )}
              {education.courses?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {education.courses.map((course, i) => (
                    <li key={i} className="t-mono border px-2 py-0.5 text-xs text-fg-muted">
                      {course}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
