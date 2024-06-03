<template>
  <form class="search" @submit.prevent.stop="onSearch">
    <input
      type="search"
      class="search-input"
      v-model.trim="search"
      placeholder="Фильмы, сериалы"
    />
    <button type="submit" class="search-button">
      <img src="../assets/img/search-icon.svg" alt="кнопка поиска">
    </button>
  </form>
</template>

<script>
import {useQuasar} from 'quasar'
import {useNotification} from 'src/use/notification'
import errorsText from 'src/utils/errorsText'
import {ref} from 'vue'
import {useRouter} from 'vue-router'

export default {
  name: "SearchForm",

  setup() {
    const $q = useQuasar()
    const search = ref(null)
    const router = useRouter()

    const onSearch = async e => {
      if (search.value && search.value.length > 0) {
        try {
          await router.push({name: 'search', params: {searchText: search.value}})
          e.target.reset()
        }
        catch (error) {
          await useNotification({
            router,
            notify: $q,
            error
          })
        }
      }
    }

    return { search, onSearch }
  }
}
</script>
