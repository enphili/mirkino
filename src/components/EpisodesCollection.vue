<template>
  <div class="full-width-row">
    <div class="short-description-title to-episode">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>

    <div class="collection-wrap">
      <q-card
        v-for="item in displayedItems"
        :key="item.id"
        :tmbd-id="item.id"
        class="collection-item q-pa-none"
        @click="$emit('goToItem', item)"
      >
        <q-img :src="getItemPosterImgUrl(item)" class="poster-img" @error="showErrorImg">
          <q-badge v-if="item.vote_average" align="top" color="accent" class="badge">TMDb: {{ item.vote_average }}</q-badge>
          <template v-slot:error>
            <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img" alt="error image"/>
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
import {useGetPosterUrl} from 'src/use/getPosterUrl'
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
    const getPosterUrl = useGetPosterUrl('https://image.tmdb.org/t/p/w342')

    const isImgError = ref(true)

    const isAllItems = computed(() => props.items.length >= props.quantityDisplayedItems)

    const displayedItems = computed(() => {
      return showMore.value ? props.items.slice(0, props.quantityDisplayedItems) : props.items
    })

    const getErrorImgUrl = img => {
      console.log(isImgError.value)
      if (isImgError.value) {
        require('../assets/img/' + img)
      }
      else {
          console.log('База данных TMDB заблокирована для России. Воспользуйтесь VPN')
      }
    }

    const getItemPosterImgUrl = item => {
      const paths = {
        movie: item.poster_path,
        tv: item.poster_path,
        person: item.profile_path,
        episode: item.still_path
      }
      return getPosterUrl(paths[props.itemType])
    }

    const getItemCaption = item => {
      const captions = {
        movie: item.title,
        person: item.name,
        tv: item.name,
        episode: `Серия-${item.episode_number}. ${item.name}`
      }
      return captions[props.itemType]
    }

    const showErrorImg = (evt) => {
      console.log(evt.type)
      isImgError.value = evt.type === 'error'
    }

    return {showMore, showErrorImg, isAllItems, displayedItems, getErrorImgUrl, getItemPosterImgUrl, getItemCaption}
  }
}
</script>

<style lang="sass" scoped>
.poster-img
  height: 192px
  width: 100%
.badge
  padding: 4px 8px
  border-radius: 0
</style>
