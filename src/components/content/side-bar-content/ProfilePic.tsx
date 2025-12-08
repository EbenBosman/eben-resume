import React from 'react';
import Image from 'next/image';
import fullResolutionProfilePicture from '../../../images/eben-profile.webp';

interface ProfilePicProps {
    className?: string;
    width?: number;
    height?: number;
}

const ProfilePic: React.FC<ProfilePicProps> = ({
    className = "rounded-full my-4 hidden md:block p-1 shadow profile-pic",
    width = 200,
    height = 200
}) => (
    <div className="text-center">
        <Image
            src={fullResolutionProfilePicture}
            alt="Eben Bosman"
            width={width}
            height={height}
            placeholder="blur"
            className={className}
        />
    </div>
);

export default ProfilePic;
