import React, { lazy } from 'react';
import resume from '../data/resume';

const SiderBar = lazy(/* webpackChunkName: "sidebar-section */() => import('../components/siderbar'));
const Content = lazy(/* webpackChunkName: "content-section" */() => import('../components/content'));

class Home extends React.Component {
    render() {
        return <div className="container-fluid">
            <div className="row min-vh-100 flex-column flex-md-row">
                <SiderBar basics={resume.basics} />
                <Content
                    basics={resume.basics}
                    about={resume.about}
                    work={resume.work}
                    education={resume.education}
                    skills={resume.skills} />
            </div>
        </div>;
    }
}

export default Home;
