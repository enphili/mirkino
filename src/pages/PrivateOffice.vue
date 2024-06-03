<template>
  <TheMetaTags
    title="Мир кино | Личный кабинет"
    description="Управление фильмами и сериалами добавленными в списки любимых или желаемых к просмотру"
  />

  <q-page class="q-px-md overflow-hidden mw-con">
    <h1 class="page-title text-white">Мои списки фильмов и сериалов</h1>

    <q-tabs
      v-model="tab"
      no-caps
      dense
      class="text-white"
      active-color="accent"
      indicator-color="accent"
      align="justify"
      narrow-indicator
    >
      <q-tab name="wishList" label="Хочу посмотреть" />
      <q-tab name="favorite" label="Любимые фильмы" />
    </q-tabs>

    <q-separator color="grey-10" />

    <q-tab-panels v-model="tab" animated class="bg-dark text-white">
      <q-tab-panel name="wishList">

        <OfficeMediaCard
          v-for="media in wishlist"
          :key="media.id"
          :media="media"
          @remove="removeMedia('wishList', media.id)"
          @click="openMedia"
        />

      </q-tab-panel>

      <q-tab-panel name="favorite">

        <OfficeMediaCard
          v-for="media in favorite"
          :key="media.id"
          :media="media"
          @remove="removeMedia('favorite', media.id)"
          @click="openMedia"
        />

      </q-tab-panel>
    </q-tab-panels>

  </q-page>

</template>

<script>
import TheMetaTags from 'components/meta/TheMetaTags'
import OfficeMediaCard from 'components/OfficeMediaCard.vue'
import {useNavigateTo} from 'src/use/navigateTo'
import {useNavigateToTv} from 'src/use/navigateToTv'
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "PrivateOffice",

  setup() {
    const $store = useStore()
    const router = useRouter()
    const tab = ref('wishList')

    const wishlist = computed(() => Object.values($store.getters['currentUser/getUserWishList']))
    const favorite = computed(() => Object.values($store.getters['currentUser/getUserFavorite']))

    const removeMedia = async (key, id) => {
      const res = await $store.dispatch('currentUser/removeFromUserList', {list: key, id})
      if (res === 'relogin') await router.push('/relogin')
    }

    const openMedia = async media => {
      if (media.type === 'tv') {
        await useNavigateToTv(router, media)
      }
      else if (media.type === 'movie') {
        await useNavigateTo(router, 'movie', {
          mediaTitle: media.title,
          mediaID: media.id
        })
      }
    }

    return {tab, wishlist, favorite, removeMedia, openMedia}
  },

  components: {OfficeMediaCard, TheMetaTags,}
}
</script>

<style scoped lang="sass">
.q-tab-panel
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr))
  grid-template-rows: repeat(auto-fit, minmax(140px, 1fr))
  grid-gap: 10px 10px
.mw-con
  max-width: 1200px
  margin: auto
@media screen and (max-width: 440px)
  .q-tab-panel
    display: flex
    flex-direction: column
</style>
