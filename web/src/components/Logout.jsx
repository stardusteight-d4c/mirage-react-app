import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { BiPowerOff } from 'react-icons/bi'

export const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <Button onClick={() => handleLogout()}>
      <BiPowerOff />
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a8ddf;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: white;
  }
`
