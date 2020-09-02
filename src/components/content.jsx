import React from 'react';
import About from './content/about';
import Education from './content/education';
import Experience from './content/experience';
import Skills from './content/skills';

const Content = ({ basics, about, work, education, skills }) => {
    return <div id="resume" className="col px-0 pt-3 flex-grow-1">
        <About basics={basics} about={about} />
        <Education content={education} />
        <Experience content={work} />
        <Skills content={skills} />
    </div>;
}

export default Content;
