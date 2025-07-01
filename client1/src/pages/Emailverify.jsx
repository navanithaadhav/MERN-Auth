import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'

const Emailverify = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form className='bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 test-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your id.</p>
      </form>
    </div>
  );
};

export default Emailverify;