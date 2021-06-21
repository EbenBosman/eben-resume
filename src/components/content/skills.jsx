import React from 'react';

const generateSkills = ({ skills }) => {
    if (!skills)
        return null;

    return skills.map((skill, key) => {
        return <p className="p-0 m-0" key={key}>{skill}</p>
    });
}

const generateSkillSection = ({ skills }) => {
    if (!skills)
        return null;

    return skills.map((skillset, key) => {
        return <div key={key} className="col-lg col-md-6 py-3">
            <h5>{skillset.Title}</h5>
            {generateSkills({ skills: skillset.Items })}
        </div>
    });
}


const skills = ({ content }) => {
    if (!content)
        return null;

    return (
        <section id="skills" className="bg-light pb-5">
            <div className="container pt-4 pb-4">
                <div className="row justify-content-center">
                    <h2 className="font-weight-light mb-2">Skills &amp; Favourite Tools</h2>
                </div>
                <div className="row text-center justify-content-center">
                    {generateSkillSection({ skills: content })}
                </div>
            </div>
        </section>
    );
}

export default skills;