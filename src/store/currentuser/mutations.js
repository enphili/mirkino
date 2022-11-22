export const userData = (state, payload) => {
  state.mirKinoUser = payload
  if (!state.mirKinoUser.favorite) state.mirKinoUser.favorite = {}
  if (!state.mirKinoUser.wishList) state.mirKinoUser.wishList = {}
  localStorage.setItem('mirKinoUser', JSON.stringify(state.mirKinoUser))
}

export const setAuth = state => state.isAuth = true

export const logout = state => {
  state.mirKinoUser = {}
  state.isAuth = false
  localStorage.removeItem('mirKinoUser')
}

export const addToUserList = (state, payload) => {
  state.mirKinoUser[payload.key][payload.keyStamp] = {...payload.mediaData, keyStamp: payload.keyStamp}
  localStorage.setItem('mirKinoUser', JSON.stringify(state.mirKinoUser))
}

export const removeFromUserList = (state, payload) => {
  delete state.mirKinoUser[payload.key][payload.keyStamp]
  localStorage.setItem('mirKinoUser', JSON.stringify(state.mirKinoUser))
}
