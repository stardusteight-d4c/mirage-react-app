export const hostServer = import.meta.env.VITE_HOST_SERVER
export const registerRoute = `${hostServer}/api/auth/register`
export const loginRoute = `${hostServer}/api/auth/login`
export const chooseAvatarRoute = `${hostServer}/api/auth/chooseAvatar`
export const allUsersRoute = `${hostServer}/api/auth/allUsers`
export const sendMessageRoute = `${hostServer}/api/messages/addMessage`
export const allMessagesRoute = `${hostServer}/api/messages/allMessages`
export const lastMessageRoute = `${hostServer}/api/messages/lastMessage`
