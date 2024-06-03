<template>

  <Loading
    v-if="loader"
  />

  <TheMetaTags
    :title="'Мир кино | ' + actorName"
    description="Страница с подробной информацией об актере"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container mt10percent" v-scroll="onScroll">

      <MainTitleBlock
        v-if="actorsData.actorName"
        :title="actorsData.actorNameRU || actorsData.actorName"
        :originalTitle="!actorsData.actorNameRU ? '' : actorsData.actorName"
      />

      <MainReleaseInfo
        :isMediaInfo = false
        :runtime="'Место и дата рождения: '"
        :placeOfBirth="actorsData.placeOfBirth"
        :year="actorsData.birthday"
      />

      <TrailerAndHomepageData
        v-if="actorsData.homepage"
        :homepageUrl="actorsData.homepage"
        :ctaHomepage="'Страничка в сети'"
      />

      <div class="content">

        <LeftMediaPoster
          :posterUrl="actorsData.profilePath"
          error-img-url="unnamed.jpg"
        />

        <RightMediaDescription
          :title="'Биография'"
          :description="actorsData.biography"
        />

        <ActorsCombinedCredits
          v-if="actorsData.cast && actorsData.cast.length > 0"
          error-img-url="unnamed.jpg"
          title="Фильмография"
          description="Все фильмы и сериалы с участием актера"
          :cast-array="actorsData.cast"
          cta-text="все фильмы"
          @go-to-item="goToMediaPage"
        />

      </div>

    </div>
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
import {useNavigateTo} from 'src/use/navigateTo'
import {useNotification} from 'src/use/notification'
import {onMounted, reactive, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import Loading from 'components/Loading.vue'
import TheMetaTags from 'components/meta/TheMetaTags'
import MainTitleBlock from 'components/MainTitleBlock'
import MainReleaseInfo from 'components/MainReleaseInfo'
import LeftMediaPoster from 'components/LeftMediaPoster'
import RightMediaDescription from 'components/RightMediaDescription'
import TrailerAndHomepageData from 'components/TrailerAndHomepageData'
import ActorsCombinedCredits from 'components/ActorsCombinedCredits'
import {useServiceActor} from 'src/use/servise/actor'
import {useScrollUpPage} from 'src/use/scrollUpPage'
import {SCROLL_THRESHOLD} from 'boot/scrollThreshold'

export default {
  name: 'Actors',
  props: ['personId', 'actorName'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const showScrollUpBtn = ref(false)
    const actorsData = reactive({})
    const loader = ref(true)

    // hooks
    onMounted(async () => {
      try {
        await useServiceActor(props.personId, actorsData)
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

    // methods
    const onScroll = position => showScrollUpBtn.value = position >= SCROLL_THRESHOLD

    const goToMediaPage = async item => {
      const routeNames = {
        movie: 'movie',
        tv: 'serials'
      }
      const routeName = routeNames[item.media_type]
      if (routeName) {
        try {
          await useNavigateTo(router, routeName, {
            mediaID: item.id,
            mediaTitle: item.title || item.name
          })
        } catch (error) {
          await useNotification({
            router,
            notify: $q,
            error
          })
        }
      }
      else {
        await useNotification({
          router,
          notify: $q,
          message: `Неподдерживаемый тип медиа: ${item.media_type}`
      })
      }
    }

    return { loader, onScroll, actorsData, goToMediaPage, showScrollUpBtn, useScrollUpPage }
  },

  components: {
    Loading, TheMetaTags, MainTitleBlock, MainReleaseInfo, LeftMediaPoster, RightMediaDescription,
    TrailerAndHomepageData, ActorsCombinedCredits,  }
}
</script>

<style lang="sass">
.mt10percent
  margin-top: 10%
</style>
