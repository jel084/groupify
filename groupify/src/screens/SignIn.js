import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', username, email);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      console.error('Error signing up:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 3500);
  }, []);

  return (
    <div>
      {loading ? (
        <header className='relative flex h-screen justify-center items-center'>
          <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
          <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
          <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>
          <div className="text-center font-sen font-regular drop-shadow-md">
            <h1 className="text-7xl">welcome to</h1>
            <h1 className="text-9xl">groupify</h1>
          </div>
        </header>
      ) : (
      <div className="bg-[#FFFFFF] min-h-screen flex flex-col items-center justify-center text-black font-sen">
        <h1 className="text-8xl pb-5 drop-shadow-md">groupify</h1>
        <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
        <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
        <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>

        <div className="w-full max-w-sm">
          <div className="mb-4">
            <p className="text-xl drop-shadow-md">Sign Up</p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4 drop-shadow-md">
            <CustomInput icon={<AiOutlineMail />} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <CustomInput icon={<AiOutlineLock />} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <CustomInput icon={<AiOutlineUser />} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <FormButton btnText={isSubmitting ? "Signing In..." : "Sign In"} /> {/* Button shows loading state */}
          </form>
          {error && <p className="text-red-500">{error}</p>}
          <div className="text-center">
            <p className="pt-3 drop-shadow-md">
              Already have an account?{' '}
              <Link to="/" className="text-[#00B4DB] underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SignIn;
