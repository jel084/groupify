import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './screens/SignIn';
import Login from './screens/Login';

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 3500);
  }, []);


  return (
    <div> 
      {loading ?  
      
      <header className='relative flex h-screen justify-center items-center'>
        <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
        <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
        <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>
        

        <p className="text-center font-sen font-regular drop-shadow-md">
        <h1 className="text-7xl">
          welcome to
        </h1>
        <h1 className=" text-9xl ">
          groupify
        </h1>
        </p> 
      </header>
      :
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
      }
    </div>
  
  );
};

export default App;
