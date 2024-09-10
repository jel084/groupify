import React from "react";
import style from '../Messages/MessageUI.css';

function MessageUI() {
    return (
        <>
        <div className="header">
            <h1 className="Title">Messages</h1>

        </div>

        <div className="container">
            <div className="dms">
                <div className="search"></div>
                <div className="groupDm"></div>
                <div className="personalDm"></div>
            </div>
            <div className="currMessage"></div>

        </div>
        </>
    );
}

export default MessageUI;