import React from 'react';

const references = ({ content }) => {
    if (!content)
        return null;

    return (
        <div className="detail" id="references">
            <div className="icon">
                <i className="fs-lg icon-thumbs-up"></i><span className="mobile-title">References</span>
            </div>
            <div className="info">
                <h4 className="title text-uppercase">References</h4>
                <div className="content">
                    <ul className="list-unstyled clear-margin">
                        {
                            content.map((contact, key) => {
                                return (
                                    <li key={key} className="card card-nested">
                                        <p>{contact.name}</p>
                                        <small>{contact.reference}</small>
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

export default references;