<template>

  <Loading
    v-if="loader"
  />

  <TheMetaTags
    :title="`Мир кино | ${mediaTitle}. Сезон - ${seasonNumber} серия - ${episodeNumber}. ${episodTitle}`"
    description="Страница с информацией об одной из серии сериала"
  />

  <main-bg-image
    v-if="episodeData.bgUrl"
    :url="episodeData.bgUrl"
    :title="episodeData.title"
    mediaType="серии"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container mt30percent"  v-scroll="onScroll">

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
        :year="episodeData.year"
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
          v-if="episodeData.posterPath"
          :posterUrl="episodeData.posterPath"
          error-img-url="unnamed.jpg"
        />

        <RightMediaBlockActions
          v-if="episodeData.id"
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
    aria-label="Прокрутить вверх"
    @click="useScrollUpPage"
  />

</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import Loading from 'components/Loading.vue'
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
import {useNotification} from 'src/use/notification'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {useNavigateTo} from 'src/use/navigateTo'
import {useServiceEpisode} from 'src/use/servise/episode'
import {SCROLL_THRESHOLD} from 'boot/scrollThreshold'


export default {
  name: "Episode",
  props: ['seasonNumber', 'mediaID', 'episodeNumber', 'episodTitle', 'mediaTitle'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const loader = ref(true)
    const index = ref(null)
    const showScrollUpBtn = ref(false)
    const episodeData = reactive({})

    // hooks
    onMounted(async () => {
      try {
        await useServiceEpisode(props.mediaID, props.seasonNumber, props.episodeNumber, episodeData)
        loader.value = false
      }
      catch (error) {
        await useNotification({
          router,
          notify: $q,
          error,
        })
      }
    })

    const mediaDataShotCut = computed(() => {
      const  {id, type, mediaName, posterPath, year } = episodeData
      return {id, type, title: mediaName, posterPath, year }
    })

    // methods
    const showEpisode = async item => {
      await useNavigateTo(router,'episode',{
        mediaID: props.mediaID,
        seasonNumber: item.season_number,
        episodeNumber: item.episode_number,
        episodTitle: item.name,
        mediaTitle: props.mediaTitle
      })
    }

    const showSeasonInfo = async item => {
      await useNavigateTo(router,'season',{
        mediaID: props.mediaID,
        seasonNumber: item.season_number,
        mediaTitle: props.mediaTitle
      })
    }

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return {episodeData, index, showEpisode, showSeasonInfo, loader,
      onScroll, showScrollUpBtn, useScrollUpPage, mediaDataShotCut }
  },

  components: {
    Loading, JustALightbox, MainBgImage, TheMetaTags, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, RightMediaBlockActions }
}
</script>

<style lang="sass">
.mt30percent
  margin-top: 30%
</style>
