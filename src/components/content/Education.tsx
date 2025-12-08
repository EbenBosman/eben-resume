import React from 'react';
import { EducationItem } from '../../types/resume';

interface EducationProps {
    content: EducationItem[];
}

const generateCourses = (courses: string[]) => {
    if (!courses) return null;

    return (
        <div className="mt-2 text-sm">
            {courses.map((course, key) => {
                return (
                    <span
                        key={key}
                        className="inline-block px-2 py-1 mr-1 mb-1 text-xs font-medium text-white bg-gray-800 rounded dark:bg-gray-600"
                    >
                        {course}
                    </span>
                );
            })}
        </div>
    );
};

const Education: React.FC<EducationProps> = ({ content }) => {
    if (!content) return null;

    return (
        <section id="certificates" className="bg-gray-50 dark:bg-gray-800/50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap mb-4">
                    <div className="w-full">
                        <h3 className="text-2xl font-light text-text dark:text-dark-text">Certificates</h3>
                    </div>
                </div>
                {content.map((education, key) => {
                    return (
                        <div key={key} className="flex flex-wrap -mx-4 mb-4">
                            <div className="w-full px-4" data-aos="zoom-in">
                                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-6 h-full transition-transform hover:-translate-y-1 duration-200">
                                    <div className="flex flex-col h-full">
                                        <h4 className="text-lg font-bold text-text dark:text-dark-text mb-1">
                                            {education.what}
                                        </h4>
                                        <h5 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            {education.when}
                                        </h5>
                                        <div className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">
                                            {education.where}
                                        </div>
                                        {generateCourses(education.courses)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Education;
