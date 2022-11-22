<template>
  <div class="full-width-row">
    <div class="short-description-title">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>
    <div v-if="showMore" class="collection-wrap">
      <q-card
        v-for="item in castArray.slice(0, quantityDisplayedItems)"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" style="height: 192px; width: 100%">
          <q-badge v-if="item.vote_average" align="top" color="accent" style="padding: 4px 8px; border-radius: 0">TMDb: {{ item.vote_average }}</q-badge>
          <q-badge color="accent" style="padding: 4px 8px; border-radius: 0; bottom: 0; right: 0">{{ translateMediaType(item) }}</q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img"/>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm text-weight-bold collection-title">
          {{ getItemCaption(item) }} {{ getReleaseDate(item) ? ' (' + getReleaseDate(item).slice(0, 4) + ' г.)' : '' }}
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="collection-wrap">
      <q-card
        v-for="item in castArray"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" style="height: 192px; width: 100%">
          <q-badge v-if="item.vote_average" align="top" color="accent" style="padding: 4px 8px; border-radius: 0">TMDb: {{ item.vote_average }}</q-badge>
          <q-badge color="accent" style="padding: 4px 8px; border-radius: 0; bottom: 0; right: 0">{{ translateMediaType(item) }}</q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img"/>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm text-weight-bold collection-title">
          {{ getItemCaption(item) }} {{ getReleaseDate(item) ? ' (' + getReleaseDate(item).slice(0, 4) + ' г.)' : '' }}
        </q-card-section>
      </q-card>
    </div>
    <div v-if="isAllItems && showMore" class="showMore" @click="showMore = false">{{ ctaText }}</div>
  </div>
</template>

<script>
import {computed, ref} from 'vue'

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

    const getItemPosterImgUrl = item => {
      if (item.media_type === 'movie' || 'tv') return `https://image.tmdb.org/t/p/w342${item.poster_path}`
      if (item.media_type === 'episode') return `https://image.tmdb.org/t/p/w342${item.still_path}`
    }

    const getItemCaption = item => {
      if (item.media_type === 'movie') return item.title
      if (item.media_type === 'person' || item.media_type === 'tv') return item.name
      if (item.media_type === 'episode') return `Серия-${item.episode_number}. ${item.name}`
    }

    const translateMediaType = item => {
      if (item.media_type === 'movie') return 'фильм'
      if (item.media_type === 'tv') return 'сериал'
    }

    const getReleaseDate = item => {
      if (item.media_type === 'movie') return item.release_date
      if (item.media_type === 'tv') return item.first_air_date
    }

    const isAllItems = computed(() => props.castArray.length >= props.quantityDisplayedItems)

    const getErrorImgUrl = img => require('../assets/img/' + img)

    return { getItemPosterImgUrl, getErrorImgUrl, isAllItems, showMore, getItemCaption, getReleaseDate, translateMediaType }
  }
}
</script>


