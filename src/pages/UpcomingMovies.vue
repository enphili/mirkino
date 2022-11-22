<template>
  <TheMetaTags
    title="Мир кино | Скоро на экране"
    description="Фильмы ожидаемые в скором времени в прокате"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white">Скоро выйдут на экран</h1>

    <q-infinite-scroll
      v-scroll="onScroll"
      class="films-container"
      :offset="250"
      @load="loadMedia"
    >
      <film-card
        v-for="film in upcomingFilms"
        :media-id="film.id"
        :key="film.id"
        :media="film"
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
import { ref } from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useQuasar} from 'quasar'
import errorsText from 'src/utils/errorsText'
import {api} from 'boot/axios'

export default {
  name: "UpcomingMovies",

  setup() {
    const $q = useQuasar()
    const showScrollUpBtn = ref(false)
    const totalSearchPage = ref(1)
    const upcomingFilms = ref([])

    const loadMedia = async (index, done) => {
      if (totalSearchPage.value >= index) {
        try {
          const res = await api.get(`/api/upcoming?page=${index}`)
          upcomingFilms.value.push(...res.data.results)
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

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return { showScrollUpBtn, useScrollUpPage, onScroll, upcomingFilms, loadMedia}
  },

  components: { TheMetaTags, FilmCard }
}
</script>

