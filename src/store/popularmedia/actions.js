import {api} from 'boot/axios'

export async function loadPopularMedia ({commit}, pageNumber) {
  try {
    const res = await api.get(`/api/trendingfilms?page=${pageNumber}`)
    commit('setPopularMedia', res.data.results)
  }
  catch (error) {
    throw error
  }
}
