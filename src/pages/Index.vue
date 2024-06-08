<template>
  <TheMetaTags
    title="Мир кино | Главная"
    description="Сайт по поиску фильмов, просмотра информации о фильме, актерах, просмотра трейлеров"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Популярные фильмы и сериалы на этой неделе</h1>

    <div class="filter-wrapper">
      <q-select
        dark
        dense
        options-dense
        clearable
        v-model="typeModel"
        :options="typeOptions"
        label="Тип"
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
            v-for="media in trendingMedia"
            :media-id="media.id"
            :key="media.id"
            :media="media"
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
import FilmCard from 'components/FilmCard'
import TheMetaTags from 'components/meta/TheMetaTags'
import {useQuasar} from 'quasar'
import {getReleaseYears} from 'src/use/getReleaseYears'
import {useNotification} from 'src/use/notification'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useSortMedia} from 'src/use/sortMedia'
import {computed, defineComponent, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

export default defineComponent({
  name: 'PageIndex',

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const typeModel = ref(null)
    const ratingModel = ref(null)
    const releaseModel = ref(null)
    const popularMedia = $store.getters['popularMedia/getPopularMedia']

    const releaseOptions = computed(() => getReleaseYears(popularMedia))

    const trendingMedia = computed(() => popularMedia
      .filter(media => typeModel.value ? media.media_type === typeModel.value : true)
      .sort(useSortMedia(ratingModel.value))
      .filter(media => {
        if (!releaseModel.value) return true
        if (media.release_date) return media.release_date.substring(0, 4) === releaseModel.value
        if (media.first_air_date) return  media.first_air_date.substring(0, 4) === releaseModel.value
        return false
      }))

    const loadMedia = async (index, done) => {
      let chunkNumber = Math.ceil(trendingMedia.value.length / 20)
      chunkNumber >= index ? ++chunkNumber : chunkNumber = index
      try {
        await $store.dispatch('popularMedia/loadPopularMedia', chunkNumber)
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

    console.log('this is test')

    return { trendingMedia, loadMedia, onScroll, showScrollUpBtn,
      useScrollUpPage, typeModel, ratingModel, releaseModel, releaseOptions,
      typeOptions: [{label:'Фильмы', value: 'movie'}, {label:'Сериалы', value: 'tv'}, {label:'Актеры', value: 'person'}],
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}],
    }
  },

  components: { FilmCard, TheMetaTags }
})
</script>
