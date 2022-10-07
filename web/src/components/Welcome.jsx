import React from 'react'
import styled from 'styled-components'

export const Welcome = ({ currentUser }) => {
  return (
    <Wrapper>
      <h1>
       Bem-vindo, <span>{currentUser?.username}</span>!
      </h1>
      <h3>Selecione um chat para começar a conversar.</h3>
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
    color: #0a8ad7;
  }
`
