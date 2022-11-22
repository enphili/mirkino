<template>

  <TheMetaTags
    :title="'Мир кино | ' + actorName"
    :description="metaDescription"
  />

  <q-page class="q-px-md overflow-hidden">
    <div class="container" style="margin-top: 10%" v-scroll="onScroll">

      <MainTitleBlock
        v-if="actorsData.actorName"
        :title="actorsData.actorNameRU ? actorsData.actorNameRU : actorsData.actorName"
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
          v-if="actorsData.profilePath"
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

</template>

<script>
import {onMounted, reactive, ref} from 'vue'
import errorsText from 'src/utils/errorsText'
import {useQuasar} from 'quasar'
import {api} from 'boot/axios'
import {useRouter} from 'vue-router'
import TheMetaTags from 'components/meta/TheMetaTags'
import MainTitleBlock from 'components/MainTitleBlock'
import MainReleaseInfo from 'components/MainReleaseInfo'
import LeftMediaPoster from 'components/LeftMediaPoster'
import RightMediaDescription from 'components/RightMediaDescription'
import TrailerAndHomepageData from 'components/TrailerAndHomepageData'
import ActorsCombinedCredits from 'components/ActorsCombinedCredits'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

export default {
  name: "Actors",
  props: ['personId', 'actorName'],

  setup(props) {
    const $q = useQuasar()
    const router = useRouter()
    const metaDescription = ref('Страница с подробной информацией об актере')
    const showScrollUpBtn = ref(false)
    const actorsData = reactive({})
    const cyrillicPattern = /[\u0400-\u04FF]/
    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    // hooks
    onMounted(async () => await getActorsData())

    // methods
    const getActorsData = async () => {
      try {
        const [res, res2] = await Promise.all([
          api.get(`/api/actorsinfo?personId=${props.personId}`),
          api.get(`/api/actorscast?personId=${props.personId}`)
        ])
        actorsData.biography = res.data.biography ? res.data.biography : 'данных в базе нет'
        actorsData.birthday = new Date(res.data.birthday).toLocaleString('ru', { year: 'numeric', month: 'long', day: 'numeric' })
        actorsData.homepage = res.data.homepage
        actorsData.placeOfBirth = res.data.place_of_birth
        actorsData.actorName = res.data.name
        actorsData.profilePath = basePosterURL(res.data.profile_path)
        actorsData.actorNameRU = res.data.also_known_as.find(el => cyrillicPattern.test(el))
        actorsData.cast = res2.data.cast
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

    const onScroll = position => position >= 600 ? showScrollUpBtn.value = true : showScrollUpBtn.value = false

    const goToMediaPage = async item => {
      if (item.media_type === 'movie') await router.push({
          name: 'movie',
          params: {
            mediaID: item.id,
            mediaTitle: item.title
          }
        })
      if (item.media_type === 'tv') await router.push({
          name: 'serials',
          params: {
            mediaID: item.id,
            mediaTitle: item.title
          }
        })
    }

    return { metaDescription, onScroll, actorsData, goToMediaPage }
  },

  components: { TheMetaTags, MainTitleBlock, MainReleaseInfo, LeftMediaPoster, RightMediaDescription,
    TrailerAndHomepageData, ActorsCombinedCredits,  }
}
</script>

