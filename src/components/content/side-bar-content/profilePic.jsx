import React, { lazy } from 'react';

import fullResolutionProfilePicture from '../../../images/eben-profile.webp';
import lowResolutionProfilePicture from '../../../images/eben-profile-low-res.webp';

const LazyImage = lazy(() => import(/* webpackChunkName: "lazy-image" */   './LazyImage'));

const profilePic = () => (
    <div className="text-center">
        <LazyImage alt="" width={200} height={200} fullResSrc={fullResolutionProfilePicture} lowResSrc={lowResolutionProfilePicture} className="rounded-circle my-4 d-none d-md-block p-1 shadow profile-pic" />
    </div>
);

export default profilePic;