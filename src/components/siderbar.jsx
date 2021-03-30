import React, { lazy, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ProfilePic = lazy(() => import(/* webpackChunkName: "profile-pic" */ './content/side-bar-content/profilePic'));


const SiderBar = ({ basics }) => {
    const [isLoading, setIsLoading] = useState(false);

    const constructResumeFileName = name => {
        const date = new Date();

        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).replace(/ /g, ' ')

        return `Resume of ${name} (${formattedDate}).pdf`;
    }

    const createAndDownloadPdf = e => {
        e.preventDefault();
        setIsLoading(true);
        axios.post('/pdf-resume', {})
            .then(() => axios.get('/pdf-resume', { responseType: 'blob' }))
            .then((res) => {
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

                saveAs(pdfBlob, constructResumeFileName('Eben Bosman'));
            })
            .then(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="col-12 col-md-3 col-xl-2 p-0 bg-dark flex-shrink-1 nav-bar-texture">
            <nav id="sidebar"
                className="navbar navbar-expand-md navbar-dark bg-none flex-md-column flex-row align-items-center py-2 text-center sticky-top">
                <ProfilePic />
                <button className="navbar-toggler border-0 order-1" type="button" data-toggle="collapse" data-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="nav" className="collapse navbar-collapse order-last">
                    <ul className="navbar-nav flex-column w-100 justify-content-center">
                        <li className="nav-item">
                            <a rel="noopener" className="nav-link text-white" href="#about">About</a>
                        </li>
                        <li className="nav-item">
                            <a rel="noopener" className="nav-link text-white" href="#education">Education</a>
                        </li>
                        <li className="nav-item">
                            <a rel="noopener" className="nav-link text-white" href="#experience">Experience</a>
                        </li>
                        <li className="nav-item">
                            <a rel="noopener" className="nav-link text-white" href="#skills">Skills</a>
                        </li>
                    </ul>
                </div>
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a rel="noreferrer" href={basics.social.github} className="nav-link text-white px-2 side-bar-link-hide-text" target="_blank">Github Prfole<i className="fab fa-github fa-lg"></i></a>
                    </li>
                    <li className="nav-item">
                        <a rel="noreferrer" href={basics.social.stackOverflow} className="nav-link text-white px-2 side-bar-link-hide-text" target="_blank">Stack Overflow Profile<i className="fab fa-stack-overflow fa-lg"></i></a>
                    </li>
                    <li className="nav-item">
                        <a rel="noreferrer" href={`mailto:${basics.email}`} className="nav-link text-white px-2 side-bar-link-hide-text">Mail Me<i className="fa fa-envelope fa-lg"></i></a>
                    </li>
                    <li className="nav-item">
                        <a rel="noreferrer" href="" className={`nav-link text-white px-2 side-bar-link-hide-text ${isLoading ? "animate-flicker" : ""}`} onClick={createAndDownloadPdf}>PDF Resume<i className="fa fa-file-pdf fa-lg"></i></a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default SiderBar;