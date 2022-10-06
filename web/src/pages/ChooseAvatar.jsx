import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Buffer } from 'buffer'
import styled from 'styled-components'
import Loader from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { chooseAvatarRoute } from '../utils/api-routes'

const ChooseAvatar = () => {
  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const api = 'https://api.multiavatar.com/45678945'
  const navigate = useNavigate()

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  useEffect(() => {
    if (!localStorage.getItem('mirage-app-user')) {
      navigate('/login')
    }
  }, [])

  const handleProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Selecione um avatar', toastOptions)
    } else {
      const user = await JSON.parse(localStorage.getItem('mirage-app-user'))
      const { data } = await axios.post(`${chooseAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      })

      if (data.isSet) {
        user.isAvatarImageSet = true
        user.avatarImage = data.image
        localStorage.setItem('mirage-app-user', JSON.stringify(user))
        navigate('/')
      } else {
        toast.error('Error setting avatar. Please try again', toastOptions)
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('mirage-app-user')) {
        try {
          const data = []
          for (let i = 0; i < 4; i++) {
            const image = await axios.get(
              `${api}/${Math.round(Math.random() * 1000)}`
            )
            const buffer = new Buffer(image.data)
            data.push(buffer.toString('base64'))
          }
          setAvatars(data)
          setIsLoading(false)
        } catch (error) {
          toast.error(
            'Ops! Ocorreu um erro na requisição, recarregue a página ou tente novamente mais tarde.',
            toastOptions
          )
        }
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {isLoading ? (
        <Wrapper>
          <img src={Loader} alt="loading" width={150} />
        </Wrapper>
      ) : (
        <Wrapper>
          <div className="title-container">
            <h1>Escolha um avatar como sua foto de perfil</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                className={`avatar ${selectedAvatar === index && 'selected'}`}
                key={index}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar/img"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={handleProfilePicture}>
            Escolher como foto de perfil
          </button>
        </Wrapper>
      )}
      <ToastContainer />
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background-color: #212121;
  width: 100vw;
  height: 100vh;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    justify-content: center;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`

export default ChooseAvatar