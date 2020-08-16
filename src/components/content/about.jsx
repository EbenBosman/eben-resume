import React from 'react';

const extractParagraphs = ({ content }) => {
    return content.map((p, key) => {
        return <p key={key}>{p}</p>;
    });
}

const about = ({ content }) => {
    if (!content)
        return null;

    return <div className="container pt-2 pb-4" id="about">
        <h1 className="font-weight-light">Eben Bosman</h1>
        {extractParagraphs({ content })}
        {/* <a role="button" className="btn btn-outline-dark align-center" href="#">Download PDF <i className="far fa-file-pdf fa-lg"></i></a> */}
    </div>;
}

export default about;