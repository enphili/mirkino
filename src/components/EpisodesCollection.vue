<template>
  <div class="full-width-row">
    <div class="short-description-title to-episode">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>
    <div v-if="showMore" class="collection-wrap">
      <q-card
        v-for="item in items.slice(0, quantityDisplayedItems)"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" style="height: 192px; width: 100%">
          <q-badge v-if="item.vote_average" align="top" color="accent" style="padding: 4px 8px; border-radius: 0">TMDb: {{ item.vote_average }}</q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img"/>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm text-weight-bold collection-title">
          {{ getItemCaption(item) }}
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="collection-wrap">
      <q-card
        v-for="item in items"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" style="height: 192px; width: 100%">
          <q-badge v-if="item.vote_average" align="top" color="accent" style="padding: 4px 8px; border-radius: 0">TMDb: {{ item.vote_average }}</q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img"/>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm text-weight-bold collection-title">
          {{ getItemCaption(item) }}
        </q-card-section>
      </q-card>
    </div>
    <div v-if="isAllItems && showMore" class="showMore" @click="showMore = false">{{ ctaText }}</div>
  </div>
</template>

<script>
import {ref, computed} from 'vue'

export default {
  name: "EpisodesCollection",
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    items: {
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
    ctaText: {
      type: String,
      default: 'показать все'
    },
    itemType: {
      type: String,
      required: true,
      validator(value) {
        return ['movie', 'person', 'episode', 'tv'].includes(value)
      }
    }
  },
  emits: ['goToItem'],

  setup(props) {
    const showMore = ref(true)

    const isAllItems = computed(() => props.items.length >= props.quantityDisplayedItems)

    const getErrorImgUrl = img => require('../assets/img/' + img)

    const getItemPosterImgUrl = item => {
      if (props.itemType === 'movie' || props.itemType === 'tv') return `https://image.tmdb.org/t/p/w342${item.poster_path}`
      if (props.itemType === 'person') return `https://image.tmdb.org/t/p/w342${item.profile_path}`
      if (props.itemType === 'episode') return `https://image.tmdb.org/t/p/w342${item.still_path}`
    }

    const getItemCaption = item => {
      if (props.itemType === 'movie') return item.title
      if (props.itemType === 'person' || props.itemType === 'tv') return item.name
      if (props.itemType === 'episode') return `Серия-${item.episode_number}. ${item.name}`
    }

    return {showMore, isAllItems, getErrorImgUrl, getItemPosterImgUrl, getItemCaption}
  }
}
</script>

