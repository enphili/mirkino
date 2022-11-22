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
    @click="useScrollUpPage"
  />

</template>

<script>
import {defineComponent, ref, computed} from 'vue';
import {useQuasar} from 'quasar'
import {useStore} from 'vuex'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import errorsText from 'src/utils/errorsText'
import {useSortMedia} from 'src/use/sortMedia'
import Loading from '../components/Loading'
import FilmCard from 'components/FilmCard'
import TheMetaTags from 'components/meta/TheMetaTags'


export default defineComponent({
  name: 'PageIndex',

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const showScrollUpBtn = ref(false)
    const typeModel = ref(null)
    const ratingModel = ref(null)
    const releaseModel = ref(null)

    const releaseOptions = computed(() => {
      const year = $store.getters['popularMedia/getPopularMedia'].map(date => {
        if (date.release_date) return date.release_date.substring(0, 4)
        if (date.first_air_date) return date.first_air_date.substring(0, 4)
        return 'н/д'
      })
      year.sort((a, b) => b - a)
      return Array.from(new Set(year))
    })

    const trendingMedia = computed(() => $store.getters['popularMedia/getPopularMedia']
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
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: errorsText(error.response ? error.response.data.errorCode : error.message)
        })
      }
    }

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false


    return { trendingMedia, loadMedia, onScroll, showScrollUpBtn,
      useScrollUpPage, typeModel, ratingModel, releaseModel, releaseOptions,
      typeOptions: [{label:'Фильмы', value: 'movie'}, {label:'Сериалы', value: 'tv'}, {label:'Актеры', value: 'person'}],
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}],
    }
  },

  components: { FilmCard, Loading, TheMetaTags }
})
</script>
