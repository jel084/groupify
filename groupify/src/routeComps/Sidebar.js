import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const Sidebar = [
  {
    title: "Profile",
    path: "/profile",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Settings",
    path: "/swipe",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/messages",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
  },
  {
    title: "About",
    path: "/profile",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
];