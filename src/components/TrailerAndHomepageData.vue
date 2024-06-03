<template>
  <div class="official-data">
    <a
      v-if="trailers && trailers.length > 0"
      href="#" class="link-app trailer"
      @click.prevent="$emit('showTrailers')"
    >
      <q-icon
        name="play_circle_outline"
        class="trailer-icon"
      />
      {{ ctaTrailers }}
    </a>
    <a
      v-if="homepageUrl"
      :href="homepageUrl"
      class="link-app homepage"
      rel="noopener noreferrer nofollow"
      target="_blank">
      <q-icon
        name="language"
        class="trailer-icon"
      />
      {{ ctaHomepage }}
    </a>
  </div>
</template>

<script>
export default {
  name: "TrailerAndHomepageData",
  props: {
    trailers: {type: Array},
    ctaTrailers: {
      type: String,
      default: 'Смотреть трейлер'
    },
    homepageUrl: {type: String},
    ctaHomepage: {
      type: String,
      default: 'Официальный сайт'
    }
  },
  emits: ['showTrailers']
}
</script>

<style lang="sass">
.trailer-icon
  font-size: 2em
  margin-right: 5px
  margin-top: -3px
</style>
