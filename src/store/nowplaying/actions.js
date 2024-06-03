import {api} from 'boot/axios'

export async function loadNowPlaying ({commit}, pageNumber) {
  try {
    const res = await api.get(`/api/nowplaying?page=${pageNumber}`)
    commit('setNowPlaying', res.data.results)
  }
  catch (error) {
    throw error.response.data ? error.response.data : error
  }
}
