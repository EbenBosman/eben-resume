import React from 'react';

const references = ({ content, hide }) => {
    if (!content || hide)
        return null;

        return <section id="references" className="container pt-4 pb-4">
            <h3 className="font-weight-light">References</h3>
            {
                content.map((contact, key) => {
                    return (
                        <div key={key} className="row no-gutters">
                            <div className="col-md pt-2" data-aos="zoom-in">
                                <div className="card border">
                                    <div className="card-body">
                                        <h4 className="card-title mb-0">{contact.name}</h4>
                                        <div className="small font-italic">{contact.reference}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </section>;
}

export default references;