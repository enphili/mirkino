<template>
  <TheMetaTags
    :title="`Мир кино | Лучшие фильмы за ${year} год`"
    :description="`Страница с результами поиска по базе лучших фильмов за ${year} год`"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Лучшие фильмы за {{ year }} год</h1>

    <q-infinite-scroll
      v-scroll="onScroll"
      class="films-container"
      :offset="250"
      @load="loadPrimaryReleaseYear"
    >
      <film-card
        v-for="item in moviesResult"
        :media-id="item.id"
        :key="item.id"
        :media="item"
        mediaType="movie"
      />
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="accent" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>

  <q-btn
    v-if="showScrollUpBtn"
    class="up-page-btn"
    round
    size="16px"
    color="accent"
    icon="expand_less"
    @click="useScrollUpPage"
  />
</template>

<script>
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'
import {useStore} from 'vuex'
import {api} from 'boot/axios'
import errorsText from 'src/utils/errorsText'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useScrollUpPage} from 'src/use/scrollUpPage'

export default {
  name: "PrimaryReleaseYear",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const showScrollUpBtn = ref(false)
    const year = $store.getters['primaryreleaseyear/getPrimaryReleaseYear']
    const totalSearchPage = ref(1)
    const moviesResult = ref([])

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    const loadPrimaryReleaseYear = async (index, done) => {
      if (totalSearchPage.value >= index) {
        try {
          const res = await api.get(`/api/primaryreleaseyear?year=${year}&page=${index}`)
          moviesResult.value.push(...res.data.results)
          totalSearchPage.value = res.data.total_pages
          done()
        }
        catch (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: errorsText(error.response ? error.response.data.errorCode : error.message)
          })
        }
      }
    }

    return {
      year, onScroll, loadPrimaryReleaseYear, moviesResult, showScrollUpBtn, useScrollUpPage
    }
  },

  components: { TheMetaTags, FilmCard }
}
</script>
