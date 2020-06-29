import React from 'react';
import About from './content/about';
import Experience from './content/experience';
import Education from './content/education';
import Skills from './content/skills';
import References from './content/references';

const Content = ({ about, work, education, skills, references }) => {
    return (
        <section className="col-md-9 card-wrapper pull-right">
            <div className="card background-card">
                <div className="background-details">
                    <About content={about} />
                    <Experience content={work} />
                    <Education content={education} />
                    <Skills content={skills} />
                    <References content={references} />
                </div>
            </div>
        </section>
    );
}

export default Content;
