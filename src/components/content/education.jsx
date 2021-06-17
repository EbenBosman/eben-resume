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

    return <section id="certificates" className="bg-light pt-4 pb-4">
        <div className="container">
            <h3 className="font-weight-light">Certificates</h3>
            {
                content.map((education, key) => {
                    return (
                        <div key={key} className="row no-gutters">
                            <div className="col-md py-2" data-aos="zoom-in">
                                <div className="card border">
                                    <div className="card-body">
                                        <h4 className="card-title mb-0">{education.what}</h4>
                                        <h5 className="card-title mb-0 education-date">{education.when}</h5>
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