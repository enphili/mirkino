<template>
  <TheMetaTags
    title="Мир кино | Самые популярные фильмы"
    description="Фильмы находящиеся на пике популярности среди пользователей TMDb"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Самые популярные фильмы</h1>

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

      <q-select
        dark
        dense
        options-dense
        clearable
        v-model="releaseModel"
        :options="releaseOptions"
        label="Год выхода"
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
        v-for="film in sortedPopularMedia"
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
import {getReleaseYears} from 'src/use/getReleaseYears'
import {useNotification} from 'src/use/notification'
import {computed, ref} from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useQuasar} from 'quasar'
import {useSortMedia} from 'src/use/sortMedia'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'
import Loading from '../components/Loading'

export default {
  name: "MostPopularity",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const ratingModel = ref(null)
    const releaseModel = ref(null)
    const mostPopularMedia = $store.getters['mostpopularmedia/getMostPopularMedia']

    const sortedPopularMedia = computed(() => mostPopularMedia
      .filter(media => {
        if (!releaseModel.value) return true
        if (media.release_date) return media.release_date.substring(0, 4) === releaseModel.value
        return false
      })
      .sort(useSortMedia(ratingModel.value))
    )

    const loadMedia = async (index, done) => {
      let chunkNumber = Math.ceil(mostPopularMedia.length / 20)
      chunkNumber >= index ? ++chunkNumber : chunkNumber = index
      try {
        await $store.dispatch('mostpopularmedia/loadMostPopularMedia', chunkNumber)
        done()
      }
      catch (error) {
        await useNotification({
          router,
          notify: $q,
          error
        })
      }
    }

    const releaseOptions = computed(() => getReleaseYears(mostPopularMedia))

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return {
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}],
      showScrollUpBtn, useScrollUpPage, ratingModel, releaseModel, releaseOptions,
      onScroll, loadMedia, sortedPopularMedia
    }
  },

  components: { TheMetaTags, FilmCard, Loading }
}
</script>

