import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Emailverify from './pages/Emailverify'
import ResetPassword from './pages/Resetpassword' // fixed casing
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/emailverify" element={<Emailverify/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
      </Routes>
    </div>
  )
}

export default App
