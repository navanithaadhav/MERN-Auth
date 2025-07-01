
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Navbar = () => {
  const navigate = useNavigate()
  const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext (AppContext)
  const handleLogin = () => {
    navigate('/login')
  }
  const sendVerificationOtp = async () => {
    try{
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/user/send-verify-otp')
      if(data.success){
        navigate('/emailverify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    }
    catch (error){
      toast.error(error.message)
    }
  }

   const logout= async () =>{
    try{
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
        data.success && setIsLoggedIn(false)
        data.success && setUserData(false)
        navigate('/')
    }
    catch (error){
      toast.error(error.message)
    }
   }
  return (
    <div className='w-full flex justify-between items-center bg-white p-4 sm:p-6 sm:px-24 absolute top-0 bg-[url("/bg_img.png")]'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
        {userData ? 
        <div className='text-white bg-black w-8 h-8 rounded-full flex justify-center items-center relative group'>
          {userData.name[0].toUpperCase() }
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black  rounded pt-10 '>
           <ul className='=list-none m-0 p-2 bg-gray-100 text-sm'>
            {!userData.isAccountVerified &&  <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
           
            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
           </ul>
          </div>
        </div> :
        <button  onClick={handleLogin} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>
        }
        
    </div>
  )
}

export default Navbar