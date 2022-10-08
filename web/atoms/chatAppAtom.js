import { atom, selector } from 'recoil'

export const contactsState = atom({
  key: 'contactsState',
  default: [],
})

export const currentUserState = atom({
  key: 'currentUserState',
  default: undefined,
})

export const currentChatState = atom({
  key: 'currentChatState',
  default: undefined,
})

export const searchingState = atom({
  key: 'searchingState',
  default: false,
})

export const menuItemActiveState = atom({
  key: 'menuItemActiveState',
  default: 'HOME',
})

export const displayMobileState = selector({
  key: 'displayMobileState',
  get: ({get}) => {
    const itemActive = get(menuItemActiveState)
    const displayMobile = itemActive === 'CHAT' ? 'none' : 'grid'
    return displayMobile
  }
})
