import React from 'react';
import CustomInput from '../components/CustomInput';
import FormButton from '../components/FormButton';
import { Link } from 'react-router-dom';
import { AiOutlineMail, AiOutlineUser, AiOutlineLock } from 'react-icons/ai';

const SignIn = () => {
  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col items-center justify-center text-black">
      <h1 className="text-8xl pb-5">groupify</h1>
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <p className="text-xl">Sign Up</p>
          <p className="pb-1">Please sign up to continue</p>
        </div>
        <form className="space-y-4">
          <CustomInput icon={<AiOutlineMail />} type="text" placeholder="Email" />
          <CustomInput icon={<AiOutlineLock />} type="password" placeholder="Password" />
          <CustomInput icon={<AiOutlineUser />} type="text" placeholder="Username" />
        </form>
        <div className="text-center mt-6">
          <FormButton btnText="Sign Up" />
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
