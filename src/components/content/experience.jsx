import React from 'react';

const generateSummaryParagraphs = ({ summary }) => {
    if (!summary || summary.length <= 0)
        return;

    return <div className="mop-wrapper space-bottom"><p>{summary}</p></div>;
}

const generateSummaryHighlights = ({ highlights }) => {
    if (!highlights || highlights.length <= 0)
        return null;

    return <ul>
        {
            highlights.map((highlight, key) => {
                return (
                    <li key={key} className="mop-wrapper">
                        <p>{highlight}</p>
                    </li>
                )
            })
        }
    </ul>;
}

const generateHeader = ({ website, company, position }) => {
    return <div className="header">
        <h4 className="header-title">
            {
                website ? <a href={website} target="_blank">{company}</a> : <span>{company}</span>
            }
        </h4>
        <p className="header-text">{position}</p>
    </div>;
}

const experience = ({ content }) => {
    if (!content)
        return null;

    return (
        <div className="detail" id="work-experience">
            <div className="icon">
                <i className="fs-lg icon-office"></i><span className="mobile-title">Experience</span>
            </div>
            <div className="info">
                <h4 className="title text-uppercase">Experience</h4>
                <ul className="list-unstyled clear-margin">
                    {
                        content.map((job, key) => {
                            return (
                                <li key={key} className="card card-nested clearfix">
                                    <div className="content">
                                        {generateHeader({ website: job.website, company: job.company, position: job.position })}
                                        <p className="text-muted">
                                            <small><span className="space-right">{job.startDate} - {job.endDate}</span></small>
                                        </p>
                                        {generateSummaryParagraphs({ summary: job.summary })}
                                        {generateSummaryHighlights({ highlights: job.highlights })}
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default experience;