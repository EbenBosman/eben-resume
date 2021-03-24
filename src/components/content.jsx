import React, { lazy } from 'react';

const About  = lazy(() => import(/* webpackChunkName: "about" */  './content/about'));
const Education  = lazy(() => import(/* webpackChunkName: "education" */  './content/education'));
const Experience  = lazy(() => import(/* webpackChunkName: "experience" */  './content/experience'));
const Skills  = lazy(() => import(/* webpackChunkName: "skills" */  './content/skills'));

const Content = ({ basics, about, work, education, skills }) => {
    return <div id="resume" className="col px-0 pt-3 flex-grow-1">
        <About basics={basics} about={about} />
        <Education content={education} />
        <Experience content={work} />
        <Skills content={skills} />
    </div>;
}

export default Content;
