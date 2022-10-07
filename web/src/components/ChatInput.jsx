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
        <button className="submit">
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
  .button-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    .emoji {
      margin-top: 8px;
      svg {
        font-size: 1.8rem;
        color: white;
        cursor: pointer;
      }
    }
  }
`

const Input = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
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
    svg {
      font-size: 1.5rem;
      color: white;
    }
  }
`
