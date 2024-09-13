import React from "react";
import ProfilePicture from "./ProfilePic";
import CSE_Banner from '../../pictures/CSE_Banner.jpg';

function Profile() {
    return (
        <div className="flex items-center justify-center">
            <div className="w-11/12 h-3/4 bg-[#D9D9D9] rounded-lg shadow-lg overflow-hidden relative">
                <div className="h-1/4 w-full">
                    <img
                        src={CSE_Banner}
                        alt="Banner"
                        className="object-cover h-full w-full"
                    />
                </div>
                {/* Content Area */}
                <ProfilePicture></ProfilePicture>
                <div className="p-6">
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>
                    <p>Stuf...</p>

                </div>
            </div>
        </div>
    );
}

export default Profile;
