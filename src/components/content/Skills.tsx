import React from 'react';
import { SkillItem } from '../../types/resume';

interface SkillsProps {
  content: SkillItem[];
}

import { Badge } from '../ui/Badge';

const generateSkills = (skills: string[]) => {
  if (!skills) return null;

  return skills.map((skill, key) => {
    return <Badge key={key}>{skill}</Badge>;
  });
};

const generateSkillSection = (skills: SkillItem[]) => {
  if (!skills) return null;

  return skills.map((skillset, key) => {
    return (
      <div key={key} className="w-full md:w-1/2 lg:w-1/4 px-4 py-3">
        <h5 className="text-lg font-bold text-white mb-2 pb-1 inline-block">{skillset.Title}</h5>
        <div className="text-white">{generateSkills(skillset.Items)}</div>
      </div>
    );
  });
};

import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

// ... (existing helper functions)

const Skills: React.FC<SkillsProps> = ({ content }) => {
  if (!content) return null;

  return (
    <Section id="skills" className="bg-sidebar pb-12 pt-8">
      <SectionTitle
        title="Skills & Favourite Tools"
        className="text-white text-center text-3xl mb-6"
      />
      <div className="flex flex-wrap justify-center text-center -mx-4">
        {generateSkillSection(content)}
      </div>
    </Section>
  );
};

export default Skills;
