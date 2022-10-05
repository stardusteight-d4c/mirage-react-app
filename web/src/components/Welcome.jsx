import React from 'react'
import styled from 'styled-components'

export const Welcome = ({ currentUser }) => {
  return (
    <Wrapper>
      <h1>
        Welcome, <span>{currentUser?.username}</span>
      </h1>
      <h3>Select a chat to Start Messaging</h3>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  span {
    color: pink;
  }
`
