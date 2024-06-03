import {api} from 'boot/axios'
import {ref} from 'vue'

const totalSearchPage = ref(1)

export const useServiceMergeUniqueData = async ({index, url, params, obj, done}) => {
  if (totalSearchPage.value >= index) {
    try {
      const res = await api.get(url, {params: {...params, page: index}})
      const data = res.data.results
      data.forEach(item => {
        const existItem = obj.find(mediaItem => mediaItem.id === item.id)
        if(!existItem) {
          obj.push(item)
        }
      })
      totalSearchPage.value = res.data.total_pages
      done()
    }
    catch (error) {
      throw error
    }
  }
}
