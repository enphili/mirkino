<template>
  <TheMetaTags
    title="Мир кино | Самые популярные фильмы"
    description="Фильмы находящиеся на пике популярости среди пользователей TMDb"
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
        v-for="film in popularityFilms"
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
import {computed, ref} from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useQuasar} from 'quasar'
import errorsText from 'src/utils/errorsText'
import {useSortMedia} from 'src/use/sortMedia'
import {useStore} from 'vuex'
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'
import Loading from '../components/Loading'

export default {
  name: "MostPopularity",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const showScrollUpBtn = ref(false)
    const ratingModel = ref(null)
    const releaseModel = ref(null)

    const popularityFilms = computed(() => $store.getters['mostpopularmedia/getMostPopularMedia']
      .filter(media => {
        if (!releaseModel.value) return true
        if (media.release_date) return media.release_date.substring(0, 4) === releaseModel.value
        return false
      })
      .sort(useSortMedia(ratingModel.value))
    )


    const loadMedia = async (index, done) => {
      let chunkNumber = Math.ceil(popularityFilms.value.length / 20)
      chunkNumber >= index ? ++chunkNumber : chunkNumber = index
      try {
        await $store.dispatch('mostpopularmedia/loadMostPopularMedia', chunkNumber)
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

    const releaseOptions = computed(() => {
      const year = popularityFilms.value.map(date => {
        if (date.release_date) return date.release_date.substring(0, 4)
        if (date.first_air_date) return date.first_air_date.substring(0, 4)
        return 'н/д'
      })
      year.sort((a, b) => b - a)
      return Array.from(new Set(year))
    })

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return {
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}],
      showScrollUpBtn, useScrollUpPage, ratingModel, releaseModel, releaseOptions,
      onScroll, loadMedia, popularityFilms
    }
  },

  components: { TheMetaTags, FilmCard, Loading }
}
</script>

