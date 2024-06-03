<template>
  <TheMetaTags
    title="Мир кино | Результаты поиска"
    description="Страница с результатами поиска по базе фильмов, актеров, сериалов"
  />

  <q-page class="q-px-md overflow-hidden">
    <h1 class="page-title animated fadeInRight text-white" >Результат поиска: <span>"{{ searchText }}"</span></h1>

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
    </div>

    <q-infinite-scroll
      v-scroll="onScroll"
      class="films-container"
      :offset="250"
      @load="loadSearchResult"
    >
      <film-card
        v-for="item in filteredAndSortedSearchResult"
        :media-id="item.id"
        :key="item.id"
        :media="item"
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
import {useServiceMergeUniqueData} from 'src/use/servise/mergeUniqueData'
import {useQuasar} from 'quasar'
import {ref, computed} from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useSortMedia} from 'src/use/sortMedia'
import {useRouter} from 'vue-router'
import Loading from '../components/Loading'
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'

export default {
  name: "SearchResults",
  props: ['searchText'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const searchResult = ref([])
    const typeModel = ref(null)
    const ratingModel = ref(null)

    const loadSearchResult = async (index, done) => {
      try {
        await useServiceMergeUniqueData({
          index,
          url: `/api/search?query=${encodeURIComponent(props.searchText.toLowerCase())}`,
          params: {},
          obj: searchResult.value,
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

    const filteredAndSortedSearchResult = computed(() => {
      return searchResult.value
        .filter(media => typeModel.value ? media.media_type === typeModel.value : true)
        .sort(useSortMedia(ratingModel.value))
    })

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return { loadSearchResult, showScrollUpBtn, onScroll,
      searchResult, useScrollUpPage, useSortMedia,
      typeModel, ratingModel, filteredAndSortedSearchResult,
      typeOptions: [{label:'Фильмы', value: 'movie'}, {label:'Сериалы', value: 'tv'}, {label:'Актеры', value: 'person'}],
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}]
    }
  },

  components: { Loading, TheMetaTags, FilmCard }
}
</script>
