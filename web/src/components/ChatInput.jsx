import React, { useState } from 'react'
import styled from 'styled-components'
import { RiSendPlaneFill } from 'react-icons/ri'
import { AiFillSmile } from 'react-icons/ai'

export const ChatInput = ({ handleSendMsg }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [msg, setMsg] = useState('')

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg
    message += emojiObject.emoji
    setMsg(message)
  }

  const sendChat = (event) => {
    event.preventDefault()
    if (msg.length > 0) {
      handleSendMsg(msg)
      setMsg('')
    }
  }

  return (
    <Wrapper>
      <div className="button-container">
        <div className="emoji">
          <AiFillSmile onClick={handleEmojiPickerHideShow} />
          {/* {showEmojiPicker && <Picker />} */}
        </div>
      </div>
      <Input onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Digite sua mensagem"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button>
          <RiSendPlaneFill />
        </button>
      </Input>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #17181a;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 0px) and (max-width: 800px) {
    display: flex;
    padding: 0.2rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media screen and (min-width: 0px) and (max-width: 800px) {
      position: relative;
      width: 10%;
    }
    .emoji {
      margin-top: 8px;
      svg {
        font-size: 1.8rem;
        color: white;
        cursor: pointer;
        @media screen and (min-width: 0px) and (max-width: 800px) {
          position: absolute;
          left: 0;
          bottom: -8px;
        }
      }
    }
  }
`

const Input = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  @media screen and (min-width: 0px) and (max-width: 800px) {
    width: 90%;
  }
  input {
    background-color: #282b30;
    border-radius: 2rem;
    width: 80%;
    padding: 1rem;
    color: white;
    border: none;
    font-size: 1.2rem;
    &::selection {
      background-color: #0a8ad7;
    }
    &:focus {
      outline: none;
    }
  }
  button {
    border-radius: 100%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0a8ad7;
    border: none;
    cursor: pointer;
    @media screen and (min-width: 0px) and (max-width: 800px) {
      position: absolute;
      right: 0;
    }
    svg {
      font-size: 1.5rem;
      color: white;
    }
  }
`
