<template>
  <div class="official-data">
    <a
      v-if="trailers && trailers.length > 0"
      href="#" class="link-app trailer"
      @click.prevent="$emit('showTrailers')"
    >
      <q-icon
        name="play_circle_outline"
        style="font-size:2em;margin-right:5px;margin-top: -3px"
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
        style="font-size:2em;margin-right:5px;margin-top: -3px"
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

