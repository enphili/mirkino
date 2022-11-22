<template>
  <TheMetaTags
    title="Мир кино | Результаты поиска"
    description="Страница с результами поиска по базе фильмов, актеров, сериалов"
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
        v-for="item in searchResult.filter(media => typeModel ? media.media_type === typeModel : true).sort(useSortMedia(ratingModel))"
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
    @click="useScrollUpPage"
  />

</template>

<script>
import {api} from 'boot/axios'
import errorsText from 'src/utils/errorsText'
import {useQuasar} from 'quasar'
import {ref} from 'vue'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useSortMedia} from 'src/use/sortMedia'
import Loading from '../components/Loading'
import TheMetaTags from 'components/meta/TheMetaTags'
import FilmCard from 'components/FilmCard'

export default {
  name: "SearchResults",
  props: ['searchText'],

  setup(props) {
    const $q = useQuasar()
    const showScrollUpBtn = ref(false)
    const searchResult = ref([])
    const totalSearchPage = ref(1)

    const loadSearchResult = async (index, done) => {
      if (totalSearchPage.value >= index) {
        try {
          const res = await api.get(`/api/search?query=${encodeURIComponent(props.searchText.toLowerCase())}&page=${index}`)
          searchResult.value.push(...res.data.results)
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

    return { loadSearchResult, showScrollUpBtn, onScroll,
      searchResult, useScrollUpPage, useSortMedia,
      typeModel: ref(null),
      ratingModel: ref(null),
      typeOptions: [{label:'Фильмы', value: 'movie'}, {label:'Сериалы', value: 'tv'}, {label:'Актеры', value: 'person'}],
      ratingOptions: [{label:'По возрастанию', value: '+'}, {label:'По убыванию', value: '-'}] }
  },

  components: { Loading, TheMetaTags, FilmCard }
}
</script>

