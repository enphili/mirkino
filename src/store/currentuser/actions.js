import {useGetObjectKeyStamp} from 'src/use/getObjectKeyStamp'
import {api} from 'boot/axios'

export const removeFromUserList = async ({ getters, commit }, payload) => {
  const userList = getters['getUserList'](payload.list)
  const keyStamp = useGetObjectKeyStamp(userList, payload.id)
  if (getters['userDisplayName']?.length > 0) {
    try {
      const response = await api.post(`/apifb/removefromuserlist`, {keyStamp, key: payload.list})
      if (response.data === 'needReLogin') return 'relogin'
      if (response.data === 'good') {
        commit('removeFromUserList', {keyStamp, key: payload.list})
        return 'good'
      }
    } catch {}
  }
  else {
    commit('removeFromUserList', {keyStamp, key: payload.list})
    return 'good'
  }
}

export const addToUserList = async ({ getters, commit }, payload) => {
  const keyStamp = Date.now()
  if (getters['userDisplayName']?.length > 0) {
    try {
      const response = await api.post(`/apifb/addtouserlist`, {mediaData: payload.media, key: payload.list, keyStamp})
      if (response.data === 'needReLogin') return 'relogin'
      if (response.data === 'good') {
        commit('addToUserList', {mediaData: payload.media, key: payload.list, keyStamp})
        return 'good'
      }
    }
    catch {}
  }
  else {
    commit('addToUserList', {mediaData: payload.media, key: payload.list, keyStamp})
    return 'good'
  }
}


