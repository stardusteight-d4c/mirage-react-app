import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { loginRoute } from '../utils/api-routes'

const Login = () => {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  useEffect(() => {
    if (localStorage.getItem('mirage-app-user')) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      console.log('in validation', loginRoute)
      const { username, password } = values
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      })
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
    const { username, password } = values
    if (password === '') {
      toast.error('Insira uma senha', toastOptions)
      return false
    } else if (username === '') {
      toast.error('Insira seu nome de usuário', toastOptions)
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
            <h1>MirageChat</h1>
          </div>
          <input
            type="text"
            placeholder="Usuário"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
    
          <input
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => handleChange(e)}
          />
    
          <button type="submit">Entrar</button>
          <div>
            <div>Não possui uma conta?</div> <Link to="/register">Criar conta</Link>
          </div>
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
  background-color: #17181a;
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
      border: 0.1rem solid #0a8ad7;
      border-radius: 0.3rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #0a8ad7;
        outline: none;
      }
    }
    button {
      background-color: #0a8ad7;
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
        background-color: #04639e;
      }
    }
    div {
      color: white;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      a {
        text-decoration: none;
        color: #0a8ad7;
        text-transform: none;
        font-weight: bold;
      }
    }
  }
`

export default Login