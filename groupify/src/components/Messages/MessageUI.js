import React from "react";
import style from '../Messages/MessageUI.css';

function MessageUI() {
    return (
        <>
        <div className="header">
            <h1 className="Title">Messages</h1>
        </div>

        <div className="container">
            <div className="dms"></div>
            <div className="currMessage"></div>
        </div>
        </>
    );
}

export default MessageUI;