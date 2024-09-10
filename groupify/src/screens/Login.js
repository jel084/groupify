import React, { useState, useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import FormButton from '../components/FormButton';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { auth } from '../firebase'; // Ensure this points to your firebase config file
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state for button submission
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true
    setError(''); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', email);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (err) {
      setError(err.message); // Set error message
      console.error('Error logging in:', err);
    } finally {
      setIsSubmitting(false); // Set submitting state to false after login attempt
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <div>
      {loading ? (
        <header className='relative flex h-screen justify-center items-center'>
          <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
          <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
          <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>
          <div className="text-center font-sen font-regular drop-shadow-md">
            <h1 className="text-7xl">Welcome to</h1>
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
              <p className="text-xl drop-shadow-md">Login</p>
              <p className="pb-1">Please sign in to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <CustomInput
                icon={<AiOutlineMail />}
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CustomInput
                icon={<AiOutlineLock />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormButton btnText={isSubmitting ? "Signing In..." : "Sign In"} /> {/* Button shows loading state */}
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message */}
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
      )}
    </div>
  );
};

export default Login;
