import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { lastMessageRoute } from '../utils/api-routes'
import { motion } from 'framer-motion'
import axios from 'axios'

const Contact = ({
  currentUser,
  contact,
  index,
  changeCurrentChat,
  currentSelected,
}) => {
  const [lastMessageReceived, setLastMessageReceived] = useState(undefined)

  useEffect(() => {
    const getLastMessageUser = async () => {
      const response = await axios
        .get(lastMessageRoute, {
          params: {
            from: currentUser._id,
            to: contact._id,
          },
        })
        
          // receivedFrom: response.data.sender,
          // message: response.data.message,
          // createdAt: response.data.createdAt,
      setLastMessageReceived(response)
    }
    getLastMessageUser()
  }, [])

  console.log('lastMessageReceived', lastMessageReceived)

  return (
    <Container
      intial={{ x: 0 }}
      transition={{ duration: 0.2 }}
      animate={index === currentSelected ? { x: 20 } : { x: 0 }}
      onClick={() => changeCurrentChat(index, contact)}
      selected={index === currentSelected ? '#0a8ad7' : '#282b30'}
    >
      <div className="avatar">
        <img
          src="https://avatarfiles.alphacoders.com/161/thumb-161326.png"
          // src={`data:image/svg+xml;base64,${contact.avatarImage}`}
          alt="user/avatar"
        />
      </div>
      <div className="username">
        <h3>{contact.username}</h3>
      </div>
    </Container>
  )
}

const Container = styled(motion.div)`
  position: relative;
  background-color: ${(props) => props.selected};
  width: 80%;
  height: 16%;
  cursor: pointer;
  padding: 2rem;
  border-radius: 10px;
  gap: 1rem;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out;
  .avatar {
    img {
      position: absolute;
      top: -20px;
      left: -20px;
      height: 4rem;
      border: solid 2px #ffffff;
      border-radius: 100%;
    }
  }
  .username {
    h3 {
      color: white;
    }
  }
`

export default Contact
