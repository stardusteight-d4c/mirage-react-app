import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { lastMessageRoute } from '../utils/api-routes'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BiTimeFive } from 'react-icons/bi'

import * as timeago from 'timeago.js'
import TimeAgo from 'timeago-react'
import pt_BR from 'timeago.js/lib/lang/pt_BR'

timeago.register('pt_BR', pt_BR)

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
      const response = await axios.get(lastMessageRoute, {
        params: {
          from: currentUser._id,
          to: contact._id,
        },
      })
      const lastMessageData = {
        receivedFrom: response.data[0]?.sender,
        message: response.data[0]?.message.text,
        createdAt: response.data[0]?.createdAt,
      }
      setLastMessageReceived(lastMessageData)
    }
    getLastMessageUser()
  }, [currentSelected])

  return (
    <Container
      intial={{ x: 0 }}
      transition={{ duration: 0.2 }}
      animate={index === currentSelected ? { x: 20 } : { x: 0 }}
      onClick={() => changeCurrentChat(index, contact)}
      selected={index === currentSelected ? '#0a8ad7' : '#282b30'}
      color={index === currentSelected ? '#ffffff' : '#ffffff80'}
    >
      <div className="avatar">
        <img
          src={contact.avatarImage}
          // src={`data:image/svg+xml;base64,${contact.avatarImage}`}
          alt="user/avatar"
        />
      </div>
      <div className="user-info">
        <h3>{contact.username}</h3>
        {lastMessageReceived?.receivedFrom === contact._id && (
          <div className="message-info">
            <span className="message">{lastMessageReceived.message}</span>
            <span className="createdAt">
              {lastMessageReceived.createdAt && (
                <>
                  <TimeAgo
                    datetime={lastMessageReceived.createdAt}
                    locale="pt_BR"
                  />
                  <BiTimeFive />
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </Container>
  )
}

const Container = styled(motion.div)`
  position: relative;
  background-color: ${(props) => props.selected};
  width: 80%;
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
      width: 4rem;
      height: 4rem;
      object-fit: cover;
      top: -20px;
      left: -20px;
      border: solid 2px #ffffff;
      border-radius: 100%;
    }
  }
  .user-info {
    h3 {
      color: white;
    }
    .message-info {
      .message {
        color: ${(props) => props.color};
        font-size: 1rem;
        font-weight: 600;
      }
      .createdAt {
        color: #ffffff80;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        position: absolute;
        bottom: 5px;
        right: 10px;
      }
    }
  }
`

export default Contact
