import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import SignIn from './screens/SignIn';
import Login from './screens/Login';
import Dashboard from './components/DashboardUI/Dashboard';
import Profile from './components/ProfileSetup/Profile'; 
import MessageUI from './components/Messages/MessageUI'; 
import Swipe from './components/SwipePage/Swipe'; 
import Navbar from './routeComps/Navbar';
import { Outlet } from 'react-router-dom';
import './App.css';

// Define the layout for pages that include the Navbar
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

// Define the router structure
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
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
// Main App component with loading screen logic for SignIn and Login only
const App = () => {

  return (
    <RouterProvider router={router} />)
};

export default App;