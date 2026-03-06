import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  
  const {userData} = useContext(AppContext)

  return (
    <div className='h-screen flex flex-col justify-center items-center  text-center text-gray-800 mx-20 px-4'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer' }!  <img src={assets.hand_wave} alt="" className='w-8 aspect-square'/></h1>
        <h2 className='text-5xl sm:test-5xl font-semibold mb-4'>Welcome to our app</h2>
        <p className='mb-8 max-w-md'>let's start with a quick product tour and we will have youn up andrunning in no time!</p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100'>Get Started</button>
    </div>
  )
}

export default Header