import React, {useState} from 'react';
import CustomInput from '../components/CustomInput';
import FormButton from '../components/FormButton';
import { Link } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', email);
      //navigate to dashboard
    } catch (err) {
      setError(err.message);
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col items-center justify-center text-black font-sen">
      <h1 className="text-8xl pb-5 drop-shadow-md">groupify</h1>
      <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
      <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
      <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>
        
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <p className="text-xl drop-shadow-md">Login</p>
          <p className="pb-1">Please sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <CustomInput icon={<AiOutlineMail />} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <CustomInput icon={<AiOutlineLock />} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <FormButton btnText="Sign In" />
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <div className="text-center">
          <p className="pt-3 drop-shadow-md">
            Don't have an account?{' '}
            <Link to="/signin" className="text-[#00B4DB] underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
        
    </div>
  );
};

export default Login;
