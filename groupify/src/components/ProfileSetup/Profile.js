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
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
                    <ProfilePicture />
                </div>
                <div className="flex flex-col items-center mt-20"> 
                    <div className="text-center font-bold">real name here</div>
                    <div className="text-center text-gray-600">Username</div>
                </div>
                <div>about me</div>
                <div>courses</div>
                <div>preferences</div>
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
