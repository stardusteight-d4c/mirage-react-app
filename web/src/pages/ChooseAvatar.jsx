import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { chooseAvatarRoute } from '../utils/api-routes'

const ChooseAvatar = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(null)
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

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  console.log('selectedFile', selectedFile)

  const avatars = [
    'https://i.ibb.co/DWQ4fky/avatar01.jpg',
    'https://i.ibb.co/PTjd6pJ/avatar02.jpg',
    'https://i.ibb.co/7v8G22h/avatar03.png',
    'https://i.ibb.co/VB9RGjD/avatar04.jpg',
  ]

  // Trabalhar na lógica de selecionar uma imagem padrão ou via arquivo -> fazer responsividade 
  // Socket.io realtime message

  return (
    <>
      <Wrapper>
        <div className="title-container">
          <h1>Escolha um avatar como sua foto de perfil</h1>
        </div>
        <div className="avatars">
          {avatars?.map((avatar, index) => (
            <div
              className={`avatar ${selectedAvatar === index && 'selected'}`}
              key={index}
            >
              <img
                src={avatar}
                alt="avatar/img"
                onClick={() => setSelectedAvatar(index)}
              />
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={handleProfilePicture}>
          Escolher como foto de perfil
        </button>
        <input type="file" onChange={addImageToPost} />
        <img
          className="selectedFile"
          src={selectedFile}
          alt="avatar/img"
          onClick={() => setSelectedAvatar(index)}
        />
      </Wrapper>
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
  background-color: #17181a;
  width: 100vw;
  height: 100vh;
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
      border: 2px solid transparent;
      padding: 0.4rem;
      border-radius: 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        border-radius: 100%;
      }
    }
    .selected {
      border: 2px solid #0a8ad7;
    }
  }
  .submit-btn {
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
  .selectedFile {
    height: 6rem;
    border-radius: 100%;
  }
`

export default ChooseAvatar
