<template>
  <TheMetaTags
    :title="'Мир кино | ' + calculatedMediaTitle"
    :description="metaDescription"
  />

    <main-bg-image
    v-if="mediaData.bgUrl"
    :url="mediaData.bgUrl"
    :title="mediaData.mediaTitle"
    mediaType="фильму"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container" style="margin-top: 30%" v-scroll="onScroll">

      <MainTitleBlock
        v-if="mediaData.mediaTitle"
        :tagline="mediaData.tagline"
        :title="mediaData.mediaTitle"
        :originalTitle="mediaData.originalMediaTitle"
        mediaType="Фильм"
      />

      <MainReleaseInfo
        v-if="mediaData.certification"
        :certification="mediaData.certification"
        :runtime="mediaData.runtime"
        :productionCountries="mediaData.productionCountries"
        :year="mediaDataShotCut.year"
        :tags="mediaData.tags"
        mediaType="movie"
      />

      <MainDescription
        v-if="mediaData.description"
        title="Краткий обзор"
        :description="mediaData.description"
      />

      <TrailerAndHomepageData
        :trailers="mediaData.trailersData"
        :homepageUrl="mediaData.homepageUrl"
        @showTrailers="mediaData.trailersData ? index = 0 : index = null"
      />

      <div class="content">
        <LeftMediaPoster
          v-if="mediaDataShotCut.posterPath"
          :posterUrl="mediaDataShotCut.posterPath"
          error-img-url="unnamed.jpg"
        />

        <RightMediaBlockActions
          v-if="mediaDataShotCut.id"
          :media = "mediaDataShotCut"
        />

        <EpisodesCollection
          v-if="mediaData.hasCollection"
          :title="mediaData.collectionName"
          :description="mediaData.collectionDescription"
          :items="mediaData.collectionParts"
          error-img-url="unnamed.jpg"
          itemType="movie"
          @go-to-item="changeFilm"
        />

        <EpisodesCollection
          v-if="mediaData.similarMedia && mediaData.similarMedia.length > 0"
          error-img-url="unnamed.jpg"
          description="Список похожих фильмов"
          title="Похожие"
          :items="mediaData.similarMedia"
          :quantityDisplayedItems="6"
          itemType="movie"
          @go-to-item="changeFilm"
        />

        <EpisodesCollection
          v-if="mediaData.recomendMedia && mediaData.recomendMedia.length > 0"
          error-img-url="unnamed.jpg"
          description="Фильмы также рекомендуемые к просмотру"
          title="Рекомендации"
          :items="mediaData.recomendMedia"
          :quantityDisplayedItems="6"
          itemType="movie"
          @go-to-item="changeFilm"
        />

        <EpisodesCollection
          v-if="mediaData.castActors && mediaData.castActors.length > 0"
          error-img-url="unnamed.jpg"
          description="Актеры снимавшиеся в фильме как в главных ролях так и в эпизодических моментах"
          title="Актерский состав"
          :items="mediaData.castActors"
          :quantityDisplayedItems="12"
          itemType="person"
          cta-text="показать всех актеров"
          @go-to-item="showActorInfo"
        />

        <MediaReviews
          v-if="mediaData.reviews && mediaData.reviews.length > 0"
          :reviews="mediaData.reviews"
        />
      </div>
    </div>
  </q-page>

  <JustALightbox
    :initIndex="index"
    :items="mediaData.trailersData"
    @close="index = null"
  />

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
import {useQuasar} from 'quasar'
import { ref, onMounted, reactive } from 'vue'
import {api} from 'boot/axios'
import errorsText from 'src/utils/errorsText'
import {useRoute, useRouter} from 'vue-router'
import countries from '../utils/countries.js'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import JustALightbox from 'components/JustALightbox'
import MainBgImage from 'components/MainBgImage'
import MainTitleBlock from 'components/MainTitleBlock'
import MainReleaseInfo from 'components/MainReleaseInfo'
import MainDescription from 'components/MainDescription'
import TrailerAndHomepageData from 'components/TrailerAndHomepageData'
import LeftMediaPoster from 'components/LeftMediaPoster'
import EpisodesCollection from 'components/EpisodesCollection'
import TheMetaTags from 'components/meta/TheMetaTags'
import MediaReviews from 'components/MediaReviews'
import RightMediaBlockActions from 'components/RightMediaBlockActions'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

export default {
  name: "Movie",
  props: ['mediaTitle', 'mediaID'],

  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const mediaID = ref(route.params.mediaID)
    const calculatedMediaTitle = ref(route.params.mediaTitle)
    const metaDescription = ref('Страница с подробной информацией о фильме')
    const index = ref(null)
    const mediaData = reactive({})
    const mediaDataShotCut = reactive({})
    const showScrollUpBtn = ref(false)
    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    // hooks
    onMounted(async () => await getMediaData())

    // methods
    const getMediaData = async () => {
      try {
        const [response, response2, response3, response4, response5] = await Promise.all([
          api.get(`/api/filminfo?id=${mediaID.value}&type=movie`),
          api.get(`/api/trailers?id=${mediaID.value}&type=movie`),
          api.get(`/api/recomendmedia?id=${mediaID.value}&type=movie`),
          api.get(`/api/similarmedia?id=${mediaID.value}&type=movie`),
          api.get(`/api/reviews?id=${mediaID.value}&type=movie`)
        ])
        mediaData.tags = response.data.genres
        mediaData.productionCountries = response.data.production_countries.map(el => countries(el.iso_3166_1))
        mediaData.bgUrl = 'https://image.tmdb.org/t/p/original' + response.data.backdrop_path
        mediaData.mediaTitle = response.data.title
        mediaData.originalMediaTitle = response.data.original_title
        mediaData.tagline = response.data.tagline.replace(/\.$/, "")
        mediaData.description = response.data.overview
        mediaData.runtime = useDividedRuntime('movie', response.data.runtime)
        mediaData.certification = useMediaCertification('movie', response.data.release_dates.results)
        mediaData.homepageUrl = response.data.homepage
        mediaData.trailersData = response2.data
        if (!!response.data.belongs_to_collection) {
          const collection = await api.get(`/api/belongs?id=${response.data.belongs_to_collection.id}`)
          mediaData.hasCollection = !!collection.data
          mediaData.collectionName = collection.data.name
          mediaData.collectionDescription = collection.data.overview
          mediaData.collectionParts = collection.data.parts
        }
        mediaData.castActors = response.data.credits.cast
        mediaData.recomendMedia = response3.data.results
        mediaData.similarMedia = response4.data.results
        mediaData.reviews = response5.data

        mediaDataShotCut.id = +mediaID.value
        mediaDataShotCut.type = 'movie'
        mediaDataShotCut.title = response.data.title || response.data.original_title
        mediaDataShotCut.posterPath = basePosterURL(response.data.poster_path)
        mediaDataShotCut.year = useDividedReleaseDate(response.data.release_date)
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

    const changeFilm = async item => {
      await router.push({name: 'movie', params: {mediaTitle: item.title || item.original_title, mediaID: item.id}})
    }

    const showActorInfo = async item => {
      await router.push({
        name: 'actors',
        params: {
          actorName: item.name,
          personId: item.id
        }
      })
    }

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return { index, mediaData, changeFilm, calculatedMediaTitle, metaDescription, onScroll,
      showScrollUpBtn, useScrollUpPage, showActorInfo, mediaDataShotCut }
  },

  components: { JustALightbox, MainBgImage, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, TheMetaTags, MediaReviews,
    RightMediaBlockActions
  }
}
</script>


