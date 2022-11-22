<template>
  <div class="right-row">
    <div class="short-description-title">Смотреть онлайн</div>
    <q-btn no-caps class="web-search-btn web-search-btn-google" label="Искать на Google" @click="searchByGoogle" />
    <q-btn no-caps class="web-search-btn web-search-btn-yandex" label="Искать на Яндекс" @click="searchByYandex"/>

    <div class="q-mt-xl">
      <q-btn
        no-caps
        size="sm"
        unelevated
        flat
        color="accent"
        icon="bookmark_add"
        class="wish-btn"
        :disable="isInWishList"
        :label="!isInWishList ? 'Буду смотреть' : 'В списке желаний'"
        @click="addToWishList"
      />
      <q-btn
        no-caps
        size="sm"
        unelevated
        icon="bookmark_remove"
        class="wish-btn"
        :disable="!isInWishList"
        label="Уже посмотрел"
        @click="removeFromWishList"
      />
    </div>

    <div class="q-mt-sm">
      <q-btn
        no-caps
        size="sm"
        unelevated
        flat
        color="red-7"
        icon="ion-heart"
        class="wish-btn"
        :disable="isInFavoriteList"
        :label="!isInFavoriteList ? 'В мои любимые' : 'В списке любимых'"
        @click="addToFavoriteList"
      />
      <q-btn
        no-caps
        size="sm"
        unelevated
        icon="ion-heart-dislike"
        class="wish-btn"
        :disable="!isInFavoriteList"
        label="Разонравился"
        @click="removeFromFavoriteList"
      />
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "RightMediaBlockActions",
  props: { media: Object },

  setup(props) {
    const $store = useStore()
    const router = useRouter()
    const isInWishList = ref( false)
    const isInFavoriteList = ref(false)

    const searchByGoogle = () => window.open(`https://www.google.ru/search?q=${props.media.title}+%28${props.media.year}%29+${props.media.seasonNumber ? props.media.seasonNumber.charAt(0).toLowerCase() + props.media.seasonNumber.slice(1) : ''}+смотреть+онлайн`, '_blank')

    const searchByYandex = () => window.open(`https://www.yandex.ru/search/?text=${props.media.title}+%28${props.media.year}%29+${props.media.seasonNumber ? props.media.seasonNumber.charAt(0).toLowerCase() + props.media.seasonNumber.slice(1) : ''}+смотреть+онлайн`, '_blank')

    if ($store.getters['currentUser/getUserWishList']) {
      const wishlist = Object.values($store.getters['currentUser/getUserWishList'])
      if (wishlist.length > 0 && wishlist.find(el => el.id === props.media.id)) isInWishList.value = true
    }
    if ($store.getters['currentUser/getUserFavorite']) {
      const favorite = Object.values($store.getters['currentUser/getUserFavorite'])
      if (favorite.length > 0 && favorite.find(el => el.id === props.media.id)) isInFavoriteList.value = true
    }

    const addToWishList = async () => {
      const res = await $store.dispatch('currentUser/addToUserList', {media: props.media, list: 'wishList'})
      if (res === 'relogin') await router.push('/relogin')
      if (res === 'good') isInWishList.value = true
    }

    const removeFromWishList = async () => {
      const res = await $store.dispatch('currentUser/removeFromUserList', {list: 'wishList', id: props.media.id})
      if (res === 'relogin') await router.push('/relogin')
      if (res === 'good') isInWishList.value = false
    }

    const addToFavoriteList = async () => {
      const res = await $store.dispatch('currentUser/addToUserList', {media: props.media, list: 'favorite'})
      if (res === 'relogin') await router.push('/relogin')
      if (res === 'good') isInFavoriteList.value = true
    }

    const removeFromFavoriteList = async () => {
      const res = await $store.dispatch('currentUser/removeFromUserList', {list: 'favorite', id: props.media.id})
      if (res === 'relogin') await router.push('/relogin')
      if (res === 'good') isInFavoriteList.value = false
    }

    return {
      searchByGoogle,
      searchByYandex,
      addToWishList,
      removeFromWishList,
      addToFavoriteList,
      removeFromFavoriteList,
      isInWishList,
      isInFavoriteList
    }
  }
}
</script>

<style scoped lang="sass">
.wish-btn
  width: 159px
.short-description-title
  margin: 0 0 5px 0
.web-search-btn
  width: 163px
  color: white
  &-google
    background: #4285f4
    margin-right: 10px
  &-yandex
    background: #ffcc00
@media screen and (max-width: 768px)
  .web-search-btn-google
    margin-right: auto
    margin-bottom: 10px
@media screen and (max-width: 505px)
  .web-search-btn-google
    margin-bottom: auto
    margin-right: 10px
  .short-description-title
    margin-top: 20px
@media screen and (max-width: 489px)
  .web-search-btn-google
    margin-bottom: 10px
</style>

