<template>

  <TheMetaTags
    :title="'Мир кино | ' + tvTitle + '. Сезон - ' + tvseasonNumber"
    :description="metaDescription"
  />

  <main-bg-image
    v-if="tvData.bgUrl"
    :url="tvData.bgUrl"
    :title="mediaTitle"
    mediaType="сезону сериала"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container" style="margin-top: 30%" v-scroll="onScroll">

      <MainTitleBlock
        v-if="tvData.originaltvTitle"
        :tagline="tvData.tagline"
        :title="mediaDataShotCut.title"
        :originalTitle="tvData.originaltvTitle"
        :mediaType="tvData.seasonName"
      />

      <MainReleaseInfo
        v-if="tvData.certification"
        :certification="tvData.certification"
        :runtime="tvData.runtime"
        :productionCountries="tvData.productionCountries"
        :year="mediaDataShotCut.year"
        :tags="tvData.tags"
      />

      <MainDescription
        v-if="tvData.description"
        :title="`Краткий обзор сезона ${seasonNumber}`"
        :description="tvData.description"
      />

      <TrailerAndHomepageData
        :trailers="tvData.trailersData"
        :homepageUrl="tvData.homepageUrl"
        @showTrailers="tvData.trailersData ? index = 0 : index = null"
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
          v-if="tvData.episodes"
          error-img-url="unnamed.jpg"
          description="Все серии сезона"
          title="Эпизоды"
          :items="tvData.episodes"
          :quantityDisplayedItems="12"
          itemType="episode"
          cta-text="показать все серии"
          @go-to-item="showEpisode"
        />

        <EpisodesCollection
          v-if="tvData.hasSeasons"
          error-img-url="unnamed.jpg"
          description="Все сезоны сериала"
          title="Сезоны"
          :items="tvData.seasons"
          itemType="tv"
          @go-to-item="showSeasonInfo"
        />

      </div>

    </div>
  </q-page>

  <JustALightbox
    :initIndex="index"
    :items="tvData.trailersData"
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
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import countries from '../utils/countries.js'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
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
import RightMediaBlockActions from 'components/RightMediaBlockActions'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

export default {
  name: "Season",
  props: ['seasonNumber', 'mediaID', 'mediaTitle', 'seasonName'],

  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const metaDescription = ref('Страница с подробной информацией о сезоне о сериала')
    const index = ref(null)
    const tvID = ref(route.params.mediaID)
    const tvTitle = ref(route.params.mediaTitle)
    const tvseasonNumber = ref(route.params.seasonNumber)
    const tvData = reactive({})
    const showScrollUpBtn = ref(false)
    const mediaDataShotCut = reactive({})
    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    // hooks
    onMounted(async () => await getTvData())

    // methods
    const getTvData = async () => {
      try {
        const [response, response2, response3] = await Promise.all([
          api.get(`/api/filminfo?id=${tvID.value}&type=tv`),
          api.get(`/api/seasontrailers?id=${tvID.value}&seasonNumber=${tvseasonNumber.value}`),
          api.get(`/api/season?id=${tvID.value}&seasonNumber=${tvseasonNumber.value}`)
        ])
        tvData.bgUrl = 'https://image.tmdb.org/t/p/original' + response.data.backdrop_path
        tvData.tagline = response.data.tagline
        tvData.originaltvTitle = response.data.original_name
        tvData.certification = useMediaCertification('tv', response.data.content_ratings.results)
        tvData.runtime = useDividedRuntime('tv', response.data.episode_run_time)
        tvData.productionCountries = response.data.production_countries.map(el => countries(el.iso_3166_1))
        tvData.tags = response.data.genres
        tvData.description = response3.data.overview
        tvData.trailersData = response2.data
        tvData.hasTrailers = tvData.trailersData.length > 0
        tvData.homepageUrl = response.data.homepage
        tvData.hasSeasons = !!response.data.seasons
        if (tvData.hasSeasons) {
          tvData.seasons = response.data.seasons
        }
        tvData.episodes = response3.data.episodes
        tvData.seasonName = response3.data.name

        mediaDataShotCut.id = +tvID.value
        mediaDataShotCut.type = 'tv'
        mediaDataShotCut.title = response.data.name || response.data.original_name
        mediaDataShotCut.posterPath = basePosterURL(response3.data.poster_path)
        mediaDataShotCut.year = useDividedReleaseDate(response.data.first_air_date)
        mediaDataShotCut.seasonNumber = response3.data.name
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
      tvseasonNumber.value = item.season_number
      await router.push({name: 'season', params: {mediaID: tvID.value, seasonNumber: tvseasonNumber.value, mediaTitle: tvTitle.value}})
    }

    const showEpisode = async item => {
      await router.push({name: 'episode', params: {
        mediaID: tvID.value,
        seasonNumber: item.season_number,
        episodeNumber: item.episode_number,
        episodTitle: item.name,
        mediaTitle: tvTitle.value
      }})
    }

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return { tvData, index, showSeasonInfo, tvTitle, showEpisode, tvID,
      metaDescription, tvseasonNumber, onScroll, showScrollUpBtn,
      useScrollUpPage, mediaDataShotCut }
  },

  components: { JustALightbox, MainBgImage, TheMetaTags, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, RightMediaBlockActions }

}
</script>
