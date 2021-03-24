import React from 'react';

const generateSummaryParagraphs = ({ summary }) => {
    if (!summary || summary.length <= 0)
        return;

    return <p className="card-text mt-2">{summary}</p>;
}

const generateSummaryHighlights = ({ highlights }) => {
    if (!highlights || highlights.length <= 0)
        return null;

    return <ul>
        {
            highlights.map((highlight, key) => {
                return <li key={key} className="card-text"><span>{highlight}</span></li>;
            })
        }
    </ul>;
}

const generateHeader = ({ website, company, position }) => {
    return <div>
        <span>{position}</span>
        {generateLink({ website, company })}
    </div>;
}

const generateLink = ({ website, company }) => {
    if (typeof website !== 'undefined' && website.includes('http'))
        return <span><small> at </small><a rel="noopener" href={website} target="_blank"><small>{company}</small></a></span>;

    return null;
}

const generateCard = (key, job) => {
    return <div key={key} className="row no-gutters">
        <div className="col-md py-2" data-aos="zoom-in">
            <div className="card border">
                <div className="card-body">
                    <h4 className="card-title mb-0">{generateHeader({ website: job.website, company: job.company, position: job.position })}</h4>
                    <h6 className="card-title mb-0">{job.startDate} - {job.endDate}</h6>
                    <div className="small font-italic pb-2">{job.location}</div>
                    {generateSummaryParagraphs({ summary: job.summary })}
                    {generateSummaryHighlights({ highlights: job.highlights })}
                </div>
            </div>
        </div>
    </div>
}

const experience = ({ content }) => {
    if (!content)
        return null;

    return <section id="experience" className="container pt-4 pb-4">
        <h3 className="font-weight-light">Experience</h3>
        {content.map((job, key) => generateCard(key, job))}
    </section>;
}

export default experience;