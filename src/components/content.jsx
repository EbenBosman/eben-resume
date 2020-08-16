import React from 'react';
import About from './content/about';
import Education from './content/education';
import Experience from './content/experience';
import Skills from './content/skills';
import References from './content/references';

const Content = ({ about, work, education, skills, references, hideReferences, renderHTMLtoPDF }) => {
    return <div id="resume" className="col px-0 pt-3 flex-grow-1">
        <About content={about} renderHTMLtoPDF={renderHTMLtoPDF} />
        <Education content={education} />
        <Experience content={work} />
        <Skills content={skills} />
        <References content={references} hide={hideReferences} />
    </div>;
}

export default Content;
