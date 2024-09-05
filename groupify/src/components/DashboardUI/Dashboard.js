import React from 'react';
import threebar from '../../pictures/threebar.png';
import './Dashboard.css'
export const Dashboard = () => {
return (
    <div>
    <img className = 'bars' src = {threebar}/>
        <h1 className = 'introName'>
            Hello Raul
        </h1>
    </div>
);
}