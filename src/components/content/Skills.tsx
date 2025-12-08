import React from 'react';
import { SkillItem } from '../../types/resume';

interface SkillsProps {
  content: SkillItem[];
}

const generateSkills = (skills: string[]) => {
  if (!skills) return null;

  return skills.map((skill, key) => {
    return (
      <p className="p-0 m-0" key={key}>
        {skill}
      </p>
    );
  });
};

const generateSkillSection = (skills: SkillItem[]) => {
  if (!skills) return null;

  return skills.map((skillset, key) => {
    return (
      <div key={key} className="w-full md:w-1/2 lg:w-1/4 px-4 py-3">
        <h5 className="text-lg font-bold text-white dark:text-dark-text mb-2 border-b-2 border-white pb-1 inline-block">
          {skillset.Title}
        </h5>
        <div className="text-white dark:text-dark-text">{generateSkills(skillset.Items)}</div>
      </div>
    );
  });
};

const Skills: React.FC<SkillsProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section id="skills" className="bg-gray-900 dark:bg-gray-800/50 pb-12">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center mb-6">
          <h2 className="text-3xl font-light text-white dark:text-dark-text mb-2">
            Skills &amp; Favourite Tools
          </h2>
        </div>
        <div className="flex flex-wrap justify-center text-center -mx-4">
          {generateSkillSection(content)}
        </div>
      </div>
    </section>
  );
};

export default Skills;
