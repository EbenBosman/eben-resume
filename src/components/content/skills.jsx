import React from 'react';

const generateSkills = ({ skills }) => {
    if (!skills)
        return null;

    return <div className="space-top labels">
        {
            skills.map((skill, key) => {
                return <span key={key} className="label label-info">{skill}</span>
            })
        }
    </div>;
}

const skills = ({ content }) => {
    if (!content)
        return null;

    return (
        <div className="detail" id="skills">
            <div className="icon">
                <i className="fs-lg icon-tools"></i><span className="mobile-title">Skills</span>
            </div>
            <div className="info">
                <h4 className="title text-uppercase">Skills</h4>
                <div className="content">
                    <div className="card card-nested">
                        {generateSkills({ skills: content })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default skills;