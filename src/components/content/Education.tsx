import React from 'react';
import { EducationItem } from '../../types/resume';

interface EducationProps {
    content: EducationItem[];
}

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

const generateCourses = (courses: string[]) => {
    if (!courses) return null;

    return (
        <div className="mt-2 text-sm">
            {courses.map((course, key) => {
                return (
                    <Badge key={key}>
                        {course}
                    </Badge>
                );
            })}
        </div>
    );
};

const Education: React.FC<EducationProps> = ({ content }) => {
    if (!content) return null;

    return (
        <Section id="certificates">
            <SectionTitle title="Certificates" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.map((education, key) => (
                    <div key={key} data-aos="zoom-in">
                        <Card>
                            <div className="flex flex-col h-full">
                                <h4 className="text-lg font-bold text-foreground mb-1">
                                    {education.what}
                                </h4>
                                <h5 className="text-md font-medium text-muted mb-1">
                                    {education.when}
                                </h5>
                                <div className="text-sm italic text-muted mb-2">
                                    {education.where}
                                </div>
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
