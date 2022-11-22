<template>

  <TheMetaTags
    :title="`Мир кино | ${mediaTitle}. Сезон - ${seasonNumber} серия - ${episodeNumber}. ${episodTitle}`"
    :description="metaDescription"
  />

  <main-bg-image
    v-if="episodeData.bgUrl"
    :url="episodeData.bgUrl"
    :title="episodeData.title"
    mediaType="серии"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container" style="margin-top: 30%" v-scroll="onScroll">

      <MainTitleBlock
        v-if="episodeData.episodeNumber"
        :tagline="'Серия - ' + episodeData.episodeNumber"
        :title="episodeData.title"
        :originalTitle="mediaTitle"
        :mediaType="episodeData.seasonName"
      />

      <MainReleaseInfo
        v-if="episodeData.certification"
        :certification="episodeData.certification"
        :runtime="episodeData.runtime"
        :productionCountries="episodeData.productionCountries"
        :year="mediaDataShotCut.year"
        :tags="episodeData.tags"
      />

      <MainDescription
        v-if="episodeData.description"
        title="Краткий обзор"
        :description="episodeData.description"
      />

      <TrailerAndHomepageData
        :trailers="episodeData.trailersData"
        :homepageUrl="episodeData.homepageUrl"
        @showTrailers="episodeData.trailersData ? index = 0 : index = null"
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
          v-if="episodeData.episodes"
          error-img-url="unnamed.jpg"
          description="Все серии сезона"
          title="Эпизоды"
          :items="episodeData.episodes"
          itemType="episode"
          @go-to-item="showEpisode"
        />

        <EpisodesCollection
          v-if="episodeData.hasSeasons"
          error-img-url="unnamed.jpg"
          description="Все сезоны сериала"
          title="Сезоны"
          :items="episodeData.seasons"
          itemType="tv"
          @go-to-item="showSeasonInfo"
        />
      </div>

    </div>
  </q-page>

  <JustALightbox
    :initIndex="index"
    :items="episodeData.trailersData"
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
import { ref, onMounted, reactive } from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {api} from 'boot/axios'
import errorsText from 'src/utils/errorsText'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import countries from '../utils/countries.js'
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
  name: "Episode",
  props: ['seasonNumber', 'mediaID', 'episodeNumber', 'episodTitle', 'mediaTitle'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const metaDescription = ref('Страница с информацией об одной из серии сериала')
    const index = ref(null)
    const episodeData = reactive({})
    const chosenEpisodeNumber = ref(props.episodeNumber)
    const chosenEpisodTitle = ref(props.episodTitle)
    const showScrollUpBtn = ref(false)
    const mediaDataShotCut = reactive({})
    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    // hooks
    onMounted(async () => await getEpisodeData())

    // methods
    const getEpisodeData = async () => {
      try {
        const [response, response2, response3, response4] = await Promise.all([
          api.get(`/api/episode?id=${props.mediaID}&seasonNumber=${props.seasonNumber}&episodeNumber=${chosenEpisodeNumber.value}`),
          api.get(`/api/filminfo?id=${props.mediaID}&type=tv`),
          api.get(`/api/episodetrailers?id=${props.mediaID}&seasonNumber=${props.seasonNumber}&episodeNumber=${chosenEpisodeNumber.value}`),
          api.get(`/api/season?id=${props.mediaID}&seasonNumber=${props.seasonNumber}`)
        ])
        episodeData.bgUrl = 'https://image.tmdb.org/t/p/original' + response.data.still_path
        episodeData.episodeNumber = response.data.episode_number
        episodeData.title = response.data.name
        episodeData.certification = useMediaCertification('tv', response2.data.content_ratings.results)
        episodeData.runtime =  useDividedRuntime('movie', response2.data.episode_run_time)
        episodeData.productionCountries = response2.data.production_countries.map(el => countries(el.iso_3166_1))
        episodeData.tags = response2.data.genres
        episodeData.description = response.data.overview
        episodeData.trailersData = response3.data
        episodeData.hasTrailers = response3.data.length > 0
        episodeData.homepageUrl = response2.data.homepage
        episodeData.episodes = response4.data.episodes
        episodeData.hasSeasons = !!response2.data.seasons
        if (episodeData.hasSeasons) {
          episodeData.seasons = response2.data.seasons
        }
        episodeData.seasonName = response4.data.name

        mediaDataShotCut.id = +props.mediaID
        mediaDataShotCut.type = 'tv'
        mediaDataShotCut.title = props.mediaTitle
        mediaDataShotCut.episodTitle = response.data.name || response.data.original_name
        mediaDataShotCut.posterPath = basePosterURL(response.data.still_path)
        mediaDataShotCut.year = useDividedReleaseDate(response.data.air_date)
        mediaDataShotCut.seasonNumber = 'Сезон ' + props.seasonNumber
        mediaDataShotCut.episodeNumber = 'Серия ' + response.data.episode_number
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

    const showEpisode = async item => {
      chosenEpisodeNumber.value = item.episode_number
      chosenEpisodTitle.value = item.name
      await router.push({
        name: 'episode',
        params: {
          mediaID: props.mediaID,
          seasonNumber: item.season_number,
          episodeNumber: item.episode_number,
          episodTitle: item.name,
          mediaTitle: props.mediaTitle
        }
      })
    }

    const showSeasonInfo = async item => {
      await router.push({
        name: 'season',
        params: {
          mediaID: props.mediaID,
          seasonNumber: item.season_number,
          mediaTitle: props.mediaTitle
        }
      })
    }

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    return {episodeData, index, showEpisode, showSeasonInfo,
      metaDescription, onScroll, showScrollUpBtn,
      useScrollUpPage, mediaDataShotCut }
  },

  components: { JustALightbox, MainBgImage, TheMetaTags, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, RightMediaBlockActions }
}
</script>
