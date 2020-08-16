import React from 'react';

const generateCourses = ({ courses }) => {
    if (!courses)
        return null;

    return <div className="space-top labels">
        {
            courses.map((course, key) => {
                return <span key={key} className="text-normal badge badge-dark mr-1">{course}</span>;
            })
        }
    </div>;
}

const education = ({ content }) => {
    if (!content)
        return null;

    return <section id="education" className="bg-light pt-4 pb-4">
        <div className="container">
            <h3 className="font-weight-light">Education &amp; Certificates</h3>
            {
                content.map((education, key) => {
                    return (
                        <div key={key} className="row no-gutters">
                            <div className="col-md py-2" data-aos="zoom-in">
                                <div className="card border">
                                    <div className="card-body">
                                        <h4 className="card-title mb-0">{education.what}</h4>
                                        <h6 className="card-title mb-0">{education.when}</h6>
                                        <div className="small font-italic">{education.where}</div>
                                        {generateCourses({ courses: education.courses })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </section>;
}

export default education;