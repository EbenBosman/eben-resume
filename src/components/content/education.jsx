import React from 'react';

const generateCourses = ({ courses }) => {
    if (!courses)
        return null;

    return <div className="space-top labels">
        {
            courses.map((course, key) => {
                return <span key={key} className="label label-info">{course}</span>
            })
        }
    </div>;
}

const education = ({ content }) => {
    if (!content)
        return null;

    return (
        <div className="detail" id="education">
            <div className="icon">
                <i className="fs-lg icon-graduation-cap"></i><span className="mobile-title">Education &amp; Certificates</span>
            </div>
            <div className="info">
                <h4 className="title text-uppercase">Education &amp; Certificates</h4>
                <div className="content">
                    <ul className="list-unstyled clear-margin">
                        {
                            content.map((education, key) => {
                                return (
                                    <li key={key} className="card card-nested">
                                        <div className="content">
                                            <p className="clear-margin relative">
                                                <strong>{education.what}</strong>&nbsp;<small>{education.where}</small>
                                            </p>
                                            <p className="text-muted">
                                                <small>{education.when}</small>
                                            </p>
                                            {generateCourses({ courses: education.courses })}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default education;