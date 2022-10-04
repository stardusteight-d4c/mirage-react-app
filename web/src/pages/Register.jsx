import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { registerRoute } from '../utils/api-routes'

export const Register = () => {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      console.log('in validation', registerRoute)
      const { username, email, password } = values
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      })
      console.log(data)
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('mirage-app-user', JSON.stringify(data.user))
        navigate('/')
      }
    }
  }

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values
    if (password !== confirmPassword) {
      toast.error('A confirmação da senha deve ser valida!', toastOptions)
      return false
    } else if (username.length < 3) {
      toast.error(
        'O nome de usuário deve ser maior que três caracteres',
        toastOptions
      )
      return false
    } else if (email === '') {
      toast.error('Campo email é obrigatório', toastOptions)
      return false
    } else if (password.length < 8) {
      toast.error('A senha deve conter pelo menos 8 caracteres', toastOptions)
      return false
    }
    return true
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  return (
    <>
      <FormWrapper>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="logo/torpedo" />
            <h1>Mirage</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Criar usuário</button>
          <span>
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </span>
        </form>
        <ToastContainer />
      </FormWrapper>
    </>
  )
}

const FormWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #212121;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #343434;
    border-radius: 1.5rem;
    padding: 3rem 4rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    input {
      background-color: transparent;
      padding: 0.8rem;
      border: 0.1rem solid #b13a6d;
      border-radius: 0.3rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #b13a6d;
        outline: none;
      }
    }
    button {
      background-color: #b13a6d;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #ff0570;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        text-decoration: none;
        color: #b13a6d;
        text-transform: none;
        font-weight: bold;
      }
    }
  }
`
