import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate.jsx'
import Chat from './pages/Chat/Chat.jsx'
import { Toaster } from "react-hot-toast"
import { useContext } from 'react'
import {AuthContext} from './context/AuthContext.jsx'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <Chat /> : <Navigate to= "/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to= "/" />} />
        <Route path="/profile" element={authUser ? <ProfileUpdate /> : <Navigate to= "/login" />} />
      </Routes>
    </div>

  )
}

export default App