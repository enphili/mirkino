<template>

  <Loading
    v-if="loader"
  />

  <TheMetaTags
    :title="'Мир кино | ' + mediaTitle"
    description="Страница с подробной информацией о фильме"
  />

  <main-bg-image
    v-if="mediaData.bgUrl"
    :url="mediaData.bgUrl"
    :title="mediaData.mediaTitle"
    mediaType="фильму"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container mt30percent" v-scroll="onScroll">

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
import {useServiceMovie} from 'src/use/servise/movie'
import {ref, onMounted, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'
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

export default {
  name: "Movie",
  props: ['mediaTitle', 'mediaID'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const loader = ref(true)
    const index = ref(null)
    const mediaData = reactive({})
    const showScrollUpBtn = ref(false)
    const mediaDataShotCut = computed(() => {
      const {id, type, mediaTitle, originalMediaTitle, posterPath, year } = mediaData
      return {id, type, title: mediaTitle || originalMediaTitle, posterPath, year }
    })

    // hooks
    onMounted(async () => {
      try {
        await useServiceMovie(props.mediaID, mediaData)
        loader.value = false
      }
      catch (error) {
        await useNotification({
          router,
          notify: $q,
          error
        })
      }
    })

    // methods
    const changeFilm = async item => {
      await useNavigateTo(router, 'movie', {
        mediaTitle: item.title || item.original_title,
        mediaID: item.id
      })
    }

    const showActorInfo = async item => {
      await useNavigateTo(router, 'actors', {
        actorName: item.name,
        personId: item.id
      })
    }

    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    return { index, mediaData, changeFilm, onScroll, loader,
      showScrollUpBtn, useScrollUpPage, showActorInfo, mediaDataShotCut }
  },

  components: {
    Loading, JustALightbox, MainBgImage, MainTitleBlock, MainReleaseInfo, MainDescription,
    TrailerAndHomepageData, LeftMediaPoster, EpisodesCollection, TheMetaTags, MediaReviews,
    RightMediaBlockActions
  }
}
</script>

<style lang="sass">
.mt30percent
  margin-top: 30%
</style>
