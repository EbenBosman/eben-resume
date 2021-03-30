import React, { lazy } from 'react';

import resume from '../data/resume.json';

const SiderBar = lazy(/* webpackChunkName: "sidebar-section */() => import('../components/siderbar'));
const Content = lazy(/* webpackChunkName: "content-section" */() => import('../components/content'));

const Home = () => (
    <div className="container-fluid">
        <div className="row min-vh-100 flex-column flex-md-row">
            <SiderBar basics={resume.basics} />
            <Content
                basics={resume.basics}
                about={resume.about}
                work={resume.work}
                education={resume.education}
                skills={resume.skills} />
        </div>
    </div>
)

export default Home;
