import React from 'react';

import profilePicture from '../../../images/eben-profile.webp';

const profilePic = () => (
    <div className="text-center">
        <img alt="" width="true" height="true" src={profilePicture} className="rounded-circle my-4 d-none d-md-block p-1 shadow profile-pic" />
    </div>
);

export default profilePic;