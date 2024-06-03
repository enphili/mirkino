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
    aria-label="Прокрутить вверх"
    @click="useScrollUpPage"
  />
</template>

<script>
import {SCROLL_THRESHOLD} from 'boot/scrollThreshold'
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'
import {useNotification} from 'src/use/notification'
import {useServiceMergeUniqueData} from 'src/use/servise/mergeUniqueData'
import { ref } from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

export default {
  name: "UpcomingMovies",

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const upcomingFilms = ref([])

    const loadMedia = async (index, done) => {
      try {
        await useServiceMergeUniqueData({
          index,
          url: '/api/upcoming',
          params: {},
          obj: upcomingFilms.value,
          done
        })
      }
      catch (error) {
        await useNotification({
          router,
          notify: $q,
          error,
        })
      }
    }

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return { showScrollUpBtn, useScrollUpPage, onScroll, upcomingFilms, loadMedia}
  },

  components: { TheMetaTags, FilmCard }
}
</script>
