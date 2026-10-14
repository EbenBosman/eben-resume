import React from 'react';

import { EducationItem } from '../../types/resume';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

interface EducationProps {
  content: EducationItem[];
}

const generateCourses = (courses: string[]) => {
  if (!courses) return null;

  return (
    <div className="mt-2 text-sm">
      {courses.map((course, key) => {
        return <Badge key={key}>{course}</Badge>;
      })}
    </div>
  );
};

const Education: React.FC<EducationProps> = ({ content }) => {
  if (!content) return null;

  return (
    <Section id="certificates" className="bg-background-alt dark:bg-transparent">
      <SectionTitle title="Certificates" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.map((education, key) => (
          <div key={key}>
            <Card>
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-bold text-foreground mb-1">{education.what}</h3>
                {education.when && (
                  <p className="text-md font-medium text-muted mb-1">{education.when}</p>
                )}
                <div className="text-sm italic text-muted mb-2">{education.where}</div>
                {education.credentialId && (
                  <div className="text-xs text-muted mb-2">
                    Credential ID: {education.credentialId}
                  </div>
                )}
                {generateCourses(education.courses)}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Education;
