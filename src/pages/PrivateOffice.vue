<template>
  <TheMetaTags
    title="Мир кино | Личный кабинет"
    description="Управление фильмами и сериалами добавлеными в списки любимых или желаемых к просмотру"
  />

  <q-page class="q-px-md overflow-hidden mw-con">
    <h1 class="page-title text-white" >Мои списки фильмов и сериалов</h1>

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
        <q-card
          bordered
          flat
          dark
          class="office-cart cursor-pointer"
          v-for="media in wishlist"
          :key="media.id"
          @click="openMedia($event, media)"
        >
          <q-card-section horizontal>
            <q-img
              class="office-cart-img"
              :src="media.posterPath"
            >
              <template v-slot:error>
                <img :src="require('../assets/img/load-img-error.jpg')" alt="error-load">
              </template>
            </q-img>
            <q-card-section class="bg-dark text-white">
              <p class="text-subtitle2 text-weight-bold office-cart-title">{{ media.title }}</p>
              <div class="type-year">
                <p class="media-type" style="margin: 8px 0 0 0">{{ media.type === 'movie' ? 'фильм' : 'сериал' }}</p>
                <p style="margin: 8px 0 0 10px">{{ media.year }} г.</p>
              </div>
              <div class="type-year">
                <p class="tv-info" v-if="media.seasonNumber">{{ media.seasonNumber }},</p>
                <p class="tv-info" v-if="media.episodeNumber">{{ media.episodeNumber }},</p>
                <p class="tv-info" v-if="media.episodTitle">"{{ media.episodTitle }}"</p>
              </div>
            </q-card-section>
            <q-card-actions class="office-cart-btns">
              <q-btn round flat icon="close" style="color: #ff8f27;" @click="removeMedia('wishList', media.id)">
                <q-tooltip class="bg-accent">Удалить из списка</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="favorite">
        <q-card
          bordered
          flat
          dark
          class="office-cart cursor-pointer"
          v-for="media in favorite"
          :key="media.id"
          @click="openMedia($event, media)"
        >
          <q-card-section horizontal>
            <q-img
              class="office-cart-img"
              :src="media.posterPath"
            >
              <template v-slot:error>
                <img :src="require('../assets/img/load-img-error.jpg')" alt="error-load">
              </template>
            </q-img>
            <q-card-section class="bg-dark text-white">
              <p class="text-subtitle2 text-weight-bold office-cart-title">{{ media.title }}</p>
              <div class="type-year">
                <p class="media-type" style="margin: 8px 0 0 0">{{ media.type === 'movie' ? 'фильм' : 'сериал' }}</p>
                <p style="margin: 8px 0 0 10px">{{ media.year }} г.</p>
              </div>
              <div class="type-year">
                <p class="tv-info" v-if="media.seasonNumber">{{ media.seasonNumber }},</p>
                <p class="tv-info" v-if="media.episodeNumber">{{ media.episodeNumber }},</p>
                <p class="tv-info" v-if="media.episodTitle">"{{ media.episodTitle }}"</p>
              </div>
            </q-card-section>
            <q-card-actions class="office-cart-btns">
              <q-btn round flat icon="close" style="color: #ff8f27;" @click="removeMedia('favorite', media.id)">
                <q-tooltip class="bg-accent">Удалить из списка</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

  </q-page>

</template>

<script>
import TheMetaTags from 'components/meta/TheMetaTags'
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "PrivateOffice",

  setup() {
    const $store = useStore()
    const router = useRouter()
    const wishlist = computed(() => Object.values($store.getters['currentUser/getUserWishList']))
    const favorite = computed(() => Object.values($store.getters['currentUser/getUserFavorite']))

    const removeMedia = async (key, id) => {
      const res = await $store.dispatch('currentUser/removeFromUserList', {list: key, id})
      if (res === 'relogin') await router.push('/relogin')
    }

    const openMedia = async (e, media) => {
      const isButton = e.target.closest('button')?.tagName === 'BUTTON'
      if (isButton) return
      if (media.type === 'tv') {
        const episodeNumber = media.episodeNumber?.replace(/[^\d]/g, '')
        const seasonNumber = media.seasonNumber?.replace(/[^\d]/g, '')
        if (!seasonNumber && !episodeNumber) {
          await router.push({
            name: 'serials',
            params: {
              mediaTitle: media.title,
              mediaID: media.id
            }
          })
        }
        if (seasonNumber && !episodeNumber) {
          await router.push({
            name: 'season',
            params: {
              mediaID: media.id,
              seasonNumber: seasonNumber,
              mediaTitle: media.title
            }
          })
        }
        if (seasonNumber && episodeNumber) {
          await router.push({
            name: 'episode',
            params: {
              mediaID: media.id,
              seasonNumber: seasonNumber,
              episodeNumber: episodeNumber,
              episodTitle: media.episodTitle,
              mediaTitle: media.title
            }
          })
        }
      }
      if (media.type === 'movie') {
        await router.push({
          name: 'movie',
          params: {
            mediaTitle: media.title,
            mediaID: media.id
          }
        })
      }
    }

    return {
      tab: ref('wishList'),
      wishlist, favorite,
      removeMedia, openMedia
    }
  },

  components: {TheMetaTags,}
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
.office-cart
  &-title
    margin: 0
  &-img
    height: 140px
    width: 100px
    flex-shrink: 0
  &-btns
    margin-left: auto
    align-items: start
.type-year
  display: flex
  align-items: center
  flex-wrap: wrap
.tv-info
  font-size: 0.89em
  margin: 0 0 0 5px
  white-space: nowrap
.type-year:not(:last-child)
  margin-bottom: 10px
@media screen and (max-width: 440px)
  .office-cart
    &-img
      display: none
  .q-tab-panel
    display: flex
    flex-direction: column
</style>
