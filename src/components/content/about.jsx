import React from 'react';

const extractParagraphs = ({ content }) => {
    return content.map((p, key) => {
        return <p key={key}>{p}</p>;
    });
}

const about = ({ content }) => {
    if (!content)
        return null;

    return (
        <div className="detail" id="about">
            <div className="icon">
                <i className="fs-lg icon-board"></i><span className="mobile-title">About Me</span>
            </div>
            <div className="info">
                <h4 className="title text-uppercase">About Me</h4>
                <ul className="list-unstyled clear-margin">
                    <li className="card card-nested clearfix">
                        <div className="content mop-wrapper">
                            {extractParagraphs({ content })}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default about;