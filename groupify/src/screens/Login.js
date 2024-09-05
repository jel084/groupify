import React from 'react';
import CustomInput from '../components/CustomInput';
import FormButton from '../components/FormButton';
import { Link } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

const Login = () => {
  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col items-center justify-center text-black font-sen">
      <h1 className="text-8xl pb-5">groupify</h1>
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <p className="text-xl drop-shadow-md">Login</p>
          <p className="pb-1">Please sign in to continue</p>
        </div>
        <form className="space-y-4">
          <CustomInput icon={<AiOutlineMail />} type="text" placeholder="Email" />
          <CustomInput icon={<AiOutlineLock />} type="password" placeholder="Password" />
        </form>
        <div className="text-center mt-6">
          <FormButton btnText="Sign Up" />
          <p className="pt-3">
            Don't have an account?{' '}
            <Link to="/signin" className="text-[#00B4DB] underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
