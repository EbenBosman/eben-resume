import React from 'react';
import { Basics } from '../../types/resume';

interface AboutProps {
    basics: Basics;
    about: string[];
}

const extractParagraphs = (about: string[]) => {
    return about.map((p, key) => {
        return <p key={key}>{p}</p>;
    });
};

const About: React.FC<AboutProps> = ({ basics, about }) => {
    if (!about) return null;

    return (
        <div className="container mx-auto px-4 py-8" id="about">
            <div className="flex flex-wrap">
                <div className="w-full">
                    <h1 className="text-4xl font-light text-text dark:text-dark-text mb-4">
                        Hi, I&apos;m {basics.name}
                    </h1>
                </div>
            </div>
            <div className="text-text dark:text-dark-text space-y-4">
                {extractParagraphs(about)}
            </div>
        </div>
    );
};

export default About;
