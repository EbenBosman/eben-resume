import React from 'react'

const renderReferences = hideReferences => {
    if (!hideReferences)
        return <li className="nav-item">
            <a className="nav-link" href="#references">References</a>
        </li>;

    return null;
}

const SiderBar = ({ basics, hideReferences }) => {
    return <div className="col-12 col-md-3 col-xl-2 p-0 bg-dark flex-shrink-1">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark flex-md-column flex-row align-items-center py-2 text-center sticky-top" id="sidebar">
            <div className="text-center">
                <img src={basics.picture} className="rounded-circle my-4 d-none d-md-block p-1 shadow" />
                {/* <a className="navbar-brand mx-0 font-weight-bold text-nowrap" href="#about">{basics.name}</a> */}
                {/* <h6 className="mx-0 text-nowrap"><b>{basics.position}</b></h6>
                <h6 className="text-muted">{basics.label}</h6> */}
            </div>
            <button className="navbar-toggler border-0 order-1" type="button" data-toggle="collapse" data-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse order-last" id="nav">
                <ul className="navbar-nav flex-column w-100 justify-content-center">
                    <li className="nav-item">
                        <a className="nav-link" href="#about">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#education">Education</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#experience">Experience</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#skills">Skills</a>
                    </li>
                    {renderReferences(hideReferences)}
                </ul>
            </div>
            <ul className="nav justify-content-center">
                <li className="nav-item">
                    <a href={basics.social.github} className="nav-link text-white px-2"><i className="fab fa-github fa-lg"></i></a>
                </li>
                <li className="nav-item">
                    <a href={basics.social.stackOverflow} className="nav-link text-white px-2"><i className="fab fa-stack-overflow fa-lg"></i></a>
                </li>
                <li className="nav-item">
                    <a href={`mailto:${basics.email}`} className="nav-link text-white px-2"><i className="fa fa-envelope fa-lg"></i></a>
                </li>
            </ul>
        </nav>
    </div>;
}

export default SiderBar;
