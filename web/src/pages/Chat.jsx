import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import styled from 'styled-components'

import { allUsersRoute, hostServer } from '../utils/api-routes'
import ChatContainer from '../components/ChatContainer'
import { Welcome } from '../components/Welcome'
import Menu from '../components/Menu'
import { Contacts } from '../components/Contacts'

import { useRecoilState } from 'recoil'
import {
  contactsState,
  currentChatState,
  currentUserState,
  searchingState,
} from '../../atoms/chatAppAtom'

const Chat = () => {
  const [contacts, setContacts] = useRecoilState(contactsState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState)
  const [searching, setSearching] = useRecoilState(searchingState)

  const navigate = useNavigate()

  const socket = useRef()

  useEffect(() => {
    async function handleCurrentUser() {
      if (!localStorage.getItem('mirage-app-user')) {
        navigate('/login')
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem('mirage-app-user'))
        )
      }
    }
    handleCurrentUser()
  }, [searching])

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
      socket.current = io(hostServer, { withCredentials: true })
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
            <Menu />
            <Contacts handleChangeChat={handleChangeChat} />
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #252525;
  .container {
    display: grid;
    grid-template-columns: 10% 35% 55%;
    width: 100vw;
    height: 100vh;
    background-color: #252525;
    @media screen and (min-width: 0px) and (max-width: 800px) {
      display: flex;
    }
  }
`

export default Chat
