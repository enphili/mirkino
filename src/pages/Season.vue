<template>

  <Loading
    v-if="loader"
  />

  <TheMetaTags
    :title="'Мир кино | ' + mediaTitle + '. Сезон - ' + seasonNumber"
    description="Страница с подробной информацией о сезоне сериала"
  />

  <main-bg-image
    v-if="tvData.bgUrl"
    :url="tvData.bgUrl"
    :title="mediaTitle"
    mediaType="сезону сериала"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container mt30percent" v-scroll="onScroll">

      <MainTitleBlock
        v-if="tvData.title"
        :tagline="tvData.tagline"
        :title="tvData.title"
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
    aria-label="Прокрутить вверх"
    @click="useScrollUpPage"
  />

</template>

<script>
import {SCROLL_THRESHOLD} from 'boot/scrollThreshold'
import {useQuasar} from 'quasar'
import {useNavigateTo} from 'src/use/navigateTo'
import {useNotification} from 'src/use/notification'
import {ref, onMounted, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useScrollUpPage} from 'src/use/scrollUpPage'
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
import {useServiceSeason} from 'src/use/servise/season'

export default {
  name: "Season",
  props: ['seasonNumber', 'mediaID', 'mediaTitle', 'seasonName'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const index = ref(null)
    const tvData = reactive({})
    const showScrollUpBtn = ref(false)
    const loader = ref(true)

    // hooks
    onMounted(async () => {
      try {
        await useServiceSeason(props.mediaID, props.seasonNumber, tvData)
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
      const  {id, type, title, originaltvTitle, posterPath, year} = tvData
      return {id, type, title: title || originaltvTitle, posterPath, year}
    })

    // methods
    const showSeasonInfo = async item => {
      await useNavigateTo(router, 'season', {
        mediaID: props.mediaID,
        seasonNumber: item.season_number,
        mediaTitle: props.mediaTitle
      })
    }

    const showEpisode = async item => {
      await useNavigateTo(router, 'episode', {
        mediaID: props.mediaID,
        seasonNumber: item.season_number,
        episodeNumber: item.episode_number,
        episodTitle: item.name,
        mediaTitle: props.mediaTitle
      })
    }

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return { tvData, index, showSeasonInfo, showEpisode, loader,
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
