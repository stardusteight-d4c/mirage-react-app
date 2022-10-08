import React, { useState } from 'react'

import { HiHome, HiBell } from 'react-icons/hi'
import { IoGameController } from 'react-icons/io5'
import { BsFillChatDotsFill, BsMusicNote } from 'react-icons/bs'
import { FiMoreHorizontal } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Logout } from './Logout'
import styled from 'styled-components'

import { useRecoilState } from 'recoil'
import { currentUserState, menuItemActiveState } from '../../atoms/chatAppAtom'

const Menu = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const [menuItemActive, setMenuItemActive] =
    useRecoilState(menuItemActiveState)
  const [showLogout, setShowLogout] = useState(false)

  const handleMenuItemActive = (menuItem) => {
    setMenuItemActive(menuItem)
  }

  return (
    <Wrapper>
      <div>
        <div className="avatar">
          <img
            onClick={() => setShowLogout(!showLogout)}
            src={currentUser.avatarImage}
            alt="user/avatar"
          />
          <AnimatePresence>
            {showLogout && (
              <motion.div
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="logout"
              >
                <Logout />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="menu-icons">
          <HiHome
            onClick={() => handleMenuItemActive('HOME')}
            className={menuItemActive === 'HOME' && 'active'}
          />
          <HiBell
            onClick={() => handleMenuItemActive('NOTIFY')}
            className={menuItemActive === 'NOTIFY' && 'active'}
          />
          <IoGameController
            onClick={() => handleMenuItemActive('GAME')}
            className={menuItemActive === 'GAME' && 'active'}
          />
          <BsFillChatDotsFill
            onClick={() => handleMenuItemActive('CHAT')}
            className={menuItemActive === 'CHAT' && 'active'}
          />
          <BsMusicNote
            onClick={() => handleMenuItemActive('MUSIC')}
            className={menuItemActive === 'MUSIC' && 'active'}
          />
          <FiMoreHorizontal
            onClick={() => handleMenuItemActive('MORE')}
            className={menuItemActive === 'MORE' && 'active'}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default Menu

const Wrapper = styled.aside`
  width: 100%;
  border-right: solid 2px #0a8ad7;
  background: #0a8ad7;
  background: -webkit-linear-gradient(to bottom, #0a8ad7, #0fa6fb, #0a8ad7);
  background: linear-gradient(to bottom, #0a8ad7, #0fa6fb, #0a8ad7);
  @media screen and (min-width: 0px) and (max-width: 800px) {
    width: 80px;
  }
  .avatar {
    position: relative;
    img {
      width: 6rem;
      height: 6rem;
      object-fit: cover;
      border: solid 2px #ffffff;
      padding: 4px;
      display: block;
      cursor: pointer;
      margin-inline: auto;
      margin-top: 2rem;
      margin-bottom: 3rem;
      border-radius: 100%;
      @media screen and (min-width: 0px) and (max-width: 800px) {
        width: 4rem;
        height: 4rem;
      }
    }
    .logout {
      position: absolute;
      top: -10px;
      right: 15px;
    }
  }
  .menu-icons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    border-radius: 0.5rem;
    color: white;
    @media screen and (min-width: 1500px) {
      gap: 2.5rem;
    }
    svg {
      cursor: pointer;
      padding: 0.5rem;
      @media screen and (min-width: 1500px) {
        gap: 4rem;
      }
      font-size: 3rem;
      transition: ease-in-out;
      transition-duration: 400ms;
      border: 1px solid transparent;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
    }
    .active {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 0.5rem;
    }
  }
`
