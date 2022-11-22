<template>
  <q-card
    flat
    class="film-card animated text-dark"
    :class="randomItemFromArray(animatedCss)"
    style="display: flex; flex-direction: column; justify-content: space-between;"
    @click="showFilmInfo"
  >
    <q-img
      :alt="media.title || media.name"
      :src='posterURL'
      spinner-color="accent"
      style="max-height: 370px;"
    >
      <q-badge
        v-if="media.vote_average"
        align="top"
        color="accent"
        style="padding: 4px 8px; border-radius: 0"
      >
        TMDb: {{ media.vote_average }}
      </q-badge>
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-grey-3 text-accent">
          База данных TMDB заблокирована для России. Воспользуйтесь VPN
        </div>
      </template>
    </q-img>

    <q-card-section class="q-pa-sm">
      <div class="text-body1 text-weight-bold" >{{ media.title || media.name }}</div>
    </q-card-section>

    <q-fab
      v-model="qFab"
      vertical-actions-align="center"
      color="accent"
      icon="add"
      direction="down"
      class="absolute-top-right"
      padding="xs"
      style="right: 0.5em; top: 0.5em;"
    >
      <q-fab-action
        label-position="left"
        external-label
        :label-class="isInStorage.wishList ? 'bg-grey-1 text-deep-orange-5' : 'bg-grey-1 text-green-9'"
        :text-color="isInStorage.wishList ? 'deep-orange-5' : 'green-9'"
        color="grey-1"
        label-style="max-width: 168px;"
        @click="toggleUserList('wishList')"
        :icon="isInStorage.wishList ? 'bookmark_remove' : 'bookmark_add'"
        :label='isInStorage.wishList ?  `Удалить из "Смотреть позже"` : `Добавить в "Смотреть позже"`'
        padding="xs"
      />
      <q-fab-action
        label-position="left"
        :label-class="isInStorage.favorite ? 'bg-grey-1 text-deep-orange-5' : 'bg-grey-1 text-green-9'"
        external-label
        :text-color="isInStorage.favorite ? 'deep-orange-5' : 'red-7'"
        color="grey-1"
        label-style="max-width: 168px;"
        @click="toggleUserList('favorite')"
        :icon="isInStorage.favorite ? 'ion-heart-dislike' : 'ion-heart'"
        :label='isInStorage.favorite ? `Удалить из "Любимые"` : `Добавить в "Любимые"`'
        padding="xs"
      />
    </q-fab>

  </q-card>
</template>

<script>
import {useRouter} from 'vue-router'
import {randomItemFromArray} from 'src/utils/randomItemFromArray'
import {reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {useGetPosterUrl} from 'src/use/getPosterUrl'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'

export default {
  name: "FilmCard",
  props: {
    media: Object,
    mediaType: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const router = useRouter()
    const $store = useStore()
    const animatedCss = ['fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInUp']
    const qFab = ref(false)
    const isInStorage = reactive({wishList: false, favorite: false})
    const mediaDataShotCut = reactive({})

    const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

    const posterURL = ref(basePosterURL(props.media.poster_path || props.media.profile_path))

    mediaDataShotCut.id = props.media.id
    mediaDataShotCut.type = props.media.media_type
    mediaDataShotCut.title = props.media.title || props.media.name
    mediaDataShotCut.posterPath = posterURL.value
    mediaDataShotCut.year = useDividedReleaseDate(props.media.release_date || props.media.first_air_date)

    if ($store.getters['currentUser/getUserWishList']) {
      const wishlist = Object.values($store.getters['currentUser/getUserWishList'])
      if (wishlist.length > 0 && wishlist.find(el => el.id === props.media.id)) isInStorage.wishList = true
    }
    if ($store.getters['currentUser/getUserFavorite']) {
      const favorite = Object.values($store.getters['currentUser/getUserFavorite'])
      if (favorite.length > 0 && favorite.find(el => el.id === props.media.id)) isInStorage.favorite = true
    }

    const showFilmInfo = e => {
      if (e.target.classList.contains('q-fab') ||
          e.target.classList.contains('q-btn') ||
          e.target.classList.contains('q-icon') ||
          e.target.classList.contains('q-fab__label')
      ) return
      if (props.media.media_type === 'movie' || props.mediaType === 'movie') {
        router.push({
          name: 'movie',
          params: {
            mediaTitle: props.media.title || props.media.original_title,
            mediaID: props.media.id
          }
        })
      }
      if (props.media.media_type === 'tv') {
        router.push({
          name: 'serials',
          params: {
            mediaTitle: props.media.name || props.media.original_name,
            mediaID: props.media.id
          }
        })
      }
      if (props.media.media_type === 'person') {
        router.push({
          name: 'actors',
          params: {
            actorName: props.media.name,
            personId: props.media.id
          }
        })
      }
    }

    const toggleUserList = async key => {
      if (isInStorage[key]) {
        const res = await $store.dispatch('currentUser/removeFromUserList', {list: key, id: props.media.id})
        if (res === 'relogin') await router.push('/relogin')
        if (res === 'good') isInStorage[key] = false
      }
      else {
        const res = await $store.dispatch('currentUser/addToUserList', {media: mediaDataShotCut, list: key})
        if (res === 'relogin') await router.push('/relogin')
        if (res === 'good') isInStorage[key] = true
      }
    }

    return { showFilmInfo, posterURL, randomItemFromArray, animatedCss, qFab,
      toggleUserList, isInStorage }
  }
}
</script>
