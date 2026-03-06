import { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Resetpassword = () => {
  axios.defaults.withCredentials = true;
  const {backendUrl}=useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs =useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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
      const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
          
          const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
          if (data.success) {
            setIsEmailSent(true);
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
  
      const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray= inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmited(true);
      }

      const onSubmitNewPassword = async (e) => {
        e.preventDefault(); 
        try {
          const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });
          data.success ? toast.success(data.message):toast.error(data.message);
          data.success && navigate('/login');
        } catch (error) {
          toast.error(error.message);
        }
      }
  return (
    <div  className='flex items-center  justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
       {/* enter email id */}

      { !isEmailSent &&
       <form onSubmit={onSubmitEmail} className='bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 test-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt="" className='w-4 h-4' />
          <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type="email" placeholder='Email id' required />
        </div>
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>
   }
{/* otp input form */}
      { isEmailSent && !isOtpSubmited &&
      <form onSubmit={onSubmitOtp} className='bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 test-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
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
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>
   }
      {/* new password  */}
      {isOtpSubmited && isEmailSent &&
      <form onSubmit={onSubmitNewPassword}className='bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 test-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your New email address</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.lock_icon} alt="" className='w-4 h-4' />
          <input onChange={e => setNewPassword(e.target.value)} value={newPassword} className='bg-transparent outline-none text-white' type="password" placeholder='password' required />
        </div>
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>
    }
    </div>
  )
}

export default Resetpassword