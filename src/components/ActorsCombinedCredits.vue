<template>
  <div class="full-width-row">
    <div class="short-description-title">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>

    <div class="collection-wrap">
      <q-card
        v-for="item in visibleItems"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" class="posterimg">
          <q-badge
            v-if="item.vote_average"
            align="top"
            color="accent"
            style="padding: 4px 8px;border-radius: 0;"
          >
            TMDb: {{ item.vote_average }}
          </q-badge>
          <q-badge
            color="accent"
            style="padding: 4px 8px;border-radius: 0;bottom: 0;right: 0;"
          >
            {{ translateMediaType(item) }}
          </q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl()" class="unnamed-img"/>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm text-weight-bold collection-title">
          {{ getMediaCaption(item) }}
          {{ getReleaseDate(item) ? ' (' + getReleaseDate(item).slice(0, 4) + ' г.)' : '' }}
        </q-card-section>
      </q-card>
    </div>

    <div v-if="isAllItems && showMore" class="showMore" @click="showMore = false">{{ ctaText }}</div>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {translateMediaType} from 'src/utils/translateMediaType'
import {getReleaseDate} from 'src/utils/getReleaseDate'
import {getMediaCaption} from 'src/utils/getMediaCaption'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

export default {
  name: "ActorsCombinedCredits",
  props: {
    castArray: {
      type: Array,
      required: true
    },
    errorImgUrl: {
      type: String,
      required: true
    },
    quantityDisplayedItems: {
      type: Number,
      default: 12
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ctaText: {
      type: String,
      default: 'показать все'
    },
  },
  emits: ['goToItem'],

  setup(props) {
    const showMore = ref(true)
    const getPosterUrl = useGetPosterUrl('https://image.tmdb.org/t/p/w342')

    const getErrorImgUrl = () => require('../assets/img/' + props.errorImgUrl)

    const getItemPosterImgUrl = item => {
      if (item.media_type === 'movie' || item.media_type === 'tv') {
        return getPosterUrl(item.poster_path)
      }
      if (item.media_type === 'episode') {
        return getPosterUrl(item.still_path)
      }
      return getErrorImgUrl()
    }

    const visibleItems = computed(() => {
      return showMore.value ? props.castArray.slice(0, props.quantityDisplayedItems) : props.castArray
    })

    const isAllItems = computed(() => props.castArray.length >= props.quantityDisplayedItems)

    return { getItemPosterImgUrl, getErrorImgUrl,
      isAllItems, showMore, getMediaCaption, getReleaseDate,
      translateMediaType, visibleItems }
  }
}
</script>

<style lang="sass">
.posterimg
  height: 192px
  width: 100%
</style>

