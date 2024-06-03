<template>

  <Loading
    v-if="loader"
  />

  <TheMetaTags
    :title="'Мир кино | ' + mediaTitle"
    description="Страница с подробной информацией о сериале"
  />

  <MainBgImage
    v-if="mediaData.bgUrl"
    :url="mediaData.bgUrl"
    :title="mediaData.mediaTitle"
    mediaType="сериалу"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container mt30percent" v-scroll="onScroll">

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
    aria-label="Прокрутить вверх"
    @click="useScrollUpPage"
  />

</template>

<script>
import {SCROLL_THRESHOLD} from 'boot/scrollThreshold'
import Loading from 'components/Loading.vue'
import {useQuasar} from 'quasar'
import {useNavigateTo} from 'src/use/navigateTo'
import {useNotification} from 'src/use/notification'
import {useServiceSeries} from 'src/use/servise/series'
import {ref, onMounted, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'
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

export default {
  name: "Serials",
  props: ['mediaTitle', 'mediaID'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const loader = ref(true)
    const index = ref(null)
    const mediaData = reactive({})
    const showScrollUpBtn = ref(false)

    // hooks
    onMounted(async () => {
      try {
        await useServiceSeries(props.mediaID, mediaData)
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
      const {id, type, mediaTitle, originalMediaTitle, posterPath, year} = mediaData
      return {id, type, title: mediaTitle || originalMediaTitle, posterPath, year}
    })

    // methods
    const showSeasonInfo = async item => {
      await useNavigateTo(router, 'season', {
        mediaID: props.mediaID,
        seasonNumber: item.season_number,
        mediaTitle: props.mediaTitle
      })
    }

    const showActorInfo = async item => {
      await useNavigateTo(router, 'actors', {
        actorName: item.name,
        personId: item.id
      })
    }

    const showSerial = async item => {
      await useNavigateTo(router, 'serials', {
        mediaTitle: item.name || item.original_name,
        mediaID: item.id
      })
    }

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return { index, mediaData, showSeasonInfo, showScrollUpBtn,
      onScroll, useScrollUpPage, showActorInfo, showSerial,
      mediaDataShotCut, loader }
  },

  components: {
    Loading, JustALightbox, MainBgImage, TheMetaTags, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, MediaReviews, RightMediaBlockActions }
}
</script>

<style lang="sass">
.mt30percent
  margin-top: 30%
</style>
