import React from 'react';

const extractParagraphs = ({ about }) => {
    return about.map((p, key) => {
        return <p key={key}>{p}</p>;
    });
}

const about = ({ basics, about }) => {
    if (!about)
        return null;

    return <div className="container pt-2 pb-4" id="about">
        <div className="row">
            <div className="col-12">
                <h1 className="font-weight-light">Hi, I'm {basics.name}</h1>
            </div>
        </div>
        {extractParagraphs({ about })}
    </div>;
}

export default about;