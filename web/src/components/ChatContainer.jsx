import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ChatInput } from './ChatInput'
import { Logout } from './Logout'
import { Messages } from './Messages'
import axios from 'axios'
import { allMessagesRoute, sendMessageRoute } from '../utils/api-routes'
import { v4 as uuiv4 } from 'uuid'

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef = useRef()

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    })
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg })
      })
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' })
  }, [messages])

  useEffect(() => {
    async function sendMessage() {
      const response = await axios.get(allMessagesRoute, {
        params: {
          from: currentUser._id,
          to: currentChat._id,
        },
      })
      setMessages(response.data)
    }
    sendMessage()
  }, [currentChat])

  return (
    <>
      {currentChat && (
        <Wrapper>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="user/avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div ref={scrollRef} key={uuiv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? 'sended' : 'recieved'
                  }`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 15% 65% 20%;
  gap: 0.1rem;
  background-color: #17181a;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #17181a;
    border-bottom: solid 1px rgba(255, 255, 255, 0.18);
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-height: 40%;
        max-width: 50%;
        overflow-wrap: break-word;
        padding-inline: 1rem;
        padding-block: 0.3rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: white;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        border-radius: 15px 0px 15px 15px;
        background-color: #0a8ad7;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        border-radius: 0px 15px 15px 15px;
        background-color: #0a8ad7;
      }
    }
  }
`

export default ChatContainer
