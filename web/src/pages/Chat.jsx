import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { allUsersRoute } from '../utils/api-routes'
import { Contacts } from '../components/Contacts'
import { Welcome } from '../components/Welcome'
import { ChatContainer } from '../components/ChatContainer'

export const Chat = () => {
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const navigate = useNavigate()

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

  const handleChangeChat = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <>
      {currentUser && (
        <Wrapper>
          <div className="container">
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChangeChat}
            />
            {currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer currentChat={currentChat} currentUser={currentUser} />
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
  background-color: #131324;
  .container {
    width: 85vw;
    height: 85vh;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`
