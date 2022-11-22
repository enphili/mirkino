<template>

  <TheMetaTags
    :title="'Мир кино | ' + mediaTitle"
    :description="metaDescription"
  />

  <MainBgImage
    v-if="mediaData.bgUrl"
    :url="mediaData.bgUrl"
    :title="mediaData.mediaTitle"
    mediaType="сериалу"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container" style="margin-top: 30%" v-scroll="onScroll">

      <MainTitleBlock
        v-if="mediaData.mediaTitle"
        :tagline="mediaData.tagline"
        :title="mediaData.mediaTitle"
        :originalTitle="mediaData.originalMediaTitle"
        mediaType="Сериал"
      />

      <MainReleaseInfo
        v-if="mediaData.certification"
        :certification="mediaData.certification"
        :runtime="mediaData.runtime"
        :productionCountries="mediaData.productionCountries"
        :year="mediaDataShotCut.year"
        :tags="mediaData.tags"
        mediaType="tv"
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
          v-if="mediaData.hasSeasons"
          error-img-url="unnamed.jpg"
          description="Все сезоны сериала"
          title="Сезоны"
          :items="mediaData.seasons"
          itemType="tv"
          @go-to-item="showSeasonInfo"
        />

        <EpisodesCollection
          v-if="mediaData.similarMedia && mediaData.similarMedia.length > 0"
          error-img-url="unnamed.jpg"
          description="Список похожих сериалов"
          title="Похожие"
          :items="mediaData.similarMedia"
          :quantityDisplayedItems="6"
          itemType="tv"
          @go-to-item="showSerial"
        />

        <EpisodesCollection
          v-if="mediaData.recomendMedia && mediaData.recomendMedia.length > 0"
          error-img-url="unnamed.jpg"
          description="Сериалы также рекомендуемые к просмотру"
          title="Рекомендации"
          :items="mediaData.recomendMedia"
          :quantityDisplayedItems="6"
          itemType="tv"
          @go-to-item="showSerial"
        />

        <EpisodesCollection
          v-if="mediaData.castActors && mediaData.castActors.length > 0"
          error-img-url="unnamed.jpg"
          description="Актеры снимавшиеся в сериале в главных ролях"
          title="Актерский состав"
          :items="mediaData.castActors"
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
import TheMetaTags from 'components/meta/TheMetaTags'
import MainTitleBlock from 'components/MainTitleBlock'
import MainReleaseInfo from 'components/MainReleaseInfo'
import MainDescription from 'components/MainDescription'
import TrailerAndHomepageData from 'components/TrailerAndHomepageData'
import LeftMediaPoster from 'components/LeftMediaPoster'
import EpisodesCollection from 'components/EpisodesCollection'
import MediaReviews from 'components/MediaReviews'
import RightMediaBlockActions from 'components/RightMediaBlockActions'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

export default {
  name: "Serials",
  props: ['mediaTitle', 'mediaID'],

  setup(props) {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const mediaID = ref(route.params.mediaID)
    const metaDescription = ref('Страница с подробной информацией о сериале')
    const index = ref(null)
    const mediaData = reactive({})
    const showScrollUpBtn = ref(false)
    const mediaDataShotCut = reactive({})
    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    // hooks
    onMounted(async () => await getMediaData())

    // methods
    const getMediaData = async () => {
      try {
        const [response, response2, response3, response4, response5 ] = await Promise.all([
          api.get(`/api/filminfo?id=${mediaID.value}&type=tv`),
          api.get(`/api/trailers?id=${mediaID.value}&type=tv`),
          api.get(`/api/reviews?id=${mediaID.value}&type=tv`),
          api.get(`/api/similarmedia?id=${mediaID.value}&type=tv`),
          api.get(`/api/recomendmedia?id=${mediaID.value}&type=tv`)
        ])
        mediaData.allObj = response.data
        mediaData.tags = response.data.genres
        mediaData.productionCountries = response.data.production_countries.map(el => countries(el.iso_3166_1))
        mediaData.bgUrl = 'https://image.tmdb.org/t/p/original' + response.data.backdrop_path
        mediaData.mediaTitle = response.data.name
        mediaData.originalMediaTitle = response.data.original_name
        mediaData.description = response.data.overview
        mediaData.runtime = useDividedRuntime('tv', response.data.episode_run_time)
        mediaData.certification = useMediaCertification('tv', response.data.content_ratings.results)
        mediaData.homepageUrl = response.data.homepage
        mediaData.trailersData = response2.data
        mediaData.tagline = response.data.tagline.replace(/\.$/, "")
        mediaData.hasSeasons = !!response.data.seasons
        if (mediaData.hasSeasons) {
          mediaData.seasons = response.data.seasons
        }
        mediaData.castActors = response.data.credits.cast
        mediaData.reviews = response3.data
        mediaData.similarMedia = response4.data.results
        mediaData.recomendMedia = response5.data.results

        mediaDataShotCut.id = +mediaID.value
        mediaDataShotCut.type = 'tv'
        mediaDataShotCut.title = response.data.name || response.data.original_name
        mediaDataShotCut.posterPath = basePosterURL(response.data.poster_path)
        mediaDataShotCut.year = useDividedReleaseDate(response.data.first_air_date)
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

    const showSeasonInfo = async item => {
      await router.push({
        name: 'season',
        params: {
          mediaID: mediaID.value,
          seasonNumber: item.season_number,
          mediaTitle: props.mediaTitle
        }
      })
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

    const showSerial = async item => {
      await router.push({name: 'serials', params: {mediaTitle: item.name || item.original_name, mediaID: item.id}})
    }

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return { index, mediaData, showSeasonInfo, metaDescription,
      showScrollUpBtn, onScroll, useScrollUpPage, showActorInfo,
      showSerial, mediaDataShotCut }
  },

  components: { JustALightbox, MainBgImage, TheMetaTags, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, MediaReviews, RightMediaBlockActions }
}
</script>



