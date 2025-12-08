import React from 'react';
import { WorkItem } from '../../types/resume';

interface ExperienceProps {
  content: WorkItem[];
}

const generateSummaryParagraphs = (summary: string) => {
  if (!summary || summary.length <= 0) return;

  return <p className="mt-2 text-sm text-text dark:text-dark-text">{summary}</p>;
};

const generateSummaryHighlights = (highlights: string[]) => {
  if (!highlights || highlights.length <= 0) return null;

  return (
    <ul className="list-disc list-inside mt-2 text-sm text-text dark:text-dark-text">
      {highlights.map((highlight, key) => {
        return (
          <li key={key} className="mb-1">
            <span>{highlight}</span>
          </li>
        );
      })}
    </ul>
  );
};

const generateHeader = (website: string, company: string, position: string) => {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="font-bold text-lg text-text dark:text-dark-text">{position}</span>
      {generateLink(website, company)}
    </div>
  );
};

const generateLink = (website: string, company: string) => {
  if (typeof website !== 'undefined' && website.includes('http'))
    return (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        <small> at </small>
        <a
          className="text-primary hover:underline hover:text-primary-dark"
          rel="noreferrer"
          href={website}
          target="_blank"
        >
          <small>{company}</small>
        </a>
      </span>
    );

  return null;
};

const generateCard = (key: number, job: WorkItem) => {
  return (
    <div key={key} className="flex flex-wrap -mx-4 mb-4">
      <div className="w-full px-4" data-aos="zoom-in">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-6 h-full transition-transform hover:-translate-y-1 duration-200">
          <div className="flex flex-col h-full">
            <div className="mb-1">
              {generateHeader(job.website, job.company, job.position)}
            </div>
            <h5 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-2">
              {job.startDate} - {job.endDate}
            </h5>
            <div className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">
              {job.location}
            </div>
            {generateSummaryParagraphs(job.summary)}
            {generateSummaryHighlights(job.highlights)}
          </div>
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC<ExperienceProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section id="experience" className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap mb-4">
        <div className="w-full">
          <h3 className="text-2xl font-light text-text dark:text-dark-text">Experience</h3>
        </div>
      </div>
      {content.map((job, key) => generateCard(key, job))}
    </section>
  );
};

export default Experience;
