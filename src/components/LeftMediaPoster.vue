<template>
  <div class="left-row">
    <div class="poster-wrap">
      <q-img :src="posterUrl" class="rounded-borders poster-img">
        <template v-slot:error>
          <img :src="getErrorImgUrl(errorImgUrl)" class="unnamed-img"/>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftMediaPoster",
  props: {
    posterUrl: {type: String},
    errorImgUrl: {
      type: String,
      required: true
    }
  },

  setup() {
    const getErrorImgUrl = img => require('../assets/img/' + img)
    return {getErrorImgUrl}
  }
}
</script>

<style lang="sass">
.poster-img
  height: 279px
  max-width: 186px
</style>
