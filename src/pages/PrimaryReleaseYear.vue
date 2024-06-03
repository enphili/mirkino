<template>
  <TheMetaTags
    :title="`Мир кино | Лучшие фильмы за ${year} год`"
    :description="`Страница с результатами поиска по базе лучших фильмов за ${year} год`"
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
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useScrollUpPage} from 'src/use/scrollUpPage'

export default {
  name: "PrimaryReleaseYear",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const year = $store.getters['primaryreleaseyear/getPrimaryReleaseYear']
    const moviesResult = ref([])

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    const loadPrimaryReleaseYear = async (index, done) => {
      try {
        await useServiceMergeUniqueData({
          index,
          url: '/api/primaryreleaseyear',
          params: {year},
          obj: moviesResult.value,
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

    return {
      year, onScroll, loadPrimaryReleaseYear, moviesResult, showScrollUpBtn, useScrollUpPage
    }
  },

  components: { TheMetaTags, FilmCard }
}
</script>
