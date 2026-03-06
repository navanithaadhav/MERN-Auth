import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Emailverify = () => {
  axios.defaults.withCredentials = true;

  const {backendUrl, isLoggedIn,userData,getUserData} = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs= useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const otpSendingRef = useRef(false); // Prevent duplicate sends

  const sendOtp = async () => {
    if (otpSendingRef.current) return; // Already sending
    otpSendingRef.current = true;
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        setOtpSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      otpSendingRef.current = false;
    }
  };

  //automaticaly change focus to next input when a digit is entered
  const handleInput = (e, index) => {           
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputRefs.current[index - 1].focus();
    }
  }
  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('text');
    const pasteArray = pastedValue.split('');
    
      pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
         
        }
      });
      
  }
  const onSubmit = async(e) => {
    try{
      e.preventDefault();
      const otpArray= inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      if (otp.length !== 6) {
        toast.error("Please enter all 6 digits");
        return;
      }
      const {data} = await axios.post(`${backendUrl}/api/auth/verify-account`, {otp});
      if(data.success) {
        toast.success("Email verified successfully!");
        getUserData();
        navigate('/');
      }
      else{
        toast.error(data.message)
      }
    }catch (error) {
      console.error("Error verifying email:", error);
      toast.error(error.response?.data?.message || error.message);
    }
    
  }
   useEffect(() => {
    // Redirect if already verified
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/');
    }
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      navigate('/login');
    }
   },[isLoggedIn, userData, navigate]);

   // Send OTP when component mounts (if logged in)
   useEffect(() => {
    if (isLoggedIn && !otpSent) {
      sendOtp();
    }
   }, [isLoggedIn]);

    


  return (
    <div className='flex items-center  justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form onSubmit={onSubmit}className='bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 test-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your id.</p>
        <div className='flex justify-between  mb-4' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-10 h-12 m-1 text-center bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xl"
              autoFocus={index === 0}
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e,index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify email</button>
        <p className='text-center mt-4 text-indigo-300 text-sm'>
          Didn't receive the code?{' '}
          <span onClick={sendOtp} className='text-blue-400 cursor-pointer hover:underline'>Resend OTP</span>
        </p>
      </form>
    </div>
  );
};

export default Emailverify;