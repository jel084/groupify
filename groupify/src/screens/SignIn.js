import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import FormButton from '../components/FormButton';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [username,setUsername] = useState('');
  const [error,setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', username, email);
      navigate('/login')
    } catch (err) {
      setError(err.message);
      console.error('Error signing up:', err);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col items-center justify-center text-black font-sen">
      <h1 className="text-8xl pb-5">groupify</h1>
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <p className="text-xl drop-shadow-md">Sign Up</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <CustomInput icon={<AiOutlineMail />} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <CustomInput icon={<AiOutlineLock />} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <CustomInput icon={<AiOutlineUser />} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <FormButton btnText="Sign Up" />
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <div className="text-center">
          <p className="pt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00B4DB] underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
