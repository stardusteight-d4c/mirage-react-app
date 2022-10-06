import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { allUsersRoute, hostServer } from '../utils/api-routes'
import { Contacts } from '../components/Contacts'
import { Welcome } from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'

import { HiHome, HiBell } from 'react-icons/hi'
import { IoGameController } from 'react-icons/io5'
import { BsFillChatDotsFill, BsMusicNote } from 'react-icons/bs'
import { FiMoreHorizontal } from 'react-icons/fi'

import { io } from 'socket.io-client'
import { Logout } from '../components/Logout'

const Chat = () => {
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [showLogout, setShowLogout] = useState(false)
  const navigate = useNavigate()

  const socket = useRef()

  useEffect(() => {
    async function handleCurrentUser() {
      if (!localStorage.getItem('mirage-app-user')) {
        navigate('/login')
      } else {
        const user = await JSON.parse(localStorage.getItem('mirage-app-user'))
        setCurrentUser(user)
      }
    }
    handleCurrentUser()
  }, [])

  useEffect(() => {
    const fetchDataContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data.data)
        } else {
          navigate('/chooseAvatar')
        }
      }
    }
    fetchDataContacts()
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(hostServer)
      socket.current.emit('add-user', currentUser._id)
    }
  }, [currentUser])

  const handleChangeChat = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <>
      {currentUser && (
        <Wrapper>
          <div className="container">
            <div className="menu">
              <div>
                <div className="avatar">
                  <img
                    onClick={() => setShowLogout(!showLogout)}
                    src="https://avatarfiles.alphacoders.com/165/thumb-165945.jpg"
                    alt="user/avatar"
                  />
                  {showLogout && (
                    <div className="logout">
                      <Logout />
                    </div>
                  )}
                </div>
                <div className="menu-icons">
                  <HiHome className="active" />
                  <HiBell />
                  <IoGameController />
                  <BsFillChatDotsFill />
                  <BsMusicNote />
                  <FiMoreHorizontal />
                </div>
              </div>
            </div>
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChangeChat}
            />
            {currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
              />
            )}
          </div>
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #252525;
  .container {
    width: 100vw;
    height: 100vh;
    background-color: #252525;
    display: grid;
    grid-template-columns: 10% 35% 55%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    .menu {
      width: 100%;
      border-right: solid 2px #0a8ad7;
      background: #0a8ad7;
      background: -webkit-linear-gradient(to bottom, #0a8ad7, #0fa6fb, #0a8ad7);
      background: linear-gradient(to bottom, #0a8ad7, #0fa6fb, #0a8ad7);
      .avatar {
        position: relative;
        img {
          width: 60%;
          border: solid 2px #ffffff;
          padding: 4px;
          display: block;
          cursor: pointer;
          margin-inline: auto;
          margin-top: 2rem;
          margin-bottom: 3rem;
          border-radius: 100%;
        }
        .logout {
          position: absolute;
          top: -10px;
          right: 15px;
        }
      }
      .menu-icons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        border-radius: 0.5rem;
        color: white;
        svg {
          cursor: pointer;
          padding: 0.5rem;
          font-size: 3rem;
          transition: ease-in-out;
          transition-duration: 400ms;
          border: 1px solid transparent;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
        }
        .active {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 0.5rem;
        }
      }
    }
  }
`

export default Chat
