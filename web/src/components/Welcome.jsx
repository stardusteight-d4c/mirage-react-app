import React from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { displayMobileState } from '../../atoms/chatAppAtom'

export const Welcome = ({ currentUser }) => {
  const displayMobile = useRecoilValue(
    displayMobileState
  )

  return (
    <Wrapper display={displayMobile}>
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
  @media screen and (min-width: 0px) and (max-width: 800px) {
    width: 80%;
    text-align: center;
    padding: 5px;
    display: ${(props) => props.display};
  }
  span {
    color: #0a8ad7;
  }
`
