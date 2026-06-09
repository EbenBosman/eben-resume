import React from 'react';
import { Basics, WorkItem, EducationItem, SkillItem, Ataru } from '../types/resume';

import About from './content/About';
import AtaruSection from './content/AtaruSection';
import Education from './content/Education';
import Experience from './content/Experience';
import Skills from './content/Skills';

interface ContentProps {
  basics: Basics;
  about: string[];
  ataru: Ataru;
  work: WorkItem[];
  education: EducationItem[];
  skills: SkillItem[];
}

const Content: React.FC<ContentProps> = ({ basics, about, ataru, work, education, skills }) => {
  return (
    <div id="resume" className="flex-1 w-full px-0 pt-3 md:pt-0">
      <About basics={basics} about={about} />
      <AtaruSection content={ataru} />
      <Education content={education} />
      <Experience content={work} />
      <Skills content={skills} />
    </div>
  );
};

export default Content;
