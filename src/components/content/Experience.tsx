import React from 'react';

import { WorkItem } from '../../types/resume';
import { CardDeck } from '../hud/CardDeck';
import { pad2, SectionHead } from '../hud/SectionHead';

interface ExperienceProps {
  content: WorkItem[];
}

// The company always shows: as "at <link>" when the job has a URL, otherwise as plain text
// (entries like "Various positions held" don't read as "at ...").
const Company: React.FC<{ website?: string | null; company: string }> = ({ website, company }) => {
  if (!company) return null;
  if (!website?.startsWith('http')) {
    return <span className="text-fg-muted">{company}</span>;
  }
  return (
    <span className="text-fg-muted">
      at{' '}
      <a
        className="text-accent-text underline-offset-4 hover:underline"
        rel="noreferrer"
        href={website}
        target="_blank"
      >
        {company}
      </a>
    </span>
  );
};

/** Jobs as numbered HUD rows (01, 02, …) on hairline rules, like Cesium's manifesto rows. */
const Experience: React.FC<ExperienceProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="px-4 py-20 sm:px-6"
      style={{ background: 'var(--bg-muted)', borderTop: '1px solid var(--border)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--content-max)' }}>
        <SectionHead
          eyebrow={`EXPERIENCE.${pad2(content.length)}`}
          title="Experience"
          id="experience-title"
        />
        {/* Cards: on large screens CardDeck stacks them as you scroll; on phones they reveal one
            by one as they scroll in (data-reveal). */}
        <CardDeck className="space-y-6">
          {content.map((job, key) => (
            <li
              key={key}
              data-reveal
              className="grid gap-x-6 gap-y-3 border bg-card p-6 shadow-[0_-16px_40px_-28px_rgba(0,0,0,0.45)] sm:p-8 md:grid-cols-[72px_minmax(0,1fr)]"
            >
              <div className="t-num text-[34px] leading-none" aria-hidden="true">
                {pad2(key + 1)}
              </div>
              <div>
                {/* Phones: the company always sits on its own line under the title (same rhythm for
                    short and long names); from sm it follows the title inline. */}
                <div className="flex flex-col gap-0.5 text-sm sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:text-base">
                  <h3 className="t-h3">{job.position}</h3>
                  <Company website={job.website} company={job.company} />
                </div>
                {/* Phones: dates and location on their own lines, so every job has the same rhythm. */}
                <p className="t-chip mt-2">
                  <span>
                    {job.startDate} &ndash; {job.endDate}
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline">
                    {' '}
                    &middot;{' '}
                  </span>
                  <span className="mt-1 block tracking-[0.12em] sm:mt-0 sm:inline sm:tracking-[0.18em]">
                    {job.location}
                  </span>
                </p>
                {job.summary && <p className="t-body mt-4">{job.summary}</p>}
                {job.highlights?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="t-body flex gap-3">
                        <span aria-hidden="true" className="text-accent-text">
                          &rsaquo;
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </CardDeck>
      </div>
    </section>
  );
};

export default Experience;
