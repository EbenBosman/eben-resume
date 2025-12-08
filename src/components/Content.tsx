import React, { lazy } from 'react';
import { Basics, WorkItem, EducationItem, SkillItem } from '../types/resume';

const About = lazy(() => import('./content/About'));
const Education = lazy(() => import('./content/Education'));
const Experience = lazy(() => import('./content/Experience'));
const Skills = lazy(() => import('./content/Skills'));

interface ContentProps {
  basics: Basics;
  about: string[];
  work: WorkItem[];
  education: EducationItem[];
  skills: SkillItem[];
}

const Content: React.FC<ContentProps> = ({ basics, about, work, education, skills }) => {
  return (
    <div id="resume" className="flex-1 w-full px-0 pt-3 md:pt-0">
      <About basics={basics} about={about} />
      <Education content={education} />
      <Experience content={work} />
      <Skills content={skills} />
    </div>
  );
};

export default Content;
