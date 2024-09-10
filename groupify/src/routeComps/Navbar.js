import React, { useState } from "react";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "../App.css";
import { IconContext } from "react-icons";
import threebar from '../pictures/threebar.png';
import { FaRegBell } from "react-icons/fa";


function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
          <img
              src={threebar}
              alt="Menu"
              onClick={showSidebar}
              style={{ width: "48px", height: "48px", cursor: "pointer" }} 
            />

          </Link>
          
          {/* ------ */}
          <nav id="desktop-nav">
                <div>
                    <ul class="nav-links">
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/swipe">Swipe</a></li>
                        <li><a href="/messages">Messages</a></li>
                        <li><button className="notf"> <FaRegBell size = {45}/> </button></li>
                    </ul>
                </div>
            </nav>
{/* ------ */}

        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose size={48}/>
              </Link>
            </li>
            {Sidebar.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;