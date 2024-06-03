<template>
  <TheMetaTags
    :title='`Мир кино | Результаты поиска ${ mediaType === "movie" ? "фильмов" : "сериалов"} по тегу "${genresName}"`'
    :description='`Страница с результатами поиска по базе фильмов и сериалов содержащих тег - "${genresName}"`'
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Результат поиска {{ mediaType === "movie" ? "фильмов" : "сериалов" }} по тегу: <span>"{{ genresName }}"</span></h1>

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
      @load="loadSearchByGenres"
    >
      <film-card
        v-for="item in genresMedia"
        :media-id="item.id"
        :key="item.id"
        :media="item"
        :mediaType="mediaType"
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
import {getReleaseYears} from 'src/use/getReleaseYears'
import {useServiceMergeUniqueData} from 'src/use/servise/mergeUniqueData'
import {computed, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useSortMedia} from 'src/use/sortMedia'
import {useScrollUpPage} from 'src/use/scrollUpPage'

export default {
  name: "MediaByTags",
  props: ['genresId', 'genresName', 'mediaType'],

  setup (props) {
    const $q = useQuasar()
    const showScrollUpBtn = ref(false)
    const searchResult = ref([])
    const releaseModel = ref(null)
    const ratingModel = ref(null)

    const loadSearchByGenres = async (index, done) => {
      await useServiceMergeUniqueData({
        $q,
        index,
        url: '/api/searchbygenres',
        params: {mediaType: props.mediaType, genresId: props.genresId},
        obj: searchResult.value,
        done
      })
    }

    const releaseOptions = computed(() => getReleaseYears(searchResult.value))

    const genresMedia = computed(() => searchResult.value
      .filter(media => {
        if (!releaseModel.value) return true
        if (media.release_date) return media.release_date.substring(0, 4) === releaseModel.value
        if (media.first_air_date) return  media.first_air_date.substring(0, 4) === releaseModel.value
        return false
      })
      .sort(useSortMedia(ratingModel.value)))

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return {
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}],
      onScroll, showScrollUpBtn, loadSearchByGenres, searchResult, releaseModel,
      releaseOptions, ratingModel, genresMedia, useScrollUpPage
    }
  },

  components: { TheMetaTags, FilmCard }
}
</script>
