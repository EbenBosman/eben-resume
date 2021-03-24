import React, { lazy } from 'react';

import profilePicture from '../../../images/eben-profile.webp';

const LazyImage = lazy(() => import(/* webpackChunkName: "lazy-image" */   './LazyImage'));

const profilePic = () => (
    <div className="text-center">
        <LazyImage alt="" width={200} height={200} src={profilePicture} placeholder="Loading..." className="rounded-circle my-4 d-none d-md-block p-1 shadow profile-pic" />
    </div>
);

export default profilePic;