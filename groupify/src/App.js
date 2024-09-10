import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import Dashboard from './components/DashboardUI/Dashboard';
import Profile from './components/ProfileSetup/Profile'; 
import MessageUI from './components/Messages/MessageUI'; 
import Swipe from './components/SwipePage/Swipe'; 
import Navbar from './routeComps/Navbar';
import './App.css';

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/messages",
        element: <MessageUI />,
      },
      {
        path: "/swipe",
        element: <Swipe />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;