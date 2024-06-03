import {api} from 'boot/axios'

export async function loadMostPopularMedia ({commit}, pageNumber) {
  try {
    const res = await api.get(`/api/popularity?page=${pageNumber}`)
    commit('setMostPopularMedia', res.data.results)
  }
  catch (error) {
    throw error.response.data ? error.response.data : error
  }
}
