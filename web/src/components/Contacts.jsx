import React, { useState } from 'react'
import styled from 'styled-components'
import { BsSearch } from 'react-icons/bs'
import { AiFillStar, AiOutlineCloudDownload } from 'react-icons/ai'
import { lastMessageRoute } from '../utils/api-routes'
import Contact from './Contact'

export const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined)

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)
  }

  // - Criar um componente para os contatos sendo mapeados
  // - Criar rota que retorna o ultimo obejeto de all messages "getLastMessage"
  // - Exibir a última mensagem e data criada no componente contato

  return (
    <>
      <Wrapper>
        <Header>
          <div>
            <div className="search-container">
              <div className="search-input">
                <BsSearch />
                <input type="text" placeholder="Buscar conversa..." />
              </div>
              <div className="icons">
                <AiFillStar />
                <AiOutlineCloudDownload />
              </div>
            </div>
            <div className="options">
              <span className="active">Mensagens</span>
              <span>Grupos</span>
            </div>
          </div>
        </Header>
        <ContactsContainer>
          {contacts.map((contact, index) => (
            <Contact
              currentUser={currentUser}
              contact={contact}
              index={index}
              changeCurrentChat={changeCurrentChat}
              currentSelected={currentSelected}
            />
          ))}
        </ContactsContainer>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.section`
  overflow: hidden;
  background: #17181a;
  border-right: solid 1px rgba(255, 255, 255, 0.18);
`

const Header = styled.header`
  color: white;
  border-bottom: solid 1px rgba(255, 255, 255, 0.18);
  .options {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 35px;
    margin-left: 15px;
    .active {
      border-bottom: solid 2px #0a8ad7;
    }
    span {
      transition: ease-in-out;
      transition-duration: 200ms;
      cursor: pointer;
      border-bottom: solid 2px transparent;
      &:hover {
        border-bottom: solid 2px #0a8ad7;
      }
    }
  }
  .search-container {
    background-color: #17181a;
    margin-top: 25px;
    padding-bottom: 5%;
    display: flex;
    color: white;
    .search-input {
      background: transparent;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      position: relative;
      display: flex;
      justify-content: start;
      align-items: center;
      border-radius: 10rem;
      margin-left: 10%;
      width: 70%;
      height: 60px;
      cursor: pointer;
      input {
        color: white;
        border-radius: 10rem;
        width: 100%;
        height: 100%;
        padding-left: 20%;
        background-color: transparent;
        border: none;
        font-size: 1rem;
        &::placeholder {
          color: white;
        }
        &:focus {
          outline: none;
        }
      }
      svg {
        font-size: 1.2rem;
        position: absolute;
        left: 7%;
      }
    }
    .icons {
      display: flex;
      justify-items: center;
      align-items: center;
      margin-inline: auto;
      gap: 2px;
      svg {
        padding: 0.2rem;
        font-size: 2rem;
        cursor: pointer;
      }
    }
  }
`

const ContactsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
  gap: 2.5rem;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
`
