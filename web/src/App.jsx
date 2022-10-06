import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import ChooseAvatar from './pages/ChooseAvatar'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chooseAvatar" element={<ChooseAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
