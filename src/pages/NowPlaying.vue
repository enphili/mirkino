<template>
  <TheMetaTags
    title="Мир кино | Сейчас в кинопрокате"
    description="Фильмы находящиеся в прокате и в настоящее время показываемые в кинотеатрах"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Фильмы в настоящее время находящиеся в кинопрокате</h1>

    <div class="filter-wrapper">
      <q-select
        dark
        dense
        options-dense
        clearable
        v-model="ratingModel"
        :options="ratingOptions"
        label="Рейтинг"
        color="accent"
        label-color="white"
        class="filter"
        emit-value
        map-options
      />
    </div>

    <q-infinite-scroll
      v-scroll="onScroll"
      class="films-container"
      :offset="250"
      @load="loadMedia"
    >
      <film-card
        v-for="film in nowPlayingFilms"
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
import {useNotification} from 'src/use/notification'
import {computed, ref} from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import TheMetaTags from 'components/meta/TheMetaTags'
import Loading from '../components/Loading'
import FilmCard from 'components/FilmCard'

export default {
  name: "NowPlaying",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const ratingModel = ref(null)
    const showScrollUpBtn = ref(false)

    const nowPlayingFilms = computed(() => {
      if (ratingModel.value) {
        $store.commit('nowplaying/setNowPlayingSort', ratingModel.value)
      }
      return $store.getters['nowplaying/getNowPlaying']
    })

    const loadMedia = async (index, done) => {
      let chunkNumber = Math.ceil(nowPlayingFilms.value.length / 20)
      chunkNumber >= index ? ++chunkNumber : chunkNumber = index
      try {
        await $store.dispatch('nowplaying/loadNowPlaying', chunkNumber)
        done()
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

    return {
      ratingModel, showScrollUpBtn, useScrollUpPage, onScroll, loadMedia, nowPlayingFilms,
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}]
    }
  },

  components: { TheMetaTags, FilmCard, Loading }
}
</script>
